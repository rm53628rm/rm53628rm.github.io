const BASE_URL = "/images/";

const draws = [
  { title:"🌅 Morning", prefix:"md" },
  { title:"☀️ Day", prefix:"dd" },
  { title:"🌙 Night", prefix:"nd" }
];

function code(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

/* CACHE SAFE IMAGE LOADER */
async function loadOldImage(img, file, status, btn){
  try{
    const res = await fetch(file, { method:"HEAD", cache:"no-store" });
    if(!res.ok) throw "NF";

    img.src = file + "?v=" + Date.now();
    img.onload = ()=>{
      img.style.display="block";
      status.style.display="none";
      btn.style.display="none";
    };
  }catch{
    status.textContent="Result Not Published";
    status.style.display="block";
    btn.style.display="inline-block";
  }
}

const oldDateInput = document.getElementById("oldDate");
const wrap = document.getElementById("oldResults");

oldDateInput.addEventListener("change", ()=>{

  if(!oldDateInput.value) return;   // ✅ safety

  wrap.innerHTML = "";

  const d = new Date(oldDateInput.value);

  draws.forEach(x=>{

    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `
      <h3>${x.title}</h3>
      <div class="date-show">${oldDateInput.value}</div>
    `;

    const img = new Image();
    const st = document.createElement("div");
    const btn = document.createElement("button");

    st.className = "status";
    btn.className = "refresh-btn";
    btn.textContent = "Refresh";

    const file = BASE_URL + x.prefix + code(d) + ".jpg";

    btn.onclick = ()=> loadOldImage(img, file, st, btn);

    loadOldImage(img, file, st, btn);

    c.append(img, st, btn);
    wrap.appendChild(c);
  });
});

