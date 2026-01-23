document.addEventListener("DOMContentLoaded", function () {

/* ================= BASE URLS ================= */
const BASE_PDF_URL = "https://ldemo.dhankesari.com/download.php?filename=";
const BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  { title:"🌅 Dear Morning 1PM Lottery Sambad", prefix:"MN", imgPrefix:"MD", imgFolder:"1PM", timeText:"1PM" },
  { title:"☀️ Dear Day 6PM Lottery Sambad",     prefix:"DN", imgPrefix:"DD", imgFolder:"6PM", timeText:"6PM" },
  { title:"🌙 Dear Night 8PM Lottery Sambad",   prefix:"EN", imgPrefix:"ED", imgFolder:"8PM", timeText:"8PM" }
];

/* ================= TIME LOCK ================= */
const TIME_LOCK = { MN:13, DN:18, EN:20 };

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

/* ================= DATE ================= */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ================= IMAGE LOADER ================= */
function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl){
  let attempt = 0, loaded = false;
  const maxRetry = 4;

  status.innerHTML = `
    <div class="loading-wrap">
      <span class="mini-spinner"></span> Loading Result...
    </div>
  `;

  function tryLoad(){
    if(loaded) return;
    attempt++;
    img.src = imgUrl + "?t=" + Date.now();

    setTimeout(()=>{
      if(!loaded && attempt >= maxRetry){
        status.textContent = "Click Retry to load result";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
      }
      if(!loaded && attempt < maxRetry) tryLoad();
    },4000);
  }

  img.onload = ()=>{
    loaded = true;
    status.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "inline-flex";
    img.style.display = "block";
  };

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    retryBtn.style.display = "none";
    status.style.display = "block";
    tryLoad();
  };

  tryLoad();
}

/* ================= MAIN ================= */
function loadTodayPDF(){

  const morning = document.getElementById("morningResult");
  const day = document.getElementById("dayResult");
  const night = document.getElementById("nightResult");

  if(!morning || !day || !night){
    console.error("❌ Result containers missing");
    return;
  }

  morning.innerHTML = "";
  day.innerHTML = "";
  night.innerHTML = "";

  const today = getTodayIST();
  const code = fileCode(today);
  const readableDate = today.toDateString();

  draws.forEach(draw => {

    const card = document.createElement("div");
    card.className = "card";

    /* ===== TIME LOCK ===== */
    if(!isTimeAllowed(draw.prefix)){
      card.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="status">Result not published yet</div>
      `;
    } else {

      const img = document.createElement("img");
      img.className = "pdf-frame";
      img.alt = `Today Dear ${draw.timeText} Lottery Result ${readableDate}`;

      const status = document.createElement("div");
      status.className = "status";

      const retryBtn = document.createElement("button");
      retryBtn.textContent = "Retry";

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download PDF";

      const imgUrl = `${BASE_IMG_URL}${draw.imgFolder}/${draw.imgPrefix}${code}.webp`;
      const pdfUrl = `${BASE_PDF_URL}${draw.prefix}${code}.PDF`;

      downloadBtn.onclick = ()=>{
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = draw.prefix + code + ".PDF";
        a.click();
      };

      card.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="date-show">${readableDate}</div>
      `;

      card.append(img, status, retryBtn, downloadBtn);
      loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl);
    }

    if(draw.prefix==="MN") morning.appendChild(card);
    if(draw.prefix==="DN") day.appendChild(card);
    if(draw.prefix==="EN") night.appendChild(card);
  });
}

/* ================= AUTO LOAD ================= */
loadTodayPDF();

});

