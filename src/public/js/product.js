function updateTabCounts() {
    const allRows = document.querySelectorAll('#products-table-body tr[data-status]');
    const total = allRows.length;
    const processCount = Array.from(allRows).filter((r) => r.dataset.status === 'PROCESS').length;
    const pauseCount = Array.from(allRows).filter((r) => r.dataset.status === 'PAUSE').length;

    document.querySelectorAll('.tab-btn').forEach((btn) => {
        const filter = btn.dataset.filter;
        if (filter === 'ALL') btn.textContent = `All (${total})`;
        else if (filter === 'PROCESS') btn.textContent = `Active (${processCount})`;
        else if (filter === 'PAUSE') btn.textContent = `Paused (${pauseCount})`;
        else if (filter === 'DELETED') btn.textContent = `Deleted (${Array.from(allRows).filter((r) => r.dataset.status === 'DELETED').length})`;
    });
}

function filterProductRows(status) {
    const productRows = document.querySelectorAll('#products-table-body tr[data-status]');
    if (!productRows.length) return;

    let visibleIndex = 0;
    productRows.forEach((row) => {
        const matchesFilter = status === 'ALL' || row.dataset.status === status;
        row.style.display = matchesFilter ? '' : 'none';

        if (!matchesFilter) return;

        visibleIndex += 1;
        const numberCell = row.querySelector('td');
        if (numberCell) numberCell.textContent = String(visibleIndex);
    });
}

function initProductTabs() {
    document.querySelectorAll('.tab-btn').forEach((tabButton) => {
        tabButton.addEventListener('click', () => {
            const tabsContainer = tabButton.closest('.tabs');
            if (!tabsContainer) return;

            tabsContainer.querySelectorAll('.tab-btn').forEach((button) => button.classList.remove('active'));
            tabButton.classList.add('active');
            filterProductRows(tabButton.dataset.filter || 'ALL');
        });
    });
}

function initProductStatusColors() {
    document.querySelectorAll('.status-select[data-id]:not([data-type="user"])').forEach((select) => {
        if (select.dataset.productStatusBound === '1') return;

        select.dataset.productStatusBound = '1';
        select.dataset.prevStatus = select.closest('tr')?.dataset.status || select.value;
        applyStatusSelectColor(select);

        select.addEventListener('change', async () => {
            const productId = select.dataset.id;
            const newStatus = select.value;
            const row = select.closest('tr');
            const previousStatus = select.dataset.prevStatus;

            try {
                await axios.post(`/admin/product/${productId}`, { productStatus: newStatus });
                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('Product status updated successfully!');

                if (row) {
                    row.dataset.status = newStatus;
                    updateTabCounts();
                    const activeTab = document.querySelector('.tab-btn.active');
                    if (activeTab) {
                        filterProductRows(activeTab.dataset.filter || 'ALL');
                    }
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Product status update failed. Please try again!';
                showValidationAlert(message);
                select.value = previousStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}