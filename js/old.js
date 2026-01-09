/* =======================
   OLD RESULT CONFIG
======================= */
const OLD_BASE_URL = "https://www.dhankesari.com/oldresultsdown.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* =======================
   DDMMYY FORMAT
======================= */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* =======================
   PDF AUTO RETRY
======================= */
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

    iframe.onload = () => {
      if(loaded) return;
      loaded = true;
      iframe.style.display = "block";
      status.style.display = "none";
      retryBtn.style.display = "none";
      downloadBtn.style.display = "inline-block";
    };

    setTimeout(() => {
      if(loaded) return;

      if(attempt < maxRetry){
        tryLoad();   // background retry
      }else{
        status.textContent = "Result available but not displayed.";
        retryBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
      }
    }, 5000);
  }

  tryLoad();

  retryBtn.onclick = () => {
    attempt = 0;
    loaded = false;
    iframe.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";
    status.textContent = "Loading Result...";
    status.style.display = "block";
    tryLoad();
  };
}

/* =======================
   LOAD OLD RESULT
======================= */
function loadOldResult(){

  const dateValue = document.getElementById("oldDate").value;
  const wrap = document.getElementById("oldResults");
  const placeholder = document.getElementById("datePlaceholder");

  wrap.innerHTML = "";

  const selectedDate = dateValue ? new Date(dateValue) : null;

  placeholder.style.display = selectedDate ? "none" : "block";

  draws.forEach(draw => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">
        ${selectedDate ? selectedDate.toDateString() : "Please select date"}
      </div>
    `;

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = selectedDate ? "Loading Result..." : "Select date to view result";
    status.style.display = "block";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("a");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";
    downloadBtn.target = "_blank";

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    if(!selectedDate) return;

    const pdfUrl =
      OLD_BASE_URL + draw.prefix + fileCode(selectedDate) + ".PDF";

    downloadBtn.href = pdfUrl;

    loadPDFWithRetry(
      iframe,
      status,
      retryBtn,
      downloadBtn,
      pdfUrl
    );

    iframe.onclick = () => openFullscreen(iframe);
  });
}

/* =======================
   FULLSCREEN PDF
======================= */
function openFullscreen(iframe){
  const fs = document.getElementById("pdfFullscreen");
  const fsFrame = document.getElementById("fullscreenFrame");

  fsFrame.src = iframe.src;
  fs.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeFullscreen(){
  const fs = document.getElementById("pdfFullscreen");
  const fsFrame = document.getElementById("fullscreenFrame");

  fsFrame.src = "";
  fs.style.display = "none";
  document.body.style.overflow = "";
}
