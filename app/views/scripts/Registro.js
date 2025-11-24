// Validación básica de contraseñas al enviar el formulario
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('main.auth form');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        const pass = form.querySelector('input[name="password"]');
        const confirm = form.querySelector('input[name="confirmpassword"]');

        if (pass && confirm && pass.value !== confirm.value) {
            e.preventDefault();
            alert('Las contraseñas no coinciden. Por favor, verifica.');
            confirm.focus();
            return;
        }
    });
});
