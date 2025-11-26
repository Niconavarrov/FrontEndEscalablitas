////////////////////////////////////////////////////////
// CONFIGURACIÓN INICIAL
////////////////////////////////////////////////////////

// Mock user data - REEMPLAZAR CON DATOS DE LA BASE DE DATOS
let userData = {
    firstName: 'Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@example.com',
    phone: '+52 33 9876 5432',
    // Professional data
    experience: 8,
    description: 'Profesional certificado con amplia experiencia en instalaciones y reparaciones de sistemas hidráulicos.',
    rating: 4.7
};

// Mock services data - REEMPLAZAR CON DATOS DE LA BASE DE DATOS
let services = [
    {
        id: 1,
        name: 'Reparación de tuberías',
        description: 'Reparación de fugas y cambio de tuberías dañadas',
        duration: '2 horas'
    },
    {
        id: 2,
        name: 'Instalación de lavabos',
        description: 'Instalación completa de lavabos y lavamanos',
        duration: '3 horas'
    },
    {
        id: 3,
        name: 'Mantenimiento preventivo',
        description: 'Revisión y mantenimiento de sistema hidráulico completo',
        duration: '4 horas'
    }
];

// Store original data for cancel functionality
let originalData = {};
let editingServiceId = null;

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 1: CARGAR DATOS
////////////////////////////////////////////////////////
// Al cargar la página, reemplazar userData y services con datos del backend:
//
// async function fetchUserData() {
//     try {
//         const response = await fetch('/api/professionals/profile', {
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
//
// async function fetchServices() {
//     try {
//         const response = await fetch('/api/professionals/services', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         
//         if (response.ok) {
//             services = await response.json();
//             loadServices();
//         } else {
//             showNotification('Error al cargar servicios', 'danger');
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
    // fetchServices();

    // CÓDIGO ACTUAL (MOCK DATA):
    loadUserData();
    loadServices();
    originalData = JSON.parse(JSON.stringify(userData));
});

// Load user data into form fields
function loadUserData() {
    document.getElementById('firstName').value = userData.firstName;
    document.getElementById('lastName').value = userData.lastName;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;

    // Load professional data
    document.getElementById('experience').value = userData.experience;
    document.getElementById('description').value = userData.description;
    document.getElementById('rating-value').textContent = userData.rating;
}

////////////////////////////////////////////////////////
// FUNCIONES DE EDICIÓN DE CUENTA
////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
// FUNCIONES DE GESTIÓN DE SERVICIOS
////////////////////////////////////////////////////////

// Load services into the list
function loadServices() {
    const servicesList = document.getElementById('servicesList');

    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-tools fa-3x mb-3"></i>
                <p>No tienes servicios registrados aún.</p>
                <p class="small">Haz clic en "Agregar Servicio" para comenzar.</p>
            </div>
        `;
        return;
    }

    servicesList.innerHTML = services.map(service => `
        <div class="card mb-3 Borders">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-2"><i class="fas fa-wrench text-primary"></i> ${escapeHtml(service.name)}</h6>
                        <p class="text-muted small mb-2">${escapeHtml(service.description)}</p>
                        <div class="d-flex gap-3">
                            <span class="badge bg-info"><i class="fas fa-clock"></i> ${escapeHtml(service.duration)}</span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editService(${service.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open modal to add new service
document.addEventListener('DOMContentLoaded', function () {
    const addServiceModal = document.getElementById('addServiceModal');
    if (addServiceModal) {
        addServiceModal.addEventListener('show.bs.modal', function (event) {
            // Reset form if not editing
            if (!editingServiceId) {
                document.getElementById('serviceForm').reset();
                document.getElementById('serviceId').value = '';
                document.getElementById('modalTitle').textContent = 'Agregar Servicio';
            }
        });

        addServiceModal.addEventListener('hidden.bs.modal', function (event) {
            // Clear editing state
            editingServiceId = null;
            document.getElementById('serviceForm').reset();
        });
    }
});

// Edit service
function editService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    editingServiceId = serviceId;

    // Fill form with service data
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('serviceDuration').value = service.duration;
    document.getElementById('modalTitle').textContent = 'Editar Servicio';

    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('addServiceModal'));
    modal.show();
}

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 3: GUARDAR SERVICIO
////////////////////////////////////////////////////////
// Save service (add or update)
function saveService() {
    const serviceName = document.getElementById('serviceName').value.trim();
    const serviceDescription = document.getElementById('serviceDescription').value.trim();
    const serviceDuration = document.getElementById('serviceDuration').value.trim();

    // Validation
    if (!serviceName || !serviceDescription || !serviceDuration) {
        showNotification('Por favor, completa todos los campos', 'warning');
        return;
    }

    const serviceData = {
        name: serviceName,
        description: serviceDescription,
        duration: serviceDuration
    };

    ////////////////////////////////////////////////////////
    // INTEGRACIÓN CON BACKEND:
    // Descomentar y ajustar el siguiente código cuando se conecte al backend
    ////////////////////////////////////////////////////////
    /*
    async function saveServiceToBackend() {
        try {
            const isEditing = editingServiceId !== null;
            const url = isEditing 
                ? `/api/professionals/services/${editingServiceId}` 
                : '/api/professionals/services';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });

            if (response.ok) {
                const savedService = await response.json();
                
                if (isEditing) {
                    // Update existing service
                    const index = services.findIndex(s => s.id === editingServiceId);
                    if (index !== -1) {
                        services[index] = savedService;
                    }
                    showNotification('Servicio actualizado exitosamente', 'success');
                } else {
                    // Add new service
                    services.push(savedService);
                    showNotification('Servicio agregado exitosamente', 'success');
                }

                loadServices();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
                modal.hide();
                editingServiceId = null;
            } else {
                showNotification('Error al guardar el servicio', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión con el servidor', 'danger');
        }
    }
    
    saveServiceToBackend();
    return; // Salir de la función para que no ejecute el código de abajo
    */
    ////////////////////////////////////////////////////////

    // CÓDIGO ACTUAL (SIN BACKEND):
    if (editingServiceId) {
        // Update existing service
        const index = services.findIndex(s => s.id === editingServiceId);
        if (index !== -1) {
            services[index] = {
                id: editingServiceId,
                ...serviceData
            };
        }
        showNotification('Servicio actualizado exitosamente', 'success');
    } else {
        // Add new service
        const newService = {
            id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
            ...serviceData
        };
        services.push(newService);
        showNotification('Servicio agregado exitosamente', 'success');
    }

    loadServices();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
    modal.hide();
    editingServiceId = null;
}

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 4: ELIMINAR SERVICIO
////////////////////////////////////////////////////////
// Delete service
function deleteService(serviceId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        return;
    }

    ////////////////////////////////////////////////////////
    // INTEGRACIÓN CON BACKEND:
    // Descomentar y ajustar el siguiente código cuando se conecte al backend
    ////////////////////////////////////////////////////////
    /*
    async function deleteServiceFromBackend() {
        try {
            const response = await fetch(`/api/professionals/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                services = services.filter(s => s.id !== serviceId);
                loadServices();
                showNotification('Servicio eliminado exitosamente', 'success');
            } else {
                showNotification('Error al eliminar el servicio', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión con el servidor', 'danger');
        }
    }
    
    deleteServiceFromBackend();
    return; // Salir de la función para que no ejecute el código de abajo
    */
    ////////////////////////////////////////////////////////

    // CÓDIGO ACTUAL (SIN BACKEND):
    services = services.filter(s => s.id !== serviceId);
    loadServices();
    showNotification('Servicio eliminado exitosamente', 'success');
}

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - PASO 5: ELIMINAR CUENTA
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
    async function deleteProfessionalAccount() {
        try {
            const response = await fetch('/api/professionals/account', {
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
                    window.location.href = 'InicioSesion.html';
                }, 2000);
            } else {
                showNotification('Error al eliminar la cuenta', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión con el servidor', 'danger');
        }
    }
    
    deleteProfessionalAccount();
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
        window.location.href = 'InicioSesion.html';
    }, 2000);
}

////////////////////////////////////////////////////////
// FUNCIONES AUXILIARES
////////////////////////////////////////////////////////

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

////////////////////////////////////////////////////////
// RESUMEN DE INTEGRACIÓN CON BACKEND
////////////////////////////////////////////////////////
/*
ENDPOINTS NECESARIOS:

1. GET /api/professionals/profile
   - Headers: Authorization: Bearer {token}
   - Response: Objeto con datos del profesional (firstName, lastName, email, phone, experience, description, rating)
   - Usar en: fetchUserData() al cargar la página

2. GET /api/professionals/services
   - Headers: Authorization: Bearer {token}
   - Response: Array de servicios del profesional
   - Usar en: fetchServices() al cargar la página

3. PUT /api/professionals/profile
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { experience, description }
   - Response: Objeto con datos actualizados
   - Usar en: saveChanges()

4. POST /api/professionals/services
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { name, description, duration }
   - Response: Objeto del servicio creado (con id)
   - Usar en: saveService() (cuando NO está editando)

5. PUT /api/professionals/services/{serviceId}
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { name, description, duration }
   - Response: Objeto del servicio actualizado
   - Usar en: saveService() (cuando SÍ está editando)

6. DELETE /api/professionals/services/{serviceId}
   - Headers: Authorization: Bearer {token}
   - Response: Confirmación de eliminación
   - Usar en: deleteService()

7. DELETE /api/professionals/account
   - Headers: Authorization: Bearer {token}
   - Response: Confirmación de eliminación
   - Usar en: confirmDeleteAccount()

CAMPOS EDITABLES EN CUENTA:
- ✅ experience (años de experiencia)
- ✅ description (descripción profesional)

CAMPOS NO EDITABLES (SIEMPRE DESHABILITADOS):
- ❌ firstName (nombre)
- ❌ lastName (apellido)
- ❌ email (correo electrónico)
- ❌ phone (teléfono)
- ❌ rating (calificación - solo lectura)

CAMPOS DE SERVICIO:
- ✅ name (nombre del servicio)
- ✅ description (descripción)
- ✅ duration (duración estimada)

CAMPOS ELIMINADOS:
- ❌ address (dirección) - ELIMINADO
- ❌ city (ciudad) - ELIMINADO
- ❌ state (estado) - ELIMINADO
- ❌ profession (profesión) - ELIMINADO (puede ofrecer varios servicios)
- ❌ price (precio) - ELIMINADO de servicios

PASOS PARA INTEGRAR:
1. Descomentar las funciones fetchUserData() y fetchServices() y llamarlas en DOMContentLoaded
2. Descomentar el código async en saveChanges()
3. Descomentar el código async en saveService()
4. Descomentar el código async en deleteService()
5. Descomentar el código async en confirmDeleteAccount()
6. Ajustar las URLs de los endpoints según tu backend
7. Verificar que el token se guarde correctamente en localStorage al hacer login
*/
