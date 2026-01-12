const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Dear Morning 1PM", prefix:"MN" },
  { title:"☀️ Dear Day 6PM",     prefix:"DN" },
  { title:"🌙 Dear Night 8PM",   prefix:"EN" }
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

/* ===== PDF AUTO RETRY (NO FALLBACK) ===== */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;
  let retryTimer = null;

  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.textContent = "Loading Result...";
  status.style.display = "block";

  const loadOnce = () => {
    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();
  };

  const tryLoad = () => {
    if (loaded) return;

    attempt++;
    loadOnce();

    retryTimer = setTimeout(() => {
      if (loaded) return;

      if (attempt >= maxRetry) {
        // ⛔ stop background retry
        status.textContent = "Click Retry to load result";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
        return;
      }

      tryLoad();
    }, 5000);
  };

  iframe.onload = () => {
    if (loaded) return;
    loaded = true;

    clearTimeout(retryTimer);

    iframe.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none"; // 🔥 hide retry on success
    downloadBtn.style.display = "inline-block";
  };

  // 🔁 manual retry – sirf isi card ka
  retryBtn.onclick = () => {
    loaded = false;
    attempt = 0;

    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";

    status.textContent = "Loading Result...";
    status.style.display = "block";

    tryLoad();
  };

  // 🔥 start auto retry
  tryLoad();
}

/* ===== MAIN ===== */
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

loadTodayPDF();
