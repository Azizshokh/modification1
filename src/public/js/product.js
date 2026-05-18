// ============================================================
//  product.js — Mahsulot bilan bog'liq funksiyalar
// ============================================================

// Server-side status counts (products.ejs da hidden div orqali uzatiladi)
var productStatusCounts = (function () {
    var el = document.getElementById('product-counts-data');
    if (!el) return { ALL: 0, PROCESS: 0, PAUSE: 0, DELETED: 0 };
    return {
        ALL: parseInt(el.dataset.all, 10) || 0,
        PROCESS: parseInt(el.dataset.process, 10) || 0,
        PAUSE: parseInt(el.dataset.pause, 10) || 0,
        DELETED: parseInt(el.dataset.deleted, 10) || 0,
    };
})();

/**
 * Products jadvalidagi tab tugmalarining sonlarini yangilaydi
 * (All, Active/Process, Paused, Deleted)
 */
function updateTabCounts() {
    if (typeof productStatusCounts === 'undefined') return;

    const tabLinks = document.querySelectorAll('.tab-btn[data-filter]');
    tabLinks.forEach(function (el) {
        const filter = el.dataset.filter;
        if (filter === 'ALL') el.textContent = 'All (' + productStatusCounts.ALL + ')';
        if (filter === 'PROCESS') el.textContent = 'Active (' + productStatusCounts.PROCESS + ')';
        if (filter === 'PAUSE') el.textContent = 'Paused (' + productStatusCounts.PAUSE + ')';
        if (filter === 'DELETED') el.textContent = 'Deleted (' + productStatusCounts.DELETED + ')';
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
 * Tablar endi server-side filterlash uchun URL navigatsiya qiladi
 */
function initProductTabs() {
    // Tablar endi <a href> bilan ishlaydi — qo'shimcha JS shart emas
    // filterProductRows faqat muvofiq tab aktiv bo'lganda chaqiriladi (init.js)
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

                    // Global sonlarni yangilash (barcha productlar bo'yicha)
                    if (typeof productStatusCounts !== 'undefined') {
                        if (productStatusCounts[prevStatus] !== undefined) productStatusCounts[prevStatus]--;
                        if (productStatusCounts[newStatus] !== undefined) productStatusCounts[newStatus]++;
                    }

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