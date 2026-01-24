const BASE_PDF = "https://ldemo.dhankesari.com/download.php?filename=";
const BASE_IMG = "https://dhankesari.net/old/img/";

function formatDate(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* IMAGE LOAD WITH RETRY */
function loadImage(target, imgUrl, pdfUrl){
  target.innerHTML = "";

  const status = document.createElement("div");
  status.className = "status";
  status.innerHTML = `
    <div class="loading-wrap">
      <span class="mini-spinner"></span>
      Loading result...
    </div>
  `;

  const img = document.createElement("img");
  img.style.display = "none";

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "refresh-btn";
  downloadBtn.textContent = "Download PDF";
  downloadBtn.style.display = "none";
  downloadBtn.onclick = ()=>window.open(pdfUrl,"_blank");

  const retryBtn = document.createElement("button");
  retryBtn.className = "retry-btn";
  retryBtn.textContent = "Retry";
  retryBtn.style.display = "none";

  target.append(status, img, retryBtn, downloadBtn);

  let tries = 0;
  const MAX_TRY = 3;

  function tryLoad(){
    tries++;
    img.src = imgUrl + "?t=" + Date.now();
  }

  img.onload = ()=>{
    status.style.display = "none";
    img.style.display = "block";
    downloadBtn.style.display = "inline-block";
    retryBtn.style.display = "none";
  };

  img.onerror = ()=>{
    if(tries >= MAX_TRY){
      status.textContent = "Result not available. Please retry.";
      retryBtn.style.display = "inline-block";
    }else{
      setTimeout(tryLoad, 2000);
    }
  };

  retryBtn.onclick = ()=>{
    tries = 0;
    status.innerHTML = `
      <div class="loading-wrap">
        <span class="mini-spinner"></span>
        Loading result...
      </div>
    `;
    retryBtn.style.display = "none";
    tryLoad();
  };

  tryLoad();
}

/* MAIN */
function loadOldResults(){
  const val = document.getElementById("resultDate").value;
  if(!val){
    alert("Please select date");
    return;
  }

  const d = new Date(val);
  const code = formatDate(d);

  loadImage(
    document.getElementById("morningResult"),
    BASE_IMG+"1PM/MD"+code+".webp",
    BASE_PDF+"MN"+code+".PDF"
  );

  loadImage(
    document.getElementById("dayResult"),
    BASE_IMG+"6PM/DD"+code+".webp",
    BASE_PDF+"DN"+code+".PDF"
  );

  loadImage(
    document.getElementById("nightResult"),
    BASE_IMG+"8PM/ED"+code+".webp",
    BASE_PDF+"EN"+code+".PDF"
  );
}

/* AUTO LOAD PREVIOUS DAY */
const prev = new Date();
prev.setDate(prev.getDate() - 1);
document.getElementById("resultDate").valueAsDate = prev;
loadOldResults();
