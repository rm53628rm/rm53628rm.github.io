/* ================= BASE URLS ================= */
const OLD_BASE_PDF_URL = "https://ldemo.dhankesari.com/oldresultsdownload.php?filename=";
const OLD_BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  { title:"🌅 Dear Morning", prefix:"MN", imgPrefix:"MD", imgFolder:"1PM", timeText:"1PM" },
  { title:"☀️ Dear Day",     prefix:"DN", imgPrefix:"DD", imgFolder:"6PM", timeText:"6PM" },
  { title:"🌙 Dear Night",   prefix:"EN", imgPrefix:"ED", imgFolder:"8PM", timeText:"8PM" }
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
      if(attempt >= MAX_RETRY){
        status.textContent = "Result not available. Retry or Download PDF.";
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

/* ================= LOAD OLD RESULTS ================= */
function loadOldResults(){
  const wrap = document.getElementById("oldResults");
  wrap.innerHTML = "";

  const dateVal = document.getElementById("resultDate").value;
  if(!dateVal){
    alert("Please select a date");
    return;
  }

  const selectedDate = new Date(dateVal);
  const code = fileCode(selectedDate);
  const readableDate = selectedDate.toDateString();

  draws.forEach(draw=>{
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title} - ${readableDate}</h3>
    `;

    /* ===== IMAGE ===== */
    const img = document.createElement("img");
    img.className = "pdf-frame";
    img.alt = `Dear ${draw.timeText} Lottery Result ${readableDate}`;

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

    /* ===== FORCE PDF DOWNLOAD ===== */
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

/* ================= DATE INPUT UI ================= */
const dateInput = document.getElementById("resultDate");
const dateBox = dateInput.closest(".date-box");

function toggleDateText(){
  if(dateInput.value){
    dateBox.classList.add("has-date");
  }else{
    dateBox.classList.remove("has-date");
  }
}

dateInput.addEventListener("change", toggleDateText);
toggleDateText();
