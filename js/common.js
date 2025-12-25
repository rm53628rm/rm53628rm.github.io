
document.addEventListener("click", function (e) {
  const target = e.target.closest(".news-card, a, button, .menu-btn");
  if (!target) return;

  const ripple = document.createElement("span");
  ripple.className = "click-ripple";

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
  ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
