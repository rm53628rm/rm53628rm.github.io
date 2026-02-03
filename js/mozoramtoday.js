/* ================= PDF BASE ================= */
const BASE_PDF_VIEW_URL =
  "https://mizoramlottery.com/Home/PrintToday?dateTime=";

/* ================= DRAWS ================= */
const draws = [
  { title:"🕚 11 AM Draw Result", pdfTime:10, lock:11 },
  { title:"🕛 12 PM Draw Result", pdfTime:11, lock:12 },
  { title:"🕓 4 PM Draw Result",  pdfTime:3,  lock:16 },
  { title:"🕖 7 PM Draw Result",  pdfTime:7,  lock:19 },
  { title:"🕘 9 PM Draw Result",  pdfTime:9,  lock:21 }
];

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

/* ================= TODAY DATE ================= */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

/* ================= MAIN ================= */
function loadTodayPDF(){

  const wrap = document.getElementById("resultSection");
  wrap.innerHTML = "";

  const today = getTodayIST();
  const readableDate = today.toDateString();
  const currentHour = getISTHour();

  draws.forEach(draw => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${readableDate}</div>
    `;

    /* ===== TIME LOCK ===== */
    if(currentHour < draw.lock){
      const status = document.createElement("div");
      status.className = "status";
      status.style.display = "block";
      status.textContent =
        `Result will be published after ${draw.lock}:00 IST`;

      card.appendChild(status);
      wrap.appendChild(card);
      return;
    }

    /* ===== PDF FRAME ===== */
    const pdfFrame = document.createElement("iframe");
    pdfFrame.className = "pdf-frame";
    pdfFrame.src = BASE_PDF_VIEW_URL + draw.pdfTime;
    pdfFrame.loading = "lazy";

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "Loading Result...";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    retryBtn.onclick = ()=>{
      pdfFrame.src =
        BASE_PDF_VIEW_URL + draw.pdfTime + "&t=" + Date.now();
    };

    downloadBtn.onclick = ()=>{
      window.open(
        BASE_PDF_VIEW_URL + draw.pdfTime,
        "_blank"
      );
    };

    pdfFrame.onload = ()=> status.style.display = "none";
    pdfFrame.onerror = ()=>{
      status.textContent =
        "Result not published. Please retry later.";
    };

    card.append(pdfFrame, status, retryBtn, downloadBtn);
    wrap.appendChild(card);
  });
}

/* ================= AUTO LOAD ================= */
loadTodayPDF();
