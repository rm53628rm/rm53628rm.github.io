const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Dear Morning 1PM", prefix:"MN" },
  { title:"☀️ Dear Day 6PM",     prefix:"DN" },
  { title:"🌙 Dear Night 8PM",   prefix:"EN" }
];

/* ================= TIME LOCK (IST) ================= */
const TIME_LOCK = {
  MN: 13, // 1 PM
  DN: 18, // 6 PM
  EN: 20  // 8 PM
};

function isTimeAllowed(prefix){
  const hour = Number(
    new Date().toLocaleString("en-IN", {
      timeZone:"Asia/Kolkata",
      hour:"2-digit",
      hour12:false
    })
  );
  return hour >= TIME_LOCK[prefix];
}

/* ================= INDIA DATE ================= */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

/* ================= DDMMYY ================= */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ================= PDF AUTO RETRY ================= */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;
  let timer = null;

  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.innerHTML = `
  <div class="loading-wrap">
    <span class="mini-spinner"></span>
    <span>Loading Result...</span>
  </div>
`;
  
  status.style.display = "block";

  const loadOnce = () => {
    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();
  };

  const tryLoad = () => {
    if(loaded) return;
    attempt++;
    loadOnce();

    timer = setTimeout(()=>{
      if(loaded) return;

      if(attempt >= maxRetry){
        status.textContent = "Click Retry to load result";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
        return;
      }
      tryLoad();
    },5000);
  };

  iframe.onload = ()=>{
    if(loaded) return;
    loaded = true;
    clearTimeout(timer);

    iframe.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;

    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    status.innerHTML = `
  <div class="loading-wrap">
    <span class="mini-spinner"></span>
    <span>Loading Result...</span>
  </div>
`;
    
    status.style.display = "block";

    tryLoad();
  };

  tryLoad();
}

/* ================= MAIN ================= */
function loadTodayPDF(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw => {

    /* 🔒 TIME LOCK */
    if(!isTimeAllowed(draw.prefix)){
      const lockCard = document.createElement("div");
      lockCard.className = "card";

      let msg = "Result not published yet";
      if(draw.prefix === "MN") msg = "Morning result will be published after 1:00 PM";
      if(draw.prefix === "DN") msg = "Day result will be published after 6:00 PM";
      if(draw.prefix === "EN") msg = "Night result will be published after 8:00 PM";

      lockCard.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="status" style="display:block">${msg}</div>
      `;

      wrap.appendChild(lockCard);
      return; // ⛔ STOP HERE
    }

    /* ✅ NORMAL LOAD */
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

    downloadBtn.href = pdfUrl;

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    loadPDFWithRetry(
      iframe, status, retryBtn, downloadBtn, pdfUrl
    );
  });
}

/* ================= AUTO LOAD ================= */
loadTodayPDF();

