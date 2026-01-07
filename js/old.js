const BASE_URL = "/images/";

const draws = [
  { title:"🌅 Morning", prefix:"md" },
  { title:"☀️ Day",     prefix:"dd" },
  { title:"🌙 Night",   prefix:"nd" }
];

/* FILE NAME CODE */
function code(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ELEMENTS */
const oldDateInput    = document.getElementById("oldDate");
const datePlaceholder = document.getElementById("datePlaceholder");
const wrap            = document.getElementById("oldResults");

/* ===== INIT CARDS (ALWAYS SHOW) ===== */
function initCards(){
  wrap.innerHTML = "";

  draws.forEach(x=>{
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${x.title}</h3>
      <div class="date-show">Select a date</div>
    `;

    const img = new Image();
    const status = document.createElement("div");
    const btn = document.createElement("button");

    img.style.display = "none";
    status.className = "status";
    status.textContent = "Please select old result date";

    btn.className = "refresh-btn";
    btn.textContent = "Refresh";
    btn.style.display = "none";

    card.append(img, status, btn);
    wrap.appendChild(card);

    /* store refs */
    card._img = img;
    card._status = status;
    card._btn = btn;
    card._prefix = x.prefix;
  });
}

/* ===== LOAD IMAGE ===== */
function loadImage(card, date){
  const img = card._img;
  const status = card._status;
  const btn = card._btn;

  const file =
    BASE_URL + card._prefix + code(date) + ".jpg";

  img.src = file + "?v=" + Date.now();

  img.onload = ()=>{
    img.style.display = "block";
    status.style.display = "none";
    btn.style.display = "none";
  };

  img.onerror = ()=>{
    img.style.display = "none";
    status.textContent = "Result Not Published";
    status.style.display = "block";
    btn.style.display = "inline-block";
  };

  btn.onclick = ()=> img.src = file + "?v=" + Date.now();
}

/* ===== DATE CHANGE ===== */
oldDateInput.addEventListener("change", ()=>{

  if(!oldDateInput.value){
    datePlaceholder.style.display = "block";
    initCards();
    return;
  }

  datePlaceholder.style.display = "none";

  const d = new Date(oldDateInput.value);

  [...wrap.children].forEach(card=>{
    card.querySelector(".date-show").textContent =
      oldDateInput.value;

    loadImage(card, d);
  });
});

/* ===== START ===== */
datePlaceholder.style.display = "block";
initCards();

