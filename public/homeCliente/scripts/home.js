// Configuración de API
const API_CONFIG = {
    useMock: true, // Cambiar a false para usar la API real
    baseUrl: 'http://localhost:3000/api', // Ajustar según tu configuración
    mockUrl: '../core/data/mock_search_data.json'
};

class SearchService {
    static async getHeaders() {
        // Aquí deberías obtener el token real del almacenamiento
        const token = sessionStorage.getItem('access_token') || 'dummy_token';
        return {
            "Content-Type": "application/json",
            "Authorization": token
        };
    }

    static async fetchData(endpoint, params = {}) {
        if (API_CONFIG.useMock) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch(API_CONFIG.mockUrl);
            const data = await response.json();

            // Filtrado básico para mock data
            if (endpoint.includes('search')) {
                const query = params.name?.toLowerCase().replace(/"/g, '');
                if (query) {
                    return data.services.filter(s =>
                        s.name.toLowerCase().includes(query) ||
                        s.description.toLowerCase().includes(query)
                    );
                }
                return data.services;
            }
            if (endpoint.includes('categories')) {
                const query = params.name?.toLowerCase().replace(/"/g, '');
                if (query) {
                    return data.categories.filter(c => c.name.toLowerCase().includes(query));
                }
                return data.categories;
            }
            if (endpoint.includes('history')) {
                return data.history;
            }
            if (endpoint.includes('professionals')) {
                return data.professionals;
            }
            return data;
        } else {
            // Construcción de URL para API real
            const url = new URL(`${API_CONFIG.baseUrl}/${endpoint}`);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const response = await fetch(url, {
                method: 'GET',
                headers: await this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        }
    }

    static async searchServices(query, filter = 'n', categories = [], page = 1) {
        const params = {
            name: `"${query}"`,
            filter: filter,
            categories: JSON.stringify(categories),
            page: page
        };
        return this.fetchData('search_s/search', params);
    }

    static async getProfessionals() {
        return this.fetchData('professionals');
    }

    static async getRecommendedServices() {
        // En mock, retornamos todos los servicios como "historial/recomendados"
        return this.fetchData('search_s/search');
    }
}

// Función para generar las estrellas del rating
function generarEstrellas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            estrellas += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            estrellas += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            estrellas += '<i class="far fa-star text-warning"></i>';
        }
    }
    return estrellas;
}

// Función para generar una card de trabajador (adaptada para datos dinámicos)
function generarCardTrabajador(trabajador) {
    // Mapeo de datos si vienen del backend/mock
    const nombre = trabajador.nombre || trabajador.name;
    const profesion = trabajador.profesion || trabajador.profession || trabajador.description; // Fallback
    const experiencia = trabajador.experiencia || trabajador.experience || 0;
    const imagen = trabajador.imagen || trabajador.image || '../../core/images/default.jpg';
    const rating = trabajador.rating || 0;
    const estrellas = trabajador.estrellas || rating; // Si no viene estrellas, usar rating

    return `
        <div class="col">
            <div class="card h-100" id="Borders">
                <img src="${imagen}" class="card-img-top" alt="${profesion}" style="height: 150px; object-fit: cover; width: 100%;">
                <div class="card-body p-2">
                    <h6 class="card-title mb-0">${nombre}</h6>
                    <p class="card-text small mb-1">${profesion}</p>
                    <p class="card-text"><small class="text-muted">${experiencia} años exp.</small></p>
                    <div class="star-rating small mb-1">
                        ${generarEstrellas(estrellas)}
                        <span class="ms-1">${rating}</span>
                    </div>
                    <button class="btn btn-primary btn-sm btn-block w-100" id="ColorButton">Ver Perfil</button>
                </div>
            </div>
        </div>
    `;
}

// Renderizar Carousel de Recomendados
function renderRecomendados(professionals) {
    const carouselContent = document.getElementById('carousel-content');
    const carouselIndicators = document.getElementById('carousel-indicators');

    if (!carouselContent || !carouselIndicators) return;

    carouselContent.innerHTML = '';
    carouselIndicators.innerHTML = '';

    professionals.forEach((prof, index) => {
        // Crear indicador
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#recomendadosCarousel';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);

        // Crear slide item
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;

        // Reutilizamos la card pero ajustada al carousel (solo 1 card por slide en este diseño simple)
        // Nota: El diseño original tenía una card dentro del item.
        item.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="card h-100" id="Borders" style="width: 100%; max-width: 400px;"> <!-- Limit width for carousel -->
                    <img src="${prof.image}" class="card-img-top" alt="${prof.profession}" style="height: 200px; object-fit: cover; width: 100%;">
                    <div class="card-body p-3">
                        <h5 class="card-title mb-1">${prof.name}</h5>
                        <p class="card-text mb-2">${prof.profession}</p>
                        <p class="card-text"><small class="text-muted">${prof.experience} años exp.</small></p>
                        <div class="star-rating mb-2">
                            ${generarEstrellas(prof.rating)}
                            <span class="ms-2">${prof.rating}</span>
                        </div>
                        <button class="btn btn-primary btn-block w-100" id="ColorButton">Ver Perfil</button>
                    </div>
                </div>
            </div>
        `;
        carouselContent.appendChild(item);
    });
}

// Renderizar Historial (Grid)
function renderHistorial(services) {
    const container = document.getElementById('historial-grid');
    if (!container) return;

    container.innerHTML = '';
    services.forEach(service => {
        // Adaptar objeto servicio a formato trabajador para la card
        // En el mock, los servicios tienen 'name' (titulo servicio), 'description', 'image', 'rating'
        // No tienen 'experience' ni nombre de profesional explícito a veces, pero usaremos lo que hay.
        const workerData = {
            name: service.name,
            profession: service.description.substring(0, 30) + '...', // Truncar descripción
            experience: 5, // Mock default
            image: service.image,
            rating: service.rating
        };
        container.innerHTML += generarCardTrabajador(workerData);
    });
}


// Event listener principal
document.addEventListener('DOMContentLoaded', function () {
    // 1. Cargar Profesionales para Recomendados
    SearchService.getProfessionals().then(profs => {
        renderRecomendados(profs);
    });

    // 2. Cargar Historial (usando servicios como mock)
    SearchService.getRecommendedServices().then(services => {
        renderHistorial(services);
    });

    // 3. Lógica de Modal de Categorías (Existente)
    const serviciosModal = document.getElementById('serviciosModal');
    if (serviciosModal) {
        const modalTitle = serviciosModal.querySelector('.modal-title');
        const modalCards = document.getElementById('modalCards');

        document.querySelectorAll('.categoria-btn').forEach(button => {
            button.addEventListener('click', function () {
                // Aquí podrías también cargar dinámicamente por categoría si quisieras
                // Por ahora mantenemos la lógica estática o la adaptamos mínimamente
                const categoria = this.getAttribute('data-categoria');
                // Simulación: Filtrar de los profesionales cargados o usar el objeto estático si se prefiere
                // Para consistencia, usaremos el objeto estático 'trabajadoresPorCategoria' que ya existía
                // O mejor, filtrar del mock data si es posible.
                // Mantendremos 'trabajadoresPorCategoria' por ahora para no romper esa parte específica si no se pidió cambiar.

                const trabajadores = trabajadoresPorCategoria[categoria] || [];
                modalTitle.textContent = `${this.textContent} Disponibles`;
                modalCards.innerHTML = '';
                trabajadores.forEach(trabajador => {
                    modalCards.innerHTML += generarCardTrabajador(trabajador);
                });
            });
        });
    }

    // 4. Global event listener for "Ver Perfil" and "Contactar" buttons
    document.body.addEventListener('click', function (e) {
        const button = e.target.closest('button');

        if (button && (button.textContent.trim() === 'Ver Perfil' || button.textContent.trim() === 'Contactar')) {
            const card = button.closest('.card');

            if (card) {
                const nombre = card.querySelector('.card-title')?.textContent || '';
                const profesion = card.querySelector('.card-text')?.textContent || '';
                const experienciaText = card.querySelectorAll('.card-text')[1]?.textContent || '';
                const experiencia = parseInt(experienciaText.match(/\d+/)?.[0] || '0');
                const imagen = card.querySelector('img')?.src || '';
                const ratingText = card.querySelector('.star-rating span')?.textContent || '0';
                const rating = parseFloat(ratingText) || 0;

                const stars = card.querySelectorAll('.star-rating .fa-star:not(.fa-star-half-alt)').length;
                const halfStars = card.querySelectorAll('.star-rating .fa-star-half-alt').length;
                const estrellas = stars + (halfStars * 0.5);

                const professionalData = {
                    nombre: nombre,
                    profesion: profesion,
                    experiencia: experiencia,
                    imagen: imagen,
                    rating: rating,
                    estrellas: estrellas
                };

                localStorage.setItem('selectedProfessional', JSON.stringify(professionalData));
                window.location.href = '/perfil-de-profesional';
            }
        }
    });

    // 5. Cargar contratos aceptados
    fetchAcceptedContracts().then(contracts => {
        renderAcceptedContracts(contracts);
    });

    // 6. Lógica de Búsqueda
    const searchInput = document.getElementById('InputBuscador');
    const searchButton = document.getElementById('ColorButtonGray');
    const resultsContainer = document.getElementById('HomeIzquierda');

    async function performSearch() {
        const query = searchInput.value.trim();
        // if (!query) return; // Permitir búsqueda vacía

        try {
            if (resultsContainer) resultsContainer.style.opacity = '0.5';
            const results = await SearchService.searchServices(query);
            renderSearchResults(results);
            if (resultsContainer) resultsContainer.style.opacity = '1';
        } catch (error) {
            console.error('Search error:', error);
            alert('Error al buscar servicios');
            if (resultsContainer) resultsContainer.style.opacity = '1';
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', function (e) {
            e.preventDefault();
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
});

// ... (Resto de funciones auxiliares como renderSearchResults, fetchAcceptedContracts, renderAcceptedContracts) ...
// Necesito incluir renderSearchResults y las de contratos porque estoy sobrescribiendo el archivo.

function renderSearchResults(results) {
    const container = document.getElementById('HomeIzquierda');
    if (!container) return;

    let html = '<div class="search-results p-3">';
    html += '<div class="d-flex justify-content-between align-items-center mb-3">';
    html += '<h3>Resultados de Búsqueda</h3>';
    html += '<button class="btn btn-sm btn-secondary" onclick="window.location.reload()">Volver</button>';
    html += '</div>';

    if (results.length === 0) {
        html += '<div class="alert alert-info">No se encontraron servicios que coincidan con tu búsqueda.</div>';
    } else {
        html += '<div class="row row-cols-1 row-cols-md-2 g-4">';
        results.forEach(service => {
            html += `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="${service.image || '../../core/images/default.jpg'}" class="card-img-top" alt="${service.name}" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${service.name}</h5>
                            <p class="card-text small text-muted">${service.description}</p>
                            <div class="mb-2">
                                <span class="badge bg-light text-dark border">Precio: ${service.price_range}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div class="star-rating small">
                                    <i class="fas fa-star text-warning"></i>
                                    <span>${service.rating}</span>
                                </div>
                                <button class="btn btn-primary btn-sm">Ver Detalle</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
}

// Mock Data for Contracts
const mockContracts = [
    {
        service_id: "1a814cab-441c-4911-98f7-6cd2892ce74c",
        prof_id: "92e805fd-7c69-442c-b2ff-e8ca119884ff",
        client_id: "d1e0b82c-63fe-4f8e-a51c-a6cc9239ecf0",
        title: "Reparación de Fuga",
        details: "Reparación de fuga en tubería principal de cocina.",
        start_time: "10:00:00",
        contract_date: "2024-05-20",
        payment_method: "Tarjeta de Crédito",
        amount: 1500.00,
        status: "accepted"
    },
    {
        service_id: "2b814cab-441c-4911-98f7-6cd2892ce74d",
        prof_id: "92e805fd-7c69-442c-b2ff-e8ca119884ff",
        client_id: "d1e0b82c-63fe-4f8e-a51c-a6cc9239ecf0",
        title: "Instalación Eléctrica",
        details: "Instalación de nuevas tomas de corriente en sala.",
        start_time: "14:30:00",
        contract_date: "2024-05-22",
        payment_method: "Efectivo",
        amount: 800.00,
        status: "pending"
    },
    {
        service_id: "3c814cab-441c-4911-98f7-6cd2892ce74e",
        prof_id: "92e805fd-7c69-442c-b2ff-e8ca119884ff",
        client_id: "d1e0b82c-63fe-4f8e-a51c-a6cc9239ecf0",
        title: "Mantenimiento Jardín",
        details: "Poda de árboles y limpieza general.",
        start_time: "09:00:00",
        contract_date: "2024-05-25",
        payment_method: "Transferencia",
        amount: 1200.00,
        status: "accepted"
    }
];

function fetchAcceptedContracts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const acceptedContracts = mockContracts.filter(c => c.status === 'accepted');
            resolve(acceptedContracts);
        }, 500);
    });
}

function renderAcceptedContracts(contracts) {
    const container = document.getElementById('DivCalendario');
    let listContainer = document.getElementById('contracts-list');
    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.id = 'contracts-list';
        listContainer.style.width = '100%';
        listContainer.style.marginTop = '10px';
        container.appendChild(listContainer);
    } else {
        listContainer.innerHTML = '';
    }

    if (contracts.length === 0) {
        listContainer.innerHTML = '<p class="text-muted">No tienes citas próximas.</p>';
        return;
    }

    contracts.forEach(contract => {
        const dateObj = new Date(`${contract.contract_date}T${contract.start_time}`);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.style.border = '1px solid #ddd';

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${contract.title}</h5>
                <p class="card-text small text-muted">${dateStr}</p>
                <p class="card-text">${contract.details}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-success">Aceptado</span>
                    <span class="fw-bold">$${contract.amount.toFixed(2)}</span>
                </div>
                <p class="card-text small mt-2"><i class="fas fa-credit-card"></i> ${contract.payment_method}</p>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Datos estáticos para el modal (se mantienen por ahora)
const trabajadoresPorCategoria = {
    plomeros: [
        { nombre: "Roberto Sánchez", profesion: "Plomero Profesional", experiencia: 10, imagen: "../../core/images/Plomero.jpg", rating: 5.0, estrellas: 5 },
        { nombre: "Ana Martínez", profesion: "Plomera Certificada", experiencia: 8, imagen: "../../core/images/Plomero.jpg", rating: 4.5, estrellas: 4.5 }
    ],
    carpinteros: [
        { nombre: "Ale Calvillo", profesion: "Carpintero Experto", experiencia: 15, imagen: "../../core/images/Carpintero.jpg", rating: 4.8, estrellas: 5 }
    ],
    cerrajeros: [
        { nombre: "Lla Vero", profesion: "Cerrajero Master", experiencia: 12, imagen: "../../core/images/Cerrajero.jpg", rating: 4.9, estrellas: 5 }
    ],
    fontaneros: [
        { nombre: "Raúl Trump", profesion: "Fontanero Especialista", experiencia: 5, imagen: "../../core/images/Plomero.jpg", rating: 4.5, estrellas: 4.5 }
    ],
    pintores: [
        { nombre: "Carlos Ruiz", profesion: "Pintor Profesional", experiencia: 8, imagen: "../../core/images/Pintor.jpeg", rating: 4.7, estrellas: 4.5 },
        { nombre: "Cristiano Jesuita", profesion: "Pintor Profesional", experiencia: 2, imagen: "../../core/images/Pintor2.png", rating: 3.8, estrellas: 4 }
    ],
    electricistas: [
        { nombre: "Juan González", profesion: "Electricista Certificado", experiencia: 6, imagen: "../../core/images/Electricista.jpg", rating: 4.0, estrellas: 4 },
        { nombre: "Guillermo Calvillo", profesion: "Electricista Certificado", experiencia: 2, imagen: "../../core/images/Electricista2.png", rating: 3, estrellas: 3 }
    ],
    jardineros: [
        { nombre: "Juan Pérez", profesion: "Jardinero Paisajista", experiencia: 4, imagen: "../../core/images/Jardinero.jpg", rating: 3.5, estrellas: 3.5 },
        { nombre: "Luthe", profesion: "Jardinero", experiencia: 1, imagen: "../../core/images/Jardinero2.png", rating: 4.5, estrellas: 4.5 }
    ],
    limpieza: [
        { nombre: "Laura Soto", profesion: "Profesional de Limpieza", experiencia: 7, imagen: "../../core/images/Limpieza.png", rating: 4.8, estrellas: 5 }
    ],
    albañiles: [
        { nombre: "José García", profesion: "Maestro Albañil", experiencia: 20, imagen: "../../core/images/Albanil.png", rating: 4.9, estrellas: 5 }
    ],
    tapiceros: [
        { nombre: "Patricia López", profesion: "Tapicera Especialista", experiencia: 9, imagen: "../../core/images/Tapicera.png", rating: 4.6, estrellas: 4.5 }
    ]
};