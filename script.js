// =========================================================
// PRODUCTIVITY DASHBOARD - MAIN SCRIPT
// Clean, beginner-friendly modular script
// =========================================================

// ---------------------------------------------------------
// 1. FEATURE OPEN / CLOSE MODAL LOGIC
// ---------------------------------------------------------
function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let backBtns = document.querySelectorAll(".fullElem .back");

  allElems.forEach((elem) => {
    elem.addEventListener("click", () => {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  backBtns.forEach((back) => {
    back.addEventListener("click", () => {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();


// ---------------------------------------------------------
// 2. HERO DYNAMIC DATE & GREETING GENERATOR
// ---------------------------------------------------------
function initHeroGreeting() {
  let dateTextElem = document.querySelector("#hero-date-text");
  let greetingElem = document.querySelector("#hero-time-greeting");

  let now = new Date();
  
  // Format Date: "Tuesday, August 11"
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  let formattedDate = now.toLocaleDateString('en-US', options);

  // Time-based Greeting
  let hour = now.getHours();
  let greeting = "Good evening 👋";
  if (hour < 12) {
    greeting = "Good morning ☀️";
  } else if (hour < 17) {
    greeting = "Good afternoon 🌤️";
  }

  if (dateTextElem) dateTextElem.textContent = formattedDate;
  if (greetingElem) greetingElem.textContent = greeting;
}
initHeroGreeting();





// ---------------------------------------------------------
// 4. THEME TOGGLE LOGIC
// ---------------------------------------------------------
function initThemeToggle() {
  let toggleBtn = document.querySelector("#theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      let isLight = document.body.classList.contains("light-theme");
      toggleBtn.innerHTML = isLight ? `<i class="ri-moon-line"></i>` : `<i class="ri-sun-line"></i>`;
    });
  }
}
initThemeToggle();


// ---------------------------------------------------------
// 5. TO-DO LIST MODULE
// ---------------------------------------------------------
function todolist() {
  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckBox = document.querySelector(".addTask form #check");
  let allTaskContainer = document.querySelector(".allTask");

  let currentTask = JSON.parse(localStorage.getItem("currentTask")) || [];

  function renderTask() {
    localStorage.setItem("currentTask", JSON.stringify(currentTask));
    let html = "";
    currentTask.forEach((elem, idx) => {
      if (!elem.task || !elem.details) return;
      html += `
        <div class="task">
          <details>
            <summary>
              <h5>${elem.task} <span class="${elem.imp ? 'important' : ''}">imp</span></h5>
            </summary>
            <p>${elem.details}</p>
          </details>
          <button id="${idx}">Mark as completed</button>
        </div>`;
    });
    allTaskContainer.innerHTML = html;
  }

  renderTask();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckBox.checked,
    });
    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckBox.checked = false;
    renderTask();
  });

  allTaskContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentTask.splice(e.target.id, 1);
      renderTask();
    }
  });
}
todolist();


// ---------------------------------------------------------
// 6. DAILY PLANNER MODULE
// ---------------------------------------------------------
function dailyPlanner() {
  let plannerForm = document.querySelector("#planner-form");
  let timeInput = document.querySelector("#planner-time");
  let taskInput = document.querySelector("#planner-task");
  let notesInput = document.querySelector("#planner-notes-input");
  let scheduleItemsContainer = document.querySelector(".schedule-items");

  let scheduleList = JSON.parse(localStorage.getItem("plannerSchedule")) || [];
  let storedNotes = localStorage.getItem("plannerNotes") || "";

  if (notesInput) notesInput.value = storedNotes;

  function renderSchedule() {
    localStorage.setItem("plannerSchedule", JSON.stringify(scheduleList));
    scheduleList.sort((a, b) => a.time.localeCompare(b.time));

    let html = "";
    scheduleList.forEach((item, index) => {
      html += `
        <div class="schedule-item">
          <div>
            <span class="time-tag">${item.time}</span>
            <span class="task-name">${item.task}</span>
          </div>
          <button data-index="${index}">Delete</button>
        </div>`;
    });
    if (scheduleItemsContainer) scheduleItemsContainer.innerHTML = html;
  }

  renderSchedule();

  if (plannerForm) {
    plannerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!timeInput.value || !taskInput.value.trim()) return;
      scheduleList.push({ time: timeInput.value, task: taskInput.value.trim() });
      timeInput.value = "";
      taskInput.value = "";
      renderSchedule();
    });
  }

  if (scheduleItemsContainer) {
    scheduleItemsContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        let idx = e.target.getAttribute("data-index");
        scheduleList.splice(idx, 1);
        renderSchedule();
      }
    });
  }

  if (notesInput) {
    notesInput.addEventListener("input", () => {
      localStorage.setItem("plannerNotes", notesInput.value);
    });
  }
}
dailyPlanner();


// ---------------------------------------------------------
// 7. AMBIENT PHOTOGRAPHIC POMODORO MODULE
// ---------------------------------------------------------
function pomodoroTimer() {
  let sectionPage = document.querySelector(".pomodoro-full-page");
  let display = document.querySelector("#pomo-display");
  let statusText = document.querySelector("#pomo-status");
  let startBtn = document.querySelector("#pomo-start");
  let resetBtn = document.querySelector("#pomo-reset-btn");
  let skipBtn = document.querySelector("#pomo-skip");
  let tabs = document.querySelectorAll(".pomo-tab");

  let bgLayer1 = document.querySelector("#pomo-bg-1");
  let bgLayer2 = document.querySelector("#pomo-bg-2");
  let activeBgIndex = 1;

  const photoCollections = {
    work: ["./images/pomo_work1.jpg", "./images/pomo_work2.jpg"],
    shortBreak: ["./images/pomo_short.jpg"],
    longBreak: ["./images/pomo_long.jpg"]
  };

  let durations = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  let captions = { work: "Time to focus!", shortBreak: "Time for a break!", longBreak: "Long break!" };

  let currentMode = "work";
  let sessionCount = 1;
  let timerInterval = null;
  let isRunning = false;
  let remainingSeconds = durations.work;

  function updateBackground(mode) {
    let list = photoCollections[mode];
    if (!list || list.length === 0) return;

    let newUrl = list[0];
    let currentLayer = activeBgIndex === 1 ? bgLayer1 : bgLayer2;
    let nextLayer = activeBgIndex === 1 ? bgLayer2 : bgLayer1;

    if (!nextLayer || !currentLayer) return;

    let img = new Image();
    img.src = newUrl;
    img.onload = () => {
      nextLayer.style.backgroundImage = `url("${newUrl}")`;
      nextLayer.classList.add("active");
      currentLayer.classList.remove("active");
      activeBgIndex = activeBgIndex === 1 ? 2 : 1;
    };
  }

  if (bgLayer1) bgLayer1.style.backgroundImage = `url("${photoCollections.work[0]}")`;

  function playChime() {
    try {
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      let ctx = new AudioContext();
      let now = ctx.currentTime;
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateDisplay() {
    let timeStr = formatTime(remainingSeconds);
    if (display) display.textContent = timeStr;
    document.title = `${timeStr} - ${captions[currentMode]}`;
    if (statusText) statusText.textContent = captions[currentMode];
  }

  function setTheme(mode) {
    currentMode = mode;
    if (sectionPage) sectionPage.setAttribute("data-theme", mode);
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-mode") === mode);
    });
    updateBackground(mode);
    pauseTimer();
    remainingSeconds = durations[mode];
    updateDisplay();
  }

  function toggleTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.textContent = "PAUSE";
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          pauseTimer();
          playChime();
          if (currentMode === "work") {
            sessionCount++;
            setTheme(sessionCount % 4 === 0 ? "longBreak" : "shortBreak");
          } else {
            setTheme("work");
          }
        }
      }, 1000);
    } else {
      pauseTimer();
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    if (startBtn) startBtn.textContent = "START";
  }

  function resetTimer() {
    pauseTimer();
    remainingSeconds = durations[currentMode];
    updateDisplay();
  }

  function skipSession() {
    playChime();
    if (currentMode === "work") {
      sessionCount++;
      setTheme(sessionCount % 4 === 0 ? "longBreak" : "shortBreak");
    } else {
      setTheme("work");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTheme(tab.getAttribute("data-mode")));
  });

  if (startBtn) startBtn.addEventListener("click", toggleTimer);
  if (resetBtn) resetBtn.addEventListener("click", resetTimer);
  if (skipBtn) skipBtn.addEventListener("click", skipSession);

  updateDisplay();
}
pomodoroTimer();


// ---------------------------------------------------------
// 8. DAILY GOALS MODULE
// ---------------------------------------------------------
function dailyGoals() {
  let form = document.querySelector("#goals-form");
  let input = document.querySelector("#goal-input");
  let goalsContainer = document.querySelector(".all-goals");
  let progressFill = document.querySelector("#goal-progress-fill");
  let progressText = document.querySelector("#goal-progress-text");

  let goalsList = JSON.parse(localStorage.getItem("dailyGoals")) || [];

  function renderGoals() {
    localStorage.setItem("dailyGoals", JSON.stringify(goalsList));
    let html = "";
    let completedCount = 0;

    goalsList.forEach((goal, idx) => {
      if (goal.completed) completedCount++;
      html += `
        <div class="goal-item ${goal.completed ? 'completed' : ''}">
          <div class="goal-item-left">
            <input type="checkbox" data-index="${idx}" ${goal.completed ? 'checked' : ''}>
            <span class="goal-text">${goal.text}</span>
          </div>
          <button data-index="${idx}">Delete</button>
        </div>`;
    });

    if (goalsContainer) goalsContainer.innerHTML = html;

    let percentage = goalsList.length > 0 ? Math.round((completedCount / goalsList.length) * 100) : 0;
    if (progressFill) progressFill.style.width = percentage + "%";
    if (progressText) progressText.textContent = `${percentage}% Completed (${completedCount}/${goalsList.length})`;
  }

  renderGoals();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      goalsList.push({ text: input.value.trim(), completed: false });
      input.value = "";
      renderGoals();
    });
  }

  if (goalsContainer) {
    goalsContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        goalsList.splice(e.target.getAttribute("data-index"), 1);
        renderGoals();
      } else if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        let idx = e.target.getAttribute("data-index");
        goalsList[idx].completed = e.target.checked;
        renderGoals();
      }
    });
  }
}
dailyGoals();


// ---------------------------------------------------------
// 9. MOOD-BASED MOTIVATION QUOTES MODULE
// ---------------------------------------------------------
function motivation() {
  let quoteText = document.querySelector("#quote-text");
  let quoteAuthor = document.querySelector("#quote-author");
  let newQuoteBtn = document.querySelector("#new-quote-btn");
  let copyQuoteBtn = document.querySelector("#copy-quote-btn");
  let moodBtns = document.querySelectorAll(".mood-btn");

  const moodQuotes = {
    great: [
      { text: "Keep this positive momentum going! You are unstoppable today.", author: "Daily Inspiration" },
      { text: "Your positive energy is contagious. Spread it around!", author: "Unknown" },
      { text: "Great things never came from comfort zones. Keep shining!", author: "Roy T. Bennett" }
    ],
    good: [
      { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
      { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
    ],
    okay: [
      { text: "It's okay to feel okay. Take it one task at a time.", author: "Gentle Reminder" },
      { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
      { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." }
    ],
    low: [
      { text: "It always seems impossible until it's done. Take a deep breath.", author: "Nelson Mandela" },
      { text: "Fall seven times and stand up eight. You've got this!", author: "Japanese Proverb" },
      { text: "Tough times never last, but tough people do.", author: "Robert H. Schuller" }
    ]
  };

  let activeMood = "great";

  function getQuoteForMood(mood = activeMood) {
    let list = moodQuotes[mood] || moodQuotes.great;
    let quote = list[Math.floor(Math.random() * list.length)];
    if (quoteText) quoteText.textContent = `"${quote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `- ${quote.author}`;
  }

  moodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      moodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeMood = btn.getAttribute("data-mood");
      getQuoteForMood(activeMood);
    });
  });

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", () => getQuoteForMood(activeMood));
  }

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener("click", () => {
      let textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyQuoteBtn.innerHTML = `<i class="ri-check-line"></i> Copied!`;
        setTimeout(() => {
          copyQuoteBtn.innerHTML = `<i class="ri-file-copy-line"></i> Copy Quote`;
        }, 2000);
      });
    });
  }

  getQuoteForMood("great");
}
motivation();
