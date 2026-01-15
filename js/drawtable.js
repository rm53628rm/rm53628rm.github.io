document.addEventListener("DOMContentLoaded", () => {

  const DATA = {
    draw1pm: ["Dear Dwarka","Dear Godavari","Dear Indus","Dear Mahandi","Dear Meghna","Dear Narmada","Dear Yamuna"],
    draw6pm: ["Dear Blitzen","Dear Comet","Dear Cupid","Dear Dancer","Dear Dasher","Dear Donner","Dear Vixen"],
    draw8pm: ["Dear Finch","Dear Goose","Dear Pelican","Dear Sandpiper","SeaGull","Dear Stork","Dear Toucan"]
  };

  function getMonday() {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d;
  }

  function fill(id, names) {
    const tbody = document.querySelector("#" + id + " tbody");
    if (!tbody) {
      console.error("tbody not found for", id);
      return;
    }

    tbody.innerHTML = "";
    const monday = getMonday();
    const today = new Date().setHours(0,0,0,0);

    for (let i=0;i<7;i++){
      const d = new Date(monday);
      d.setDate(monday.getDate()+i);
      d.setHours(0,0,0,0);

      const tr = document.createElement("tr");
      if (d.getTime() === today) tr.classList.add("today-row");

      tr.innerHTML = `
        <td>${d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</td>
        <td>${d.toLocaleDateString("en-IN",{weekday:"short"})}</td>
        <td>${names[i]}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  fill("draw1pm", DATA.draw1pm);
  fill("draw6pm", DATA.draw6pm);
  fill("draw8pm", DATA.draw8pm);

});
