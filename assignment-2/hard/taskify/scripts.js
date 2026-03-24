

function toggleForm(open){
    const form = document.getElementById('task-modal');
    if(open){
        form.classList.remove('hidden');
    }else{
        form.classList.add('hidden');
    }
}

function handleFormSubmission(state){

    const taskHeadingEl = document.getElementById('task-heading');
    const taskSubheadingEl = document.getElementById('task-subheading');
    const priorityEl = document.getElementById('task-priority');

    const taskHeading = taskHeadingEl.value.trim();
    const taskSubheading = taskSubheadingEl.value.trim();
    const priority = priorityEl.value;

    // create a card
    let card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');

    card.innerHTML=`
        <h4>${taskHeading}</h4>
        <p class="task-desc">${taskSubheading} </p>
        <p class="task-priority-${priority}">${priority}</p>
    `;

    const data= {
        id: parseInt(Math.random()*1000000),
        title: taskHeading,
        desc: taskSubheading,
        priority: priority,
        state: state
    }
    console.log(data);

    // saving to session storage
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.push(data);
    localStorage.setItem('myTasks', JSON.stringify(tasks));

    const columnToAppend = document.getElementById(`task-container-${state}`);
    console.log(columnToAppend);
    columnToAppend.appendChild(card);

    // Reset inputs
    taskHeadingEl.value = '';
    taskSubheadingEl.value = '';
    priorityEl.value = 'easy';

    toggleForm(false);
}

let stateToAppend = null;
// to add event through the + button in navbar
const addEvent = document.getElementById('add-Event');
addEvent.addEventListener('click', ()=>{
    stateToAppend= 'pending';
    toggleForm(true);
});

// making the close button in the input-form to be functional
const closeModal = document.getElementById('close-modal');
closeModal.addEventListener('click', ()=>{
    toggleForm(false);
    stateToAppend = null;
});

// making the submit button in the form to be functional
const submitModal=document.getElementById('create-task');
submitModal.addEventListener('click',()=>{
    // handle submission
    handleFormSubmission(stateToAppend);
    stateToAppend = null;
});

const addNewTask = document.querySelectorAll('.add-new');

addNewTask.forEach((addNew)=>{
    addNew.addEventListener('click', (e)=>{
        const parentDiv = addNew.parentElement;
        const targetState= parentDiv.getAttribute('data-state');;

        console.log(JSON.parse(localStorage.getItem('myTasks')));
        stateToAppend = targetState;
        toggleForm(true);

    });
});

function renderContent(){
    const container = JSON.parse(localStorage.getItem('myTasks')) || [];
    let pending='', ongoing='', underReview='', finished=''; 

    container.forEach((task)=>{
        if(task.state == 'pending'){
            pending += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc} </p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'ongoing'){
            ongoing += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc} </p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'underReview'){
            underReview += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc} </p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'finished'){
            finished += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc} </p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }
    });
    const taskContainerPending = document.getElementById('task-container-pending');
    taskContainerPending.innerHTML = pending;

    const taskContainerOngoing = document.getElementById('task-container-ongoing');
    taskContainerOngoing.innerHTML = ongoing;

    const taskContainerUnderReview = document.getElementById('task-container-underReview');
    taskContainerUnderReview.innerHTML = underReview;

    const taskContainerFinished = document.getElementById('task-container-finished');
    taskContainerFinished.innerHTML = finished;
}

renderContent();

function changeState(id, newState){
    const container = JSON.parse(localStorage.getItem('myTasks'));
    const element = container.find(p=>p.id.toString() ==id.toString());
    if(element){
        element.state = newState;
    }

    localStorage.setItem('myTasks', JSON.stringify(container));
}

// implementing the drag and drop functionality
const containers = document.querySelectorAll('.task-container');


let elementBeingDragged = null;

// 1. Listen for drag events on the WHOLE board
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-card')) {
        elementBeingDragged = e.target;
        // e.target.style.opacity = "0.5";

        e.target.classList.add('dragging');
        // console.log(e.target.id);

    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task-card')) {
        elementBeingDragged = null;
        // e.target.style.opacity = "1";
        e.target.classList.remove('dragging');
    }
});

containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault(); // Required to allow drop
        container.style.backgroundColor = "rgba(0,0,0,0.1)"; // Visual feedback
    });

    container.addEventListener('dragleave', () => {
        container.style.backgroundColor = "transparent"; // Reset feedback
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.backgroundColor = "transparent";
        if (elementBeingDragged) {
            // 1. Find the card that is immediately below our mouse cursor
            const afterElement = getDragAfterElement(container, e.clientY);
            
            if (afterElement == null) {
                // If no card is below us, just put it at the end
                container.appendChild(elementBeingDragged);

            } else {
                // If there is a card below us, insert our dragged card before it
                container.insertBefore(elementBeingDragged, afterElement);
            }

            changeState(elementBeingDragged.id, container.parentElement.getAttribute('data-state'));

            console.log(JSON.parse(localStorage.getItem('myTasks')));
        }
    });
});

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            // Calculate the distance between the mouse and the middle of the card
            const offset = y - box.top - box.height / 2;

            // We only care about cards the mouse is currently "above" (offset < 0)
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
}