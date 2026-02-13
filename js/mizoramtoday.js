
/* ===== IST TIME ===== */
function istNow(){
  return new Date(
    new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})
  );
}
function istHour(){ return istNow().getHours(); }
function showDate(){ return istNow().toDateString(); }

function format12(hour){
  const ampm = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if(h === 0) h = 12;
  return h + ":00 " + ampm;
}


/* ===== DRAWS ===== */
const draws=[
 { id:"draw11", title:"Mizoram Lottery 11 AM Result", hour:11, code:10, extra:true },
 { id:"draw12", title:"Mizoram Lottery 12 PM Result", hour:12, code:11 },
 { id:"draw16", title:"Mizoram Lottery 4 PM Result",  hour:16, code:3 },
 { id:"draw19", title:"Mizoram Lottery 7 PM Result",  hour:19, code:7 },
 { id:"draw21", title:"Mizoram Lottery 9 PM Result",  hour:21, code:9 }
];

/* ===== MAIN ===== */
draws.forEach(draw=>{

  const wrap=document.getElementById(draw.id);
  if(!wrap) return;

  wrap.innerHTML="";

  /* title */
  const title=document.createElement("div");
  title.className="draw-title";
  title.textContent=draw.title;

  /* date */
  const date=document.createElement("div");
  date.className="date-show";
  date.textContent="Date: "+showDate();

  wrap.append(title,date);

  /* TIME LOCK */
  if(istHour() < draw.hour){
    wrap.innerHTML+=`
      <div class="status">
        Result will be published after ${format12(draw.hour)}
      </div>`;
    return;
  }

  /* PDF URL */
  const pdfUrl= draw.extra
   ? `https://mizoramlottery.com/Home/PrintsToday?dateTime=${draw.code}`
   : `https://mizoramlottery.com/Home/PrintToday?dateTime=${draw.code}`;

  /* UI elements */
  const status=document.createElement("div");
  status.className="status";
  status.innerHTML=`<span class="spinner"></span> Loading result...`;

  const iframe=document.createElement("iframe");
  iframe.style.display="none";

  const download=document.createElement("a");
  download.className="download-btn";
  download.href=pdfUrl;
  download.target="_blank";
  download.textContent="Download PDF";
  download.style.display="none";

  const retry=document.createElement("button");
  retry.className="retry-btn";
  retry.textContent="Retry";
  retry.style.display="none";

  wrap.append(status,iframe,download,retry);

  let tries=0;
  const max=5;
  let loaded=false;

  function load(){

    if(loaded) return;
    tries++;

    iframe.src=
      "https://docs.google.com/gview?embedded=true&url="
      +encodeURIComponent(pdfUrl)
      +"&t="+Date.now();

    const timer=setTimeout(()=>{

      if(loaded) return;

      if(tries>=max){
        status.textContent="Please try after sometime.";
        retry.style.display="inline-block";
      }else{
        load();
      }

    },15000);

    iframe.onload=()=>{
      loaded=true;
      clearTimeout(timer);
      iframe.style.display="block";
      status.style.display="none";
      retry.style.display="none";
      download.style.display="inline-block";
    };
  }

  retry.onclick=()=>{
    tries=0;
    loaded=false;
    status.innerHTML=`<span class="spinner"></span> Retrying...`;
    status.style.display="block";
    retry.style.display="none";
    load();
  };

  load();

});

