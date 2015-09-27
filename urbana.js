/**
 * Historic Urbana Map 
 * Author: Timothy Hodson
 ******************************************************************************/   
function makeTip( feature ) {

    var title = feature.title;
    // modal code
    // tooltip code
    var html = "<img class='sepia page-curl shadow-bottom' src=" + feature.properties.image + ">" + 
        "<br/>" +
            "<h2>" + feature.properties.title + "</h2>" +
            "<table id='tooltip'> <tr> <th>Architect:</th> <td>" + feature.properties.architect + "</td> </tr>" +
            "<tr> <th>Built:</th> <td>" + feature.properties.built + "</td> </tr>" +
            "<tr> <th>Style:</th> <td>" + feature.properties.style + "</td> </tr>" +
            "</table> <div class='tooltip-footer'>" +
            "<a align='center' class='modal-link' data-toggle='modal' data-target='#myModal' href='#myModal'>- More info -</a>" +
            "</div>";
    return html; 
}


function updateModal(feature) {

    $('#myModal .modal-title').text(feature.properties.title);
    $('#myModal .modal-body').load('modals/' + feature.properties.id, function() {
        $('.slider').slick({
             dots: true,
             lazyLoad: 'ondemand',
             infinite: true,
             speed: 300,
             slidesToShow: 1,
             variableWidth: true,
             centerMode: true,
        });
    });
}

function onEachFeature( feature, layer) {
    layer.on({
        click: updateModal
    });
}
var pushpinIcon = L.icon({
        iconUrl: 'img/pushpin2.svg',//'img/pushpin2.svg',
        iconSize: [22, 22],
});

function genListings(map,featureLayer) {
        var listings = $('#listings');
        listings.empty();
        featureLayer.eachLayer(function(locale) {
            
            var prop = locale.feature.properties;
            item = $('#listings').append(document.createElement("div"))
                          .children()
                          .last("div")
                          .addClass('item')
            var link = $('<a href=#>' + prop.title + '</a>').addClass('addr')
            item.append(link);
            
            //item.append('<p>' + prop.style + '<p>'); 

            link.click( function() {
                map.setView(locale.getLatLng(), 16);
                locale.openPopup();
                updateModal(locale.feature);
            });

        });
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
	    center: [40.1097, -88.2042],
        minZoom: 15,
        maxZoom: 19,
    });//                 }).setView([38.8906,-77.01313], 12);

    var featureLayer = L.mapbox.featureLayer()
        .loadURL('historic_places.geojson')
        .addTo(map);

    featureLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        marker.setIcon(pushpinIcon)
        
        //marker.setIcon(L.icon(feature.properties.icon));
        var content = makeTip(feature); 
        marker.bindPopup(content);
    });

    $('#search').keyup(search);

    featureLayer.on('click', function(e) {
        var feature = e.layer.feature;
        map.setView(e.latlng);
        updateModal(feature);

    });

    featureLayer.on('ready', function() {
        var listings = $('#listings');

        featureLayer.eachLayer(function(locale) {
            
            var prop = locale.feature.properties;
            item = $('#listings').append(document.createElement("div"))
                          .children()
                          .last("div")
                          .addClass('item')
            var link = $('<a href=#>' + prop.title + '</a>').addClass('addr')
            item.append(link);
            
            //item.append('<p>' + prop.style + '<p>'); 

            link.click( function() {
                map.setView(locale.getLatLng(), 16);
                locale.openPopup();
                updateModal(locale.feature);
            });

        });
    });

function search() {
    // get the value of the search input field
    var searchString = $('#search').val().toLowerCase();

    featureLayer.setFilter(searchTitle)
    genListings(map,featureLayer); 
    // here we're simply comparing the 'state' property of each marker
    // to the search string, seeing whether the former contains the latter.
    function searchTitle(feature) {
        var title = feature.properties.title.toLowerCase().indexOf(searchString) !== -1;
        var arch = feature.properties.architect.toLowerCase().indexOf(searchString) !== -1;
        var style = feature.properties.style.toLowerCase().indexOf(searchString) !== -1;
        return (arch || title || style)
    }
}

    var bodyheight = $(document).height();
    $(".modal-body").css('height', bodyheight*0.7);

}); // end of ready()
   
// for the window resize
$(window).resize(function() {
    var bodyheight = $(document).height();
    $(".modal-body").css('height', bodyheight*0.7);

});
