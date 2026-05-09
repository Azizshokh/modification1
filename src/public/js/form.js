// ============================================================
//  form.js — Form va Rasm yuklash funksiyalari
// ============================================================

/**
 * Mahsulot rasmlari uchun upload boxlarni ishga tushiradi
 *
 * Qanday ishlaydi:
 * - Box bosilganda file input ochiladi
 * - Agar rasm tanlangan bo'lsa — bosganda o'chiriladi (toggle)
 * - Rasm tanlanganida preview ko'rinadi
 */
function initProductImageUpload() {
    const uploadBoxes = document.querySelectorAll('.upload-grid .upload-box');
    if (!uploadBoxes.length) return;

    uploadBoxes.forEach(function (box) {
        const fileInput = box.querySelector('input[type="file"]');
        if (!fileInput) return;

        // Box bosilganda
        box.addEventListener('click', function () {

            // Agar rasm allaqachon bor bo'lsa — o'chir (toggle)
            if (box.classList.contains('has-image')) {
                fileInput.value = '';                          // File inputni tozala
                const oldPreview = box.querySelector('img.slot-preview');
                if (oldPreview) oldPreview.remove();           // Preview rasmini o'chir
                box.classList.remove('has-image');             // has-image classini olib tashlash
                return;
            }

            // Rasm yo'q bo'lsa — file dialogini ochish
            fileInput.click();
        });

        // Fayl tanlanganda
        fileInput.addEventListener('change', function () {
            const selectedFile = fileInput.files && fileInput.files[0];
            if (!selectedFile) return;

            // Eski preview bo'lsa o'chir
            const oldPreview = box.querySelector('img.slot-preview');
            if (oldPreview) oldPreview.remove();

            // Yangi preview yaratish
            const previewImg = document.createElement('img');
            previewImg.className = 'slot-preview';
            previewImg.src = URL.createObjectURL(selectedFile);

            // Rasm yuklangandan keyin URL ni tozalash (xotira)
            previewImg.onload = function () {
                URL.revokeObjectURL(previewImg.src);
            };

            box.appendChild(previewImg);
            box.classList.add('has-image');
        });
    });
}

/**
 * Mahsulot formini ko'rsatish / yashirish (toggle)
 * Form ko'rsatilganda measurement fieldlarini ham sinxronlashtiradi
 */
function toggleProductForm() {
    const formSection = document.getElementById('product-form-section');
    const toggleButton = document.getElementById('toggle-form-btn');

    if (!formSection || !toggleButton) return;

    // Agar form yashirin bo'lsa — ko'rsat
    if (formSection.style.display === 'none') {
        formSection.style.display = 'block';
        syncProductMeasurementFields();    // Og'irlik/o'lcham fieldlarini yangilash
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleButton.style.display = 'none';
        return;
    }

    // Agar form ko'rinib tursa — yashir
    formSection.style.display = 'none';
    toggleButton.style.display = 'flex';
}

/**
 * Mahsulot kolleksiyasiga qarab og'irlik yoki o'lcham fieldini ko'rsatadi
 *
 * Qoida:
 * - GADGETS tanlansa → o'lcham (size) ko'rsatiladi, og'irlik (weight) yashiriladi
 * - Boshqa kolleksiya → og'irlik (weight) ko'rsatiladi, o'lcham (size) yashiriladi
 */
function syncProductMeasurementFields() {
    const collectionSelect = document.getElementById('product-collection-select');
    const weightField = document.getElementById('weight-field');
    const sizeField = document.getElementById('size-field');
    const weightSelect = document.getElementById('product-weight-select');
    const sizeSelect = document.getElementById('product-size-select');

    // Elementlar mavjudligini tekshirish
    if (!collectionSelect || !weightField || !sizeField || !weightSelect || !sizeSelect) return;

    const isGadget = collectionSelect.value === 'GADGETS';

    // Field'larni ko'rsatish / yashirish
    weightField.style.display = isGadget ? 'none' : 'flex';
    sizeField.style.display = isGadget ? 'flex' : 'none';

    // Select'larni yoqish / o'chirish
    weightSelect.disabled = isGadget;
    sizeSelect.disabled = !isGadget;

    // Required ni belgilash (faqat ko'rinadigan field required bo'lsin)
    weightSelect.required = !isGadget;
    sizeSelect.required = isGadget;
}