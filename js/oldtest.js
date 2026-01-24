document.addEventListener("DOMContentLoaded", function () {

  const BASE_PDF_URL = "https://ldemo.dhankesari.com/download.php?filename=";
  const BASE_IMG_URL = "https://dhankesari.net/old/img/";

  const draws = [
    { title:"🌅 Dear Morning 1PM Lottery Sambad", prefix:"MN", imgPrefix:"MD", imgFolder:"1PM", timeText:"1PM" },
    { title:"☀️ Dear Day 6PM Lottery Sambad",     prefix:"DN", imgPrefix:"DD", imgFolder:"6PM", timeText:"6PM" },
    { title:"🌙 Dear Night 8PM Lottery Sambad",   prefix:"EN", imgPrefix:"ED", imgFolder:"8PM", timeText:"8PM" }
  ];

  function formatDate(d){
    return String(d.getDate()).padStart(2,"0") +
           String(d.getMonth()+1).padStart(2,"0") +
           String(d.getFullYear()).slice(-2);
  }

  function loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl){
    let attempt = 0, loaded = false;
    const maxRetry = 4;

    img.style.display = "none";
    retryBtn.style.display = "none";
    downloadBtn.style.display = "none";

    status.innerHTML = `
      <div class="loading-wrap">
        <span class="mini-spinner"></span>
        <span>Loading Result...</span>
      </div>
    `;
    status.style.display = "block";

    function tryLoad(){
      if(loaded) return;
      attempt++;
      img.src = imgUrl + "?t=" + Date.now();

      setTimeout(()=>{
        if(loaded) return;
        if(attempt >= maxRetry){
          status.textContent = "Click Retry to load result";
          retryBtn.style.display = "inline-flex";
          downloadBtn.style.display = "inline-flex";
        } else {
          tryLoad();
        }
      }, 4000);
    }

    img.onload = ()=>{
      loaded = true;
      img.style.display = "block";
      status.style.display = "none";
      retryBtn.style.display = "none";
      downloadBtn.style.display = "inline-flex";
    };

    retryBtn.onclick = ()=>{
      attempt = 0;
      loaded = false;
      retryBtn.style.display = "none";
      downloadBtn.style.display = "none";
      status.style.display = "block";

      status.innerHTML = `
        <div class="loading-wrap">
          <span class="mini-spinner"></span>
          <span>Loading Result...</span>
        </div>
      `;
      tryLoad();
    };

    tryLoad();
  }

  function loadOldResults(){
    const dateInput = document.getElementById("resultDate");
    const oldResults = document.getElementById("oldResults");

    if(!dateInput || !oldResults){
      console.error("Date picker or oldResults container missing");
      return;
    }

    const selectedDate = new Date(dateInput.value);
    if(!dateInput.value){
      alert("Please select a date");
      return;
    }

    const code = formatDate(selectedDate);
    const readableDate = selectedDate.toDateString();

    oldResults.innerHTML = "";  // Clear previous results

    draws.forEach(draw => {

      // Create main container for each time
      const resultDiv = document.createElement("div");
      resultDiv.className = "result-card";

      // Date
      const dateDiv = document.createElement("div");
      dateDiv.className = "date-show";
      dateDiv.textContent = readableDate;

      // Image
      const img = document.createElement("img");
      img.className = "pdf-frame";
      img.alt = `Old ${draw.timeText} Lottery Result ${readableDate}`;

      // Status
      const status = document.createElement("div");
      status.className = "status";

      // Buttons
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
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      // Append inside each time section
      resultDiv.append(dateDiv, img, status, retryBtn, downloadBtn);

      // Append to main container
      oldResults.appendChild(resultDiv);

      // Load image with retry
      loadImageWithRetry(img, status, retryBtn, downloadBtn, imgUrl);
    });
  }

  window.loadOldResults = loadOldResults;  // Make function accessible from button

});
