const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

/* INDIA DATE */
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})
  );
}

/* DDMMYY */
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

async function pdfExists(url){
  try{
    await fetch(url,{ method:"HEAD", mode:"no-cors", cache:"no-store" });
    return true;
  }catch{
    return false;
  }
}

function loadToday(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(async draw=>{

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div class="date-show">${today.toDateString()}</div>
    `;

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "Checking result...";

    const btn = document.createElement("a");
    btn.className = "refresh-btn";
    btn.textContent = "View Result";
    btn.target = "_blank";
    btn.style.display = "none";

    const pdfUrl =
      BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    const ok = await pdfExists(pdfUrl);

    if(ok){
      status.style.display = "none";
      btn.href = pdfUrl + "&t=" + Date.now();
      btn.style.display = "inline-block";
    }else{
      status.textContent = "Result Not Published";
    }

    card.append(status, btn);
    wrap.appendChild(card);
  });
}

loadToday();

