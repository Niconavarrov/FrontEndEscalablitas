// Manejo de cuenta profesional, servicios múltiples
// Esta función la llama el atributo onclick del checkbox en el HTML
function ToggleEvent() {
    const checkProfesional = document.getElementById('checkProfesional');
    const camposProfesionales = document.getElementById('camposProfesionales');

    if (!checkProfesional || !camposProfesionales) return;

    if (checkProfesional.checked) {
        camposProfesionales.style.display = 'block';
        camposProfesionales.style.opacity = 1;
    } else {
        camposProfesionales.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const checkProfesional = document.getElementById('checkProfesional');
    const camposProfesionales = document.getElementById('camposProfesionales');
    const btnAgregarServicio = document.getElementById('btnAgregarServicio');
    const listaServicios = document.getElementById('listaServiciosProfesionales');
    const form = document.querySelector('main.auth form');

    // Estado inicial de los campos profesionales
    if (checkProfesional && camposProfesionales) {
        if (checkProfesional.checked) {
            camposProfesionales.style.display = 'block';
            camposProfesionales.style.opacity = 1;
        } else {
            camposProfesionales.style.display = 'none';
        }
    }

    // Botón "+ Agregar otro servicio"
    if (btnAgregarServicio && listaServicios) {
        btnAgregarServicio.addEventListener('click', function () {
            agregarNuevoServicio(listaServicios);
        });

        // Delegación para botones "Eliminar" de servicios agregados
        listaServicios.addEventListener('click', function (e) {
            const target = e.target;
            if (target.classList.contains('btnEliminarServicio')) {
                const servicioItem = target.closest('.servicio-item');
                if (servicioItem) {
                    listaServicios.removeChild(servicioItem);
                    renumerarServicios(listaServicios);
                }
            }
        });
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

            // Si solo quieres probar en front sin enviar realmente:
            // e.preventDefault();
            // console.log('Formulario listo para enviarse');
        });
    }
});

// Crea un nuevo bloque de servicio profesional
function agregarNuevoServicio(listaServicios) {
    const numActual = listaServicios.querySelectorAll('.servicio-item').length;
    const nuevoNumero = numActual + 1;

    const div = document.createElement('div');
    div.className = 'servicio-item';

    div.innerHTML = `
        <div class="servicio-header">
            <span>Servicio ${nuevoNumero}</span>
            <button type="button" class="btn btn-sm btn-link text-danger btnEliminarServicio">
                Eliminar
            </button>
        </div>

        <select name="servicio[]" class="form-select" required>
            <option value="" selected disabled>— Elige una opción —</option>
            <option value="albanil">Albañil</option>
            <option value="carpintero">Carpintero</option>
            <option value="cerrajero">Cerrajero</option>
            <option value="electricista">Electricista</option>
            <option value="jardinero">Jardinero</option>
            <option value="limpieza">Limpieza</option>
            <option value="pintor">Pintor</option>
            <option value="plomero">Plomero</option>
            <option value="tapicero">Tapicero</option>
        </select>

        <input type="number" name="experiencia[]" placeholder="Años de Experiencia" min="0" required />
        <input type="text" name="especialidad[]" placeholder="Especialidad" required />
        <textarea name="descripcion[]" placeholder="Descripción de tus servicios" rows="3"
            class="form-control mb-3" required></textarea>
        <input type="tel" name="telefono[]" placeholder="Número de Teléfono" pattern="[0-9]{10}" required />
        <input type="text" name="zona[]" placeholder="Zona de Servicio" required />
    `;

    listaServicios.appendChild(div);
    renumerarServicios(listaServicios);
}

// Renumera los títulos "Servicio 1, 2, 3..." después de agregar/eliminar
function renumerarServicios(listaServicios) {
    const items = listaServicios.querySelectorAll('.servicio-item');
    items.forEach((item, index) => {
        const titulo = item.querySelector('.servicio-header span');
        if (titulo) {
            titulo.textContent = `Servicio ${index + 1}`;
        }
    });
}
