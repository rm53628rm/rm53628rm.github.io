const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* ===== INDIA DATE ===== */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

/* ===== DDMMYY ===== */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ===== LOAD PDF ===== */
function loadPDF(iframe, status, retryBtn, downloadBtn, pdfUrl){

  status.textContent = "Loading Result...";
  status.style.display = "block";
  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  iframe.src =
    "https://docs.google.com/gview?embedded=true&url=" +
    encodeURIComponent(pdfUrl) +
    "&t=" + Date.now();

  let loaded = false;

  iframe.onload = ()=>{
    loaded = true;
    iframe.style.display = "block";
    status.style.display = "none";
    downloadBtn.style.display = "inline-block";
  };

  // ⏱️ fallback if iframe blank
  setTimeout(()=>{
    if(!loaded){
      status.textContent = "Result available. Click Retry or Download.";
      retryBtn.style.display = "inline-block";
      downloadBtn.style.display = "inline-block";
    }
  }, 6000);
}

/* ===== MAIN ===== */
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

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("a");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";
    downloadBtn.target = "_blank";

    const pdfUrl =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    downloadBtn.href = pdfUrl + "&t=" + Date.now();

    retryBtn.onclick = ()=>{
      loadPDF(iframe, status, retryBtn, downloadBtn, pdfUrl);
    };

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    // auto load
    loadPDF(iframe, status, retryBtn, downloadBtn, pdfUrl);
  });
}

loadTodayPDF();
