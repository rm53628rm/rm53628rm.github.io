
// ========= FIXED DRAW NAMES =========
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

// ========= GET ACTIVE WEEK (MON → SUN AUTO) =========
function getActiveWeek() {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const monday = new Date(today);

  // 🔥 If Sunday already passed, next week auto start
  if (day === 0) {
    monday.setDate(today.getDate() + 1);
  } else {
    monday.setDate(today.getDate() - (day - 1));
  }

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

// ========= FILL TABLE =========
function fillWeeklyTable(tableId, drawNames) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";
  const todayStr = new Date().toDateString();
  const weekDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const dates = getActiveWeek();

  dates.forEach((date, i) => {
    const tr = document.createElement("tr");

    // 🔥 Highlight today
    if (date.toDateString() === todayStr) {
      tr.classList.add("today-row");
    }

    tr.innerHTML = `
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${weekDays[i]}</td>
      <td>${drawNames[i]}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ========= LOAD =========
fillWeeklyTable("draw1pm", draws.draw1pm);
fillWeeklyTable("draw6pm", draws.draw6pm);
fillWeeklyTable("draw8pm", draws.draw8pm);

