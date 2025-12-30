// menu.js

function openMenu(){
  document.getElementById("mobileMenu").classList.add("show");
}

function closeMenu(){
  document.getElementById("mobileMenu").classList.remove("show");
}

function toggleCat(){
  const menu = document.getElementById("catMenu");
  const arrow = document.getElementById("arrow");

  if(menu.style.maxHeight){
    menu.style.maxHeight = null;
    arrow.innerText = "▼";
  } else {
    menu.style.maxHeight = menu.scrollHeight + "px";
    arrow.innerText = "▲";
  }
}

