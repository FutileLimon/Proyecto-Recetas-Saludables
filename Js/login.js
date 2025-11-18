document.addEventListener("DOMContentLoaded", () => {
    const modalLogin = document.getElementById("modalLoginPersonal");
    const modalRegistro = document.getElementById("modalRegistroPersonal");

    const abrirLogin = document.getElementById("btnAbrirLogin");
    const abrirRegistro = document.getElementById("btnAbrirRegistro");

    const cerrarLogin = document.getElementById("cerrarLogin");
    const cerrarRegistro = document.getElementById("cerrarRegistro");

    abrirLogin.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalLogin.classList.add("activo");
    });

    abrirRegistro.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalRegistro.classList.add("activo");
    });


    // Cerrar login
    cerrarLogin.addEventListener("click", () => {
        document.activeElement.blur();
        modalLogin.classList.remove("activo");
    });

    // Cerrar registro
    cerrarRegistro.addEventListener("click", () => {
        document.activeElement.blur();
        modalRegistro.classList.remove("activo");
    });

    console.log("Login:", abrirLogin);
    console.log("Registro:", abrirRegistro);
});
// Guardar registro
document.getElementById("formRegistro").addEventListener("submit", function(e) {
    e.preventDefault();

    const correo = document.getElementById("regCorreo").value;
    const pass = document.getElementById("regPass").value;

    // Guardar datos en localStorage
    localStorage.setItem("usuarioCorreo", correo);
    localStorage.setItem("usuarioPass", pass);

    alert("¡Cuenta creada con éxito!");

    // Cierra el modal
    document.getElementById("modalRegistroPersonal").classList.remove("activo");
});

document.getElementById("formLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    const correoIngresado = document.getElementById("loginCorreo").value;
    const passIngresado = document.getElementById("loginPass").value;

    const correoGuardado = localStorage.getItem("usuarioCorreo");
    const passGuardada = localStorage.getItem("usuarioPass");

    if (correoIngresado === correoGuardado && passIngresado === passGuardada) {
        alert("Inicio de sesión exitoso");

        // Mostrar correo en navbar
        document.getElementById("correoMostrado").innerText = correoGuardado;
        document.getElementById("correoMostrado").classList.remove("oculto");

        // Ocultar opciones de login/registro
        document.getElementById("btnAbrirLogin").classList.add("oculto");
        document.getElementById("btnAbrirRegistro").classList.add("oculto");

        // Mostrar cerrar sesión
        document.getElementById("btnCerrarSesion").classList.remove("oculto");
        document.getElementById("divisorUsuario").classList.remove("oculto");

        // Cerrar modal login
        document.getElementById("modalLoginPersonal").classList.remove("activo");
    } else {
        alert("Correo o contraseña incorrectos");
    }
});
window.addEventListener("load", () => {
    const correo = localStorage.getItem("usuarioCorreo");

    if (correo) {
        document.getElementById("correoMostrado").innerText = correo;
        document.getElementById("correoMostrado").classList.remove("oculto");

        document.getElementById("btnAbrirLogin").classList.add("oculto");
        document.getElementById("btnAbrirRegistro").classList.add("oculto");

        document.getElementById("btnCerrarSesion").classList.remove("oculto");
        document.getElementById("divisorUsuario").classList.remove("oculto");
    }
});
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioCorreo");
    localStorage.removeItem("usuarioPass");

    location.reload();  // Reinicia para restaurar navbar
});



