/* ================= BASE URLS ================= */
const BASE_PDF_URL = "https://ldemo.dhankesari.com/download.php?filename=";
const BASE_IMG_URL = "https://dhankesari.net/old/img/";

/* ================= DRAWS ================= */
const draws = [
  { title:"🌅 Dear Morning Lottery Result (1 PM)", prefix:"MN", imgPrefix:"MD", imgFolder:"1PM", timeText:"1PM" },
  { title:"☀️ Dear Day Lottery Result (6 PM)",     prefix:"DN", imgPrefix:"DD", imgFolder:"6PM", timeText:"6PM" },
  { title:"🌙 Dear Night Lottery Result (8 PM)",   prefix:"EN", imgPrefix:"ED", imgFolder:"8PM", timeText:"8PM" }
];

/* ================= HELPERS ================= */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* ================= IMAGE LOADER ================= */
function loadImage(img, status, retryBtn, downloadBtn, imgUrl){
  img.style.display = "none";
  retryBtn.style.display = "none";
  downloadBtn.style.display = "none";

  status.style.display = "block";
  status.textContent = "Loading Result...";

  img.onload = ()=>{
    img.style.display = "block";
    status.style.display = "none";
    downloadBtn.style.display = "inline-flex";
  };

  img.onerror = ()=>{
    status.textContent = "Result not available";
    retryBtn.style.display = "inline-flex";
    downloadBtn.style.display = "inline-flex";
  };

  retryBtn.onclick = ()=>{
    status.textContent = "Loading Result...";
    retryBtn.style.display = "none";
    img.src = imgUrl + "?t=" + Date.now();
  };

  img.src = imgUrl;
}

/* ================= MAIN FUNCTION ================= */
function loadOldResults(){

  const dateInput = document.getElementById("resultDate").value;
  const container = document.getElementById("oldResults");

  if(!dateInput){
    alert("Please select a date");
    return;
  }

  const dateObj = new Date(dateInput);
  const code = fileCode(dateObj);

  container.innerHTML = ""; // clear previous

  draws.forEach(draw => {

    const section = document.createElement("div");
    section.className = "old-result-section";

    const heading = document.createElement("h3");
    heading.textContent = draw.title;

    const img = document.createElement("img");
    img.className = "pdf-frame";

    const status = document.createElement("div");
    status.className = "status";

    const retryBtn = document.createElement("button");
    retryBtn.className = "refresh-btn";
    retryBtn.textContent = "Retry";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "refresh-btn";
    downloadBtn.textContent = "Download PDF";

    const imgUrl =
      BASE_IMG_URL + draw.imgFolder + "/" + draw.imgPrefix + code + ".webp";

    const pdfUrl =
      BASE_PDF_URL + draw.prefix + code + ".PDF";

    downloadBtn.onclick = ()=>{
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = draw.prefix + code + ".PDF";
      a.click();
    };

    section.append(heading, img, status, retryBtn, downloadBtn);
    container.appendChild(section);

    loadImage(img, status, retryBtn, downloadBtn, imgUrl);
  });
}

/* ================= AUTO LOAD YESTERDAY ================= */
(function(){
  const d = new Date();
  d.setDate(d.getDate() - 1);

  const y = d.toISOString().split("T")[0];
  document.getElementById("resultDate").value = y;

  loadOldResults();
})();
