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



