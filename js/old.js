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

  status.style.display = "block";
  status.textContent = "Loading Result...";

  function tryLoad(){

    if(loaded) return;
    attempt++;

    iframe.src = pdfUrl + "?t=" + Date.now();

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
        tryLoad(); // background retry
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

  wrap.innerHTML = "";

  if(!dateValue){
    alert("Please select a date first!");
    return;
  }

  const selectedDate = new Date(dateValue);

  draws.forEach(draw => {

    const card = document.createElement("div");
    card.className = "card";

    // always show card + date
    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${selectedDate.toDateString()}</div>
    `;

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-frame";

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "Loading Result...";
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

    const pdfUrl = OLD_BASE_URL + draw.prefix + fileCode(selectedDate) + ".PDF";
    downloadBtn.href = pdfUrl;

    loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl);
  });
}
