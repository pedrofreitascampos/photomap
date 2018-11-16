/*! Leaflet.Instagram 2014-06-26 */
function loadFile(file, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                return callback(rawFile.responseText);
            }
        }
    };
    return rawFile.send();
}

L.Instagram = L.FeatureGroup.extend({
    options: {
        icon: {
            iconSize: [3, 3],
            className: "leaflet-marker-instagram"
        },
        popup: {
            className: "leaflet-popup-instagram"
        },
        imageTemplate: '<a href="{link}" title="View on Instagram"><img src="{image_standard}"/></a><p>{caption}</a></p>',
        videoTemplate: '<a href="{link}" title="View on Instagram"><video autoplay controls poster="{image_standard}"><source src="{video_standard}" type="video/mp4"/></video></a><p>{caption}</a></p>',
        onClick: function(a) {
            var b = a.layer.image,
                c = this.options,
                d = c.imageTemplate;
            "video" === b.type && document.createElement("video").canPlayType("video/mp4; codecs=avc1.42E01E,mp4a.40.2") && (d = c.videoTemplate), a.layer.bindPopup(L.Util.template(d, b), c.popup).openPopup()
        },
        onHover: function(a) {
            var b = a.layer.image,
                c = this.options,
                d = c.imageTemplate;
            "video" === b.type && document.createElement("video").canPlayType("video/mp4; codecs=avc1.42E01E,mp4a.40.2") && (d = c.videoTemplate), a.layer.bindPopup(L.Util.template(d, b), c.popup).openPopup()
        }
    },
    initialize: function(a, b) {
        this._url = a, b = L.setOptions(this, b), L.FeatureGroup.prototype.initialize.call(this), b.onClick && this.on("click", b.onClick, this) && this.on('mouseover', b.onHover, this)
    },
    onAdd: function(a) {
        this.load(), L.FeatureGroup.prototype.onAdd.call(this, a)
    },
    load: function(a) {
        var b = this;
        return loadFile(this._url || a, function (a) {
            b._parse(JSON.parse(a) || JSON.parse(a).rows || []), b.fire("load", {
                data: a
            })
        }), this
    },
    _parse: function(a) {
        for (var b = 0, c = a.length; c > b; b++) {
            var d = a[b];
            try {
                this.addLayer(this._parseImage(d));
            }
            catch(e) {
                console.log('Error loading https://www.instagram.com/p/' + a[b].shortcode + "(" + e.message + ")"|| undefined);
                continue;
            }
        }
        return this
    },
    _parseImage: function(a) {
        if(a.is_video == true)
        {
            throw{
                 name: 'type error',
                 message: 'no videos supported'
                };
        }
        return {
            latitude: a.location.latitude,
            longitude: a.location.longitude,
            image_thumb: a.display_url,
            image_standard: a.display_url,
            caption: a.edge_media_to_caption.edges[0] ? a.edge_media_to_caption.edges[0].node.text || "" : "",
            type: a.__typename,
            video_standard: null,
            link: "https://www.instagram.com/p/" + a.shortcode,
            timestamp: a.taken_at_timestamp
        }
    },
    addLayer: function(a) {
        var b = L.marker([a.latitude, a.longitude], {
            icon: L.icon(L.extend({
                iconUrl: a.image_thumb
            }, this.options.icon)),
            title: a.caption || ""
        });
        b.image = a, L.FeatureGroup.prototype.addLayer.call(this, b)
    },
}), L.instagram = function(a, b) {
    return new L.Instagram(a, b)
};