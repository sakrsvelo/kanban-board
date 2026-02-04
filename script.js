const cards = document.querySelectorAll(".card"); // SELECTS ALL CARD ELEMENTS
const lists = document.querySelectorAll(".list"); // SELECTS ALL LIST ELEMENTS
const board = document.querySelector(".board"); // SELECTS THE BOARD ELEMENT
const addTaskButton = document.getElementById("add-task-button"); // SELECTS THE ADD TASK BUTTON
const newTaskInput = document.getElementById("new-task-input"); // SELECTS THE NEW TASK INPUT FIELD
const taskCategoryInput = document.getElementById("task-category"); // SELECTS THE TASK CATEGORY INPUT FIELD
const searchInput = document.getElementById("search"); // SELECTS THE SEARCH INPUT FIELD

const toDoList = document.getElementById("to-do");
const ongoingList = document.getElementById("ongoing");
const doneList = document.getElementById("done");

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // LOADS TASKS

addTaskButton.addEventListener("click", addTask); // ADDS EVENT LISTENER TO ADD TASK BUTTON
searchInput.addEventListener("input", updateTaskList); // ADDS EVENT LISTENER TO SEARCH INPUT FIELD

for(const card of cards) {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
}

for(const list of lists){
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
}

updateTaskList(); // INITIAL CALL

function addTask(e){
    e.preventDefault(); 

    const task = newTaskInput.value.trim();
    const category = taskCategoryInput.value.trim();

    if(task === "") return; // NO EMPTY TASKS

    tasks.push({
        id: Date.now(),
        description: task, 
        category: category,
        status: "to-do"
    }); 

    localStorage.setItem("tasks", JSON.stringify(tasks)); 

    updateTaskList(); 

    newTaskInput.value = "";
    taskCategoryInput.value = ""; 
}

function updateTaskList(){
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => card.remove()); // REMOVES ALL EXISTING CARDS

    const filterText = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.description.toLowerCase().includes(filterText) ||
        task.category.toLowerCase().includes(filterText)
    ); 

    filteredTasks.forEach(task => {
        const cardElement = createCard(task);
        
        // APPEND CARD TO THE CORRECT LIST BASED ON STATUS
        if(task.status === "to-do") {
            toDoList.appendChild(cardElement);
        } else if(task.status === "ongoing") {
            ongoingList.appendChild(cardElement);
        } else if(task.status === "done") {
            doneList.appendChild(cardElement);
        }
    });
}

function createCard(task){
    const div = document.createElement("div");
    div.classList.add("card");
    div.setAttribute("draggable", "true");
    div.id = task.id; 

    div.innerHTML = `
        <h4>${task.description}</h4>
        ${task.category ? `<span class="category">${task.category}</span>` : ''}
        <div class="card-actions">
            <button class="card-btn edit" onclick="editTask(${task.id})">Edit</button>
            <button class="card-btn delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    // ATTACH DRAG EVENT LISTENERS
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragend", dragEnd);

    return div;
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskList();
}

function editTask(id){
    const task = tasks.find(t => t.id === id);
    if(task){
        const newText = prompt("Edit Task:", task.description);
        if(newText !== null && newText.trim() !== ""){
            task.description = newText.trim();
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateTaskList();
        }
    }
}


let draggedCardId = null;

function dragStart(e){
    draggedCardId = parseInt(this.id);
    e.dataTransfer.setData("text/plain", this.id);
    setTimeout(() => {
        this.style.display = "none";
    }, 0);
}

function dragEnd(e){
    this.style.display = "block";
    draggedCardId = null;
}

function dragOver(e){
    e.preventDefault(); 
}

function dragEnter(e){
    e.preventDefault();
    this.classList.add("over"); 
}

function dragLeave(e){
    this.classList.remove("over"); 
}

function dragDrop(e){
    e.preventDefault();
    this.classList.remove("over"); 
    
    // "this" refers to the list (to-do, ongoing, done)
    const newStatus = this.id; 

    // Update the data model
    const taskIndex = tasks.findIndex(t => t.id === draggedCardId);
    
    if(taskIndex > -1){
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateTaskList(); 
    }
}