
{

  /* ===============================
   WEEKLY DRAW TABLE – FINAL
   Monday → Sunday
   Today Highlight
================================ */

/* ===== FIXED DRAW NAMES ===== */
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
    "Dear SeaGull",
    "Dear Stork",
    "Dear Toucan"
  ]
};

/* ===== DATE COMPARE FIX ===== */
function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/* ===== CURRENT WEEK (MON → SUN) ===== */
function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const monday = new Date(today);

  // convert to Monday
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

/* ===== FILL TABLE ===== */
function fillWeeklyTable(tableId, drawNames) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  const today = new Date();
  const week = getCurrentWeek();

  week.forEach((date, index) => {
    const tr = document.createElement("tr");

    /* 🔥 TODAY HIGHLIGHT */
    if (isSameDate(date, today)) {
      tr.classList.add("today-row");
    }

    tr.innerHTML = `
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${date.toLocaleDateString("en-IN", { weekday: "long" })}</td>
      <td>${drawNames[index]}</td>
    `;

    tbody.appendChild(tr);
  });
}

/* ===== LOAD ALL TABLES ===== */
document.addEventListener("DOMContentLoaded", () => {
  fillWeeklyTable("draw1pm", draws.draw1pm);
  fillWeeklyTable("draw6pm", draws.draw6pm);
  fillWeeklyTable("draw8pm", draws.draw8pm);
});
  
