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
        status: "to-do" // DEFAULT STATUS: todo
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
            <button class="card-btn edit" onclick="editTask(${task.id})">
                <i class="fa-solid fa-pen edit-icon"></i> 
            </button>
            <button class="card-btn delete" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
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
    const card = document.getElementById(id);
    const title = card.querySelector("h4");
    const category = card.querySelector(".category");
    const editBtn = card.querySelector(".edit");
    const icon = card.querySelector(".edit-icon");

    const isEditable = title.isContentEditable;

    if(!isEditable){
        // MAKE TASK EDITABLE
        title.contentEditable = "true";
        title.focus();

        // MAKE CATEGORY EDITABLE
        if(!category){
            category = document.createElement("span");
            category.classList.add("category");
            category.innerText = "";
            card.insertBefore(category, card.querySelector(".card-actions"));
        }
        category.contentEditable = "true";
        
        // CHANGE FROM PEN TO CHECKMARK
        icon.classList.remove("fa-pen");
        icon.classList.add("fa-check");
        
        // DISABLE DRAG WHILE EDITING
        card.setAttribute("draggable", "false");

    } else {
        
        // DISABLE EDIT
        title.contentEditable = "false";
        if(category) category.contentEditable = "false";
        
        // CHANGE FROM CHECKMARK TO PEN
        icon.classList.remove("fa-check");
        icon.classList.add("fa-pen");
        editBtn.classList.remove("save");

        // RE-ENABLE DRAG
        card.setAttribute("draggable", "true");

        // UPDATE DATA AND LOCAL STORAGE
        const task = tasks.find(t => t.id === id);
        if(task){
            task.description = title.innerText.trim();
            task.category = category ? category.innerText.trim() : "";
            localStorage.setItem("tasks", JSON.stringify(tasks));
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
    
    // "this" REFERS TO LIST (todo, ongoing, completed)
    const newStatus = this.id; 

    // UPDATE DATA
    const taskIndex = tasks.findIndex(t => t.id === draggedCardId);
    
    if(taskIndex > -1){
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateTaskList(); 
    }
}