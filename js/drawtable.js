
function generateTable(tableId, drawNames){
  const tbody = document.querySelector(`#${tableId} tbody`);
  const today = new Date();

  for(let i=0;i<7;i++){
    const d = new Date();
    d.setDate(today.getDate()+i);

    const dateText = d.toLocaleDateString("en-US",{
      day:"2-digit", month:"long", year:"numeric"
    });
    const dayText = d.toLocaleDateString("en-US",{weekday:"long"});

    const tr = document.createElement("tr");
    if(i === 0) tr.classList.add("today");

    tr.innerHTML = `
      <td>${dateText}</td>
      <td>${dayText}</td>
      <td>${drawNames[d.getDay()]}</td>
    `;
    tbody.appendChild(tr);
  }
}

/* Draw Names Mapping */
generateTable("draw1pm",{
  0:"Dear Yamuna",
  1:"Dear Dwarka",
  2:"Dear Godavari",
  3:"Dear Indus",
  4:"Dear Mahandi",
  5:"Dear Meghna",
  6:"Dear Narmada"
});

generateTable("draw6pm",{
  0:"Dear Vixen",
  1:"Dear Blitzen",
  2:"Dear Comet",
  3:"Dear Cupid",
  4:"Dear Dancer",
  5:"Dear Dasher",
  6:"Dear Donner"
});

generateTable("draw8pm",{
  0:"Dear Toucan",
  1:"Dear Finch",
  2:"Dear Goose",
  3:"Dear Pelican",
  4:"Dear Sandpiper",
  5:"Dear Seagull",
  6:"Dear Stork"
});


