// ============================================
// VARIABLES GLOBALES
// ============================================

let saldo = 100000; // Saldo inicial en pesos chilenos
let usuarios = [];
let contactos = [];
let transacciones = [];
let usuarioActual = null;
let contactoSeleccionado = null;

// ============================================
// DATOS POR DEFECTO
// ============================================

// Usuario admin por defecto
const usuarioDefault = {
    nombre: "Admin",
    email: "admin@gmail.com",
    fechaNacimiento: "1990-01-01",
    password: "12345678",
    direccion: "Calle Principal 123, Viña del Mar",
    telefono: "+569 87654321"
};

// ============================================
// INICIALIZACIÓN DE DATOS EN LOCALSTORAGE
// ============================================

function inicializarDatos() {
    // Inicializar usuarios con admin por defecto
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify([usuarioDefault]));
        console.log("✅ Usuario admin creado");
    }
    
    // Inicializar saldo
    if (!localStorage.getItem("saldo")) {
        localStorage.setItem("saldo", "100000");
        console.log("✅ Saldo inicial establecido: $100,000");
    }
}

// ============================================
// FUNCIONES GENERALES
// ============================================

// Mostrar alertas de Bootstrap
function mostrarAlerta(mensaje, tipo, contenedor) {
    let alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $(contenedor).html(alertaHTML);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(function() {
        $(contenedor + " .alert").fadeOut();
    }, 5000);
}

// Verificar sesión activa
function verificarSesion() {
    usuarioActual = localStorage.getItem("usuarioActual");
    
    if (!usuarioActual) {
        window.location.href = "login.html";
    } else {
        $("#nombreUsuario").text(usuarioActual);
    }
}

// Cargar saldo desde localStorage
function cargarSaldo() {
    let saldoGuardado = localStorage.getItem("saldo");
    if (saldoGuardado) {
        saldo = parseFloat(saldoGuardado);
    }
    $("#saldoActual").text(saldo.toLocaleString('es-CL'));
}

// Guardar saldo en localStorage
function guardarSaldo() {
    localStorage.setItem("saldo", saldo.toString());
}

// ============================================
// FUNCIONES PARA REGISTRO
// ============================================

function validarRegistro(email, password, passwordConfirm, nombre, fecha, direccion, telefono) {
    // Validar campos vacíos
    if (!email || !password || !passwordConfirm || !nombre || !fecha || !direccion || !telefono) {
        mostrarAlerta("⚠️ Todos los campos son obligatorios", "warning", "#alert-container");
        return false;
    }
    
    // Validar formato de email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarAlerta("⚠️ Email inválido", "warning", "#alert-container");
        return false;
    }
    
    // Validar longitud de contraseña
    if (password.length < 8 || password.length > 20) {
        mostrarAlerta("⚠️ La contraseña debe tener entre 8 y 20 caracteres", "warning", "#alert-container");
        return false;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        mostrarAlerta("⚠️ Las contraseñas no coinciden", "warning", "#alert-container");
        return false;
    }
    
    // Verificar si el usuario ya existe
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioExiste = usuariosRegistrados.find(u => u.email === email);
    
    if (usuarioExiste) {
        mostrarAlerta("⚠️ Este email ya está registrado", "warning", "#alert-container");
        return false;
    }
    
    return true;
}

function registrarUsuario(e) {
    e.preventDefault();
    
    // Obtener valores del formulario con jQuery (DOM)
    let nombre = $("#nombreRegistro").val().trim();
    let email = $("#emailRegistro").val().trim();
    let fecha = $("#fechaNacimiento").val();
    let password = $("#passwordRegistro").val();
    let passwordConfirm = $("#passwordConfirm").val();
    let direccion = $("#direccion").val().trim();
    let telefono = $("#telefono").val().trim();
    let terminos = $("#terminos").is(":checked");
    
    // Validar términos
    if (!terminos) {
        mostrarAlerta("⚠️ Debes aceptar los términos de servicio", "warning", "#alert-container");
        return;
    }
    
    // Validar registro
    if (!validarRegistro(email, password, passwordConfirm, nombre, fecha, direccion, telefono)) {
        return;
    }
    
    // Crear objeto usuario
    let nuevoUsuario = {
        nombre: nombre,
        email: email,
        fechaNacimiento: fecha,
        password: password,
        direccion: direccion,
        telefono: telefono
    };
    
    // Guardar en localStorage usando DOM
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
    
    console.log("✅ Usuario registrado:", nuevoUsuario.email);
    
    // Mostrar éxito y redirigir
    mostrarAlerta("✅ Registro exitoso! Ahora puedes iniciar sesión. Redirigiendo...", "success", "#alert-container");
    
    setTimeout(function() {
        window.location.href = "login.html";
    }, 2000);
}

// ============================================
// FUNCIONES PARA LOGIN
// ============================================

function validarLogin(email, password) {
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Buscar usuario con email y password correctos
    let usuario = usuariosRegistrados.find(u => u.email === email && u.password === password);
    
    return usuario;
}

function iniciarSesion(e) {
    e.preventDefault();
    
    // Obtener valores con jQuery (DOM)
    let email = $("#emailLogin").val().trim();
    let password = $("#passwordLogin").val();
    
    // Validar campos vacíos
    if (!email || !password) {
        mostrarAlerta("⚠️ Por favor completa todos los campos", "warning", "#alert-container");
        return;
    }
    
    // Validar credenciales
    let usuario = validarLogin(email, password);
    
    if (usuario) {
        // Guardar sesión en localStorage
        localStorage.setItem("usuarioActual", usuario.nombre);
        
        console.log("✅ Login exitoso:", usuario.email);
        
        // Mostrar éxito
        mostrarAlerta("✅ Login exitoso! Redirigiendo...", "success", "#alert-container");
        
        setTimeout(function() {
            window.location.href = "menu.html";
        }, 1000);
    } else {
        mostrarAlerta("❌ Email o contraseña incorrectos", "danger", "#alert-container");
    }
}

// ============================================
// FUNCIONES PARA EL MENÚ
// ============================================

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
}

// ============================================
// FUNCIONES PARA DEPÓSITO
// ============================================

function realizarDeposito(e) {
    e.preventDefault();
    
    let monto = parseFloat($("#montoDeposito").val());
    
    if (!monto || monto <= 0) {
        mostrarAlerta("⚠️ Ingrese un monto válido", "warning", "#alert-container");
        return;
    }
    
    // Actualizar saldo
    saldo += monto;
    guardarSaldo();
    
    // Agregar transacción DINÁMICA
    agregarTransaccionDinamica("deposito", monto, "Depósito");
    
    // Mostrar éxito
    mostrarAlerta("✅ Depósito realizado exitosamente! Nuevo saldo: $" + saldo.toLocaleString('es-CL'), "success", "#alert-container");
    
    // Actualizar vista
    $("#saldoActual").text(saldo.toLocaleString('es-CL'));
    $("#montoDeposito").val("");
    
    // Redirigir después de 2 segundos
    setTimeout(function() {
        window.location.href = "menu.html";
    }, 2000);
}

// ============================================
// FUNCIONES PARA ENVIAR DINERO
// ============================================

function agregarContactoDinamico(e) {
    e.preventDefault();
    
    let nombre = $("#nombreContacto").val().trim();
    let cbu = $("#cbuContacto").val().trim();
    let alias = $("#aliasContacto").val().trim();
    let banco = $("#bancoContacto").val().trim();
    
    // Validar CBU
    if (cbu.length !== 22 || isNaN(cbu)) {
        mostrarAlerta("⚠️ El CBU debe tener exactamente 22 dígitos numéricos", "warning", "#alert-container");
        return;
    }
    
    // Crear HTML del nuevo contacto (misma estética que los estáticos)
    let nuevoContactoHTML = `
        <div class="contacto-item card mb-2 contacto-dinamico">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="contacto-info" style="cursor:pointer;">
                    <strong>${nombre}</strong><br>
                    <small>Alias: ${alias}</small><br>
                    <small>CBU: ${cbu}</small><br>
                    <small>Banco: ${banco}</small>
                </div>
                <button class="btn btn-danger btn-sm btn-eliminar-contacto">
                    ❌
                </button>
            </div>
        </div>
    `;
    
    // Agregar al DOM después de los contactos estáticos
    $("#listaContactos").append(nuevoContactoHTML);
    
    console.log("✅ Contacto agregado dinámicamente:", nombre);
    
    // Ocultar formulario
    $("#formNuevoContacto").hide();
    $("#formularioContacto")[0].reset();
    
    // Reconfigurar eventos
    configurarEventosContactos();
    
    mostrarAlerta("✅ Contacto agregado exitosamente", "success", "#alert-container");
}

function configurarEventosContactos() {
    // Evento para seleccionar contacto
    $(".contacto-info").off("click").on("click", function() {
        $(".contacto-item").removeClass("border-primary");
        $(this).closest(".contacto-item").addClass("border-primary border-3");
        
        contactoSeleccionado = {
            nombre: $(this).find("strong").text(),
            alias: $(this).text().match(/Alias: ([^\n]+)/)[1]
        };
        
        $("#btnEnviarDinero").show();
    });
    
    // Evento para eliminar contacto (solo dinámicos)
    $(".contacto-dinamico .btn-eliminar-contacto").off("click").on("click", function(e) {
        e.stopPropagation();
        
        if (confirm("¿Estás seguro de eliminar este contacto?")) {
            $(this).closest(".contacto-item").remove();
            $("#btnEnviarDinero").hide();
            mostrarAlerta("✅ Contacto eliminado", "success", "#alert-container");
        }
    });
}

function enviarDinero(e) {
    e.preventDefault();
    
    let monto = parseFloat($("#montoEnviar").val());
    
    if (!monto || monto <= 0) {
        mostrarAlerta("⚠️ Ingrese un monto válido", "warning", "#alert-container");
        return;
    }
    
    if (monto > saldo) {
        mostrarAlerta("❌ Saldo insuficiente", "danger", "#alert-container");
        return;
    }
    
    // Actualizar saldo
    saldo -= monto;
    guardarSaldo();
    
    // Agregar transacción DINÁMICA
    let destinatario = contactoSeleccionado.nombre;
    agregarTransaccionDinamica("envio", monto, "Envío a " + destinatario);
    
    console.log("✅ Dinero enviado a:", destinatario, "Monto:", monto);
    
    // Actualizar vista
    $("#saldoActual").text(saldo.toLocaleString('es-CL'));
    $("#formEnvio").hide();
    $("#btnEnviarDinero").hide();
    $("#formularioEnvio")[0].reset();
    
    $(".contacto-item").removeClass("border-primary");
    contactoSeleccionado = null;
    
    mostrarAlerta("✅ Dinero enviado exitosamente! Nuevo saldo: $" + saldo.toLocaleString('es-CL'), "success", "#alert-container");
}

// ============================================
// FUNCIONES PARA TRANSACCIONES
// ============================================

function agregarTransaccionDinamica(tipo, monto, descripcion) {
    let fecha = new Date().toLocaleString('es-CL');
    
    let signo = tipo === "deposito" ? "+" : "-";
    let colorMonto = tipo === "deposito" ? "text-success" : "text-danger";
    let tipoTexto = tipo === "deposito" ? "💰 Depósito" : "📤 Transferencia Enviada";
    let claseColor = tipo === "deposito" ? "bg-success bg-opacity-25 border-success" : "bg-warning bg-opacity-25 border-warning";
    
    // Crear HTML de la nueva transacción (misma estética que las estáticas)
    let nuevaTransaccionHTML = `
        <div class="card mb-3 border-2 ${claseColor} transaccion-dinamica">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-2">${tipoTexto}</h5>
                        <p class="mb-1"><strong>${descripcion}</strong></p>
                        <small class="text-muted">📅 ${fecha}</small>
                    </div>
                    <div class="text-end">
                        <h4 class="mb-1 ${colorMonto}">${signo}$${monto.toLocaleString('es-CL')}</h4>
                        <small class="text-muted">Saldo: $${saldo.toLocaleString('es-CL')}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar al INICIO del contenedor de transacciones
    $("#listaTransacciones").prepend(nuevaTransaccionHTML);
    
    console.log("✅ Transacción agregada dinámicamente:", tipo, monto);
}

// ============================================
// INICIALIZACIÓN CON JQUERY (DOM)
// ============================================

$(document).ready(function() {
    console.log("✅ jQuery cargado");
    
    // Inicializar datos por defecto en localStorage
    inicializarDatos();
    
    let pagina = window.location.pathname.split("/").pop();
    console.log("📄 Página actual:", pagina);
    
    // ============================================
    // PÁGINA: registro.html
    // ============================================
    if (pagina === "registro.html" || pagina === "") {
        $("#registroForm").submit(registrarUsuario);
    }
    
    // ============================================
    // PÁGINA: login.html
    // ============================================
    if (pagina === "login.html") {
        $("#loginForm").submit(iniciarSesion);
    }
    
    // ============================================
    // PÁGINA: menu.html
    // ============================================
    if (pagina === "menu.html") {
        verificarSesion();
        cargarSaldo();
        
        $("#btnDepositar").click(function() {
            $("#mensajeRedireccion").html('<p class="text-primary fw-bold">Redirigiendo a Depositar...</p>');
            setTimeout(() => window.location.href = "deposit.html", 1000);
        });
        
        $("#btnEnviarDinero").click(function() {
            $("#mensajeRedireccion").html('<p class="text-primary fw-bold">Redirigiendo a Enviar Dinero...</p>');
            setTimeout(() => window.location.href = "sendmoney.html", 1000);
        });
        
        $("#btnTransacciones").click(function() {
            $("#mensajeRedireccion").html('<p class="text-primary fw-bold">Redirigiendo a Últimos Movimientos...</p>');
            setTimeout(() => window.location.href = "transactions.html", 1000);
        });
        
        $("#btnCerrarSesion").click(cerrarSesion);
    }
    
    // ============================================
    // PÁGINA: deposit.html
    // ============================================
    if (pagina === "deposit.html") {
        verificarSesion();
        cargarSaldo();
        
        $("#formDeposito").submit(realizarDeposito);
        $("#btnVolver").click(() => window.location.href = "menu.html");
    }
    
    // ============================================
    // PÁGINA: sendmoney.html
    // ============================================
    if (pagina === "sendmoney.html") {
        verificarSesion();
        cargarSaldo();
        
        // Configurar eventos de contactos estáticos y dinámicos
        configurarEventosContactos();
        
        // Mostrar formulario de nuevo contacto
        $("#btnAgregarContacto").click(function() {
            $("#formNuevoContacto").show();
        });
        
        // Cancelar nuevo contacto
        $("#btnCancelarContacto").click(function() {
            $("#formNuevoContacto").hide();
            $("#formularioContacto")[0].reset();
        });
        
        // Agregar contacto
        $("#formularioContacto").submit(agregarContactoDinamico);
        
        // Mostrar formulario de envío
        $("#btnEnviarDinero").click(function() {
            if (contactoSeleccionado !== null) {
                $("#nombreDestinatario").text(contactoSeleccionado.nombre);
                $("#formEnvio").show();
            }
        });
        
        // Cancelar envío
        $("#btnCancelarEnvio").click(function() {
            $("#formEnvio").hide();
            $("#formularioEnvio")[0].reset();
        });
        
        // Enviar dinero
        $("#formularioEnvio").submit(enviarDinero);
        
        $("#btnVolver").click(() => window.location.href = "menu.html");
    }
    
    // ============================================
    // PÁGINA: transactions.html
    // ============================================
    if (pagina === "transactions.html") {
        verificarSesion();
        cargarSaldo();
        
        $("#btnVolver").click(() => window.location.href = "menu.html");
    }
});
