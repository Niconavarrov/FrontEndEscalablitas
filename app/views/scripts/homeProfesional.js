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

////////////////////////////////////////////////////////
// INTEGRACIÓN CON BACKEND - CARGAR DATOS
////////////////////////////////////////////////////////
// Al cargar la página, reemplazar professionalData y services con datos del backend:
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
////////////////////////////////////////////////////////

// Load data when page loads
document.addEventListener('DOMContentLoaded', function () {
    // DESCOMENTAR CUANDO SE INTEGRE CON BACKEND:
    // fetchProfessionalData();
    // fetchServices();

    // CÓDIGO ACTUAL (MOCK DATA):
    loadProfessionalInfo();
    loadServices();
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

////////////////////////////////////////////////////////
// RESUMEN DE INTEGRACIÓN CON BACKEND
////////////////////////////////////////////////////////
/*
ENDPOINTS NECESARIOS:

1. GET /api/professionals/profile
   - Headers: Authorization: Bearer {token}
   - Response: Objeto con datos del profesional (firstName, lastName, profession, experience, rating)
   - Usar en: fetchProfessionalData() al cargar la página

2. GET /api/professionals/services
   - Headers: Authorization: Bearer {token}
   - Response: Array de servicios del profesional
   - Usar en: fetchServices() al cargar la página

DATOS QUE SE MUESTRAN:
- Nombre completo del profesional
- Profesión
- Calificación (rating)
- Años de experiencia
- Lista de servicios con:
  - Nombre del servicio
  - Descripción
  - Precio
  - Duración estimada
- Contador de servicios activos

PASOS PARA INTEGRAR:
1. Descomentar las funciones fetchProfessionalData() y fetchServices()
2. Llamarlas en DOMContentLoaded en lugar del código mock
3. Ajustar las URLs de los endpoints según tu backend
4. Verificar que el token se guarde correctamente en localStorage al hacer login
5. La edición de servicios se hace desde CuentaProfesional.html
*/
