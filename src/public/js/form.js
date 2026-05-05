function initProductImageUpload() {
    const uploadBoxes = document.querySelectorAll('.upload-grid .upload-box');
    if (!uploadBoxes.length) return;

    uploadBoxes.forEach((box) => {
        const fileInput = box.querySelector('input[type="file"]');
        if (!fileInput) return;

        box.addEventListener('click', () => {
            if (box.classList.contains('has-image')) {
                fileInput.value = '';
                const preview = box.querySelector('img.slot-preview');
                if (preview) preview.remove();
                box.classList.remove('has-image');
                return;
            }
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;

            const existingPreview = box.querySelector('img.slot-preview');
            if (existingPreview) existingPreview.remove();

            const img = document.createElement('img');
            img.className = 'slot-preview';
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            box.appendChild(img);
            box.classList.add('has-image');
        });
    });
}

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