#!/usr/bin/env python3
"""
Fetches geotagged posts from @to.colante on Instagram and updates docs/data.json
and docs/thumbs/ for the GitHub Pages site.

Run manually:  python fetcher/fetch.py
In CI:        set INSTAGRAM_USER / INSTAGRAM_PASS env vars for more reliable access
"""
import io
import json
import os
import sys
import time
from pathlib import Path

import instaloader
import requests
from PIL import Image

PROFILE_NAME = "to.colante"
DATA_FILE = Path("docs/data.json")
THUMBS_DIR = Path("docs/thumbs")
THUMB_SIZE = (200, 200)


def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    return []


def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def download_thumb(url, shortcode):
    path = THUMBS_DIR / f"{shortcode}.jpg"
    if path.exists():
        return f"thumbs/{shortcode}.jpg"
    resp = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    img = Image.open(io.BytesIO(resp.content))
    img.thumbnail(THUMB_SIZE, Image.LANCZOS)
    if img.mode != "RGB":
        img = img.convert("RGB")
    img.save(path, "JPEG", quality=85, optimize=True)
    return f"thumbs/{shortcode}.jpg"


def main():
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    data = load_data()
    existing = {e["shortcode"] for e in data}

    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        quiet=False,
    )

    username = os.environ.get("INSTAGRAM_USER")
    password = os.environ.get("INSTAGRAM_PASS")
    if username and password:
        print(f"Logging in as {username}")
        L.login(username, password)

    try:
        profile = instaloader.Profile.from_username(L.context, PROFILE_NAME)
    except Exception as e:
        print(f"Could not load profile (Instagram may be blocking this IP): {e}")
        print("Tip: add INSTAGRAM_USER / INSTAGRAM_PASS secrets to authenticate.")
        sys.exit(0)  # exit cleanly so CI doesn't go red
    new_count = 0

    for post in profile.get_posts():
        if post.shortcode in existing:
            # Posts come newest-first; once we hit one we already have, we're done
            print(f"  {post.shortcode} already saved, stopping.")
            break

        loc = post.location
        if not loc or loc.lat is None or loc.lng is None:
            print(f"  {post.shortcode} has no GPS location, skipping.")
            continue

        print(f"  Fetching {post.shortcode} @ {loc.lat},{loc.lng}")
        try:
            thumb = download_thumb(post.url, post.shortcode)
        except Exception as e:
            print(f"  Failed thumbnail for {post.shortcode}: {e}")
            continue

        data.insert(0, {
            "shortcode": post.shortcode,
            "lat": loc.lat,
            "lng": loc.lng,
            "caption": (post.caption or "").split("\n")[0][:200],
            "date": post.date_utc.strftime("%Y-%m-%d"),
            "thumb": thumb,
        })
        existing.add(post.shortcode)
        new_count += 1
        time.sleep(2)  # be polite to Instagram

    save_data(data)
    print(f"\nDone. Added {new_count} new posts. Total: {len(data)}")


if __name__ == "__main__":
    main()
