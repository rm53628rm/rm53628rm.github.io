
/* ================= DRAW CONFIG ================= */
const draws = [
  { sectionId:"section11", hour:11, pdfParam:10, extraS:true },
  { sectionId:"section12", hour:12, pdfParam:11, extraS:false },
  { sectionId:"section4",  hour:16, pdfParam:3,  extraS:false },
  { sectionId:"section7",  hour:19, pdfParam:7,  extraS:false },
  { sectionId:"section9",  hour:21, pdfParam:9,  extraS:false }
];

const MAX_RETRY = 5;
const RETRY_DELAY = 10000; // 10 sec

/* ================= IST HOUR ================= */
function getISTHour(){
  return Number(
    new Date().toLocaleString("en-IN",{
      timeZone:"Asia/Kolkata",
      hour:"2-digit",
      hour12:false
    })
  );
}

/* ================= LOAD RESULT ================= */
function loadDraw(draw){
  const wrap = document.getElementById(draw.sectionId);
  if(!wrap) return;

  wrap.innerHTML = "";
  let retryCount = 0;
  let retryTimer = null;

  const baseURL =
    "https://mizoramlottery.com/Home/" +
    (draw.extraS ? "PrintsToday" : "PrintToday") +
    "?dateTime=" + draw.pdfParam;

  const card = document.createElement("div");
  card.className = "card";

  const iframe = document.createElement("iframe");
  iframe.className = "pdf-frame";
  iframe.style.display = "none";

  const status = document.createElement("div");
  status.className = "status";
  status.innerHTML = "Loading result…";

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "refresh-btn";
  downloadBtn.textContent = "Download PDF";
  downloadBtn.style.display = "none";

  const retryBtn = document.createElement("button");
  retryBtn.className = "refresh-btn";
  retryBtn.textContent = "Retry After Some Time";
  retryBtn.style.display = "none";

  downloadBtn.onclick = () => {
    window.open(baseURL, "_blank");
  };

  retryBtn.onclick = () => {
    retryBtn.style.display = "none";
    retryCount = 0;
    status.style.display = "block";
    status.textContent = "Retrying…";
    startRetry();
  };

  function startRetry(){
    iframe.src = baseURL + "&t=" + Date.now();

    retryTimer = setTimeout(()=>{
      retryCount++;

      if(retryCount >= MAX_RETRY){
        status.textContent = "Result not available yet.";
        retryBtn.style.display = "inline-flex";
        return;
      }

      status.textContent = `Retrying... (${retryCount}/${MAX_RETRY})`;
      startRetry();
    }, RETRY_DELAY);
  }

  iframe.onload = () => {
    clearTimeout(retryTimer);
    status.style.display = "none";
    iframe.style.display = "block";
    downloadBtn.style.display = "inline-flex";
    retryBtn.style.display = "none";
  };

  card.appendChild(iframe);
  card.appendChild(status);
  card.appendChild(downloadBtn);
  card.appendChild(retryBtn);
  wrap.appendChild(card);

  startRetry();
}

/* ================= MAIN ================= */
function init(){
  const now = getISTHour();

  draws.forEach(draw=>{
    const wrap = document.getElementById(draw.sectionId);
    if(!wrap) return;

    if(now < draw.hour){
      wrap.innerHTML = `
        <div class="card">
          <div class="status">
            Result will be published after ${draw.hour <= 12 ? draw.hour+" AM" : (draw.hour-12)+" PM"}
          </div>
        </div>
      `;
    } else {
      loadDraw(draw);
    }
  });
}

document.addEventListener("DOMContentLoaded", init);

