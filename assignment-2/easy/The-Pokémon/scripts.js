/**
 * POKEMON GAME - CORE LOGIC
 */

// 1. ADDING A POKEMON (API + LOCAL STORAGE)
async function catchPokemon() {
    const nameInput = document.getElementById('pokeInput');
    const qtyInput = document.getElementById('pokeQtyInput');
    
    const name = nameInput.value.toLowerCase().trim();
    const quantity = parseInt(qtyInput.value) || 1; // Default to 1 if empty

    if (!name) return;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Pokemon not found");
        
        const data = await response.json();
        let collections = JSON.parse(localStorage.getItem('myPokes')) || [];

        // Check if exists
        const existingPokemon = collections.find(p => p.id === data.id);
        
        if (existingPokemon) {
            existingPokemon.qty += quantity;
        } else {
            const pokemonData = {
                name: data.name,
                image: data.sprites.front_default,
                id: data.id,
                qty: quantity
            };
            collections.push(pokemonData);
        }

        localStorage.setItem('myPokes', JSON.stringify(collections));
        displayCards();
        
        // Reset UI
        nameInput.value = "";
        qtyInput.value = "";
    } catch (error) {
        alert(error.message);
    }
}

// 2. DISPLAY LOGIC
function displayCards() {
    const containerMain = document.getElementById('grid-container');
    const myPokes = JSON.parse(localStorage.getItem('myPokes')) || [];

    // Corrected check for empty collection
    if (myPokes.length === 0) {
        containerMain.innerHTML = "<h2>No Pokemon in your collection. Add a few to display them here.</h2>";
        return;
    }

    let htmlContent = '';
    myPokes.forEach((pokes) => {
        htmlContent += `
            <div class="grid-card" id="card-${pokes.id}">
                <div class="card">
                    <img class="cardImage" src="${pokes.image}">
                    <h3 style="text-transform: capitalize;">${pokes.name}</h3>
                    <p>#${pokes.id}</p>
                </div>

                <div class="view-mode">
                    <h3>X ${pokes.qty}</h3> 
                    <button class="btn-delete" data-id="${pokes.id}">delete</button> 
                    <button class="btn-edit" data-id="${pokes.id}">edit</button>
                </div>

                <div class="edit-mode hidden">
                    <input type="number" class="edit-qty-input" value="${pokes.qty}" style="width: 50px;">
                    <button class="btn-save" data-id="${pokes.id}">OK</button>
                    <button class="btn-cancel" data-id="${pokes.id}">Cancel</button>
                </div>
            </div> 
        `;
    });
    containerMain.innerHTML = htmlContent;
}

// 3. EDIT / SAVE / DELETE LOGIC
function toggleEditMode(id, isEditing) {
    const card = document.getElementById(`card-${id}`);
    const viewDiv = card.querySelector('.view-mode');
    const editDiv = card.querySelector('.edit-mode');

    if (isEditing) {
        viewDiv.classList.add('hidden');
        editDiv.classList.remove('hidden');
    } else {
        viewDiv.classList.remove('hidden');
        editDiv.classList.add('hidden');
    }
}

function saveEdit(id) {
    const card = document.getElementById(`card-${id}`);
    const newQty = parseInt(card.querySelector('.edit-qty-input').value);

    if (newQty === -1) {
        alert("Error: Quantity cannot be -1.");
        return;
    }

    if (newQty === 0) {
        deleteCard(id);
        return;
    }

    if (!isNaN(newQty) && newQty > 0) {
        let collections = JSON.parse(localStorage.getItem('myPokes')) || [];
        const pokemon = collections.find(p => p.id === id);
        if (pokemon) {
            pokemon.qty = newQty;
            localStorage.setItem('myPokes', JSON.stringify(collections));
            displayCards();
        }
    } else {
        alert("Please enter a valid number.");
    }
}

function deleteCard(id) {
    let collections = JSON.parse(localStorage.getItem('myPokes')) || [];
    const newCollection = collections.filter(p => p.id !== id);
    localStorage.setItem('myPokes', JSON.stringify(newCollection));
    displayCards();
}

// 4. NAVBAR UI LOGIC
function addCardLogic() {
    const addNewBtn = document.getElementById('addCard');
    const newCardInputArea = document.getElementById('addNewCardInput');
    const submitBtn = document.getElementById('pokeInput-submit');
    const cancelBtn = document.getElementById('pokeInput-cancel');

    addNewBtn.addEventListener('click', () => {
        newCardInputArea.classList.remove('hidden');
        addNewBtn.classList.add('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        newCardInputArea.classList.add('hidden');
        addNewBtn.classList.remove('hidden');
    });

    submitBtn.addEventListener('click', catchPokemon);
}

// 5. GLOBAL EVENT LISTENER (Event Delegation)
// This stays outside displayCards to prevent multiple listeners!
document.getElementById('grid-container').addEventListener('click', (event) => {
    const target = event.target;
    const id = parseInt(target.getAttribute('data-id'));

    if (target.classList.contains('btn-delete')) {
        deleteCard(id);
    } else if (target.classList.contains('btn-edit')) {
        toggleEditMode(id, true);
    } else if (target.classList.contains('btn-save')) {
        saveEdit(id);
    } else if (target.classList.contains('btn-cancel')) {
        toggleEditMode(id, false);
    }
});

// INITIALIZE APP
addCardLogic();
displayCards();