/* ================= BASE PDF URLS ================= */
const BASE_PDF_URL_NORMAL = "https://mizoramlottery.com/Home/PrintToday?dateTime=";
const BASE_PDF_URL_11AM   = "https://mizoramlottery.com/Home/PrintsToday?dateTime=";

/* ================= DRAWS CONFIG ================= */
const draws = [
  {
    title: "🕚 11 AM Draw",
    hour: 11,
    label: "11:00 AM",
    timeCode: 10,
    sectionId: "section11",
    special: true
  },
  {
    title: "🕛 12 PM Draw",
    hour: 12,
    label: "12:00 PM",
    timeCode: 11,
    sectionId: "section12",
    special: false
  },
  {
    title: "🕓 4 PM Draw",
    hour: 16,
    label: "4:00 PM",
    timeCode: 3,
    sectionId: "section4",
    special: false
  },
  {
    title: "🕖 7 PM Draw",
    hour: 19,
    label: "7:00 PM",
    timeCode: 7,
    sectionId: "section7",
    special: false
  },
  {
    title: "🕘 9 PM Draw",
    hour: 21,
    label: "9:00 PM",
    timeCode: 9,
    sectionId: "section9",
    special: false
  }
];

/* ================= IST CURRENT HOUR ================= */
function getISTHour(){
  return Number(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false
    })
  );
}

/* ================= TODAY DATE (IST) ================= */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  );
}

/* ================= PDF LOAD WITH RETRY ================= */
function loadPDFWithRetry(frame, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;
  let timer = null;

  frame.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.innerHTML = `
    <div class="loading-wrap">
      <span class="mini-spinner"></span>
      <span>Loading Result...</span>
    </div>
  `;
  status.style.display = "block";

  function tryLoad(){
    if(loaded) return;
    attempt++;

    frame.src = pdfUrl + "&t=" + Date.now();

    timer = setTimeout(() => {
      if(loaded) return;

      if(attempt >= maxRetry){
        status.textContent =
          "Result Not Published. Click Retry After Sometime";
        retryBtn.style.display = "inline-flex";
        return;
      }
      tryLoad();
    }, 4000);
  }

  frame.onload = () => {
    if(loaded) return;
    loaded = true;
    clearTimeout(timer);

    frame.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = () => {
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

/* ================= MAIN FUNCTION ================= */
function loadTodayResults(){

  const currentHour = getISTHour();
  const today = getTodayIST();
  const readableDate = today.toDateString();

  draws.forEach(draw => {

    const wrap = document.getElementById(draw.sectionId);
    if(!wrap) return;

    wrap.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${readableDate}</div>
    `;

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";
    iframe.setAttribute("loading", "lazy");

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    /* ===== TIME LOCK 🔒 ===== */
    if(currentHour < draw.hour){
      status.style.display = "block";
      status.textContent =
        `Result will be published after ${draw.label}`;
      return;
    }

    /* ===== PDF URL ===== */
    const pdfUrl = draw.special
      ? BASE_PDF_URL_11AM + draw.timeCode
      : BASE_PDF_URL_NORMAL + draw.timeCode;

    downloadBtn.onclick = () => {
      window.open(pdfUrl, "_blank");
    };

    loadPDFWithRetry(
      iframe,
      status,
      retryBtn,
      downloadBtn,
      pdfUrl
    );
  });
}

/* ================= AUTO LOAD ================= */
loadTodayResults();
