function ToggleEvent() {
    var checkBox = document.getElementById("checkProfesional");
    var camposProfesionales = document.getElementById("camposProfesionales");
    
    if (checkBox.checked) {
        // Mostrar campos adicionales con una animación suave
        camposProfesionales.style.display = "block";
        setTimeout(() => {
            camposProfesionales.style.opacity = "1";
        }, 100);
    } else {
        // Ocultar campos adicionales con una animación suave
        camposProfesionales.style.opacity = "0";
        setTimeout(() => {
            camposProfesionales.style.display = "none";
        }, 100);
    }
}