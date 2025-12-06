document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente cargado");


    const fields = document.querySelectorAll(".field");
    const popups = document.querySelectorAll(".popup");

    //DETECTA QUE CONTINENTE LE DAS CLICK
    window.pick = (continent) => {
        alert("Seleccionaste: " + continent);
    };


    fields.forEach(field => {
        field.addEventListener("click", e => {
            popups.forEach(p => p.style.display = "none");

            const popupId = field.dataset.popup;
            const popup = document.getElementById(popupId);

            const rect = field.getBoundingClientRect();
            popup.style.left = rect.left + "px";
            popup.style.top = rect.bottom + 5 + "px";

            popup.style.display = "block";
        });
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".field") && !e.target.closest(".popup")) {
            popups.forEach(p => p.style.display = "none");
        }
    });

    document.querySelectorAll(".popup .option").forEach(opt => {
        opt.addEventListener("click", e => {
            const popup = opt.closest(".popup");
            const fieldId = popup.id.replace("-popup", "");
            const field = [...fields].find(f => f.dataset.popup === popup.id);
            field.querySelector("input").value = opt.textContent;

            popup.style.display = "none";
        });
    });
    

    //Para que las fechas se pongan bien

    document.querySelectorAll(".popup input[type='date']").forEach(dateInput => {
        dateInput.addEventListener("change", e => {
            const popup = dateInput.closest(".popup");
            const field = [...fields].find(f => f.dataset.popup === popup.id);
            
            // Ponemos la fecha seleccionada dentro del campo visible
            field.querySelector("input").value = dateInput.value;

            popup.style.display = "none";
        });
    });


    //Para poder leer los paramétros


    const botonBuscar = document.querySelector(".buscar");

    if(botonBuscar){
        botonBuscar.addEventListener("click", () => {
        const origen  = document.querySelector("[data-popup='origen-popup'] input").value;
        const destino = document.querySelector("[data-popup='destino-popup'] input").value;
        const ida     = document.querySelector("[data-popup='ida-popup'] input").value;
        const vuelta  = document.querySelector("[data-popup='vuelta-popup'] input").value;
        const tipo    = document.querySelector("[data-popup='tipo-popup'] input").value;

        console.log({ origen, destino, ida, vuelta, tipo });
    });


    }

   

 
 
    



    // Obtener todos los packs del carrusel
    const packs = document.querySelectorAll('.pack');
    if (packs) {
        const totalPacks = packs.length;
        console.log("Número de packs encontrados: ", totalPacks);  // Verifica cuántos packs se encuentran

        let indiceActual = 0;
        const intervaloCambioConst = 2000;
        let intervaloCambio;

        // Función para actualizar el carrusel
        function actualizarCarrusel() {
            if (packs[indiceActual]) { // Aseguramos que el índice sea válido
                packs.forEach(pack => pack.classList.remove('active'));
                packs[indiceActual].classList.add('active');
            }
        }

        // Función para mover el carrusel
        function moverCarrusel(direction) {
            indiceActual = (indiceActual + direction + totalPacks) % totalPacks;
            actualizarCarrusel();
        }

        // Función para reiniciar el carrusel
        function reiniciarAuto() {
            clearInterval(intervaloCambio);
            intervaloCambio = setInterval(() => {
                moverCarrusel(1);
            }, intervaloCambioConst);
        }

        // Control de las flechas
        document.querySelectorAll('.flecha').forEach((flecha, index) => {
            flecha.addEventListener('click', () => {
                moverCarrusel(index === 0 ? -1 : 1);
                clearInterval(intervaloCambio);
                setTimeout(reiniciarAuto, intervaloCambioConst);
            });
        });

        // Inicialización del carrusel
        actualizarCarrusel();
        reiniciarAuto();
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

        // Verificar si el usuario está logueado
        if (usuarioLogueado) {
            console.log("Usuario logueado:", usuarioLogueado);  // Verifica que el usuario tiene los datos correctos

            // Cambiar el nombre de usuario
            const nombreUsuario = document.getElementById('nombre-usuario');
            if (nombreUsuario) {
                nombreUsuario.textContent = usuarioLogueado.nombre;  // Asignamos el nombre del usuario logueado
                console.log("Nombre actualizado:", usuarioLogueado.nombre);  // Verifica si se actualizó el nombre
            }

            // Cambiar la foto de perfil
            const fotoPerfil = document.getElementById('foto-perfil');
            if (fotoPerfil) {
                if (usuarioLogueado.foto && usuarioLogueado.foto !== 'sin_imagen') {
                    // Si el usuario tiene una foto en base64, mostrarla
                    fotoPerfil.src = usuarioLogueado.foto;  // Asignamos la imagen en base64
                    console.log("Foto de perfil actualizada:", fotoPerfil.src);  // Verifica si se actualizó la foto
                } else {
                    fotoPerfil.src = 'images/id.png';  // Imagen predeterminada si no tiene foto
                }
            }
        } else {
            console.log("No hay usuario logueado.");
        }
        // ------ Cerrar Sesión ------
        const modalCerrarSesion = document.getElementById('modalCerrarSesion');
        const botonCerrarSesion = document.querySelector('.cerrar-sesion'); // Botón de "Cerrar sesión"
        const confirmarCerrarSesion = document.getElementById('confirmarCerrarSesion');
        const cancelarCerrarSesion = document.getElementById('cancelarCerrarSesion');

        // Mostrar el modal cuando se haga clic en "Cerrar sesión"
        if (botonCerrarSesion) {
            botonCerrarSesion.addEventListener('click', function () {
                modalCerrarSesion.style.display = 'block'; // Mostrar el modal
            });
        }

        // Función para cerrar sesión (eliminar usuarioLogueado de localStorage y redirigir)
        function cerrarSesion() {
            localStorage.removeItem('usuarioLogueado'); // Eliminar datos del usuario logueado
            window.location.href = 'home.html'; // Redirigir a la página de inicio de sesión
        }

        // Si el usuario confirma, cerramos sesión
        if (confirmarCerrarSesion) {
            confirmarCerrarSesion.addEventListener('click', function () {
                cerrarSesion();  // Llamar a la función que cierra la sesión
                modalCerrarSesion.style.display = 'none'; // Cerrar el modal
            });
        }

        // Si el usuario cancela, simplemente cerramos el modal
        if (cancelarCerrarSesion) {
            cancelarCerrarSesion.addEventListener('click', function () {
                modalCerrarSesion.style.display = 'none'; // Cerrar el modal sin hacer nada
            });
        }

        function gestionarProcesoDeCompra() {


            if (document.querySelector('.carrusel')) {
                const botonesComprar = document.querySelectorAll('.comprar-btn');

                botonesComprar.forEach(boton => {
                    boton.addEventListener('click', function (evento) {
                        // Busca el contenedor '.pack' más cercano al botón pulsado
                        const packSeleccionado = evento.target.closest('.pack');

                        // Extrae toda la información del pack seleccionado
                        const datosDelPack = {
                            imagen: packSeleccionado.querySelector('img').src,
                            alt: packSeleccionado.querySelector('img').alt,
                            titulo: packSeleccionado.querySelector('h3').textContent,
                            descripcionCorta: packSeleccionado.querySelector('p').textContent,
                            precio: packSeleccionado.querySelector('.precio').textContent
                        };

                        // Guarda los datos en sessionStorage para usarlos en la otra página
                        sessionStorage.setItem('packSeleccionado', JSON.stringify(datosDelPack));
                    });
                });
            }

        }
        gestionarProcesoDeCompra();
    }
    // Seleccionamos el formulario de consejos como elemento de control.
    const formConsejo = document.getElementById('form-consejo');

    // Si el formulario existe en la página actual, ejecutamos todo el código.
    if (formConsejo) {
        // Seleccionar los demás elementos del DOM
        const tituloInput = document.getElementById('consejo-titulo');
        const descripcionTextarea = document.getElementById('consejo-descripcion');
        const listaConsejosUL = document.querySelector('.lista-consejos');

        // Cargar consejos desde Local Storage 
        let consejos = JSON.parse(localStorage.getItem('consejos')) || [];

        // Función para mostrar los consejos en la página 
        function renderConsejos() {
            listaConsejosUL.innerHTML = ''; // Limpiamos la lista
            const ultimosTresConsejos = consejos.slice(0, 3); // Tomamos solo los 3 más recientes

            ultimosTresConsejos.forEach(consejo => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#'; // Enlace de ejemplo
                a.textContent = consejo.titulo;
                li.appendChild(a);
                listaConsejosUL.appendChild(li);
            });
        }


        formConsejo.addEventListener('submit', function (event) {
            event.preventDefault();
            const titulo = tituloInput.value.trim();
            const descripcion = descripcionTextarea.value.trim();

            // Validar los campos ---
            if (titulo.length < 15) {
                alert('El título debe tener al menos 15 caracteres.');
                return; // Detenemos la ejecución
            }
            if (descripcion.length < 30) {
                alert('La descripción debe tener al menos 30 caracteres.');
                return; // Detenemos la ejecución
            }

            // Si la validación es correcta... ---
            const nuevoConsejo = {
                titulo: titulo,
                descripcion: descripcion
            };

            consejos.unshift(nuevoConsejo); // Añadimos el nuevo consejo AL PRINCIPIO
            localStorage.setItem('consejos', JSON.stringify(consejos)); // Guardamos en Local Storage

            renderConsejos(); // Actualizamos la lista en pantalla
            formConsejo.reset(); // Limpiamos el formulario
        });

        renderConsejos();
    }
    const inicioSesion = document.querySelector(".formulario");
    if (inicioSesion) {

        // ------ Iniciar Sesión ------

        // Función para mostrar el error con un mensaje personalizado
        function mostrarError(mensaje) {
            const errorModal = document.getElementById('errorModal');
            const mensajeElemento = errorModal.querySelector('.modal-content p'); // Localiza el elemento donde se muestra el mensaje

            if (errorModal && mensajeElemento) {
                mensajeElemento.textContent = mensaje; // Establece el mensaje personalizado
                errorModal.style.display = 'block';  // Muestra el modal
            } else {
                console.error("No se encontró el modal de error o el elemento del mensaje");
            }
        }
        // Cerrar modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                const errorModal = document.getElementById('errorModal');
                if (errorModal) {
                    errorModal.style.display = 'none';  // Ocultar el modal cuando se cierra
                }
            });
        } else {
            console.error("No se encontró el botón de cierre del modal");
        }

        // Manejar evento de clic en el botón de inicio de sesión
        const botonIniciarSesion = document.getElementById('iniciosesion');
        if (botonIniciarSesion) {
            botonIniciarSesion.addEventListener('click', function (event) {
                event.preventDefault();  // Prevenir el comportamiento predeterminado (enviar formulario)

                const inputUsuario = document.getElementById('usuario').value;
                const inputContraseña = document.getElementById('contraseña').value;

                // Recuperar los usuarios guardados en localStorage
                let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                // Buscar el usuario y contraseña en el array de usuarios
                const usuarioEncontrado = usuarios.find(usuario => usuario.usuario === inputUsuario && usuario.contraseña === inputContraseña);

                if (usuarioEncontrado) {
                    let usuarioLogueado = usuarioEncontrado;
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
                    // Si los datos son correctos, redirigir al usuario
                    window.location.href = 'b.html';  // Redirigir a la página principal
                } else {
                    mostrarError("Error: Usuario o contraseña incorrectos");
                }
            });

        } else {
            console.error("No se encontró el botón de inicio de sesión");
        }

    }

    const formularioRegistro = document.querySelector(".formulario-registro");
    if (formularioRegistro) {
        // Checkbox
        const politicaCheckbox = document.getElementById('politica');  // Checkbox
        const botonSubmit = document.getElementById('guardar_datos');  // Botón

        // Función para habilitar o deshabilitar el botón de submit
        function toggleSubmitButton() {
            if (politicaCheckbox.checked && validarFormulario()) {
                botonSubmit.disabled = false;  // Habilitar el botón si el checkbox está marcado y el formulario es válido
            } else {
                botonSubmit.disabled = true;
                console.log("Algo ha fallado de campos"); // Deshabilitar el botón si el checkbox no está marcado o el formulario no es válido
            }
        }

        // Escuchar el cambio en el checkbox
        politicaCheckbox.addEventListener('change', toggleSubmitButton);
        toggleSubmitButton();

        const fechaInput = document.getElementById('fecha_registro');

        // Obtener la fecha actual en formato 'yyyy-mm-dd'
        const fechaActual = new Date();
        const fechaHoy = fechaActual.toISOString().split('T')[0];  // 'yyyy-mm-dd'

        // Función para validar fecha
        function validarFecha() {
            fechaInput.addEventListener('input', function () {
                const fechaSeleccionada = fechaInput.value;
                const fechaSeleccionadaDate = new Date(fechaSeleccionada);

                // Calcular la edad
                const edad = fechaActual.getFullYear() - fechaSeleccionadaDate.getFullYear();
                const mes = fechaActual.getMonth() - fechaSeleccionadaDate.getMonth();
                const dia = fechaActual.getDate() - fechaSeleccionadaDate.getDate();

                // Comparar si la fecha seleccionada es anterior a la fecha de hoy
                if (fechaSeleccionada < fechaHoy) {
                    console.log("Fecha seleccionada: " + fechaSeleccionada + " es anterior a hoy.");
                    if (edad >= 16 && edad <= 120) {
                        console.log("Fecha introducida correctamente");
                    } else {
                        alert("La edad debe estar entre 16 y 120 años.");
                        fechaInput.value = "";  // Vaciar el campo de fecha
                        fechaInput.focus();
                    }
                } else if (fechaSeleccionada === fechaHoy) {
                    console.log("Fecha seleccionada: " + fechaSeleccionada + " es igual a hoy.");
                    alert("La fecha debe ser anterior a la actual");
                    fechaInput.value = "";  // Vaciar el campo de fecha
                    fechaInput.focus();
                } else {
                    console.log("Fecha seleccionada: " + fechaSeleccionada + " es posterior a hoy.");
                    alert("La fecha debe ser anterior a la actual");
                    fechaInput.value = "";  // Vaciar el campo de fecha
                    fechaInput.focus();
                }

                console.log("Fecha hoy:", fechaHoy);
            });
        };
        validarFecha();

        // Función para validar correos
        const correo = document.getElementById('correo_registro');
        const correoComprobar = document.getElementById('confirmar_correo_registro');

        function comprobarCorreo() {
            if (correo.value !== correoComprobar.value) {
                alert("Los correos deben coincidir.");
            } else {
                console.log("Correo valido");
            }
        }

        // Solo comprobar cuando el usuario ha terminado de escribir en el campo de confirmación
        correoComprobar.addEventListener('blur', comprobarCorreo);

        // Función para validar el formulario
        function validarFormulario() {
            const campos = [
                'nombre_registro', 'apellidos_registro', 'correo_registro',
                'confirmar_correo_registro', 'fecha_registro', 'usuario_registro', 'contraseña_registro', 'foto_registro'
            ];

            let esValido = true;

            // Verificar si todos los campos obligatorios tienen valor y cumplen con los patrones
            for (let id of campos) {
                const input = document.getElementById(id);
                if (!input.checkValidity()) {  // Verifica si el campo es válido según su patrón
                    esValido = false;
                    console.log("Algun campo no esta bien");
                    break;  // Salir del bucle si algún campo no es válido
                }
            }

            console.log("Campos de relleno validos");

            // Verificar que el correo y confirmar correo coincidan
            if (!comprobarCorreo) {
                esValido = false;
                console.log("Correo mal");
            }
            else {
                esValido = true;
            }

            return esValido;  // Devuelve verdadero si todos los campos son válidos, sino falso
        }

        // Función para guardar los datos del registro
        function guardarDatosRegistro() {
            const datosFormulario = {
                nombre: document.getElementById('nombre_registro').value,
                apellidos: document.getElementById('apellidos_registro').value,
                correo: document.getElementById('correo_registro').value,
                fecha: document.getElementById('fecha_registro').value,
                usuario: document.getElementById('usuario_registro').value,
                contraseña: document.getElementById('contraseña_registro').value,
                foto: document.getElementById('foto_registro').files[0] ? document.getElementById('foto_registro').files[0] : null
            };

            if (datosFormulario.foto) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    // Guardamos la imagen en base64
                    datosFormulario.foto = reader.result;  // Aquí la imagen se convierte a base64

                    // Guardar los datos en localStorage
                    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                    // Verificar si el usuario ya existe
                    const usuarioExistente = usuarios.find(usuario => usuario.usuario === datosFormulario.usuario);

                    if (usuarioExistente) {
                        // Si el usuario ya existe, mostrar un mensaje y no guardar el usuario
                        alert("El nombre de usuario ya está registrado.");
                        return;  // No continuar con el registro
                    }

                    // Añadir el nuevo usuario al array
                    usuarios.push(datosFormulario);

                    // Guardar el array actualizado de usuarios en localStorage
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    localStorage.setItem('usuarioLogueado', JSON.stringify(datosFormulario)); // Guardar datos del usuario logueado

                    // Mostrar mensaje de éxito
                    alert("Datos guardados correctamente. ¡Bienvenido!");
                    window.location.href = 'b.html';  // Redirigir a la página de éxito
                }

                // Leer la imagen y convertirla a base64
                reader.readAsDataURL(datosFormulario.foto);
            } else {
                // Si no se ha subido una foto, asignamos una predeterminada
                datosFormulario.foto = 'images/default-avatar.png'; // Imagen por defecto
                // Guardar los datos del usuario
                let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                usuarios.push(datosFormulario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                localStorage.setItem('usuarioLogueado', JSON.stringify(datosFormulario));
                alert("Datos guardados correctamente. ¡Bienvenido!");
                window.location.href = 'b.html';  // Redirigir a la página de éxito
            }
        }

        // Manejar el evento submit
        const formulario = document.getElementById('formulario-registro');
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevenir el comportamiento predeterminado de envío del formulario

            if (validarFormulario()) {
                guardarDatosRegistro();  // Guardar los datos si el formulario es válido
                console.log("Datos guardados correctamente.");
            } else {
                alert("Por favor, completa todos los campos correctamente.");
            }
        });


    }

    const panelCompra = document.querySelector(".panel");
    if (panelCompra) {
        // Cargar datos del pack seleccionado 
        const datosGuardados = sessionStorage.getItem('packSeleccionado');
        if (datosGuardados) {
            const datosDelPack = JSON.parse(datosGuardados);
            const descripcionesLargas = {
                "Pack Andes": "Embárcate en una aventura inolvidable a través de la majestuosa cordillera de los Andes...",
                "Pack Amazonas": "Sumérgete en el corazón de la selva más grande del mundo...",
                "Pack Islandia": "Descubre la tierra de hielo y fuego..."
            };
            const packCard = document.querySelector('.pack-card .pack');
            const descripcionPack = document.querySelector('.pack-desc p');
            if (packCard && descripcionPack) {
                packCard.querySelector('img').src = datosDelPack.imagen;
                packCard.querySelector('img').alt = datosDelPack.alt;
                packCard.querySelector('h3').textContent = datosDelPack.titulo;
                packCard.querySelector('p').textContent = datosDelPack.descripcionCorta;
                packCard.querySelector('.precio').textContent = datosDelPack.precio;
                descripcionPack.textContent = descripcionesLargas[datosDelPack.titulo] || "Descripción detallada no disponible.";
            }
        }

        // Lógica de validación del formulario 
        const formularioCompra = document.getElementById('formulario-compra');
        const botonCompra = document.getElementById('boton-comprar');
        const campos = [
            'nombre-comprar', 'correo-compra', 'tipo-tarjeta',
            'numero-tarjeta', 'nombre-titular', 'fecha-expiracion', 'cvv'
        ];
        const inputs = campos.map(id => document.getElementById(id));
        // Función para validar todo el formulario
        function validarFormularioCompra() {
            for (const input of inputs) {
                if (!input || !input.checkValidity()) return false;
            }
            const fechaInput = document.getElementById('fecha-expiracion');
            if (fechaInput.value && !validarFechaExpiracion(fechaInput.value)) {
                return false;
            }
            return true;
        }
        // Validar que la fecha de expiración no esté caducada
        function validarFechaExpiracion(fechaString) {
            if (!fechaString) return false;
            const [anioExp, mesExp] = fechaString.split('-').map(Number);
            const fechaActual = new Date();
            const anioActual = fechaActual.getFullYear();
            const mesActual = fechaActual.getMonth() + 1;
            return anioExp > anioActual || (anioExp === anioActual && mesExp >= mesActual);
        }
        // Habilitar o deshabilitar el botón de compra
        function actualizarEstadoBoton() {
            if (validarFormularioCompra()) {
                botonCompra.classList.remove('btn-deshabilitado');
            } else {
                botonCompra.classList.add('btn-deshabilitado');
            }
        }
        // Escuchar cambios en los campos del formulario
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', actualizarEstadoBoton);
            }
        });

        // Gestiona el clic aunque el botón parezca deshabilitado 
        formularioCompra.addEventListener('submit', function (event) {
            event.preventDefault(); // Siempre prevenimos el envío para tener control

            if (validarFormularioCompra()) {
                alert('¡Compra realizada con éxito!');
                formularioCompra.reset();
                actualizarEstadoBoton();
            } else {
                // Si no es válido, comprobamos la causa
                const fechaInput = document.getElementById('fecha-expiracion');

                // Causa 1: ¿El error específico es la tarjeta caducada?
                if (fechaInput.value && !validarFechaExpiracion(fechaInput.value)) {
                    alert('La fecha de expiración no es válida. La tarjeta puede estar caducada.');
                }
                // Causa 2 (cualquier otro error): Pedimos al navegador que muestre los errores
                else {
                    formularioCompra.reportValidity();
                }
            }
        });

        // Estado inicial del botón al cargar la página
        actualizarEstadoBoton();
    }

    //Usuario logeado en counidad

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado) {

        // Nombre
        const nombreComunidad = document.getElementById('nombre-usuario-comunidad');
        if (nombreComunidad) nombreComunidad.textContent = usuarioLogueado.nombre;

        // Foto de perfil
        const fotoComunidad = document.getElementById('foto-perfil-comunidad');
        if (fotoComunidad) {
            if (usuarioLogueado.foto && usuarioLogueado.foto !== "sin_imagen") {
                fotoComunidad.src = usuarioLogueado.foto;
            } else {
                fotoComunidad.src = "images/id.png"; // fallback
            }
        }
    }



    // POPUP para contactar

    const contactButtons = document.querySelectorAll(".post button");
    const miniPopup = document.querySelector(".mini-popup");
    const miniClose = document.getElementById("mini-close");
    const miniSend = document.getElementById("mini-send");

    if (contactButtons.length && miniPopup) {
        contactButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                miniPopup.style.display = "block";
            });
        });
    }

    if (miniClose && miniPopup) {
        miniClose.addEventListener("click", () => {
            miniPopup.style.display = "none";
        });
    }

    if (miniSend && miniPopup) {
        miniSend.addEventListener("click", () => {
            const textarea = miniPopup.querySelector("textarea");
            alert("Mensaje enviado (simulado)");
            if (textarea) textarea.value = "";
            miniPopup.style.display = "none";
        });
    }

    // --- MODO SIN IMÁGENES (home.html, resto páginas) ---
    const toggleImagesBtn = document.getElementById("toggle-images");

    if (toggleImagesBtn) {
        toggleImagesBtn.addEventListener("click", () => {
            document.body.classList.toggle("low-data");

            toggleImagesBtn.textContent = document.body.classList.contains("low-data")
                ? "Modo con imágenes"
                : "Modo sin imágenes";
        });
    }






    // --- FAVORITOS CON CORAZÓN --- //
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(btn => {
        const card = btn.closest('.tarjeta-experiencia');
        if (!card) return;

        const titulo = card.querySelector('h3')?.textContent || "";
        const imagen = card.querySelector('img')?.src || "";

        // Al cargar, marcar los que ya están en favoritos
        const yaExiste = favoritos.some(f => f.titulo === titulo && f.imagen === imagen);
        if (yaExiste) {
            btn.textContent = '❤';
            btn.classList.add('activo');
        } else {
            btn.textContent = '♡';
            btn.classList.remove('activo');
        }

        btn.addEventListener('click', () => {
            let favoritosActuales = JSON.parse(localStorage.getItem('favoritos')) || [];
            const index = favoritosActuales.findIndex(f => f.titulo === titulo && f.imagen === imagen);

            if (index === -1) {
                // Añadir a favoritos
                favoritosActuales.push({ titulo, imagen });
                btn.textContent = '❤';
                btn.classList.add('activo');
            } else {
                // Quitar de favoritos
                favoritosActuales.splice(index, 1);
                btn.textContent = '♡';
                btn.classList.remove('activo');
            }

            localStorage.setItem('favoritos', JSON.stringify(favoritosActuales));
        });
    });







});
