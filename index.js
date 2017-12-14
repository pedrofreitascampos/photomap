// Requires that leaflet and leaflet.instagram are loaded on global "L"
function retrieveToken(tokenFile, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", tokenFile, true);

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

function changeIconSize(e) {

    // this is the default size (of the default icon); it should be known beforehand;
    var defaultIconSizeX = 1;
    var defaultIconSizeY = 1;

    var currentZoom = mymap.getZoom();
    var newIconSizeX = defaultIconSizeX * sizeFactor(currentZoom);
    var newIconSizeY = defaultIconSizeY * sizeFactor(currentZoom);

    // finally, declare a new icon and update the marker
    var newIcon = e.options.icon;
    newIcon.options.iconSize = [newIconSizeX, newIconSizeY];
    e.setIcon(newIcon);
}

function sizeFactor(zoom) {
    if (zoom < 6) return 1;
    else if (zoom >= 6 && zoom < 10) return 10;
    else if (zoom >= 10) return 25;
}


var benfica_light = "https://api.mapbox.com/styles/v1/pedcampo/cjb56118t1bxu2rmsdu2pblnn/tiles/256/{z}/{x}/{y}";
var benfica_banner = "https://api.mapbox.com/styles/v1/pedcampo/cjb6orkxz2sqf2spxmw3p3a8r/tiles/256/{z}/{x}/{y}";
var benfica_odyssey = "https://api.mapbox.com/styles/v1/pedcampo/cjb537i4219g02smqopxgpsx4/tiles/256/{z}/{x}/{y}";
var benfica_dark = "https://api.mapbox.com/styles/v1/pedcampo/cjb54jtel1agr2qr016zkyn84/tiles/256/{z}/{x}/{y}";
var moonlight = "https://api.mapbox.com/styles/v1/pedcampo/cjb546hdy1abz2rpmyzjz5ds6/tiles/256/{z}/{x}/{y}";
var odyssey = "https://api.mapbox.com/styles/v1/pedcampo/cjb5468hw1abf2sp6t4oj6890/tiles/256/{z}/{x}/{y}";
var vintage = "https://api.mapbox.com/styles/v1/pedcampo/cjb5465qa1abu2qmyhh4aijm4/tiles/256/{z}/{x}/{y}";
var style = moonlight;

function load_map_tiles(token){
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //L.tileLayer(style + '?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.pencil',
        accessToken: token
        }
    ).addTo(mymap);
}

var mymap = L.map('mapid').setView([38.752678, -9.184681], 3);
retrieveToken('access-token-mapbox.txt', load_map_tiles);
L.instagram('assets/to.colante/to.colante.json').addTo(mymap);

mymap.on('zoomend', function(){
    mymap.eachLayer(function (layer){
        if (typeof layer.options.icon === 'undefined' ? false : layer.options.icon.className === 'leaflet-marker-instagram'){
            layer.eachLayer(function (sublayer) {
                if (sublayer.options.icon) {
                    // sublayer has icon - resize
                    changeIconSize(sublayer);
                }
            });
        }

    });
});
