// Requires that leaflet and leaflet.instagram are loaded on global "L"

faq_html =
    "<div id='faq' style='overflow-y:scroll' onclick=unShowFaq()>" +
        "<img src='assets/img/sejaondefor.jpg' width='100%' height='40%'>" +
        "<br><br>" +
        "<div class='question'>" +
            "O que é o <a href='http://www.sejaondefor.com'>sejaondefor.com</a>?" +
        "</div>" +
        "<br>" +
        "<div>" +
            "O <a href='http://www.sejaondefor.com'>sejaondefor.com</a> é o mostruário ou expositor do " +
            "<a href='https://www.instagram.com/to.colante/'>to.colante</a> fornecendo a localização em " +
            "mapa dos inúmeros to.colantes que têm vindo a ser espalhados desde 2015." +
        "</div><br>" +
        "<br>" +
        "<div class='question'>" +
            "Já agora o que é o to.colante?" +
        "</div>" +
        "<br>" +
        "<div>" +
            "O Benfica nasceu em Lisboa e desde sempre esteve aberto ao mundo. " +
            "Partindo desta premissa, o to.colante nasce do amor incondicional pelo " +
            "Sport Lisboa e Benfica procurando e tendo o intuito de espalhar mística." +
        "</div>" +
        "<br>" +
        "<div>" +
            "Partindo de uma lógica DIY (do it yourself), desde 2015 tem vindo a ser criados " +
            "inúmeros stickers - os autodenominados to.colantes, usando uma linguagem visual mista, " +
            "diversa mas acima de tudo positiva, de acordo com a história e valores do clube." +
        "</div>" +
        "<br>" +
        "<div>" +
            "Com o intuito de chegar a mais pessoas (e a pedido de algumas famílias), " +
            "isto redundou igualmente na criação de uma pagina na rede social " +
            "<a href='https://www.instagram.com/to.colante/'>instagram</a>, onde para além de espalharmos " +
            "a mística de modo digital, difundimos algumas das colagens já efectuadas." +
        "</div>" +
        "<br>" +
        "<div class='question'>" +
            "Ok ok...já percebi esse blá blá. Onde posso arranjar to.colantes?" +
        "</div>" +
        "<br>" +
        "<div>" +
            "Bom...de certeza que não os encontrarás numa loja. Mas na Luz, em dia de jogo, com certeza irás " +
            "encontrar alguém com to.colantes junto ao Manelito (roulote em Alto dos Moinhos). " +
            "Uma vez lá e dado que o Manel não dá informações gratuitas, depois de pagares " +
            "uma cerveja ou o teu consumo, podes questioná-lo sobre onde poderá encontrar a &quot;malta " +
            "dos stickers&quot;. Ele indicará aonde estaremos. Na eventualidade de seres abstémio, " +
            "estares em dieta de retenção de líquidos, ou simplesmente viveres longe da Luz, " +
            "podes entrar em contacto via mensagem (instagram ou " +
            "<a href=mailto:info.tocolante@gmail.com'>info.tocolante@gmail.com</a>)." +
        "</div>" +
        "<br>" +
        "<div class='question'>" +
            "Como posso ter to.colantes colados por mim publicados aqui na página?" +
        "</div>" +
        "<br>" +
        "<div>" +
            "Conhecer o tipo que gere isto ou alguém que conheça esse tipo e " +
            "pagar-lhe umas cervejas (vide acima onde) é sempre uma boa táctica. " +
            "Caso isso não seja possível (ou não queiras) podes sempre enviar as fotos para " +
            "<a href=3D'mailto:info.tocolante@gmail.com'>info.tocolante@gmail.com</a> . " +
            "Desde que enquadradas na temática, todas as imagens " +
            "são bem vindas (com ou sem cerveja envolvida). Indicar a localização das ditas " +
            "fotos era igualmente simpático. :)" +
        "</div>" +
        "<br>" +
        "<div>" +
            "No futuro, poderás também enviar as tuas fotos via um botão aqui no site!" +
        "</div>" +
        "<br>" +
        "<div class='question'>" +
            "Existe mesmo um Tó?</div>" +
        "<br>" +
        "<div>" +
            "Sim e com o nome completo António José Conceição Oliveira - mais conhecido por Toni. " +
            "E para quem escreve estas linhas, é um dos Senhores Benfica. Mística no seu estado mais puro." +
        "</div>" +
    "</div>";

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
    if (zoom < 6) return 3;
    else if (zoom >= 6 && zoom < 10) return 13;
    else if (zoom >= 10) return 25;
}


function load_map_tiles(token){
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.pencil',
        accessToken: token
        }
    ).addTo(mymap);
}

function showFaq() {
    var el = document.createElement('faq');
    el.innerHTML = faq_html;
    document.body.appendChild(el);
    el = document.getElementById('faq_button');
    el.style.visibility = 'hidden';
}

function unShowFaq() {
    var el = document.getElementById('faq');
    el.parentNode.removeChild(el);
    el = document.getElementById('faq_button');
    el.style.visibility = 'visible';

}

var mymap = L.map('mapid').setView([38.752678, -9.184681], 3);
mymap.options.minZoom = 3;
retrieveToken('access-token-mapbox.txt', load_map_tiles);
L.instagram('assets/db/to.colante.json').addTo(mymap);

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
