/**
 * Historic Urbana Map 
 * Author: Timothy Hodson
 ******************************************************************************/   
var map;
function makeTip( feature ) {

    var title = feature.title;
    // modal code
    // tooltip code
    var html =  "<img class='sepia page-curl shadow-bottom' src=" + feature.properties.images[0] + ">" + 
                "<br/>" + 
                "<h2>" + feature.properties.title + "</h2>" +
                "<table> <tr> <th>Architect:</th> <td>" + feature.properties.architect + "</td> </tr>" +
                "<tr> <th>Year Built:</th> <td>" + feature.properties.built + "</td> </tr>" +
                "<tr> <th>Style:</th> <td>" + feature.properties.style + "</td> </tr>" +
                "</table>"+
                "<a class='modal-link' data-toggle='modal' data-target='#myModal'>Test</a>"
                "<button type='button' class='btn btn-info btn-lg' data-toggle='modal' data-target='#myModal'>Open Modal</button>";
    return html;   
}


function updateModal(e) {
    var feature = e.target.feature;
    $('.bxslider').empty(); 
    $.each(feature.properties.images, function(){
            $('.bxslider').append('<li><img src="' + this + '" /></li'); 
    });
    // $('#myModal .modal-images').html('<img src=' + feature.properties.images[0] + '>');

    $('#myModal .modal-header').html('<h2>' + feature.properties.title + '</h2>');
    $('#myModal .modal-body').empty();
    
    if (feature.properties.arch_desc != null) {
         $('#myModal .modal-body').append(
                '<h3>Architectural Description</h3>' +
                '<p>' + feature.properties.arch_desc + '</p>'
                );
    }

    if (feature.properties.hist_desc != null) {
        $('#myModal .modal-body').append(
                '<h3>Historical Description</h3>' +
                '<p>' + feature.properties.hist_desc + '</p>'
                );
    }
}

function onEachFeature( feature, layer) {
    layer.on({
        click: updateModal
    });
}

function pointToLayer(feature, latlng) {
    var marker = L.marker(latlng);
    marker.bindPopup(makeTip(feature)); 
    return marker;
}

/******************************************************************************/   
/*window.onload = function () {*/
$(document).ready( function () {

    if (window.location.protocol=="file:") {alert("must load page via http");}

    map = L.map('map-canvas', {
	    center: [40.1097, -88.2042],
	    zoom: 15,
	    zoomControl: true,
	    unloadInvisibleTiles: false
    });

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/tohodson.55f8ddb6/{z}/{x}/{y}.png').addTo(map);
	
    // load GeoJSON from an external file
    $.getJSON("historic_places.geojson", function(data){
    // add GeoJSON layer to the map once the file is loaded
        //define marker here
        L.geoJson(data, {
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature
        }).addTo(map);
    }); //end of getJSON
    
}); // end of ready()
   

