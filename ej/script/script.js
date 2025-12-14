document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente cargado");


    const fields = document.querySelectorAll(".field");
    const popups = document.querySelectorAll(".popup");

    //DETECTA QUE CONTINENTE LE DAS CLICK
    window.pick = (continent) => {
        alert("Seleccionaste: " + continent);
        window.location.href = `pagina_viajes_personalizados.html?continent=${encodeURIComponent(continent)}`;
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
        opt.addEventListener("click", () => {
            const popup = opt.closest(".popup");
            const field = [...fields].find(f => f.dataset.popup === popup.id);

            field.querySelector("input").value = opt.textContent;

            popup.style.display = "none";

            
            if (window.validarBusqueda) window.validarBusqueda();
        });
    });
    

    //Para que las fechas se pongan bien

    document.querySelectorAll(".popup input[type='date']").forEach(dateInput => {
        dateInput.addEventListener("change", () => {
            const popup = dateInput.closest(".popup");
            const field = [...fields].find(f => f.dataset.popup === popup.id);
            const inputVisible = field.querySelector("input");

            inputVisible.value = dateInput.value;
            popup.style.display = "none";


            const idaInput = document.querySelector("[data-popup='ida-popup'] input");
            const vueltaInput = document.querySelector("[data-popup='vuelta-popup'] input");

            if (idaInput.value && vueltaInput.value) {
                const fechaIda = new Date(idaInput.value);
                const fechaVuelta = new Date(vueltaInput.value);

                if (fechaVuelta < fechaIda) {
                    alert("La fecha de vuelta no puede ser anterior a la fecha de ida.");

                    
                    vueltaInput.value = "";
                    document.querySelector("#vuelta-date").value = "";

                    if (window.validarBusqueda) window.validarBusqueda();
                    return;
                }
            }

           
            if (window.validarBusqueda) window.validarBusqueda();
        });
    });


    //Para poder leer los paramétros


    const botonBuscar = document.querySelector(".buscar");

    const camposBusqueda = [
        document.querySelector("[data-popup='origen-popup'] input"),
        document.querySelector("[data-popup='destino-popup'] input"),
        document.querySelector("[data-popup='ida-popup'] input"),
        document.querySelector("[data-popup='vuelta-popup'] input"),
        document.querySelector("[data-popup='tipo-popup'] input")
    ];

    if (botonBuscar) {

        // Estado inicial
        botonBuscar.disabled = true;
        botonBuscar.classList.add("btn-deshabilitado");

        // Función global de validación
        function validarBusqueda() {
            const todoRelleno = camposBusqueda.every(
                input => input && input.value.trim() !== ""
            );

            botonBuscar.disabled = !todoRelleno;
            botonBuscar.classList.toggle("btn-deshabilitado", !todoRelleno);
        }

        // Exponemos la función para usarla desde otros sitios
        window.validarBusqueda = validarBusqueda;

        //Comprobamos que este iniciada la sesion

        botonBuscar.addEventListener("click", (e) => {

            const usuarioLogueado = localStorage.getItem("usuarioLogueado");

            if (!usuarioLogueado) {
                e.preventDefault();
                window.location.href = "a.html";
                return;
            }

            const origen  = camposBusqueda[0].value;
            const destino = camposBusqueda[1].value;
            const ida     = camposBusqueda[2].value;
            const vuelta  = camposBusqueda[3].value;
            const tipo    = camposBusqueda[4].value;

            if (!origen || !destino || !ida || !vuelta || !tipo) {
                alert("Por favor, rellena todos los campos antes de buscar.");
                return;
            }

            sessionStorage.setItem("busqueda", JSON.stringify({
                origen,
                destino,
                ida,
                vuelta,
                tipo
            }));

            window.location.href = "formulario_compra.html";
        });
    }

    //lo almacena

    


   

 
 
    



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
        // ------ Cerrar Sesión SIMPLE (sin modal) ------
        const botonCerrarSesion = document.querySelector('.cerrar-sesion');

        if (botonCerrarSesion) {
            botonCerrarSesion.addEventListener('click', () => {
                localStorage.removeItem('usuarioLogueado'); // quitar sesión
                window.location.href = 'home.html';         // volver al home normal
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
                    window.location.href = 'usuario_registrado.html';  // Redirigir a la página principal
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
                    window.location.href = 'usuario_registrado.html';  // Redirigir a la página de éxito
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
                window.location.href = 'usuario_registrado.html';  // Redirigir a la página de éxito
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


        //home nuevo --> Comprueba si estas iniciado

        document.querySelectorAll('a[href="home.html"]').forEach(enlace => {
            enlace.href = 'usuario_registrado.html';   // aquí pones el home de usuario registrado
        });

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


     // --- PERFIL: nombre y foto en perfil.html ---
    if (usuarioLogueado) {
        const nombrePerfil = document.getElementById('nombre-usuario-perfil');
        if (nombrePerfil) nombrePerfil.textContent = usuarioLogueado.nombre;

        const fotoPerfilPerfil = document.getElementById('foto-perfil-perfil');
        if (fotoPerfilPerfil) {
            if (usuarioLogueado.foto && usuarioLogueado.foto !== "sin_imagen") {
                fotoPerfilPerfil.src = usuarioLogueado.foto;
            } else {
                fotoPerfilPerfil.src = "images/id.png";
            }
        }
    }



    // POPUP para contactar

    
    const miniPopup = document.querySelector(".mini-popup");
    const miniClose = document.getElementById("mini-close");
    const miniSend = document.getElementById("mini-send");


    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-contactar")) {
            const miniPopup = document.querySelector(".mini-popup");
            if (miniPopup) {
                miniPopup.style.display = "block";
            }
        }
    });

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




// --- PERFIL: pintar historial de favoritos en perfil.html ---
    const contenedorFavoritos = document.getElementById('lista-favoritos');

    if (contenedorFavoritos) {
        const favoritosGuardados = JSON.parse(localStorage.getItem('favoritos')) || [];

        if (favoritosGuardados.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = "Todavía no tienes viajes en favoritos.";
            contenedorFavoritos.appendChild(msg);
        } else {
            favoritosGuardados.forEach(fav => {
                const card = document.createElement('div');
                card.className = 'tarjeta-experiencia';

                const img = document.createElement('img');
                img.src = fav.imagen;
                img.alt = fav.titulo || "Destino favorito";

                const h3 = document.createElement('h3');
                h3.textContent = fav.titulo || "Viaje favorito";

                const acciones = document.createElement('div');
                acciones.className = 'acciones';

                const verMas = document.createElement('a');
                verMas.href = 'a.html';            //redirigimos al nuevo home
                verMas.className = 'ver-mas-btn';
                verMas.textContent = 'Más detalles';

                acciones.appendChild(verMas);

                card.appendChild(img);
                card.appendChild(h3);
                card.appendChild(acciones);

                contenedorFavoritos.appendChild(card);
            });
        }
    }



 


    const datosBusqueda = sessionStorage.getItem('busqueda');

    if (datosBusqueda) {
        const { origen, destino, ida, vuelta, tipo } = JSON.parse(datosBusqueda);

        const setValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value || "";
        };

        setValue('resumen-origen', origen);
        setValue('resumen-destino', destino);
        setValue('resumen-ida', ida);
        setValue('resumen-vuelta', vuelta);
        setValue('resumen-tipo', tipo);
    }




    // --- CREAR POSTS EN COMUNIDAD ---
    const btnPublicar = document.getElementById('publicar-post');
    const textareaPost = document.getElementById('texto-nuevo-post');
    const contenedorPosts = document.querySelector('.col-centro');

    if (btnPublicar && textareaPost && contenedorPosts) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

        // Rellenar nombre y foto en la caja de escribir
        const nombreUI = document.getElementById('nombre-post-usuario');
        const fotoUI = document.getElementById('foto-post-usuario');

        if (usuario) {
            if (nombreUI) nombreUI.textContent = usuario.nombre;
            if (fotoUI) fotoUI.src = usuario.foto || 'images/id.png';
        }

        btnPublicar.addEventListener('click', () => {
            const texto = textareaPost.value.trim();
            if (!texto) return;

            const nuevoPost = {
                nombre: usuario.nombre,
                foto: usuario.foto || 'images/id.png',
                texto: texto,
                fecha: 'Ahora mismo'
            };

            // Guardar en localStorage
            let posts = JSON.parse(localStorage.getItem('postsComunidad')) || [];
            posts.unshift(nuevoPost);
            localStorage.setItem('postsComunidad', JSON.stringify(posts));

            insertarPostEnDOM(nuevoPost);
            textareaPost.value = '';
        });
    }



    function insertarPostEnDOM(post) {
        const contenedorPosts = document.querySelector('.col-centro');

        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${post.foto}" alt="Foto de perfil de ${post.nombre}">
                <div>
                    <h3>${post.nombre}</h3>
                    <p class="timestamp">${post.fecha}</p>
                </div>
            </div>
            <div class="post-content">
                ${post.texto}
            </div>
            <button class="btn-contactar">Contactar</button>
        `;

        // Insertar justo DESPUÉS del bloque de crear post
        const crearPost = document.querySelector('.crear-post');
        contenedorPosts.insertBefore(postDiv, crearPost.nextSibling);
    }



    if (document.querySelector('.crear-post')) {
        const postsGuardados = JSON.parse(localStorage.getItem('postsComunidad')) || [];
        postsGuardados.forEach(post => insertarPostEnDOM(post));
    }






    // --- INTERNACIONALIZACIÓN HOME ---
    const i18n = {
        es: {
            
            menu_home: "Inicio",
            menu_comunidad: "Comunidad",
            menu_rincones: "Otros Rincones",
            menu_language: "Idioma",

            
            
            hero_subtitle: "Viajes únicos, experiencias inolvidables y packs a tu medida.",
            buscar_viaje_texto: "¿Estás buscando tu próximo viaje?",
            top_ventas: "¡Estos son nuestros top ventas!",

            // Packs

            
           Amsterdam: "Ámsterdam",
           ciudad_del_cabo: "Ciudad del Cabo",
           algeciras: "Algeciras",
            getafe: "Getafe",

            login_title: "¿Todavía no formas parte de nuestra comunidad?",
            login_user_ph: "Usuario",
            login_pass_ph: "Contraseña",
            login_remember: "Recordar credenciales",
            login_btn: "Iniciar sesión",
            register_btn: "Registro",

            top_destinations: "Top destinos mochileros",
            quick_tips: "Consejos rápidos",
            next_meetups: "Próximos encuentros",

            tip_1: "Lleva seguro médico y documento de identidad",
            tip_2: "Infórmate sobre visados con antelación",
            tip_3: "Viaja ligero de equipaje",

            new_adventures: "¿Buscas nuevas aventuras?",
            see_offers: "Mira nuestras ofertas",

            reviews_title: "Estas son algunas opiniones de antiguos viajeros",
            read_more: "Leer más",

            toggle_images_off: "Modo sin imágenes",
            toggle_images_on: "Modo con imágenes",
            toggle_images: "Modo sin imágenes",

            search_from: "Desde",
            search_to: "A",
            search_departure: "Ida",
            search_return: "Vuelta",
            search_type: "Tipo de viaje",
            search_btn: "Buscar",

            search_from_ph: "Elige origen",
            search_to_ph: "Elige destino",
            search_departure_ph: "Añadir fecha",
            search_return_ph: "Añadir fecha",
            search_type_ph: "Opción 1",

            city_madrid: "Madrid",
            city_barcelona: "Barcelona",
            city_valencia: "Valencia",
            city_rome: "Roma",
            city_lisbon: "Lisboa",
            city_london: "Londres",

            trip_opt_1: "Opción 1",
            trip_opt_2: "Opción 2",
            trip_opt_3: "Opción 3",

            btn_more_details: "Más detalles",

            login_user_ph: "Usuario",
            login_pass_ph: "Contraseña",

            country_thailand: "Tailandia",
            country_norway: "Noruega",
            country_morocco: "Marruecos",
            country_peru: "Perú",
            country_new_zealand: "Nueva Zelanda",

            meetup_1: "Ruta por los Pirineos - 25/10/2025",
            meetup_2: "Subida al Monte Tubqal - 14/12/2025",
            meetup_3: "Aventura en el Desierto de Atacama - 05/04/2026"

        },

            

        en: {
            // Menu
            menu_home: "Home",
            menu_comunidad: "Community",
            menu_rincones: "Other Places",
            menu_language: "Language",

            // Banner
            
            hero_subtitle: "Unique trips, unforgettable experiences and tailor-made packages.",
            buscar_viaje_texto: "Are you looking for your next trip?",
            top_ventas: "These are our top sellers!",

            Amsterdam: "Amsterdam",
            ciudad_del_cabo: "Cape Town",
            florence: "Florencia",
            hong_kong: "Hong Kong",
            algeciras: "Algeciras",
            getafe: "Getafe",

            login_title: "Not part of our community yet?",
            login_user_ph: "Username",
            login_pass_ph: "Password",
            login_remember: "Remember credentials",
            login_btn: "Log in",
            register_btn: "Register",

            top_destinations: "Top backpacker destinations",
            quick_tips: "Quick tips",
            next_meetups: "Upcoming meetups",

            tip_1: "Carry medical insurance and ID",
            tip_2: "Check visa requirements in advance",
            tip_3: "Travel light",

            new_adventures: "Looking for new adventures?",
            see_offers: "Check our offers",

            reviews_title: "Here are some reviews from past travelers",
            read_more: "Read more",
            toggle_images_off: "No images mode",
            toggle_images_on: "Images mode",
            toggle_images: "No images mode",

            search_from: "From",
            search_to: "To",
            search_departure: "Departure",
            search_return: "Return",
            search_type: "Trip type",
            search_btn: "Search",

            search_from_ph: "Choose origin",
            search_to_ph: "Choose destination",
            search_departure_ph: "Add date",
            search_return_ph: "Add date",
            search_type_ph: "Option 1",

            city_madrid: "Madrid",
            city_barcelona: "Barcelona",
            city_valencia: "Valencia",
            city_rome: "Rome",
            city_lisbon: "Lisbon",
            city_london: "London",

            trip_opt_1: "Option 1",
            trip_opt_2: "Option 2",
            trip_opt_3: "Option 3",

            btn_more_details: "More details",

            login_user_ph: "Username",
            login_pass_ph: "Password",

            country_thailand: "Thailand",
            country_norway: "Norway",
            country_morocco: "Morocco",
            country_peru: "Peru",
            country_new_zealand: "New Zealand",

            meetup_1: "Pyrenees route - 25/10/2025",
            meetup_2: "Climb Mount Toubkal - 14/12/2025",
            meetup_3: "Atacama Desert adventure - 05/04/2026"

            
        },

        fr: {
            // Menu
            menu_home: "Accueil",
            menu_comunidad: "Communauté",
            menu_rincones: "Autres Destinations",
            menu_language: "Langue",

            // Banner
            
            hero_subtitle: "Voyages uniques, expériences inoubliables et offres sur mesure.",
            buscar_viaje_texto: "Vous cherchez votre prochain voyage ?",
            top_ventas: "Voici nos meilleures ventes !",


            Amsterdam: "Amsterdam",
            ciudad_del_cabo: "Le Cap",
            florence: "Florence",
            hong_kong: "Hong Kong",
            algeciras: "Algésiras",
            getafe: "Getafe",

            login_title: "Vous ne faites pas encore partie de notre communauté ?",
            login_user_ph: "Utilisateur",
            login_pass_ph: "Mot de passe",
            login_remember: "Se souvenir des identifiants",
            login_btn: "Se connecter",
            register_btn: "S’inscrire",

            top_destinations: "Destinations préférées des backpackers",
            quick_tips: "Conseils rapides",
            next_meetups: "Prochaines rencontres",

            tip_1: "Emportez une assurance médicale et une pièce d’identité",
            tip_2: "Renseignez-vous sur les visas à l’avance",
            tip_3: "Voyagez léger",

            new_adventures: "Vous cherchez de nouvelles aventures ?",
            see_offers: "Découvrez nos offres",

            reviews_title: "Voici quelques avis d’anciens voyageurs",
            read_more: "Lire plus",
            toggle_images_off: "Mode sans images",
            toggle_images_on: "Mode avec images",
            toggle_images: "Mode sans images",

            search_from: "De",
            search_to: "À",
            search_departure: "Aller",
            search_return: "Retour",
            search_type: "Type de voyage",
            search_btn: "Rechercher",

            search_from_ph: "Choisir l’origine",
            search_to_ph: "Choisir la destination",
            search_departure_ph: "Ajouter une date",
            search_return_ph: "Ajouter une date",
            search_type_ph: "Option 1",

            city_madrid: "Madrid",
            city_barcelona: "Barcelone",
            city_valencia: "Valence",
            city_rome: "Rome",
            city_lisbon: "Lisbonne",
            city_london: "Londres",

            trip_opt_1: "Option 1",
            trip_opt_2: "Option 2",
            trip_opt_3: "Option 3",

            btn_more_details: "Plus de détails",

            login_user_ph: "Utilisateur",
            login_pass_ph: "Mot de passe",

            country_thailand: "Thaïlande",
            country_norway: "Norvège",
            country_morocco: "Maroc",
            country_peru: "Pérou",
            country_new_zealand: "Nouvelle-Zélande",

            meetup_1: "Itinéraire dans les Pyrénées - 25/10/2025",
            meetup_2: "Ascension du mont Toubkal - 14/12/2025",
            meetup_3: "Aventure dans le désert d’Atacama - 05/04/2026"

        }
    };



    function cambiarIdioma(idioma) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (i18n[idioma] && i18n[idioma][key]) {
                el.textContent = i18n[idioma][key];
            }
        });

        localStorage.setItem("idioma", idioma);
    }


    const selectorIdioma = document.getElementById("idioma");

    if (selectorIdioma) {
        // Cargar idioma guardado
        const idiomaGuardado = localStorage.getItem("idioma") || "es";
        selectorIdioma.value = idiomaGuardado;
        cambiarIdioma(idiomaGuardado);

        selectorIdioma.addEventListener("change", (e) => {
            cambiarIdioma(e.target.value);
        });
    }

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (i18n[idioma] && i18n[idioma][key]) {
            el.placeholder = i18n[idioma][key];
        }
    });

    const precioElemento = document.getElementById("precio-aleatorio");

    if (precioElemento) {
        const precioMin = 200;
        const precioMax = 1000;

        const precioAleatorio =
            Math.floor(Math.random() * (precioMax - precioMin + 1)) + precioMin;

        precioElemento.textContent = `${precioAleatorio} €`;
    }






    (function () {
    const root = document.getElementById("pv-personalizados");
    if (!root) return; 

    const titulo = document.getElementById("pv-titulo");
    const subtitulo = document.getElementById("pv-subtitulo");
    const grid = document.getElementById("pv-grid");
    const btnVolver = document.getElementById("pv-volver");

    const params = new URLSearchParams(window.location.search);
    const continenteSeleccionado = params.get("continent");

    if (!continenteSeleccionado) {
        titulo.textContent = "Elige un continente";
        subtitulo.textContent = "Vuelve a 'Otros Rincones' y selecciona uno.";
        return;
    }

    titulo.textContent = `Explora ${continenteSeleccionado}`;
    subtitulo.textContent = "Primero elige un país.";

    let dataCache = null;
    let continenteData = null;

    function limpiarGrid() {
        grid.innerHTML = "";
    }

    function crearTarjeta({ img, alt, titulo, texto, cta }) {
        const card = document.createElement("div");
        card.className = "tarjeta-experiencia";
        card.innerHTML = `
        <img src="${img}" alt="${alt}">
        <h3>${titulo}</h3>
        ${texto ? `<p>${texto}</p>` : ""}
        <div class="acciones">
            <a href="#" class="ver-mas-btn">${cta}</a>
        </div>
        `;
        return card;
    }

    function renderPaises() {
        limpiarGrid();
        btnVolver.style.display = "none";
        subtitulo.textContent = "Primero elige un país.";

        continenteData.countries.forEach((country) => {
        // imagen “representativa” = primera ciudad (si existe)
        const primeraCiudad = country.cities?.[0];
        const img = primeraCiudad?.image?.url || "images/mochilachati.png";
        const alt = primeraCiudad?.image?.alt || country.name;

        const card = crearTarjeta({
            img,
            alt,
            titulo: country.name,
            texto: `${country.cities.length} ciudad(es) disponible(s)`,
            cta: "Ver ciudades",
        });

        card.querySelector(".ver-mas-btn").addEventListener("click", (e) => {
            e.preventDefault();
            renderCiudades(country);
        });

        grid.appendChild(card);
        });
    }

    function renderCiudades(country) {
        limpiarGrid();
        btnVolver.style.display = "inline-block";
        subtitulo.textContent = `Ciudades en ${country.name}`;

        btnVolver.onclick = (e) => {
        e.preventDefault();
        renderPaises();
        };

        country.cities.forEach((city) => {
        const card = crearTarjeta({
            img: city.image.url,
            alt: city.image.alt,
            titulo: city.name,
            texto: city.description,
            cta: "Más detalles",
        });

        // Si quieres, aquí podrías guardar la ciudad y abrir una página detalle,
        // pero NO lo hago porque pediste 1 sola página.
        card.querySelector(".ver-mas-btn").addEventListener("click", (e) => {
            e.preventDefault();

            const usuarioLogueado = localStorage.getItem("usuarioLogueado");

            if (!usuarioLogueado) {
                mostrarNotificacion("Debes registrarte o iniciar sesión");
                return;
            }

            abrirModalCompra(city);
        });

        grid.appendChild(card);
        });
    }

    function abrirModalCompra(city) {
        const modal = document.getElementById("modal-compra");

        // Usuario logueado
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado")) || {
            nombre: "Usuario",
            foto: "images/mochilachati.png"
        };

        document.getElementById("compra-foto-usuario").src = usuario.foto;
        document.getElementById("compra-nombre-usuario").textContent = usuario.nombre;

        document.getElementById("compra-ciudad").textContent = city.name;
        document.getElementById("compra-imagen-ciudad").src = city.image.url;
        document.getElementById("compra-imagen-ciudad").alt = city.image.alt;
        document.getElementById("compra-descripcion").textContent = city.description;

        modal.style.display = "block";
    }

    const cerrarCompra = document.getElementById("cerrarCompra");
    if (cerrarCompra) {
        cerrarCompra.addEventListener("click", () => {
            document.getElementById("modal-compra").style.display = "none";
        });
    }

    const formCompra = document.getElementById("form-compra");

    if (formCompra) {
        formCompra.addEventListener("submit", (e) => {
            e.preventDefault(); 

            // Cerramos el modal
            const modal = document.getElementById("modal-compra");
            modal.style.display = "none";

            // Mostramos notificación
            mostrarNotificacion("Reserva confirmada 🎉");
            
            // (opcional) resetear formulario
            formCompra.reset();
        });
    }

    function mostrarNotificacion(texto) {
        const noti = document.createElement("div");
        noti.className = "notificacion-reserva";
        noti.textContent = texto;

        document.body.appendChild(noti);

        // animación entrada
        setTimeout(() => noti.classList.add("show"), 10);

        // desaparición automática
        setTimeout(() => {
            noti.classList.remove("show");
            setTimeout(() => noti.remove(), 300);
        }, 3000);
    }




    fetch("ciudades-del-mundo.json")
        .then((r) => r.json())
        .then((data) => {
        dataCache = data;

        continenteData = dataCache.continents.find(
            (c) => c.name === continenteSeleccionado
        );

        if (!continenteData) {
            titulo.textContent = "Continente no encontrado";
            subtitulo.textContent = "Revisa el nombre enviado en la URL.";
            return;
        }

        renderPaises();
        })
        .catch((err) => {
        console.error("Error cargando JSON:", err);
        titulo.textContent = "Error cargando destinos";
        subtitulo.textContent =
            "Asegúrate de abrir el proyecto con Live Server / servidor local.";
        });
    })();




    //Comprobador para redirigir al usuario

    (function () {

        
        if (!window.location.pathname.includes("otros_rincones")) return;

        const enlaceComunidad = document.querySelector('a[href="comunidad.html"]');
        if (!enlaceComunidad) return;

        enlaceComunidad.addEventListener("click", function (e) {
            const usuarioLogueado = localStorage.getItem("usuarioLogueado");

            if (!usuarioLogueado) {
                e.preventDefault();
                
                window.location.href = "a.html"; 
               
            }
        });

    })();




    (function () {

        
        if (!window.location.pathname.includes("otros_rincones")) return;

        const usuarioLogueado = localStorage.getItem("usuarioLogueado");

        
        const botonesProtegidos = document.querySelectorAll(
            'a, button'
        );

        botonesProtegidos.forEach(boton => {
            const texto = boton.textContent.trim().toLowerCase();

            const esBotonProtegido =
                texto.includes("ver todos") ||
                texto.includes("ver viajes") ||
                texto.includes("visitar");

            if (!esBotonProtegido) return;

            boton.addEventListener("click", function (e) {
                if (!localStorage.getItem("usuarioLogueado")) {
                    e.preventDefault();
                    window.location.href = "a.html"; 
                }
            });
        });

    })();


    (function () {

        if (!window.location.pathname.includes("pagina_viajes_personalizados")) return;

        const enlaceComunidad = document.querySelector('a[href="comunidad.html"]');
        if (!enlaceComunidad) return;

        enlaceComunidad.addEventListener("click", function (e) {
            const usuarioLogueado = localStorage.getItem("usuarioLogueado");

            if (!usuarioLogueado) {
                e.preventDefault();
                window.location.href = "a.html"; 
            }
        });

    })();







});
