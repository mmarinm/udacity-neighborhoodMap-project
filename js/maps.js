var map;
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


// var Businesses = function(data){
//   this.name = ko.observable(data.name);
//   this.rating_img = ko.observable(data.rating_img_url_small);
//   this.rating = ko.observable(data.rating);
//   this.categorie = ko.observable(data.categories[0][0]);
//   this.address = ko.observable(data.location.address);
//   this.postal_code = ko.observable(data.location.postal_code);
//   this.city = ko.observable(data.location.city);
//   this.phone = ko.observable(data.phone);
//   this.url = ko.observable(data.url);
// }


// initialize the map
function initMap() {

  //starting position for the maps
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
  // console.log(place);
  var placeLoc = new google.maps.LatLng(place.location.coordinate.latitude, place.location.coordinate.longitude);
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });


  google.maps.event.addListener(marker, 'click', function() {
    var self = this;
    setTimeout( function() {self.setAnimation(null); }, 1000);
    self.setAnimation(google.maps.Animation.BOUNCE);
    infowindow.setContent(
      '<div class="gm-style-iw">' +
      '<div class = "title full-width">' + '<h3 class = "business-title">' + place.name + '</h3>' + '</div>' +
      '<div class ="business-rating"><img src="' + place.rating_img_url_small + '">'+ '<span> (' + place.rating + ')</span></div>' +
      '<div class = "business-type">' + place.categories[0][0] + '</div>' +
      '<div class = "address-label label">Address:</div>' +
      '<div class = "business-address">' + place.location.address + ', ' + place.location.postal_code + ' ' + place.location.city + '</div>' +
      '<div class = "phone-label label">Phone: </div>' +
      '<div class = "business-phone">' + place.phone + '</div>' +
      '<div class = "business-url"><a href = "' +  place.url + '">' + 'Find out more' + "</a></div>" +
      '</div>'
    );
    infowindow.open(map, this);
  });
}

//get data from yelp API
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
            createMarker(biz);
        })
      },
      error: function() {
        console.log('Data could not be retrieved from yelp.');
      }
    };

    // Send off the ajax request to Yelp
    $.ajax(ajaxSettings);
  };

getYelpData();

// var viewModel = function(){
//   var self = this;

//   this.bizList = ko.observableArray([]);

//   this.init =
// }

// ko.applyBindings(new viewModel());
