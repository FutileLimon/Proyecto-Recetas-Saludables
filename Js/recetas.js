// =============== RECETAS LOCAL STORAGE + VALIDACIÓN ==========

// Contenedor donde se mostrarán las tarjetas
const contenedorTarjetas = document.querySelector('.tarjetas');

// Capturar formulario y campo email
const formulario = document.getElementById("form-contacto");
const emailInput = document.getElementById("Email");

// ======= Función: actualizar el input email según la sesión =======
function actualizarEmailFormulario() {
    // Si no existe el input (página sin formulario), salimos
    if (!emailInput) return;

    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (usuarioActivo) {
        emailInput.value = usuarioActivo;   // Rellenar email
        emailInput.readOnly = true;         // No editable
        // clase visual opcional si quieres que se vea distinto
        emailInput.classList.add("bg-light");
    } else {
        emailInput.value = "Debe iniciar sesión";
        emailInput.readOnly = true;         // También bloqueado sin sesión
        emailInput.classList.add("bg-light");
    }
}

// ======= Ejecutar al cargar el DOM =======
document.addEventListener("DOMContentLoaded", () => {
    actualizarEmailFormulario();
    mostrarRecetasGuardadas();
});

// =============== GUARDAR RECETA ==============================

// Solo si el formulario existe conectamos el listener
if (formulario) {
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuarioActivo = localStorage.getItem("usuarioActivo");

        // Bloqueo si no hay sesión
        if (!usuarioActivo) {
            alert("Debes iniciar sesión para subir una receta.");
            return;
        }

        const nombre = document.getElementById("input_nombre") ? document.getElementById("input_nombre").value : "";
        const email = usuarioActivo;  // SIEMPRE el correo de la sesión
        const asunto = document.getElementById("asunto") ? document.getElementById("asunto").value : "";
        const mensaje = document.getElementById("mensaje") ? document.getElementById("mensaje").value : "";

        // Validación básica (evitar entradas vacías)
        if (!nombre.trim() || !mensaje.trim()) {
            alert("Debes completar al menos el nombre del plato y la receta.");
            return;
        }

        const nuevaReceta = {
            nombre: nombre.trim(),
            email,
            asunto,
            mensaje: mensaje.trim(),
            fecha: new Date().toLocaleString()
        };

        let recetasGuardadas = JSON.parse(localStorage.getItem("recetas_user")) || [];
        recetasGuardadas.push(nuevaReceta);

        localStorage.setItem("recetas_user", JSON.stringify(recetasGuardadas));

        mostrarRecetasGuardadas();
        formulario.reset();
        actualizarEmailFormulario(); // Reponer email bloqueado tras reset
    });
}

// =============== MOSTRAR TARJETAS ============================

function mostrarRecetasGuardadas() {
    const recetas = JSON.parse(localStorage.getItem("recetas_user")) || [];

    // Si no existe el contenedor, no hacemos nada
    if (!contenedorTarjetas) return;

    // limpiar tarjetas
    contenedorTarjetas.innerHTML = "";

    recetas.forEach((receta, index) => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');

        // Construimos la parte del botón eliminar solo si el usuario activo coincide
        const usuarioActivo = localStorage.getItem("usuarioActivo");
        const botonEliminarHTML = (usuarioActivo && usuarioActivo === receta.email)
            ? `<button class="btn btn-danger eliminar-btn" data-index="${index}">Eliminar</button>`
            : ``;

        tarjeta.innerHTML = `
            <div class="imagen-receta" 
                 style="background-image:url('https://cdn-icons-png.flaticon.com/512/1046/1046784.png'); background-size:cover;">
            </div>

            <div class="cuerpo-receta">
                <span class="subtitulo">${receta.asunto}</span>
                <h3 class="titulo">${receta.nombre}</h3>
                <p class="preview">${receta.mensaje.substring(0, 80)}...</p>
            </div>

            <div class="acciones-tarjeta">
                <a class="enlace ver-receta" data-index="${index}" href="#">Ver receta</a>
                <button class="btn guardar-btn">Guardado ✓</button>
                ${botonEliminarHTML}
            </div>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });

    activarBotonesUser();
}
// =============== ACTIVAR BOTONES =============================

function activarBotonesUser() {
    // Ver detalles
    document.querySelectorAll('.ver-receta').forEach(btn => {
        // prevenir doble registro si se re-ejecuta
        btn.replaceWith(btn.cloneNode(true));
    });
    // Re-bind después de clonar para evitar listeners duplicados
    document.querySelectorAll('.ver-receta').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();

            const index = btn.dataset.index;
            const recetas = JSON.parse(localStorage.getItem("recetas_user")) || [];
            const receta = recetas[index];

            if (!receta) {
                alert("Receta no encontrada.");
                return;
            }

            mostrarDetalleUser(receta);
        });
    });

    // Eliminar receta (solo si es dueño) — primero clonamos para evitar múltiples listeners
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            const usuarioActivo = localStorage.getItem("usuarioActivo");

            let recetas = JSON.parse(localStorage.getItem("recetas_user")) || [];
            const receta = recetas[index];

            if (!receta) {
                alert("Receta no encontrada.");
                return;
            }

            // Validación: solo el autor puede borrar
            if (receta.email !== usuarioActivo) {
                alert("Solo puedes eliminar tus propias recetas.");
                return;
            }

            // Confirmación opcional
            const confirmar = confirm("¿Seguro quieres eliminar esta receta?");
            if (!confirmar) return;

            recetas.splice(index, 1);
            localStorage.setItem("recetas_user", JSON.stringify(recetas));

            mostrarRecetasGuardadas();
        });
    });
}

// =============== MODAL DETALLE ===============================

function mostrarDetalleUser(receta) {
    // Si ya hay un modal abierto → no abrir otro
    if (document.querySelector('.modal')) return;

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
    <div class="contenido-modal">
        <button class="cerrar-modal">×</button>

        <h2>${receta.nombre}</h2>

        <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" 
             alt="${receta.nombre}" 
             style="width:100%; border-radius:10px;">

        <h4>Categoría</h4>
        <p>${receta.asunto}</p>

        <h4>Descripción de la receta</h4>
        <p>${receta.mensaje}</p>

        <h4>Correo asociado</h4>
        <p>${receta.email}</p>

        <h4>Fecha subida</h4>
        <p>${receta.fecha}</p>
    </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Cerrar con X
    const cerrarBtn = modal.querySelector('.cerrar-modal');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
    }

    // Cerrar clickeando afuera
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}
