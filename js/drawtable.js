
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

// ========= GET NEXT 7 DAYS =========
function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

// ========= FILL TABLE =========
function fillWeeklyTable(tableId, drawNames) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";
  const today = new Date().toDateString();
  const days = getNext7Days();

  days.forEach((date, index) => {
    const tr = document.createElement("tr");

    // 🔥 highlight today
    if (date.toDateString() === today) {
      tr.style.background = "#1e3a8a";
      tr.style.color = "#ffffff";
      tr.style.fontWeight = "700";
    }

    tr.innerHTML = `
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${date.toLocaleDateString("en-IN", { weekday: "long" })}</td>
      <td>${drawNames[index]}</td>
    `;

    tbody.appendChild(tr);
  });
}

// ========= LOAD ALL =========
fillWeeklyTable("draw1pm", draws.draw1pm);
fillWeeklyTable("draw6pm", draws.draw6pm);
fillWeeklyTable("draw8pm", draws.draw8pm);
               
