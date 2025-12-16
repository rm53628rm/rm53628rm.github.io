
const newsData = [
  {
  title: "Aaj ki breaking news",
  date: "2025-01-13",
  content: "Market green zone mein band hua."
},
  {
    title: "Sensex jumps 500 points",
    date: "2025-01-12",
    content: "Market strong buying ke saath band hua."
  },
  {
    title: "New IPO opening next week",
    date: "2025-01-11",
    content: "Retail investors ke liye achha mauka."
  },
  {
    title: "Bank stocks rally",
    date: "2025-01-10",
    content: "Private banks mein buying dekhi gayi."
  },
  {
    title: "Nifty above 22000",
    date: "2025-01-09",
    content: "Technical breakout confirm."
  },
  {
    title: "IT stocks weak",
    date: "2025-01-08",
    content: "Global cues pressure mein."
  }
];

// latest news upar
newsData.sort((a,b)=>new Date(b.date)-new Date(a.date));

function showLatestNews(limit){
  let html="";
  newsData.slice(0,limit).forEach(n=>{
    html+=`<div class="news">
      <h2>${n.title}</h2>
      <small>${n.date}</small>
      <p>${n.content}</p>
    </div>`;
  });
  document.getElementById("latest-news").innerHTML=html;
}

function showSidebarNews(limit){
  let html="";
  newsData.slice(0,limit).forEach(n=>{
    html+=`<div class="news">🔹 ${n.title}</div>`;
  });
  document.getElementById("sidebar-news").innerHTML=html;
}

function showAllNews(){
  let html="";
  newsData.forEach(n=>{
    html+=`<div class="news">
      <h2>${n.title}</h2>
      <small>${n.date}</small>
      <p>${n.content}</p>
    </div>`;
  });
  document.getElementById("all-news").innerHTML=html;
}
