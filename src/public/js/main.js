// Shared alert helper to keep all validation messages consistent.
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

// Opens or closes the create product form panel.
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

// Shows size for gadgets and weight for other categories.
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

// Filters products table by selected status tab and reindexes visible rows.
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

// Validates the create product form fields before submit.
function validateCreateProductForm(productForm) {
  const nameInput = productForm.querySelector('input[name="productName"]');
  const priceInput = productForm.querySelector('input[name="productPrice"]');
  const stockInput = productForm.querySelector('input[name="productLeftCount"]');
  const categorySelect = productForm.querySelector('select[name="productCollection"]');
  const weightSelect = productForm.querySelector('select[name="productWeight"]');
  const sizeSelect = productForm.querySelector('select[name="productSize"]');
  const descInput = productForm.querySelector('textarea[name="productDesc"]');
  // Collect all per-slot file inputs.
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

  // Check filled slots via has-image class (shared input approach).
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

// Initializes status tabs on products page.
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

// Keeps phone input clean by allowing only digits with an optional first plus sign.
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

// Handles signup image file name + live preview area.
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

// Validates signup form fields before submit.
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

// Clicking a box opens that box's own file input; the selected image renders in that exact slot.
function initCreateProductFormValidation() {
  const productForm = document.querySelector('form[action="/admin/product/create"]');
  if (!productForm) {
    return;
  }

  const uploadGrid = productForm.querySelector('#upload-grid');
  if (!uploadGrid) {
    return;
  }

  // Keeps one blob URL per slot so previous blobs are released when a slot is replaced.
  const slotPreviewUrls = {};

  // Renders a thumbnail into the given box.
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

  // Each box opens its own hidden input on click and renders the file in that exact slot.
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

  // On submit check that at least one slot is filled.
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

document.addEventListener('DOMContentLoaded', () => {
  initProductTabs();
  initPhoneInputSanitizer();
  initSignupImagePreview();
  initSignupFormValidation();
  initCreateProductFormValidation();

  const collectionSelect = document.getElementById('product-collection-select');
  if (collectionSelect) {
    collectionSelect.addEventListener('change', syncProductMeasurementFields);
    syncProductMeasurementFields();
  }

  filterProductRows('ALL');
});
