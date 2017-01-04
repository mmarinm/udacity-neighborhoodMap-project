'use strict';

var bizList = ko.observableArray([]);
var map;
var infowindow;
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

// constructor function
var Restaurant = function(data){
  this.name = ko.observable(data.name);
  this.rating_img = data.rating_img_url_small;
  this.rating = data.rating;
  this.categorie = data.categories[0][0];
  this.address = data.location.address;
  this.postal_code = data.location.postal_code;
  this.city = data.location.city;
  this.phone = data.phone;
  this.url = data.url;
  this.lat = data.location.coordinate.latitude;
  this.long = data.location.coordinate.longitude;
  this.marker = createMarker(this);
};

//get data from yelp
var getYelpData = function() {
  // Uses the oauth-signature package installed with npm https://github.com/bettiolo/oauth-signature-js

  // Use the GET method for the request
  var httpMethod = 'GET';

  // Yelp API request url
  var yelpURL = 'https://api.yelp.com/v2/search/';

  // nonce generator
  var nonce = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  // Set required parameters for authentication & search
  var parameters = {
    oauth_consumer_key: 'b8gVZVpLRVnCU-vJ5EKQjg',
    oauth_token: '5ON_d5tuD3z-AD9aOp06I3caRGuHURnW',
    oauth_nonce: nonce(20),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb',
    term: "restaurants",
    location: 'Astoria, NY',
    limit: 30
  };

  // Set other API parameters
  var consumerSecret = 'CO49QSWhFiUobA5kvevikpdOBDk';
  var tokenSecret = '9gDyJlB6W-TSMarkzCUSW7e89lY';

  // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
  var signature = oauthSignature.generate(httpMethod, yelpURL, parameters, consumerSecret, tokenSecret);

  // Add signature to list of parameters
  parameters.oauth_signature = signature;

  // Set up the ajax settings
  var ajaxSettings = {
    url: yelpURL,
    data: parameters,
    cache: true,
    dataType: 'jsonp',
    success: function(response) {
      // Update the infoWindow to display the yelp rating image
      response.businesses.forEach(function(biz){
        bizList.push(new Restaurant(biz));
      });
    },
    error: function() {
      alert('Data could not be retrieved from yelp.');
    }
  };
  // Send off the ajax request to Yelp
  $.ajax(ajaxSettings);
};


// initialize the map
function initMap() {
  getYelpData();
  //starting position for the map
  var pin1 = {lat: 40.7634, lng: -73.9190};
  map = new google.maps.Map(document.getElementById('map'), {
    center: pin1,
    styles: styles,
    mapTypeControl: false,
    zoom: 14
  });
  infowindow = new google.maps.InfoWindow();
}

function createMarker(place) {
  var placeLoc = new google.maps.LatLng(place.lat, place.long);
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  return marker;
}

var viewModel = function(){
  var self = this;
  //store filtering query
  self.currentFilter = ko.observable('');
  self.menuIsVisible = ko.observable(false);

// this function takes care of opening info windows
  self.showInfo = function (placeItem) {
    //populate the info window with ajax data
    infowindow.setContent(
      '<div class="gm-style-iw">' +
      '<div class = "title full-width">' + '<h3 class = "business-title">' + placeItem.name() + '</h3>' + '</div>' +
      '<div class ="business-rating"><img src="' + placeItem.rating_img + '">'+ '<span> (' + placeItem.rating + ')</span></div>' +
      '<div class = "business-type">' + placeItem.categorie + '</div>' +
      '<div class = "address-label label">Address:</div>' +
      '<div class = "business-address">' + placeItem.address + ', ' + placeItem.postal_code + ' ' + placeItem.city + '</div>' +
      '<div class = "phone-label label">Phone: </div>' +
      '<div class = "business-phone">' + placeItem.phone + '</div>' +
      '<div class = "business-url"><a target="_blank" href = "' +  placeItem.url + '">' + 'Find out more' + "</a></div>" +
      '</div>'
    );

    //open ifo window
    infowindow.open(map, placeItem.marker);

    //bounce marker
    setTimeout( function() {placeItem.marker.setAnimation(null); }, 1000);
    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);

  };

  self.hideMenu = function(){
    if(self.menuIsVisible() === false){
      self.menuIsVisible(true);
    } else{
      self.menuIsVisible(false);
    }
  };

  self.filterMarkers = ko.computed(function () {
      if (!self.currentFilter()) {
        bizList().forEach(function(biz){
          biz.marker.setVisible(true);
          //attach click events on each marker
          google.maps.event.addListener(biz.marker,'click', function() {
            self.showInfo(biz);
          });
        });
        return bizList();
      } else {
          return ko.utils.arrayFilter(bizList(), function (biz) {
            biz.marker.setVisible(false);
            if(biz.name().toLowerCase().search(self.currentFilter().toLowerCase()) >= 0){
              biz.marker.setVisible(true);
              return true;
            }
          });
      }
  });
};

 ko.applyBindings(new viewModel());