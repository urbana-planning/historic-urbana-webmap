/**
 * Community Cycling Map JS
 * Author: Timothy Hodson
 ******************************************************************************/   
var index = 0;
var map;
var route; // global variable to hold the active route

var defaultStyle = {
    weight: 5,
    opacity: 0.65,
    color: '#FF5050',
};

/******************************************************************************/   
function newSection(id) 
{
    section = document.createElement('section');
    section.setAttribute('id', id);
    pane = document.getElementById("pane");
    pane.appendChild(section);
}
/******************************************************************************/   
function setActive() 
{

    var s = document.getElementsByTagName('section');
    s[index].className = s[index].className.replace("active","");

    if (index < s.length - 1) {
	++index;
	s[index].className += "active";
	if (route) {map.removeLayer(route);}
	route = routes[ s[index].id ];
	route.addTo(map);
	map.fitBounds(route.getBounds());
	
    } else {
	index = 0;
	s[index].className +="active";
    }
    
}
 
/******************************************************************************/   
function appendInfo(feature) 
{
    var title = document.createElement('h2');
    title.innerHTML = feature.properties.Name;
    var name = feature.properties.Name.toLowerCase();
    var id = name.replace(/\ /g,'_');
    
    // create and structure new section
    newSection(id);

    document.getElementById(id).appendChild(title);
    
    var desc = document.createElement('div');
    desc.setAttribute('class','desc')
    document.getElementById(id).appendChild(desc);

    var d_arrow = document.createElement('div');
    d_arrow.setAttribute('class','arrow-down');    
    document.getElementById(id).appendChild(d_arrow);

    var cues = document.createElement('div');
    cues.setAttribute('class', 'cues');
    document.getElementById(id).appendChild(cues); //switch below


    var to_ride = document.createElement('div');
    to_ride.setAttribute('class','to_ride');

    // populate cue sheet
    d3.csv('routes/' + id + '.csv', function(data) {

	var list = document.createElement('ul');
	for (i = 0; i < data.length; i++) {
	    li = document.createElement('li');
	    if (i == 0) {
		li.innerHTML = 'Leave from North Central Cyclery';
	    } else {
		li.innerHTML = data[i].Notes;
	    }
	    list.appendChild(li);	    
	}; 
	
	cues.appendChild(list)
	document.getElementById(id).appendChild(to_ride);
    });

    // parse ride description
    var text = feature.properties.Description;
    var ride_text = text.split('--');
    
    desc.innerHTML = '<p>' + ride_text[0] +'</p>';

    var ride_url = ride_text[1].match('http[\\S]*');
    ride_text[1] = ride_text[1].replace(ride_url,'<a class="ride_url" '+ 
				'onclick="event.stopPropagation();" href='+ 
				ride_url +
				'> Ride With GPS</a>');

    to_ride.innerHTML = '<p>' + ride_text[1] + '</p>';    
} 

/******************************************************************************/   	   
function onEachFeature(feature, layer) 
{
    layer.setStyle(defaultStyle);
    appendInfo(feature);
 
}
/******************************************************************************/   
window.onload = function () {

    if (window.location.protocol=="file:") {alert("must load page via http");}

    map = L.map('map-canvas', {
	center: [41.928816, -88.747989],
	zoom: 15,
	zoomControl: false,
	unloadInvisibleTiles: false
    });


    L.tileLayer('http://{s}.tiles.mapbox.com/v3/tohodson.i23bg13j/{z}/{x}/{y}.png').addTo(map);
	
    // route object allows for recycling name of geojson object
    routes = {};
    
    routes.south_east_gravel = new L.geoJson(south_east_gravel,
					     {onEachFeature: onEachFeature,});

    routes.gravel_west = new L.geoJson(gravel_west,
				       {onEachFeature: onEachFeature,});

    routes.north_east_pavement = new L.geoJson(north_east_pavement,
					       {onEachFeature: onEachFeature,});
    
    routes.paved_south_east = new L.geoJson(paved_south_east,
					       {onEachFeature: onEachFeature,});

    routes.clare_to_malta = new L.geoJson(clare_to_malta,
					       {onEachFeature: onEachFeature,});



    
    lc = L.control.locate({
	follow: true,
	position: 'bottomleft'
    }).addTo(map);
    
    map.on('startfollowing', function() {
	map.on('dragstart', lc.stopFollowing);
    }).on('stopfollowing', function() {
	map.off('dragstart', lc.stopFollowing);
    });    
   
}

