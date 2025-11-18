const modalLogin = document.getElementById("modalLoginPersonal");
const modalRegistro = document.getElementById("modalRegistroPersonal");

const abrirLogin = document.getElementById("btnAbrirLogin");
const abrirRegistro = document.getElementById("btnAbrirRegistro");

const cerrarLogin = document.getElementById("cerrarLogin");
const cerrarRegistro = document.getElementById("cerrarRegistro");

// Abrir login
abrirLogin.addEventListener("click", () => {
    modalLogin.classList.add("activo");
});

// Abrir registro
abrirRegistro.addEventListener("click", () => {
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

