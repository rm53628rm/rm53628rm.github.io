
console.log("news.js loaded");

// ===== ALL NEWS DATA =====
const allNews = [
  {
    id: 0,
    title: "Market Hits New High",
    date: "16 Sept 2025",
    category: "Market",
    content: "Stock market ne aaj naya record banaya. Banking aur IT stocks lead kar rahe hain."
  },
  {
    id: 1,
    title: "IPO Boom Continues",
    date: "15 Sept 2025",
    category: "IPO",
    content: "IPO market me heavy subscription dekhne ko mil raha hai, retail investors active hain."
  },
  {
    id: 2,
    title: "RBI Policy Update",
    date: "14 Sept 2025",
    category: "Economy",
    content: "RBI ne interest rate unchanged rakha aur growth outlook positive bataya."
  }
];

// ===== RENDER LATEST NEWS ON INDEX =====
function renderNews(containerId, limit){
  const box = document.getElementById(containerId);
  if(!box) return;

  box.innerHTML = "";

  allNews.slice(0, limit).forEach((n, i) => {
    box.innerHTML += `
      <div class="news-card">
        <h3>
          ${i === 0 ? '<span class="new-badge">NEW</span>' : ''}
          ${n.title}
        </h3>
        <div class="news-meta">${n.date} | ${n.category}</div>
        <p>${n.content.substring(0, 90)}...</p>
        <a class="read-more" href="news.html?id=${n.id}">Read More</a>
      </div>
    `;
  });

  box.innerHTML += `<a class="view-all" href="archive.html">View All News</a>`;
}

// ===== AUTO LOAD FOR INDEX PAGE =====
document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("latest-news")){
    renderNews("latest-news", 5);
  }
});
