// ============================================================
//  product.js — Mahsulot bilan bog'liq funksiyalar
// ============================================================

/**
 * Products jadvalidagi tab tugmalarining sonlarini yangilaydi
 * (All, Active/Process, Paused, Deleted)
 */
function updateTabCounts() {
    const allRows = document.querySelectorAll('#products-table-body tr[data-status]');

    let processCount = 0;
    let pauseCount = 0;
    let deletedCount = 0;

    allRows.forEach(function (row) {
        const status = row.dataset.status;
        if (status === 'PROCESS') processCount++;
        if (status === 'PAUSE') pauseCount++;
        if (status === 'DELETED') deletedCount++;
    });

    const total = allRows.length;

    // Tab tugmalarini yangilash
    const tabButtons = document.querySelectorAll('.tab-btn[data-filter]');
    tabButtons.forEach(function (button) {
        const filter = button.dataset.filter;

        if (filter === 'ALL') button.textContent = 'All (' + total + ')';
        if (filter === 'PROCESS') button.textContent = 'Active (' + processCount + ')';
        if (filter === 'PAUSE') button.textContent = 'Paused (' + pauseCount + ')';
        if (filter === 'DELETED') button.textContent = 'Deleted (' + deletedCount + ')';
    });
}

/**
 * Products jadval qatorlarini status bo'yicha filtirlaydi
 * Ko'rinadigan qatorlarni qayta raqamlaydi (1, 2, 3...)
 * @param {string} status - Filter qiymati: 'ALL' | 'PROCESS' | 'PAUSE' | 'DELETED'
 */
function filterProductRows(status) {
    const allRows = document.querySelectorAll('#products-table-body tr[data-status]');
    if (!allRows.length) return;

    let visibleIndex = 0;

    allRows.forEach(function (row) {
        // Ushbu qator ko'rinadimi?
        const isVisible = (status === 'ALL') || (row.dataset.status === status);

        if (isVisible) {
            row.style.display = '';          // Ko'rsat
            visibleIndex++;

            // Birinchi ustundagi raqamni yangilash
            const firstCell = row.querySelector('td');
            if (firstCell) firstCell.textContent = String(visibleIndex);

        } else {
            row.style.display = 'none';      // Yashir
        }
    });
}

/**
 * Products tab tugmalarini ishga tushiradi
 * Tugma bosilganda aktiv class o'tadi va filtr ishga tushadi
 */
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn[data-filter]');

    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Faqat shu button'ning container'idagi tablarni boshqarish
            const tabsContainer = button.closest('.tabs');
            if (!tabsContainer) return;

            // Barcha tablardan active classini olib tashlash
            tabsContainer.querySelectorAll('.tab-btn[data-filter]').forEach(function (tab) {
                tab.classList.remove('active');
            });

            // Bosilgan tabga active class berish
            button.classList.add('active');

            // Filtrni ishga tushirish
            const selectedFilter = button.dataset.filter || 'ALL';
            filterProductRows(selectedFilter);
        });
    });
}

/**
 * Products jadvalidagi har bir status select elementini ishga tushiradi
 * Status o'zgarganda serverga so'rov yuboradi va UI ni yangilaydi
 */
function initProductStatusColors() {
    // data-type="user" bo'lganlarni o'tkazib yuborish (ular member.js da boshqariladi)
    const productSelects = document.querySelectorAll('.status-select[data-id]:not([data-type="user"])');

    productSelects.forEach(function (select) {
        // Bir marta bog'langan bo'lsa, qayta bog'lama
        if (select.dataset.productStatusBound === '1') return;
        select.dataset.productStatusBound = '1';

        // Boshlang'ich rangni va oldingi statusni saqlash
        const row = select.closest('tr');
        select.dataset.prevStatus = row ? row.dataset.status : select.value;
        applyStatusSelectColor(select);

        // Status o'zgarganda
        select.addEventListener('change', async function () {
            const productId = select.dataset.id;
            const newStatus = select.value;
            const prevStatus = select.dataset.prevStatus;

            try {
                // Serverga yangi statusni yuborish
                await axios.post('/admin/product/' + productId, {
                    productStatus: newStatus,
                });

                // Muvaffaqiyatli bo'lsa — UI ni yangilash
                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('Product status updated successfully!');

                if (row) {
                    row.dataset.status = newStatus;

                    // Tab sonlarini yangilash
                    updateTabCounts();

                    // Aktiv filterni qayta ishlatish
                    const activeTab = document.querySelector('.tab-btn.active[data-filter]');
                    if (activeTab) {
                        filterProductRows(activeTab.dataset.filter || 'ALL');
                    }
                }

            } catch (error) {
                // Xato bo'lsa — oldingi statusga qaytarish
                const message = error.response?.data?.message || 'Product status update failed. Please try again!';
                showValidationAlert(message);
                select.value = prevStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}