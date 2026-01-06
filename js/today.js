const BASE_URL = "/images/";

const draws = [
  { title: "🌅 Morning", prefix: "md" },
  { title: "☀️ Day",     prefix: "dd" },
  { title: "🌙 Night",   prefix: "nd" }
];

/* 🔒 INDIA DATE – NO FALLBACK */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  );
}

/* FILE CODE: DDMMYY */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* CACHE KILL */
function smart(src){
  return src + "?v=" + Date.now();
}

function loadToday(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST(); // 🔥 STRICT TODAY

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

    const fileName =
      BASE_URL + draw.prefix + fileCode(today) + ".jpg";

    btn.onclick = () => {
      img.src = smart(fileName);
    };

    img.src = smart(fileName);

    img.onload = () => {
      img.style.display = "block";
      status.style.display = "none";
      btn.style.display = "none";
    };

    img.onerror = () => {
      img.style.display = "none";
      status.textContent = "Result Not Published";
      status.style.display = "block";
      btn.style.display = "inline-block";
    };

    card.append(img, status, btn);
    wrap.appendChild(card);
  });
}

loadToday();

