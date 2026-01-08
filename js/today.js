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
   PDF AUTO RETRY (4x)
========================= */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;

  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";
  iframe.style.display = "none";

  status.textContent = "Loading Result...";
  status.style.display = "block";

  function tryLoad(){
    if(loaded) return;
    attempt++;

    // 🔥 DIRECT PDF LOAD (NO GVIEW)
    iframe.src = pdfUrl + "?t=" + Date.now();

    iframe.onload = () => {
      if(loaded) return;
      loaded = true;
      iframe.style.display = "block";
      status.style.display = "none";
      downloadBtn.style.display = "inline-block";
    };

    setTimeout(()=>{
      if(loaded) return;

      if(attempt < maxRetry){
        tryLoad();   // silent retry
      }else{
        status.textContent = "Result available but not displayed.";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
      }
    }, 5000);
  }

  tryLoad();

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    status.textContent = "Loading Result...";
    tryLoad();
  };
}

/* =========================
   MAIN LOAD (ALL 3 CARDS)
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
    downloadBtn.href =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";
    downloadBtn.target = "_blank";

    const pdfUrl = downloadBtn.href;

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    // 🔁 Auto background retry start
    loadPDFWithRetry(
      iframe, status, retryBtn, downloadBtn, pdfUrl
    );
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", loadTodayPDF);

</script>
