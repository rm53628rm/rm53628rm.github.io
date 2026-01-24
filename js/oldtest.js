/* ================= BASE URLS ================= */
const OLD_BASE_PDF_URL = "https://ldemo.dhankesari.com/oldresultsdownload.php?filename=";
const OLD_BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  {
    id: "morningSection",
    title: "🌅 Dear Morning 1PM",
    prefix: "MN",
    imgPrefix: "MD",
    imgFolder: "1PM",
    timeText: "1PM"
  },
  {
    id: "daySection",
    title: "☀️ Dear Day 6PM",
    prefix: "DN",
    imgPrefix: "DD",
    imgFolder: "6PM",
    timeText: "6PM"
  },
  {
    id: "nightSection",
    title: "🌙 Dear Night 8PM",
    prefix: "EN",
    imgPrefix: "ED",
    imgFolder: "8PM",
    timeText: "8PM"
  }
];

/* ================= DATE → DDMMYY ================= */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ================= IMAGE LOAD WITH RETRY ================= */
function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl){
  let attempt = 0;
  const MAX_RETRY = 4;
  let loaded = false;
  let timer;

  img.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.textContent = "Loading Result...";
  status.style.display = "block";

  function tryLoad(){
    if(loaded) return;
    attempt++;
    img.src = imgUrl + "?t=" + Date.now();

    timer = setTimeout(()=>{
      if(loaded) return;
      if(attempt >= MAX_RETRY){
        status.textContent = "Result not available";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
        return;
      }
      tryLoad();
    }, 4000);
  }

  img.onload = ()=>{
    loaded = true;
    clearTimeout(timer);
    img.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    tryLoad();
  };

  tryLoad();
}

/* ================= LOAD OLD RESULTS ================= */
function loadOldResults(date){
  const code = fileCode(date);
  const readableDate = date.toDateString();

  draws.forEach(draw=>{
    const box = document.getElementById(draw.id);
    if(!box) return;

    box.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${readableDate}</div>

      <img class="pdf-frame"
        alt="Dear ${draw.timeText} Lottery Result ${readableDate}">

      <div class="status"></div>

      <button class="refresh-btn retry">Retry</button>
      <button class="refresh-btn download">Download PDF</button>
    `;

    const img = box.querySelector(".pdf-frame");
    const status = box.querySelector(".status");
    const retryBtn = box.querySelector(".retry");
    const downloadBtn = box.querySelector(".download");

    const imgUrl =
      OLD_BASE_IMG_URL + draw.imgFolder + "/" +
      draw.imgPrefix + code + ".webp";

    const pdfUrl =
      OLD_BASE_PDF_URL + draw.prefix + code + ".PDF";

    downloadBtn.onclick = ()=>{
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = draw.prefix + code + ".PDF";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl);
  });
}

/* ================= DEFAULT = YESTERDAY ================= */
const dateInput = document.getElementById("resultDate");
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

dateInput.valueAsDate = yesterday;
loadOldResults(yesterday);

/* ================= DATE CHANGE ================= */
dateInput.addEventListener("change", ()=>{
  if(dateInput.value){
    loadOldResults(new Date(dateInput.value));
  }
});
