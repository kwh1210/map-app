var map;
var markers = [];
var polygon = null;
var placeMarkers = [];

var style = [{
  "featureType": "all",
  "elementType": "geometry.fill",
  "stylers": [{
    "weight": "2.00"
  }]
}, {
  "featureType": "all",
  "elementType": "geometry.stroke",
  "stylers": [{
    "color": "#9c9c9c"
  }]
}, {
  "featureType": "all",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [{
    "color": "#f2f2f2"
  }]
}, {
  "featureType": "landscape",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#ffffff"
  }]
}, {
  "featureType": "landscape.man_made",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#ffffff"
  }]
}, {
  "featureType": "poi",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "road",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "lightness": 45
  }]
}, {
  "featureType": "road",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#eeeeee"
  }]
}, {
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#7b7b7b"
  }]
}, {
  "featureType": "road",
  "elementType": "labels.text.stroke",
  "stylers": [{
    "color": "#ffffff"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "all",
  "stylers": [{
    "visibility": "simplified"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "labels.icon",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "transit",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "water",
  "elementType": "all",
  "stylers": [{
    "color": "#46bcec"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "water",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#c8d7d4"
  }]
}, {
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#070707"
  }]
}, {
  "featureType": "water",
  "elementType": "labels.text.stroke",
  "stylers": [{
    "color": "#ffffff"
  }]
}];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7413549,
      lng: -73.9980244
    },
    zoom: 13,
    mapTypeControl: false,
    styles: style
  });
  var timeAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search-within-time-text'));
  timeAutocomplete.bindTo('bounds', map);
  for (var i = 0; i < model.locations.length; i++) {
    var position = model.locations[i].location;
    var title = model.locations[i].title;
    var description = model.locations[i].description;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      description: description,
      animation: google.maps.Animation.BOUNCE,
      id: i
    });
    markers.push(marker);
  }

  ko.applyBindings(new ViewModel);
}