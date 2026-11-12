<<<<<<< HEAD
import { auth } from "/src/firebaseConfig.js";
import { db } from "/src/firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

// Import specific functions from the Firebase Auth SDK
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export async function setupSchedule(day, time, course, duration, type, building, room) {
  const userCredential = await createUserSchedule(auth, email, password);
  const user = userCredential.user; // Get the user object

  // Update the user's profile with the display name, NOTE: updateProfile is a built-in Firebase function
  await updateSchedule(user, { displayName: schedule });

  // After creating the user, we can also create a Firestore document for them with default values for country and school.
  // This demonstrates how to link Auth users to Firestore data.
  // Use 'try' 'catch' to handle any errors that might occur during Firestore document creation.
  try {
    // Create a Firestore document for the new user with default values
    await setDoc(doc(db, "schedule", user.uid), {
      day: document.getElementById("dayOfWeek")?.value,
      time: document.getElementById("timeOfDay")?.value,
      course: document.getElementById("enrolledCourse")?.value,
      duration: document.getElementById("courseDuration")?.value,
      type: document.getElementById("courseType")?.value,
      building: document.getElementById("buildingCode")?.value,
      room: document.getElementById("roomNumber")?.value
    });
    console.log("Firestore user document created successfully!");
} catch (error) {
  // Information for debugging: show the error code  
  // In a real app, you might want to show a user-friendly message instead of the raw error.
  // console.error("Error creating user document in Firestore:", error);
  // console output may not be seen if redirection to main.html happens
  // Therefore, we can try "alert".  
  alert(`Error creating user document:\n${error.code || ""}\n${error.message || error}`);
}
  // Return the user object for further use (e.g., redirecting or showing a welcome message)
  return user;
}
=======
document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvContent = e.target.result;
            const htmlTable = convertCsvToHtml(csvContent);
            document.getElementById('tableContainer').innerHTML = htmlTable;
        };
        reader.readAsText(file);
    }
}

function convertCsvToHtml(csv) {
    const lines = csv.split(/\r?\n/);
    let html = '<table border="1">';

    //Header
    const headers = lines[0].split(',');
    html += '<thread><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';

    // Body
    html += '<tbody>';
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');
        if (cells.length === headers.length) {
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td>${cell}</td>`;
            })
            html += '</tr>';
        }
    }
    html += '</tbody>';
    html += '</table>';
    return html;
}


//FROM: https://dev.to/dataformathub/transform-csv-data-to-html-tables-for-web-display-a-comprehensive-guide-443
/* <script>
        document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const csvContent = e.target.result;
                    const htmlTable = convertCsvToHtml(csvContent);
                    document.getElementById('tableContainer').innerHTML = htmlTable;
                };
                reader.readAsText(file);
            }
        }

        function convertCsvToHtml(csv) {
            const lines = csv.split(/\r?\n/);
            let html = '<table border="1">';

            // Header
            const headers = lines[0].split(','); //
            html += '<thead><tr>';
            headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';

            // Body
            html += '<tbody>';
            for (let i = 1; i < lines.length; i++) {
                const cells = lines[i].split(',');
                if (cells.length === headers.length) { // Ensure consistent row structure
                    html += '<tr>';
                    cells.forEach(cell => {
                        html += `<td>${cell}</td>`;
                    });
                    html += '</tr>';
                }
            }
            html += '</tbody>';
            html += '</table>';
            return html;
        }
    </script> */
>>>>>>> ef4a7ee134ebe5dab79552747fd941f81f38e332
