faq_html = "<div id='faq' style='overflow:scroll' onclick=unShowFaq()><img src='assets/img/sejaondefor.jpg' width='100%' height='40%'><br><br><div class='question'><b>O que é o <a href=3D'http://sejaondefor.com'>sejaondefor.com</a>?</b></div>" +
    "<div><br></div>" +
    "<div>O <a href=3D'http://sejaondefor.com'>sejaondefor.com</a> é o mostruário ou expositor do " +
    "<a href='https://www.instagram.com/to.colante/'>to.colante</a> fornecendo a localização em mapa dos inúmeros" +
    " to.colantes que têm vindo a ser espalhados desde 2015." +
    "</div>" +
    "<div><br>" +
    "</div>" +
    "<div class='question'><b>Já agora o que é o to.colante?</b></div>" +
    "<div>" +
    "<br></div>" +
    "<div>O Benfica nasceu em Lisboa e desde sempre esteve aberto ao mundo. " +
    "   Partindo desta premissa, o to.colante nasce do amor incondicional pelo " +
    "Sport Lisboa e Benfica procurando e tendo o intuito de espalhar mística." +
    "</div>" +
    "<div><br>Partindo de uma lógica DIY (do it yourself), desde 2015 tem vindo a ser criados " +
    "inúmeros stickers - os autodenominados to.colantes, usando uma linguagem visual mista, " +
    "diversa mas acima de tudo positiva, de acordo com a história e valores do clube." +
    "</div>" +
    "<div><br>Com o intuito de chegar a mais pessoas (e a pedido de algumas famílias), " +
    "isto redundou igualmente na criação de uma pagina na rede social " +
    "<a href='https://www.instagram.com/to.colante/'>instagram</a>, onde para além de espalharmos a mística de " +
    "modo digital, difundimos algumas das colagens já efectuadas." +
    "</div>" +
    "<div><br></div>" +
    "<div class='question'><b>Ok ok...já percebi esse blá blá. Onde posso arranjar to.colantes?</b>" +
    "</div>" +
    "<div><br></div>" +
    "<div>Bom...de certeza que não os encontrarás numa loja. Mas na Luz, em dia de jogo, com certeza irás " +
    "encontrar alguém com to.colantes junto ao Manelito (roulote em" +
    "   Alto dos Moinhos). Uma vez lá e dado que o Manel não dá informações gratuitas, depois de pagares " +
    "uma cerveja ou o teu consumo, podes questioná-lo sobre onde poderá encontrar a &quot;malta " +
    "dos stickers&quot;. Ele indicará aonde estaremos. Na eventualidade de seres abstémio, " +
    "estares em dieta de retenção de líquidos, ou simplesmente viveres longe da Luz, " +
    "podes entrar em contacto via mensagem (instagram ou <a href=mailto:info.tocolante@gmail.com'>info.tocolante@gmail.com</a>)." +
    "</div>" +
    "<div><br></div>" +
    "<div class='question'><b>Como posso ter to.colantes cola" +
    "   dos por mim publicados aqui na página?</b>" +
    "</div>" +
    "<div><br></div>" +
    "<div>" +
    "   Conhecer o tipo que gere isto ou alguém que conheça esse tipo e " +
    "pagar-lhe umas cervejas (vide acima onde) é sempre uma boa táctica. " +
    "   Caso isso não seja possível (ou não queiras) podes sempre enviar as fotos para " +
    "<a href=3D'mailto:info.tocolante@gmail.com'>info.tocolante@gmail.com</a> . " +
    "Desde que enquadradas na temática, todas as imagens " +
    "   são bem vindas (com ou sem cerveja envolvida). Indicar a localização das ditas " +
    "fotos era igualmente simpático. :)" +
    "</div>" +
    "<div><br></div>" +
    "<div class='question'><b>Existe mesmo um Tó?</b></div>" +
    "   <div><br></div>" +
    "   <div>Sim e com o nome completo António José Conceição Oliveira " +
    "- mais conhecido por Toni. E para quem escreve estas linhas, " +
    "   é um dos Senhores Benfica. Mística no seu estado mais puro." +
    "</div></div>"

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

function showFaq() {
    var el = document.createElement('faq');
    //el.setAttribute('id', 'ifrm');
    //el.setAttribute('src', 'faq.html');
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
