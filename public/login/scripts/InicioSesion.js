import LoginInfo from "../models/LoginInfo.js";
import SessionStorageManager from "../../core/scripts/AppStorage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    // Assuming there might be a toggle button, though not explicitly in the HTML provided earlier.
    // If not present, this won't break anything due to the check.
    const toggleBtn = document.getElementById("togglePasswordBtn");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", togglePassword);
    }

    if (!form) {
        console.error("No se encontró el formulario con id='loginForm'");
        return;
    }

    function resetPlaceholders() {
        emailInput.placeholder = "Correo electrónico";
        passwordInput.placeholder = "Contraseña";
        [emailInput, passwordInput].forEach(inp => {
            inp.classList.remove("error-input");
        });
    }

    function showError(input, message) {
        input.value = "";
        input.placeholder = message;
        input.classList.add("error-input");
    }

    // Quitar error al enfocar el input
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('error-input');
            if (input === emailInput) input.placeholder = "Correo electrónico";
            if (input === passwordInput) input.placeholder = "Contraseña";
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        resetPlaceholders();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let valid = true;

        if (!email) {
            showError(emailInput, "El correo es necesario");
            valid = false;
        }
        if (!password) {
            showError(passwordInput, "La contraseña es necesaria");
            valid = false;
        }

        if (!valid) return;

        let loginInfo;
        try {
            loginInfo = new LoginInfo(email, password);
        } catch (err) {
            if (err.message.includes("Correo")) {
                showError(emailInput, err.message);
            } else if (err.message.includes("Contraseña")) {
                showError(passwordInput, err.message);
            } else {
                // Generic error handling for validation
                showError(emailInput, "Información inválida");
                showError(passwordInput, "Información inválida");
            }
            return;
        }

        try {
            const data = await loginInfo.login();

            if (data.tokens) {
                SessionStorageManager.saveSession({
                    access_token: data.tokens.access,
                    refresh_token: data.tokens.refresh,
                    // email_sender_token: data.tokens.websocket_connection, // Mapping websocket to email_sender for now based on previous usage or just storing it
                    authorization_token: data.tokens.websocket_connection, // Or maybe here? Let's check AppStorage keys.
                    account_type: data.account_type,
                    account_name: email
                });
                // Also storing websocket token specifically if needed, but AppStorage has specific keys.
                // The user's example used:
                // access_token: data.token,
                // token_type: data.token_type,
                // account_type: data.account_type,
                // account_name: email

                // Our backend returns:
                // tokens: { websocket_connection, access, refresh }

                // Let's stick to what SessionStorageManager supports in AppStorage.js:
                // accessToken, refreshToken, emailSenderToken, authorizationToken, accountType, accountName

                // I will map 'websocket_connection' to 'authorization_token' for now as a placeholder or just use setItem directly if needed.
                // But let's follow the user's pattern.
            }

            if (data.verified === false) {
                window.location.href = "/Registro";
            } else if (data.verified === true && data.twofactor_enabled === false) {
                window.location.href = "/";
            } else if (data.verified === true && data.twofactor_enabled === true) {
                // window.location.href = "/twofa"; // Not implemented yet
                alert("2FA enabled. Redirecting to 2FA page (not implemented).");
            }

        } catch (err) {
            console.error("Login error:", err);
            // Handle API errors
            if (err.status >= 400 && err.status < 500) {
                showError(emailInput, "Correo o contraseña inválidos");
                showError(passwordInput, "Correo o contraseña inválidos");
            } else {
                alert("Ocurrió un error inesperado. Por favor intente más tarde.");
            }
        }
    });

    // Toggle de mostrar/ocultar contraseña
    function togglePassword() {
        const passwordField = document.getElementById("password");
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    }
});
