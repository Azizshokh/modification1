// ============================================================
//  init.js — Barcha funksiyalarni ishga tushiruvchi asosiy fayl
//
//  Bu fayl eng oxirida yuklanishi kerak (boshqa JS fayllardan keyin)
//  Chunki u boshqa fayllardagi funksiyalarni chaqiradi
// ============================================================

/**
 * DOM to'liq yuklangandan keyin barcha funksiyalarni ishga tushirish
 *
 * Tartib:
 * 1. Member (foydalanuvchi) funksiyalari
 * 2. Product (mahsulot) funksiyalari
 * 3. Pet Service funksiyalari
 * 4. Form funksiyalari
 */
document.addEventListener('DOMContentLoaded', function () {

    // ── 1. MEMBER funksiyalari ──────────────────────────────
    if (typeof initPhoneInputSanitizer === 'function') initPhoneInputSanitizer();
    if (typeof initSignupImagePreview === 'function') initSignupImagePreview();
    if (typeof initSignupFormValidation === 'function') initSignupFormValidation();
    if (typeof initUserStatusColors === 'function') initUserStatusColors();

    // ── 2. PRODUCT funksiyalari ─────────────────────────────
    if (typeof initProductTabs === 'function') initProductTabs();
    if (typeof initProductStatusColors === 'function') initProductStatusColors();
    if (typeof filterProductRows === 'function') filterProductRows('ALL');
    if (typeof initProductImageUpload === 'function') initProductImageUpload();

    const collectionSelect = document.getElementById('product-collection-select');
    if (collectionSelect && typeof syncProductMeasurementFields === 'function') {
        collectionSelect.addEventListener('change', syncProductMeasurementFields);
        syncProductMeasurementFields();
    }

    // ── 3. PET SERVICE funksiyalari ─────────────────────────
    if (typeof initPetServiceTabs === 'function') initPetServiceTabs();
    if (typeof initPetServiceStatusColors === 'function') initPetServiceStatusColors();
    if (typeof filterPetServiceRows === 'function') filterPetServiceRows('ALL');
});
