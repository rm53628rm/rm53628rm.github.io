
/* ===== IST DATE / TIME ===== */
function istNow(){
  return new Date(
    new Date().toLocaleString("en-IN",{ timeZone:"Asia/Kolkata" })
  );
}
function istHour(){ return istNow().getHours(); }
function showDate(){ return istNow().toDateString(); }

/* ===== CHECK PDF EXISTS ===== */
async function pdfExists(url){
  try{
    const res = await fetch(url,{method:"HEAD"});
    return res.ok && res.headers.get("content-type")?.includes("pdf");
  }catch{
    return false;
  }
}

/* ===== DRAWS ===== */
const draws = [
 { id:"draw11", title:"Mizoram Lottery 11 AM Result", hour:11, param:10, extraS:true },
 { id:"draw12", title:"Mizoram Lottery 12 PM Result", hour:12, param:11 },
 { id:"draw16", title:"Mizoram Lottery 4 PM Result",  hour:16, param:3 },
 { id:"draw19", title:"Mizoram Lottery 7 PM Result",  hour:19, param:7 },
 { id:"draw21", title:"Mizoram Lottery 9 PM Result",  hour:21, param:9 }
];

draws.forEach(draw=>{
  const wrap = document.getElementById(draw.id);

  /* TITLE */
  const title = document.createElement("div");
  title.className="draw-title";
  title.textContent = draw.title;

  /* DATE */
  const date = document.createElement("div");
  date.className="date-show";
  date.textContent = "Date: " + showDate();

  wrap.append(title, date);

  /* 🔒 TIME LOCK */
  if(istHour() < draw.hour){
    wrap.innerHTML += `
      <div class="status">
        Result will be published after ${draw.hour}:00
      </div>`;
    return;
  }

  /* PDF LINK */
  const pdfUrl = draw.extraS
    ? "https://mizoramlottery.com/Home/PrintsToday?dateTime=" + draw.param
    : "https://mizoramlottery.com/Home/PrintToday?dateTime=" + draw.param;

  const status = document.createElement("div");
  status.className="status";
  status.innerHTML=`<span class="spinner"></span> Loading result...`;

  const iframe = document.createElement("iframe");

  const download = document.createElement("a");
  download.className="download-btn";
  download.textContent="Download PDF";
  download.href=pdfUrl;
  download.target="_blank";

  const retry = document.createElement("button");
  retry.className="retry-btn";
  retry.textContent="Retry";

  wrap.append(status, iframe, download, retry);

  let attempt=0, max=5, loaded=false;

  async function load(){

    if(loaded) return;
    attempt++;

    const exists = await pdfExists(pdfUrl);

    if(!exists){

      if(attempt>=max){
        status.textContent="Please try after sometime.";
        retry.style.display="inline-block";
        return;
      }

      setTimeout(load,15000); // retry delay
      return;
    }

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url="
      + encodeURIComponent(pdfUrl)
      + "&t=" + Date.now();

    iframe.onload=()=>{
      loaded=true;
      iframe.style.display="block";
      status.style.display="none";
      retry.style.display="none";
      download.style.display="inline-block";
    };
  }

  retry.onclick=()=>{
    attempt=0;
    loaded=false;
    status.innerHTML=`<span class="spinner"></span> Retrying...`;
    status.style.display="block";
    retry.style.display="none";
    load();
  };

  load();
});

