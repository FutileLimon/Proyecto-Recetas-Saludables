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
// Elementos del menú
const menuUsuario = document.getElementById('menuUsuario');
const opcionLogin = document.getElementById('opcionLogin');
const opcionRegistro = document.getElementById('opcionRegistro');

// Verificar si ya hay sesión activa al cargar
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuario) {
        actualizarMenuSesion(usuario.correo);
    }
});

// Mostrar modal de login cuando se hace clic en "Iniciar sesión"
if (opcionLogin) {
    opcionLogin.addEventListener('click', (e) => {
        e.preventDefault();
        modalLogin.classList.remove('oculto');
    });
}

// Cerrar modal login
cerrarLogin.addEventListener('click', () => modalLogin.classList.add('oculto'));
modalLogin.addEventListener('click', (e) => {
    if (e.target === modalLogin) modalLogin.classList.add('oculto');
});

// Guardar usuario al iniciar sesión
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = document.getElementById('correoLogin').value;
    const clave = document.getElementById('claveLogin').value;

    // Guardar datos simulando una sesión
    localStorage.setItem('usuarioActivo', JSON.stringify({ correo, clave }));

    // Actualizar el menú
    actualizarMenuSesion(correo);

    modalLogin.classList.add('oculto');
    alert(`✅ Bienvenido ${correo}`);
});

// === Función para actualizar el menú después de iniciar sesión ===
function actualizarMenuSesion(correo) {
    menuUsuario.innerHTML = `
        <li><span class="dropdown-item correo-usuario">${correo}</span></li>
        <li><a class="dropdown-item" id="opcionMisRecetas" href="#">Mis Recetas</a></li>
        <li><a class="dropdown-item" id="opcionCerrarSesion" href="#">Cerrar sesión</a></li>
    `;

    // Asignar funcionalidad a las nuevas opciones
    document.getElementById('opcionCerrarSesion').addEventListener('click', cerrarSesion);
    document.getElementById('opcionMisRecetas').addEventListener('click', verMisRecetas);
}

// === Cerrar sesión ===
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    alert('👋 Sesión cerrada');
    location.reload(); // recarga para restaurar el menú original
}

// === Ver mis recetas (de momento, solo ejemplo) ===
function verMisRecetas() {
    alert('🍽 Aquí aparecerán tus recetas guardadas.');
}


