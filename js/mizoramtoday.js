/* ===== IST DATE / TIME ===== */
function istNow(){
  return new Date(
    new Date().toLocaleString("en-IN",{ timeZone:"Asia/Kolkata" })
  );
}
function istHour(){ return istNow().getHours(); }
function showDate(){ return istNow().toDateString(); }

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

  /* 🔒 TIME LOCK (NO SPINNER) */
  if(istHour() < draw.hour){
    wrap.innerHTML += `
      <div class="status">
        Result will be published after ${draw.hour}:00
      </div>`;
    return;
  }

  /* PDF LINK (UNCHANGED) */
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

  function load(){
    if(loaded) return;
    attempt++;

    iframe.src =
      "https://docs.google.com/gview?embedded=true&url="
      + encodeURIComponent(pdfUrl)
      + "&t=" + Date.now();

    setTimeout(()=>{
      if(!loaded && attempt>=max){
        status.textContent="Result not available. Retry after sometime.";
        retry.style.display="inline-block";
      }else if(!loaded){
        load();
      }
    },30000);
  }

  iframe.onload=()=>{
    loaded=true;
    iframe.style.display="block";
    status.style.display="none";
    retry.style.display="none";
    download.style.display="inline-block";
  };

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
