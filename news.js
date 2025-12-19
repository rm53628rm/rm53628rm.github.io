
// news.js
const allNews = [
  {t:'Market Hits New High',ts: Date.now(),c:'Stock Market',p:'...'},
  {t:'IPO Buzz This Week',ts: Date.now()-2*24*60*60*1000,c:'IPO',p:'...'}
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
