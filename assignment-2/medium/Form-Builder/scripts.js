const submitBtn = document.getElementById('addFieldBtn');
const previewArea = document.getElementById('dynamicForm'); // The container in the preview
const fieldLabelInput = document.getElementById('fieldLabel');
const fieldTypeSelect = document.getElementById('fieldType');

submitBtn.addEventListener('click', (event) => {
    // 1. Get the current values from the form builder
    const labelText = fieldLabelInput.value;
    const selectedType = fieldTypeSelect.value;

    // Validation: Don't add anything if the label is empty
    if (labelText.trim() === "") {
        alert("Please enter a label for your field.");
        return;
    }

    // 2. Create a wrapper div for the new field to keep it tidy
    const fieldWrapper = document.createElement('div');
    fieldWrapper.style.marginBottom = "15px";

    // 3. Create the Label element
    const newLabel = document.createElement('label');
    newLabel.textContent = labelText + " ";
    newLabel.style.display = (selectedType === 'text') ? "block" : "inline-block";

    // 4. Create the Input element
    const newInput = document.createElement('input');
    newInput.type = selectedType;
    
    // Add a class for styling if it's a text box
    if (selectedType === 'text') {
        newInput.placeholder = "Enter text...";
        newInput.style.display = "block";
        newInput.style.width = "100%";
    }

    // 5. Clear the placeholder text in the preview if it's the first element
    const placeholder = previewArea.querySelector('.placeholder-text');
    if (placeholder) {
        placeholder.remove();
    }

    // 6. Assemble the elements
    // For checkboxes/radios, the input usually comes before the label or vice versa
    if (selectedType === 'text') {
        fieldWrapper.appendChild(newLabel);
        fieldWrapper.appendChild(newInput);
    } else {
        fieldWrapper.appendChild(newInput);
        fieldWrapper.appendChild(newLabel);
    }

    // 7. Push to the Preview Area
    previewArea.appendChild(fieldWrapper);

    // 8. Clear the input field for the next one
    fieldLabelInput.value = "";
});