
/* =========================
   CONFIG (OLD RESULT)
========================= */
const OLD_BASE_URL =
  "https://www.dhankesari.com/oldresultsdown.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* =========================
   DATE → DDMMYY
========================= */
function fileCodeFromInput(dateStr){
  const d = new Date(dateStr);
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* =========================
   PDF AUTO RETRY (4x)
========================= */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  const maxRetry = 4;
  let loaded = false;

  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.textContent = "Loading Result...";
  status.style.display = "block";

  function tryLoad(){
    if(loaded) return;
    attempt++;

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(pdfUrl) +
      "&t=" + Date.now();

    iframe.onload = ()=>{
      if(loaded) return;
      loaded = true;
      iframe.style.display = "block";
      status.style.display = "none";
      downloadBtn.style.display = "inline-block";
    };

    setTimeout(()=>{
      if(loaded) return;

      if(attempt < maxRetry){
        tryLoad();
      }else{
        status.textContent = "Result not available.";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
      }
    }, 5000);
  }

  tryLoad();

  retryBtn.onclick = ()=>{
    attempt = 0;
    loaded = false;
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    status.textContent = "Loading Result...";
    tryLoad();
  };
}

/* =========================
   LOAD OLD RESULT
========================= */
function loadOldResult(){

  const dateInput = document.getElementById("oldDate").value;
  if(!dateInput){
    alert("Please select date");
    return;
  }

  const wrap = document.getElementById("oldResults");
  wrap.innerHTML = "";

  const code = fileCodeFromInput(dateInput);

  draws.forEach(draw=>{

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${dateInput}</div>
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
      OLD_BASE_URL + draw.prefix + code + ".PDF";

    downloadBtn.href = pdfUrl;

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    loadPDFWithRetry(
      iframe, status, retryBtn, downloadBtn, pdfUrl
    );
  });
}

