const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* DDMMYY */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* INDIA DATE */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})
  );
}

/* LOAD SINGLE PDF (WITH RETRY) */
function loadPDF(card, draw, date){
  const status = card.querySelector(".status");
  const iframe = card.querySelector("iframe");
  const retryBtn = card.querySelector(".retry-btn");

  status.style.display = "block";
  status.textContent = "Loading PDF...";
  iframe.style.display = "block";
  retryBtn.style.display = "none";

  const fileName =
    BASE_URL + draw.prefix + fileCode(date) + ".PDF";

  // FORCE RELOAD (important)
  iframe.src = "";
  setTimeout(()=>{
    iframe.src =
      "https://docs.google.com/gview?url=" +
      encodeURIComponent(fileName) +
      "&embedded=true";
  }, 300);

  let loaded = false;

  iframe.onload = ()=>{
    loaded = true;
    status.style.display = "none";
  };

  // SAFETY TIMEOUT (random missing fix)
  setTimeout(()=>{
    if(!loaded){
      iframe.style.display = "none";
      status.textContent = "Result Not Published";
      retryBtn.style.display = "inline-block";
    }
  }, 6000);
}

function loadTodayPDF(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw=>{

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>

      <iframe class="pdf-frame"></iframe>

      <div class="status">Loading PDF...</div>

      <button class="retry-btn" style="display:none">
        🔄 Retry
      </button>
    `;

    wrap.appendChild(card);

    loadPDF(card, draw, today);

    card.querySelector(".retry-btn").onclick = ()=>{
      loadPDF(card, draw, today);
    };
  });
}

document.addEventListener("DOMContentLoaded", loadTodayPDF);

