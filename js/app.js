var arrRestaurants = [];

function Restaurant(data){
  this.name = data.name;
  this.rating_img = data.rating_img_url_small;
  this.rating = data.rating;
  this.categorie = data.categories[0][0];
  this.address = data.location.address;
  this.postal_code = data.location.postal_code;
  this.city = data.location.city;
  this.phone = data.phone;
  this.url = data.url;
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
        arrRestaurants.push(new Restaurant(biz));
      })
      console.log(arrRestaurants); //logs array of Restaurant Object
    },
    error: function() {
      console.log('Data could not be retrieved from yelp.');
    }
  };

  // Send off the ajax request to Yelp
  $.ajax(ajaxSettings);
};

console.log(arrRestaurants); // why array is empty
getYelpData();