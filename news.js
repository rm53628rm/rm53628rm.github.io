
console.log("news.js loaded");

// ===== NEWS DATA =====
const allNews = [
  {
    id: 0,
    title: "Market Hits New High",
    date: "16 Sept 2025",
    category: "Market",
    content: "Stock market ne aaj naya record banaya. Banking aur IT stocks lead kar rahe hain. Experts ka maanna hai ki agar FII inflow aise hi raha toh rally continue reh sakti hai."
  },
  {
    id: 1,
    title: "IPO Boom Continues",
    date: "15 Sept 2025",
    category: "IPO",
    content: "IPO market me heavy subscription dekhne ko mil raha hai. Retail aur HNI dono segment active hain. Listing gains ke chances strong bataye ja rahe hain."
  },
  {
    id: 2,
    title: "RBI Policy Update",
    date: "14 Sept 2025",
    category: "Economy",
    content: "RBI ne repo rate unchanged rakha hai. Inflation outlook stable bataya gaya hai aur GDP growth estimate ko maintain kiya gaya hai."
  }
];

// ===== SHORT TEXT FUNCTION =====
function shortText(text, words = 25){
  return text.split(" ").slice(0, words).join(" ") + "...";
}

// ===== INDEX PAGE =====
function renderNews(containerId, limit){
  const box = document.getElementById(containerId);
  if(!box) return;

  box.innerHTML = "";

  allNews.slice(0, limit).forEach((n, i) => {
    box.innerHTML += `
      <div class="news-card">
        <h3>${i === 0 ? '<span class="new-badge">NEW</span>' : ''}${n.title}</h3>
        <div class="news-meta">${n.date} | ${n.category}</div>
        <p>${shortText(n.content)}</p>
        <a class="read-more" href="news.html?id=${n.id}">Read More</a>
      </div>
    `;
  });

  box.innerHTML += `<a class="view-all" href="archive.html">View All News</a>`;
}

// ===== ARCHIVE PAGE =====
function renderArchive(){
  const box = document.getElementById("archive-news");
  if(!box) return;

  box.innerHTML = "";

  allNews.forEach(n => {
    box.innerHTML += `
      <div class="news-card">
        <h3>${n.title}</h3>
        <div class="news-meta">${n.date} | ${n.category}</div>
        <p>${shortText(n.content, 30)}</p>
        <a class="read-more" href="news.html?id=${n.id}">Read More</a>
      </div>
    `;
  });
}

// ===== AUTO LOAD =====
document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("latest-news")){
    renderNews("latest-news", 5);
  }
  if(document.getElementById("archive-news")){
    renderArchive();
  }
});
