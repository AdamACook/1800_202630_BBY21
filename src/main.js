// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// If you have custom global styles, import them as well:
// import '../styles/style.css';

import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.16.0/dist/maplibre-gl.mjs';
import { ScaleControl } from 'maplibre-gl';

const map = new maplibregl.Map({
    container: 'map', // container id
    style: `https://tiles.openfreemap.org/styles/bright`, 
    bearing: 0,
    pitch: 0,
    center: [-123.0012125, 49.2518], // starting position [lng, lat]
    zoom: 16 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true
}));

map.addControl(
    new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

let scale = new ScaleControl({
    maxWidth: 500,
    unit: 'metric'
});

map.addControl(scale);

function sayHello() {
    

function showName() {
    // Pass a CALLBACK function to run when Firebase finishes checking login status
    onAuthReady(function(user) {  // Firebase passes the user object (or null)
        if (user) {
            // User is logged in
            const name = user.displayName || user.email;  // Use email if name is missing
            document.getElementById("name-goes-here").textContent = name + "!";
        } else {
            // User is NOT logged in
            location.href = "index.html";  // Redirect to login page
        }
    });
}
//document.addEventListener('DOMContentLoaded', sayHello);
