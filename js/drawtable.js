
/* ========= FIXED DRAW NAMES (MON → SUN) ========= */
const draws = {
  draw1pm: [
    "Dear Dwarka",
    "Dear Godavari",
    "Dear Indus",
    "Dear Mahandi",
    "Dear Meghna",
    "Dear Narmada",
    "Dear Yamuna"
  ],
  draw6pm: [
    "Dear Blitzen",
    "Dear Comet",
    "Dear Cupid",
    "Dear Dancer",
    "Dear Dasher",
    "Dear Donner",
    "Dear Vixen"
  ],
  draw8pm: [
    "Dear Finch",
    "Dear Goose",
    "Dear Pelican",
    "Dear Sandpiper",
    "SeaGull",
    "Dear Stork",
    "Dear Toucan"
  ]
};

/* ========= GET MONDAY OF CURRENT WEEK ========= */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // Sun=0
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/* ========= GET 7 DAYS (MON → SUN) ========= */
function getWeekDates() {
  const dates = [];
  const monday = getMonday(new Date());

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/* ========= FILL TABLE ========= */
function fillWeeklyTable(tableId, drawNames) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";
  const todayStr = new Date().toDateString();
  const dates = getWeekDates();

  dates.forEach((date, index) => {
    const tr = document.createElement("tr");

    if (date.toDateString() === todayStr) {
      tr.classList.add("today-row");
    }

    tr.innerHTML = `
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${date.toLocaleDateString("en-IN", { weekday: "short" })}</td>
      <td>${drawNames[index]}</td>
    `;

    tbody.appendChild(tr);
  });
}

/* ========= LOAD ALL TABLES ========= */
fillWeeklyTable("draw1pm", draws.draw1pm);
fillWeeklyTable("draw6pm", draws.draw6pm);
fillWeeklyTable("draw8pm", draws.draw8pm);

