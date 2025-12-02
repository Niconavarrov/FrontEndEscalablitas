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

        // Populate additional info if available (assuming elements exist or adding them dynamically if needed)
        // For now, we just ensure the data is available for use. 
        // If the HTML has elements for phone/email/bio, we would populate them here.
        // Since I don't see them in the original HTML view, I will just log it for now or assume the user will add them later.
        // However, the user asked to "take the data from that same dataset".

        // Update page title
        document.title = `${professionalData.nombre} - Perfil Profesional`;

        // Also populate chat header with professional data
        document.getElementById('chat-profile-img').src = professionalData.imagen;
        document.getElementById('chat-profile-name').textContent = professionalData.nombre;
    } else {
        // If no data, redirect to home
        window.location.href = '/home';
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

////////////////////////////////////////////////////////
// CONTRACT MODAL FUNCTIONS
////////////////////////////////////////////////////////

// Open contract modal
function openContractModal() {
    const modal = new bootstrap.Modal(document.getElementById('contractModal'));
    modal.show();
}

// Submit contract
function submitContract() {
    // Get form values
    const title = document.getElementById('contractTitle').value.trim();
    const details = document.getElementById('contractDetails').value.trim();
    const dateTime = document.getElementById('contractDateTime').value; // Un solo campo datetime-local
    const paymentMethod = document.getElementById('contractPaymentMethod').value;
    const amount = document.getElementById('contractAmount').value;

    // Validate form
    if (!title || !details || !dateTime || !paymentMethod || !amount) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Separar fecha y hora del campo datetime-local
    // dateTime viene en formato: "2024-11-25T14:30"
    const startTime = dateTime; // start_time: formato completo datetime
    const contractDate = dateTime.split('T')[0]; // contract_date: solo la fecha (2024-11-25)

    // Get professional and client data
    const professionalData = JSON.parse(localStorage.getItem('selectedProfessional'));

    // Prepare contract data (los IDs se incluyen en el body para el backend)
    const contractData = {
        service_id: null,  // Este será asignado por el backend o seleccionado por el usuario
        client_id: null,   // Este será obtenido del token de autenticación en el backend
        prof_id: professionalData?.id || null,  // ID del profesional
        title: title,
        details: details,
        start_time: startTime,      // Fecha y hora completa
        contract_date: contractDate, // Solo la fecha
        payment_method: paymentMethod,
        amount: parseFloat(amount)
    };

    ////////////////////////////////////////////////////////
    // INTEGRACIÓN CON BACKEND:
    // Descomentar y ajustar el siguiente código cuando se conecte al backend
    ////////////////////////////////////////////////////////
    /*
    async function sendContract() {
        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contractData)
            });

            if (response.ok) {
                const result = await response.json();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('contractModal'));
                modal.hide();
                
                // Reset form
                document.getElementById('contractForm').reset();
                
                // Show success message
                alert('Contrato enviado exitosamente al profesional');
            } else {
                const error = await response.json();
                alert(`Error al enviar el contrato: ${error.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    }
    
    sendContract();
    return; // Salir de la función para que no ejecute el código de abajo
    */
    ////////////////////////////////////////////////////////

    // CÓDIGO ACTUAL (SIN BACKEND):
    console.log('Datos del contrato a enviar:', contractData);

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('contractModal'));
    modal.hide();

    // Reset form
    document.getElementById('contractForm').reset();

    // Show success message
    alert('Contrato enviado exitosamente (modo demo)');
}

////////////////////////////////////////////////////////
// RESUMEN DE INTEGRACIÓN CON BACKEND PARA CONTRATOS
////////////////////////////////////////////////////////
/*
ENDPOINT NECESARIO:

POST /api/contracts
- Headers: Authorization: Bearer {token}, Content-Type: application/json
- Body: {
    service_id: number (opcional, puede ser null),
    client_id: number (se obtiene del token en el backend),
    prof_id: number (ID del profesional),
    title: string,
    details: string,
    start_time: string (formato datetime-local: "2024-11-25T14:30"),
    contract_date: string (formato date: "2024-11-25"),
    payment_method: string ('efectivo', 'tarjeta', 'transferencia'),
    amount: number
  }
- Response: Objeto del contrato creado con su ID

NOTAS:
- En el HTML solo hay UN campo: contractDateTime (datetime-local)
- En el JavaScript se separa en dos:
  * start_time: valor completo del datetime-local ("2024-11-25T14:30")
  * contract_date: solo la fecha extraída ("2024-11-25")
- Los IDs (service_id, client_id, prof_id) SÍ van en el body del request
- El client_id se puede obtener del token JWT en el backend
- El prof_id se obtiene de los datos del profesional seleccionado
- El service_id puede ser null o seleccionado por el usuario de una lista de servicios
*/
