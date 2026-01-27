const cards = document.querySelectorAll(".card"); // SELECTS ALL CARD ELEMENTS [.card, .card, ...]
const lists = document.querySelectorAll(".list"); // SELECTS ALL LIST ELEMENTS [.list, .list, ...]

for(const card of cards) {
  card.addEventListener("dragstart", dragStart); // ADDS EVENT LISTENER FOR DRAG START
  card.addEventListener("dragend", dragEnd); // ADDS EVENT LISTENER FOR DRAG END
}

for(const list of lists){
    list.addEventListener("dragover", dragOver); // ADDS EVENT LISTENER FOR DRAG OVER
    list.addEventListener("dragenter", dragEnter); // ADDS EVENT LISTENER FOR DRAG ENTER
    list.addEventListener("dragleave", dragLeave); // ADDS EVENT LISTENER FOR DRAG LEAVE
    list.addEventListener("drop", dragDrop); // ADDS EVENT LISTENER FOR DROP
}

function dragStart(e){
    e.dataTransfer.setData("text/plain", this.id); // SETS THE DATA TO BE TRANSFERRED
}

function dragEnd(e){
    console.log("dr(g)ag"); // LOGS WHEN DRAG ENDS
}

function dragOver(e){
    e.preventDefault(); // PREVENTS DEFAULT BEHAVIOR
}

function dragEnter(e){
    e.preventDefault(); // PREVENTS DEFAULT BEHAVIOR
    this.classList.add("over"); // ADDS OVER CLASS
}

function dragLeave(e){
    this.classList.remove("over"); // REMOVES HOVERED CLASS
}

function dragDrop(e){
    const id = e.dataTransfer.getData("text/plain"); // GETS THE TRANSFERRED DATA
    const card = document.getElementById(id); // GETS THE CARD ELEMENT BY ID
    this.appendChild(card); // APPENDS THE CARD TO THE LIST
    this.classList.remove("over"); // REMOVES HOVERED CLASS
}