function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

function toggleProductForm() {
  const form = document.getElementById('product-form-section');
  const btn = document.getElementById('toggle-form-btn');
  if (form.style.display === 'none') {
    form.style.display = 'block';
    syncProductMeasurementFields();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    btn.style.display = 'none';
  } else {
    form.style.display = 'none';
    btn.style.display = 'flex';
  }
}

function syncProductMeasurementFields() {
  const collectionSelect = document.getElementById('product-collection-select');
  const weightField = document.getElementById('weight-field');
  const sizeField = document.getElementById('size-field');
  const weightSelect = document.getElementById('product-weight-select');
  const sizeSelect = document.getElementById('product-size-select');

  if (!collectionSelect || !weightField || !sizeField || !weightSelect || !sizeSelect) {
    return;
  }

  const isGadget = collectionSelect.value === 'GADGETS';

  weightField.style.display = isGadget ? 'none' : 'flex';
  sizeField.style.display = isGadget ? 'flex' : 'none';

  weightSelect.disabled = isGadget;
  sizeSelect.disabled = !isGadget;

  weightSelect.required = !isGadget;
  sizeSelect.required = isGadget;
}

function filterProductRows(status) {
  const productRows = document.querySelectorAll('#products-table-body tr[data-status]');
  if (!productRows.length) {
    return;
  }

  productRows.forEach((row, index) => {
    const matchesFilter = status === 'ALL' || row.dataset.status === status;
    row.style.display = matchesFilter ? '' : 'none';

    if (matchesFilter) {
      const numberCell = row.querySelector('td');
      if (numberCell) {
        numberCell.textContent = String(index + 1);
      }
    }
  });

  let visibleIndex = 0;
  productRows.forEach((row) => {
    if (row.style.display === 'none') {
      return;
    }

    visibleIndex += 1;
    const numberCell = row.querySelector('td');
    if (numberCell) {
      numberCell.textContent = String(visibleIndex);
    }
  });
}

// Tab switcher
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter || 'ALL';
      filterProductRows(filterValue);
    });
  });

  const collectionSelect = document.getElementById('product-collection-select');
  if (collectionSelect) {
    collectionSelect.addEventListener('change', syncProductMeasurementFields);
    syncProductMeasurementFields();
  }

  const phoneInputs = document.querySelectorAll('input[name="memberPhone"]');
  phoneInputs.forEach((phoneInput) => {
    phoneInput.addEventListener('input', () => {
      let sanitizedValue = phoneInput.value.replace(/[^\d+]/g, '');
      sanitizedValue = sanitizedValue.replace(/(?!^)\+/g, '');

      if (sanitizedValue !== phoneInput.value) {
        phoneInput.value = sanitizedValue;
      }
    });
  });

  const signupForm = document.querySelector('form[action="/admin/signup"]');
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      const phoneInput = signupForm.querySelector('input[name="memberPhone"]');
      const passwordInput = signupForm.querySelector('input[name="memberPassword"]');
      const confirmInput = signupForm.querySelector('input[name="confirmPassword"]');

      if (!phoneInput || !passwordInput || !confirmInput) {
        return;
      }

      const validPhonePattern = /^\+?\d{7,15}$/;
      if (!validPhonePattern.test(phoneInput.value)) {
        event.preventDefault();
        alert('Phone number is invalid, please check!!!');
        return;
      }

      if (passwordInput.value !== confirmInput.value) {
        event.preventDefault();
        alert('Password differs, please check!!!');
      }
    });
  }

  filterProductRows('ALL');
});
