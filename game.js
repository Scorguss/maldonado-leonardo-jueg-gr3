/**
 * BLACKJACK ROYALE 21 - ISWD823 (EPN)
 * Implementado con Phaser 3
 * Desarrollado con gráficos procedurales, sistema de audio Web Audio API,
 * animaciones de cartas, fichas de casino y reglas completas de Blackjack.
 */

// ============================================================================
// 1. GESTOR DE AUDIO SINTETIZADO (Web Audio API)
// ============================================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Sonido de deslizamiento de carta
    playCardDeal() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Sonido de ficha de casino
    playChip() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    // Sonido de volteo de carta
    playCardFlip() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Sonido de victoria (acorde ascendente)
    playWin() {
        if (this.muted || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const start = this.ctx.currentTime + index * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.35);
        });
    }

    // Fanfarria de Blackjack
    playBlackjack() {
        if (this.muted || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
        notes.forEach((freq, index) => {
            const start = this.ctx.currentTime + index * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.45);
        });
    }

    // Sonido de derrota / quiebre
    playBust() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    // Sonido de empate
    playPush() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [440, 554.37].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.12;

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    }
}

const sounds = new SoundEngine();
window.soundManager = sounds;

// ============================================================================
// 2. GENERADOR PROCEDURAL DE TEXTURAS (CARTAS, FICHAS, TAPETE)
// ============================================================================
class AssetFactory {
    static generateCard(scene, suit, value) {
        const width = 110;
        const height = 154;
        const key = `card_${suit}_${value}`;

        if (scene.textures.exists(key)) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fondo de la carta con bordes redondeados y relieve
        const radius = 9;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d5d0c3';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Borde interior fino
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 4, width - 8, height - 8);

        // Determinación de color y símbolo del palo
        const isRed = (suit === 'H' || suit === 'D');
        const color = isRed ? '#c81d25' : '#141824';
        const suitSymbols = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
        const symbol = suitSymbols[suit];

        ctx.fillStyle = color;

        // Esquina superior izquierda
        ctx.font = 'bold 17px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value, 16, 23);
        ctx.font = '15px Outfit, sans-serif';
        ctx.fillText(symbol, 16, 40);

        // Esquina inferior derecha (invertida)
        ctx.save();
        ctx.translate(width - 16, height - 23);
        ctx.rotate(Math.PI);
        ctx.font = 'bold 17px Outfit, sans-serif';
        ctx.fillText(value, 0, -5);
        ctx.font = '15px Outfit, sans-serif';
        ctx.fillText(symbol, 0, 12);
        ctx.restore();

        // Ilustración o pips en el centro
        const cx = width / 2;
        const cy = height / 2;

        if (['J', 'Q', 'K'].includes(value)) {
            // Marco ornamental para figuras
            ctx.strokeStyle = isRed ? 'rgba(200, 29, 37, 0.25)' : 'rgba(20, 24, 36, 0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(28, 42, width - 56, height - 84);

            // Corona o símbolo real
            ctx.font = 'bold 36px Cinzel, serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value, cx, cy - 8);

            ctx.font = '24px Outfit, sans-serif';
            ctx.fillText(symbol, cx, cy + 24);
        } else if (value === 'A') {
            // Gran As central ornamentado
            ctx.font = '54px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, cx, cy);

            ctx.strokeStyle = isRed ? 'rgba(200, 29, 37, 0.3)' : 'rgba(20, 24, 36, 0.25)';
            ctx.beginPath();
            ctx.arc(cx, cy, 32, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Cartas numéricas (2-10) con pips centrados
            ctx.font = '28px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const num = parseInt(value, 10);

            if (num === 2) {
                ctx.fillText(symbol, cx, cy - 35);
                ctx.fillText(symbol, cx, cy + 35);
            } else if (num === 3) {
                ctx.fillText(symbol, cx, cy - 38);
                ctx.fillText(symbol, cx, cy);
                ctx.fillText(symbol, cx, cy + 38);
            } else if (num === 4) {
                ctx.fillText(symbol, cx - 18, cy - 35);
                ctx.fillText(symbol, cx + 18, cy - 35);
                ctx.fillText(symbol, cx - 18, cy + 35);
                ctx.fillText(symbol, cx + 18, cy + 35);
            } else if (num === 5) {
                ctx.fillText(symbol, cx - 18, cy - 35);
                ctx.fillText(symbol, cx + 18, cy - 35);
                ctx.fillText(symbol, cx, cy);
                ctx.fillText(symbol, cx - 18, cy + 35);
                ctx.fillText(symbol, cx + 18, cy + 35);
            } else {
                ctx.font = '22px Outfit, sans-serif';
                ctx.fillText(symbol, cx - 18, cy - 40);
                ctx.fillText(symbol, cx + 18, cy - 40);
                ctx.fillText(symbol, cx, cy - 12);
                ctx.fillText(symbol, cx, cy + 12);
                ctx.fillText(symbol, cx - 18, cy + 40);
                ctx.fillText(symbol, cx + 18, cy + 40);
            }
        }

        scene.textures.addCanvas(key, canvas);
    }

    static generateCardBack(scene) {
        const key = 'card_back';
        if (scene.textures.exists(key)) return;

        const width = 110;
        const height = 154;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const radius = 9;
        ctx.fillStyle = '#1e2433';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Patrón interior de casino (rombos y oro)
        ctx.save();
        ctx.rect(6, 6, width - 12, height - 12);
        ctx.clip();
        ctx.fillStyle = '#83101e';
        ctx.fillRect(6, 6, width - 12, height - 12);

        // Trazado de rejilla dorada
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1;
        const step = 14;
        for (let x = -height; x < width + height; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + height, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, height);
            ctx.lineTo(x + height, 0);
            ctx.stroke();
        }

        // Emblema central
        ctx.fillStyle = '#1e2433';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#d4af37';
        ctx.font = '16px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♠', width / 2, height / 2);

        ctx.restore();

        scene.textures.addCanvas(key, canvas);
    }

    static generateChip(scene, val, baseColor, accentColor) {
        const key = `chip_${val}`;
        if (scene.textures.exists(key)) return;

        const size = 68;
        const radius = size / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Borde exterior con muescas clásicas de fichas
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.stroke();

        // Franjas de casino en el borde
        const stripes = 8;
        for (let i = 0; i < stripes; i++) {
            const angle = (i * Math.PI * 2) / stripes;
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angle);
            ctx.fillStyle = accentColor;
            ctx.fillRect(radius - 8, -4, 6, 8);
            ctx.restore();
        }

        // Círculo interior punteado
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Núcleo de la ficha
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 10, 15, 0.65)';
        ctx.fill();

        // Texto del valor
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`$${val}`, radius, radius);

        scene.textures.addCanvas(key, canvas);
    }

    static generateSparkle(scene) {
        const key = 'sparkle_particle';
        if (scene.textures.exists(key)) return;

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(8, 8, 4, 0, Math.PI * 2);
        ctx.fill();

        scene.textures.addCanvas(key, canvas);
    }

    static generateAll(scene) {
        const suits = ['S', 'H', 'D', 'C'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        for (const s of suits) {
            for (const v of values) {
                this.generateCard(scene, s, v);
            }
        }
        this.generateCardBack(scene);
        this.generateSparkle(scene);

        // Fichas: 5, 25, 50, 100, 500
        this.generateChip(scene, 5, '#c92a2a', '#ffffff');
        this.generateChip(scene, 25, '#2b8a3e', '#ffffff');
        this.generateChip(scene, 50, '#1864ab', '#ffffff');
        this.generateChip(scene, 100, '#212529', '#d4af37');
        this.generateChip(scene, 500, '#6741d9', '#ffd43b');
    }
}

// ============================================================================
// 3. LÓGICA DEL MAZO Y EVALUACIÓN DE BLACKJACK
// ============================================================================
class BlackjackDeck {
    constructor(numDecks = 4) {
        this.numDecks = numDecks;
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = ['S', 'H', 'D', 'C'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        for (let d = 0; d < this.numDecks; d++) {
            for (const suit of suits) {
                for (const value of values) {
                    this.cards.push({ suit, value });
                }
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        if (this.cards.length < 20) {
            this.reset();
        }
        return this.cards.pop();
    }
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J', '10'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value, 10);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return {
        score,
        isBust: score > 21,
        isBlackjack: hand.length === 2 && score === 21,
        isSoft: aces > 0
    };
}

// ============================================================================
// 4. ESCENA PRINCIPAL DE PHASER 3
// ============================================================================
class BlackjackScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BlackjackScene' });

        // Estado del juego
        this.bankroll = 1000;
        this.currentBet = 0;
        this.previousBet = 0;
        this.stats = { wins: 0, losses: 0, pushes: 0 };

        this.deck = null;
        this.playerHand = [];
        this.dealerHand = [];

        this.playerCardSprites = [];
        this.dealerCardSprites = [];
        this.placedChipSprites = [];

        this.gameState = 'BETTING'; // 'BETTING', 'DEALING', 'PLAYER_TURN', 'DEALER_TURN', 'ROUND_OVER'
        this.dealerHoleCardHidden = true;
    }

    preload() {
        // Inicializar context de audio en el primer evento de puntero
        this.input.once('pointerdown', () => sounds.init());
        AssetFactory.generateAll(this);
    }

    create() {
        sounds.init();
        this.deck = new BlackjackDeck(4);
        window.blackjackGame = this;

        // Dibujar Mesa de Casino
        this.createTable();

        // Crear Elementos HUD y Marcadores
        this.createHUD();

        // Crear Fichas Interactivas y Botones
        this.createChipSelector();
        this.createActionButtons();

        // Configurar Atajos de Teclado
        this.setupKeyboard();

        // Mensaje inicial
        this.updateStatus('¡Hagan sus apuestas para comenzar la mano!', '#f3e5ab');
        this.updateButtonStates();
    }

    // --- MESA DE CASINO ---
    createTable() {
        const bg = this.add.graphics();

        // Paño verde esmeralda con gradiente radial simulado
        bg.fillGradientStyle(0x0c3b2e, 0x0c3b2e, 0x061e17, 0x061e17, 1);
        bg.fillRect(0, 0, 1000, 700);

        // Textura sutil y viñeta en los bordes
        bg.lineStyle(8, 0x04130f, 0.85);
        bg.strokeRect(4, 4, 992, 692);

        // Borde interior de madera y oro
        bg.lineStyle(3, 0xd4af37, 0.4);
        bg.strokeRoundedRect(16, 16, 968, 668, 20);

        // Arco de la mesa de Blackjack
        bg.lineStyle(3, 0xd4af37, 0.35);
        bg.beginPath();
        bg.arc(500, 120, 360, 0.15 * Math.PI, 0.85 * Math.PI, false);
        bg.stroke();

        // Círculo de Apuesta del Jugador
        bg.lineStyle(2, 0xd4af37, 0.6);
        bg.fillStyle(0x042118, 0.7);
        bg.fillCircle(500, 345, 45);
        bg.strokeCircle(500, 345, 45);

        // Texto del paño clásico
        this.add.text(500, 215, '★ BLACKJACK PAYS 3 TO 2 ★', {
            fontFamily: 'Cinzel, serif',
            fontSize: '18px',
            color: '#d4af37',
            letterSpacing: 2
        }).setOrigin(0.5).setAlpha(0.75);

        this.add.text(500, 240, 'Dealer must stand on 17 and must draw to 16', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: '#a3b899'
        }).setOrigin(0.5).setAlpha(0.8);

        this.add.text(500, 345, 'APUESTA', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: 'rgba(212, 175, 55, 0.5)'
        }).setOrigin(0.5);

        // Zapato de cartas (Shoe) en la esquina superior derecha
        const shoe = this.add.graphics();
        shoe.fillStyle(0x161c28, 0.95);
        shoe.fillRoundedRect(840, 28, 90, 60, 6);
        shoe.lineStyle(2, 0xd4af37, 0.4);
        shoe.strokeRoundedRect(840, 28, 90, 60, 6);

        // Carta visible inclinada dentro del shoe
        shoe.fillStyle(0x83101e, 0.8);
        shoe.fillRect(846, 34, 78, 48);

        this.add.text(885, 58, 'BARAJA', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '10px',
            fontWeight: '700',
            color: '#f3e5ab'
        }).setOrigin(0.5);
    }

    // --- HUD Y MARCADORES ---
    createHUD() {
        // Contenedor Saldo (Bankroll)
        const bankrollCard = this.add.graphics();
        bankrollCard.fillStyle(0x0f172a, 0.85);
        bankrollCard.fillRoundedRect(28, 26, 170, 56, 8);
        bankrollCard.lineStyle(1, 0xd4af37, 0.35);
        bankrollCard.strokeRoundedRect(28, 26, 170, 56, 8);

        this.add.text(42, 34, 'TU SALDO', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#94a3b8'
        });

        this.txtBankroll = this.add.text(42, 50, `$${this.bankroll}`, {
            fontFamily: 'Cinzel, serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#f3e5ab'
        });

        // Contenedor Estadísticas (V / D / E)
        const statsCard = this.add.graphics();
        statsCard.fillStyle(0x0f172a, 0.85);
        statsCard.fillRoundedRect(210, 26, 150, 56, 8);
        statsCard.lineStyle(1, 0x334155, 0.6);
        statsCard.strokeRoundedRect(210, 26, 150, 56, 8);

        this.add.text(224, 34, 'HISTORIAL', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#94a3b8'
        });

        this.txtStats = this.add.text(224, 52, 'V: 0 | D: 0 | E: 0', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            fontWeight: '700',
            color: '#e2e8f0'
        });

        // Marcador de Apuesta en la mesa
        this.txtCurrentBet = this.add.text(500, 400, 'Apuesta: $0', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '15px',
            fontWeight: '700',
            color: '#f3e5ab'
        }).setOrigin(0.5);

        // Badges de Puntuación
        this.dealerScoreBadge = this.createScoreBadge(500, 100, 'Crupier: 0');
        this.playerScoreBadge = this.createScoreBadge(500, 510, 'Jugador: 0');

        this.dealerScoreBadge.container.setVisible(false);
        this.playerScoreBadge.container.setVisible(false);

        // Mensaje de Estado / Notificación Central
        this.txtStatus = this.add.text(500, 280, '', {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3e5ab',
            align: 'center'
        }).setOrigin(0.5);

        // Banner de Anuncio de Resultado (Grande, con animación)
        this.bannerContainer = this.add.container(500, 280).setDepth(20).setVisible(false);
        const bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x0f172a, 0.95);
        bannerBg.fillRoundedRect(-220, -32, 440, 64, 14);
        bannerBg.lineStyle(2, 0xd4af37, 0.8);
        bannerBg.strokeRoundedRect(-220, -32, 440, 64, 14);
        this.bannerText = this.add.text(0, 0, '', {
            fontFamily: 'Cinzel, serif',
            fontSize: '22px',
            fontWeight: '700',
            color: '#f3e5ab'
        }).setOrigin(0.5);
        this.bannerContainer.add([bannerBg, this.bannerText]);
    }

    createScoreBadge(x, y, initialText) {
        const container = this.add.container(x, y).setDepth(15);
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.85);
        bg.fillRoundedRect(-55, -14, 110, 28, 14);
        bg.lineStyle(1.5, 0xd4af37, 0.7);
        bg.strokeRoundedRect(-55, -14, 110, 28, 14);

        const text = this.add.text(0, 0, initialText, {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, text]);
        return { container, text };
    }

    // --- BANDEJA DE FICHAS ---
    createChipSelector() {
        const chipValues = [5, 25, 50, 100, 500];
        const startX = 350;
        const spacing = 75;
        const y = 650;

        this.chipButtons = [];

        chipValues.forEach((val, index) => {
            const x = startX + index * spacing;
            const chip = this.add.image(x, y, `chip_${val}`)
                .setInteractive({ cursor: 'pointer' })
                .setDepth(10);

            // Efectos de hover y pulsación
            chip.on('pointerover', () => {
                if (this.gameState === 'BETTING') {
                    this.tweens.add({
                        targets: chip,
                        y: y - 8,
                        scale: 1.08,
                        duration: 120,
                        ease: 'Power1'
                    });
                }
            });

            chip.on('pointerout', () => {
                this.tweens.add({
                    targets: chip,
                    y: y,
                    scale: 1.0,
                    duration: 120,
                    ease: 'Power1'
                });
            });

            chip.on('pointerdown', () => {
                this.addBet(val);
            });

            this.chipButtons.push(chip);
        });
    }

    // --- BOTONES DE ACCIÓN ---
    createActionButtons() {
        const y = 575;

        // Botón Repartir / Apostar
        this.btnDeal = this.createButton(410, y, 'REPARTIR', 0x2b8a3e, 0x1e662c, () => this.startDeal());

        // Botón Limpiar Apuesta
        this.btnClear = this.createButton(590, y, 'LIMPIAR', 0x862e2e, 0x602020, () => this.clearBet());

        // Botón Pedir Carta (Hit)
        this.btnHit = this.createButton(330, y, 'PEDIR', 0x228be6, 0x1864ab, () => this.playerHit());

        // Botón Plantarse (Stand)
        this.btnStand = this.createButton(500, y, 'PLANTARSE', 0xe67700, 0xb85d00, () => this.playerStand());

        // Botón Doblar (Double Down)
        this.btnDouble = this.createButton(670, y, 'DOBLAR', 0x7950f2, 0x5f3dc4, () => this.playerDouble());

        // Botón Nueva Mano
        this.btnNewRound = this.createButton(500, y, 'NUEVA MANO', 0x2b8a3e, 0x1e662c, () => this.resetForNewRound());

        // Botón Recargar (aparece en bancarrota)
        this.btnReload = this.createButton(500, 360, 'RECARGAR $500', 0xd4af37, 0x997d25, () => this.reloadBankroll());
        this.btnReload.container.setVisible(false).setDepth(30);
    }

    createButton(x, y, label, colorNormal, colorHover, onClick) {
        const container = this.add.container(x, y).setDepth(12);
        const width = 130;
        const height = 40;

        const bg = this.add.graphics();
        const drawBtn = (color, strokeColor) => {
            bg.clear();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
            bg.lineStyle(2, strokeColor, 0.9);
            bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
        };

        drawBtn(colorNormal, 0xffffff);

        const text = this.add.text(0, 0, label, {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, text]);
        container.setSize(width, height);
        container.setInteractive({ cursor: 'pointer' });

        container.on('pointerover', () => {
            drawBtn(colorHover, 0xd4af37);
            this.tweens.add({ targets: container, scale: 1.05, duration: 100 });
        });

        container.on('pointerout', () => {
            drawBtn(colorNormal, 0xffffff);
            this.tweens.add({ targets: container, scale: 1.0, duration: 100 });
        });

        container.on('pointerdown', () => {
            sounds.playChip();
            onClick();
        });

        return {
            container, text, setEnabled: (enabled) => {
                container.setVisible(enabled);
                container.input.enabled = enabled;
            }
        };
    }

    // --- ATAJOS DE TECLADO ---
    setupKeyboard() {
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.gameState === 'PLAYER_TURN') this.playerHit();
        });
        this.input.keyboard.on('keydown-H', () => {
            if (this.gameState === 'PLAYER_TURN') this.playerHit();
        });
        this.input.keyboard.on('keydown-S', () => {
            if (this.gameState === 'PLAYER_TURN') this.playerStand();
        });
        this.input.keyboard.on('keydown-D', () => {
            if (this.gameState === 'PLAYER_TURN' && this.playerHand.length === 2 && this.bankroll >= this.currentBet) {
                this.playerDouble();
            }
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.gameState === 'BETTING' && this.currentBet > 0) this.startDeal();
            else if (this.gameState === 'ROUND_OVER') this.resetForNewRound();
        });
        this.input.keyboard.on('keydown-C', () => {
            if (this.gameState === 'BETTING') this.clearBet();
        });
    }

    // --- GESTIÓN DE APUESTAS ---
    addBet(amount) {
        if (this.gameState !== 'BETTING') return;
        sounds.init();

        if (this.bankroll < amount) {
            if (this.bankroll <= 20 && window.showShopModal) {
                this.updateStatus('¡Saldo insuficiente! Abriendo tienda de fichas...', '#ff8787');
                this.time.delayedCall(400, () => window.showShopModal(this.bankroll));
            } else {
                this.updateStatus('¡No tienes suficiente saldo para esta ficha!', '#ff8787');
            }
            return;
        }

        this.bankroll -= amount;
        this.currentBet += amount;
        sounds.playChip();

        this.updateHUDValues();
        this.spawnBetChip(amount);
        this.updateStatus('Ficha colocada. Presiona REPARTIR cuando estés listo.', '#f3e5ab');
        this.updateButtonStates();
    }

    spawnBetChip(val) {
        // Generar ficha animada volando hacia el círculo de apuestas
        const chip = this.add.image(500, 650, `chip_${val}`).setDepth(5).setScale(0.7);
        const targetX = 500 + (Math.random() * 20 - 10);
        const targetY = 345 + (Math.random() * 16 - 8);

        this.tweens.add({
            targets: chip,
            x: targetX,
            y: targetY,
            scale: 0.75,
            duration: 200,
            ease: 'Power2'
        });

        this.placedChipSprites.push(chip);
    }

    clearBet() {
        if (this.gameState !== 'BETTING' || this.currentBet === 0) return;
        sounds.init();
        sounds.playChip();

        this.bankroll += this.currentBet;
        this.currentBet = 0;

        // Limpiar fichas visuales
        this.placedChipSprites.forEach(chip => chip.destroy());
        this.placedChipSprites = [];

        this.updateHUDValues();
        this.updateStatus('Apuesta limpiada. Selecciona tus fichas.', '#f3e5ab');
        this.updateButtonStates();
    }

    // --- REPARTO INICIAL ---
    startDeal() {
        if (this.gameState !== 'BETTING' || this.currentBet === 0) return;
        sounds.init();

        this.previousBet = this.currentBet;
        this.gameState = 'DEALING';
        this.updateButtonStates();
        this.bannerContainer.setVisible(false);

        this.playerHand = [];
        this.dealerHand = [];
        this.dealerHoleCardHidden = true;

        this.playerCardSprites.forEach(c => c.destroy());
        this.dealerCardSprites.forEach(c => c.destroy());
        this.playerCardSprites = [];
        this.dealerCardSprites = [];

        this.dealerScoreBadge.container.setVisible(true);
        this.playerScoreBadge.container.setVisible(true);

        this.updateStatus('Repartiendo cartas...', '#f3e5ab');

        // Secuencia de reparto: Jugador -> Crupier -> Jugador -> Crupier (Oculta)
        this.time.delayedCall(150, () => this.dealCardToPlayer());
        this.time.delayedCall(450, () => this.dealCardToDealer(false));
        this.time.delayedCall(750, () => this.dealCardToPlayer());
        this.time.delayedCall(1050, () => {
            this.dealCardToDealer(true);
            this.time.delayedCall(400, () => this.checkInitialHands());
        });
    }

    dealCardToPlayer(onComplete) {
        const card = this.deck.draw();
        this.playerHand.push(card);
        const index = this.playerHand.length - 1;

        sounds.playCardDeal();
        const sprite = this.animateCard(885, 58, 0, `card_${card.suit}_${card.value}`);
        this.playerCardSprites.push(sprite);

        this.repositionCards(this.playerCardSprites, 500, 440, () => {
            this.updateScoresDisplay();
            if (onComplete) onComplete();
        });
    }

    dealCardToDealer(isHidden, onComplete) {
        const card = this.deck.draw();
        this.dealerHand.push(card);

        sounds.playCardDeal();
        const texture = isHidden ? 'card_back' : `card_${card.suit}_${card.value}`;
        const sprite = this.animateCard(885, 58, 0, texture);
        sprite.cardData = card;
        sprite.isHidden = isHidden;
        this.dealerCardSprites.push(sprite);

        this.repositionCards(this.dealerCardSprites, 500, 160, () => {
            this.updateScoresDisplay();
            if (onComplete) onComplete();
        });
    }

    animateCard(startX, startY, endAngle, textureKey) {
        const sprite = this.add.image(startX, startY, textureKey)
            .setScale(0.85)
            .setDepth(10);
        return sprite;
    }

    repositionCards(spritesList, centerX, targetY, onComplete) {
        const count = spritesList.length;
        if (count === 0) {
            if (onComplete) onComplete();
            return;
        }

        const cardSpacing = 42;
        const totalWidth = (count - 1) * cardSpacing;
        const startX = centerX - totalWidth / 2;

        let completed = 0;
        spritesList.forEach((sprite, i) => {
            const destX = startX + i * cardSpacing;
            this.tweens.add({
                targets: sprite,
                x: destX,
                y: targetY,
                duration: 250,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    completed++;
                    if (completed === count && onComplete) {
                        onComplete();
                    }
                }
            });
        });
    }

    // --- REVISIÓN INICIAL (BLACKJACK NATURAL) ---
    checkInitialHands() {
        const playerScore = calculateScore(this.playerHand);
        const dealerScore = calculateScore(this.dealerHand);

        if (playerScore.isBlackjack) {
            // El jugador tiene Blackjack natural
            this.revealDealerHoleCard(() => {
                if (dealerScore.isBlackjack) {
                    this.endRound('PUSH_BLACKJACK');
                } else {
                    this.endRound('PLAYER_BLACKJACK');
                }
            });
        } else if (dealerScore.isBlackjack && ['A', '10', 'J', 'Q', 'K'].includes(this.dealerHand[0].value)) {
            // Crupier tiene Blackjack natural directo
            this.revealDealerHoleCard(() => {
                this.endRound('DEALER_WIN');
            });
        } else {
            // Turno del jugador
            this.gameState = 'PLAYER_TURN';
            this.updateStatus('¿Deseas pedir carta, plantarte o doblar?', '#f3e5ab');
            this.updateButtonStates();
        }
    }

    // --- ACCIONES DEL JUGADOR ---
    playerHit() {
        if (this.gameState !== 'PLAYER_TURN') return;
        sounds.init();

        this.gameState = 'BUSY';
        this.updateButtonStates();

        this.dealCardToPlayer(() => {
            const playerScore = calculateScore(this.playerHand);
            if (playerScore.isBust) {
                this.endRound('PLAYER_BUST');
            } else if (playerScore.score === 21) {
                // Alcanzó 21 automáticamente se planta
                this.playerStand();
            } else {
                this.gameState = 'PLAYER_TURN';
                this.updateButtonStates();
            }
        });
    }

    playerStand() {
        if (this.gameState !== 'PLAYER_TURN' && this.gameState !== 'BUSY') return;
        sounds.init();

        this.gameState = 'DEALER_TURN';
        this.updateButtonStates();
        this.updateStatus('Turno del Crupier...', '#f3e5ab');

        this.revealDealerHoleCard(() => {
            this.playDealerTurn();
        });
    }

    playerDouble() {
        if (this.gameState !== 'PLAYER_TURN' || this.playerHand.length !== 2) return;
        if (this.bankroll < this.currentBet) {
            this.updateStatus('¡Saldo insuficiente para doblar!', '#ff8787');
            return;
        }

        sounds.init();
        sounds.playChip();

        // Duplica la apuesta y recibe exactamente 1 carta
        this.bankroll -= this.currentBet;
        const doubledAmount = this.currentBet;
        this.currentBet *= 2;
        this.spawnBetChip(doubledAmount);
        this.updateHUDValues();

        this.gameState = 'BUSY';
        this.updateButtonStates();

        this.dealCardToPlayer(() => {
            const playerScore = calculateScore(this.playerHand);
            if (playerScore.isBust) {
                this.endRound('PLAYER_BUST');
            } else {
                this.playerStand();
            }
        });
    }

    // --- TURNO DEL CRUPIER ---
    revealDealerHoleCard(onComplete) {
        const holeSprite = this.dealerCardSprites.find(s => s.isHidden);
        if (!holeSprite) {
            if (onComplete) onComplete();
            return;
        }

        sounds.playCardFlip();
        this.dealerHoleCardHidden = false;

        // Efecto 3D de volteo de carta
        this.tweens.add({
            targets: holeSprite,
            scaleX: 0,
            duration: 140,
            ease: 'Linear',
            onComplete: () => {
                holeSprite.setTexture(`card_${holeSprite.cardData.suit}_${holeSprite.cardData.value}`);
                holeSprite.isHidden = false;
                this.tweens.add({
                    targets: holeSprite,
                    scaleX: 0.85,
                    duration: 140,
                    ease: 'Linear',
                    onComplete: () => {
                        this.updateScoresDisplay();
                        if (onComplete) onComplete();
                    }
                });
            }
        });
    }

    playDealerTurn() {
        const dealerScore = calculateScore(this.dealerHand);

        // Crupier pide con 16 o menos, se planta con 17 o más
        if (dealerScore.score < 17) {
            this.time.delayedCall(700, () => {
                this.dealCardToDealer(false, () => {
                    this.playDealerTurn();
                });
            });
        } else {
            // Crupier ha terminado
            this.time.delayedCall(500, () => this.evaluateOutcome());
        }
    }

    // --- EVALUACIÓN Y FIN DE RONDA ---
    evaluateOutcome() {
        const playerScore = calculateScore(this.playerHand).score;
        const dealerScore = calculateScore(this.dealerHand).score;

        if (dealerScore > 21) {
            this.endRound('DEALER_BUST');
        } else if (playerScore > dealerScore) {
            this.endRound('PLAYER_WIN');
        } else if (dealerScore > playerScore) {
            this.endRound('DEALER_WIN');
        } else {
            this.endRound('PUSH');
        }
    }

    endRound(result) {
        this.gameState = 'ROUND_OVER';
        this.updateButtonStates();

        let bannerMsg = '';
        let bannerColor = '#f3e5ab';

        switch (result) {
            case 'PLAYER_BLACKJACK':
                bannerMsg = '¡BLACKJACK! PAGA 3:2';
                bannerColor = '#ffd700';
                const blackjackPayout = Math.floor(this.currentBet * 2.5);
                this.bankroll += blackjackPayout;
                this.stats.wins++;
                sounds.playBlackjack();
                this.spawnParticles();
                break;

            case 'PLAYER_WIN':
            case 'DEALER_BUST':
                bannerMsg = result === 'DEALER_BUST' ? '¡CRUPIER SE PASÓ! GANASTE' : '¡GANASTE LA MANO!';
                bannerColor = '#51cf66';
                this.bankroll += this.currentBet * 2;
                this.stats.wins++;
                sounds.playWin();
                this.spawnParticles();
                break;

            case 'PUSH':
            case 'PUSH_BLACKJACK':
                bannerMsg = 'EMPATE (PUSH) - APUESTA DEVUELTA';
                bannerColor = '#74c0fc';
                this.bankroll += this.currentBet;
                this.stats.pushes++;
                sounds.playPush();
                break;

            case 'PLAYER_BUST':
                bannerMsg = '¡TE PASASTE! LA CASA GANA';
                bannerColor = '#ff6b6b';
                this.stats.losses++;
                sounds.playBust();
                break;

            case 'DEALER_WIN':
                bannerMsg = 'GANA EL CRUPIER';
                bannerColor = '#ff6b6b';
                this.stats.losses++;
                sounds.playBust();
                break;
        }

        this.currentBet = 0;
        this.updateHUDValues();
        this.showBanner(bannerMsg, bannerColor);

        // Si se quedó sin saldo o llega a 20 o menos
        if (this.bankroll <= 20) {
            this.time.delayedCall(1200, () => {
                if (window.showShopModal) {
                    window.showShopModal(this.bankroll);
                } else if (this.btnReload && this.btnReload.container) {
                    this.btnReload.container.setVisible(true);
                }
            });
        }
    }

    showBanner(msg, color) {
        this.bannerText.setText(msg);
        this.bannerText.setColor(color);
        this.bannerContainer.setScale(0.7);
        this.bannerContainer.setAlpha(0);
        this.bannerContainer.setVisible(true);

        this.tweens.add({
            targets: this.bannerContainer,
            scale: 1.0,
            alpha: 1,
            duration: 250,
            ease: 'Back.easeOut'
        });
    }

    spawnParticles() {
        try {
            if (this.add.particles) {
                const emitter = this.add.particles(500, 280, 'sparkle_particle', {
                    speed: { min: 80, max: 260 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 1.2, end: 0 },
                    lifespan: 900,
                    quantity: 35,
                    blendMode: 'ADD'
                });
                this.time.delayedCall(1000, () => {
                    if (emitter && emitter.destroy) emitter.destroy();
                });
            }
        } catch (e) {
            // Manejo silencioso si la versión cargada difiere
        }
    }

    resetForNewRound() {
        sounds.init();
        sounds.playChip();

        this.bannerContainer.setVisible(false);
        this.playerCardSprites.forEach(c => c.destroy());
        this.dealerCardSprites.forEach(c => c.destroy());
        this.playerCardSprites = [];
        this.dealerCardSprites = [];
        this.playerHand = [];
        this.dealerHand = [];

        this.placedChipSprites.forEach(chip => chip.destroy());
        this.placedChipSprites = [];

        this.dealerScoreBadge.container.setVisible(false);
        this.playerScoreBadge.container.setVisible(false);

        // Opción inteligente: si puede repetir la apuesta previa
        if (this.previousBet > 0 && this.bankroll >= this.previousBet) {
            this.addBet(this.previousBet);
            this.updateStatus('Apuesta anterior repetida. Presiona REPARTIR o ajusta fichas.', '#f3e5ab');
        } else {
            this.updateStatus('Coloca tus fichas para una nueva mano.', '#f3e5ab');
        }

        this.gameState = 'BETTING';
        this.updateButtonStates();
    }

    reloadBankroll() {
        if (window.showShopModal) {
            window.showShopModal(this.bankroll);
        } else {
            this.bankroll = 500;
            this.btnReload.container.setVisible(false);
            this.updateHUDValues();
            this.resetForNewRound();
            this.updateStatus('¡Has recargado $500! ¡Buena suerte!', '#51cf66');
        }
    }

    creditChips(amount, packageName = 'Recarga') {
        this.bankroll += amount;
        this.updateHUDValues();
        this.showBanner(`¡+${amount.toLocaleString()} FICHAS!`, '#51cf66');
        sounds.playBlackjack();
        this.spawnParticles();
        this.updateStatus(`¡Recarga exitosa! ${packageName} acreditado.`, '#51cf66');
        if (this.btnReload && this.btnReload.container) {
            this.btnReload.container.setVisible(false);
        }
        if (this.gameState === 'ROUND_OVER') {
            this.resetForNewRound();
        } else {
            this.updateButtonStates();
        }
    }

    // --- ACTUALIZACIÓN DE INTERFAZ ---
    updateScoresDisplay() {
        // Crupier
        if (this.dealerHand.length > 0) {
            if (this.dealerHoleCardHidden && this.dealerHand.length >= 2) {
                // Solo muestra la primera carta
                const firstCardVal = calculateScore([this.dealerHand[0]]).score;
                this.dealerScoreBadge.text.setText(`Crupier: ${firstCardVal} + ?`);
            } else {
                const dealerScore = calculateScore(this.dealerHand);
                this.dealerScoreBadge.text.setText(`Crupier: ${dealerScore.score}`);
            }
        }

        // Jugador
        if (this.playerHand.length > 0) {
            const playerScore = calculateScore(this.playerHand);
            if (playerScore.isSoft && playerScore.score <= 21 && playerScore.score - 10 > 0) {
                this.playerScoreBadge.text.setText(`Jugador: ${playerScore.score - 10} / ${playerScore.score}`);
            } else {
                this.playerScoreBadge.text.setText(`Jugador: ${playerScore.score}`);
            }
        }
    }

    updateHUDValues() {
        this.txtBankroll.setText(`$${this.bankroll}`);
        this.txtCurrentBet.setText(`Apuesta: $${this.currentBet}`);
        this.txtStats.setText(`V: ${this.stats.wins} | D: ${this.stats.losses} | E: ${this.stats.pushes}`);
    }

    updateStatus(msg, color = '#f3e5ab') {
        this.txtStatus.setText(msg);
        this.txtStatus.setColor(color);
    }

    updateButtonStates() {
        const isBetting = this.gameState === 'BETTING';
        const isPlayerTurn = this.gameState === 'PLAYER_TURN';
        const isRoundOver = this.gameState === 'ROUND_OVER';

        // Botones de apuestas
        this.btnDeal.setEnabled(isBetting && this.currentBet > 0);
        this.btnClear.setEnabled(isBetting && this.currentBet > 0);

        // Botones de acción en juego
        this.btnHit.setEnabled(isPlayerTurn);
        this.btnStand.setEnabled(isPlayerTurn);
        const canDouble = isPlayerTurn && this.playerHand.length === 2 && this.bankroll >= this.currentBet;
        this.btnDouble.setEnabled(canDouble);

        // Botón de nueva ronda
        this.btnNewRound.setEnabled(isRoundOver);

        // Opacidad de fichas
        this.chipButtons.forEach(chip => {
            chip.setAlpha(isBetting ? 1 : 0.35);
        });
    }
}

// ============================================================================
// 5. CONFIGURACIÓN E INICIALIZACIÓN DE PHASER 3
// ============================================================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1000,
    height: 700,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 1000,
        height: 700
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [BlackjackScene]
};

window.addEventListener('load', () => {
    window.phaserGame = new Phaser.Game(config);
});