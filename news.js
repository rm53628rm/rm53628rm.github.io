// news.js

// All news articles
const allNews = [
  {t:'Market fall New High',d:'16 Dec 2025',c:'Stock Market',p:'Market reached new highs driven by banking and IT stocks.'},
  {t:'IPO Buzz This Week',d:'15 Dec 2025',c:'IPO',p:'Multiple IPOs opening this week with strong GMP.'},
  {t:'RBI Policy Update',d:'14 Dec 2025',c:'Economy',p:'RBI keeps rates unchanged focusing on inflation.'},
  {t:'Tech Stocks Rally',d:'13 Dec 2025',c:'Stock Market',p:'Tech stocks led the rally this week.'},
  {t:'Dividend Announced',d:'12 Dec 2025',c:'Dividend',p:'Company announces interim dividend payout.'},
  {t:'Banking Sector Update',d:'10 Dec 2025',c:'Economy',p:'Banking stocks showing stable growth.'},
  {t:'Mid Cap Trends',d:'09 Dec 2025',c:'Equity',p:'Mid cap stocks performing well this month.'},
  {t:'New IPO Listing',d:'08 Dec 2025',c:'IPO',p:'New IPO listed on NSE with positive market sentiment.'},
  {t:'Tech Giants Earnings',d:'07 Dec 2025',c:'Stock Market',p:'Major tech companies reported quarterly earnings.'},
  {t:'Market Correction Expected',d:'06 Dec 2025',c:'Economy',p:'Experts predict minor market correction in coming weeks.'}
];

// Function to render news in a container
function renderNews(containerId, limit = null) {
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
        <a href="archive.html" class="read-more">Read More</a>
      </div>
    `;
  });

  // Add "View All" only for main page
  if(containerId === 'latest-news') {
    container.innerHTML += `<a href="archive.html" class="view-all">View All News →</a>`;
  }
}

// Load news on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function(){
  // For index.html: show top 5 news
  renderNews('latest-news', 5);

  // For archive.html, show all news
  renderNews('archive-news'); // archive.html should have <div id="archive-news"></div>
});

