const contenedor = document.querySelector(".tarjetas");

// Obtener usuario actual
const usuario = localStorage.getItem("usuarioActivo");

// Si no hay usuario → no mostrar nada
if (!usuario) {
    contenedor.innerHTML = "<p>Debe iniciar sesión para ver sus recetas guardadas.</p>";
    throw "No hay usuario logueado";
}

// Nombre del repositorio del usuario
const clave = "misRecetas_" + usuario;

// Cargar recetas guardadas por ese usuario
let guardadas = JSON.parse(localStorage.getItem(clave)) || [];

if (guardadas.length === 0) {
    contenedor.innerHTML = "<p>No tienes recetas guardadas aún.</p>";
} else {
    guardadas.forEach(r => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-receta");
        tarjeta.innerHTML = `
            <div class="imagen-receta" style="background-image:url('${r.strMealThumb}')"></div>
            <div class="cuerpo-receta">
                <h3 class="titulo">${r.strMeal}</h3>
            </div>
            <div class="acciones-tarjeta">
                <button class="btn-eliminar" data-id="${r.idMeal}">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Eliminar receta específica
document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-eliminar")) {
        const id = e.target.dataset.id;
        guardadas = guardadas.filter(r => r.idMeal != id);
        localStorage.setItem(clave, JSON.stringify(guardadas));
        e.target.closest(".tarjeta-receta").remove();
    }
});