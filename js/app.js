var bizList = ko.observableArray([]);
var map;
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

// function Restaurant(data){
//   this.name = data.name;
//   this.rating_img = data.rating_img_url_small;
//   this.rating = data.rating;
//   this.categorie = data.categories[0][0];
//   this.address = data.location.address;
//   this.postal_code = data.location.postal_code;
//   this.city = data.location.city;
//   this.phone = data.phone;
//   this.url = data.url;
//   this.lat = data.location.coordinate.latitude;
//   this.long = data.location.coordinate.longitude;
// }

var Restaurant = function(data){
  this.name = ko.observable(data.name);
  this.rating_img = ko.observable(data.rating_img_url_small);
  this.rating = ko.observable(data.rating);
  this.categorie = ko.observable(data.categories[0][0]);
  this.address = ko.observable(data.location.address);
  this.postal_code = ko.observable(data.location.postal_code);
  this.city = ko.observable(data.location.city);
  this.phone = ko.observable(data.phone);
  this.url = ko.observable(data.url);
  this.lat = ko.observable(data.location.coordinate.latitude);
  this.long = ko.observable(data.location.coordinate.longitude);
  this.marker = ko.observable(createMarker(this));
}

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
      })
    },
    error: function() {
      console.log('Data could not be retrieved from yelp.');
    }
  };

  // Send off the ajax request to Yelp
  $.ajax(ajaxSettings);
};


// initialize the map
function initMap() {
  getYelpData()
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
  var placeLoc = new google.maps.LatLng(place.lat(), place.long());
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  // add event listener that crates animation and infowidow on clik
  google.maps.event.addListener(marker,'click', function() {
    var self = this;
    setTimeout( function() {self.setAnimation(null); }, 1000);
    self.setAnimation(google.maps.Animation.BOUNCE);
    infowindow.setContent(
      '<div class="gm-style-iw">' +
      '<div class = "title full-width">' + '<h3 class = "business-title" data-bind="text: name">' + place.name() +'</h3>' + '</div>' +
      '<div class ="business-rating"><img src="' + place.rating_img() + '">'+ '<span> (' + place.rating() + ')</span></div>' +
      '<div class = "business-type">' + place.categorie() + '</div>' +
      '<div class = "address-label label">Address:</div>' +
      '<div class = "business-address">' + place.address() + ', ' + place.postal_code() + ' ' + place.city() + '</div>' +
      '<div class = "phone-label label">Phone: </div>' +
      '<div class = "business-phone">' + place.phone() + '</div>' +
      '<div class = "business-url"><a href = "' +  place.url() + '">' + 'Find out more' + "</a></div>" +
      '</div>'
    );
    infowindow.open(map, this);
  }

  );

  return marker;
}

var displayInfoWindow = function(marker, biz) {
  setTimeout( function() {marker.setAnimation(null); }, 1000);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  infowindow.setContent(
    '<div class="gm-style-iw">' +
    '<div class = "title full-width">' + '<h3 class = "business-title" data-bind="text: name">' + biz.name() +'</h3>' + '</div>' +
    '<div class ="business-rating"><img src="' + biz.rating_img() + '">'+ '<span> (' + biz.rating() + ')</span></div>' +
    '<div class = "business-type">' + biz.categorie() + '</div>' +
    '<div class = "address-label label">Address:</div>' +
    '<div class = "business-address">' + biz.address() + ', ' + biz.postal_code() + ' ' + biz.city() + '</div>' +
    '<div class = "phone-label label">Phone: </div>' +
    '<div class = "business-phone">' + biz.phone() + '</div>' +
    '<div class = "business-url"><a href = "' +  biz.url() + '">' + 'Find out more' + "</a></div>" +
    '</div>'
  );
  infowindow.open(map, marker);
}

var visualEffects = function(){
    var menu = $('#menu');
    var menubtn = $('#menu-btn');
    var menuimg = $('#menu-img');



    menubtn.click(function(event) {
        /* Act on the event */
        $(menu).addClass('hide');
    });

    menuimg.click(function(event) {
        /* Act on the event */
        $(menu).removeClass('hide');
    });
}


var viewModel = function(){
  visualEffects();
  var self = this;

  self.currentFilter = ko.observable(''); // property to store the filter

  self.displayInfoWindow = ko.computed(function() {

  })

  self.filterMarkers = ko.computed(function () {
      if (!self.currentFilter()) {
        bizList().forEach(function(biz){
          biz.marker().setVisible(true);
        })
        return bizList();
      } else {
          return ko.utils.arrayFilter(bizList(), function (biz) {
            // console.log(self.currentFilter().toLowerCase());
            // console.log(biz.name().toLowerCase());biz.marker().setVisible(false);
            biz.marker().setVisible(false);
            if(biz.name().toLowerCase().search(self.currentFilter().toLowerCase()) >= 0){
              biz.marker().setVisible(true);
              return true
            }
          });
      }
  });

}

 ko.applyBindings(new viewModel());