
const BASE_URL = "https://www.dhankesari.com/download.php?filename=";

const draws = [
  { title:"🌅 Morning", prefix:"MN" },
  { title:"☀️ Day",     prefix:"DN" },
  { title:"🌙 Night",   prefix:"EN" }
];

// India date
function getTodayIST(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
  );
}

// DDMMYY
function fileCode(d){
  return String(d.getDate()).padStart(2,"0") +
         String(d.getMonth()+1).padStart(2,"0") +
         String(d.getFullYear()).slice(-2);
}

// PDF → IMAGE
async function pdfToImage(img, status, pdfUrl){

  status.textContent = "Loading Result...";
  status.style.display = "block";

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    img.src = canvas.toDataURL("image/webp", 0.95);
    img.style.display = "block";
    status.style.display = "none";

  } catch (e) {
    status.textContent = "Result not published yet";
  }
}

// MAIN
function loadResults(){

  const wrap = document.getElementById("todayResults");
  wrap.innerHTML = "";

  const today = getTodayIST();

  draws.forEach(draw => {

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.style.display = "none";

    const status = document.createElement("div");

    card.innerHTML = `
      <h3>${draw.title}</h3>
      <div>${today.toDateString()}</div>
    `;

    card.append(img, status);
    wrap.appendChild(card);

    const pdfUrl = BASE_URL + draw.prefix + fileCode(today) + ".PDF";

    pdfToImage(img, status, pdfUrl);
  });
}

loadResults();
