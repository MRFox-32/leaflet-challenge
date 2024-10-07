# leaflet-challenge
Earthquake Visualization using United States Geological Survey API

## Instructions
The instructions for this activity are broken into two parts:
* Part 1: Create the Earthquake Visualization
* Part 2: Gather and Plot More Data

## Part 1: Create the Earthquake Visualization
Visualize an earthquake dataset, completing the following steps:
1. Get your dataset from the USGS GeoJSON Feed page and choose a dataset to visualize.
2. Import and visualize the data by doing the following:
    * Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
    * Your data markers should reflect the magnitude of the earthquake by their size, and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
    * Include popups that provide additional information about the earthquake when its associated marker is clicked.
    * Create a legend that will provide context for your map data.
    * Your visualization should look something like the preceding map.

## Part 2: Gather and Plot More Data
Perform the following tasks:
* Plot the tectonic plates dataset on the map in addition to the earthquakes.
* Add other base maps to choose from.
* Put each dataset into separate overlays that can be turned on and off independently.
* Add layer controls to your map.

## Resources
* USGS Earthquake Data: http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
* Tectonic Plates Data: https://github.com/fraxen/tectonicplates
