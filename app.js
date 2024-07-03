firebase.initializeApp({
  apiKey: "AIzaSyAtUeCGK3uZvOffBTO-tRYWfHqu-ouD5eg",
  authDomain: "my-task-manager-app-1e0de.firebaseapp.com",
  projectId: "my-task-manager-app-1e0de",
  storageBucket: "my-task-manager-app-1e0de.appspot.com",
  messagingSenderId: "646381587568",
  appId: "1:646381587568:web:792a3f079acb8d1c1078b5"
});

const db = firebase.firestore();

// Function to add a task
function addTask() {
  const taskInput = document.getElementById("task-input");
  const task = taskInput.value.trim();
  if (task !== "") {
    db.collection("tasks").add({
      task: task,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      taskInput.value = "";
    }).catch(error => {
      console.error("Error adding task:", error);
    });
  }
}

// Function to render tasks
function renderTasks(doc) {
  const taskList = document.getElementById("task-list");
  const taskItem = document.createElement("li");

  taskItem.className = "task-item";
  taskItem.innerHTML = `
    <span>${doc.data().task}</span>
    <button onclick="deleteTask('${doc.id}')">Delete</button>
  `;
  taskItem.setAttribute('data-id', doc.id); // Adding attribute for easy identification
  taskList.appendChild(taskItem);
}

// Real-time listener for tasks
db.collection("tasks")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    const changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type === "added") {
        renderTasks(change.doc);
      } else if (change.type === "removed") {
        // Remove the task from the UI
        const taskList = document.getElementById("task-list");
        const taskItem = taskList.querySelector(`[data-id='${change.doc.id}']`);
        if (taskItem) {
          taskList.removeChild(taskItem);
        }
      }
    });
  });

// Function to delete a task
function deleteTask(id) {
  db.collection("tasks").doc(id).delete().then(() => {
    console.log("Task successfully deleted");
  }).catch(error => {
    console.error("Error removing task:", error);
  });
}

// Show task section after sign-up or log-in
function showTaskSection() {
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("task-section").style.display = "block";
}

// Event listener for signup form submission
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission
  
  // Creating variables to hold form field values to enable signup form handling logic.

  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

//Implement signup logic here (Firebase Authentication)
firebase.auth().createUserWithEmailAndPassword(email,password)
  .then((userCredential)=>{
    const user = userCredential.user;
    console.log("Signup successful:", user.uid);
    setTimeout(showTaskSection,1000);
  })
  .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Signup error:", errorMessage);
  })

  console.log("Signup form submitted");

});
  
// Event listener for login form submission
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission
  
   // Accessing form fields
   const email = document.getElementById("login-email").value;
   const password = document.getElementById("login-password").value;

//Log in form handling logic by Implement Firebase authentication

firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User logged in:", user.uid);
      //Redirecting user to TaskManager page
      showTaskSection(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", errorMessage);
      // Handle login error, and displaying an error message to the user
    });

  console.log("Login form submitted");

});

// Function to show login section
function showLoginSection() {
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";

}

// Function to show signup section
function showSignupSection() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("signup-section").style.display = "block";
}

