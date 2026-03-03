const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const eventsList = document.getElementById("eventsList");

const eventText = document.getElementById("eventText");
const addEventBtn = document.getElementById("addEventBtn");
const urgentCheckbox = document.getElementById("urgentCheckbox");
const themeToggle = document.getElementById("themeToggle");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const prevYearBtn = document.getElementById("prevYear");
const nextYearBtn = document.getElementById("nextYear");

let currentDate = new Date();
let selectedDate = null;

/* ---------------- LOAD EVENTS ---------------- */
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

/* ---------------- FORMAT DATE KEY ---------------- */
function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

/* ---------------- SAVE EVENTS ---------------- */
function saveEvents() {
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}

/* ---------------- CLEAN A SINGLE EMPTY DATE ---------------- */
function cleanEmptyDate(key) {
  if (events[key] && events[key].length === 0) {
    delete events[key];
  }
}

/* ---------------- CLEAN ALL EMPTY DATES ON LOAD ---------------- */
function cleanAllEmptyDates() {
  for (let key in events) {
    if (!Array.isArray(events[key]) || events[key].length === 0) {
      delete events[key];
    }
  }
  saveEvents();
}

/* 🔥 CLEAN OLD STORAGE IMMEDIATELY */
cleanAllEmptyDates();

/* ---------------- RENDER CALENDAR ---------------- */
function renderCalendar(date) {
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = i;

    const fullDate = new Date(year, month, i);
    const key = formatDateKey(fullDate);

    const today = new Date();
    if (fullDate.toDateString() === today.toDateString()){
      dayDiv.classList.add("today");
    }

    /* SHOW DOT ONLY IF REAL EVENTS EXIST */
    if (events[key] && events[key].length > 0) {
      const dot = document.createElement("div");
      dot.classList.add("day-dot");
      dayDiv.appendChild(dot);
    }

    dayDiv.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      dayDiv.classList.add("selected");

      selectedDate = fullDate;
      document.getElementById("selectedDateTitle").textContent =
        fullDate.toDateString();

      displayEvents(fullDate);
    });

    calendar.appendChild(dayDiv);
  }
}

/* ---------------- DISPLAY EVENTS ---------------- */
function displayEvents(date) {
  eventsList.innerHTML = "";

  const key = formatDateKey(date);
  if (!events[key]) return;

  events[key].forEach((event, index) => {
    const div = document.createElement("div");
    div.classList.add("event-item");

    if (event.urgent) div.classList.add("urgent");

    div.textContent = event.text;

    if (event.category) {
      const label = document.createElement("span");
      label.classList.add("label", event.category);
      label.textContent = event.category;
      div.appendChild(label);
    }

    div.addEventListener("click", () => showEventActions(div, key, index));

    eventsList.appendChild(div);
  });
}

/* ---------------- EVENT ACTION POPUP ---------------- */
function showEventActions(div, key, index) {
  document.querySelectorAll(".event-actions-popup").forEach(el => el.remove());

  const popup = document.createElement("div");
  popup.classList.add("event-actions-popup");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  popup.appendChild(editBtn);
  popup.appendChild(deleteBtn);
  div.appendChild(popup);

  editBtn.onclick = () => {
    eventText.value = events[key][index].text;

    events[key].splice(index, 1);
    cleanEmptyDate(key);
    saveEvents();

    displayEvents(selectedDate);
    renderCalendar(currentDate);
  };

  deleteBtn.onclick = () => {
    events[key].splice(index, 1);

    cleanEmptyDate(key);
    saveEvents();

    displayEvents(selectedDate);
    renderCalendar(currentDate);
  };
}

/* ---------------- ADD EVENT ---------------- */
addEventBtn.addEventListener("click", () => {
  if (!selectedDate || !eventText.value.trim()) return;

  const key = formatDateKey(selectedDate);

  const category =
    document.querySelector('input[name="category"]:checked')?.value || null;

  if (!events[key]) events[key] = [];

  events[key].push({
    text: eventText.value.trim(),
    category,
    urgent: urgentCheckbox.checked
  });

  saveEvents();

  eventText.value = "";
  urgentCheckbox.checked = false;
  document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false);

  displayEvents(selectedDate);
  renderCalendar(currentDate);
});

/* ---------------- THEME TOGGLE ---------------- */
themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "Dark";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "Light";
  }
});

/* ---------------- INITIAL RENDER ---------------- */
renderCalendar(currentDate);
prevMonthBtn.addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );
  renderCalendar(currentDate);
});
prevYearBtn.addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    1
  );
  renderCalendar(currentDate);
});
nextYearBtn.addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear() + 1,
    currentDate.getMonth(),
    1
  );
  renderCalendar(currentDate);
});