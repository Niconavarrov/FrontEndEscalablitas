// Validación básica de contraseñas al enviar el formulario
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('main.auth form');
    const checkProfesional = document.getElementById('checkProfesional');
    const cuentaProHelp = document.getElementById('cuentaProHelp');

    // Mostrar / ocultar leyenda de cuenta profesional
    if (checkProfesional && cuentaProHelp) {
        const actualizarLeyendaProfesional = () => {
            if (checkProfesional.checked) {
                cuentaProHelp.style.display = 'block';
            } else {
                cuentaProHelp.style.display = 'none';
            }
        };

        // Estado inicial
        actualizarLeyendaProfesional();

        // Cuando cambia el checkbox
        checkProfesional.addEventListener('change', actualizarLeyendaProfesional);
    }

    // Validación completa del formulario al enviar
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevenir el envío por defecto

            // Obtener todos los campos requeridos
            const fullname = form.querySelector('input[name="fullname"]');
            const email = form.querySelector('input[name="email"]');
            const phone = form.querySelector('input[name="Teléfono de contacto"]');
            const pass = form.querySelector('input[name="password"]');
            const confirm = form.querySelector('input[name="confirmpassword"]');

            // Validar que todos los campos estén llenos
            if (!fullname || !fullname.value.trim()) {
                alert('Por favor, ingresa tu nombre completo.');
                fullname.focus();
                return;
            }

            if (!email || !email.value.trim()) {
                alert('Por favor, ingresa tu correo electrónico.');
                email.focus();
                return;
            }

            // Validar formato de email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                email.focus();
                return;
            }

            if (!phone || !phone.value.trim()) {
                alert('Por favor, ingresa tu teléfono de contacto.');
                phone.focus();
                return;
            }

            // Validar formato de teléfono (10 dígitos)
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone.value.replace(/\s/g, ''))) {
                alert('Por favor, ingresa un teléfono válido de 10 dígitos.');
                phone.focus();
                return;
            }

            if (!pass || !pass.value) {
                alert('Por favor, ingresa una contraseña.');
                pass.focus();
                return;
            }

            if (!confirm || !confirm.value) {
                alert('Por favor, confirma tu contraseña.');
                confirm.focus();
                return;
            }

            // Validar que las contraseñas coincidan
            if (pass.value !== confirm.value) {
                alert('Las contraseñas no coinciden. Por favor, verifica.');
                confirm.focus();
                return;
            }

            // Si todas las validaciones pasan, aquí puedes procesar el formulario
            alert('Formulario válido. Procesando registro...');
            // TODO: Aquí deberías agregar la lógica para enviar los datos al servidor
            // form.submit(); // Descomentar cuando tengas el backend listo
        });
    }
});