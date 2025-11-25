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

        // Also populate chat header with professional data
        document.getElementById('chat-profile-img').src = professionalData.imagen;
        document.getElementById('chat-profile-name').textContent = professionalData.nombre;
    } else {
        // If no data, redirect to home
        window.location.href = 'home.html';
    }
});

// Chat Modal Functions
function openChat() {
    const modal = document.getElementById('chatModal');
    modal.classList.add('active');
    // Focus on input when chat opens
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside the chat container
document.addEventListener('click', function (event) {
    const modal = document.getElementById('chatModal');
    const chatContainer = document.querySelector('.chat-container');

    if (event.target === modal) {
        closeChat();
    }
});

// Send message function
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messageText = input.value.trim();

    if (messageText === '') return;

    // Create message element
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';

    // Get current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(messageText)}</p>
            <span class="message-time">${timeString}</span>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);

    // Clear input
    input.value = '';

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate professional response (optional - for demo purposes)
    setTimeout(() => {
        simulateResponse();
    }, 1000 + Math.random() * 2000);
}

// Handle Enter key press in chat input
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
////////////////////////////////////////////////////////
//EDITAR AL MOMENTO DE INTEGRAR CON EL BACKEND
////////////////////////////////////////////////////////
// Simulate professional response (for demo purposes)
function simulateResponse() {
    const responses = [
        '¡Gracias por tu mensaje! Te responderé pronto.',
        'Entiendo. ¿Podrías darme más detalles?',
        'Perfecto, puedo ayudarte con eso.',
        'Déjame revisar y te confirmo.',
        '¡Claro! ¿Cuándo te vendría bien?'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message received';

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${randomResponse}</p>
            <span class="message-time">${timeString}</span>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
