/**
 * Historic Urbana Map 
 * Author: Timothy Hodson
 ******************************************************************************/   
function makeTip( feature ) {

    var title = feature.title;
    // modal code
    // tooltip code
    var html = "<img class='sepia page-curl shadow-bottom' src=" + feature.properties.images[0] + ">" + 
        "<br/>" + 
            "<h2>" + feature.properties.title + "</h2>" +
            "<table> <tr> <th>Architect:</th> <td>" + feature.properties.architect + "</td> </tr>" +
            "<tr> <th>Year Built:</th> <td>" + feature.properties.built + "</td> </tr>" +
            "<tr> <th>Style:</th> <td>" + feature.properties.style + "</td> </tr>" +
            "</table>"+
            "<a align='center' class='modal-link' data-toggle='modal' data-target='#myModal' href='#myModal'>- More info -</a>";
   
    return html; 
}


function updateModal(feature) {

    $('#myModal .modal-header').html('<h2>' + feature.properties.title + '</h2>');
    $('#myModal .modal-body').load('modals/' + feature.properties.id);

}

function onEachFeature( feature, layer) {
    layer.on({
        click: updateModal
    });
}
var greenIcon = L.icon({
        iconUrl: 'img/pushpin2.svg',
        iconSize: [35,33] //   [18, 18]
});

function pointToLayer(feature, latlng) {
    var marker = L.marker(latlng, {icon: greenIcon});
    marker.bindPopup(makeTip(feature)); 
    return marker;
}

/******************************************************************************/   
/*window.onload = function () {*/
$(document).ready( function () {

    if (window.location.protocol=="file:") {alert("must load page via http");}
    L.mapbox.accessToken = 
    'pk.eyJ1IjoidG9ob2Rzb24iLCJhIjoiY2llcHE3aGIwMDAwdmE1a3Q1ZzhiNTBwYiJ9.0_l-zvcvr0SrwNDwhoyl8w';

    var map = L.mapbox.map('map-canvas', 'tohodson.55f8ddb6', {
        // the options here prevent mouse wheel or trackpad scrolling
        zoom: 15,
	    center: [40.1097, -88.2042]
    });//                 }).setView([38.8906,-77.01313], 12);

    var featureLayer = L.mapbox.featureLayer()
        .loadURL('historic_places.geojson')
        .addTo(map);

    featureLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        marker.setIcon(L.icon({
            iconUrl: 'img/pushpin2.svg',
            iconSize: [35,33] 
            }));
        
        //marker.setIcon(L.icon(feature.properties.icon));
        var content = makeTip(feature); 
        marker.bindPopup(content);
    });

    featureLayer.on('click', function(e) {
        var feature = e.layer.feature;
        updateModal(feature);

    });

    var listings = $('#listings');

    featureLayer.eachLayer(function(locale) {
        // Shorten locale.feature.properties to just `prop` so we're not
        // writing this long form over and over again.
        var prop = locale.feature.properties;

        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';

        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.innerHTML = prop.title;


        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop.built;

        if (prop.phone) {
            details.innerHTML += ' &middot; ' + prop.phoneFormatted;
        }
    });
/*	
    // load GeoJSON from an external file
    $.getJSON("historic_places.geojson", function(data){
    // add GeoJSON layer to the map once the file is loaded
        //define marker here
        L.geoJson(data, {
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature
        }).addTo(map);
    }); //end of getJSON
   */ 
}); // end of ready()
   

