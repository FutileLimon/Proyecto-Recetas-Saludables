// === Configuración inicial ===
const contenedorTarjetas = document.querySelector('.tarjetas');
const botonVerMas = document.getElementById('verMas');

let pagina = 0;
const recetasPorPagina = 6;
let recetas = [];

// === Cargar recetas desde la API ===
async function cargarRecetas() {
    if (!contenedorTarjetas) return; // por si este JS se carga en otra página

    try {
        const respuesta = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian');
        const datos = await respuesta.json();
        recetas = datos.meals;
        mostrarRecetas();
    } 
    catch (error) {
        console.error('Error al cargar recetas:', error);
    }
}

// Mostrar recetas en tarjetas 
function mostrarRecetas() {
    if (!contenedorTarjetas) return;

    const inicio = pagina * recetasPorPagina;
    const fin = inicio + recetasPorPagina;
    const recetasAMostrar = recetas.slice(inicio, fin);

    recetasAMostrar.forEach(receta => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
        <div class="imagen-receta" style="background-image:url('${receta.strMealThumb}')"></div>
        <div class="cuerpo-receta">
            <span class="subtitulo">Tendencia</span>
            <h3 class="titulo">${receta.strMeal}</h3>
        </div>
        <div class="acciones-tarjeta">
            <a class="enlace ver-receta" data-id="${receta.idMeal}" href="#">Ver receta</a>
            <button class="btn btn-guardar" data-id="${receta.idMeal}">Guardar</button>
        </div>
        `;
        contenedorTarjetas.appendChild(tarjeta);
    });

    pagina++;
    if (botonVerMas && pagina * recetasPorPagina >= recetas.length) {
        botonVerMas.style.display = 'none';
    }

    activarBotones();
}

// Mostrar detalle en un modal 
async function mostrarDetalle(id) {
    if (document.querySelector('.modal')) return;

    try {
        const respuesta = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const datos = await respuesta.json();
        const receta = datos.meals[0];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="contenido-modal">
            <button class="cerrar-modal">×</button>
            <h2>${receta.strMeal}</h2>
            <img src="${receta.strMealThumb}" alt="${receta.strMeal}">
            <h4>Instrucciones</h4>
            <p>${receta.strInstructions}</p>
        </div>
        `;
        document.body.style.overflow = 'hidden';
        document.body.appendChild(modal);

        const btnCerrar = modal.querySelector('.cerrar-modal');
        btnCerrar.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', e => { 
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    } catch (error) {
        console.error('Error al mostrar detalle de receta:', error);
    }
}

// Guardar receta para el usuario activo
function guardarReceta(id, boton) {
    const usuario = (localStorage.getItem("usuarioActivo") || "").trim();

    if (!usuario) {
        alert("Debes iniciar sesión para guardar recetas.");
        return;
    }

    const clave = "misRecetas_" + usuario;
    let guardadas = JSON.parse(localStorage.getItem(clave)) || [];

    const receta = recetas.find(r => r.idMeal == id);
    if (!receta) {
        console.warn("No encontré la receta en el arreglo original:", id);
        return;
    }

    if (guardadas.some(r => r.idMeal == id)) {
        boton.textContent = "Guardado ✓";
        return;
    }

    guardadas.push(receta);
    localStorage.setItem(clave, JSON.stringify(guardadas));

    boton.textContent = "Guardado ✓";
    boton.classList.add("guardado-exito");
    console.log("Recetas guardadas para", usuario, guardadas);
}

// Activar botones “Guardar” y “Ver receta” 
function activarBotones() {
    // Ver receta
    document.querySelectorAll('.ver-receta').forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            const id = enlace.dataset.id;
            mostrarDetalle(id);
        });
    });

    // Guardar receta
    document.querySelectorAll('.btn-guardar').forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
            guardarReceta(id, boton);
        });
    });
}

// Cargar más recetas 
if (botonVerMas) {
    botonVerMas.addEventListener('click', mostrarRecetas);
}

async function mostrarDetalle(id) {
    if (document.querySelector('.modal-personalizado.activo')) return;

    try {
        const respuesta = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const datos = await respuesta.json();
        const receta = datos.meals[0];

        // Crear modal reutilizando estilo existente
        const modal = document.createElement("div");
        modal.className = "modal-personalizado activo";

        modal.innerHTML = `
            <div class="contenido-modal modal-receta">
                <button class="cerrar-modal cerrarReceta">&times;</button>

                <h2>${receta.strMeal}</h2>

                <img src="${receta.strMealThumb}" alt="${receta.strMeal}" class="img-detalle">

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

        // Cerrar modal
        modal.addEventListener("click", e => {
            if (e.target.classList.contains("cerrarReceta") || e.target === modal) {
                modal.remove();
                document.body.style.overflow = "auto";
            }
        });

    } catch (error) {
        console.error("Error mostrando receta:", error);
    }
}



// Inicializar página 
cargarRecetas();
