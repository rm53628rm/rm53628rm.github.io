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
    `;

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "Loading PDF...";

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";

    const fileName =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    iframe.src =
      "https://docs.google.com/gview?url=" +
      encodeURIComponent(fileName) +
      "&embedded=true";

    iframe.onload = ()=>{
      status.style.display="none";
    };

    iframe.onerror = ()=>{
      iframe.style.display="none";
      status.textContent="Result Not Published";
    };

    card.append(iframe, status);
    wrap.appendChild(card);
  });
}

loadTodayPDF();

