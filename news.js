
// news.js
const allNews = [
  {
    t:'Market Hits New High',
    d:'16 Dec 2025',          // 👈 display ke liye
    ts: Date.now(),           // 👈 NEW logic ke liye
    c:'Stock Market',
    p:'Market reached new highs driven by banking and IT stocks.'
  },
  {
    t:'IPO Buzz This Week',
    d:'14 Dec 2025',
    ts: Date.now() - 2*24*60*60*1000, // 2 din purani
    c:'IPO',
    p:'Multiple IPOs opening this week.'
  }
];



function renderNews(containerId, limit){
  const container = document.getElementById(containerId);
  if(!container){
    console.error('Container not found:', containerId);
    return;
  }

  container.innerHTML = '';

  const list = limit ? allNews.slice(0, limit) : allNews;

  list.forEach(n=>{
    container.innerHTML += `
      <div class="news-card">
        <h3>
  ${
    typeof IS_INDEX_PAGE !== 'undefined' &&
    n.ts &&
    (Date.now() - n.ts < 24*60*60*1000)
      ? '<span class="new-badge">NEW</span>'
      : ''
  }
  ${n.t}
</h3>
        <div class="news-meta">${n.d} | ${n.c}</div>
        <p>${n.p}</p>
        <a href="news.html?id=${n.id}" class="read-more">Read More</a>
      </div>
    `;
  });

  if(containerId === 'latest-news'){
    container.innerHTML += `
      <a href="archive.html" class="view-all">View All News →</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderNews('latest-news', 5);
});
