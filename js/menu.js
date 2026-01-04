function openMenu() {
  document.getElementById("mobileMenu").classList.add("show");
}

function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("show");
}

function toggleMenu(el) {

  // close all
  document.querySelectorAll(".menu-accordion").forEach(acc => {
    acc.classList.remove("active");
    acc.querySelector(".arrow").classList.remove("rotate");
  });

  document.querySelectorAll(".submenu").forEach(menu => {
    menu.classList.remove("open");
  });

  // open clicked
  el.classList.add("active");
  el.querySelector(".arrow").classList.add("rotate");
  el.nextElementSibling.classList.add("open");
}

