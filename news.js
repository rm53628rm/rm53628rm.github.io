
// news.js
const allNews = [
  {t:'sensex Hits New High',d:'19 Dec 2025',c:'Stock Market',p:'...'},
  {t:'Market Hits New High',d:'19 Dec 2025',c:'Stock Market',p:'...'},
  {t:'Market fall100 New High',d:'17 Dec 2025',c:'Stock analysis ',p:'.....'},
  {t:'IPO Buzz This Week',d:'18 Dec 2025',IPO',p:'...'}
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
    (typeof IS_INDEX_PAGE !== 'undefined' &&
     n.d  &&
     (Date.now() - new Date(n.d).getTime()) < 24*60*60*1000)
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
