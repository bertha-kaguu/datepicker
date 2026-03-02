const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const eventsList = document.getElementById("eventsList");
const eventText = document.getElementById("eventText");

const addEventBtn = document.getElementById("addEventBtn");
const editBtn = document.getElementById("editBtn");
const urgentBtn = document.getElementById("urgentBtn");
const deleteBtn = document.getElementById("deleteBtn");
const themeToggle = document.getElementById("themeToggle");

let currentDate = new Date();
let selectedDate = null;
let selectedEventIndex = null;

let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

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

function displayEvents(date) {
  eventsList.innerHTML = "";
  selectedEventIndex = null;

  const key = formatDateKey(date);

  if (!events[key]) return;

  events[key].forEach((event, index) => {
    const div = document.createElement("div");
    div.classList.add("event-item");

    if (event.urgent) div.classList.add("urgent");

    div.textContent = `${event.text} (${event.category})`;

    div.addEventListener("click", () => {
      document.querySelectorAll(".event-item").forEach(e =>
        e.classList.remove("active")
      );
      div.classList.add("active");
      selectedEventIndex = index;
    });

    eventsList.appendChild(div);
  });
}

/* ------------------ ADD EVENT ------------------ */
addEventBtn.addEventListener("click", () => {
  if (!selectedDate || !eventText.value.trim()) return;

  const key = formatDateKey(selectedDate);
  const category =
    document.querySelector('input[name="category"]:checked')?.value || "general";

  if (!events[key]) events[key] = [];

  events[key].push({
    text: eventText.value.trim(),
    category,
    urgent: false
  });

  localStorage.setItem("calendarEvents", JSON.stringify(events));

  eventText.value = "";
  displayEvents(selectedDate);
});

/* ------------------ EDIT EVENT ------------------ */
editBtn.addEventListener("click", () => {
  if (!selectedDate || selectedEventIndex === null) return;

  const key = formatDateKey(selectedDate);
  const event = events[key][selectedEventIndex];

  // Load existing event into form
  eventText.value = event.text;

  // Select correct category radio
  const radio = document.querySelector(
    `input[name="category"][value="${event.category}"]`
  );

  if (radio) radio.checked = true;

  // Remove old event temporarily
  events[key].splice(selectedEventIndex, 1);
  localStorage.setItem("calendarEvents", JSON.stringify(events));

  displayEvents(selectedDate);
});

/* ------------------ TOGGLE URGENT ------------------ */
urgentBtn.addEventListener("click", () => {
  if (!selectedDate || selectedEventIndex === null) return;

  const key = formatDateKey(selectedDate);
  const event = events[key][selectedEventIndex];

  event.urgent = !event.urgent;

  localStorage.setItem("calendarEvents", JSON.stringify(events));
  displayEvents(selectedDate);
});

/* ------------------ DELETE EVENT ------------------ */
deleteBtn.addEventListener("click", () => {
  if (!selectedDate || selectedEventIndex === null) return;

  const key = formatDateKey(selectedDate);

  events[key].splice(selectedEventIndex, 1);

  localStorage.setItem("calendarEvents", JSON.stringify(events));

  displayEvents(selectedDate);
});

/* ------------------ THEME TOGGLE ------------------ */
themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

renderCalendar(currentDate);