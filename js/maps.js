var map;

// TODO: Complete the following function to initialize the map
function initMap() {
// TODO: use a constructor to create a new map JS object. You can use the coordinates
 var pin1 = {lat: 40.7595, lng: -73.9272};

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

 map = new google.maps.Map(document.getElementById('map'), {
   center: pin1,
   styles: styles,
   mapTypeControl: false,
   zoom: 15
 });

}

