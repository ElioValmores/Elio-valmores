/* ==========================================================================
   LÓGICA DEL SISTEMA DE VOTACIÓN ESTRICTO Y ANTIFRAUDE
   Desarrollado por: Hearry Silva
   ========================================================================== */

const ADMIN_PIN_SECRET = "38759";

// Objeto Global de la Aplicación
const app = {
    state: {
        users: {},       // { 'nombre_apellido': { name, lastname, section, deviceId, vote, comment } }
        deviceToUser: {},// { deviceId: 'nombre_apellido' }
        chatMessages: [],
        votingPaused: false,
        chatMuted: false,
        currentUser: null,
        deviceId: null
    },

    init: function() {
        this.initDeviceId();
        this.loadState();
        this.bindEvents();
        this.updateStats();
        this.renderChat();
        
        // Comprobar si el dispositivo ya tiene una cuenta enlazada activa
        if (this.state.deviceToUser[this.state.deviceId]) {
            const userKey = this.state.deviceToUser[this.state.deviceId];
            if (this.state.users[userKey]) {
                this.state.currentUser = this.state.users[userKey];
            }
        }

        this.checkVotingState();
    },

    // Genera/recupera huella digital única para el equipo o celular actual
    initDeviceId: function() {
        let id = localStorage.getItem('evc_device_fingerprint');
        if (!id) {
            id = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
            localStorage.setItem('evc_device_fingerprint', id);
        }
        this.state.deviceId = id;
    },

    // Guardar en LocalStorage
    saveState: function() {
        localStorage.setItem('evc_app_data', JSON.stringify({
            users: this.state.users,
            deviceToUser: this.state.deviceToUser,
            chatMessages: this.state.chatMessages,
            votingPaused: this.state.votingPaused,
            chatMuted: this.state.chatMuted
        }));
    },

    // Cargar datos
    loadState: function() {
        const saved = localStorage.getItem('evc_app_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state.users = parsed.users || {};
                this.state.deviceToUser = parsed.deviceToUser || {};
                this.state.chatMessages = parsed.chatMessages || [];
                this.state.votingPaused = !!parsed.votingPaused;
                this.state.chatMuted = !!parsed.chatMuted;
            } catch(e) {
                console.error("Error al cargar estado", e);
            }
        }
    },

    bindEvents: function() {
        document.getElementById('btn-home-votar').addEventListener('click', () => {
            if (this.state.votingPaused) {
                this.showAlert('Las votaciones están pausadas actualmente.', 'danger');
                return;
            }

            if (this.state.currentUser) {
                this.openVotingPanel();
            } else {
                this.showView('view-register');
            }
        });

        document.getElementById('btn-home-admin').addEventListener('click', () => {
            this.showView('view-admin-login');
        });
    },

    showView: function(viewId) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
        window.scrollTo(0,0);
    },

    showAlert: function(msg, type = 'danger') {
        const box = document.getElementById('system-alert');
        box.className = `alert-box ${type} animate-fade`;
        box.textContent = msg;
        box.classList.remove('hidden');
        setTimeout(() => box.classList.add('hidden'), 4500);
    },

    normalizeText: function(str) {
        return str.trim().toLowerCase().replace(/\s+/g, ' ');
    },

    // REGISTRO STRICTO
    handleRegister: function(e) {
        e.preventDefault();

        if (this.state.votingPaused) {
            this.showAlert("Las votaciones están pausadas.", "danger");
            return;
        }

        const rawNombre = document.getElementById('reg-nombre').value;
        const rawApellido = document.getElementById('reg-apellido').value;
        const seccion = document.getElementById('reg-seccion').value;

        const cleanNombre = this.normalizeText(rawNombre);
        const cleanApellido = this.normalizeText(rawApellido);
        const userKey = `${cleanNombre}_${cleanApellido}`;

        // Validación 1: Verificar si el equipo ya creó otra cuenta diferente
        const boundUserKey = this.state.deviceToUser[this.state.deviceId];
        if (boundUserKey && boundUserKey !== userKey) {
            this.showAlert("Seguridad Antifraude: Este dispositivo ya ha registrado a otro estudiante. No es posible crear múltiples cuentas desde el mismo teléfono/PC.", "danger");
            return;
        }

        // Validación 2: Verificar si el Nombre + Apellido ya existen
        if (this.state.users[userKey]) {
            if (this.state.users[userKey].deviceId !== this.state.deviceId) {
                this.showAlert(`El estudiante "${rawNombre} ${rawApellido}" ya fue registrado en otro equipo. Por seguridad no se permiten duplicados.`, "danger");
                return;
            }
        }

        // Guardar o Actualizar Usuario
        const userData = {
            name: rawNombre.trim(),
            lastname: rawApellido.trim(),
            key: userKey,
            section: seccion,
            deviceId: this.state.deviceId,
            vote: this.state.users[userKey] ? this.state.users[userKey].vote : null,
            comment: this.state.users[userKey] ? this.state.users[userKey].comment : ''
        };

        this.state.users[userKey] = userData;
        this.state.deviceToUser[this.state.deviceId] = userKey;
        this.state.currentUser = userData;

        this.saveState();
        this.openVotingPanel();
    },

    openVotingPanel: function() {
        if (!this.state.currentUser) return;

        document.getElementById('display-user-name').textContent = `${this.state.currentUser.name} ${this.state.currentUser.lastname}`;
        document.getElementById('display-user-section').textContent = `Sección ${this.state.currentUser.section}`;

        this.updateStats();
        this.renderUserVoteUI();
        this.checkChatMuteUI();
        this.showView('view-voting');
    },

    logout: function() {
        this.state.currentUser = null;
        this.showView('view-home');
    },

    // PROCESO DE VOTACIÓN Y CAMBIO DE OPINIÓN
    castVote: function(option) {
        if (this.state.votingPaused) {
            this.showAlert("La votación ha sido pausada.", "danger");
            return;
        }

        if (!this.state.currentUser) return;

        const userKey = this.state.currentUser.key;
        this.state.users[userKey].vote = option;
        this.state.currentUser.vote = option;

        this.saveState();
        this.updateStats();
        this.renderUserVoteUI();
        this.showAlert(`¡Tu voto por ${option.toUpperCase()} ha sido registrado exitosamente!`, 'success');
    },

    saveComment: function() {
        if (!this.state.currentUser) return;
        const comment = document.getElementById('vote-comment').value.trim();
        const userKey = this.state.currentUser.key;

        this.state.users[userKey].comment = comment;
        this.state.currentUser.comment = comment;

        this.saveState();
        this.showAlert("Tu comentario/opinión se ha guardado correctamente.", "success");
    },

    renderUserVoteUI: function() {
        const user = this.state.currentUser;
        if (!user) return;

        const cardChaqueta = document.getElementById('card-chaqueta');
        const cardChemis = document.getElementById('card-chemis');
        const statusBox = document.getElementById('voted-status-box');
        const currentVoteText = document.getElementById('user-current-vote');
        const commentInput = document.getElementById('vote-comment');

        cardChaqueta.classList.remove('active-vote');
        cardChemis.classList.remove('active-vote');

        if (user.vote === 'chaqueta') {
            cardChaqueta.classList.add('active-vote');
            statusBox.classList.remove('hidden');
            currentVoteText.textContent = "CHAQUETA PROMO";
        } else if (user.vote === 'chemis') {
            cardChemis.classList.add('active-vote');
            statusBox.classList.remove('hidden');
            currentVoteText.textContent = "CHEMIS PROMO";
        } else {
            statusBox.classList.add('hidden');
        }

        if (user.comment) {
            commentInput.value = user.comment;
        }
    },

    updateStats: function() {
        let countChaqueta = 0;
        let countChemis = 0;
        let total = 0;

        Object.values(this.state.users).forEach(u => {
            if (u.vote === 'chaqueta') countChaqueta++;
            if (u.vote === 'chemis') countChemis++;
        });

        total = countChaqueta + countChemis;

        const pChaqueta = total > 0 ? Math.round((countChaqueta / total) * 100) : 0;
        const pChemis = total > 0 ? Math.round((countChemis / total) * 100) : 0;

        document.getElementById('count-chaqueta').textContent = `${countChaqueta} votos (${pChaqueta}%)`;
        document.getElementById('count-chemis').textContent = `${countChemis} votos (${pChemis}%)`;

        // Métricas de Admin
        document.getElementById('stat-total-votes').textContent = total;
        document.getElementById('stat-chaqueta-votes').textContent = countChaqueta;
        document.getElementById('stat-chemis-votes').textContent = countChemis;
    },

    // NUBE DE CHAT
    sendChatMessage: function() {
        if (this.state.chatMuted) {
            this.showAlert("El chat está silenciado por la administración.", "danger");
            return;
        }

        if (!this.state.currentUser) return;

        const input = document.getElementById('chat-input');
        const msgText = input.value.trim();

        if (!msgText) return;

        const msgObj = {
            author: `${this.state.currentUser.name} (${this.state.currentUser.section})`,
            text: msgText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userKey: this.state.currentUser.key
        };

        this.state.chatMessages.push(msgObj);
        if (this.state.chatMessages.length > 50) this.state.chatMessages.shift(); // Límite de historia

        input.value = '';
        this.saveState();
        this.renderChat();
    },

    renderChat: function() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';

        if (this.state.chatMessages.length === 0) {
            chatBox.innerHTML = '<p class="text-muted text-center" style="font-size:0.8rem; margin-top:1rem;">Inicia el debate sobre las opciones...</p>';
            return;
        }

        this.state.chatMessages.forEach(m => {
            const isMine = this.state.currentUser && m.userKey === this.state.currentUser.key;
            const div = document.createElement('div');
            div.className = `chat-msg ${isMine ? 'my-msg' : ''}`;
            div.innerHTML = `
                <span class="author">${this.escapeHTML(m.author)} - ${m.time}</span>
                <span>${this.escapeHTML(m.text)}</span>
            `;
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    },

    checkChatMuteUI: function() {
        const controls = document.getElementById('chat-controls');
        const mutedNotice = document.getElementById('chat-muted-msg');
        if (this.state.chatMuted) {
            controls.classList.add('hidden');
            mutedNotice.classList.remove('hidden');
        } else {
            controls.classList.remove('hidden');
            mutedNotice.classList.add('hidden');
        }
    },

    // PANEL DE ADMINISTRACIÓN (PIN 38759)
    handleAdminLogin: function(e) {
        e.preventDefault();
        const pin = document.getElementById('admin-pin').value;

        if (pin === ADMIN_PIN_SECRET) {
            document.getElementById('admin-pin').value = '';
            this.openAdminPanel();
        } else {
            this.showAlert("Contraseña incorrecta. Acceso denegado.", "danger");
        }
    },

    openAdminPanel: function() {
        this.updateStats();
        this.renderAdminVoterList();
        this.updateAdminButtonsUI();
        this.showView('view-admin-panel');
    },

    renderAdminVoterList: function() {
        const filterSection = document.getElementById('filter-seccion').value;
        const tbody = document.getElementById('admin-voters-tbody');
        tbody.innerHTML = '';

        const usersList = Object.values(this.state.users);

        if (usersList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay estudiantes registrados aún.</td></tr>';
            return;
        }

        usersList.forEach(u => {
            if (filterSection !== 'ALL' && u.section !== filterSection) return;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${this.escapeHTML(u.name)} ${this.escapeHTML(u.lastname)}</strong></td>
                <td><span class="badge-section">Sección ${u.section}</span></td>
                <td>${u.vote ? `<strong>${u.vote.toUpperCase()}</strong>` : '<span class="text-muted">Sin Votar</span>'}</td>
                <td><small>${u.comment ? this.escapeHTML(u.comment) : 'N/A'}</small></td>
                <td><code>${u.deviceId.substring(0, 12)}...</code></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="app.adminDeleteUser('${u.key}')">
                        <i class="fa-solid fa-user-minus"></i> Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    adminDeleteUser: function(userKey) {
        if (confirm("¿Estás seguro de eliminar a este votante de la lista oficial?")) {
            const user = this.state.users[userKey];
            if (user && user.deviceId) {
                delete this.state.deviceToUser[user.deviceId];
            }
            delete this.state.users[userKey];

            if (this.state.currentUser && this.state.currentUser.key === userKey) {
                this.state.currentUser = null;
            }

            this.saveState();
            this.updateStats();
            this.renderAdminVoterList();
            this.showAlert("El usuario y su voto han sido eliminados.", "success");
        }
    },

    adminToggleVoting: function() {
        this.state.votingPaused = !this.state.votingPaused;
        this.saveState();
        this.updateAdminButtonsUI();
        this.checkVotingState();
        this.showAlert(this.state.votingPaused ? "Votación PAUSADA" : "Votación REANUDADA", "warning");
    },

    adminToggleChat: function() {
        this.state.chatMuted = !this.state.chatMuted;
        this.saveState();
        this.updateAdminButtonsUI();
        this.checkChatMuteUI();
        this.showAlert(this.state.chatMuted ? "Chat SILENCIADO" : "Chat ACTIVADO", "warning");
    },

    adminClearAllVotes: function() {
        if (confirm("⚠️ ¿Deseas reiniciar la votación por completo? Esto eliminará todos los votos de la base de datos local.")) {
            this.state.users = {};
            this.state.deviceToUser = {};
            this.state.currentUser = null;
            this.saveState();
            this.updateStats();
            this.renderAdminVoterList();
            this.showAlert("Todas las votaciones han sido reiniciadas.", "success");
        }
    },

    updateAdminButtonsUI: function() {
        const btnVoting = document.getElementById('btn-toggle-voting');
        const btnChat = document.getElementById('btn-toggle-chat');

        if (this.state.votingPaused) {
            btnVoting.innerHTML = '<i class="fa-solid fa-play"></i> Reanudar Votaciones';
            btnVoting.className = 'btn btn-primary';
        } else {
            btnVoting.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar Votaciones';
            btnVoting.className = 'btn btn-warning';
        }

        if (this.state.chatMuted) {
            btnChat.innerHTML = '<i class="fa-solid fa-volume-high"></i> Activar Chat';
            btnChat.className = 'btn btn-primary';
        } else {
            btnChat.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Silenciar Chat';
            btnChat.className = 'btn btn-secondary';
        }
    },

    checkVotingState: function() {
        const banner = document.getElementById('closed-banner');
        if (this.state.votingPaused) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    },

    escapeHTML: function(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
};

// Inicializar la aplicación cuando cargue la página
document.addEventListener('DOMContentLoaded', () => app.init());
