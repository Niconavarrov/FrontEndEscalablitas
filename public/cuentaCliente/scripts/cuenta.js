////////////////////////////////////////////////////////
// CONFIGURACIÓN INICIAL
////////////////////////////////////////////////////////

// Mock user data - REEMPLAZAR CON DATOS DE LA BASE DE DATOS
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

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 1: CARGAR DATOS
////////////////////////////////////////////////////////
// Al cargar la página, reemplazar userData con datos del backend:
//
// async function fetchUserData() {
//     try {
//         const response = await fetch('/api/users/profile', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         
//         if (response.ok) {
//             userData = await response.json();
//             loadUserData();
//             originalData = JSON.parse(JSON.stringify(userData));
//         } else {
//             showNotification('Error al cargar datos del usuario', 'danger');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showNotification('Error de conexión con el servidor', 'danger');
//     }
// }
////////////////////////////////////////////////////////

// Load user data when page loads
document.addEventListener('DOMContentLoaded', function () {
    // DESCOMENTAR CUANDO SE INTEGRE CON BACKEND:
    // fetchUserData();

    // CÓDIGO ACTUAL (MOCK DATA):
    loadUserData();
    originalData = JSON.parse(JSON.stringify(userData));
});

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

////////////////////////////////////////////////////////
// FUNCIONES DE EDICIÓN
////////////////////////////////////////////////////////

// Toggle edit mode
function toggleEdit() {
    const inputs = document.querySelectorAll('#accountForm input, #accountForm textarea');
    const editBtn = document.querySelector('#accountForm button[onclick="toggleEdit()"]');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // CAMPOS QUE PERMANECEN SIEMPRE DESHABILITADOS:
    // - email (no se puede cambiar)
    // - firstName (nombre - no se puede cambiar)
    // - lastName (apellido - no se puede cambiar)
    // - phone (teléfono - no se puede cambiar)

    const disabledFields = ['email', 'firstName', 'lastName', 'phone'];

    // Enable only editable inputs
    inputs.forEach(input => {
        if (!disabledFields.includes(input.id)) {
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

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 2: GUARDAR CAMBIOS
////////////////////////////////////////////////////////
// Save changes
function saveChanges() {
    // Get updated values (solo campos editables)
    userData.address = document.getElementById('address').value;
    userData.city = document.getElementById('city').value;
    userData.state = document.getElementById('state').value;

    if (userData.isProfessional) {
        userData.profession = document.getElementById('profession').value;
        userData.experience = document.getElementById('experience').value;
        userData.description = document.getElementById('description').value;
    }

    ////////////////////////////////////////////////////////
    // INTEGRACIÓN CON BACKEND:
    // Descomentar y ajustar el siguiente código cuando se conecte al backend
    ////////////////////////////////////////////////////////
    /*
    async function updateUserData() {
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: userData.address,
                    city: userData.city,
                    state: userData.state,
                    // Si es profesional, incluir datos profesionales:
                    ...(userData.isProfessional && {
                        profession: userData.profession,
                        experience: userData.experience,
                        description: userData.description
                    })
                })
            });

            if (response.ok) {
                const updatedData = await response.json();
                userData = updatedData;
                originalData = JSON.parse(JSON.stringify(userData));
                showNotification('Cambios guardados exitosamente', 'success');
                disableEditMode();
            } else {
                showNotification('Error al guardar cambios', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión con el servidor', 'danger');
        }
    }
    
    updateUserData();
    return; // Salir de la función para que no ejecute el código de abajo
    */
    ////////////////////////////////////////////////////////

    // CÓDIGO ACTUAL (SIN BACKEND):
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

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 3: ELIMINAR CUENTA
////////////////////////////////////////////////////////
// Confirm delete account
function confirmDeleteAccount() {
    const confirmText = document.getElementById('confirmDelete').value;

    if (confirmText !== 'ELIMINAR') {
        showNotification('Debes escribir "ELIMINAR" para confirmar', 'warning');
        return;
    }

    ////////////////////////////////////////////////////////
    // INTEGRACIÓN CON BACKEND:
    // Descomentar y ajustar el siguiente código cuando se conecte al backend
    ////////////////////////////////////////////////////////
    /*
    async function deleteUserAccount() {
        try {
            const response = await fetch('/api/users/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Limpiar token y datos de sesión
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
                modal.hide();

                // Show message and redirect
                showNotification('Tu cuenta ha sido eliminada. Redirigiendo...', 'info');

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/InicioSesion';
                }, 2000);
            } else {
                showNotification('Error al eliminar la cuenta', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión con el servidor', 'danger');
        }
    }
    
    deleteUserAccount();
    return; // Salir de la función para que no ejecute el código de abajo
    */
    ////////////////////////////////////////////////////////

    // CÓDIGO ACTUAL (SIN BACKEND):
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
    modal.hide();

    // Show message and redirect
    showNotification('Tu cuenta ha sido eliminada. Redirigiendo...', 'info');

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = '/InicioSesion';
    }, 2000);
}

////////////////////////////////////////////////////////
// FUNCIONES AUXILIARES
////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////
// RESUMEN DE INTEGRACIÓN CON BACKEND
////////////////////////////////////////////////////////
/*
ENDPOINTS NECESARIOS:

1. GET /api/users/profile
   - Headers: Authorization: Bearer {token}
   - Response: Objeto con datos del usuario
   - Usar en: fetchUserData() al cargar la página

2. PUT /api/users/profile
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { address, city, state, profession?, experience?, description? }
   - Response: Objeto con datos actualizados
   - Usar en: saveChanges()

3. DELETE /api/users/account
   - Headers: Authorization: Bearer {token}
   - Response: Confirmación de eliminación
   - Usar en: confirmDeleteAccount()

CAMPOS EDITABLES:
- ✅ address (dirección)
- ✅ city (ciudad)
- ✅ state (estado)
- ✅ profession (solo profesionales)
- ✅ experience (solo profesionales)
- ✅ description (solo profesionales)

CAMPOS NO EDITABLES (SIEMPRE DESHABILITADOS):
- ❌ firstName (nombre)
- ❌ lastName (apellido)
- ❌ email (correo electrónico)
- ❌ phone (teléfono)

PASOS PARA INTEGRAR:
1. Descomentar la función fetchUserData() y llamarla en DOMContentLoaded
2. Descomentar el código async en saveChanges()
3. Descomentar el código async en confirmDeleteAccount()
4. Ajustar las URLs de los endpoints según tu backend
5. Verificar que el token se guarde correctamente en localStorage al hacer login
*/
