
<script>
/* ===== IST DATE ===== */
function istNow(){
  return new Date(
    new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})
  );
}

/* DEFAULT = YESTERDAY */
function defaultDate(){
  let d=istNow();
  d.setDate(d.getDate()-1);
  return d;
}

/* FORMAT DD/MM/YYYY */
function formatDate(d){
  let day=String(d.getDate()).padStart(2,"0");
  let mon=String(d.getMonth()+1).padStart(2,"0");
  let yr=d.getFullYear();
  return `${day}/${mon}/${yr}`;
}

/* DRAWS */
const draws=[
 { id:"draw11", title:"Mizoram 11 AM Result", code:10, extra:true },
 { id:"draw12", title:"Mizoram 12 PM Result", code:11 },
 { id:"draw16", title:"Mizoram 4 PM Result",  code:3 },
 { id:"draw19", title:"Mizoram 7 PM Result",  code:7 },
 { id:"draw21", title:"Mizoram 9 PM Result",  code:9 }
];

/* DATE INPUT */
const picker=document.getElementById("datePicker");

/* DEFAULT SET */
let selected=defaultDate();
picker.valueAsDate=selected;

/* LOAD FUNCTION */
function loadResults(dateObj){

  const dateStr=formatDate(dateObj);
  const encoded=dateStr.replace(/\//g,"%2F");

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
    date.textContent="Date: "+dateStr;

    wrap.append(title,date);

    /* PDF URL */
    const pdfUrl= draw.extra
     ? `https://mizoramlottery.com/Home/Prints?dateTime=${draw.code}&date=${encoded}`
     : `https://mizoramlottery.com/Home/Print?dateTime=${draw.code}&date=${encoded}`;

    /* UI */
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
}

/* FIRST LOAD */
loadResults(selected);

/* DATE CHANGE */
picker.addEventListener("change",()=>{
  const val=picker.value;
  if(!val) return;
  loadResults(new Date(val));
});
</script>
