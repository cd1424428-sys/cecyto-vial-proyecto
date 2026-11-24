// Base de datos simulada en memoria (JavaScript Arrays & Objects)
let dbInfracciones = [
    { 
        id: 1, 
        titulo: "Uso Obligatorio de Casco Certificado", 
        zona: "Zona Escolar y Vialidades CECYTO", 
        sancion: "Multa de 5 a 10 UMAs", 
        desc: "Indispensable tanto para el conductor como para el acompañante en motocicletas." 
    },
    { 
        id: 2, 
        titulo: "Exceso de Límites de Velocidad", 
        zona: "Av. Central Villa Victoria", 
        sancion: "Multa económica severa", 
        desc: "Límite máximo de 30 km/h en zonas escolares y 50 km/h en avenidas." 
    },
    { 
        id: 3, 
        titulo: "Estacionarse en Lugares Prohibidos", 
        zona: "Centro Municipal", 
        sancion: "Inmovilizador / Grúa", 
        desc: "Bloqueo de rampas, cocheras o doble fila en zonas urbanas." 
    }
];

const dbQuiz = [
    {
        pregunta: "1. ¿Cuál es la velocidad máxima permitida en zonas escolares en Villa Victoria?",
        opciones: ["60 km/h", "30 km/h", "80 km/h"],
        correcta: 1
    },
    {
        pregunta: "2. ¿Qué elemento de seguridad es obligatorio y vital para los motociclistas?",
        opciones: ["Casco certificado", "Gafas de sol polarizadas", "Guantes de piel únicamente"],
        correcta: 0
    }
];

// Lógica de Inicio de Sesión y Renderizado
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('userRole').value;
            if(role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard-user.html';
            }
        });
    }

    // Renderizar Reglamento en Panel de Usuario
    const reglamentoContainer = document.getElementById('reglamentoContainer');
    if(reglamentoContainer) {
        renderReglamento(dbInfracciones);

        const searchInput = document.getElementById('searchInput');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                const filtro = e.target.value.toLowerCase();
                const filtrados = dbInfracciones.filter(item => 
                    item.titulo.toLowerCase().includes(filtro) || 
                    item.zona.toLowerCase().includes(filtro) ||
                    item.sancion.toLowerCase().includes(filtro)
                );
                renderReglamento(filtrados);
            });
        }
    }

    // Renderizar Cuestionario Dinámico
    const quizContainer = document.getElementById('quizContainer');
    if(quizContainer) {
        let quizHTML = '';
        dbQuiz.forEach((q, index) => {
            quizHTML += `<div class="mb-3 p-3 border rounded bg-light">
                <label class="form-label fw-bold">${q.pregunta}</label>
                <div>`;
            q.opciones.forEach((op, optIndex) => {
                quizHTML += `<div class="form-check">
                    <input class="form-check-input" type="radio" name="p${index}" value="${optIndex}">
                    <label class="form-check-label">${op}</label>
                </div>`;
            });
            quizHTML += `</div></div>`;
        });
        quizContainer.innerHTML = quizHTML;
    }

    // Renderizar Tabla de Administración
    const adminTableBody = document.getElementById('adminTableBody');
    if(adminTableBody) {
        renderAdminTable();
    }
});

// Renderizar tabla del panel de administrador con función de edición real
function renderAdminTable() {
    const adminTableBody = document.getElementById('adminTableBody');
    if(!adminTableBody) return;

    let tableHTML = '';
    dbInfracciones.forEach((item, index) => {
        tableHTML += `<tr id="fila-${index}">
            <td><strong>0${item.id}</strong></td>
            <td><span id="txt-titulo-${index}">${item.titulo}</span></td>
            <td><span id="txt-zona-${index}">${item.zona}</span></td>
            <td><span id="txt-sancion-${index}">${item.sancion}</span></td>
            <td>
                <button class="btn btn-sm btn-danger me-1" id="btn-editar-${index}" onclick="habilitarEdicion(${index})">Editar</button>
                <button class="btn btn-sm btn-success d-none" id="btn-guardar-${index}" onclick="guardarEdicion(${index})">Guardar</button>
            </td>
        </tr>`;
    });
    adminTableBody.innerHTML = tableHTML;
}

// Habilitar campos de texto editables en la fila
function habilitarEdicion(index) {
    const item = dbInfracciones[index];

    document.getElementById(`txt-titulo-${index}`).innerHTML = `<input type="text" id="edit-titulo-${index}" class="form-control form-control-sm" value="${item.titulo}">`;
    document.getElementById(`txt-zona-${index}`).innerHTML = `<input type="text" id="edit-zona-${index}" class="form-control form-control-sm" value="${item.zona}">`;
    document.getElementById(`txt-sancion-${index}`).innerHTML = `<input type="text" id="edit-sancion-${index}" class="form-control form-control-sm" value="${item.sancion}">`;

    document.getElementById(`btn-editar-${index}`).classList.add('d-none');
    document.getElementById(`btn-guardar-${index}`).classList.remove('d-none');
}

// Guardar los cambios realizados en la fila
function guardarEdicion(index) {
    dbInfracciones[index].titulo = document.getElementById(`edit-titulo-${index}`).value;
    dbInfracciones[index].zona = document.getElementById(`edit-zona-${index}`).value;
    dbInfracciones[index].sancion = document.getElementById(`edit-sancion-${index}`).value;

    renderAdminTable();
}

// Funciones de Usuario (Reglamento y Quiz)
function renderReglamento(data) {
    const container = document.getElementById('reglamentoContainer');
    if(!container) return;
    let html = '';
    data.forEach(item => {
        html += `<div class="col-md-6 mb-3">
            <div class="card h-100 border-start border-danger border-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted small">Zona: ${item.zona}</h6>
                    <p class="card-text small text-secondary">${item.desc}</p>
                    <span class="badge bg-danger">${item.sancion}</span>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function evaluarQuizJS() {
    let aciertos = 0;
    dbQuiz.forEach((q, index) => {
        const selected = document.querySelector(`input[name="p${index}"]:checked`);
        if(selected && parseInt(selected.value) === q.correcta) {
            aciertos++;
        }
    });

    const resultadoDiv = document.getElementById('quizResult');
    resultadoDiv.innerHTML = `<div class="alert alert-info mt-3">Has obtenido <strong>${aciertos} de ${dbQuiz.length}</strong> aciertos correctos. ¡Excelente trabajo!</div>`;
}