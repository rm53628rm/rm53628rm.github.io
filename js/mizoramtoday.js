/* ===== IST DATE / TIME ===== */
function istNow(){
  return new Date(new Date().toLocaleString("en-IN",{ timeZone:"Asia/Kolkata" }));
}
function istHour(){ return istNow().getHours(); }
function showDate(){ return istNow().toDateString(); }


/* ===== CHECK PDF EXISTS (REAL CHECK) ===== */
async function pdfExists(url){
  try{
    const res = await fetch(url,{ cache:"no-store" });
    const blob = await res.blob();
    return blob.type === "application/pdf";
  }catch{
    return false;
  }
}


/* ===== DRAWS ===== */
const draws = [
 { id:"draw11", title:"Mizoram Lottery 11 AM Result", hour:11, time:"11 AM", param:10, extraS:true },
 { id:"draw12", title:"Mizoram Lottery 12 PM Result", hour:12, time:"12 PM", param:11 },
 { id:"draw16", title:"Mizoram Lottery 4 PM Result",  hour:16, time:"4 PM", param:3 },
 { id:"draw19", title:"Mizoram Lottery 7 PM Result",  hour:19, time:"7 PM", param:7 },
 { id:"draw21", title:"Mizoram Lottery 9 PM Result",  hour:21, time:"9 PM", param:9 }
];


/* ===== MAIN LOOP ===== */
draws.forEach(draw=>{

  const wrap = document.getElementById(draw.id);
  if(!wrap) return;


  /* TITLE */
  const title = document.createElement("div");
  title.className="draw-title";
  title.textContent = draw.title;

  /* DATE */
  const date = document.createElement("div");
  date.className="draw-date";
  date.textContent = "Date: " + showDate();

  wrap.append(title,date);


  /* ===== TIME LOCK ===== */
  if(istHour() < draw.hour){
    const msg = document.createElement("div");
    msg.className="status";
    msg.textContent = "Result will be published after " + draw.time;
    wrap.append(msg);
    return;
  }


  /* ===== PDF LINK ===== */
  const pdfUrl = draw.extraS
    ? "https://mizoramlottery.com/Home/PrintsToday?dateTime=" + draw.param
    : "https://mizoramlottery.com/Home/PrintToday?dateTime=" + draw.param;


  /* STATUS */
  const status = document.createElement("div");
  status.className="status";
  status.innerHTML=`<span class="spinner"></span> Checking result...`;


  /* IFRAME VIEWER */
  const iframe = document.createElement("iframe");
  iframe.style.display="none";


  /* DOWNLOAD */
  const download = document.createElement("a");
  download.className="download-btn";
  download.textContent="Download PDF";
  download.href=pdfUrl;
  download.target="_blank";
  download.style.display="none";


  /* RETRY */
  const retry = document.createElement("button");
  retry.className="retry-btn";
  retry.textContent="Retry";
  retry.style.display="none";


  wrap.append(status, iframe, download, retry);


  let attempt = 0;
  const maxAttempts = 5;
  let loaded = false;


  /* ===== LOAD FUNCTION ===== */
  async function load(){

    if(loaded) return;
    attempt++;

    const exists = await pdfExists(pdfUrl);

    /* NOT READY */
    if(!exists){

      if(attempt >= maxAttempts){
        status.textContent="Result not available yet. Please retry.";
        retry.style.display="inline-block";
        return;
      }

      status.innerHTML=`<span class="spinner"></span> Waiting for result...`;
      setTimeout(load,15000);
      return;
    }


    /* READY → SHOW PDF */
    iframe.src =
      "https://mozilla.github.io/pdf.js/web/viewer.html?file="
      + encodeURIComponent(pdfUrl);

    iframe.onload = ()=>{
      loaded=true;
      iframe.style.display="block";
      status.style.display="none";
      retry.style.display="none";
      download.style.display="inline-block";
    };
  }


  /* ===== RETRY BUTTON ===== */
  retry.onclick = ()=>{
    attempt=0;
    loaded=false;
    retry.style.display="none";
    status.innerHTML=`<span class="spinner"></span> Retrying...`;
    status.style.display="block";
    load();
  };


  /* START */
  load();

});
