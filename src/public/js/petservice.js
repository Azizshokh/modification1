// ============================================================
//  petservice.js — Pet Service bilan bog'liq funksiyalar
// ============================================================

/**
 * Pet Service jadvalidagi tab tugmalarining sonlarini yangilaydi
 * (All, Active, Completed, Cancelled, Deleted)
 */
function updatePetServiceTabCounts() {
    const allRows = document.querySelectorAll('#petservices-table-body tr[data-ps-status]');

    // Har bir status sonini hisoblash
    let activeCount = 0;
    let acceptedCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    allRows.forEach(function (row) {
        const status = row.dataset.psStatus;
        if (status === 'ACTIVE') activeCount++;
        if (status === 'ACCEPTED') acceptedCount++;
        if (status === 'COMPLETED') completedCount++;
        if (status === 'CANCELLED') cancelledCount++;
    });

    const total = allRows.length;

    // Tab tugmalarini yangilash
    const tabButtons = document.querySelectorAll('.tab-btn[data-ps-filter]');
    tabButtons.forEach(function (button) {
        const filter = button.dataset.psFilter;

        if (filter === 'ALL') button.textContent = 'All (' + total + ')';
        if (filter === 'ACTIVE') button.textContent = 'Active (' + activeCount + ')';
        if (filter === 'ACCEPTED') button.textContent = 'Accepted (' + acceptedCount + ')';
        if (filter === 'COMPLETED') button.textContent = 'Completed (' + completedCount + ')';
        if (filter === 'CANCELLED') button.textContent = 'Cancelled (' + cancelledCount + ')';
    });
}

/**
 * Pet Service jadval qatorlarini status bo'yicha filtirlaydi
 * Ko'rinadigan qatorlarni qayta raqamlaydi (1, 2, 3...)
 * @param {string} status - Filter qiymati: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DELETED'
 */
function filterPetServiceRows(status) {
    const allRows = document.querySelectorAll('#petservices-table-body tr[data-ps-status]');
    if (!allRows.length) return;

    let visibleIndex = 0;

    allRows.forEach(function (row) {
        // Ushbu qator ko'rinadimi?
        const isVisible = (status === 'ALL') || (row.dataset.psStatus === status);

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
 * Pet Service tab tugmalarini ishga tushiradi
 * Tugma bosilganda aktiv class o'tadi va filtr ishga tushadi
 */
function initPetServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn[data-ps-filter]');

    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Faqat shu button'ning container'idagi tablarni boshqarish
            const tabsContainer = button.closest('.tabs');
            if (!tabsContainer) return;

            // Barcha tablardan active classini olib tashlash
            tabsContainer.querySelectorAll('.tab-btn[data-ps-filter]').forEach(function (tab) {
                tab.classList.remove('active');
            });

            // Bosilgan tabga active class berish
            button.classList.add('active');

            // Filtrni ishga tushirish
            const selectedFilter = button.dataset.psFilter || 'ALL';
            filterPetServiceRows(selectedFilter);
        });
    });
}

/**
 * Pet Service jadvalidagi har bir status select elementini ishga tushiradi
 * Status o'zgarganda serverga so'rov yuboradi va UI ni yangilaydi
 */
function initPetServiceStatusColors() {
    const petServiceSelects = document.querySelectorAll('.status-select[data-petservice-id]');

    petServiceSelects.forEach(function (select) {
        // Bir marta bog'langan bo'lsa, qayta bog'lama
        if (select.dataset.petserviceBound === '1') return;
        select.dataset.petserviceBound = '1';

        // Boshlang'ich rangni va oldingi statusni saqlash
        const row = select.closest('tr');
        select.dataset.prevStatus = row ? row.dataset.psStatus : select.value;
        applyStatusSelectColor(select);

        // Status o'zgarganda
        select.addEventListener('change', async function () {
            const serviceId = select.dataset.petserviceId;
            const newStatus = select.value;
            const prevStatus = select.dataset.prevStatus;

            try {
                // Serverga yangi statusni yuborish
                await axios.post('/admin/pet-service/edit', {
                    _id: serviceId,
                    serviceStatus: newStatus,
                });

                // Muvaffaqiyatli bo'lsa — UI ni yangilash
                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('Pet service status updated successfully!');

                if (row) {
                    row.dataset.psStatus = newStatus;

                    // Tab sonlarini yangilash
                    updatePetServiceTabCounts();

                    // Aktiv filterni qayta ishlatish
                    const activeTab = document.querySelector('.tab-btn.active[data-ps-filter]');
                    if (activeTab) {
                        filterPetServiceRows(activeTab.dataset.psFilter || 'ALL');
                    }
                }

            } catch (error) {
                // Xato bo'lsa — oldingi statusga qaytarish
                const message = error.response?.data?.message || 'Pet service status update failed. Please try again!';
                showValidationAlert(message);
                select.value = prevStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}