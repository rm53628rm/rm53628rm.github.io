document.addEventListener("DOMContentLoaded", function () {

  /* ===== WEEKLY DRAW NAMES (AS PROVIDED) ===== */
  const WEEKLY_DRAWS = {
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

  /* ===== IST DATE ===== */
  function getISTDate(d = new Date()){
    return new Date(
      d.toLocaleDateString("en-CA", { timeZone:"Asia/Kolkata" })
    );
  }

  const today = getISTDate();

  /* ===== LAST 7 DAYS (TODAY FIRST) ===== */
  function last7Days(){
    let arr = [];
    for(let i = 0; i < 7; i++){
      let d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d);
    }
    return arr;
  }

  const days = last7Days();

  /* ===== FILL TABLES ===== */
  Object.keys(WEEKLY_DRAWS).forEach(tableId => {

    const tbody = document.querySelector(`#${tableId} tbody`);
    if(!tbody) return;

    tbody.innerHTML = "";

    WEEKLY_DRAWS[tableId].forEach((drawName, index) => {

      const d = days[index];
      if(!d) return;

      const tr = document.createElement("tr");

      const isToday =
        d.toDateString() === today.toDateString();

      if(isToday) tr.classList.add("today-row");

      tr.innerHTML = `
        <td>${d.toLocaleDateString("en-IN")}</td>
        <td>${d.toLocaleDateString("en-IN",{ weekday:"short" })}</td>
        <td>${drawName}</td>
      `;

      tbody.appendChild(tr);
    });
  });

});
