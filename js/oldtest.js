/* ================= BASE URLS ================= */
const OLD_BASE_PDF_URL = "https://ldemo.dhankesari.com/oldresultsdownload.php?filename=";
const OLD_BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  {
    title: "🌅 Dear Morning",
    prefix: "MN",
    imgPrefix: "MD",
    imgFolder: "1PM",
    timeText: "1PM",
    target: "morningResults"
  },
  {
    title: "☀️ Dear Day",
    prefix: "DN",
    imgPrefix: "DD",
    imgFolder: "6PM",
    timeText: "6PM",
    target: "dayResults"
  },
  {
    title: "🌙 Dear Night",
    prefix: "EN",
    imgPrefix: "ED",
    imgFolder: "8PM",
    timeText: "8PM",
    target: "nightResults"
  }
];

/* ================= DATE → DDMMYY ================= */
function fileCode(d) {
  return (
    String(d.getDate()).padStart(2, "0") +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getFullYear()).slice(-2)
  );
}

/* ================= IMAGE LOAD WITH RETRY ================= */
function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl) {
  let attempt = 0;
  const MAX_RETRY = 4;
  let loaded = false;
  let timer;

  img.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.innerHTML = `
    <div class="loading-wrap">
      <span class="mini-spinner"></span>
      <span>Loading Result...</span>
    </div>
  `;
  status.style.display = "block";

  function tryLoad() {
    if (loaded) return;
    attempt++;
    img.src = imgUrl + "?t=" + Date.now();

    timer = setTimeout(() => {
      if (loaded) return;
      if (attempt >= MAX_RETRY) {
        status.textContent = "Result not available. Retry or Download PDF.";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
        return;
      }
      tryLoad();
    }, 4000);
  }

  img.onload = () => {
    if (loaded) return;
    loaded = true;
    clearTimeout(timer);

    img.style.display = "block";
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

/* ================= LOAD RESULTS (CORE) ================= */
function loadOldResults(selectedDate) {
  const code = fileCode(selectedDate);
  const readableDate = selectedDate.toDateString();

  draws.forEach(draw => {
    const wrap = document.getElementById(draw.target);
    if (!wrap) return;

    wrap.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<h3>${draw.title} - ${readableDate}</h3>`;

    const img = document.createElement("img");
    img.className = "pdf-frame";
    img.alt = `${draw.title} Lottery Result ${readableDate}`;

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    const imgUrl =
      OLD_BASE_IMG_URL +
      draw.imgFolder + "/" +
      draw.imgPrefix + code + ".webp";

    const pdfUrl =
      OLD_BASE_PDF_URL +
      draw.prefix + code + ".PDF";

    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = draw.prefix + code + ".PDF";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    card.append(img, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl);
  });
}

/* ================= YESTERDAY AUTO LOAD ================= */
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

/* ================= DATE INPUT HANDLING ================= */
const dateInput = document.getElementById("resultDate");

dateInput.addEventListener("change", function () {
  if (this.value) {
    loadOldResults(new Date(this.value));
  }
});

/* ================= ON PAGE LOAD ================= */
window.addEventListener("load", () => {
  const yesterday = getYesterday();
  dateInput.valueAsDate = yesterday;
  loadOldResults(yesterday);
});
