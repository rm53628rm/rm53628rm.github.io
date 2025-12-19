
// news.js
const allNews = [
  {id:0, t:'Market fall down New High', d:'16 Dec 2025', c:'Stock Market', p:'Market reached new highs driven by banking and IT stocks.'},
  {id:1, t:'IPO Buzz This Week', d:'15 Dec 2025', c:'IPO', p:'Multiple IPOs opening this week with strong GMP.'},
  {id:2, t:'RBI Policy Update', d:'14 Dec 2025', c:'Economy', p:'RBI keeps rates unchanged focusing on inflation.'},
  {id:3, t:'Tech Stocks Rally', d:'13 Dec 2025', c:'Stock Market', p:'Tech stocks led the rally this week.'},
  {id:4, t:'Dividend Announced', d:'12 Dec 2025', c:'Dividend', p:'Company announces interim dividend payout.'}
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
  ${typeof IS_INDEX_PAGE !== 'undefined' ? '<span class="new-badge">NEW</span>' : ''}
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
