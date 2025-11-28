function toggleImagen() {
    const contenedor = document.getElementById('contenedorImagen');
    contenedor.style.display = contenedor.style.display === 'none' ? 'block' : 'none';
}

// Base de datos simulada de trabajadores por categoría
const trabajadoresPorCategoria = {
    plomeros: [
        {
            nombre: "Roberto Sánchez",
            profesion: "Plomero Profesional",
            experiencia: 10,
            imagen: "../images/Plomero.jpg",
            rating: 5.0,
            estrellas: 5
        },
        {
            nombre: "Ana Martínez",
            profesion: "Plomera Certificada",
            experiencia: 8,
            imagen: "../images/Plomero.jpg",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    carpinteros: [
        {
            nombre: "Ale Calvillo",
            profesion: "Carpintero Experto",
            experiencia: 15,
            imagen: "../images/Carpintero.jpg",
            rating: 4.8,
            estrellas: 5
        }
    ],
    cerrajeros: [
        {
            nombre: "Lla Vero",
            profesion: "Cerrajero Master",
            experiencia: 12,
            imagen: "../images/Cerrajero.jpg",
            rating: 4.9,
            estrellas: 5
        }
    ],
    fontaneros: [
        {
            nombre: "Raúl Trump",
            profesion: "Fontanero Especialista",
            experiencia: 5,
            imagen: "../images/Plomero.jpg",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    pintores: [
        {
            nombre: "Carlos Ruiz",
            profesion: "Pintor Profesional",
            experiencia: 8,
            imagen: "../images/Pintor.jpeg",
            rating: 4.7,
            estrellas: 4.5
        },
        {
            nombre: "Cristiano Jesuita",
            profesion: "Pintor Profesional",
            experiencia: 2,
            imagen: "../images/Pintor2.png",
            rating: 3.8,
            estrellas: 4
        }
    ],
    electricistas: [
        {
            nombre: "Juan González",
            profesion: "Electricista Certificado",
            experiencia: 6,
            imagen: "../images/Electricista.jpg",
            rating: 4.0,
            estrellas: 4
        },
        {
            nombre: "Guillermo Calvillo",
            profesion: "Electricista Certificado",
            experiencia: 2,
            imagen: "../images/Electricista2.png",
            rating: 3,
            estrellas: 3
        },
    ],
    jardineros: [
        {
            nombre: "Juan Pérez",
            profesion: "Jardinero Paisajista",
            experiencia: 4,
            imagen: "../images/Jardinero.jpg",
            rating: 3.5,
            estrellas: 3.5
        },
        {
            nombre: "Luthe",
            profesion: "Jardinero",
            experiencia: 1,
            imagen: "../images/Jardinero2.png",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    limpieza: [
        {
            nombre: "Laura Soto",
            profesion: "Profesional de Limpieza",
            experiencia: 7,
            imagen: "../images/Limpieza.png",
            rating: 4.8,
            estrellas: 5
        }
    ],
    albañiles: [
        {
            nombre: "José García",
            profesion: "Maestro Albañil",
            experiencia: 20,
            imagen: "../images/Albanil.png",
            rating: 4.9,
            estrellas: 5
        }
    ],
    tapiceros: [
        {
            nombre: "Patricia López",
            profesion: "Tapicera Especialista",
            experiencia: 9,
            imagen: "../images/Tapicera.png",
            rating: 4.6,
            estrellas: 4.5
        }
    ]
};

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

// Función para generar una card de trabajador
function generarCardTrabajador(trabajador) {
    return `
        <div class="col">
            <div class="card h-100" id="Borders">
                <img src="${trabajador.imagen}" class="card-img-top" alt="${trabajador.profesion}" style="height: 150px; object-fit: cover; width: 100%;">
                <div class="card-body p-2">
                    <h6 class="card-title mb-0">${trabajador.nombre}</h6>
                    <p class="card-text small mb-1">${trabajador.profesion}</p>
                    <p class="card-text"><small class="text-muted">${trabajador.experiencia} años exp.</small></p>
                    <div class="star-rating small mb-1">
                        ${generarEstrellas(trabajador.estrellas)}
                        <span class="ms-1">${trabajador.rating}</span>
                    </div>
                    <button class="btn btn-primary btn-sm btn-block w-100" id="ColorButton">Contactar</button>
                </div>
            </div>
        </div>
    `;
}

// Event listener para cuando se abre el modal
document.addEventListener('DOMContentLoaded', function () {
    const serviciosModal = document.getElementById('serviciosModal');
    const modalTitle = serviciosModal.querySelector('.modal-title');
    const modalCards = document.getElementById('modalCards');

    // Escuchar clicks en los botones de categoría
    document.querySelectorAll('.categoria-btn').forEach(button => {
        button.addEventListener('click', function () {
            const categoria = this.getAttribute('data-categoria');
            const trabajadores = trabajadoresPorCategoria[categoria];

            // Actualizar título del modal
            modalTitle.textContent = `${this.textContent} Disponibles`;

            // Limpiar y generar nuevas cards
            modalCards.innerHTML = '';
            trabajadores.forEach(trabajador => {
                modalCards.innerHTML += generarCardTrabajador(trabajador);
            });
        });
    });

    // Global event listener for "Ver Perfil" and "Contactar" buttons
    document.body.addEventListener('click', function (e) {
        const button = e.target.closest('button');

        if (button && (button.textContent.trim() === 'Ver Perfil' || button.textContent.trim() === 'Contactar')) {
            // Find the card containing this button
            const card = button.closest('.card');

            if (card) {
                // Extract professional data from the card
                const nombre = card.querySelector('.card-title')?.textContent || '';
                const profesion = card.querySelector('.card-text')?.textContent || '';
                const experienciaText = card.querySelectorAll('.card-text')[1]?.textContent || '';
                const experiencia = parseInt(experienciaText.match(/\d+/)?.[0] || '0');
                const imagen = card.querySelector('img')?.src || '';
                const ratingText = card.querySelector('.star-rating span')?.textContent || '0';
                const rating = parseFloat(ratingText) || 0;

                // Count stars to get estrellas value
                const stars = card.querySelectorAll('.star-rating .fa-star:not(.fa-star-half-alt)').length;
                const halfStars = card.querySelectorAll('.star-rating .fa-star-half-alt').length;
                const estrellas = stars + (halfStars * 0.5);

                // Create professional object
                const professionalData = {
                    nombre: nombre,
                    profesion: profesion,
                    experiencia: experiencia,
                    imagen: imagen,
                    rating: rating,
                    estrellas: estrellas
                };

                // Store in localStorage
                localStorage.setItem('selectedProfessional', JSON.stringify(professionalData));

                // Navigate to profile page
                window.location.href = '/perfil-de-profesional';
            }
        }
    });

    // Cargar contratos aceptados
    fetchAcceptedContracts().then(contracts => {
        renderAcceptedContracts(contracts);
    });
});

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

// Función para simular fetch al backend
function fetchAcceptedContracts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const acceptedContracts = mockContracts.filter(c => c.status === 'accepted');
            resolve(acceptedContracts);
        }, 500); // Simular delay de red
    });
}

// Función para renderizar contratos
function renderAcceptedContracts(contracts) {
    const container = document.getElementById('DivCalendario');

    // Crear un contenedor para la lista si no existe, para no borrar el título
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
        // Combinar fecha y hora para mostrar
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