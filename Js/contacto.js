document.getElementById("btnEnviarContacto").addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("c_nombre");
    const email = document.getElementById("c_email");
    const asunto = document.getElementById("c_asunto");
    const mensaje = document.getElementById("c_mensaje");

    // --- VALIDACIONES ---

    // Nombre obligatorio y mínimo 3 caracteres
    if (nombre.value.trim().length < 3) {
        alert("El nombre debe tener al menos 3 caracteres.");
        nombre.focus();
        return;
    }

    // Email obligatorio y válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.value.trim())) {
        alert("Por favor ingresa un correo electrónico válido.");
        email.focus();
        return;
    }

    // Asunto obligatorio (aunque siempre trae un valor)
    if (asunto.value.trim() === "") {
        alert("Seleccione un asunto.");
        asunto.focus();
        return;
    }

    // Mensaje obligatorio y mínimo 10 caracteres
    if (mensaje.value.trim().length < 10) {
        alert("El mensaje debe contener al menos 10 caracteres.");
        mensaje.focus();
        return;
    }

    alert("¡Gracias por tu mensaje! Te responderemos pronto.");

    // Limpiar formulario
    nombre.value = "";
    email.value = "";
    asunto.value = "consulta";
    mensaje.value = "";
});
