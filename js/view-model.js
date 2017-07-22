var ViewModel = function() {
  var self = this;
  var filterText = ko.observable();
  var largeInfowindow = new google.maps.InfoWindow();
  for (var i = 0; i < model.locations.length; i++) {
    markers[i].addListener('click', function() {
      self.populateInfoWindow(this, largeInfowindow);
      self.toggleBounce(this)
    });
  }
  var initBound = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    initBound.extend(markers[i].position);
  }
  map.fitBounds(initBound);
  this.populateInfoWindow = function(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      innerHTML = '<h1>' + marker.title + '</h1><br>';
      innerHTML += '<p>' + marker.description + '</p>';
      innerHTML += '<br>';
      innerHTML += '<h3>Current New York Times headlines : </h2>';
      innerHTML += '<hr>';
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      url += '?' + $.param({
        'api-key': "992dabd260ab48fd98b52d6ee986d8a0",
        'q': marker.title
      });
      $.ajax({
        url: url,
        method: 'GET',
      }).done(function(result) {
        result.response.docs.map((doc) => {
          innerHTML += '<li>' + doc.headline.main + '</li>';
        })
        infowindow.setContent(innerHTML);
      }).fail(function(err) {
        innerHTML += '<p> no article available </p>'
      }).always(function() {
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
      });
    }
  }
  this.showListings = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP);

      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  this.hideMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  this.toggleOneMarker = function(marker) {
    marker.setMap(map);
    self.populateInfoWindow(marker, largeInfowindow)
    self.toggleBounce(this)
  }
  this.toggleBounce = function(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(()=>{
        marker.setAnimation(null)
      },2700)
    }
  }
}


  // this.searchWithinTime = function() {
  //   var distanceMatrixService = new google.maps.DistanceMatrixService;
  //   var address = document.getElementById('search-within-time-text').value;
  //   if (address == '') {
  //     window.alert('You must enter an address.');
  //   } else {
  //     self.hideMarkers(markers);
  //     var origins = [];
  //     for (var i = 0; i < markers.length; i++) {
  //       origins[i] = markers[i].position;
  //     }
  //     var destination = address;
  //     var mode = document.getElementById('mode').value;
  //     distanceMatrixService.getDistanceMatrix({
  //       origins: origins,
  //       destinations: [destination],
  //       travelMode: google.maps.TravelMode[mode],
  //       unitSystem: google.maps.UnitSystem.IMPERIAL,
  //     }, function(response, status) {
  //       if (status !== google.maps.DistanceMatrixStatus.OK) {
  //         window.alert('Error was: ' + status);
  //       } else {
  //         self.displayMarkersWithinTime(response);
  //       }
  //     });
  //   }
  // }
  // this.displayMarkersWithinTime = function(response) {
  //   var maxDuration = document.getElementById('max-duration').value;
  //   var origins = response.originAddresses;
  //   var destinations = response.destinationAddresses;
  //   var atLeastOne = false;
  //   for (var i = 0; i < origins.length; i++) {
  //     var results = response.rows[i].elements;
  //     for (var j = 0; j < results.length; j++) {
  //       var element = results[j];
  //       if (element.status === "OK") {
  //         var distanceText = element.distance.text;
  //         var duration = element.duration.value / 60;
  //         var durationText = element.duration.text;
  //         if (duration <= maxDuration) {
  //           markers[i].setMap(map);
  //           atLeastOne = true;
  //           var infowindow = new google.maps.InfoWindow({
  //             content: durationText + ' away, ' + distanceText
  //           });
  //           infowindow.open(map, markers[i]);
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