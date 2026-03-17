function changeBackgroundColor(color){
    document.body.style.backgroundColor = color;
}

/*
const btn = document.querySelectorAll('.btn');
btn.forEach((element)=>{
    element.addEventListener('click',()=>{
        // console.log(element.classList[0]);
        changeBackgroundColor(element.dataset.color);
    });
});
*/

// insted of adding an event listener to all the buttons this is a good practice for DOM rendering 
const colorContainer = document.querySelector('.colorContainer');
colorContainer.addEventListener('click', (event)=>{
    const targetElement = event.target;
    changeBackgroundColor(targetElement.dataset.color);
});

// logic for custom color
const customColorBtn = document.getElementById('addCustomBtn');
const inputFieldArea = document.getElementById('inputFieldArea');
const submitColor= document.getElementById('submitColor');
const cancelBtn = document.getElementById('cancelBtn');

// TOGGLE LOGIC (The new "Separation of Concerns" way)
function showInputBox(show){
    if(show){
        customColorBtn.classList.add('hidden');
        inputFieldArea.classList.remove('hidden');
    }else{    
        /*  
        customColorBtn.style.display = 'block';
        inputFieldArea.style.display = 'none';
        */

        // this is better than the above as this follows Separation of Concerns (CSS vs JS)
        // keeping the styles in css file and the logic in js file

        customColorBtn.classList.remove('hidden');
        inputFieldArea.classList.add('hidden');
    }
}

customColorBtn.addEventListener('click', ()=>{
    showInputBox(true);
});

cancelBtn.addEventListener('click',()=>{
    showInputBox(false);
});

submitColor.addEventListener('click', ()=>{
    const color = document.getElementById('hexInput').value;
    if(color){
        changeBackgroundColor(color);
        showInputBox(false);
    }
});

