
console.log("news.js loaded");

/* =========================
   NEWS DATA
========================= */

const newsData = [
  {
    id: 1,
    title: "Market gains as IT stocks rally",
    category: "Stock Market",
    date: "2025-12-20T09:30:00",
    content: "Indian stock market witnessed strong buying interest in IT stocks today as global cues remained positive. Experts believe this momentum may continue in the near term."
  },
  {
    id: 2,
    title: "IPO market sees strong retail participation",
    category: "IPO",
    date: "2025-01-08T11:00:00",
    content: "The IPO market is buzzing with activity as retail investors show strong interest. Several SME IPOs were subscribed multiple times."
  }
];

/* =========================
   DATE FORMAT
========================= */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/* =========================
   NEW BADGE (24 HOURS ONLY)
   ⚠️ SIRF NEWS TITLE KE LIYE
========================= */

function getNewBadge(dateStr) {
  const publishDate = new Date(dateStr);
  const now = new Date();
  const diffHours = (now - publishDate) / (1000 * 60 * 60);

  if (diffHours <= 24) {
    return '<span class="new-badge">NEW</span>';
  }
  return '';
}

/* =========================
   INDEX PAGE (LATEST NEWS)
========================= */

const latestNewsEl = document.getElementById("latest-news");

if (latestNewsEl) {
  let html = "";

  newsData.slice(0, 5).forEach(news => {
    html += `
      <div class="news-card">
        <h3>${getNewBadge(news.date)} ${news.title}</h3>
        <div class="news-meta">${news.category} | ${formatDate(news.date)}</div>
        <p>${news.content.substring(0, 120)}...</p>
        <a class="read-more" href="news.html?id=${news.id}">Read more</a>
      </div>
    `;
  });

  html += `<a href="archive.html" class="view-all">View All News</a>`;
  latestNewsEl.innerHTML = html;
}

/* =========================
   ARCHIVE PAGE
========================= */

const archiveEl = document.getElementById("archive-news");

if (archiveEl) {
  let html = "";

  newsData.forEach(news => {
    html += `
      <div class="news-card">
        <h3>${getNewBadge(news.date)} ${news.title}</h3>
        <div class="news-meta">${news.category} | ${formatDate(news.date)}</div>
        <p>${news.content.substring(0, 140)}...</p>
        <a class="read-more" href="news.html?id=${news.id}">Read more</a>
      </div>
    `;
  });

  archiveEl.innerHTML = html;
}

/* =========================
   SINGLE NEWS PAGE
========================= */

const singleNewsEl = document.getElementById("single-news");

if (singleNewsEl) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const news = newsData.find(n => n.id == id);

  if (!news) {
    singleNewsEl.innerHTML = "<p>News not found</p>";
  } else {
    singleNewsEl.innerHTML = `
      <div class="news-card">
        <h2>${news.title}</h2>
        <div class="news-meta">${news.category} | ${formatDate(news.date)}</div>
        <p>${news.content}</p>
      </div>
    `;
  }
}

/* =========================
   🚫 FINAL SAFETY NET
   MENU / NAVBAR SE NEW HATAO
========================= */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".new-badge").forEach(badge => {
    if (!badge.closest(".news-card")) {
      badge.remove();
    }
  });
});
