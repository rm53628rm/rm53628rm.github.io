const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* ===== INDIA DATE (FIXED) ===== */
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

/* ===== CHECK PDF EXISTS (REAL) ===== */
async function pdfExists(url){
  try{
    const r = await fetch(url,{
      method:"HEAD",
      cache:"no-store",
      mode:"no-cors"   // 🔥 Chrome safe
    });
    return true; // agar server reply diya → file hai
  }catch{
    return false;
  }
}

/* ===== FORCE LOAD PDF (NO MISS) ===== */
async function loadPDF({
  iframe,
  status,
  retryBtn,
  pdfUrl,
  attempt = 1,
  maxAttempt = 3
}){

  status.textContent = `Loading Result${attempt>1?" (retry "+attempt+")":""}...`;
  status.style.display = "block";
  retryBtn.style.display = "none";
  iframe.style.display = "none";

  const exists = await pdfExists(pdfUrl);

  if(!exists){
    status.textContent = "Result Not Published";
    return;
  }

  /* 🔥 HARD RESET IFRAME */
  iframe.src = "about:blank";

  setTimeout(()=>{

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();

  }, 150);

  let loaded = false;

  iframe.onload = ()=>{
    loaded = true;
    iframe.style.display = "block";
    status.style.display = "none";
    retryBtn.style.display = "none";
  };

  /* ===== FAIL SAFE ===== */
  setTimeout(()=>{
    if(!loaded){

      if(attempt < maxAttempt){
        loadPDF({
          iframe,
          status,
          retryBtn,
          pdfUrl,
          attempt: attempt + 1,
          maxAttempt
        });
      }else{
        status.textContent = "Result available but not loaded";
        retryBtn.style.display = "inline-block";
      }

    }
  }, 6000);
}

/* ===== MAIN ===== */
function loadTodayPDF(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw=>{

    const card = document.createElement("div");
    card.className = "card";
    card.style.overflow = "hidden";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>
    `;

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";
    iframe.style.width = "100%";
    iframe.style.height = "420px";
    iframe.style.border = "0";
    iframe.style.display = "none";

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const pdfUrl =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    retryBtn.onclick = ()=>{
      loadPDF({
        iframe,
        status,
        retryBtn,
        pdfUrl,
        attempt: 1
      });
    };

    card.append(iframe, status, retryBtn);
    wrap.appendChild(card);

    /* AUTO LOAD */
    loadPDF({
      iframe,
      status,
      retryBtn,
      pdfUrl,
      attempt: 1
    });
  });
}

loadTodayPDF();

