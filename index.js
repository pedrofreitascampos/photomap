function retrieveToken(tokenFile, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", tokenFile, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
            return callback(rawFile.responseText);
            }
        }
    }
    return rawFile.send();
}

function load_map_tiles(token){
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.pencil',
        accessToken: token,
        }
    ).addTo(mymap);
}

function load_instagram_pictures(token){
    L.instagram('https://api.instagram.com/v1/users/5704639144/media/recent?count=33&access_token=' + token).addTo(mymap);
}

var mymap = L.map('mapid').setView([38.752678, -9.184681], 3);
retrieveToken('access-token-mapbox.txt', load_map_tiles)
retrieveToken('access-token-instagram.txt', load_instagram_pictures)

