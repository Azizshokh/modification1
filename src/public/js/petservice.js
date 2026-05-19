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
    let pauseCount = 0;
    let acceptedCount = 0;
    let completedCount = 0;

    allRows.forEach(function (row) {
        const status = row.dataset.psStatus;
        if (status === 'PAUSE') pauseCount++;
        if (status === 'ACCEPTED') acceptedCount++;
        if (status === 'COMPLETED') completedCount++;
    });

    const total = allRows.length;

    // Tab tugmalarini yangilash
    const tabButtons = document.querySelectorAll('.tab-btn[data-ps-filter]');
    tabButtons.forEach(function (button) {
        const filter = button.dataset.psFilter;

        if (filter === 'ALL') button.textContent = 'All (' + total + ')';
        if (filter === 'PAUSE') button.textContent = 'Pause (' + pauseCount + ')';
        if (filter === 'ACCEPTED') button.textContent = 'Accepted (' + acceptedCount + ')';
        if (filter === 'COMPLETED') button.textContent = 'Completed (' + completedCount + ')';
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
// ============================================================
// Pet Service jadval polling - browser reload qilmasdan yangilash
// ============================================================

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatPsDate(value) {
    try {
        var d = new Date(value);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return ''; }
}

function buildPetServiceRow(service, index) {
    var member = (service.memberId && typeof service.memberId === 'object') ? service.memberId : null;
    var locationDisplay = service.serviceLocation === 'CLINIC' ? 'Clinic' : (service.serviceAddress || '');
    var memberNick = member ? member.memberNick : 'Unknown';
    var memberPhone = member ? member.memberPhone : '-';
    var statuses = ['PAUSE', 'ACCEPTED', 'COMPLETED'];
    var options = statuses.map(function (s) {
        var sel = service.serviceStatus === s ? ' selected' : '';
        return '<option value="' + s + '"' + sel + '>' + s + '</option>';
    }).join('');

    return '<tr data-ps-status="' + escapeHtml(service.serviceStatus) + '" data-ps-id="' + escapeHtml(service._id) + '">'
        + '<td>' + (index + 1) + '</td>'
        + '<td>' + escapeHtml(service.petName) + '</td>'
        + '<td>' + escapeHtml(service.petType) + '</td>'
        + '<td>' + escapeHtml(service.serviceType) + '</td>'
        + '<td>' + escapeHtml(formatPsDate(service.serviceDate)) + '</td>'
        + '<td>' + escapeHtml(service.serviceTime) + '</td>'
        + '<td>' + escapeHtml(locationDisplay) + '</td>'
        + '<td>' + escapeHtml(service.specialNote || '-') + '</td>'
        + '<td>' + escapeHtml(memberNick) + '</td>'
        + '<td>' + escapeHtml(memberPhone) + '</td>'
        + '<td><select class="status-select" data-petservice-id="' + escapeHtml(service._id) + '">' + options + '</select></td>'
        + '</tr>';
}

async function refreshPetServiceTable() {
    var tbody = document.getElementById('petservices-table-body');
    if (!tbody) return;
    try {
        var res = await axios.get('/admin/pet-service/list', { params: { _ts: Date.now() } });
        var services = (res.data && res.data.petServices) || [];

        // O'zgarish bormi - id+status hash bilan tekshirish
        var existing = Array.from(tbody.querySelectorAll('tr[data-ps-id]')).map(function (r) {
            return r.dataset.psId + ':' + r.dataset.psStatus;
        }).join('|');
        var incoming = services.map(function (s) { return s._id + ':' + s.serviceStatus; }).join('|');
        if (existing === incoming) return; // o'zgarish yo'q

        tbody.innerHTML = services.map(function (s, i) { return buildPetServiceRow(s, i); }).join('');

        // UI ni qayta bog'lash
        if (typeof initPetServiceStatusColors === 'function') initPetServiceStatusColors();
        if (typeof updatePetServiceTabCounts === 'function') updatePetServiceTabCounts();
        var activeTab = document.querySelector('.tab-btn.active[data-ps-filter]');
        var filter = activeTab ? (activeTab.dataset.psFilter || 'ALL') : 'ALL';
        if (typeof filterPetServiceRows === 'function') filterPetServiceRows(filter);
    } catch (e) {
        // jim qoldiramiz - polling davom etadi
    }
}

function initPetServicePolling() {
    if (!document.getElementById('petservices-table-body')) return;
    if (window.__petServicePollHandle) clearInterval(window.__petServicePollHandle);
    window.__petServicePollHandle = setInterval(refreshPetServiceTable, 5000);
}
