// CREATE THE MAP

// Create the base layers for our map
var satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Create the default map
var map = L.map('map', {
    layers: [satLayer, topoLayer, osmLayer]
}).setView([37.09, -95.71], 5); // Set initial view to the US

// Create the layer groups fo the markers
const quakeOverlay = L.layerGroup().addTo(map);
const platesOverlay = L.layerGroup().addTo(map);

// Create an object to contain base layers
var baseLayers = {
    "Satellite": satLayer,
    "Outdoors": topoLayer,
    "Grayscale": osmLayer
};

// Create an object to contain overlays
var overlayMaps = {
    "Tectonic Plates": platesOverlay,
    "Earthquakes" : quakeOverlay
};

// Add layers control to the map
var layerControl = L.control.layers(baseLayers, overlayMaps, {collapsed: false}).addTo(map);


// CREATE THE OVERLAYS FOR THE MAP

// Get the earthquakes endpoint
const quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the Earthquake overlay using GeoJSON
d3.json(quakes).then(function(quakeData) {
    
    // Define depth labels, colors, and ranges
    let depthRanges = [
        { range: "<10", color: "#9ACD32", min: -Infinity, max: 10 },  //yellow-green
        { range: "10-30", color: "#FFFF00", min: 10, max: 30 },       //yellow
        { range: "30-50", color: "#FFD700", min: 30, max: 50 },       //orange-yellow
        { range: "50-70", color: "#FFA500", min: 50, max: 70 },       //orange
        { range: "70-90", color: "#FF4500", min: 70, max: 90 },       //red-orange
        { range: "90+", color: "#FF0000", min: 90, max: Infinity }    //red
    ];

    // Define a custom color function for earthquake depths
    function getDepthColor(depth) {
        for (let range of depthRanges) {
            if (depth >= range.min && depth < range.max) {
                return range.color; // Return the color
            }
        }
        return "#9ACD32"; // Default color
    };

    // Create a GeoJSON layer for the earthquake data and add it to the overlay
    L.geoJSON(quakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: Math.round(feature.properties.mag) * 3,
                color: "black",
                weight: 0.25,
                fillColor: getDepthColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
            });
        },
        // Bind a tooltip to each layer
        onEachFeature: function(feature, layer) {
            layer.bindTooltip("<b>Magnitude:</b> " + feature.properties.mag +
                              "<br><b>Location:</b> " + feature.properties.place +
                              "<br><b>Depth:</b> " + feature.geometry.coordinates[2] + " km", {
                permanent: false, // Show tooltip on hover
                sticky: true // Keep tooltip open while hovering over
            });
        }
    }).addTo(quakeOverlay); // Add markers to the overlay

     // Set up the earthquake legend
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");

        // Loop through each depth range and create a label
        depthRanges.forEach(function(range) {
            div.innerHTML += "<div style='display: flex; align-items: center;'>" +
                "<div style='background-color: " + range.color + 
                "; width: 20px; height: 20px; margin-right: 5px;'></div>" +
                range.range + "</div>";
        });
        return div;
    };

    legend.addTo(quakeOverlay); // Add legend to the overlay

// Check for any errors
}).catch(function(error) {
    console.error("Error fetching the GeoJSON data: ", error);
});

// Get the tectonic plates endpoint
const plates = "static/data/PB2002_plates.json";

// Create the Tectonic Plates overlay using GeoJSON
d3.json(plates).then(function(plateData) {
    
    // Create a GeoJSON layer for the tectonic plates data and add it to the overlay
    L.geoJSON(plateData, {
        // Styling each feature
        style: function(feature) {
            return {
                color: "#FFA500",
                weight: 2.5,
                opacity: 1,
                fill: false,
                fillOpacity: 0
            };
        },
    }).addTo(platesOverlay);
    
}).catch(function(error) {
    console.error("Error fetching the GeoJSON data: ", error);
});