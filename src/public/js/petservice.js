function updatePetServiceTabCounts() {
    const rows = document.querySelectorAll('#petservices-table-body tr[data-ps-status]');
    const total = rows.length;
    const activeCount = Array.from(rows).filter((row) => row.dataset.psStatus === 'ACTIVE').length;
    const completedCount = Array.from(rows).filter((row) => row.dataset.psStatus === 'COMPLETED').length;
    const cancelledCount = Array.from(rows).filter((row) => row.dataset.psStatus === 'CANCELLED').length;
    const deletedCount = Array.from(rows).filter((row) => row.dataset.psStatus === 'DELETED').length;

    document.querySelectorAll('.tab-btn[data-ps-filter]').forEach((button) => {
        const filter = button.dataset.psFilter;
        if (filter === 'ALL') button.textContent = `All (${total})`;
        else if (filter === 'ACTIVE') button.textContent = `Active (${activeCount})`;
        else if (filter === 'COMPLETED') button.textContent = `Completed (${completedCount})`;
        else if (filter === 'CANCELLED') button.textContent = `Cancelled (${cancelledCount})`;
        else if (filter === 'DELETED') button.textContent = `Deleted (${deletedCount})`;
    });
}

function filterPetServiceRows(status) {
    const rows = document.querySelectorAll('#petservices-table-body tr[data-ps-status]');
    if (!rows.length) return;

    let visibleIndex = 0;
    rows.forEach((row) => {
        const matchesFilter = status === 'ALL' || row.dataset.psStatus === status;
        row.style.display = matchesFilter ? '' : 'none';

        if (!matchesFilter) return;

        visibleIndex += 1;
        const numberCell = row.querySelector('td');
        if (numberCell) numberCell.textContent = String(visibleIndex);
    });
}

function initPetServiceTabs() {
    document.querySelectorAll('.tab-btn[data-ps-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            const tabsContainer = button.closest('.tabs');
            if (!tabsContainer) return;

            tabsContainer.querySelectorAll('.tab-btn[data-ps-filter]').forEach((tab) => {
                tab.classList.remove('active');
            });
            button.classList.add('active');
            filterPetServiceRows(button.dataset.psFilter || 'ALL');
        });
    });
}

function initPetServiceStatusColors() {
    document.querySelectorAll('.status-select[data-petservice-id]').forEach((select) => {
        if (select.dataset.petserviceBound === '1') return;

        select.dataset.petserviceBound = '1';
        select.dataset.prevStatus = select.closest('tr')?.dataset.psStatus || select.value;
        applyStatusSelectColor(select);

        select.addEventListener('change', async () => {
            const id = select.dataset.petserviceId;
            const newStatus = select.value;
            const previousStatus = select.dataset.prevStatus;
            const row = select.closest('tr');

            try {
                await axios.post('/admin/pet-service/edit', {
                    _id: id,
                    serviceStatus: newStatus,
                });

                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('Pet service status updated successfully!');

                if (row) {
                    row.dataset.psStatus = newStatus;
                    updatePetServiceTabCounts();
                    const activeTab = document.querySelector('.tab-btn.active[data-ps-filter]');
                    if (activeTab) {
                        filterPetServiceRows(activeTab.dataset.psFilter || 'ALL');
                    }
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Pet service status update failed. Please try again!';
                showValidationAlert(message);
                select.value = previousStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}
