const dateInput = document.getElementById("dateInput");
const datepicker = document.getElementById("datepicker");
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();
let selectedDate = null;

dateInput.addEventListener("click", () => {
  datepicker.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!datepicker.contains(e.target) && e.target !== dateInput) {
    datepicker.classList.remove("active");
  }
});

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
    const empty = document.createElement("div");
    empty.classList.add("inactive");
    daysContainer.appendChild(empty);
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;

    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    if (
      selectedDate &&
      i === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    ) {
      day.classList.add("selected");
    }

    day.addEventListener("click", () => {
      selectedDate = new Date(year, month, i);
      dateInput.value = selectedDate.toLocaleDateString();
      datepicker.classList.remove("active");
      renderCalendar(currentDate);
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