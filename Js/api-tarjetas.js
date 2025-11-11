// === Configuración inicial ===
const contenedorTarjetas = document.querySelector('.tarjetas');
const botonVerMas = document.getElementById('verMas');

let pagina = 0;
const recetasPorPagina = 6;
let recetas = [];

// === Cargar recetas desde la API ===
async function cargarRecetas() {
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

// === Mostrar recetas en tarjetas ===
function mostrarRecetas() {
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
            <button class="btn">Guardar</button>
        </div>
        `;
        contenedorTarjetas.appendChild(tarjeta);
    });

    pagina++;
    if (pagina * recetasPorPagina >= recetas.length) {
        botonVerMas.style.display = 'none';
    }

    activarBotones();
}


// === Mostrar detalle en un modal ===
async function mostrarDetalle(id) {
    // Evita abrir más de un modal
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

        // Cierre del modal
        document.querySelector('.cerrar-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => { 
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
            });
            document.querySelector('.cerrar-modal').addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
    } catch (error) {
        console.error('Error al mostrar detalle de receta:', error);
    }
    }


// === Activar botones “Guardar” y “Ver receta” ===
function activarBotones() {
    // Ver receta
    document.querySelectorAll('.ver-receta').forEach(enlace => {
        enlace.addEventListener('click', e => {
        e.preventDefault();
        mostrarDetalle(enlace.dataset.id);
        });
    });

    // Guardar receta
    document.querySelectorAll('.tarjeta-receta .btn').forEach(boton => {
        boton.addEventListener('click', () => {
        const guardado = boton.dataset.guardado === '1';
        boton.dataset.guardado = guardado ? '0' : '1';
        boton.textContent = guardado ? 'Guardar' : 'Guardado ✓';
        boton.classList.toggle('primario', !guardado);
        });
    });
}


// === Cargar más recetas ===
botonVerMas.addEventListener('click', mostrarRecetas);

// === Inicializar página ===
cargarRecetas();

// === GESTIÓN DE SESIÓN ===
// refs del menú
const menuUsuario = document.getElementById('menuUsuario');
const opcionLogin = document.getElementById('opcionLogin');
const opcionRegistro = document.getElementById('opcionRegistro');

// refs del modal de login
const modalLogin = document.getElementById('modalLogin');
const cerrarLogin = document.querySelector('.cerrar-login');
const formLogin = document.getElementById('formLogin');

// helper: abrir/cerrar modal login
function abrirModalLogin() {
    if (!modalLogin) return;
    modalLogin.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
}
function cerrarModalLogin() {
    if (!modalLogin) return;
    modalLogin.classList.add('oculto');
    document.body.style.overflow = 'auto';
}
