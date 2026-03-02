// Load saved theme
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}
const dateInput = document.getElementById("dateInput");
const datepicker = document.getElementById("datepicker");
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const eventText = document.getElementById("eventText");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");
const eventTitle = document.getElementById("eventTitle");
const urgentBtn = document.getElementById("urgentBtn");
const themeToggleBtn = document.getElementById("theme-toggle");


let currentDate = new Date();
let selectedDate = null;
let events = {};
try {
    events = JSON.parse(localStorage.getItem("calendarEvents")) || {};
} catch (e) {
    console.error("Could not parse calendar events from local storage", e);
}
dateInput.addEventListener("click", () => {
  datepicker.classList.toggle("active");
});

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}
function getEventCategory() {
  let category = document.querySelector('input[name="eventCategory"]:checked');
  return category ? category.value : null;
}
function displayEvents(date) {
  eventList.innerHTML = "";
  const key = formatDateKey(date);
  eventTitle.textContent = `Events for ${date.toDateString()}`;

  if (events[key]) {
    events[key].forEach((event, index )=> {
      const div = document.createElement("div");
      div.className = "event-item";
      div.textContent = event;
      div.dataset.category = event.category; // Store category on the element
      div.classList.add(`event-${event.category}`); // Add category class for styling
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.marginLeft = "5px"; // Add some spacing
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event from bubbling to the event item
        events[key].splice(index, 1); // Remove the event from the array
        localStorage.setItem("calendarEvents", JSON.stringify(events)); // Update local storage
        displayEvents(selectedDate); // Re-render the events
      });
      div.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.marginLeft = "5px";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newEventText = prompt("Edit event:", event.text);
        if (newEventText !== null) {
          // If the user clicks "cancel", the prompt returns null
          events.text = newEventText.trim();
          localStorage.setItem("calendarEvents", JSON.stringify(events));
          displayEvents(selectedDate);
        }
      });
      div.appendChild(editBtn);
      eventList.appendChild(div);
    });
  }
}

function hasEvents(date) {
  const key = formatDateKey(date);
  return events[key] && events[key].length > 0;
}

addEventBtn.addEventListener("click", () => {
  if (!selectedDate || !eventText.value.trim()) return;

  const key = formatDateKey(selectedDate);
  if (!events[key]) events[key] = [];

  let eventCategory = getEventCategory();

  events[key].push({
    text: eventText.value.trim(),
    category: eventCategory || 'default',
  });
  localStorage.setItem("calendarEvents", JSON.stringify(events));

  eventText.value = "";
  displayEvents(selectedDate);
});

urgentBtn.addEventListener("click", () => {
  if (!selectedDate) return;

  const key = formatDateKey(selectedDate);

  if (events[key] && events[key].length > 0) {
    // Assuming you want to mark all events on that day as urgent
    events[key].forEach(event => {
      event.category = 'urgent';
    });

    localStorage.setItem("calendarEvents", JSON.stringify(events));
    displayEvents(selectedDate);
    renderCalendar(currentDate); // Re-render to update dots
  }
});


function clearEventCategory(){
  let selectedCategory = document.querySelector('input[name="eventCategory"]:checked');
 if (selectedCategory){
  selectedCategory.checked = false;
 }

}

function renderCalendar(date) {
  daysContainer.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  monthYear.textContent =
    date.toLocaleString("default", { month: "long" }) + " " + year;

  for (let i = 0; i < firstDay; i++) {
    daysContainer.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;

    const thisDate = new Date(year, month, i);

    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    if (
      selectedDate &&
      thisDate.toDateString() === selectedDate.toDateString()
    ) {
      day.classList.add("selected");
    }

    day.addEventListener("click", () => {
      selectedDate = thisDate;
      dateInput.value = selectedDate.toLocaleDateString();
      datepicker.classList.remove("active");
      renderCalendar(currentDate);
      displayEvents(selectedDate);
    });

    daysContainer.appendChild(day);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);

// Theme Toggle Functionality
themeToggleBtn.addEventListener('click', () => {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light'); // Store the theme preference
    themeToggleBtn.textContent = "Dark Mode";
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); // Store the theme preference
    themeToggleBtn.textContent = "Light Mode";
  }
});

//Check for theme preference at page load
document.addEventListener('DOMContentLoaded', function() {
  let theme = localStorage.getItem('theme');
  if (theme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggleBtn.textContent = "Light Mode";
  } else {
  themeToggleBtn.textContent = "Dark Mode";
  }
 });