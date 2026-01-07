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
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

/* ⏳ delay helper */
function wait(ms){
  return new Promise(r=>setTimeout(r, ms));
}

async function loadTodayPDF(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  for(const draw of draws){

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
    iframe.loading = "lazy";

    const pdfURL =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    /* Google Viewer */
    iframe.src =
      "https://docs.google.com/gview?url=" +
      encodeURIComponent(pdfURL) +
      "&embedded=true";

    iframe.onload = ()=>{
      status.style.display="none";
    };

    /* fallback text (iframe error unreliable) */
    setTimeout(()=>{
      if(status.style.display !== "none"){
        status.innerHTML =
          `PDF not loading?
          <br><a href="${pdfURL}" target="_blank">Open PDF</a>`;
      }
    }, 4000);

    card.append(iframe, status);
    wrap.appendChild(card);

    /* 🔒 VERY IMPORTANT */
    await wait(1200);   // one-by-one load
  }
}

loadTodayPDF();

