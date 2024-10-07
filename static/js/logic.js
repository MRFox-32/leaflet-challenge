// Create the tile layer that will be the background of our map.
let map = L.map('map').setView([37.09, -95.71], 5); // Set initial view to the US

// Create the tile layer that will be the background of our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define depth labels, colors, and ranges
let depthRanges = [
    { range: "<10", color: "#9ACD32", min: -Infinity, max: 10 },
    { range: "10-30", color: "#FFFF00", min: 10, max: 30 },
    { range: "30-50", color: "#FFD700", min: 30, max: 50 },
    { range: "50-70", color: "#FFA500", min: 50, max: 70 },
    { range: "70-90", color: "#FF4500", min: 70, max: 90 },
    { range: "90+", color: "#FF0000", min: 90, max: Infinity }
];

// Define a custom color function for earthquake depths
function getDepthColor(depth) {
    for (let range of depthRanges) {
        if (depth >= range.min && depth < range.max) {
            return range.color; // Return the color
        }
    }
    return "#9ACD32"; // Default color
}

// Perform an API call to the USGS API to get earthquake information using GeoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    // Create a GeoJSON layer and add it to the map.
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: Math.round(feature.properties.mag) * 3,
                color: "black",
                weight: 0.25,
                fillColor: getDepthColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
            });
        },
        // Binding a tooltip to each layer
        onEachFeature: function(feature, layer) {
            layer.bindTooltip("<b>Magnitude:</b> " + feature.properties.mag +
                              "<br><b>Location:</b> " + feature.properties.place +
                              "<br><b>Depth:</b> " + feature.geometry.coordinates[2] + " km", {
                permanent: false, // Show tooltip on hover
                sticky: true // Keep tooltip open while hovering over
            });
        }
    }).addTo(map);

    // Set up the legend.
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

    // Add legend to the map
    legend.addTo(map);

}).catch(function(error) {
    console.error("Error fetching the GeoJSON data: ", error);
});