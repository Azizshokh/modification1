// ============================================================
//  utils.js — Umumiy yordamchi funksiyalar
// ============================================================

/**
 * Foydalanuvchiga alert ko'rsatadi
 * @param {string} message - Ko'rsatiladigan xabar
 */
function showValidationAlert(message) {
    alert(message);
}

/**
 * Sahifalar orasida o'tish (SPA uslubida)
 * Barcha .page elementlardan 'active' classini olib tashlaydi,
 * keyin faqat tanlangan sahifaga 'active' class qo'shadi
 * @param {string} name - Sahifa nomi (masalan: 'users', 'products')
 */
function showPage(name) {
    // Barcha sahifalarni yashir
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(function (page) {
        page.classList.remove('active');
    });

    // Faqat kerakli sahifani ko'rsat
    const targetPage = document.getElementById('page-' + name);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0); // Sahifa tepasiga qaytish
    }
}

/**
 * Status dropdown (select) elementiga rang class qo'shadi
 * Har safar select o'zgarganda avval eski rangni olib tashlaydi,
 * keyin yangi qiymatga mos rang qo'shadi
 * @param {HTMLSelectElement} select - Rang beriladigan select elementi
 */
function applyStatusSelectColor(select) {
    // Avval barcha status ranglarini olib tashlash
    select.classList.remove(
        'status-process',
        'status-pause',
        'status-deleted',
        'status-active',
        'status-accepted',
        'status-blocked',
        'status-cancelled',
        'status-completed'
    );

    // Hozirgi qiymatga qarab rang berish
    const currentValue = select.value;

    if (currentValue === 'PROCESS') select.classList.add('status-process');
    if (currentValue === 'ACTIVE') select.classList.add('status-active');
    if (currentValue === 'ACCEPTED') select.classList.add('status-accepted');
    if (currentValue === 'PAUSE') select.classList.add('status-pause');
    if (currentValue === 'BLOCKED') select.classList.add('status-blocked');
    if (currentValue === 'CANCELLED') select.classList.add('status-cancelled');
    if (currentValue === 'COMPLETED') select.classList.add('status-completed');
    if (currentValue === 'DELETED') select.classList.add('status-deleted');
}