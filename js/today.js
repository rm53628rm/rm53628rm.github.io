const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
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

/* ===== LOAD PDF WITH AUTO RETRY (3x) ===== */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){
  let attempt = 0;
  let maxRetry = 3;
  let done = false;

  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";
  iframe.style.display = "none";

  const tryLoad = () => {
    if(done) return;

    attempt++;
    status.textContent = `Loading Result... (${attempt}/3)`;
    status.style.display = "block";

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();

    let loaded = false;

    iframe.onload = ()=>{
      if(done) return;
      loaded = true;
      done = true;
      iframe.style.display = "block";
      status.style.display = "none";
      downloadBtn.style.display = "inline-block";
    };

    // ⏱️ timeout for silent failure
    setTimeout(()=>{
      if(done || loaded) return;

      if(attempt < maxRetry){
        // 🔁 auto retry in background
        setTimeout(tryLoad, 2000);
      }else{
        // ❌ auto retry finished
        status.textContent = "Result available but not displayed.";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
      }
    }, 5000);
  };

  tryLoad();

  // 👆 manual retry
  retryBtn.onclick = ()=>{
    attempt = 0;
    done = false;
    tryLoad();
  };
}

/* ===== MAIN (SEQUENTIAL LOAD) ===== */
async function loadTodayPDF(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  for(const draw of draws){

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>
    `;

    const pdfWrap = document.createElement("div");
    pdfWrap.className = "pdf-wrap";

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";

    pdfWrap.appendChild(iframe);

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

    card.append(pdfWrap, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    // 🔥 auto retry system start
    loadPDFWithRetry(
      iframe, status, retryBtn, downloadBtn, pdfUrl
    );

    // ⏳ wait before next draw (order maintain)
    await new Promise(r => setTimeout(r, 1000));
  }
}

loadTodayPDF();
