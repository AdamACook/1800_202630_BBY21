import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

// Global variable that includes the location of the User
const appState = {
    schedule: [],
    userLngLat: null   // [lng, lat]
};

let map = null;

let currentUser = null; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// If you have custom global styles, import them as well:
// import '../styles/style.css';
function showMap() {
    map = new maplibregl.Map({
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

    let scale = new maplibregl.ScaleControl({
        maxWidth: 500,
        unit: 'metric'
    });

    map.once("load", async () => {
        // Choose either the built-in geolocate control or the manual pin method
        // addGeolocationControl();
        await addUserPin();    // NEW - remove map input param
        await showClasses();     // NEW - remove map input param
        //zoomToAll();
    });

    map.addControl(scale);
}

// ------------------------------------------------------------
// This function manually gets the user's geolocation and adds a custom pin to the map.
// It also adds a click event to show a popup with "You are here".
// -------------------------------------------------------------
async function addUserPin(map) {
    if (!("geolocation" in navigator)) {
        console.warn("Geolocation is not available in this browser");
        return;
    }

    // Use the safe geolocation function that returns a Promise
    navigator.geolocation.getCurrentPosition(
        pos => {
            // Store user location in global variable for later use (e.g., zooming to all points)
            appState.userLngLat = [pos.coords.longitude, pos.coords.latitude];

            // Add a GeoJSON source
            map.addSource("userLngLat", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: { type: "Point", coordinates: appState.userLngLat },
                            properties: { description: "Your location" }
                        }
                    ]
                }
            });

            // Add a simple circle layer
            map.addLayer({
                id: "userLngLat",
                type: "circle",
                source: "userLngLat",
                paint: {
                    "circle-color": "#1E90FF",
                    "circle-radius": 6,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff"
                }
            });

            // Optional: add a tooltip on hover or click
            map.on("click", "userLngLat", e => {
                const [lng, lat] = e.features[0].geometry.coordinates;
                new maplibregl.Popup().setLngLat([lng, lat]).setHTML("You are here").addTo(map);
            });
        },
        err => {
            console.error("Geolocation error", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

async function showClasses() {
/*
    // Get Firestore snapshot  (not the JSON)
    // Make sure getClasss() returns the snapshot (not the JSON) so we can access document IDs for reviews
    const snapshot = await getClasss();

    snapshot.forEach((snap) => {

        // Extract the Class data from the Firestore document
        const doc = snap.data();
        appState.Classs.push(doc);

        // Create a custom HTML element for the marker (a green circle)
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.backgroundColor = "green";
        el.style.cursor = "pointer";
        
        // Create the POPUP in a helper function (to keep it clean)
        const popup = makeRoutePopup(doc);  

        // Add a marker to the map at the Class's location
        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([49.2497327467232, -123.00267477625488])
            .setPopup(popup)    // NEW CODE - adding new popup to this Marker
            .addTo(map);
    });*/

            // Create a custom HTML element for the marker (a green circle)
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.backgroundColor = "green";
        el.style.cursor = "pointer";
        
        const doc = "";
        // Create the POPUP in a helper function (to keep it clean)
        const popup = makeRoutePopup(doc);  

            // Add a marker to the map at the Class's location
        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([-123.00267477625488, 49.2497327467232])
            .setPopup(popup)    // NEW CODE - adding new popup to this Marker
            .addTo(map);
}

function makeRoutePopup(Class) {
    const div = document.createElement("div");          //Html element to hold the popup content
    div.innerHTML = `<strong>Route Test</strong><br>`;// Add Class name or other info here if desired

    const btn = document.createElement("button");       // Create a button element
    btn.textContent = "Route here";                     // Set button text

    // Add click event listener and handler to call routeToClass with the Class's coordinates
    btn.addEventListener("click", () => routeToClass(Class.lng, Class.lat)); 

    div.appendChild(btn);
    return new maplibregl.Popup({ offset: 25 }).setDOMContent(div);   //Create popup
}

// ------------------------------------------------------------
// This function takes the user's current location and a destination (Class) location,
// calls the OSRM API to get a route, and then displays that route on the map.
// It also fits the map view to show the entire route.
// Detination coordinates are passed in from the "Route here" button in the popup for each Class.
// User's current location is read from the global variable set by the geolocation function.
// ------------------------------------------------------------
async function routeToClass(destLng, destLat) {

    // Extract user location from global variable set by geolocation function
    const userLocationLng = appState.userLngLat[0];   
    const userLocationLat = appState.userLngLat[1];

    // Construct the OSRM API URL for routing from user location to destination Class location
    // OSRM (Open Source Routing Machine) expects coordinates as lng,lat;lng,lat
    const profile = "driving"; // try "foot" on some OSRM servers, but public demo often uses driving
    const url = `https://router.project-osrm.org/route/v1/${profile}/` +
        `${userLocationLng},${userLocationLat};${destLng},${destLat}` +
        `?overview=full&geometries=geojson`;

    try {
        console.log("Routing URL:", url);   // For debugging: check the constructed URL is correct before making the API call
        const response = await fetch(url);
        const data = await response.json();
        console.log("OSRM response:", data); // For debugging: check the API response to ensure we got a valid route back

        // Extract the route geometry from the OSRM response and convert it to GeoJSON format
        const routeGeoJSON = {
            type: "Feature",
            geometry: data.routes[0].geometry
        };

        // If route source already exists, just update it
        if (map.getSource("route")) {
            map.getSource("route").setData(routeGeoJSON);
        } else {
            map.addSource("route", {
                type: "geojson",
                data: routeGeoJSON
            });

            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },
                paint: {
                    "line-color": "#007cbf",
                    "line-width": 5
                }
            });
        }

        // Fit map to route bounds
        const coords = data.routes[0].geometry.coordinates;
        const bounds = coords.reduce(
            (b, coord) => b.extend(coord),
            new maplibregl.LngLatBounds(coords[0], coords[0])
        );

        map.fitBounds(bounds, {
            padding: 40
        });

    } catch (err) {
        console.error("Routing error:", err);
        alert("Failed to load route.");
    }
}

showMap();