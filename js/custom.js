var map, measureTool;
var componentForm = {
street_number: 'short_name',
route: 'long_name',
locality: 'long_name',
administrative_area_level_1: 'short_name',
country: 'long_name',
postal_code: 'short_name'
};
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
 center: {lat: 43.6916507, lng: -79.41045 },
 mapTypeId:google.maps.MapTypeId.SATELLITE,
 zoom:15,
 scaleControl: true
  });
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      var searchBtn = document.getElementById('get-start');
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
  searchBox.addListener('places_changed', function() {

  });	
  searchBtn.onclick = function () {
      searchBtn.style.display='none';
      document.getElementById("maparea").style.display = 'block';
      displaySearchResults(map,searchBox,markers);
  }

  measureTool = new MeasureTool(map, {
    contextMenu: true,
    showSegmentLength: true,
    tooltip: true,
    unit: MeasureTool.UnitTypeId.IMPERIAL,
    // metric, imperial, or nautical
  });

  // test for setting units
//    measureTool.setOption('unit', MeasureTool.UnitTypeId.METRIC);

  measureTool.addListener('measure_start', () => {
    console.log('started');
//      measureTool.removeListener('measure_start')
  });
  measureTool.addListener('measure_end', (e) => {
    console.log('ended', e.result);
//      measureTool.removeListener('measure_end');
    var area2 = e.result['area'].toFixed(2);
    document.getElementById("selected_area").innerHTML = 'Area: '+area2+ 'ft<sup>2</sup>';
    document.getElementById("area_size").value= area2;
  });
  measureTool.addListener('measure_change', (e) => {
    console.log('changed', e.result);
  });
}

function displaySearchResults(map, searchBox, markers) {
  var places = searchBox.getPlaces();
  if (places.length == 0) {
      return;
  }
               for (var component in componentForm) {
              document.getElementById(component).value = '';
              document.getElementById(component).disabled = false;
            }
         
            // Get each component of the address from the place details,
            // and then fill-in the corresponding field on the form.
            for (var i = 0; i < places[0]['address_components'].length; i++) {
              var addressType = places[0]['address_components'][i].types[0];
              if (componentForm[addressType]) {
                var val = places[0]['address_components'][i][componentForm[addressType]];
                document.getElementById(addressType).value = val;
              }
            }
  // Clear out the old markers.
  markers.forEach(function (marker) {
      marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function (place) {
      if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
      }
      var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
      }));

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
      } else {
          bounds.extend(place.geometry.location);
      }
  });
 map.fitBounds(bounds);
  map.setZoom(20);
}