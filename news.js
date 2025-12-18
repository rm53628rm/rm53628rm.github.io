const allNews = [
  {t:'Market Hits 26000 + New High',d:'16 Dec 2025',c:'Stock Market',p:'Market reached new highs driven by banking and IT stocks.'},
  {t:'IPO Buzz This Week',d:'15 Dec 2025',c:'IPO',p:'Multiple IPOs opening this week with strong GMP.'},
  {t:'RBI Policy Update',d:'14 Dec 2025',c:'Economy',p:'RBI keeps rates unchanged focusing on inflation.'},
  {t:'Tech Stocks Rally',d:'13 Dec 2025',c:'Stock Market',p:'Tech stocks led the rally this week.'},
  {t:'Dividend Announced',d:'12 Dec 2025',c:'Dividend',p:'Company announces interim dividend payout.'}
];

function renderNews(containerId, limit = null){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  let newsToShow = allNews;
  if(limit) newsToShow = allNews.slice(0, limit);

  newsToShow.forEach(n => {
    container.innerHTML += `
      <div class="news-card">
        <h3>${n.t}</h3>
        <div class="news-meta">${n.d} | ${n.c}</div>
        <p>${n.p}</p>
        <a href="news.html?id=${index}" class="read-more">Read More</a>
      </div>`;
  });

  if(containerId === 'latest-news'){
    container.innerHTML += `<a href="archive.html" class="view-all">View All News →</a>`;
  }
}

document.addEventListener('DOMContentLoaded', function(){
  renderNews('latest-news', 5);
});

