// ============================================================
//  member.js — Member (Foydalanuvchi) bilan bog'liq funksiyalar
// ============================================================

/**
 * Telefon raqam inputini tozalaydi
 * Faqat raqam va + belgisiga ruxsat beradi
 * + belgisi faqat boshida bo'lishi mumkin
 */
function initPhoneInputSanitizer() {
    const phoneInputs = document.querySelectorAll('input[name="memberPhone"]');

    phoneInputs.forEach(function (phoneInput) {
        phoneInput.addEventListener('input', function () {
            // Raqam va + dan boshqa hamma belgini o'chirish
            let cleaned = phoneInput.value.replace(/[^\d+]/g, '');

            // + belgisi faqat birinchi o'rinda bo'lishi kerak
            cleaned = cleaned.replace(/(?!^)\+/g, '');

            // Agar o'zgartirish bo'lsa, yangi qiymatni qo'y
            if (cleaned !== phoneInput.value) {
                phoneInput.value = cleaned;
            }
        });
    });
}

/**
 * Signup sahifasidagi rasm tanlash va preview ko'rsatish
 * Rasm tanlanganida fayl nomini va preview rasmini yangilaydi
 */
function initSignupImagePreview() {
    const imageInput = document.getElementById('member-image-input');
    const fileNameInput = document.getElementById('file-name');
    const previewWrap = document.getElementById('signup-image-preview');
    const previewImage = document.getElementById('signup-image-preview-img');

    // Agar bu elementlar sahifada yo'q bo'lsa, chiqib ket
    if (!imageInput || !fileNameInput || !previewWrap || !previewImage) return;

    // Oldingi preview URL ni saqlash (xotira chiqitini tozalash uchun)
    let previousPreviewUrl = null;

    imageInput.addEventListener('change', function () {
        const selectedFile = imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;

        // Oldingi URL ni tozalash
        if (previousPreviewUrl) {
            URL.revokeObjectURL(previousPreviewUrl);
            previousPreviewUrl = null;
        }

        // Agar fayl tanlanmagan bo'lsa — preview ni tozala
        if (!selectedFile) {
            fileNameInput.value = '';
            previewImage.src = '';
            previewWrap.classList.remove('has-image');
            return;
        }

        // Fayl nomi va preview ni yangilash
        fileNameInput.value = selectedFile.name;
        previousPreviewUrl = URL.createObjectURL(selectedFile);
        previewImage.src = previousPreviewUrl;
        previewWrap.classList.add('has-image');
    });
}

/**
 * Signup formini submit qilishdan oldin tekshiradi:
 * 1. Rasm yuklanganmi?
 * 2. Telefon raqam to'g'rimi?
 * 3. Parol va tasdiqlash paroli bir xilmi?
 */
function initSignupFormValidation() {
    const signupForm = document.querySelector('form[action="/admin/signup"]');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function (event) {
        const imageField = signupForm.querySelector('input[name="memberImage"]');
        const phoneInput = signupForm.querySelector('input[name="memberPhone"]');
        const passwordInput = signupForm.querySelector('input[name="memberPassword"]');
        const confirmInput = signupForm.querySelector('input[name="confirmPassword"]');

        // Elementlar mavjudligini tekshirish
        if (!imageField || !phoneInput || !passwordInput || !confirmInput) return;

        // 1. Rasm tekshiruvi
        if (!imageField.files || imageField.files.length === 0) {
            event.preventDefault();
            showValidationAlert('Please insert admin photo!!!');
            return;
        }

        // 2. Telefon raqam tekshiruvi (7-15 raqam, + bilan yoki usiz)
        const phonePattern = /^\+?\d{7,15}$/;
        if (!phonePattern.test(phoneInput.value)) {
            event.preventDefault();
            showValidationAlert('Phone number is invalid, please check!!!');
            return;
        }

        // 3. Parol mosligini tekshirish
        if (passwordInput.value !== confirmInput.value) {
            event.preventDefault();
            showValidationAlert('Password differs, please check!!!');
        }
    });
}

/**
 * Users jadvalidagi stat cardlarni yangilaydi
 * (Active, Blocked, Deleted sonlarini hisoblaydi)
 */
function updateUserStatusCounts() {
    const allRows = document.querySelectorAll('#users-table-body tr[data-user-status]');

    let activeCount = 0;
    let blockedCount = 0;
    let deletedCount = 0;

    allRows.forEach(function (row) {
        const status = row.dataset.userStatus;
        if (status === 'ACTIVE') activeCount++;
        if (status === 'BLOCKED') blockedCount++;
        if (status === 'DELETED') deletedCount++;
    });

    // Stat card qiymatlarini yangilash (index bo'yicha)
    const statValues = document.querySelectorAll('.stat-card .stat-value');
    if (statValues[1]) statValues[1].textContent = activeCount;
    if (statValues[2]) statValues[2].textContent = blockedCount;
    if (statValues[3]) statValues[3].textContent = deletedCount;
}

/**
 * Users jadvalidagi har bir status select elementini ishga tushiradi
 * Status o'zgarganda serverga so'rov yuboradi va UI ni yangilaydi
 */
function initUserStatusColors() {
    const userSelects = document.querySelectorAll('.status-select[data-type="user"]');

    userSelects.forEach(function (select) {
        // Bir marta bog'langan bo'lsa, qayta bog'lama
        if (select.dataset.userStatusBound === '1') return;
        select.dataset.userStatusBound = '1';

        // Boshlang'ich rangni va oldingi statusni saqlash
        const row = select.closest('tr');
        select.dataset.prevStatus = row ? row.dataset.userStatus : select.value;
        applyStatusSelectColor(select);

        // Status o'zgarganda
        select.addEventListener('change', async function () {
            const memberId = select.dataset.id;
            const newStatus = select.value;
            const prevStatus = select.dataset.prevStatus;

            try {
                // Serverga yangi statusni yuborish
                await axios.post('/admin/user/edit', {
                    _id: memberId,
                    memberStatus: newStatus,
                });

                // Muvaffaqiyatli bo'lsa — UI ni yangilash
                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('User status updated successfully!');

                if (row) {
                    row.dataset.userStatus = newStatus;
                    updateUserStatusCounts();
                }

            } catch (error) {
                // Xato bo'lsa — oldingi statusga qaytarish
                const message = error.response?.data?.message || 'User status update failed. Please try again!';
                showValidationAlert(message);
                select.value = prevStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}