
// FEATURE OPEN / CLOSE LOGIC

function openFeatures() {
  // All small feature boxes
  let allElems = document.querySelectorAll(".elem");

  // All full screen feature pages
  let fullElemPage = document.querySelectorAll(".fullElem");

  // Back buttons inside full pages
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  // When small element is clicked → open its full page
  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  // When back button is clicked → close full page
  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures(); // calling the function


// TODO LIST LOGIC STARTS HERE


// Selecting form elements
let form = document.querySelector(".addTask form");
let taskInput = document.querySelector(".addTask form input");
let taskDetailsInput = document.querySelector(".addTask form textarea");
let taskCheckBox = document.querySelector(".addTask form #check");

function todolist() {

  // Array to store all tasks
  var currentTask = [];

  // Load tasks from localStorage if present
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  }

  // ---------------------------
  // FUNCTION TO RENDER TASKS
  // ---------------------------
  function renderTask() {

    // Save updated task list to localStorage
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    let allTask = document.querySelector(".allTask");
    let sum = "";

    // Loop through each task and create HTML
    currentTask.forEach(function (elem, idx) {

      // Skip if task or details are empty
      if (!elem.task || !elem.details) return;

      sum += `
        <div class="task">
          <details>
            <summary>
              <h5>
                ${elem.task}
                <span class="${elem.imp ? 'important' : ''}">imp</span>
              </h5>
            </summary>
            <p>${elem.details}</p>
          </details>
          <button id="${idx}">Mark as completed</button>
        </div>
      `;
    });

    // Insert all tasks into the page
    allTask.innerHTML = sum;
  }

  // First time rendering when page loads
  renderTask();



  // ---------------------------
  // ADD NEW TASK (FORM SUBMIT)
  // ---------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Add new task to array
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckBox.checked,
    });

    // Clear inputs after adding
    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckBox.checked = false;

    // Re-render tasks
    renderTask();
  });



  // ---------------------------
  // MARK TASK AS COMPLETED
  // (Event Delegation Technique)
  // ---------------------------
  document.querySelector(".allTask").addEventListener("click", function (e) {

    // Check if clicked element is a button
    if (e.target.tagName === "BUTTON") {

      // Remove that task using button id
      currentTask.splice(e.target.id, 1);

      // Re-render updated list
      renderTask();
    }
  });

}

// Call the todo list function
todolist();
localStorage.clear();