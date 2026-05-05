function toggleProductForm() {
    const formSection = document.getElementById('product-form-section');
    const toggleButton = document.getElementById('toggle-form-btn');
    if (!formSection || !toggleButton) return;

    if (formSection.style.display === 'none') {
        formSection.style.display = 'block';
        syncProductMeasurementFields();
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleButton.style.display = 'none';
        return;
    }

    formSection.style.display = 'none';
    toggleButton.style.display = 'flex';
}

function syncProductMeasurementFields() {
    const collectionSelect = document.getElementById('product-collection-select');
    const weightField = document.getElementById('weight-field');
    const sizeField = document.getElementById('size-field');
    const weightSelect = document.getElementById('product-weight-select');
    const sizeSelect = document.getElementById('product-size-select');

    if (!collectionSelect || !weightField || !sizeField || !weightSelect || !sizeSelect) return;

    const isGadget = collectionSelect.value === 'GADGETS';
    weightField.style.display = isGadget ? 'none' : 'flex';
    sizeField.style.display = isGadget ? 'flex' : 'none';
    weightSelect.disabled = isGadget;
    sizeSelect.disabled = !isGadget;
    weightSelect.required = !isGadget;
    sizeSelect.required = isGadget;
}