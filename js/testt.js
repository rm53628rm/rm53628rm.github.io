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

/* ================= IMAGE LOAD WITH RETRY ================= */
function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl){
  let attempt = 0, loaded = false;
  const maxRetry = 4;

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
  function tryLoad(){
    if(loaded) return;
    attempt++;
    img.src = imgUrl + "?t=" + Date.now();

    setTimeout(()=>{
      if(loaded) return;
      if(attempt >= maxRetry){
        status.textContent = "Click Retry to load result";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
      } else {
        tryLoad();
      }
    }, 4000);
  }

  img.onload = ()=>{
    loaded = true;
    img.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    status.style.display = "block";
    
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

  const morning = document.getElementById("morningResult");
  const day = document.getElementById("dayResult");
  const night = document.getElementById("nightResult");

  if(!morning || !day || !night){
    console.error("Result container missing");
    return;
  }

  morning.innerHTML = "";
  day.innerHTML = "";
  night.innerHTML = "";

  const today = getTodayIST();
  const code = fileCode(today);
  const readableDate = today.toDateString();

  draws.forEach(draw => {

    let target;
    if(draw.prefix==="MN") target = morning;
    if(draw.prefix==="DN") target = day;
    if(draw.prefix==="EN") target = night;
    if(!target) return;

    /* ===== TIME LOCK ===== */
    if(!isTimeAllowed(draw.prefix)){
      

  const status = document.createElement("div");
  status.className = "status";
  status.style.display = "block";
  status.style.padding = "12px";
  status.style.fontWeight = "600";

  if(draw.prefix==="MN"){
    status.textContent = "Morning result will be published after 1:00 PM";
  }
  if(draw.prefix==="DN"){
    status.textContent = "Day result will be published after 6:00 PM";
  }
  if(draw.prefix==="EN"){
    status.textContent = "Night result will be published after 8:00 PM";
  }

  target.appendChild(status);
  return;
      }
      
      `;
      return;
    }

    /* ===== DATE ===== */
    const dateDiv = document.createElement("div");
    dateDiv.className = "date-show";
    dateDiv.textContent = readableDate;

    /* ===== IMAGE ===== */
    const img = document.createElement("img");
    img.className = "pdf-frame";
    img.alt = `Today Dear ${draw.timeText} Lottery Result ${readableDate}`;

    /* ===== STATUS ===== */
    const status = document.createElement("div");
    status.className = "status";

    /* ===== BUTTONS ===== */
    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    const imgUrl =
      BASE_IMG_URL + draw.imgFolder + "/" + draw.imgPrefix + code + ".webp";

    const pdfUrl =
      BASE_PDF_URL + draw.prefix + code + ".PDF";

    downloadBtn.onclick = ()=>{
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = draw.prefix + code + ".PDF";
      a.click();
    };

    /* ===== DIRECT APPEND (NO EXTRA CARD) ===== */
    target.append(
      dateDiv,
      img,
      status,
      retryBtn,
      downloadBtn
    );

    loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl);
  });
}

/* ================= AUTO LOAD ================= */
loadTodayPDF();

});
