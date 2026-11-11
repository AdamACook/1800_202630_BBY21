import { onAuthReady } from "/src/authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

let currentUser = null; 
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

function showName() {

    // Get the DOM element where the user's name will be displayed
    // Example: <h1 id="name-goes-here"></h1>
    const nameElement = document.getElementById("name-goes-here");

    // Wait until Firebase Auth finishes checking the user's auth state
    onAuthReady(async (user) => {

        // If no user is logged in, redirect to the login page
        if (!user) {
            location.href = "index.html";
            return; // Stop execution
        }

        // Get the user's Firestore document from the "users" collection
        // Document ID is the user's unique UID
        const userDoc = await getDoc(doc(db, "users", user.uid));

        // Determine which name to display:
        const name = userDoc.exists()            // 1️⃣ Use Firestore name if document exists
            ? userDoc.data().name                // 2️⃣ Otherwise fallback to Firebase displayName
            : user.displayName || user.email;    // 3️⃣ Otherwise fallback to email

       // If the DOM element exists, update its text using a template literal to add "!"
        if (nameElement) {
            nameElement.textContent = `${name}!`;
        }
    });
}

showName();

function addScheduleData() {
    const scheduleRef = collection(db, "schedule");
    console.log("Adding sample schedule");
    addDoc(scheduleRef, {
        day: "Monday",
        time: "9:30 AM",
        duration: "2 hours, 50 minutes",
        class: "COMP 1510 Programming Methods",
        type: "Lab",
        building: "SW01",
        room: "2004"
    });
}

seedSchedule();

async function seedSchedule() {

    // Get a reference to the "hikes" collection
    const scheduleRef = collection(db, "schedule");

    // Retrieve all documents currently in the collection
    const querySnapshot = await getDocs(scheduleRef);

    // If no documents exist, the collection is empty
    if (querySnapshot.empty) {

        console.log("Schedule collection is empty. Seeding data...");

        // Call function to insert default schedule documents
        addScheduleData();

    } else {

        // If documents already exist, do not reseed
        console.log("Schedule collection already contains data. Skipping seed.");
    }
}
// document.addEventListener('DOMContentLoaded', sayHello);

// function addHikeData() {
//     const hikesRef = collection(db, "hikes");
//     console.log("Adding sample hike data...");
//     addDoc(hikesRef, {
//         code: "BBY01", name: "Burnaby Lake Park Trail", city: "Burnaby",
//         level: "easy", details: "A lovely place for a lunch walk.", length: 10,
//         hike_time: 60, lat: 49.2467097082573, lng: -122.9187029619698,
//         last_updated: serverTimestamp()
//     });
//     addDoc(hikesRef, {
//         code: "AM01", name: "Buntzen Lake Trail", city: "Anmore",
//         level: "moderate", details: "Close to town, and relaxing.", length: 10.5,
//         hike_time: 80, lat: 49.3399431028579, lng: -122.85908496766939,
//         last_updated: serverTimestamp()
//     });
//     addDoc(hikesRef, {
//         code: "NV01", name: "Mount Seymour Trail", city: "North Vancouver",
//         level: "hard", details: "Amazing ski slope views.", length: 8.2,
//         hike_time: 120, lat: 49.38847101455571,lng: -122.94092543551031,
//         last_updated: serverTimestamp()
//     });
// }
//document.addEventListener('DOMContentLoaded', sayHello);