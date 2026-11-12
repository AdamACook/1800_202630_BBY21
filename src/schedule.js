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