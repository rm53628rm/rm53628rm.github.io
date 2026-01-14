
document.addEventListener("DOMContentLoaded",function(){

  const draws = {
    draw1pm:[
      "Dear Dwarka","Dear Godavari","Dear Indus",
      "Dear Mahandi","Dear Meghna","Dear Narmada","Dear Yamuna"
    ],
    draw6pm:[
      "Dear Blitzen","Dear Comet","Dear Cupid",
      "Dear Dancer","Dear Dasher","Dear Donner","Dear Vixen"
    ],
    draw8pm:[
      "Dear Finch","Dear Goose","Dear Pelican",
      "Dear Sandpiper","SeaGull","Dear Stork","Dear Toucan"
    ]
  };

  function getMondayToSunday(){
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

    const dates=[];
    for(let i=0;i<7;i++){
      const d=new Date(monday);
      d.setDate(monday.getDate()+i);
      dates.push(d);
    }
    return dates;
  }

  function fillTable(id,names){
    const tbody=document.querySelector(`#${id} tbody`);
    if(!tbody) return;

    const week=getMondayToSunday();
    const todayStr=new Date().toDateString();
    tbody.innerHTML="";

    week.forEach((d,i)=>{
      const tr=document.createElement("tr");
      if(d.toDateString()===todayStr) tr.classList.add("today");

      tr.innerHTML=`
        <td>${d.toLocaleDateString("en-IN")}</td>
        <td>${d.toLocaleDateString("en-IN",{weekday:"short"})}</td>
        <td>${names[i]}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  fillTable("draw1pm",draws.draw1pm);
  fillTable("draw6pm",draws.draw6pm);
  fillTable("draw8pm",draws.draw8pm);

});
