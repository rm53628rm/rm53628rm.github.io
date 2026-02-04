/* ================= DRAWS ================= */
const draws = [
  { title:"🕚 Mizoram 11 AM Result", hour:11, dateTime:10, extraS:true },
  { title:"🕛 Mizoram 12 PM Result", hour:12, dateTime:11, extraS:false },
  { title:"🕓 Mizoram 4 PM Result",  hour:16, dateTime:3,  extraS:false },
  { title:"🕖 Mizoram 7 PM Result",  hour:19, dateTime:7,  extraS:false },
  { title:"🕘 Mizoram 9 PM Result",  hour:21, dateTime:9,  extraS:false }
];

const MAX_RETRY = 5;

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

/* ================= CHECK PDF EXISTS ================= */
function checkPDF(url){
  return fetch(url, { method:"HEAD", cache:"no-store" })
    .then(r => r.ok)
    .catch(() => false);
}

/* ================= LOAD PDF WITH RETRY ================= */
function loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl){

  let attempt = 0;
  let stopped = false;

  iframe.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.textContent = "Loading result...";
  status.style.display = "block";

  function tryLoad(){
    if(stopped) return;

    checkPDF(pdfUrl + "&t=" + Date.now()).then(found=>{
      if(found){
        stopped = true;
        status.style.display = "none";

        iframe.src =
          "https://docs.google.com/gview?embedded=true&url=" +
          encodeURIComponent(pdfUrl);

        iframe.style.display = "block";
        downloadBtn.style.display = "inline-flex";
        return;
      }

      attempt++;
      if(attempt >= MAX_RETRY){
        status.textContent = "Result not available yet. Retry after sometime.";
        retryBtn.style.display = "inline-flex";
        return;
      }

      status.textContent = `Checking result... (${attempt}/${MAX_RETRY})`;
      setTimeout(tryLoad, 5000);
    });
  }

  retryBtn.onclick = ()=>{
    attempt = 0;
    retryBtn.style.display = "none";
    status.textContent = "Loading result...";
    status.style.display = "block";
    tryLoad();
  };

  tryLoad();
}

/* ================= MAIN ================= */
function loadTodayResults(){

  const wrap = document.getElementById("todayResults");
  if(!wrap) return;

  wrap.innerHTML = "";
  const nowHour = getISTHour();

  draws.forEach(draw => {

    const base =
      "https://mizoramlottery.com/Home/" +
      (draw.extraS ? "PrintsToday" : "PrintToday");

    const pdfUrl = base + "?dateTime=" + draw.dateTime;

    /* 🔒 TIME LOCK */
    if(nowHour < draw.hour){
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${draw.title}</h3>
        <div class="status" style="display:block">
          Result will be published after
          ${draw.hour <= 12 ? draw.hour+" AM" : (draw.hour-12)+" PM"}
        </div>
      `;
      wrap.appendChild(card);
      return;
    }

    /* ✅ RESULT CARD */
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${draw.title}</h3>`;

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
    downloadBtn.href = pdfUrl;

    card.append(iframe, status, retryBtn, downloadBtn);
    wrap.appendChild(card);

    loadPDFWithRetry(iframe, status, retryBtn, downloadBtn, pdfUrl);
  });
}

/* ================= AUTO LOAD ================= */
document.addEventListener("DOMContentLoaded", loadTodayResults);
