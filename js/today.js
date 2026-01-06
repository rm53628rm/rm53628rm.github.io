const BASE_URL = "/images/";

function loadToday(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw=>{
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>
    `;

    const img = new Image();
    const status = document.createElement("div");
    const btn = document.createElement("button");

    status.className = "status";
    btn.className = "refresh-btn";
    btn.textContent = "Refresh";

    const file =
      BASE_URL + draw.prefix + fileCode(today) + ".jpg";

    const loadImage = ()=>{
      img.src = file + "?nocache=" + Date.now();
    };

    btn.onclick = loadImage;

    checkFile(
      file,
      () => loadImage(),
      () => {
        status.textContent = "Result Not Published";
        status.style.display = "block";
        btn.style.display = "inline-block";
      }
    );

    img.onload = ()=>{
      img.style.display = "block";
      status.style.display = "none";
      btn.style.display = "none";
    };

    img.onerror = ()=>{
      img.style.display = "none";
      status.textContent = "Result Not Published";
      status.style.display = "block";
      btn.style.display = "inline-block";
    };

    card.append(img, status, btn);
    wrap.appendChild(card);
  });
}

