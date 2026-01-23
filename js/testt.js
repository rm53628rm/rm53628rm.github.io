/* ================= BASE URLS ================= */
const BASE_PDF_URL = "https://ldemo.dhankesari.com/download.php?filename=";
const BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  { title:"🌅 Dear Morning 1PM Lottery Sambad", prefix:"MN", imgPrefix:"MD", imgFolder:"1PM", timeText:"1PM" },
  { title:"☀️ Dear Day 6PM Lottery Sambad",     prefix:"DN", imgPrefix:"DD", imgFolder:"6PM", timeText:"6PM" },
  { title:"🌙 Dear Night 8PM Lottery Sambad",   prefix:"EN", imgPrefix:"ED", imgFolder:"8PM", timeText:"8PM" }
];

/* ================= TIME LOCK (IST) ================= */
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

/* ================= TODAY DATE (IST) ================= */
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

/* ================= IMAGE LOAD WITH RETRY ================= */
function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl){
  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;
  let timer = null;

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

    timer = setTimeout(()=>{
      if(loaded) return;
      if(attempt >= maxRetry){
        status.textContent = "Click Retry to load result";
        retryBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
        return;
      }
      tryLoad();
    }, 4000);
  }

  img.onload = ()=>{
    if(loaded) return;
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
function loadTodayPDF(){
  if(draw.prefix === "MN"){
  document.getElementById("morningResult").appendChild(card);
}
if(draw.prefix === "DN"){
  document.getElementById("dayResult").appendChild(card);
}
if(draw.prefix === "EN"){
  document.getElementById("nightResult").appendChild(card);
}
  
  wrap.innerHTML = "";

  const today = getTodayIST();
  const code = fileCode(today);
  const readableDate = today.toDateString();

  draws.forEach(draw=>{
    /* ===== TIME LOCK ===== */
    if(!isTimeAllowed(draw.prefix)){
      const lockCard = document.createElement("div");
      lockCard.className = "card";

      let msg = "Result not published yet";
      if(draw.prefix==="MN") msg="Morning result will be published after 1:00 PM";
      if(draw.prefix==="DN") msg="Day result will be published after 6:00 PM";
      if(draw.prefix==="EN") msg="Night result will be published after 8:00 PM";

      lockCard.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="status" style="display:block">${msg}</div>
      `;
      wrap.appendChild(lockCard);
      return;
    }

    /* ===== CARD ===== */
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${readableDate}</div>
    `;
    const seoText = document.createElement("div");
seoText.className = "seo-text";

seoText.innerHTML = `
  <p>
  Dear${draw.timeText} lottery result for today has been published.
    Check the official <strong>${draw.timeText} Lottery Sambad today result</strong>
    image below and download the PDF for verification.
    DhankesariToday.in provides accurate Nagaland State Lottery results.
  </p>
`;

card.appendChild(seoText);
    

    /* ===== IMAGE ===== */
    const img = document.createElement("img");
    img.className = "pdf-frame";

    /* 🔥 SEO FIX: ALT ATTRIBUTE */
    img.alt = `Today Dear ${draw.timeText} Lottery Result ${readableDate},You Can Download PDF File Link Below.`;

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    const imgUrl =
      BASE_IMG_URL +
      draw.imgFolder + "/" +
      draw.imgPrefix + code + ".webp";

    const pdfUrl =
      BASE_PDF_URL +
      draw.prefix + code + ".PDF";

    /* ===== FORCE DOWNLOAD ===== */
    downloadBtn.onclick = ()=>{
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

/* ================= AUTO LOAD ================= */
loadTodayPDF();
