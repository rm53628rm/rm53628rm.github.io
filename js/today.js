<script>
/* =========================
   CONFIG
========================= */
const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* =========================
   INDIA DATE (IST)
========================= */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{
      timeZone:"Asia/Kolkata"
    })
  );
}

/* =========================
   DDMMYY FORMAT
========================= */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* =========================
   LOAD PDF WITH RETRY
========================= */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, fullBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;

  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";
  fullBtn.style.display = "none";

  status.style.display = "flex";
  status.innerHTML = `
    <div class="loader"></div>
    <div class="loading-text">Loading Result…</div>
  `;

  function tryLoad(){
    if(loaded) return;
    attempt++;

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();

    iframe.onload = ()=>{
      if(loaded) return;
      loaded = true;
      status.style.display = "none";
      iframe.style.display = "block";
      downloadBtn.style.display = "inline-block";
      fullBtn.style.display = "inline-block";
    };

    setTimeout(()=>{
      if(loaded) return;

      if(attempt < maxRetry){
        tryLoad(); // silent retry
      }else{
        status.style.display = "block";
        status.innerHTML = "Result available but not displayed.";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
        fullBtn.style.display = "inline-block";
      }
    }, 5000);
  }

  tryLoad();

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    fullBtn.style.display = "none";

    status.style.display = "flex";
    status.innerHTML = `
      <div class="loader"></div>
      <div class="loading-text">Loading Result…</div>
    `;
    tryLoad();
  };

  /* =========================
     FULLSCREEN
  ========================= */
  fullBtn.onclick = ()=>{
    if(iframe.requestFullscreen){
      iframe.requestFullscreen();
    }else if(iframe.webkitRequestFullscreen){
      iframe.webkitRequestFullscreen();
    }
  };
}

/* =========================
   MAIN LOAD
========================= */
function loadTodayPDF(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw => {

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

    const fullBtn = document.createElement("button");
    fullBtn.className = "refresh-btn fullscreen-btn";
    fullBtn.textContent = "Fullscreen";

    const pdfUrl =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    downloadBtn.href = pdfUrl;

    card.append(
      iframe,
      status,
      retryBtn,
      downloadBtn,
      fullBtn
    );

    wrap.appendChild(card);

    loadPDFWithRetry(
      iframe,
      status,
      retryBtn,
      downloadBtn,
      fullBtn,
      pdfUrl
    );
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", loadTodayPDF);
</script>
