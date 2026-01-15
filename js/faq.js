
/* Accordion */
document.querySelectorAll(".faq-question").forEach(q=>{
  q.addEventListener("click",()=>{
    q.parentElement.classList.toggle("active");
  });
});

/* View All / Close */
const btn = document.getElementById("viewAllBtn");
let expanded = false;

btn.addEventListener("click",()=>{
  const hidden = document.querySelectorAll(".faq-item.hidden");

  if(!expanded){
    hidden.forEach(i=>i.classList.remove("hidden"));
    btn.textContent = "Close FAQs";
    expanded = true;
  }else{
    document.querySelectorAll(".faq-item").forEach((i,index)=>{
      i.classList.remove("active");
      if(index>=5) i.classList.add("hidden");
    });
    btn.textContent = "View All FAQs";
    expanded = false;
    document.querySelector(".faq-section")
      .scrollIntoView({behavior:"smooth"});
  }
});

