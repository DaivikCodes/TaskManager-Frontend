//================================= state (database) Funcationalities start =================================

// default "state" variable data
let state = {
    tasks : {
        1: {
            url:"images/default_task.jpg",
            title:"Title",
            desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia necessitatibus voluptatum asperiores amet molestias molestiae id sed nesciunt obcaecati harum. Rem porro molestias consectetur dolorem temporibus adipisci unde obcaecati ex aliquam quidem, reiciendis enim corporis perferendis placeat quis voluptas iure maiores deserunt debitis at maxime? Magni veritatis ducimus quae molestiae!",
            tag: "daily",
        },
        2: {
            url:"images/default_task.jpg",
            title:"Title",
            desc:"Lorem ipsum dolor sit",
            tag: "special",
        },
        3: {
            url:"images/default_task.jpg",
            title:"Lorem",
            desc:"test description",
            tag: "important",
        },
    },
};

// "stateTypes" enumerator for ease of use
const stateTypes = Object.freeze({task: "tasks", });

function updateState(task_obj, type){
    // Adding/Updating the specified task to "state" variable
    // console.log(state[type]);

    state[type][task_obj.id] = {url: task_obj.url, title: task_obj.title, desc: task_obj.desc, tag: task_obj.tag};

    // reflecting the change in secondary storage
    updateLocalStorage();
}


function deleteTaskfromState(task_obj, type){
    // Deleting the specified task from "state" variable
    // console.log(state[type]);

    delete state[type][task_obj.id];

    // reflecting the change in secondary storage
    updateLocalStorage();
}

function loadData() {
    // load the stored "state" data from local storage
    readLocalStorage();
    // console.log(state);
    
    const task_container = document.querySelector(".task-container");

    // adding all the tasks, that are present in the "state" variable, to DOM
    for( let each_task in state["tasks"]){
        let newTask = state["tasks"][each_task];
        let prev = "";
        if(task_container != null)
            prev = task_container.innerHTML;
        
        task_container.insertAdjacentHTML('afterbegin',
        `<div class="task" onclick="openViewForm(this)" id=${each_task}>
            <img src=${newTask.url} alt="">
            <div class="content">
                <h2>${newTask.title}</h2>
                <p>${newTask.desc}</p>
            </div>
            <div class="tags ${newTask.tag}"><div class="text">${newTask.tag}</div></div>
        </div>`);
    }
}


//================================= Local Storage Funcationalities start =================================
function readLocalStorage(){
    // reading the saved "state" value from loacal storage
    state = JSON.parse(window.localStorage.getItem("state"));
}

function updateLocalStorage() {
    // console.log(state);
    // writing the current "state" value to loacal storage
    window.localStorage.setItem("state", JSON.stringify(state));
}


//================================= Adding new task start =================================

function closeTaskForm(){
    // clearing all the input fields of Add task form before closing it
    clearNewTaskForm();

    /// making Add task form hidden
    const addTaskModal = document.getElementById("add-task-modal");
    addTaskModal.className = "add-task-modal-close";
}

function openTaskForm(){
    // making Add task form visible
    const addTaskModal = document.getElementById("add-task-modal");
    addTaskModal.className = "add-task-modal";
}

function createNewTask(e){
    // stored the DOM element
    const form = e.parentNode.parentNode;

    // creating the unique ID for the task
    const newID = Date.now();

    // creating a task object with, id = newID (recently generated unique ID)
    const newTask = {id: newID};

    // filling all the task details, to the values given by the user
    newTask.url = form.children[0].children[1].value;
    if( !newTask.url ){
        newTask.url = "images/default_task.jpg";
    }
    newTask.title = form.children[1].children[1].value;
    newTask.desc = form.children[2].children[1].value;

    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        if( form.children[3].children[1].children[i].children[0].checked === true){
            newTask.tag = form.children[3].children[1].children[i].children[0].id.toLowerCase();
        }
    }

    // adding the task to state.tasks and updating the secondary storage
    updateState(newTask, stateTypes["task"]);

    // adding element to DOM
    const task_container = document.querySelector(".task-container");
    task_container.insertAdjacentHTML('afterbegin',
    `<div class="task" onclick="openViewForm(this)" id=${newID}>
        <img src=${newTask.url} alt="">
        <div class="content">
            <h2>${newTask.title}</h2>
            <p>${newTask.desc}</p>
        </div>
        <div class="tags ${newTask.tag}"><div class="text">${newTask.tag}</div></div>
    </div>
    `);

    // closing the Add task form
    closeTaskForm();
}

function clearNewTaskForm(){
    // clears the Add task form input fields
    const form = document.querySelector(".add-task-modal").children[0].children[1];

    form.children[0].children[1].value = "";
    form.children[1].children[1].value = "";
    form.children[2].children[1].value = "";

    // all radio buttons are unchecked
    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        form.children[3].children[1].children[i].children[0].checked = false;
    }
}

//================================= Editing task start =================================


let currentTask = {id: "", url: "", title: "", desc: "", tag: ""}

function openViewForm(e){
    // store the task details in variables: id, url, title, desc, tag for ease of use
    let id = e.id;
    let url = e.children[0].src;
    let title = e.children[1].children[0].textContent;
    let desc = e.children[1].children[1].textContent;
    let tag = e.children[2].children[0].textContent.toLowerCase();

    // setting currentTask values to the opened task details
    currentTask.id = id;
    currentTask.url = url;
    currentTask.title = title;
    currentTask.desc = desc;
    currentTask.tag = tag;
    
    // console.log(currentTask);

    // Setting up the View form to show the task details
    const viewTaskSec = document.getElementById("view-task-modal");
    viewTaskSec.className = "view-task-modal";

    const form = viewTaskSec.children[0].children[1];
    form.id = id;

    form.children[0].children[1].placeholder = url;
    form.children[1].children[1].placeholder = title;
    form.children[2].children[1].placeholder = desc;
    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        if( form.children[3].children[1].children[i].children[0].id.includes(tag) ){
            form.children[3].children[1].children[i].children[0].checked = true;
        }
    }
}

function editViewForm(){
    const viewTaskSec = document.getElementById("view-task-modal");
    viewTaskSec.className = "view-task-modal";

    const form = viewTaskSec.children[0].children[1];

    // making all the input field editable
    form.children[0].children[1].disabled = false;
    form.children[1].children[1].disabled = false;
    form.children[2].children[1].disabled = false;

    // input fields values are set to thier current value(s)
    form.children[0].children[1].value = currentTask.url;
    form.children[1].children[1].value = currentTask.title;
    form.children[2].children[1].value = currentTask.desc;
    
    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        form.children[3].children[1].children[i].children[0].disabled = false;
    }

    // enabling the cancel & save buttons
    for(let i=0; i < form.children[4].children.length; i++ ) {
        form.children[4].children[i].disabled = false;
    }
}

function cancelChanges(){
    const viewTaskSec = document.getElementById("view-task-modal");
    const form = viewTaskSec.children[0].children[1];
    
    // setting all the field back to state prior to editing
    form.children[0].children[1].value = currentTask.url;
    form.children[1].children[1].value = currentTask.title;
    form.children[2].children[1].value = currentTask.desc;

    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        if( form.children[3].children[1].children[i].children[0].id.includes(currentTask.tag) ){
            form.children[3].children[1].children[i].children[0].checked = true;
        }
    }
}

function saveChanges(){
    // making final confirmation from the user, before writing the changes in secondary/permanent storage
    if( confirm("Do you want to save changes?") === true ){

        // updating the currentTask all property values
        const viewTaskSec = document.getElementById("view-task-modal");
        const form = viewTaskSec.children[0].children[1];
    
        currentTask.url = form.children[0].children[1].value;
        currentTask.title = form.children[1].children[1].value;
        currentTask.desc = form.children[2].children[1].value;
    
        for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
            if( form.children[3].children[1].children[i].children[0].checked === true){
                currentTask.tag = form.children[3].children[1].children[i].children[0].id.split("-")[1].toLowerCase();
            }
        }

        // Calling the updateState to write changes to storage
        // console.log(currentTask);
        updateState(currentTask,stateTypes["task"]);


        // reflecting the changes in DOM
        const thisTask = document.getElementById(currentTask.id);
        thisTask.innerHTML = 
        `   <img src=${currentTask.url} alt="">
            <div class="content">
                <h2>${currentTask.title}</h2>
                <p>${currentTask.desc}</p>
            </div>
            <div class="tags ${currentTask.tag}"><div class="text">${currentTask.tag}</div></div>`;
        closeViewForm();
    }
}

function deleteTask(e){
    // final confirmation from the user before deleting the task
    if(confirm("You want to delete this task?")){
        deleteTaskfromState(currentTask,stateTypes["task"]);

        // removing the task from DOM 
        const task_container = document.querySelector(".task-container");
        task_container.removeChild(document.getElementById(currentTask.id));

        // closing the View form
        closeViewForm();
        return
    }
}

function closeViewForm(){
    // change the class of View form from open to closed
    const viewTaskSec = document.getElementById("view-task-modal");
    viewTaskSec.className = "view-task-modal-close";

    // get the form element
    const form = viewTaskSec.children[0].children[1];

    // set all inputs to default, so that when another/same task is opened/viewed the all inputs are read-only (ie disabled)
    form.children[0].children[1].disabled = true;
    form.children[1].children[1].disabled = true;
    form.children[2].children[1].disabled = true;

    // all the input fields are cleared
    form.children[0].children[1].value = null;
    form.children[1].children[1].value = null;
    form.children[2].children[1].value = null;

    // all the radio buttons are disabled
    for(let i=0; i < form.children[3].children[1].children.length; i++ ) {
        form.children[3].children[1].children[i].children[0].disabled = true;
    }

    // all the both cancel and save buttons are disabled as they are only required in edit-mode
    for(let i=0; i < form.children[4].children.length; i++ ) {
        form.children[4].children[i].disabled = true;
    }
}


//================================= Searching functionality =================================

function searchTask(e){
    let search_term;

    // if button called the function then we need to access the sibling element (search input) value
    // else the search-bar (search input) has called the function
    if(e.tagName === document.createElement("button"))
        search_term = e.parentNode.children[0].value;
    else
        search_term = e.value;
        
    // clear all tasks
    const task_container = document.querySelector(".task-container");
    task_container.innerHTML = "";

    // if search term is empty then load all tasks and return
    if(!search_term){
        loadData();
        return;
    }

    // loop through all tasks and add the ones that contains search terms
    for( let task in state[stateTypes.task]){
        const taskObj = state[stateTypes.task][task];

        if( taskObj.title.toLowerCase().includes(search_term.toLowerCase()) ){
            task_container.innerHTML = 
            `<div class="task" onclick="openViewForm(this)" id=${task}>
                <img src=${taskObj.url} alt="">
                <div class="content">
                    <h2>${taskObj.title}</h2>
                    <p>${taskObj.desc}</p>
                </div>
                <div class="tags ${taskObj.tag}"><div class="text">${taskObj.tag}</div></div>
            </div>` + task_container.innerHTML;
        }
    }
}


//================================= Script Starts here =================================

if(!window.localStorage.getItem("state")){
    updateLocalStorage();
}
loadData();