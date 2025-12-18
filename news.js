
// News data
var allNews = [
  {t:'Market fall Hits New High',d:'16 Dec 2025',c:'Stock Market',p:'Market reached new highs driven by banking and IT stocks.'},
  {t:'IPO Buzz This Week',d:'15 Dec 2025',c:'IPO',p:'Multiple IPOs opening this week with strong GMP.'},
  {t:'RBI Policy Update',d:'14 Dec 2025',c:'Economy',p:'RBI keeps rates unchanged focusing on inflation.'},
  {t:'Tech Stocks Rally',d:'13 Dec 2025',c:'Stock Market',p:'Tech stocks led the rally this week.'},
  {t:'Dividend Announced',d:'12 Dec 2025',c:'Dividend',p:'Company announces interim dividend payout.'},
  {t:'Banking Sector Gains',d:'11 Dec 2025',c:'Banking',p:'Banks outperform in the weekly trade.'},
  {t:'Small Cap Rally',d:'10 Dec 2025',c:'Equity',p:'Small cap stocks show strong momentum this week.'}
];

// Load latest news on index.html
const latestNews=document.getElementById('latest-news');
if(latestNews){
  allNews.slice(0,5).forEach(n=>{
    latestNews.innerHTML+=`<div class="news-card">
      <h3>${n.t}</h3>
      <div class="news-meta">${n.d} | ${n.c}</div>
      <p>${n.p}</p>
      <a href="archive.html" class="read-more">Read More</a>
    </div>`;
  });
  latestNews.innerHTML+=`<a href="archive.html" class="view-all">View All News →</a>`;
}

// Load all news on archive.html
const archiveNews=document.getElementById('archive-news');
if(archiveNews){
  allNews.forEach(n=>{
    archiveNews.innerHTML+=`<div class="news-card">
      <h3>${n.t}</h3>
      <div class="news-meta">${n.d} | ${n.c}</div>
      <p>${n.p}</p>
    </div>`;
  });
}

// Mobile menu links
const mobileMenu=document.getElementById('mobileMenu');
if(mobileMenu){
  const links = ['About Us','Contact Us','Privacy Policy','Disclaimer'];
  mobileMenu.innerHTML = links.map(l => `<a href="#">${l}</a>`).join('');
}
