const BASE_URL = "/images/";

const draws = [
  { title: "🌅 Morning", prefix: "md" },
  { title: "☀️ Day", prefix: "dd" },
  { title: "🌙 Night", prefix: "nd" }
];

function getISTDate(){
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

function code(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

function smart(src){
  return src + "?v=" + Date.now(); // cache killer
}

function loadToday(){
  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const d = getISTDate(); // 🔥 FINAL FIX

  draws.forEach(x=>{
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `
      <h3>${x.title}</h3>
      <div class="date-show">${d.toDateString()}</div>
    `;

    const img = new Image();
    const st  = document.createElement("div");
    const btn = document.createElement("button");

    st.className = "status";
    btn.className = "refresh-btn";
    btn.textContent = "Refresh";

    btn.onclick = () => {
      img.src = smart(BASE_URL + x.prefix + code(d) + ".jpg");
    };

    img.src = smart(BASE_URL + x.prefix + code(d) + ".jpg");

    img.onload = () => {
      img.style.display = "block";
      st.style.display  = "none";
      btn.style.display = "none";
    };

    img.onerror = () => {
      st.textContent = "Result Not Published";
      st.style.display  = "block";
      btn.style.display = "inline-block";
    };

    c.append(img, st, btn);
    wrap.appendChild(c);
  });
}

loadToday();

