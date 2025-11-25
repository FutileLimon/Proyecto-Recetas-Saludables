console.log("✔ mis-recetas.js cargado");

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".tarjetas");
    if (!contenedor) return;

    const usuario = (localStorage.getItem("usuarioActivo") || "").trim();
    if (!usuario) {
        contenedor.innerHTML = "<p>Debe iniciar sesión para ver sus recetas guardadas.</p>";
        mostrarGraficoFavoritos([]);
        return;
    }

    const clave = "misRecetas_" + usuario;
    let guardadas = JSON.parse(localStorage.getItem(clave)) || [];
    console.log("Recetas guardadas:", guardadas);

    if (guardadas.length === 0) {
        contenedor.innerHTML = "<p>No tienes recetas guardadas aún.</p>";
        mostrarGraficoFavoritos([]);
        return;
    }

    contenedor.innerHTML = "";
    guardadas.forEach(r => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
            <div class="imagen-receta" style="background-image:url('${r.strMealThumb}')"></div>
            <div class="cuerpo-receta">
                <span class="subtitulo">${r.strCategory || "Sin categoría"}</span>
                <h3 class="titulo">${r.strMeal}</h3>
            </div>
            <div class="acciones-tarjeta">
                <a class="enlace ver-receta" data-id="${r.idMeal}" href="#">Ver receta</a>
                <button class="btn btn-eliminar" data-id="${r.idMeal}">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    mostrarGraficoFavoritos(guardadas);

    // ELIMINAR RECETA GUARDADA
    contenedor.addEventListener("click", e => {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;

            guardadas = guardadas.filter(r => r.idMeal != id);
            localStorage.setItem(clave, JSON.stringify(guardadas));
            e.target.closest(".tarjeta-receta").remove();
            mostrarGraficoFavoritos(guardadas);

            if (guardadas.length === 0) {
                contenedor.innerHTML = "<p>No tienes recetas guardadas aún.</p>";
            }
        }
    });

    // VER RECETA GUARDADA
    contenedor.addEventListener("click", async (e) => {
        if (e.target.classList.contains("ver-receta")) {
            e.preventDefault();
            const id = e.target.dataset.id;

            // Obtener receta COMPLETA desde API
            const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const datos = await resp.json();
            const receta = datos.meals[0];

            mostrarModalRecetaGuardada(receta);
        }
    });
});


// ======================= GRÁFICO ===========================
function obtenerCategoriasFavoritas(guardadas) {
    const conteo = {};
    guardadas.forEach(r => {
        if (!r.strCategory) return;
        conteo[r.strCategory] = (conteo[r.strCategory] || 0) + 1;
    });
    return conteo;
}

function generarURLGraficoBarras(conteo) {
    const labels = Object.keys(conteo);
    const data = Object.values(conteo);

    if (labels.length === 0) return "";

    const config = {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: "Recetas por categoría",
                data,
                backgroundColor: "#e76f51",
                borderColor: "#000000ff",
                borderWidth: 0.5
            }]
        },
        options: {
            responsive: true,
            mantainAspectRatio: false
        }
    };

    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}`;
}

function mostrarGraficoFavoritos(guardadas) {
    const conteo = obtenerCategoriasFavoritas(guardadas);
    const url = generarURLGraficoBarras(conteo);
    const img = document.getElementById("graficoFavoritos");
    if (!img) return;
    img.src = url || "";
}


// ======================= MODAL DETALLE =======================
function mostrarModalRecetaGuardada(receta) {
    // Evitar doble modal
    if (document.querySelector('.modal-personalizado.activo')) return;

    const modal = document.createElement("div");
    modal.className = "modal-personalizado activo";

    modal.innerHTML = `
        <div class="contenido-modal modal-receta">
            <button class="cerrar-modal cerrarReceta">&times;</button>
            <h2>${receta.strMeal}</h2>
            <img src="${receta.strMealThumb}" class="img-detalle">

            <h3>Categoría</h3>
            <p>${receta.strCategory}</p>

            <h3>Ingredientes</h3>
            <ul class="lista-ingredientes">
                ${Object.keys(receta)
                    .filter(k => k.startsWith("strIngredient") && receta[k])
                    .map(k => `<li>• ${receta[k]}</li>`)
                    .join("")}
            </ul>

            <h3>Preparación</h3>
            <p>${receta.strInstructions}</p>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    modal.addEventListener("click", e => {
        if (e.target.classList.contains("cerrarReceta") || e.target === modal) {
            modal.remove();
            document.body.style.overflow = "auto";
        }
    });
}
