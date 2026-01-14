
// ========= FIXED DRAW NAMES (MON → SUN ORDER) =========
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

// ========= GET CURRENT WEEK (MONDAY → SUNDAY) =========
function getCurrentWeek() {
  const week = [];
  const today = new Date();
  const day = today.getDay(); // 0 = Sun
  const monday = new Date(today);

  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

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
  const weekDays = getCurrentWeek();
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  weekDays.forEach((date, index) => {
    const tr = document.createElement("tr");

    // 🔥 Highlight Today
    if (date.toDateString() === todayStr) {
      tr.classList.add("today-row");
    }

    tr.innerHTML = `
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${days[index]}</td>
      <td>${drawNames[index]}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ========= LOAD TABLES =========
fillWeeklyTable("draw1pm", draws.draw1pm);
fillWeeklyTable("draw6pm", draws.draw6pm);
fillWeeklyTable("draw8pm", draws.draw8pm);

