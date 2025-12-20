
console.log("news.js loaded");

/* =========================
   ALL NEWS DATA
========================= */

const allNews = [
  {
    id: 0,
    title: "Market Hits New High",
    category: "Stock Market",
    date: "2025-12-20T10:30:00",
    excerpt: "Market reached new highs driven by banking and IT stocks.",
    content:
      "Market reached new highs driven by banking and IT stocks. Banking stocks gained strongly after positive global cues while IT stocks rallied due to a weaker rupee and improved outlook."
  },
  {
    id: 1,
    title: "IPO Buzz This Week",
    category: "IPO",
    date: "2025-12-14T09:00:00",
    excerpt: "Multiple IPOs opening this week with strong GMP.",
    content:
      "Multiple IPOs are opening this week with strong grey market premium. Retail participation is expected to be high amid positive market sentiment."
  },
  {
    id: 2,
    title: "RBI Policy Update",
    category: "Economy",
    date: "2025-12-13T08:45:00",
    excerpt: "RBI keeps rates unchanged focusing on inflation.",
    content:
      "The Reserve Bank of India kept interest rates unchanged, focusing on inflation control while supporting growth. Experts believe the stance remains cautious."
  },
  {
    id: 3,
    title: "Tech Stocks Rally",
    category: "Stock Market",
    date: "2025-12-12T11:15:00",
    excerpt: "Tech stocks led the rally this week.",
    content:
      "Technology stocks led the market rally this week supported by global tech gains and strong quarterly outlook from major IT companies."
  },
  {
    id: 4,
    title: "Dividend Announced",
    category: "Dividend",
    date: "2025-12-10T14:00:00",
    excerpt: "Company announces interim dividend payout.",
    content:
      "The company announced an interim dividend payout for shareholders. The record date and payment schedule will be announced shortly."
  }
];

/* =========================
   24 HOURS NEW BADGE LOGIC
========================= */

function isNewNews(newsDate) {
  const now = new Date();
  const posted = new Date(newsDate);
  const diffHours = (now - posted) / (1000 * 60 * 60);
  return diffHours <= 24;
}

/* =========================
   DATE FORMAT
========================= */

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/* =========================
   RENDER LATEST NEWS (INDEX)
========================= */

function renderLatestNews() {
  const box = document.getElementById("latest-news");
  if (!box) return;

  box.innerHTML = "";

  allNews.slice(0, 5).forEach(n => {
    box.innerHTML += `
      <div class="news-card">
        <h3>
          ${isNewNews(n.date) ? '<span class="new-badge">NEW</span>' : ''}
          ${n.title}
        </h3>
        <div class="news-meta">${formatDate(n.date)} | ${n.category}</div>
        <p>${n.excerpt}</p>
        <a href="news.html?id=${n.id}" class="read-more">Read More</a>
      </div>
    `;
  });

  box.innerHTML += `
    <a href="archive.html" class="view-all">View All News →</a>
  `;
}

/* =========================
   RENDER ARCHIVE PAGE
========================= */

function renderArchive() {
  const box = document.getElementById("archive-news");
  if (!box) return;

  box.innerHTML = "";

  allNews.forEach(n => {
    box.innerHTML += `
      <div class="news-card">
        <h3>
          ${isNewNews(n.date) ? '<span class="new-badge">NEW</span>' : ''}
          ${n.title}
        </h3>
        <div class="news-meta">${formatDate(n.date)} | ${n.category}</div>
        <p>${n.excerpt}</p>
        <a href="news.html?id=${n.id}" class="read-more">Read More</a>
      </div>
    `;
  });
}

/* =========================
   SINGLE NEWS PAGE
========================= */

function renderSingleNews() {
  const box = document.getElementById("single-news");
  if (!box) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const news = allNews.find(n => n.id == id);

  if (!news) {
    box.innerHTML = "<p>News not found</p>";
    return;
  }

  box.innerHTML = `
    <div class="news-card">
      <h2>${news.title}</h2>
      <div class="news-meta">${formatDate(news.date)} | ${news.category}</div>
      <p>${news.content}</p>
    </div>
  `;
}

/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderLatestNews();
  renderArchive();
  renderSingleNews();
});
