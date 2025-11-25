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
            imagen: "images/Plomero.jpg",
            rating: 5.0,
            estrellas: 5
        },
        {
            nombre: "Ana Martínez",
            profesion: "Plomera Certificada",
            experiencia: 8,
            imagen: "images/Plomero.jpg",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    carpinteros: [
        {
            nombre: "Ale Calvillo",
            profesion: "Carpintero Experto",
            experiencia: 15,
            imagen: "images/Carpintero.jpg",
            rating: 4.8,
            estrellas: 5
        }
    ],
    cerrajeros: [
        {
            nombre: "Lla Vero",
            profesion: "Cerrajero Master",
            experiencia: 12,
            imagen: "images/Cerrajero.jpg",
            rating: 4.9,
            estrellas: 5
        }
    ],
    fontaneros: [
        {
            nombre: "Raúl Trump",
            profesion: "Fontanero Especialista",
            experiencia: 5,
            imagen: "images/Plomero.jpg",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    pintores: [
        {
            nombre: "Carlos Ruiz",
            profesion: "Pintor Profesional",
            experiencia: 8,
            imagen: "images/Pintor.jpeg",
            rating: 4.7,
            estrellas: 4.5
        },
        {
            nombre: "Cristiano Jesuita",
            profesion: "Pintor Profesional",
            experiencia: 2,
            imagen: "images/Pintor2.png",
            rating: 3.8,
            estrellas: 4
        }
    ],
    electricistas: [
        {
            nombre: "Juan González",
            profesion: "Electricista Certificado",
            experiencia: 6,
            imagen: "images/Electricista.jpg",
            rating: 4.0,
            estrellas: 4
        },
        {
            nombre: "Guillermo Calvillo",
            profesion: "Electricista Certificado",
            experiencia: 2,
            imagen: "images/Electricista2.png",
            rating: 3,
            estrellas: 3
        },
    ],
    jardineros: [
        {
            nombre: "Juan Pérez",
            profesion: "Jardinero Paisajista",
            experiencia: 4,
            imagen: "images/Jardinero.jpg",
            rating: 3.5,
            estrellas: 3.5
        },
        {
            nombre: "Luthe",
            profesion: "Jardinero",
            experiencia: 1,
            imagen: "images/Jardinero2.png",
            rating: 4.5,
            estrellas: 4.5
        }
    ],
    limpieza: [
        {
            nombre: "Laura Soto",
            profesion: "Profesional de Limpieza",
            experiencia: 7,
            imagen: "images/Limpieza.png",
            rating: 4.8,
            estrellas: 5
        }
    ],
    albañiles: [
        {
            nombre: "José García",
            profesion: "Maestro Albañil",
            experiencia: 20,
            imagen: "images/Albanil.png",
            rating: 4.9,
            estrellas: 5
        }
    ],
    tapiceros: [
        {
            nombre: "Patricia López",
            profesion: "Tapicera Especialista",
            experiencia: 9,
            imagen: "images/Tapicera.png",
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
                window.location.href = 'perfilProfesional.html';
            }
        }
    });
});