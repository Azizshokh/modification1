document.addEventListener('DOMContentLoaded', () => {
    initPhoneInputSanitizer();
    initSignupImagePreview();
    initSignupFormValidation();
    initUserStatusColors();

    initProductTabs();
    initProductStatusColors();
    filterProductRows('ALL');
    initProductImageUpload();
    initPetServiceTabs();
    initPetServiceStatusColors();
    filterPetServiceRows('ALL');

    const collectionSelect = document.getElementById('product-collection-select');
    if (collectionSelect) {
        collectionSelect.addEventListener('change', syncProductMeasurementFields);
        syncProductMeasurementFields();
    }
});