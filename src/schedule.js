import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

document
  .getElementById("csvFileInput")
  .addEventListener("change", handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const csvContent = e.target.result;
      const htmlTable = convertCsvToHtml(csvContent);
      document.getElementById("tableContainer").innerHTML = htmlTable;
    };
    reader.readAsText(file);
  }
}

function convertCsvToHtml(csv) {
  const lines = csv.split(/\r?\n/);
  let html = '<table border="1">';

  //Header
  const headers = lines[0].split(",");
  html += "<thread><tr>";
  headers.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += "</tr></thead>";

  // Body
  html += "<tbody>";
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    if (cells.length === headers.length) {
      html += "<tr>";
      cells.forEach((cell) => {
        html += `<td>${cell}</td>`;
      });
      html += "</tr>";
    }
  }
  html += "</tbody>";
  html += "</table>";
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

// Everything past this comment is for test purposes only. It is not part of the final implementation.

// async function saveSchedule() {
//     try {
//         await setDoc(doc(db, "schedule", "userSchedule"), {
//         schedule: document.getElementById("tableContainer").innerHTML
//         });
//         console.log("Schedule saved to Firestore!");
//     } catch (error) {
//         console.error("Save failed", error);
//     }
// }

const auth = getAuth();
let currentUser = null;


// The user's own document: users/{uid}
function scheduleRef(uid) {
  return doc(db, "users", uid);
}

// ---- (1) Remember who is logged in, and load their saved schedule ----
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (!user) return;

  try {
    const snap = await getDoc(scheduleRef(user.uid));
    if (snap.exists() && snap.data().schedule && snap.data().schedule !== "schedule") {
      // Reuse the table function from above to show the saved schedule
      document.getElementById("tableContainer").innerHTML = convertCsvToHtml(
        snap.data().schedule,
      );
    }
  } catch (error) {
    console.error("Failed to load schedule", error);
  }
});

// ---- (2) When a file is chosen, save its text to Firestore ----
// (handleFileSelect above still shows the table; this only does the saving)
async function saveSchedule(event) {
  const scheduleFile = event.target.files[0];
  if (!scheduleFile) return;

  if (!currentUser) {
    alert("Please log in before importing a schedule.");
    return;
  }

  try {
    const csvText = await scheduleFile.text(); // the CSV as a plain string
    await setDoc(
        scheduleRef(currentUser.uid), 
      { 
        schedule: csvText ,
        email: currentUser.email ,
        name: currentUser.displayName || ""},
      { merge: true },
    );
    console.log("Schedule saved to", `users/${currentUser.uid} (schedule field)`);
  } catch (error) {
    alert(
      `Error saving schedule:\n${error.code || ""}\n${error.message || error}`,
    );
  }

  event.target.value = ""; // lets the user pick the same file again later
}

// ---- (3) Connect it ----
document
  .getElementById("csvFileInput")
  .addEventListener("change", saveSchedule);
