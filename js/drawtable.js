(function runWeeklyTable(){

  function init(){

    console.log("Weekly table init ✅");

    const WEEKLY_DRAWS = {
      draw1pm: [
        "Dear Dwarka","Dear Godavari","Dear Indus",
        "Dear Mahandi","Dear Meghna","Dear Narmada","Dear Yamuna"
      ],
      draw6pm: [
        "Dear Blitzen","Dear Comet","Dear Cupid",
        "Dear Dancer","Dear Dasher","Dear Donner","Dear Vixen"
      ],
      draw8pm: [
        "Dear Finch","Dear Goose","Dear Pelican",
        "Dear Sandpiper","SeaGull","Dear Stork","Dear Toucan"
      ]
    };

    function getISTToday(){
      return new Date(
        new Date().toLocaleDateString("en-CA",{ timeZone:"Asia/Kolkata" })
      );
    }

    const today = getISTToday();

    function getMonday(d){
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
      return date;
    }

    const monday = getMonday(today);

    let weekDates=[];
    for(let i=0;i<7;i++){
      let d=new Date(monday);
      d.setDate(monday.getDate()+i);
      weekDates.push(d);
    }

    Object.keys(WEEKLY_DRAWS).forEach(id=>{
      const tbody=document.querySelector(`#${id} tbody`);
      if(!tbody){
        console.warn("tbody missing:", id);
        return;
      }

      tbody.innerHTML="";

      WEEKLY_DRAWS[id].forEach((name,i)=>{
        const d=weekDates[i];
        const tr=document.createElement("tr");

        if(d.toDateString()===today.toDateString()){
          tr.classList.add("today-row");
        }

        tr.innerHTML=`
          <td>${d.toLocaleDateString("en-IN")}</td>
          <td>${d.toLocaleDateString("en-IN",{weekday:"long"})}</td>
          <td>${name}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  /* 🔒 SAFE EXECUTION (ALL BROWSERS) */
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init);
    window.addEventListener("load", init);
  }else{
    init();
  }

})();
