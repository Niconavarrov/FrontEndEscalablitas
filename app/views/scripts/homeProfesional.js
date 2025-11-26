////////////////////////////////////////////////////////
// CONFIGURACIÓN INICIAL
////////////////////////////////////////////////////////

// Mock professional data - REEMPLAZAR CON DATOS DE LA BASE DE DATOS
let professionalData = {
    firstName: 'Carlos',
    lastName: 'Martínez',
    experience: 8,
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

// Mock offers data (clientes que han enviado mensajes) - REEMPLAZAR CON DATOS DE LA BASE DE DATOS
let offers = [
    {
        id: 1,
        clientName: 'María González',
        message: 'Hola, necesito ayuda con una tubería que está goteando',
        timestamp: '2024-11-25T10:30:00',
        unread: true,
        status: 'pending' // pending, accepted, rejected
    },
    {
        id: 2,
        clientName: 'Juan Pérez',
        message: 'Buenos días, ¿cuánto cobraría por instalar un lavabo?',
        timestamp: '2024-11-24T15:45:00',
        unread: false,
        status: 'pending'
    },
    {
        id: 3,
        clientName: 'Ana Martínez',
        message: 'Necesito un mantenimiento preventivo urgente',
        timestamp: '2024-11-23T09:15:00',
        unread: true,
        status: 'pending'
    }
];

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - CARGAR DATOS
////////////////////////////////////////////////////////
// Al cargar la página, reemplazar professionalData, services y offers con datos del backend:
//
// async function fetchProfessionalData() {
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
//             professionalData = await response.json();
//             loadProfessionalInfo();
//         } else {
//             showNotification('Error al cargar datos del profesional', 'danger');
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
//
// async function fetchOffers() {
//     try {
//         const response = await fetch('/api/professionals/offers', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         
//         if (response.ok) {
//             offers = await response.json();
//             loadOffers();
//         } else {
//             showNotification('Error al cargar ofertas', 'danger');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showNotification('Error de conexión con el servidor', 'danger');
//     }
// }
////////////////////////////////////////////////////////

// Load data when page loads
document.addEventListener('DOMContentLoaded', function () {
    // DESCOMENTAR CUANDO SE INTEGRE CON BACKEND:
    // fetchProfessionalData();
    // fetchServices();
    // fetchOffers();

    // CÓDIGO ACTUAL (MOCK DATA):
    loadProfessionalInfo();
    loadServices();
    loadOffers();
});

////////////////////////////////////////////////////////
// FUNCIONES DE CARGA DE DATOS
////////////////////////////////////////////////////////

// Load professional information
function loadProfessionalInfo() {
    const fullName = `${professionalData.firstName} ${professionalData.lastName}`;
    document.getElementById('professionalName').textContent = fullName;
    document.getElementById('professionalRating').textContent = professionalData.rating.toFixed(1);
    document.getElementById('professionalExperience').textContent = professionalData.experience;
}

// Load offers (clientes interesados) into the list
function loadOffers() {
    const offersList = document.getElementById('offersList');

    if (offers.length === 0) {
        offersList.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No tienes ofertas pendientes</h5>
                <p class="text-muted">Los clientes que te contacten aparecerán aquí</p>
            </div>
        `;
        return;
    }

    offersList.innerHTML = offers.map(offer => {
        const date = new Date(offer.timestamp);
        const timeAgo = getTimeAgo(date);
        const unreadBadge = offer.unread ? '<span class="badge bg-danger ms-2">Nuevo</span>' : '';

        // Determinar qué mostrar según el estado de la oferta
        let actionButtons = '';
        if (offer.status === 'accepted') {
            // Mostrar badge de "Aceptada" en verde claro
            actionButtons = `
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="openChatWithClient(${offer.id})">
                        <i class="fas fa-comment"></i> Responder
                    </button>
                    <span class="badge bg-success-subtle text-success-emphasis fs-6 py-2">
                        <i class="fas fa-check-circle"></i> Aceptada
                    </span>
                </div>
            `;
        } else {
            // Mostrar botones de acción para ofertas pendientes
            actionButtons = `
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="openChatWithClient(${offer.id})">
                        <i class="fas fa-comment"></i> Responder
                    </button>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" onclick="acceptOffer(${offer.id})">
                            <i class="fas fa-check"></i> Aceptar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rejectOffer(${offer.id})">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card mb-2 Borders ${offer.unread ? 'border-primary' : ''} ${offer.status === 'accepted' ? 'border-success' : ''}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">
                                <i class="fas fa-user-circle text-primary"></i> 
                                ${escapeHtml(offer.clientName)}
                                ${unreadBadge}
                            </h6>
                            <p class="text-muted small mb-2">${escapeHtml(offer.message)}</p>
                            <small class="text-muted">
                                <i class="fas fa-clock"></i> ${timeAgo}
                            </small>
                        </div>
                        ${actionButtons}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load services into the list
function loadServices() {
    const servicesList = document.getElementById('servicesList');
    const servicesCount = document.getElementById('servicesCount');

    // Update services count
    servicesCount.textContent = services.length;

    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-tools fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">No tienes servicios registrados</h5>
                <p class="text-muted">Haz clic en "Gestionar Servicios" o "Editar Perfil" para agregar tus primeros servicios.</p>
                <a href="CuentaProfesional.html" class="btn btn-primary mt-3" id="ColorButton">
                    <i class="fas fa-plus"></i> Agregar Servicios
                </a>
            </div>
        `;
        return;
    }

    servicesList.innerHTML = `
        <div class="row row-cols-1 row-cols-md-2 g-4">
            ${services.map(service => `
                <div class="col">
                    <div class="card h-100 Borders">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-wrench text-primary"></i> ${escapeHtml(service.name)}
                            </h5>
                            <p class="card-text text-muted">${escapeHtml(service.description)}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <span class="badge bg-info fs-6">
                                        <i class="fas fa-clock"></i> ${escapeHtml(service.duration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="text-center mt-4">
            <a href="CuentaProfesional.html" class="btn btn-outline-primary">
                <i class="fas fa-edit"></i> Editar Servicios
            </a>
        </div>
    `;
}

////////////////////////////////////////////////////////
// FUNCIONES DE INTERACCIÓN
////////////////////////////////////////////////////////

// Open chat with client
function openChatWithClient(offerId) {
    // TODO: Implementar cuando se integre el sistema de chat
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
        showNotification(`Abriendo chat con ${offer.clientName}...`, 'info');
        // Aquí se debería abrir el modal de chat o redirigir a una página de chat
    }
}

// Accept offer
async function acceptOffer(offerId) {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
        showNotification('Oferta no encontrada', 'danger');
        return;
    }

    // Confirmar acción
    if (!confirm(`¿Estás seguro de que deseas aceptar la oferta de ${offer.clientName}?`)) {
        return;
    }

    try {
        // TODO: DESCOMENTAR Y AJUSTAR CUANDO SE INTEGRE CON BACKEND
        /*
        const response = await fetch(`/api/professionals/offers/${offerId}/accept`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                offerId: offerId
            })
        });

        if (response.ok) {
            const result = await response.json();
            showNotification(`Oferta de ${offer.clientName} aceptada exitosamente`, 'success');
            
            // Actualizar el estado de la oferta a 'accepted'
            const index = offers.findIndex(o => o.id === offerId);
            if (index > -1) {
                offers[index].status = 'accepted';
                offers[index].unread = false; // Marcar como leída
                loadOffers(); // Recargar la lista
            }
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error al aceptar la oferta', 'danger');
        }
        */

        // CÓDIGO TEMPORAL (MOCK) - ELIMINAR CUANDO SE INTEGRE CON BACKEND
        showNotification(`Oferta de ${offer.clientName} aceptada exitosamente`, 'success');
        const index = offers.findIndex(o => o.id === offerId);
        if (index > -1) {
            offers[index].status = 'accepted';
            offers[index].unread = false; // Marcar como leída
            loadOffers();
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión con el servidor', 'danger');
    }
}

// Reject offer
async function rejectOffer(offerId) {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
        showNotification('Oferta no encontrada', 'danger');
        return;
    }

    // Confirmar acción
    if (!confirm(`¿Estás seguro de que deseas rechazar la oferta de ${offer.clientName}?`)) {
        return;
    }

    try {
        // TODO: DESCOMENTAR Y AJUSTAR CUANDO SE INTEGRE CON BACKEND
        /*
        const response = await fetch(`/api/professionals/offers/${offerId}/reject`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                offerId: offerId
            })
        });

        if (response.ok) {
            const result = await response.json();
            showNotification(`Oferta de ${offer.clientName} rechazada`, 'info');
            
            // Remover la oferta de la lista local
            const index = offers.findIndex(o => o.id === offerId);
            if (index > -1) {
                offers.splice(index, 1);
                loadOffers(); // Recargar la lista
            }
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error al rechazar la oferta', 'danger');
        }
        */

        // CÓDIGO TEMPORAL (MOCK) - ELIMINAR CUANDO SE INTEGRE CON BACKEND
        showNotification(`Oferta de ${offer.clientName} rechazada`, 'info');
        const index = offers.findIndex(o => o.id === offerId);
        if (index > -1) {
            offers.splice(index, 1);
            loadOffers();
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión con el servidor', 'danger');
    }
}

////////////////////////////////////////////////////////
// FUNCIONES AUXILIARES
////////////////////////////////////////////////////////

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('es-MX');
}

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

////////////////////////////////////////////////////////
// RESUMEN DE INTEGRACIÓN CON BACKEND
////////////////////////////////////////////////////////
/*
ENDPOINTS NECESARIOS:

1. GET /api/professionals/profile
   - Headers: Authorization: Bearer {token}
   - Response: Objeto con datos del profesional (firstName, lastName, experience, rating)
   - Usar en: fetchProfessionalData() al cargar la página

2. GET /api/professionals/services
   - Headers: Authorization: Bearer {token}
   - Response: Array de servicios del profesional
   - Usar en: fetchServices() al cargar la página

3. GET /api/professionals/offers
   - Headers: Authorization: Bearer {token}
   - Response: Array de ofertas/mensajes de clientes interesados
   - Formato: [{ id, clientName, message, timestamp, unread }]
   - Usar en: fetchOffers() al cargar la página

4. POST /api/professionals/offers/{offerId}/accept
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { offerId: number }
   - Response: Objeto con resultado de la operación
   - Usar en: acceptOffer() cuando el profesional acepta una oferta

5. POST /api/professionals/offers/{offerId}/reject
   - Headers: Authorization: Bearer {token}, Content-Type: application/json
   - Body: { offerId: number }
   - Response: Objeto con resultado de la operación
   - Usar en: rejectOffer() cuando el profesional rechaza una oferta

DATOS QUE SE MUESTRAN:
- Nombre completo del profesional
- Calificación (rating)
- Años de experiencia
- Ofertas recibidas (clientes que han enviado mensajes):
  - Nombre del cliente
  - Mensaje inicial
  - Tiempo transcurrido
  - Estado (leído/no leído)
  - Botón para responder
  - Botón para aceptar oferta
  - Botón para rechazar oferta
- Lista de servicios con:
  - Nombre del servicio
  - Descripción
  - Duración estimada
- Contador de servicios activos

PASOS PARA INTEGRAR:
1. Descomentar las funciones fetchProfessionalData(), fetchServices() y fetchOffers()
2. Llamarlas en DOMContentLoaded en lugar del código mock
3. Ajustar las URLs de los endpoints según tu backend
4. Verificar que el token se guarde correctamente en localStorage al hacer login
5. Implementar la función openChatWithClient() para abrir el sistema de chat
6. Descomentar las llamadas a API en acceptOffer() y rejectOffer()
7. La edición de servicios se hace desde CuentaProfesional.html
*/
