// MODALES LOGIN / REGISTRO 
document.addEventListener("DOMContentLoaded", () => {
    const modalLogin = document.getElementById("modalLoginPersonal");
    const modalRegistro = document.getElementById("modalRegistroPersonal");

    const abrirLogin = document.getElementById("btnAbrirLogin");
    const abrirRegistro = document.getElementById("btnAbrirRegistro");

    const cerrarLogin = document.getElementById("cerrarLogin");
    const cerrarRegistro = document.getElementById("cerrarRegistro");

    if (abrirLogin) {
        abrirLogin.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalLogin.classList.add("activo");
        });
    }

    if (abrirRegistro) {
        abrirRegistro.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalRegistro.classList.add("activo");
        });
    }

    if (cerrarLogin) {
        cerrarLogin.addEventListener("click", () => {
            document.activeElement.blur();
            modalLogin.classList.remove("activo");
        });
    }

    if (cerrarRegistro) {
        cerrarRegistro.addEventListener("click", () => {
            document.activeElement.blur();
            modalRegistro.classList.remove("activo");
        });
    }
});

// REGISTRO 
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", function(e) {
        e.preventDefault();

        const correo = document.getElementById("regCorreo").value.trim();
        const pass = document.getElementById("regPass").value;

        // Guardar datos del usuario (simple, un solo usuario demo)
        localStorage.setItem("usuarioCorreo", correo);
        localStorage.setItem("usuarioPass", pass);

        // Usuario actual = usuario registrado
        localStorage.setItem("usuarioActivo", correo);

        alert("¡Cuenta creada con éxito!");

        const modalRegistro = document.getElementById("modalRegistroPersonal");
        if (modalRegistro) modalRegistro.classList.remove("activo");

        actualizarNavbar();
    });
}

// LOGIN
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();

        const correoIngresado = document.getElementById("loginCorreo").value.trim();
        const passIngresado = document.getElementById("loginPass").value;

        const correoGuardado = localStorage.getItem("usuarioCorreo");
        const passGuardada = localStorage.getItem("usuarioPass");

        if (correoIngresado === correoGuardado && passIngresado === passGuardada) {
            // Usuario activo correcto
            localStorage.setItem("usuarioActivo", correoGuardado);

            alert("Inicio de sesión exitoso");

            const modalLogin = document.getElementById("modalLoginPersonal");
            if (modalLogin) modalLogin.classList.remove("activo");

            actualizarNavbar();
        } else {
            alert("Correo o contraseña incorrectos");
        }
    });
}

// ACTUALIZAR NAVBAR SEGÚN SESIÓN 
function actualizarNavbar() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    const spanCorreo = document.getElementById("correoMostrado");
    const btnLogin = document.getElementById("btnAbrirLogin");
    const btnRegistro = document.getElementById("btnAbrirRegistro");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const divisorUsuario = document.getElementById("divisorUsuario");
    const btnMisRecetas = document.getElementById("btnMisRecetas");

    if (!spanCorreo || !btnCerrarSesion) return; // página sin navbar completo

    if (usuarioActivo) {
        spanCorreo.innerText = usuarioActivo;
        spanCorreo.classList.remove("oculto");

        if (btnLogin) btnLogin.classList.add("oculto");
        if (btnRegistro) btnRegistro.classList.add("oculto");

        btnCerrarSesion.classList.remove("oculto");
        if (divisorUsuario) divisorUsuario.classList.remove("oculto");
        if (btnMisRecetas) btnMisRecetas.classList.remove("oculto");
    } else {
        spanCorreo.innerText = "";
        spanCorreo.classList.add("oculto");

        if (btnLogin) btnLogin.classList.remove("oculto");
        if (btnRegistro) btnRegistro.classList.remove("oculto");

        btnCerrarSesion.classList.add("oculto");
        if (divisorUsuario) divisorUsuario.classList.add("oculto");
        if (btnMisRecetas) btnMisRecetas.classList.add("oculto");
    }
}

// CARGAR ESTADO AL ENTRAR A LA PÁGINA 
window.addEventListener("load", actualizarNavbar);

// CERRAR SESIÓN 
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        // NO borramos usuarioCorreo / usuarioPass para poder volver a loguear
        location.reload();
    });
}
