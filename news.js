const allNews = [
  {
    t:'Market Hits 25600 New High',
    d:'16 Dec 2025',
    ts: Date.now(),
    c:'Stock Market',
    p:'Market reached new highs driven by banking and IT stocks.'
  },
  {
    t:'IPO Buzz This Week',
    d:'14 Dec 2025',
    ts: Date.now() - 2*24*60*60*1000,
    c:'IPO',
    p:'Multiple IPOs opening this week.'
  }
];

function renderNews(containerId, limit=null){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = '';

  const list = limit ? allNews.slice(0, limit) : allNews;

  list.forEach((n, i)=>{
    const isNew =
      typeof IS_INDEX_PAGE !== 'undefined' &&
      n.ts &&
      (Date.now() - n.ts < 24*60*60*1000);

    container.innerHTML += `
      <div class="news-card">
        <h3>
          ${isNew ? '<span class="new-badge">NEW</span>' : ''}
          ${n.t}
        </h3>
        <div class="news-meta">${n.d} | ${n.c}</div>
        <p>${n.p}</p>
        <a href="news.html?id=${i}" class="read-more">Read More</a>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderNews('latest-news', 5);
});

