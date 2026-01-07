const BASE_URL = "/images/";

const draws = [
  { title:"🌅 Morning", prefix:"md" },
  { title:"☀️ Day",     prefix:"dd" },
  { title:"🌙 Night",   prefix:"nd" }
];

/* FILE CODE: DDMMYY */
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
    img.style.display="none";
    status.textContent = "Result Not Published";
    status.style.display="block";
    btn.style.display="inline-block";
  }
}

/* ================= ELEMENTS ================= */

const oldDateInput    = document.getElementById("oldDate");
const datePlaceholder = document.getElementById("datePlaceholder");
const wrap            = document.getElementById("oldResults");

/* ================= MODAL ZOOM ================= */

const modal    = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close-modal");

function openModal(src){
  modalImg.src = src;
  modal.style.display = "flex";
}

closeBtn.onclick = ()=> modal.style.display="none";
modal.onclick = e=>{
  if(e.target === modal) modal.style.display="none";
};

/* ================= INIT CARDS (ALWAYS SHOW) ================= */

function initCards(){
  wrap.innerHTML = "";

  draws.forEach(x=>{

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${x.title}</h3>
      <div class="date-show">Select a date</div>
    `;

    const img = new Image();
    const st  = document.createElement("div");
    const btn = document.createElement("button");

    img.style.display = "none";
    st.className  = "status";
    btn.className = "refresh-btn";
    btn.textContent = "Refresh";

    st.textContent = "Please select date";
    btn.style.display = "none";

    card.append(img, st, btn);
    wrap.appendChild(card);

    /* store refs */
    card._img = img;
    card._status = st;
    card._btn = btn;
    card._prefix = x.prefix;
  });
}

/* ================= DATE CHANGE ================= */

oldDateInput.addEventListener("change", ()=>{

  datePlaceholder.style.display =
    oldDateInput.value ? "none" : "block";

  if(!oldDateInput.value){
    initCards();
    return;
  }

  const d = new Date(oldDateInput.value);

  [...wrap.children].forEach(card=>{

    const img = card._img;
    const st  = card._status;
    const btn = card._btn;

    card.querySelector(".date-show").textContent =
      oldDateInput.value;

    const file =
      BASE_URL + card._prefix + code(d) + ".jpg";

    btn.onclick = ()=> loadOldImage(img, file, st, btn);
    loadOldImage(img, file, st, btn);

    img.onclick = ()=> openModal(img.src);
  });
});

/* ================= START ================= */

if(datePlaceholder){
  datePlaceholder.style.display = "block";
}

initCards();

