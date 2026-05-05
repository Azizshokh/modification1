document.addEventListener('DOMContentLoaded', () => {
    initPhoneInputSanitizer();
    initSignupImagePreview();
    initSignupFormValidation();
    initUserStatusColors();

    initProductTabs();
    initProductStatusColors();
    filterProductRows('ALL');

    const collectionSelect = document.getElementById('product-collection-select');
    if (collectionSelect) {
        collectionSelect.addEventListener('change', syncProductMeasurementFields);
        syncProductMeasurementFields();
    }
});