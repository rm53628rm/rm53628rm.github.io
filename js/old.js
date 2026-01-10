
const OLD_BASE_URL = "https://ldemo.dhankesari.com/oldresultsdownload.php?filename=";

const draws = [
    { title:"🌅 Morning", prefix:"MN" },
    { title:"☀️ Day",     prefix:"DN" },
    { title:"🌙 Night",   prefix:"EN" }
];

/* ===== DATE → DDMMYY ===== */
function fileCode(date){
    const d = String(date.getDate()).padStart(2,"0");
    const m = String(date.getMonth()+1).padStart(2,"0");
    const y = String(date.getFullYear()).slice(-2);
    return d+m+y;
}

/* ===== PDF AUTO LOAD WITH RETRY ===== */
function loadPDFWithRetry(iframe,status,retryBtn,downloadBtn,pdfUrl){
    let attempt = 0;
    const MAX_RETRY = 4;
    let loaded = false;
    let timer;

    iframe.style.display="none";
    retryBtn.style.display="none";
    downloadBtn.style.display="none";

    status.textContent="Loading Result...";
    status.style.display="block";

    function loadOnce(){
        iframe.src =
          "https://docs.google.com/gview?embedded=true&url="
          + encodeURIComponent(pdfUrl)
          + "&t=" + Date.now();
    }

    function tryLoad(){
        if(loaded) return;
        attempt++;
        loadOnce();

        timer = setTimeout(()=>{
            if(loaded) return;

            if(attempt >= MAX_RETRY){
                status.textContent="Result not loaded. Retry or Download PDF.";
                retryBtn.style.display="inline-flex";
                downloadBtn.style.display="inline-flex";
                return;
            }
            tryLoad();
        },5000);
    }

    iframe.onload = ()=>{
        if(loaded) return;
        loaded = true;
        clearTimeout(timer);

        iframe.style.display="block";
        status.style.display="none";
        retryBtn.style.display="none";
        downloadBtn.style.display="inline-flex";
    };

    retryBtn.onclick = ()=>{
        attempt = 0;
        loaded = false;
        retryBtn.style.display="none";
        downloadBtn.style.display="none";
        status.textContent="Loading Result...";
        status.style.display="block";
        tryLoad();
    };

    tryLoad();
}

/* ===== LOAD OLD RESULTS ===== */
function loadOldResults(){
    const wrap = document.getElementById("oldResults");
    wrap.innerHTML = "";

    const dateVal = document.getElementById("resultDate").value;
    if(!dateVal){
        alert("Please select a date");
        return;
    }

    const selectedDate = new Date(dateVal);

    draws.forEach(draw=>{
        const card = document.createElement("div");
        card.className="card";

        card.innerHTML = `
            <h3>${draw.title} - ${selectedDate.toDateString()}</h3>
        `;

        const iframe = document.createElement("iframe");
        iframe.className="pdf-frame";

        const status = document.createElement("div");
        status.className="status";

        const retryBtn = document.createElement("button");
        retryBtn.className="refresh-btn";
        retryBtn.textContent="Retry";

        const downloadBtn = document.createElement("a");
        downloadBtn.className="refresh-btn";
        downloadBtn.textContent="Download PDF";
        downloadBtn.target="_blank";

        const pdfUrl =
          OLD_BASE_URL +
          draw.prefix +
          fileCode(selectedDate) +
          ".PDF";

        downloadBtn.href = pdfUrl;

        card.append(iframe,status,retryBtn,downloadBtn);
        wrap.appendChild(card);

        loadPDFWithRetry(
            iframe,
            status,
            retryBtn,
            downloadBtn,
            pdfUrl
        );
    });
}

