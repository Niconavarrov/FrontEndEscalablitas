// Function to generate star rating HTML
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

// Load professional data when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Get professional data from localStorage
    const professionalData = JSON.parse(localStorage.getItem('selectedProfessional'));

    if (professionalData) {
        // Populate profile information
        document.getElementById('profile-image').src = professionalData.imagen;
        document.getElementById('profile-name').textContent = professionalData.nombre;
        document.getElementById('profile-profession').textContent = professionalData.profesion;
        document.getElementById('profile-experience').textContent = professionalData.experiencia;
        document.getElementById('profile-rating').textContent = professionalData.rating;
        document.getElementById('profile-stars').innerHTML = generarEstrellas(professionalData.estrellas);

        // Update page title
        document.title = `${professionalData.nombre} - Perfil Profesional`;
    } else {
        // If no data, redirect to home
        window.location.href = 'home.html';
    }
});

// Function to open chat (placeholder)
function openChat() {
    alert('Funcionalidad de chat próximamente. Por ahora, puedes enviar un mensaje.');
}

