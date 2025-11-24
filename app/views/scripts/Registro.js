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

    // Validación básica de contraseñas al enviar el formulario
    if (form) {
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
    }
});