<script>
/* ================= IST TIME ================= */
function istHour(){
  return Number(
    new Date().toLocaleString("en-IN",{
      timeZone:"Asia/Kolkata",
      hour:"2-digit",
      hour12:false
    })
  );
}
function istDate(){
  return new Date(
    new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})
  );
}

/* ================= DRAWS ================= */
const draws = [
 { id:"draw11", hour:11, time:"11 AM",title:"Mizoram Lottery 11 AM Result", param:10, extraS:true },
 { id:"draw12", hour:12, time:"12 PM",title:"Mizoram Lottery 12 PM Result", param:11 },
 { id:"draw16", hour:16, time:"4 PM",title:"Mizoram Lottery 4 PM Result",  param:3 },
 { id:"draw19", hour:19, time:"7 PM",title:"Mizoram Lottery 7 PM Result",  param:7 },
 { id:"draw21", hour:21, time:"9 PM",title:"Mizoram Lottery 9 PM Result",  param:9 }
];

draws.forEach(draw=>{
  const wrap=document.getElementById(draw.id);
  if(!wrap) return;

  const now=istHour();
  const dateStr=istDate().toDateString();

  /* title + date ALWAYS */
  wrap.innerHTML=`
    <div class="draw-title">${draw.title}</div>
    <div class="draw-date">Date: ${dateStr}</div>
  `;

  /* ===== TIME LOCK ===== */
  if(now < draw.hour){
    wrap.innerHTML+=`
      <div class="status">
        Result will be published after ${draw.time}
      </div>
    `;
    return;
  }

  /* ===== LINK ===== */
  const base = draw.extraS
    ? "https://mizoramlottery.com/Home/PrintsToday?dateTime="
    : "https://mizoramlottery.com/Home/PrintToday?dateTime=";

  const pdfUrl = base + draw.param;

  const status=document.createElement("div");
  status.className="status";
  status.innerHTML=`<span class="spinner"></span>Loading result...`;

  const pdfBox=document.createElement("div");
  pdfBox.className="pdf-container";

  const iframe=document.createElement("iframe");
  pdfBox.appendChild(iframe);

  const download=document.createElement("a");
  download.className="download-btn";
  download.textContent="Download PDF";
  download.href=pdfUrl;
  download.target="_blank";

  const retry=document.createElement("button");
  retry.className="retry-btn";
  retry.textContent="Retry";

  wrap.append(status,pdfBox,download,retry);

  let attempt=0,max=5,loaded=false;

  function loadPDF(){
    if(loaded) return;
    attempt++;
    iframe.src=
      "https://docs.google.com/gview?embedded=true&url="
      + encodeURIComponent(pdfUrl)
      + "&t="+Date.now();

    setTimeout(()=>{
      if(!loaded && attempt>=max){
        status.textContent="Result not available. Retry after sometime.";
        retry.style.display="inline-block";
      }else if(!loaded){
        loadPDF();
      }
    },30000);
  }

  iframe.onload=()=>{
    loaded=true;
    status.style.display="none";
    pdfBox.style.display="block";
    download.style.display="inline-block";
    retry.style.display="none";
  };

  retry.onclick=()=>{
    attempt=0;
    loaded=false;
    status.innerHTML=`<span class="spinner"></span>Retrying...`;
    status.style.display="block";
    retry.style.display="none";
    loadPDF();
  };

  loadPDF();
});
</script>
