const addEvent = document.getElementById('add-Event');

addEvent.addEventListener('click', ()=>{

});

// implementing the drag and drop functionality
const containers = document.querySelectorAll('.task-container');


let elementBeingDragged = null;

// 1. Listen for drag events on the WHOLE board
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-card')) {
        elementBeingDragged = e.target;
        // e.target.style.opacity = "0.5";

        e.target.classList.add('dragging');
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