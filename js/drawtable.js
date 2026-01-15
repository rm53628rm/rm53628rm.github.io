document.addEventListener("DOMContentLoaded", function () {

  // ================= DRAW NAMES =================
  const DRAW_NAMES = {
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

  // ================= GET MONDAY =================
  function getCurrentWeekMonday() {
    const now = new Date();
    const day = now.getDay(); // 0=Sunday
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0,0,0,0);
    return monday;
  }

  // ================= FILL TABLE =================
  function fillWeeklyTable(tableId, drawList) {

    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = "";

    const monday = getCurrentWeekMonday();
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0,0,0,0);

      const tr = document.createElement("tr");

      // 🔥 TODAY HIGHLIGHT
      if (date.getTime() === today.getTime()) {
        tr.classList.add("today-row");
      }

      tr.innerHTML = `
        <td>${date.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
        <td>${date.toLocaleDateString("en-IN",{weekday:"short"})}</td>
        <td>${drawList[i]}</td>
      `;

      tbody.appendChild(tr);
    }
  }

  // ================= LOAD ALL =================
  fillWeeklyTable("draw1pm", DRAW_NAMES.draw1pm);
  fillWeeklyTable("draw6pm", DRAW_NAMES.draw6pm);
  fillWeeklyTable("draw8pm", DRAW_NAMES.draw8pm);

});
