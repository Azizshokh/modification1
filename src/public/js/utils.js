function showValidationAlert(message) {
    alert(message);
}

function showPage(name) {
    document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
    const targetPage = document.getElementById('page-' + name);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function applyStatusSelectColor(select) {
    select.classList.remove('status-process', 'status-pause', 'status-deleted', 'status-active', 'status-blocked');
    const v = select.value;
    if (v === 'PROCESS') select.classList.add('status-process');
    else if (v === 'ACTIVE') select.classList.add('status-active');
    else if (v === 'PAUSE') select.classList.add('status-pause');
    else if (v === 'BLOCKED') select.classList.add('status-blocked');
    else if (v === 'DELETED') select.classList.add('status-deleted');
}
