var ViewModel = function() {
  var self = this;
  self.filterText = ko.observable();
  self.displayList = ko.observableArray(markers);
  var largeInfowindow = new google.maps.InfoWindow();
  for (var i = 0; i < model.locations.length; i++) {
    self.displayList()[i].addListener('click', function() {
      self.populateInfoWindow(this, largeInfowindow);
      self.toggleBounce(this);
    });
  }
  var initBound = new google.maps.LatLngBounds();
  for (var i = 0; i < self.displayList().length; i++) {
    self.displayList()[i].setMap(map);
    initBound.extend(self.displayList()[i].position);
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

  function filtering(arr, query) {
    if (query !== '' && query !== undefined) {
      query = query.toLowerCase();
      return arr.filter((el) =>
        el.title.toLowerCase().indexOf(query) > -1
      )
    } else return arr;
  }
  this.filterList = function() {
    self.hideMarkers();
    self.displayList(filtering(self.displayList(), self.filterText()));
    self.showListings();
  }
  this.resetList = function() {
    self.displayList(markers);
    self.showListings();
  }
  this.showListings = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < self.displayList().length; i++) {
      self.displayList()[i].setMap(map);
      self.displayList()[i].setAnimation(google.maps.Animation.DROP);
      bounds.extend(self.displayList()[i].position);
    }
    // map.fitBounds(bounds);
  }
  this.hideMarkers = function() {
    for (var i = 0; i < self.displayList().length; i++) {
      self.displayList()[i].setMap(null);
    }
  }
  this.toggleOneMarker = function(marker) {
    marker.setMap(map);
    self.populateInfoWindow(marker, largeInfowindow);
    self.toggleBounce(this);
  }
  this.toggleBounce = function(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 2700)
    }
  }
}