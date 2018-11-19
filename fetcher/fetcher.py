import argparse
import boto3
from bson import json_util
import configparser
import io
import logging
import json
import os
import pymongo
import requests
import time
import urllib

logging.basicConfig(level=logging.DEBUG)


def create_db_connector(url):
    client = pymongo.MongoClient(url)
    return client.tocolante


def extract_bucket_name(bucket_url):
    return os.path.basename(os.path.normpath(bucket_url))


def extract_shortcode(link):
    return link.split('/')[-2]


def upload_db_to_s3(db, bucket_name):
    try:
        filename = 'metadata/to.colante.json'
        s3 = boto3.resource('s3')
        s3.Object(bucket_name, f'{filename}_{int(time.time())}').copy_from(
            CopySource=f'{bucket_name}/{filename}')
        s3.Object(bucket_name, filename).put(
            Body=json.dumps(list(db.media.find({})), default=json_util.default))
        logging.debug(f'Writing({filename}) to {bucket_name}')
    except Exception as e:
        logging.error(e)


def upload_remote_media_to_s3(url, bucket_name, shortcode):
    try:
        s3 = boto3.resource('s3')
        key = url.split('/')[-1]
        file_object = urllib.request.urlopen(url)  # 'Like' a file object
        fp = io.BytesIO(file_object.read())  # Wrap object
        s3.Object(bucket_name, key).put(Body=fp, Metadata={'shortcode': shortcode})
        logging.debug(f'Writing({url}) to {bucket_name}')
    except Exception as e:
        logging.error(e)


def create_s3_display_url(post, bucket_url):
    if post['type'] == 'video':
        key = post['images']['standard_resolution']['url'].split('.mp4')[0].split('/')[-1] + '.mp4'
        logging.debug(f'Found video @ {media["shortcode"]}')
    else:
        key = post['images']['standard_resolution']['url'].split('.jpg')[0].split('/')[-1] + '.jpg'

    return bucket_url + key


def create_new_db_entry(post, bucket_url):
    new_entry = {
        'shortcode': extract_shortcode(post.get('link')),
        'display_url': create_s3_display_url(post, bucket_url),
        'is_video': post.get('type') == 'video',
        'taken_at_timestamp': post.get('created_time'),
        'edge_media_to_caption': {'edges': [{'node': {'text': post['caption']['text']}}]},
        '__typename': post.get('type'),
    }

    if 'location' in post:
        if 'latitude' in post['location'] and 'longitude' in post['location']:
            new_entry['location'] = post['location']
        else:
            print('Could not find location, not setting')  # NOTIFY
            # find location from queues if they exist
    else:
        print('Could not find location, not setting')  # NOTIFY
        # find location from queues if they exist

    return new_entry


def load_latest_from_instagram(url):
    # loads last 20 regardless, API is shit
    r = requests.get(url)
    r.raise_for_status()
    return r.json()['data']


def refresh_db(db, bucket_url, instagram_url):
    posts = load_latest_from_instagram(instagram_url)
    for post in posts:
        shortcode = extract_shortcode(post['link'])
        if list(db.media.find({'shortcode': shortcode})):
            logging.debug(f'{shortcode} already in DB, skipping...')
            continue
        else:
            new_entry = create_new_db_entry(post, bucket_url)
            upload_remote_media_to_s3(post['images']['standard_resolution']['url'],
                                      extract_bucket_name(bucket_url),
                                      shortcode)
            logging.debug(new_entry)
            db.media.insert_one(new_entry)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Instagram media fetcher')
    parser.add_argument('--config', '-c',
                        help='Config file to use',
                        dest='config',
                        type=str,
                        default='fetcher.ini')
    args = parser.parse_args()

    config = configparser.ConfigParser()
    config.read(args.config)

    bucket_url = config['S3']['bucket_url']
    instagram_url = f'{config["INSTAGRAM"]["URL"]}?access_token={config["INSTAGRAM"]["access_token"]}'

    db = create_db_connector(config['DB']['url'])
    refresh_db(db, bucket_url, instagram_url)
    upload_db_to_s3(db, extract_bucket_name(bucket_url))
