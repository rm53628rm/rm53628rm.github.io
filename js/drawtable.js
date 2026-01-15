
console.log("Premium weekly draw table loaded ✅");


document.addEventListener("DOMContentLoaded", function () {


/* ===== WEEKLY DRAW MASTER (MON → SUN) ===== */
const WEEKLY_DRAWS = {
  draw1pm: [
    "Dear Dwarka",   // Monday
    "Dear Godavari", // Tuesday
    "Dear Indus",    // Wednesday
    "Dear Mahandi",  // Thursday
    "Dear Meghna",   // Friday
    "Dear Narmada",  // Saturday
    "Dear Yamuna"    // Sunday
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

/* ===== IST TODAY ===== */
function getISTToday(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

const today = getISTToday();

/* ===== MONDAY OF CURRENT WEEK ===== */
function getMonday(d){
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
}

const monday = getMonday(today);

/* ===== BUILD WEEK ===== */
function buildWeek(){
  let arr = [];
  for(let i=0;i<7;i++){
    let d = new Date(monday);
    d.setDate(monday.getDate() + i);
    arr.push(d);
  }
  return arr;
}

const weekDates = buildWeek();

/* ===== FILL TABLES ===== */
Object.keys(WEEKLY_DRAWS).forEach(id => {

  const tbody = document.querySelector(`#${id} tbody`);
  if(!tbody) return;

  tbody.innerHTML = "";

  WEEKLY_DRAWS[id].forEach((drawName, index) => {

    const d = weekDates[index];
    const tr = document.createElement("tr");

    if(d.toDateString() === today.toDateString()){
      tr.classList.add("today-row");
    }

    tr.innerHTML = `
      <td>${d.toLocaleDateString("en-IN")}</td>
      <td>${d.toLocaleDateString("en-IN",{ weekday:"long" })}</td>
      <td>${drawName}</td>
    `;

    tbody.appendChild(tr);
  });
});
  
