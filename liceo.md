<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votaciones Promo XXXV - Elio Valmores Castellano</title>
    <!-- Fuentes Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome para íconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="liceo.css">
</head>
<body>

    <!-- Encabezado Principal -->
    <header class="app-header">
        <div class="header-container">
            <div class="logo-title">
                <div class="school-logo-badge">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                    <h1>Elio Valmores Castellano</h1>
                    <span class="sub-title">Votaciones Oficiales Promo XXXV</span>
                </div>
            </div>
            <div class="dev-badge">
                <i class="fa-solid fa-code"></i> Desarrollado por <strong>Hearry Silva</strong>
            </div>
        </div>
    </header>

    <main class="main-container">

        <!-- ALERTA DE SISTEMA -->
        <div id="system-alert" class="alert-box hidden"></div>

        <!-- PANTALLA 1: INICIO -->
        <section id="view-home" class="card view-section animate-fade">
            <div class="text-center">
                <div class="school-logo-large">
                    <i class="fa-solid fa-school"></i>
                </div>
                <h2 class="title-primary">PROMO XXXV</h2>
                <p class="subtitle">Plataforma Estricta de Elección de Indumentaria</p>
                <p class="author-credits">Sistema creado y administrado por <span>Hearry Silva</span></p>
            </div>

            <div id="closed-banner" class="closed-banner hidden">
                <i class="fa-solid fa-lock"></i> Las votaciones han sido pausadas por la administración.
            </div>

            <div class="home-actions">
                <button id="btn-home-votar" class="btn btn-primary btn-lg">
                    <i class="fa-solid fa-vote-yea"></i> Votar / Entrar
                </button>
                <button id="btn-home-admin" class="btn btn-secondary btn-lg">
                    <i class="fa-solid fa-user-shield"></i> Ingresar como Administrador
                </button>
            </div>
        </section>

        <!-- PANTALLA 2: REGISTRO E STRICT IDENTIFICATION -->
        <section id="view-register" class="card view-section hidden animate-fade">
            <button class="btn-back" onclick="app.showView('view-home')"><i class="fa-solid fa-arrow-left"></i> Volver</button>
            
            <div class="section-header">
                <h2>Identificación del Estudiante</h2>
                <p>Ingresa tus datos reales. Solo se permite 1 voto por estudiante y por dispositivo.</p>
            </div>

            <form id="form-register" onsubmit="app.handleRegister(event)">
                <div class="form-group">
                    <label for="reg-nombre"><i class="fa-solid fa-user"></i> Nombre:</label>
                    <input type="text" id="reg-nombre" placeholder="Ej: Juan" required autocomplete="off">
                </div>

                <div class="form-group">
                    <label for="reg-apellido"><i class="fa-solid fa-user"></i> Apellido:</label>
                    <input type="text" id="reg-apellido" placeholder="Ej: Hernández" required autocomplete="off">
                </div>

                <div class="form-group">
                    <label for="reg-seccion"><i class="fa-solid fa-users"></i> Sección:</label>
                    <select id="reg-seccion" required>
                        <option value="">-- Selecciona tu sección --</option>
                        <option value="A">Sección A</option>
                        <option value="B">Sección B</option>
                        <option value="C">Sección C</option>
                        <option value="D">Sección D</option>
                        <option value="E">Sección E</option>
                        <option value="F">Sección F</option>
                    </select>
                </div>

                <div class="security-warning">
                    <i class="fa-solid fa-triangle-exclamation"></i> 
                    Este dispositivo quedará enlazado a tu nombre. Intento de duplicidad será bloqueado.
                </div>

                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fa-solid fa-check-circle"></i> Continuar a la Votación
                </button>
            </form>
        </section>

        <!-- PANTALLA 3: PANEL DE VOTACIÓN -->
        <section id="view-voting" class="card view-section hidden animate-fade">
            
            <div class="user-bar">
                <div>
                    <span class="user-welcome">Hola, <strong id="display-user-name">Estudiante</strong></span>
                    <span id="display-user-section" class="badge-section">Sección -</span>
                </div>
                <button class="btn btn-sm btn-outline" onclick="app.logout()">
                    <i class="fa-solid fa-right-from-bracket"></i> Salir
                </button>
            </div>

            <!-- Portada Principal -->
            <div class="voting-banner">
                <div class="school-corner-logo">
                    <i class="fa-solid fa-award"></i> E.V.C.
                </div>
                <h2 class="banner-title">BOTACIONES DE ELIO VALMORES CASTELLANO</h2>
                <p class="banner-subtitle">AQUÍ DEBATIRÁN QUÉ PREFIEREN ESTA PROMO XXXV</p>
                <div class="banner-author">Organizado por: Hearry Silva</div>
            </div>

            <!-- Tarjetas de Opciones -->
            <h3 class="text-center margin-top-lg">¿Qué prefieres para la graduación?</h3>
            
            <div class="voting-grid">
                <!-- Opción 1: Chaqueta -->
                <div class="vote-card" id="card-chaqueta">
                    <div class="vote-img-placeholder">
                        <i class="fa-solid fa-vest-patches"></i>
                        <span>Foto Chaqueta Promo</span>
                    </div>
                    <h4>CHAQUETA PROMO</h4>
                    <div class="vote-count-badge" id="count-chaqueta">0 votos (0%)</div>
                    <button class="btn btn-vote" onclick="app.castVote('chaqueta')">
                        <i class="fa-solid fa-check"></i> Votar Chaqueta
                    </button>
                </div>

                <!-- Opción 2: Chemis -->
                <div class="vote-card" id="card-chemis">
                    <div class="vote-img-placeholder">
                        <i class="fa-solid fa-shirt"></i>
                        <span>Foto Chemis Promo</span>
                    </div>
                    <h4>CHEMIS PROMO</h4>
                    <div class="vote-count-badge" id="count-chemis">0 votos (0%)</div>
                    <button class="btn btn-vote" onclick="app.castVote('chemis')">
                        <i class="fa-solid fa-check"></i> Votar Chemis
                    </button>
                </div>
            </div>

            <!-- Estado actual de voto -->
            <div id="voted-status-box" class="voted-status-box hidden">
                <p>Tu voto actual: <strong id="user-current-vote">Ninguno</strong></p>
                <small>Puedes cambiar de opinión seleccionando la otra opción en cualquier momento.</small>
            </div>

            <!-- Comentario sobre la votación -->
            <div class="form-group margin-top-lg">
                <label for="vote-comment"><i class="fa-solid fa-comment-dots"></i> Explica por qué preferiste esta opción (Opcional):</label>
                <div class="input-with-button">
                    <input type="text" id="vote-comment" placeholder="Escribe tu motivo..." maxlength="200">
                    <button class="btn btn-secondary" onclick="app.saveComment()">Guardar Opinión</button>
                </div>
            </div>

            <!-- Párrafos Informativos ( Exactamente 5 líneas de argumento cada uno ) -->
            <div class="arguments-container margin-top-xl">
                <div class="arg-card">
                    <h5><i class="fa-solid fa-vest-patches"></i> ¿Por qué es mejor usar Chaqueta?</h5>
                    <p class="arg-paragraph">
                        La chaqueta le otorga a la Promo XXXV una apariencia elegante, formal e imponente para todos los actos institucionales.<br>
                        Ofrece una durabilidad superior que protege mejor contra cambios de clima durante eventos al aire libre o salones de fiesta.<br>
                        Su superficie permite bordados de alta resolución con el logo del liceo, nombres personalizados y diseños exclusivos en la espalda.<br>
                        Se conserva perfectamente como un recuerdo físico perdurable con el paso de los años tras culminar el bachillerato.<br>
                        Aporta un estilo universitario moderno que destaca a la promoción ante toda la comunidad del Elio Valmores Castellano.
                    </p>
                </div>

                <div class="arg-card">
                    <h5><i class="fa-solid fa-shirt"></i> ¿Por qué es mejor usar Chemis?</h5>
                    <p class="arg-paragraph">
                        La chemis es una opción sumamente fresca, cómoda y versátil ideal para el clima cálido diario de las actividades liceístas.<br>
                        Permite a los estudiantes una movilidad total y confort durante los ensayos, caravanas y reuniones informales de la promoción.<br>
                        Representa una alternativa significativamente más económica y accesible para el presupuesto de todas las familias de los graduandos.<br>
                        Su mantenimiento es facilísimo de lavar, secar y planchar sin requerir cuidados de tintorería ni telas pesadas o calurosas.<br>
                        Es una prenda clásica y tradicional que proyecta una imagen limpia, juvenil y unificada para los estudiantes de la Promo XXXV.
                    </p>
                </div>
            </div>

            <!-- Chat interactivo en tiempo real de debate -->
            <div class="chat-section margin-top-xl">
                <div class="chat-header">
                    <h4><i class="fa-solid fa-comments"></i> Nube de Chat - Debate Promo XXXV</h4>
                    <span id="chat-status" class="status-online"><i class="fa-solid fa-circle"></i> Conectado</span>
                </div>
                
                <div class="chat-messages" id="chat-box">
                    <!-- Mensajes dinámicos aquí -->
                </div>

                <div id="chat-controls" class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe un mensaje para debatir..." maxlength="250" onkeydown="if(event.key==='Enter') app.sendChatMessage()">
                    <button class="btn btn-primary" onclick="app.sendChatMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
                <div id="chat-muted-msg" class="muted-notice hidden">
                    <i class="fa-solid fa-microphone-slash"></i> El chat ha sido silenciado temporalmente por el Administrador.
                </div>
            </div>

            <!-- Botón Final deshabilitado -->
            <div class="margin-top-xl text-center">
                <button class="btn btn-disabled" disabled>
                    <i class="fa-solid fa-ban"></i> Continuar
                </button>
                <p class="text-muted"><small>Este botón aún no está habilitado por la coordinación.</small></p>
            </div>

        </section>

        <!-- PANTALLA 4: LOGIN ADMINISTRADOR -->
        <section id="view-admin-login" class="card view-section hidden animate-fade">
            <button class="btn-back" onclick="app.showView('view-home')"><i class="fa-solid fa-arrow-left"></i> Volver</button>
            
            <div class="text-center">
                <div class="admin-icon"><i class="fa-solid fa-user-shield"></i></div>
                <h2>Acceso Administrativo</h2>
                <p>Exclusivo para el moderador (Hearry Silva)</p>
            </div>

            <form onsubmit="app.handleAdminLogin(event)" class="margin-top-md">
                <div class="form-group">
                    <label for="admin-pin"><i class="fa-solid fa-key"></i> Contraseña de Acceso:</label>
                    <input type="password" id="admin-pin" placeholder="Ingresa el PIN de seguridad" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fa-solid fa-unlock"></i> Entrar al Panel
                </button>
            </form>
        </section>

        <!-- PANTALLA 5: PANEL DE ADMINISTRACIÓN COMPLETO -->
        <section id="view-admin-panel" class="card view-section hidden animate-fade">
            <div class="admin-header">
                <div>
                    <h2>Panel de Control e Inspección</h2>
                    <p>Administrador: <strong>Hearry Silva</strong></p>
                </div>
                <button class="btn btn-sm btn-outline" onclick="app.showView('view-home')">
                    <i class="fa-solid fa-right-from-bracket"></i> Cerrar Panel
                </button>
            </div>

            <!-- Métricas Generales -->
            <div class="stats-grid margin-top-md">
                <div class="stat-card">
                    <span class="stat-num" id="stat-total-votes">0</span>
                    <span class="stat-label">Total Votos Registrados</span>
                </div>
                <div class="stat-card">
                    <span class="stat-num" id="stat-chaqueta-votes">0</span>
                    <span class="stat-label">Votos Chaqueta</span>
                </div>
                <div class="stat-card">
                    <span class="stat-num" id="stat-chemis-votes">0</span>
                    <span class="stat-label">Votos Chemis</span>
                </div>
            </div>

            <!-- Acciones Rápidas -->
            <div class="admin-controls-bar margin-top-lg">
                <button id="btn-toggle-voting" class="btn btn-warning" onclick="app.adminToggleVoting()">
                    <i class="fa-solid fa-pause"></i> Pausar Votaciones
                </button>
                <button id="btn-toggle-chat" class="btn btn-secondary" onclick="app.adminToggleChat()">
                    <i class="fa-solid fa-volume-xmark"></i> Silenciar Chat
                </button>
                <button class="btn btn-danger" onclick="app.adminClearAllVotes()">
                    <i class="fa-solid fa-trash"></i> Reiniciar Votación Total
                </button>
            </div>

            <!-- Filtros de la Lista de Estudiantes -->
            <div class="section-divider margin-top-xl"></div>
            <h3><i class="fa-solid fa-list-check"></i> Registro Estricto de Votantes</h3>
            
            <div class="filter-bar">
                <label for="filter-seccion"><i class="fa-solid fa-filter"></i> Filtrar por Sección:</label>
                <select id="filter-seccion" onchange="app.renderAdminVoterList()">
                    <option value="ALL">Todas las secciones (A - F)</option>
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                    <option value="C">Sección C</option>
                    <option value="D">Sección D</option>
                    <option value="E">Sección E</option>
                    <option value="F">Sección F</option>
                </select>
            </div>

            <!-- Tabla de Registros -->
            <div class="table-responsive margin-top-md">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Sección</th>
                            <th>Voto</th>
                            <th>Comentario / Razón</th>
                            <th>ID Dispositivo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="admin-voters-tbody">
                        <!-- Filas generadas dinámicamente -->
                    </tbody>
                </table>
            </div>

        </section>

    </main>

    <footer class="app-footer">
        <p>Liceo Elio Valmores Castellano &copy; 2026 - Promo XXXV</p>
        <p class="credits">Diseñado y Desarrollado con seguridad antifraude por <strong>Hearry Silva</strong></p>
    </footer>

    <script src="liceo.js"></script>
</body>
</html>
