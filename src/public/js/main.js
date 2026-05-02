/* ============================================================
   SHARED UTILITIES
   ============================================================ */

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

/* ============================================================
   MEMBER — Phone sanitizer, signup image preview, signup validation
   ============================================================ */

// Strips non-digit characters from phone input (allows a leading +).
function initPhoneInputSanitizer() {
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
}

// Shows a live image preview when the admin selects a profile photo.
function initSignupImagePreview() {
  const imageInput = document.getElementById('member-image-input');
  const fileNameInput = document.getElementById('file-name');
  const previewWrap = document.getElementById('signup-image-preview');
  const previewImage = document.getElementById('signup-image-preview-img');
  let activePreviewUrl = null;

  if (!imageInput || !fileNameInput || !previewWrap || !previewImage) {
    return;
  }

  imageInput.addEventListener('change', () => {
    const selectedFile = imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;

    if (activePreviewUrl) {
      URL.revokeObjectURL(activePreviewUrl);
      activePreviewUrl = null;
    }

    if (!selectedFile) {
      fileNameInput.value = '';
      previewImage.src = '';
      previewWrap.classList.remove('has-image');
      return;
    }

    fileNameInput.value = selectedFile.name;
    activePreviewUrl = URL.createObjectURL(selectedFile);
    previewImage.src = activePreviewUrl;
    previewWrap.classList.add('has-image');
  });
}

// Validates signup form: photo required, phone format, password match.
function initSignupFormValidation() {
  const signupForm = document.querySelector('form[action="/admin/signup"]');
  if (!signupForm) {
    return;
  }

  signupForm.addEventListener('submit', (event) => {
    const imageField = signupForm.querySelector('input[name="memberImage"]');
    const phoneInput = signupForm.querySelector('input[name="memberPhone"]');
    const passwordInput = signupForm.querySelector('input[name="memberPassword"]');
    const confirmInput = signupForm.querySelector('input[name="confirmPassword"]');

    if (!imageField || !phoneInput || !passwordInput || !confirmInput) {
      return;
    }

    if (!imageField.files || imageField.files.length === 0) {
      event.preventDefault();
      showValidationAlert('Please insert admin photo!!!');
      return;
    }

    const validPhonePattern = /^\+?\d{7,15}$/;
    if (!validPhonePattern.test(phoneInput.value)) {
      event.preventDefault();
      showValidationAlert('Phone number is invalid, please check!!!');
      return;
    }

    if (passwordInput.value !== confirmInput.value) {
      event.preventDefault();
      showValidationAlert('Password differs, please check!!!');
    }
  });
}

/* ============================================================
   PRODUCT — Table filter, status colors, form, image upload
   ============================================================ */

// Filters the products table by status tab and reindexes visible row numbers.
function filterProductRows(status) {
  const productRows = document.querySelectorAll('#products-table-body tr[data-status]');
  if (!productRows.length) {
    return;
  }

  let visibleIndex = 0;
  productRows.forEach((row) => {
    const matchesFilter = status === 'ALL' || row.dataset.status === status;
    row.style.display = matchesFilter ? '' : 'none';

    if (!matchesFilter) {
      return;
    }

    visibleIndex += 1;
    const numberCell = row.querySelector('td');
    if (numberCell) {
      numberCell.textContent = String(visibleIndex);
    }
  });
}

// Activates the clicked tab button and filters the table accordingly.
function initProductTabs() {
  document.querySelectorAll('.tab-btn').forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      const tabsContainer = tabButton.closest('.tabs');
      if (!tabsContainer) {
        return;
      }
      tabsContainer.querySelectorAll('.tab-btn').forEach((button) => button.classList.remove('active'));
      tabButton.classList.add('active');
      filterProductRows(tabButton.dataset.filter || 'ALL');
    });
  });
}

// Sets the correct color class on a status-select based on its current value.
function applyStatusSelectColor(select) {
  select.classList.remove('status-process', 'status-pause', 'status-deleted');
  if (select.value === 'PROCESS') select.classList.add('status-process');
  else if (select.value === 'PAUSE') select.classList.add('status-pause');
  else if (select.value === 'DELETED') select.classList.add('status-deleted');
}

// Colors all status selects on page load and sends an Axios POST on change.
// Reverts the select to its previous value if the request fails.
function initStatusSelectColors() {
  document.querySelectorAll('.status-select[data-id]').forEach((select) => {
    applyStatusSelectColor(select);

    select.addEventListener('change', async () => {
      const productId = select.dataset.id;
      const newStatus = select.value;
      const row = select.closest('tr');
      const previousStatus = row ? row.dataset.status : null;

      try {
        await axios.post(`/admin/product/${productId}`, { productStatus: newStatus });
        applyStatusSelectColor(select);
        if (row) {
          row.dataset.status = newStatus;
          const activeTab = document.querySelector('.tab-btn.active');
          if (activeTab) {
            filterProductRows(activeTab.dataset.filter || 'ALL');
          }
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Update failed, please try again!';
        showValidationAlert(message);
        if (previousStatus) {
          select.value = previousStatus;
          applyStatusSelectColor(select);
        }
      }
    });
  });
}

// Opens or closes the new-product form panel.
function toggleProductForm() {
  const formSection = document.getElementById('product-form-section');
  const toggleButton = document.getElementById('toggle-form-btn');
  if (!formSection || !toggleButton) {
    return;
  }

  if (formSection.style.display === 'none') {
    formSection.style.display = 'block';
    syncProductMeasurementFields();
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toggleButton.style.display = 'none';
    return;
  }

  formSection.style.display = 'none';
  toggleButton.style.display = 'flex';
}

// Shows the size field for GADGETS and the weight field for all other categories.
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

// Validates all create-product form fields; returns false if any check fails.
function validateCreateProductForm(productForm) {
  const nameInput = productForm.querySelector('input[name="productName"]');
  const priceInput = productForm.querySelector('input[name="productPrice"]');
  const stockInput = productForm.querySelector('input[name="productLeftCount"]');
  const categorySelect = productForm.querySelector('select[name="productCollection"]');
  const weightSelect = productForm.querySelector('select[name="productWeight"]');
  const sizeSelect = productForm.querySelector('select[name="productSize"]');
  const descInput = productForm.querySelector('textarea[name="productDesc"]');
  const uploadGrid = productForm.querySelector('#upload-grid');

  if (!nameInput || !priceInput || !stockInput || !categorySelect || !weightSelect || !sizeSelect || !descInput) {
    return true;
  }

  const productName = nameInput.value.trim();
  if (productName.length < 3) {
    showValidationAlert('Product name must be at least 3 characters!!!');
    nameInput.focus();
    return false;
  }

  const productPrice = Number(priceInput.value);
  if (!Number.isFinite(productPrice) || productPrice <= 0) {
    showValidationAlert('Product price must be greater than 0!!!');
    priceInput.focus();
    return false;
  }

  const productStock = Number(stockInput.value);
  if (!Number.isInteger(productStock) || productStock < 0) {
    showValidationAlert('Stock count must be a whole number 0 or greater!!!');
    stockInput.focus();
    return false;
  }

  const category = categorySelect.value;
  if (!category) {
    showValidationAlert('Please select product category!!!');
    categorySelect.focus();
    return false;
  }

  if (category === 'GADGETS' && !sizeSelect.value) {
    showValidationAlert('Please choose product size for gadgets!!!');
    sizeSelect.focus();
    return false;
  }

  if (category !== 'GADGETS' && !weightSelect.value) {
    showValidationAlert('Please choose product weight!!!');
    weightSelect.focus();
    return false;
  }

  const productDesc = descInput.value.trim();
  if (productDesc.length < 10) {
    showValidationAlert('Product description must be at least 10 characters!!!');
    descInput.focus();
    return false;
  }

  const filledSlots = uploadGrid ? uploadGrid.querySelectorAll('.upload-box.has-image').length : 0;
  if (filledSlots === 0) {
    showValidationAlert('Please upload at least one product image!!!');
    return false;
  }

  if (filledSlots > 5) {
    showValidationAlert('You can upload maximum 5 product images!!!');
    return false;
  }

  return true;
}

// Clicking a box opens its own file input; the chosen image renders as a
// thumbnail inside that exact box. Validates images + fields on submit.
function initCreateProductFormValidation() {
  const productForm = document.querySelector('form[action="/admin/product/create"]');
  if (!productForm) {
    return;
  }

  const uploadGrid = productForm.querySelector('#upload-grid');
  if (!uploadGrid) {
    return;
  }

  const slotPreviewUrls = {};

  const renderSlot = (box, file) => {
    const slot = box.dataset.slot;

    if (slotPreviewUrls[slot]) {
      URL.revokeObjectURL(slotPreviewUrls[slot]);
    }

    const previewUrl = URL.createObjectURL(file);
    slotPreviewUrls[slot] = previewUrl;

    let previewImg = box.querySelector('img.slot-preview');
    if (!previewImg) {
      previewImg = document.createElement('img');
      previewImg.className = 'slot-preview';
      box.appendChild(previewImg);
    }

    previewImg.src = previewUrl;
    previewImg.alt = file.name;
    box.classList.add('has-image');
  };

  uploadGrid.querySelectorAll('.upload-box[data-slot]').forEach((box) => {
    const slotInput = box.querySelector('input[type="file"]');
    if (!slotInput) {
      return;
    }

    box.addEventListener('click', () => slotInput.click());

    slotInput.addEventListener('change', () => {
      if (!slotInput.files || slotInput.files.length === 0) {
        return;
      }
      renderSlot(box, slotInput.files[0]);
    });
  });

  productForm.addEventListener('submit', (event) => {
    const filledCount = uploadGrid.querySelectorAll('.upload-box.has-image').length;

    if (filledCount === 0) {
      event.preventDefault();
      showValidationAlert('Please upload at least one product image!!!');
      return;
    }

    if (!validateCreateProductForm(productForm)) {
      event.preventDefault();
    }
  });
}

/* ============================================================
   INIT — Run all initializers after DOM is ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Member
  initPhoneInputSanitizer();
  initSignupImagePreview();
  initSignupFormValidation();

  // Product
  initProductTabs();
  initStatusSelectColors();
  initCreateProductFormValidation();
  filterProductRows('ALL');

  const collectionSelect = document.getElementById('product-collection-select');
  if (collectionSelect) {
    collectionSelect.addEventListener('change', syncProductMeasurementFields);
    syncProductMeasurementFields();
  }
});
