// US Geological Survey's earthquake data updates once a minute and is provided in JSON format.
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// This program collects and plots information on earthquakes of greater than 4.5 Magnitude over the last 7 days.

// Store API endpoint inside a variable

var query_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query variable
d3.json(query_URL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function to run once for each feature in the features array
  // Give each feature a popup describing the magnitude, location, and time of the earthquake
  // In the popup, include a URL for more information on the event

  function do_OnEachFeature(feature, obj) {
     obj.bindPopup("<h2>" + feature.properties.title +
        "</h2><hr>" + "<h4>" + new Date(feature.properties.time) + "</h4>"
        + "<h4>" + "For more information on this event visit:" + "</h4>"
        + "<h5>" + feature.properties.url + "</h5></p>");

      console.log(feature);


// Set color of markers

    var color = "";
    if (feature.properties.mag > 5.5) {
      color = "red" 
    }
    else if (feature.properties.mag > 5) {
      color = "orange"
    }
    else if (feature.properties.mag > 4.5) {
      color = "light orange"
    }
    else {
      color = "yellow"
    }
  };

  // This variable determines the radius of the earthquake marker based on its magnitude.
    
  // var getRadius = feature.properties.mag * 4  


// Set marker style - the code above isn't working otherwise color and radius would have been referring to the variables above

    var geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: geojsonMarkerOptions,

    onEachFeature: do_OnEachFeature
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);


function createMap(earthquakes) {

  // Define map layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscaleemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoorsemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Gray Scale Map": grayscaleemap,
    "Outdoors Map": outdoorsemap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, centered in Rome, giving it the satellite and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      41.906204, 12.507516
    ],
    zoom: 3,
    layers: [outdoorsemap, earthquakes]
  });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
};