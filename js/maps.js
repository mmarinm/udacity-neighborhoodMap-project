var map;
var service;
//maps styles
var styles = [
   {
     featureType: 'water',
     stylers: [
       { color: '#19a0d8' }
     ]
   },{
     featureType: 'administrative',
     elementType: 'labels.text.stroke',
     stylers: [
       { color: '#ffffff' },
       { weight: 6 }
     ]
   },{
     featureType: 'administrative',
     elementType: 'labels.text.fill',
     stylers: [
       { color: '#e85113' }
     ]
   },{
     featureType: 'road.highway',
     elementType: 'geometry.stroke',
     stylers: [
       { color: '#efe9e4' },
       { lightness: -40 }
     ]
   },{
     featureType: 'transit.station',
     stylers: [
       { weight: 9 },
       { hue: '#e85113' }
     ]
   },{
     featureType: 'road.highway',
     elementType: 'labels.icon',
     stylers: [
       { visibility: 'off' }
     ]
   },{
     featureType: 'water',
     elementType: 'labels.text.stroke',
     stylers: [
       { lightness: 100 }
     ]
   },{
     featureType: 'water',
     elementType: 'labels.text.fill',
     stylers: [
       { lightness: -100 }
     ]
   },{
     featureType: 'poi',
     elementType: 'geometry',
     stylers: [
       { visibility: 'on' },
       { color: '#f0e4d3' }
     ]
   },{
     featureType: 'road.highway',
     elementType: 'geometry.fill',
     stylers: [
       { color: '#efe9e4' },
       { lightness: -25 }
     ]
   }
];

// initialize the map
function initMap() {

  //starting position for the maps
  var pin1 = {lat: 40.7595, lng: -73.9272};
  map = new google.maps.Map(document.getElementById('map'), {
    center: pin1,
    styles: styles,
    mapTypeControl: false,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();

  var request = {
    location: pin1,
    radius: '500',
    types: ['restaurant']
  };

  service =  new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}



function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}