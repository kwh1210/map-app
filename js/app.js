var model = {

  locations : [
            {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393},description:'its iight'},
            {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465},description:'ttf time to fuck'},
            {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759},description:'aewfawefwaefits iight'},
            {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377},description:'its iight'},
            {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934},description:'its iifaeaweft'},
            {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237},description:'fuck ya'}
              ]

}


var ViewModel = function(){
  var self=this;
  this.map;
  // Create a new blank array for all the listing markers.
  this.markers = [];
  // This global polygon this.able is to ensure only ONE polygon is rendered.
  this.polygon = null;
  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  this.placeMarkers = [];
  function initMap() {
    // Create a styles array to use with the map.
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
      mapTypeControl: false
    });


/*
    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));
    // Bias the boundaries within the map for the zoom to area text.
    timeAutocomplete.bindTo('bounds', map);

    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < model.locations.length; i++) {
      // Get the position from the location array.
      var position = model.locations[i].location;
      var title = model.locations[i].title;
      var description = model.locations[i].description;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        description: description,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', function() {
      hideMarkers(markers);
    });

    document.getElementById('search-within-time').addEventListener('click', function() {
      searchWithinTime();
    });
    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.

*/

  }
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    
      innerHTML='<h1>' + marker.title + '</h1><br>';
      innerHTML+='<p>' + marker.description + '</p>'


      infowindow.setContent(innerHTML);
    
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }
  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  // This function will loop through the listings and hide them all.
  function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  // This function allows the user to input a desired travel time, in
  // minutes, and a travel mode, and a location - and only show the listings
  // that are within that travel time (via that travel mode) of the location
  function searchWithinTime() {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;
    // Check to make sure the place entered isn't blank.
    if (address == '') {
      window.alert('You must enter an address.');
    } else {
      hideMarkers(markers);
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      var origins = [];
      for (var i = 0; i < markers.length; i++) {
        origins[i] = markers[i].position;
      }
      var destination = address;
      var mode = document.getElementById('mode').value;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          displayMarkersWithinTime(response);
        }
      });
    }
  }
  // This function will go through each of the results, and,
  // if the distance is LESS than the value in the picker, show it on the map.
  function displayMarkersWithinTime(response) {
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        if (element.status === "OK") {
          // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
          // the function to show markers within a user-entered DISTANCE, we would need the
          // value for distance, but for now we only need the text.
          var distanceText = element.distance.text;
          // Duration value is given in seconds so we make it MINUTES. We need both the value
          // and the text.
          var duration = element.duration.value / 60;
          var durationText = element.duration.text;
          if (duration <= maxDuration) {
            //the origin [i] should = the markers[i]
            markers[i].setMap(map);
            atLeastOne = true;
            // Create a mini infowindow to open immediately and contain the
            // distance and duration
            var infowindow = new google.maps.InfoWindow({
              content: durationText + ' away, ' + distanceText
            });
            infowindow.open(map, markers[i]);
            // Put this in so that this small window closes if the user clicks
            // the marker, when the big infowindow opens
            markers[i].infowindow = infowindow;
            google.maps.event.addListener(markers[i], 'click', function() {
              this.infowindow.close();
            });
          }
        }
      }
    }
    if (!atLeastOne) {
      window.alert('We could not find any locations within that distance!');
    }
  }
}

ko.applyBindings(new ViewModel)


// var map;
// // Create a new blank array for all the listing markers.
// var markers = [];
// // This global polygon variable is to ensure only ONE polygon is rendered.
// var polygon = null;
// // Create placemarkers array to use in multiple functions to have control
// // over the number of places that show.
// var placeMarkers = [];
// function initMap() {
//   // Create a styles array to use with the map.
//   // Constructor creates a new map - only center and zoom are required.
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 40.7413549, lng: -73.9980244},
//     zoom: 13,
//     mapTypeControl: false
//   });
//   // This autocomplete is for use in the search within time entry box.
//   var timeAutocomplete = new google.maps.places.Autocomplete(
//       document.getElementById('search-within-time-text'));
//   // Bias the boundaries within the map for the zoom to area text.
//   timeAutocomplete.bindTo('bounds', map);

//   var largeInfowindow = new google.maps.InfoWindow();

//   // Style the markers a bit. This will be our listing marker icon.
//   var defaultIcon = makeMarkerIcon('0091ff');
//   // Create a "highlighted location" marker color for when the user
//   // mouses over the marker.
//   var highlightedIcon = makeMarkerIcon('FFFF24');
//   // The following group uses the location array to create an array of markers on initialize.
//   for (var i = 0; i < model.locations.length; i++) {
//     // Get the position from the location array.
//     var position = model.locations[i].location;
//     var title = model.locations[i].title;
//     var description = model.locations[i].description;
//     // Create a marker per location, and put into markers array.
//     var marker = new google.maps.Marker({
//       position: position,
//       title: title,
//       description: description,
//       animation: google.maps.Animation.DROP,
//       icon: defaultIcon,
//       id: i
//     });
//     // Push the marker to our array of markers.
//     markers.push(marker);
//     // Create an onclick event to open the large infowindow at each marker.
//     marker.addListener('click', function() {
//       populateInfoWindow(this, largeInfowindow);
//     });
//     // Two event listeners - one for mouseover, one for mouseout,
//     // to change the colors back and forth.
//     marker.addListener('mouseover', function() {
//       this.setIcon(highlightedIcon);
//     });
//     marker.addListener('mouseout', function() {
//       this.setIcon(defaultIcon);
//     });
//   }
//   document.getElementById('show-listings').addEventListener('click', showListings);
//   document.getElementById('hide-listings').addEventListener('click', function() {
//     hideMarkers(markers);
//   });

//   document.getElementById('search-within-time').addEventListener('click', function() {
//     searchWithinTime();
//   });
//   // Listen for the event fired when the user selects a prediction from the
//   // picklist and retrieve more details for that place.

// }
// // This function populates the infowindow when the marker is clicked. We'll only allow
// // one infowindow which will open at the marker that is clicked, and populate based
// // on that markers position.
// function populateInfoWindow(marker, infowindow) {
//   // Check to make sure the infowindow is not already opened on this marker.
//   if (infowindow.marker != marker) {
//     // Clear the infowindow content to give the streetview time to load.
//     infowindow.setContent('');
//     infowindow.marker = marker;
//     // Make sure the marker property is cleared if the infowindow is closed.
//     infowindow.addListener('closeclick', function() {
//       infowindow.marker = null;
//     });
  
//     innerHTML='<h1>' + marker.title + '</h1><br>';
//     innerHTML+='<p>' + marker.description + '</p>'


//     infowindow.setContent(innerHTML);
  
//     // Open the infowindow on the correct marker.
//     infowindow.open(map, marker);
//   }
// }
// // This function will loop through the markers array and display them all.
// function showListings() {
//   var bounds = new google.maps.LatLngBounds();
//   // Extend the boundaries of the map for each marker and display the marker
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(map);
//     bounds.extend(markers[i].position);
//   }
//   map.fitBounds(bounds);
// }
// // This function will loop through the listings and hide them all.
// function hideMarkers(markers) {
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(null);
//   }
// }
// // This function takes in a COLOR, and then creates a new marker
// // icon of that color. The icon will be 21 px wide by 34 high, have an origin
// // of 0, 0 and be anchored at 10, 34).
// function makeMarkerIcon(markerColor) {
//   var markerImage = new google.maps.MarkerImage(
//     'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
//     '|40|_|%E2%80%A2',
//     new google.maps.Size(21, 34),
//     new google.maps.Point(0, 0),
//     new google.maps.Point(10, 34),
//     new google.maps.Size(21,34));
//   return markerImage;
// }

// // This function allows the user to input a desired travel time, in
// // minutes, and a travel mode, and a location - and only show the listings
// // that are within that travel time (via that travel mode) of the location
// function searchWithinTime() {
//   // Initialize the distance matrix service.
//   var distanceMatrixService = new google.maps.DistanceMatrixService;
//   var address = document.getElementById('search-within-time-text').value;
//   // Check to make sure the place entered isn't blank.
//   if (address == '') {
//     window.alert('You must enter an address.');
//   } else {
//     hideMarkers(markers);
//     // Use the distance matrix service to calculate the duration of the
//     // routes between all our markers, and the destination address entered
//     // by the user. Then put all the origins into an origin matrix.
//     var origins = [];
//     for (var i = 0; i < markers.length; i++) {
//       origins[i] = markers[i].position;
//     }
//     var destination = address;
//     var mode = document.getElementById('mode').value;
//     // Now that both the origins and destination are defined, get all the
//     // info for the distances between them.
//     distanceMatrixService.getDistanceMatrix({
//       origins: origins,
//       destinations: [destination],
//       travelMode: google.maps.TravelMode[mode],
//       unitSystem: google.maps.UnitSystem.IMPERIAL,
//     }, function(response, status) {
//       if (status !== google.maps.DistanceMatrixStatus.OK) {
//         window.alert('Error was: ' + status);
//       } else {
//         displayMarkersWithinTime(response);
//       }
//     });
//   }
// }
// // This function will go through each of the results, and,
// // if the distance is LESS than the value in the picker, show it on the map.
// function displayMarkersWithinTime(response) {
//   var maxDuration = document.getElementById('max-duration').value;
//   var origins = response.originAddresses;
//   var destinations = response.destinationAddresses;
//   // Parse through the results, and get the distance and duration of each.
//   // Because there might be  multiple origins and destinations we have a nested loop
//   // Then, make sure at least 1 result was found.
//   var atLeastOne = false;
//   for (var i = 0; i < origins.length; i++) {
//     var results = response.rows[i].elements;
//     for (var j = 0; j < results.length; j++) {
//       var element = results[j];
//       if (element.status === "OK") {
//         // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
//         // the function to show markers within a user-entered DISTANCE, we would need the
//         // value for distance, but for now we only need the text.
//         var distanceText = element.distance.text;
//         // Duration value is given in seconds so we make it MINUTES. We need both the value
//         // and the text.
//         var duration = element.duration.value / 60;
//         var durationText = element.duration.text;
//         if (duration <= maxDuration) {
//           //the origin [i] should = the markers[i]
//           markers[i].setMap(map);
//           atLeastOne = true;
//           // Create a mini infowindow to open immediately and contain the
//           // distance and duration
//           var infowindow = new google.maps.InfoWindow({
//             content: durationText + ' away, ' + distanceText
//           });
//           infowindow.open(map, markers[i]);
//           // Put this in so that this small window closes if the user clicks
//           // the marker, when the big infowindow opens
//           markers[i].infowindow = infowindow;
//           google.maps.event.addListener(markers[i], 'click', function() {
//             this.infowindow.close();
//           });
//         }
//       }
//     }
//   }
//   if (!atLeastOne) {
//     window.alert('We could not find any locations within that distance!');
//   }
// }