// core/scripts/HealthCheck.js
import API_CONFIG from '../../config/apiConfig.js';

/**
 * Verifica si el backend está disponible
 */
export async function verificarBackend() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.ok;

    } catch (error) {
        console.error('❌ Backend no disponible en:', API_CONFIG.BASE_URL);
        return false;
    }
}

/**
 * Muestra un mensaje si el backend no está disponible
 */
export async function verificarConexionInicial() {
    const backendDisponible = await verificarBackend();

    if (!backendDisponible) {
        const mensaje = `
            ⚠️ ADVERTENCIA: No se puede conectar con el backend.
            
            Verifica que:
            1. El backend esté corriendo en http://localhost:3001
            2. CORS esté configurado para aceptar http://localhost:3000
            3. No haya firewall bloqueando la conexión
        `;

        console.warn(mensaje);

        // Opcional: Mostrar mensaje en la UI
        mostrarAlertaBackendNoDisponible();
    }
}

function mostrarAlertaBackendNoDisponible() {
    const alerta = document.createElement('div');
    alerta.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        max-width: 300px;
    `;
    alerta.innerHTML = `
        <strong>⚠️ Servidor no disponible</strong>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
            No se puede conectar con el backend en localhost:3001
        </p>
    `;

    document.body.appendChild(alerta);

    // Ocultar después de 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}