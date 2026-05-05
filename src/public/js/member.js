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

function initSignupImagePreview() {
    const imageInput = document.getElementById('member-image-input');
    const fileNameInput = document.getElementById('file-name');
    const previewWrap = document.getElementById('signup-image-preview');
    const previewImage = document.getElementById('signup-image-preview-img');
    let activePreviewUrl = null;

    if (!imageInput || !fileNameInput || !previewWrap || !previewImage) return;

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

function initSignupFormValidation() {
    const signupForm = document.querySelector('form[action="/admin/signup"]');
    if (!signupForm) return;

    signupForm.addEventListener('submit', (event) => {
        const imageField = signupForm.querySelector('input[name="memberImage"]');
        const phoneInput = signupForm.querySelector('input[name="memberPhone"]');
        const passwordInput = signupForm.querySelector('input[name="memberPassword"]');
        const confirmInput = signupForm.querySelector('input[name="confirmPassword"]');

        if (!imageField || !phoneInput || !passwordInput || !confirmInput) return;

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

function initUserStatusColors() {
    document.querySelectorAll('.status-select[data-type="user"]').forEach((select) => {
        select.dataset.prevStatus = select.value;
        applyStatusSelectColor(select);

        select.addEventListener('change', async () => {
            const memberId = select.dataset.id;
            const newStatus = select.value;
            const previousStatus = select.dataset.prevStatus;

            try {
                await axios.post('/admin/user/edit', { _id: memberId, memberStatus: newStatus });
                select.dataset.prevStatus = newStatus;
                applyStatusSelectColor(select);
                showValidationAlert('User status updated successfully!');
            } catch (error) {
                const message = error.response?.data?.message || 'User status update failed. Please try again!';
                showValidationAlert(message);
                select.value = previousStatus;
                select.dataset.prevStatus = previousStatus;
                applyStatusSelectColor(select);
            }
        });
    });
}