const BASE_PDF_URL = "https://nagalandstatelotterysambad.com/wp-content/uploads/2026/01/";
const BASE_IMG_URL = "https://dhankesari.net/old/img/";

const draws = [
  { title:"🌅 Dear Morning 1PM", prefix:"MD", folder:"1PM", lock:13 },
  { title:"☀️ Dear Day 6PM",     prefix:"DD", folder:"6PM", lock:18 },
  { title:"🌙 Dear Night 8PM",   prefix:"ED", folder:"8PM", lock:20 }
];

/* ================= IST TIME ================= */
function getISTHour(){
  return Number(
    new Date().toLocaleString("en-IN",{
      timeZone:"Asia/Kolkata",
      hour:"2-digit",
      hour12:false
    })
  );
}

/* ================= IST DATE ================= */
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

/* ================= IMAGE LOAD ================= */
function loadImage(img, status, retryBtn, downloadBtn, imgUrl){

  let loaded = false;

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

  const tryLoad = ()=>{
    img.src = imgUrl + "?t=" + Date.now();
  };

  img.onload = ()=>{
    if(loaded) return;
    loaded = true;

    status.style.display = "none";
    img.style.display = "block";
    downloadBtn.style.display = "inline-flex";
  };

  img.onerror = ()=>{
    status.textContent = "Result file not uploaded yet. Please try again later.";
    retryBtn.style.display = "inline-flex";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = ()=>{
    retryBtn.style.display = "none";
    status.innerHTML = `
      <div class="loading-wrap">
        <span class="mini-spinner"></span>
        <span>Loading Result...</span>
      </div>
    `;
    tryLoad();
  };

  tryLoad();
}

/* ================= MAIN ================= */
function loadTodayResult(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();
  const hour = getISTHour();
  const code = fileCode(today);

  draws.forEach(draw=>{

    const card = document.createElement("div");
    card.className = "card";

    /* 🔒 TIME LOCK */
    if(hour < draw.lock){
      card.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="status" style="display:block">
          Result will be published after ${draw.lock}:00
        </div>
      `;
      wrap.appendChild(card);
      return;
    }

    const imgUrl =
      BASE_IMG_URL + draw.folder + "/" +
      draw.prefix + code + ".webp";

    const pdfUrl =
      BASE_PDF_URL +
      draw.prefix.replace("D","N").replace("M","N").replace("E","N") +
      code + ".pdf";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>
    `;

    const img = document.createElement("img");
    img.className = "result-image";

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("a");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";
    downloadBtn.href = pdfUrl;
    downloadBtn.target = "_blank";

    card.append(img, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    loadImage(img, status, retryBtn, downloadBtn, imgUrl);
  });
}

/* ================= AUTO LOAD ================= */
loadTodayResult();
