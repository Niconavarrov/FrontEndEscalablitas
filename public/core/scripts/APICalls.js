// Configuración de API
const API_CONFIG = {
    baseUrl: 'http://localhost:3000/api'
};

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

// Exportar para uso en otros archivos si se usa módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchData, API_CONFIG };
}