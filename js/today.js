const BASE_URL = "/images/";

function getTodayIST(){
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
    })
  );
}

function fileCode(d){
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  return dd + mm + yy;
}

function checkFile(url, ok, fail){
  fetch(url, { method:"HEAD", cache:"no-store" })
    .then(r => r.ok ? ok() : fail())
    .catch(fail);
}

function loadToday(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw=>{
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date">${today.toDateString()}</div>
    `;

    const img = new Image();
    const status = document.createElement("div");
    const btn = document.createElement("button");

    status.className = "status";
    status.textContent = "Result Not Published";

    btn.className = "refresh-btn";
    btn.textContent = "Refresh";
    btn.onclick = ()=> img.src = file + "?v=" + Date.now();

    const file =
      BASE_URL + draw.prefix + fileCode(today) + ".jpg";

    checkFile(
      file,
      ()=> img.src = file + "?v=" + Date.now(),
      ()=> {}
    );

    img.onload = ()=>{
      status.style.display = "none";
      btn.style.display = "none";
      img.style.display = "block";
    };

    img.onerror = ()=>{
      status.style.display = "block";
      btn.style.display = "inline-block";
      img.style.display = "none";
    };

    card.append(img, status, btn);
    wrap.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadToday);

