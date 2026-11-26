import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'

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


const auth = getAuth();
let currentUser = null;

function scheduleRef(uid) {
  return doc(db, "users", uid);
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (!user) return;

  try {
    const snap = await getDoc(scheduleRef(user.uid));
    if (snap.exists() && snap.data().schedule && snap.data().schedule !== "schedule") {

      document.getElementById("tableContainer").innerHTML = convertCsvToHtml(
        snap.data().schedule,
      );
    }
  } catch (error) {
    console.error("Failed to load schedule", error);
  }
});

async function saveSchedule(event) {
  const scheduleFile = event.target.files[0];
  if (!scheduleFile) return;

  if (!currentUser) {
    alert("Please log in before importing a schedule.");
    return;
  }

  try {
    const csvText = await scheduleFile.text();
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

  event.target.value = ""; 
}

document
  .getElementById("csvFileInput")
  .addEventListener("change", saveSchedule);


// Things Below this comment currently work (they delete you schedule but dont display the deleted schedule)

async function showPopup(event) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });
  return result.isConfirmed
}

async function deleteSchedule() {

  const confirmed = await showPopup();
  if (!confirmed) return;

  try {
    await setDoc(
        scheduleRef(currentUser.uid), 
      {
        schedule: "schedule" ,
        email: currentUser.email ,
        name: currentUser.displayName || ""},
      { merge: true },
    );
    console.log("Deleted schedule for", `users/${currentUser.uid} (schedule field)`);

    await Swal.fire({
      title: "Deleted!",
      text: "Your schedule has been deleted.",
      icon: "success",
    });
    window.location.reload();
  } catch (error) {
    Swal.fire({
      title: "Error deleting schedule:",
      text: `${error.code || ""} ${error.message || error}`,
      icon: "error",
    });
  }
}

document
  .getElementById("deleteSchedule")
  .addEventListener("click", deleteSchedule);