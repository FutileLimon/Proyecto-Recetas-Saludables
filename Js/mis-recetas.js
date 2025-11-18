document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".tarjetas");
    if (!contenedor) return;

    const usuario = (localStorage.getItem("usuarioActivo") || "").trim();

    if (!usuario) {
        contenedor.innerHTML = "<p>Debe iniciar sesión en la página principal para ver sus recetas guardadas.</p>";
        console.warn("No hay usuarioActivo en localStorage");
        return;
    }

    const clave = "misRecetas_" + usuario;
    let guardadas = JSON.parse(localStorage.getItem(clave)) || [];

    if (guardadas.length === 0) {
        contenedor.innerHTML = "<p>No tienes recetas guardadas aún.</p>";
        return;
    }

    contenedor.innerHTML = "";

    guardadas.forEach(r => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-receta");
        tarjeta.innerHTML = `
            <div class="imagen-receta" style="background-image:url('${r.strMealThumb}')"></div>
            <div class="cuerpo-receta">
                <h3 class="titulo">${r.strMeal}</h3>
            </div>
            <div class="acciones-tarjeta">
                <button class="btn btn-eliminar" data-id="${r.idMeal}">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    // Eliminar receta específica
    contenedor.addEventListener("click", e => {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;
            guardadas = guardadas.filter(r => r.idMeal != id);
            localStorage.setItem(clave, JSON.stringify(guardadas));
            e.target.closest(".tarjeta-receta").remove();

            if (guardadas.length === 0) {
                contenedor.innerHTML = "<p>No tienes recetas guardadas aún.</p>";
            }
        }
    });
});
