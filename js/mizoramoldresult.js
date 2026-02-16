document.addEventListener("DOMContentLoaded",()=>{

/* DRAW LIST */
const draws=[
{ id:"draw11", title:"11 AM Result", code:10, prints:true },
{ id:"draw12", title:"12 PM Result", code:11 },
{ id:"draw16", title:"4 PM Result", code:3 },
{ id:"draw19", title:"7 PM Result", code:7 },
{ id:"draw21", title:"9 PM Result", code:9 }
];

const picker=document.getElementById("datePicker");
if(!picker) return;

/* YESTERDAY DEFAULT */
const d=new Date();
d.setDate(d.getDate()-1);
const defaultDate=d.toISOString().split("T")[0];

picker.value=defaultDate;
loadAll(defaultDate);

picker.addEventListener("change",()=>{
loadAll(picker.value);
});

/* LOAD ALL RESULTS */
function loadAll(dateStr){

const [year,month,day]=dateStr.split("-");

draws.forEach(draw=>{

const wrap=document.getElementById(draw.id);
if(!wrap) return;

wrap.innerHTML=`
<div class="draw-title">Mizoram Lottery ${draw.title}</div>
<div class="draw-date">${day}/${month}/${year}</div>
`;

const base=draw.prints
? "https://mizoramlottery.com/Home/Prints?dateTime="
: "https://mizoramlottery.com/Home/Print?dateTime=";

const pdfUrl= base + draw.code +
"&date=" + day + "%2F" + month + "%2F" + year;

/* STATUS */
const status=document.createElement("div");
status.className="status";
status.innerHTML=`<span class="spinner"></span> Loading result...`;

/* PDF BOX */
const pdfBox=document.createElement("div");
pdfBox.className="pdf-container";

/* IFRAME */
const iframe=document.createElement("iframe");

/* DOWNLOAD BTN */
const download=document.createElement("a");
download.className="download-btn";
download.textContent="Download PDF";
download.href=pdfUrl;
download.target="_blank";

/* RETRY BTN */
const retry=document.createElement("button");
retry.className="retry-btn";
retry.textContent="Retry";

wrap.append(status,pdfBox,download,retry);
pdfBox.appendChild(iframe);

/* RETRY SYSTEM */
let attempt=0,max=5,loaded=false;

function load(){

if(loaded) return;
attempt++;

iframe.src=
"https://docs.google.com/gview?embedded=true&url="
+ encodeURIComponent(pdfUrl)
+ "&t="+Date.now();

setTimeout(()=>{
if(!loaded && attempt>=max){
status.textContent="Result not available. Retry later.";
retry.style.display="block";
}
else if(!loaded){
load();
}
},15000);
}

iframe.onload=()=>{
loaded=true;
status.style.display="none";
pdfBox.style.display="block";
download.style.display="block";
retry.style.display="none";
};

retry.onclick=()=>{
attempt=0;
loaded=false;
status.innerHTML=`<span class="spinner"></span> Retrying...`;
status.style.display="flex";
retry.style.display="none";
load();
};

load();

});
}

});
