import API_CONFIG from '../../config/apiConfig.js';

/**
 * Login del usuario
 */
export async function login(email, password) {
    try {
        const response = await fetch(`${API_CONFIG.AUTH_SERVICE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            // Si el backend usa cookies para autenticación
            credentials: 'include'
        });

        // Si hay problema de CORS, el fetch falla antes de llegar aquí
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en el login');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // Error específico para problemas de red/CORS
        if (error.message === 'Failed to fetch') {
            console.error('❌ Error de conexión: Verifica que el backend esté corriendo en localhost:3001');
            console.error('❌ O verifica que CORS esté configurado correctamente');
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }

        console.error('Error en login:', error);
        throw error;
    }
}



/**
 * Función genérica para hacer llamadas a la API
 * @param {string} endpoint - El endpoint de la API (sin el baseUrl)
 * @param {Object} body - El cuerpo de la petición (para POST, PUT, PATCH)
 * @param {Object} headers - Headers adicionales
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, PATCH)
 * @returns {Promise<any>} - Respuesta de la API parseada como JSON
 */
async function fetchData(endpoint, body = {}, headers = {}, method = 'GET') {
    try {
        const url = `${API_CONFIG.baseUrl}/${endpoint}`;

        // Configuración base de headers
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        // Configuración de la petición
        const config = {
            method: method.toUpperCase(),
            headers: defaultHeaders
        };

        // Solo agregar body si no es GET o HEAD
        if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
            config.body = JSON.stringify(body);
        }

        // Realizar la petición
        const response = await fetch(url, config);

        // Obtener el texto de la respuesta
        const responseText = await response.text();

        // Intentar parsear como JSON
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON válido, devolver el texto tal cual
            data = { rawResponse: responseText };
        }

        // Si la respuesta no es exitosa, lanzar error con los datos
        if (!response.ok) {
            const error = new Error(`API Error: ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        // Devolver todos los datos sin importar qué
        return data;

    } catch (error) {
        // Re-lanzar el error para que pueda ser manejado por el código que llama
        console.error('Error en fetchData:', error);
        throw error;
    }
}

export { fetchData, API_CONFIG };