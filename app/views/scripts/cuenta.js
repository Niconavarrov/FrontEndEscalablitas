// Mock user data - This will be replaced with database data later
let userData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+52 33 1234 5678',
    address: 'Av. Revolución 1234',
    city: 'Guadalajara',
    state: 'Jalisco',
    // Professional data (only for professional accounts)
    isProfessional: false,
    profession: 'Plomero',
    experience: 5,
    description: 'Profesional con amplia experiencia en instalaciones y reparaciones.',
    rating: 4.5
};

// Store original data for cancel functionality
let originalData = {};

// Load user data when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    // Store original data
    originalData = JSON.parse(JSON.stringify(userData));
});

////////////////////////////////////////////////////////
// EDITAR AL MOMENTO DE INTEGRAR CON EL BACKEND
// Reemplazar userData con datos de la base de datos
////////////////////////////////////////////////////////

// Load user data into form fields
function loadUserData() {
    document.getElementById('firstName').value = userData.firstName;
    document.getElementById('lastName').value = userData.lastName;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('address').value = userData.address;
    document.getElementById('city').value = userData.city;
    document.getElementById('state').value = userData.state;

    // Load professional data if user is a professional
    if (userData.isProfessional) {
        document.getElementById('professionalSection').style.display = 'block';
        document.getElementById('profession').value = userData.profession;
        document.getElementById('experience').value = userData.experience;
        document.getElementById('description').value = userData.description;
        document.getElementById('rating-value').textContent = userData.rating;
    }
}

// Toggle edit mode
function toggleEdit() {
    const inputs = document.querySelectorAll('#accountForm input, #accountForm textarea');
    const editBtn = document.querySelector('#accountForm button[onclick="toggleEdit()"]');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Enable all inputs except email (usually email shouldn't be changed easily)
    inputs.forEach(input => {
        if (input.id !== 'email') {
            input.disabled = false;
            input.classList.add('border-primary');
        }
    });

    // Toggle buttons
    editBtn.classList.add('d-none');
    saveBtn.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
}

// Cancel edit mode
function cancelEdit() {
    const inputs = document.querySelectorAll('#accountForm input, #accountForm textarea');
    const editBtn = document.querySelector('#accountForm button[onclick="toggleEdit()"]');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Restore original data
    userData = JSON.parse(JSON.stringify(originalData));
    loadUserData();

    // Disable all inputs
    inputs.forEach(input => {
        input.disabled = true;
        input.classList.remove('border-primary');
    });

    // Toggle buttons
    editBtn.classList.remove('d-none');
    saveBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
}

// Save changes
function saveChanges() {
    // Get updated values
    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.phone = document.getElementById('phone').value;
    userData.address = document.getElementById('address').value;
    userData.city = document.getElementById('city').value;
    userData.state = document.getElementById('state').value;

    if (userData.isProfessional) {
        userData.profession = document.getElementById('profession').value;
        userData.experience = document.getElementById('experience').value;
        userData.description = document.getElementById('description').value;
    }

    ////////////////////////////////////////////////////////
    // EDITAR AL MOMENTO DE INTEGRAR CON EL BACKEND
    // Aquí se debe hacer una llamada API para guardar los datos
    // Ejemplo: await fetch('/api/users/update', { method: 'PUT', body: JSON.stringify(userData) })
    ////////////////////////////////////////////////////////

    // Update original data
    originalData = JSON.parse(JSON.stringify(userData));

    // Disable inputs
    const inputs = document.querySelectorAll('#accountForm input, #accountForm textarea');
    inputs.forEach(input => {
        input.disabled = true;
        input.classList.remove('border-primary');
    });

    // Toggle buttons
    const editBtn = document.querySelector('#accountForm button[onclick="toggleEdit()"]');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    editBtn.classList.remove('d-none');
    saveBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');

    // Show success message
    showNotification('Cambios guardados exitosamente', 'success');
}

// Change password
function changePassword() {
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
}

// Submit password change
function submitPasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Por favor, completa todos los campos', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('Las contraseñas nuevas no coinciden', 'warning');
        return;
    }

    if (newPassword.length < 8) {
        showNotification('La contraseña debe tener al menos 8 caracteres', 'warning');
        return;
    }

    ////////////////////////////////////////////////////////
    // EDITAR AL MOMENTO DE INTEGRAR CON EL BACKEND
    // Aquí se debe hacer una llamada API para cambiar la contraseña
    // Ejemplo: await fetch('/api/users/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
    ////////////////////////////////////////////////////////

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
    modal.hide();

    // Clear form
    document.getElementById('changePasswordForm').reset();

    // Show success message
    showNotification('Contraseña cambiada exitosamente', 'success');
}

// Confirm delete account
function confirmDeleteAccount() {
    const confirmText = document.getElementById('confirmDelete').value;

    if (confirmText !== 'ELIMINAR') {
        showNotification('Debes escribir "ELIMINAR" para confirmar', 'warning');
        return;
    }

    ////////////////////////////////////////////////////////
    // EDITAR AL MOMENTO DE INTEGRAR CON EL BACKEND
    // Aquí se debe hacer una llamada API para eliminar la cuenta
    // Ejemplo: await fetch('/api/users/delete', { method: 'DELETE' })
    ////////////////////////////////////////////////////////

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
    modal.hide();

    // Show message and redirect
    showNotification('Tu cuenta ha sido eliminada. Redirigiendo...', 'info');

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'InicioSesion.html';
    }, 2000);
}

// Show notification (toast-style)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Prevent form submission on Enter key
document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    });
});
