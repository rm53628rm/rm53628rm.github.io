
const draws = [
  { sectionId:"section11", hour:11, pdfParam:10, extraS:true },
  { sectionId:"section12", hour:12, pdfParam:11, extraS:false },
  { sectionId:"section4",  hour:16, pdfParam:3,  extraS:false },
  { sectionId:"section7",  hour:19, pdfParam:7,  extraS:false },
  { sectionId:"section9",  hour:21, pdfParam:9,  extraS:false }
];

const MAX_RETRY = 5;
const RETRY_DELAY = 10000;

/* ================= IST TIME ================= */
function istHour(){
  return Number(
    new Date().toLocaleString("en-IN",{
      timeZone:"Asia/Kolkata",
      hour:"2-digit",
      hour12:false
    })
  );
}

/* ================= CHECK PDF EXISTS ================= */
function checkPDF(url){
  return fetch(url, { method:"HEAD", cache:"no-store" })
    .then(r => r.ok)
    .catch(() => false);
}

/* ================= LOAD DRAW ================= */
function loadDraw(draw){
  const wrap = document.getElementById(draw.sectionId);
  if(!wrap) return;

  wrap.innerHTML = "";
  let retry = 0;
  let stopped = false;

  const pdfURL =
    "https://mizoramlottery.com/Home/" +
    (draw.extraS ? "PrintsToday" : "PrintToday") +
    "?dateTime=" + draw.pdfParam;

  const card = document.createElement("div");
  card.className = "card";

  const status = document.createElement("div");
  status.className = "status";
  status.textContent = "Checking result availability…";

  const iframe = document.createElement("iframe");
  iframe.className = "pdf-frame";
  iframe.style.display = "none";

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "refresh-btn";
  downloadBtn.textContent = "Download PDF";
  downloadBtn.style.display = "none";

  const retryBtn = document.createElement("button");
  retryBtn.className = "refresh-btn";
  retryBtn.textContent = "Retry After Some Time";
  retryBtn.style.display = "none";

  downloadBtn.onclick = () => window.open(pdfURL, "_blank");

  retryBtn.onclick = () => {
    retry = 0;
    retryBtn.style.display = "none";
    status.style.display = "block";
    attempt();
  };

  function attempt(){
    if(stopped) return;

    checkPDF(pdfURL + "&t=" + Date.now()).then(found=>{
      if(found){
        stopped = true;
        status.style.display = "none";
        iframe.src = pdfURL;
        iframe.style.display = "block";
        downloadBtn.style.display = "inline-flex";
        return;
      }

      retry++;
      if(retry >= MAX_RETRY){
        status.textContent = "Result not available yet.";
        retryBtn.style.display = "inline-flex";
        return;
      }

      status.textContent = `Waiting for result… (${retry}/${MAX_RETRY})`;
      setTimeout(attempt, RETRY_DELAY);
    });
  }

  card.appendChild(status);
  card.appendChild(iframe);
  card.appendChild(downloadBtn);
  card.appendChild(retryBtn);
  wrap.appendChild(card);

  attempt();
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", ()=>{
  const now = istHour();

  draws.forEach(draw=>{
    const wrap = document.getElementById(draw.sectionId);
    if(!wrap) return;

    if(now < draw.hour){
      wrap.innerHTML = `
        <div class="card">
          <div class="status">
            Result will be published after
            ${draw.hour <= 12 ? draw.hour+" AM" : (draw.hour-12)+" PM"}
          </div>
        </div>`;
    } else {
      loadDraw(draw);
    }
  });
});

