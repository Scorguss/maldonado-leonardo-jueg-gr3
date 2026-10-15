/**
 * SUERTE & FRUTA (Taiwan Golden Star / Mario Fruit Machine 90s)
 * Juego interactivo de máquina tragamonedas clásica de barrio latinoamericano
 * Desarrollado para la asignatura ISWD823 (EPN)
 * 
 * Reglas actualizadas:
 * - 100 monedas iniciales.
 * - Cada apuesta en un símbolo equivale a 5 monedas.
 * - Giro seleccionable hacia la IZQUIERDA (antihorario) o DERECHA (horario).
 * - Al salir la figura pronosticada (apostada), se activa el Doble o Nada.
 * - Si el jugador se queda sin monedas (< 5), se activa la misma pasarela cómica de recarga.
 */

class FrutitasSoundEngine {
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

    // Beep estridente de luz corriendo (onda cuadrada de arcade 8-bit)
    playTick(pitchRatio = 1) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        const baseFreq = 880 * pitchRatio;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.setValueAtTime(baseFreq * 1.25, now + 0.012);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
    }

    // Inserción mecánica de moneda
    playCoinInsert() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.08);

        setTimeout(() => {
            if (this.muted || !this.ctx) return;
            const t = this.ctx.currentTime;
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(2600, t);
            osc2.frequency.exponentialRampToValueAtTime(1800, t + 0.12);

            gain2.gain.setValueAtTime(0.28, t);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.12);
        }, 70);
    }

    // Pulsación de botón arcade
    playButton() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Melodía festiva de victoria de las placas taiwanesas
    playWinMelody() {
        if (this.muted || !this.ctx) return;
        const notes = [
            523, 659, 784, 1046, 784, 1046, 1318, 1568, 
            1318, 1568, 2093, 1568, 2093, 2637, 3136
        ];

        notes.forEach((freq, idx) => {
            const start = this.ctx.currentTime + idx * 0.07;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.09);
        });
    }

    // Expulsión de monedas en tolva metálica
    playCoinDispense(count = 10) {
        if (this.muted || !this.ctx) return;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.muted || !this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                const freq = 2200 + Math.random() * 800;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.07);

                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.07);
            }, i * 75);
        }
    }

    // Sirena de bono especial
    playBonusSiren() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.2);
        osc.frequency.linearRampToValueAtTime(400, now + 0.4);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.6);
        osc.frequency.linearRampToValueAtTime(400, now + 0.8);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
    }
}

// ============================================================================
// CASILLAS PERIMETRALES (24 POSICIONES)
// ============================================================================
const FRUIT_SLOTS = [
    // Fila Superior (0 a 6, de izquierda a derecha)
    { id: 0, symbol: 'BAR', name: 'Gran BAR', mult: 50, icon: '🍫', label: 'BAR', color: '#ffd700' },
    { id: 1, symbol: 'APPLE', name: 'Manzana', mult: 5, icon: '🍎', label: 'MANZANA', color: '#ff4757' },
    { id: 2, symbol: 'ORANGE', name: 'Naranja', mult: 10, icon: '🍊', label: 'NARANJA', color: '#ffa502' },
    { id: 3, symbol: 'BELL', name: 'Campana', mult: 20, icon: '🔔', label: 'CAMPANA', color: '#eccc68' },
    { id: 4, symbol: 'WATERMELON', name: 'Sandía', mult: 20, icon: '🍉', label: 'SANDÍA', color: '#2ed573' },
    { id: 5, symbol: 'APPLE', name: 'Manzana', mult: 5, icon: '🍎', label: 'MANZANA', color: '#ff4757' },
    { id: 6, symbol: '77', name: '77 Suerte', mult: 40, icon: '7️⃣7️⃣', label: '77', color: '#70a1ff' },

    // Columna Derecha (7 a 11, de arriba a abajo)
    { id: 7, symbol: 'MANGO', name: 'Mango', mult: 15, icon: '🥭', label: 'MANGO', color: '#ff7f50' },
    { id: 8, symbol: 'STAR', name: 'Estrella', mult: 30, icon: '⭐', label: 'ESTRELLA', color: '#fffa65' },
    { id: 9, symbol: 'APPLE', name: 'Manzana', mult: 5, icon: '🍎', label: 'MANZANA', color: '#ff4757' },
    { id: 10, symbol: 'ORANGE', name: 'Naranja', mult: 10, icon: '🍊', label: 'NARANJA', color: '#ffa502' },
    { id: 11, symbol: 'BELL', name: 'Campana', mult: 20, icon: '🔔', label: 'CAMPANA', color: '#eccc68' },

    // Fila Inferior (12 a 18, de derecha a izquierda)
    { id: 12, symbol: 'BONUS', name: '¡Bono Mario!', mult: 0, icon: '🍄', label: 'BONUS', color: '#ff007f' },
    { id: 13, symbol: 'WATERMELON', name: 'Sandía', mult: 20, icon: '🍉', label: 'SANDÍA', color: '#2ed573' },
    { id: 14, symbol: 'APPLE', name: 'Manzana', mult: 5, icon: '🍎', label: 'MANZANA', color: '#ff4757' },
    { id: 15, symbol: '77', name: '77 Suerte', mult: 40, icon: '7️⃣7️⃣', label: '77', color: '#70a1ff' },
    { id: 16, symbol: 'MANGO', name: 'Mango', mult: 15, icon: '🥭', label: 'MANGO', color: '#ff7f50' },
    { id: 17, symbol: 'STAR', name: 'Estrella', mult: 30, icon: '⭐', label: 'ESTRELLA', color: '#fffa65' },
    { id: 18, symbol: 'APPLE', name: 'Manzana', mult: 5, icon: '🍎', label: 'MANZANA', color: '#ff4757' },

    // Columna Izquierda (19 a 23, de abajo a arriba)
    { id: 19, symbol: 'ORANGE', name: 'Naranja', mult: 10, icon: '🍊', label: 'NARANJA', color: '#ffa502' },
    { id: 20, symbol: 'BELL', name: 'Campana', mult: 20, icon: '🔔', label: 'CAMPANA', color: '#eccc68' },
    { id: 21, symbol: 'WATERMELON', name: 'Sandía', mult: 20, icon: '🍉', label: 'SANDÍA', color: '#2ed573' },
    { id: 22, symbol: 'MANGO', name: 'Mango', mult: 15, icon: '🥭', label: 'MANGO', color: '#ff7f50' },
    { id: 23, symbol: 'BAR', name: 'Mini BAR', mult: 25, icon: '🍫', label: 'BAR x25', color: '#ffd700' }
];

const BET_SYMBOLS = [
    { key: 'BAR', label: 'BAR', mult: 50, icon: '🍫', color: '#ffd700' },
    { key: '77', label: '77', mult: 40, icon: '7️⃣', color: '#70a1ff' },
    { key: 'STAR', label: 'ESTRELLA', mult: 30, icon: '⭐', color: '#fffa65' },
    { key: 'WATERMELON', label: 'SANDÍA', mult: 20, icon: '🍉', color: '#2ed573' },
    { key: 'BELL', label: 'CAMPANA', mult: 20, icon: '🔔', color: '#eccc68' },
    { key: 'MANGO', label: 'MANGO', mult: 15, icon: '🥭', color: '#ff7f50' },
    { key: 'ORANGE', label: 'NARANJA', mult: 10, icon: '🍊', color: '#ffa502' },
    { key: 'APPLE', label: 'MANZANA', mult: 5, icon: '🍎', color: '#ff4757' }
];

// Constante: cada apuesta unitaria equivale a 5 monedas
const COINS_PER_BET = 5;

// ============================================================================
// CLASE DEL JUEGO
// ============================================================================
class SuerteYFrutaGame {
    constructor() {
        this.sound = new FrutitasSoundEngine();

        this.credits = 100;      // 100 MONEDAS INICIALES SEGÚN REQUERIMIENTO
        this.totalBet = 0;       // Total apostado en la ronda actual
        this.lastWin = 0;        // Última ganancia
        this.previousBets = {};  // Memoria de ronda previa

        this.bets = {};
        BET_SYMBOLS.forEach(s => { this.bets[s.key] = 0; });

        this.currentPosition = 0;
        this.isSpinning = false;
        this.pendingWinnings = 0;
        this.lastPredictedHit = false;

        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.renderBoard();
        this.renderBetButtons();
        this.updateDisplays();
        this.highlightSlot(this.currentPosition);
    }

    // Renderiza las 24 casillas perimetrales
    renderBoard() {
        const boardContainer = document.getElementById('fruit-board-perimeter');
        if (!boardContainer) return;

        const existingSlots = boardContainer.querySelectorAll('.fruit-slot');
        existingSlots.forEach(el => el.remove());

        const gridPositions = [
            { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 }, { col: 7, row: 1 },
            { col: 7, row: 2 }, { col: 7, row: 3 }, { col: 7, row: 4 }, { col: 7, row: 5 }, { col: 7, row: 6 },
            { col: 7, row: 7 }, { col: 6, row: 7 }, { col: 5, row: 7 }, { col: 4, row: 7 }, { col: 3, row: 7 }, { col: 2, row: 7 }, { col: 1, row: 7 },
            { col: 1, row: 6 }, { col: 1, row: 5 }, { col: 1, row: 4 }, { col: 1, row: 3 }, { col: 1, row: 2 }
        ];

        FRUIT_SLOTS.forEach((slot, index) => {
            const pos = gridPositions[index];
            const slotEl = document.createElement('div');
            slotEl.className = 'fruit-slot';
            slotEl.id = `slot-${index}`;
            if (pos) {
                slotEl.style.gridColumn = `${pos.col}`;
                slotEl.style.gridRow = `${pos.row}`;
            }
            slotEl.innerHTML = `
                <div class="slot-led-indicator"></div>
                <div class="slot-icon">${slot.icon}</div>
                <div class="slot-label">${slot.label}</div>
                <div class="slot-mult">x${slot.mult}</div>
            `;
            boardContainer.appendChild(slotEl);
        });
    }

    // Renderiza la botonera frontal de 8 símbolos
    renderBetButtons() {
        const panel = document.getElementById('fruit-bet-buttons');
        if (!panel) return;
        panel.innerHTML = '';

        BET_SYMBOLS.forEach(symbol => {
            const btn = document.createElement('div');
            btn.className = 'arcade-bet-btn';
            btn.dataset.symbol = symbol.key;
            btn.title = `Apostar a ${symbol.label} (+${COINS_PER_BET} monedas)`;
            btn.innerHTML = `
                <div class="bet-btn-top">
                    <span class="bet-icon">${symbol.icon}</span>
                    <span class="bet-mult">x${symbol.mult}</span>
                </div>
                <div class="bet-btn-title">${symbol.label}</div>
                <div class="bet-btn-counter" id="bet-counter-${symbol.key}">00</div>
            `;

            btn.addEventListener('click', () => {
                this.sound.init();
                this.addBet(symbol.key);
            });

            panel.appendChild(btn);
        });
    }

    // Cada apuesta vale 5 monedas
    addBet(symbolKey) {
        if (this.isSpinning) return;

        // Comprobar si tiene al menos 5 monedas
        if (this.credits < COINS_PER_BET) {
            this.showMarqueeMessage('¡SIN MONEDAS SUFICIENTES! (MÍNIMO 5) 🪙', '#ff4757');
            this.sound.playTick(0.5);

            // Al no tener monedas, disparar modal de compra cómico
            if (window.showShopModal) {
                setTimeout(() => window.showShopModal(this.credits, 'frutitas'), 600);
            }
            return;
        }

        this.credits -= COINS_PER_BET;
        this.totalBet += COINS_PER_BET;
        this.bets[symbolKey] = (this.bets[symbolKey] || 0) + COINS_PER_BET;

        this.sound.playButton();
        this.updateDisplays();
        this.showMarqueeMessage(`APUESTA +${COINS_PER_BET} A ${symbolKey} (Total: ${this.bets[symbolKey]})`, '#ffa502');
    }

    // Inserción de moneda mecánica (+10 monedas)
    insertCoin(amount = 10) {
        this.sound.init();
        this.sound.playCoinInsert();

        this.credits += amount;
        this.updateDisplays();
        this.showMarqueeMessage(`¡MONEDA INSERTADA! +${amount} MONEDAS 🪙`, '#2ed573');

        const slotEl = document.getElementById('coin-slot-mouth');
        if (slotEl) {
            slotEl.classList.add('coin-inserted');
            setTimeout(() => slotEl.classList.remove('coin-inserted'), 300);
        }
    }

    clearBets() {
        if (this.isSpinning) return;
        this.sound.init();
        this.sound.playButton();

        this.credits += this.totalBet;
        this.totalBet = 0;
        BET_SYMBOLS.forEach(s => { this.bets[s.key] = 0; });

        this.updateDisplays();
        this.showMarqueeMessage('APUESTAS BORRADAS', '#ced6e0');
    }

    repeatBet() {
        if (this.isSpinning) return;
        this.sound.init();
        this.sound.playButton();

        let neededCredits = 0;
        Object.keys(this.previousBets).forEach(k => {
            neededCredits += this.previousBets[k];
        });

        if (neededCredits === 0) {
            this.showMarqueeMessage('NO HAY APUESTA PREVIA GUARDADA', '#ffa502');
            return;
        }

        if (this.credits < neededCredits) {
            this.showMarqueeMessage('¡MONEDAS INSUFICIENTES PARA REPETIR!', '#ff4757');
            if (window.showShopModal) {
                setTimeout(() => window.showShopModal(this.credits, 'frutitas'), 600);
            }
            return;
        }

        this.credits += this.totalBet;
        this.totalBet = 0;
        BET_SYMBOLS.forEach(s => { this.bets[s.key] = 0; });

        Object.keys(this.previousBets).forEach(k => {
            this.bets[k] = this.previousBets[k];
        });
        this.credits -= neededCredits;
        this.totalBet = neededCredits;

        this.updateDisplays();
        this.showMarqueeMessage('¡APUESTA ANTERIOR REPETIDA!', '#2ed573');
    }

    // Iniciar tirada con dirección: 'RIGHT' (horario) o 'LEFT' (antihorario)
    startSpin(direction = 'RIGHT') {
        if (this.isSpinning) return;
        this.sound.init();

        if (this.totalBet === 0) {
            this.showMarqueeMessage('¡HAZ TU APUESTA ANTES DE GIRAR!', '#ffa502');
            this.sound.playTick(0.6);
            return;
        }

        this.previousBets = { ...this.bets };
        this.isSpinning = true;
        this.updateControlButtons();

        const dirText = direction === 'LEFT' ? '◀ IZQUIERDA' : 'DERECHA ▶';
        this.showMarqueeMessage(`¡GIRANDO HACIA LA ${dirText}!`, '#ffd700');

        // Casilla destino aleatoria
        const targetIndex = Math.floor(Math.random() * FRUIT_SLOTS.length);
        const stepDir = direction === 'LEFT' ? -1 : 1;

        // Distancia exacta según la dirección
        const distance = direction === 'LEFT'
            ? (this.currentPosition - targetIndex + FRUIT_SLOTS.length) % FRUIT_SLOTS.length
            : (targetIndex - this.currentPosition + FRUIT_SLOTS.length) % FRUIT_SLOTS.length;

        // 3 vueltas completas mínimas + distancia final
        const totalSteps = FRUIT_SLOTS.length * 3 + distance;

        let step = 0;
        let currentSpeed = 30; // ms por casilla en velocidad crucero

        const runLoop = () => {
            this.currentPosition = (this.currentPosition + stepDir + FRUIT_SLOTS.length) % FRUIT_SLOTS.length;
            this.highlightSlot(this.currentPosition);

            step++;
            const remaining = totalSteps - step;
            const pitchRatio = remaining > 15 ? 1.0 : (0.7 + (remaining / 15) * 0.3);
            this.sound.playTick(pitchRatio);

            if (step >= totalSteps) {
                this.onSpinComplete(targetIndex);
            } else {
                if (remaining < 18) {
                    currentSpeed += 24;
                } else if (remaining < 30) {
                    currentSpeed += 8;
                } else if (step < 10) {
                    currentSpeed = Math.max(30, currentSpeed - 5);
                }
                setTimeout(runLoop, currentSpeed);
            }
        };

        runLoop();
    }

    // Fin de la tirada
    onSpinComplete(finalIndex) {
        this.isSpinning = false;
        this.updateControlButtons();

        const slot = FRUIT_SLOTS[finalIndex];
        const betOnSlot = this.bets[slot.symbol] || 0;
        this.flashSlot(finalIndex);

        // Bono Mario
        if (slot.symbol === 'BONUS') {
            this.handleBonusRound();
            return;
        }

        // Si sale la pronosticada (había apostado a esta figura)
        if (betOnSlot > 0) {
            const winAmount = betOnSlot * slot.mult;
            this.lastWin = winAmount;
            this.credits += winAmount;
            this.pendingWinnings = winAmount;
            this.lastPredictedHit = true;

            this.sound.playWinMelody();
            this.showMarqueeMessage(`¡¡ACERTASTE ${slot.name.toUpperCase()}!! GANAS +${winAmount} MONEDAS 💰`, '#2ed573');

            // SE ACTIVA EL DOBLE O NADA AL ACERTAR LA PRONOSTICADA
            setTimeout(() => {
                this.enableDoubleOrNothing(winAmount);
            }, 600);

            this.spawnFallingCoins(Math.min(15, Math.max(4, Math.floor(winAmount / 10))));
        } else {
            // No acertó la figura
            this.lastWin = 0;
            this.pendingWinnings = 0;
            this.lastPredictedHit = false;
            this.showMarqueeMessage(`SALIÓ ${slot.name.toUpperCase()} (x${slot.mult}). ¡Inténtalo de nuevo!`, '#ff4757');

            // Si se quedó sin monedas suficientes para apostar (< 5), misma lógica que en Blackjack
            if (this.credits < COINS_PER_BET) {
                setTimeout(() => {
                    if (window.showShopModal) {
                        window.showShopModal(this.credits, 'frutitas');
                    }
                }, 1300);
            }
        }

        // Limpiar apuestas para la siguiente mano
        this.totalBet = 0;
        BET_SYMBOLS.forEach(s => { this.bets[s.key] = 0; });
        this.updateDisplays();
    }

    handleBonusRound() {
        this.sound.playBonusSiren();
        this.showMarqueeMessage('⭐ ¡¡¡BONO MARIO PIRATA ACTIVADO!!! ⭐', '#ff007f');

        let extraWinners = [];
        const possibleIndices = [0, 2, 4, 6, 8, 10, 13, 15, 17, 21];

        while (extraWinners.length < 2) {
            const rand = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
            if (!extraWinners.includes(rand)) extraWinners.push(rand);
        }

        setTimeout(() => {
            let totalBonusWin = 0;
            extraWinners.forEach(idx => {
                this.flashSlot(idx);
                const extraSlot = FRUIT_SLOTS[idx];
                const bet = this.bets[extraSlot.symbol] || 0;
                if (bet > 0) {
                    totalBonusWin += bet * extraSlot.mult;
                }
            });

            if (totalBonusWin > 0) {
                this.credits += totalBonusWin;
                this.sound.playWinMelody();
                this.showMarqueeMessage(`¡¡PREMIO EXTRA DE BONO: +${totalBonusWin} MONEDAS!! 🎉`, '#ffd700');
                this.spawnFallingCoins(12);
                this.enableDoubleOrNothing(totalBonusWin);
            } else {
                this.showMarqueeMessage('¡El Bono no coincidió con tus apuestas! ¡Sigue jugando!', '#ffa502');
                if (this.credits < COINS_PER_BET && window.showShopModal) {
                    setTimeout(() => window.showShopModal(this.credits, 'frutitas'), 1200);
                }
            }

            this.totalBet = 0;
            BET_SYMBOLS.forEach(s => { this.bets[s.key] = 0; });
            this.updateDisplays();
        }, 1200);
    }

    // Modal Doble o Nada (Izquierda / Derecha o Menor / Mayor)
    enableDoubleOrNothing(amount) {
        const modal = document.getElementById('fruit-gamble-panel');
        if (modal) {
            modal.style.display = 'flex';
            const potEl = document.getElementById('gamble-pot-display');
            if (potEl) potEl.textContent = amount;
            const diceEl = document.getElementById('gamble-dice-result');
            if (diceEl) diceEl.textContent = '?';
        }
    }

    playDoubleOrNothing(choice) {
        this.sound.init();
        const diceRoll = Math.floor(Math.random() * 12) + 1; // 1 a 12
        const isLeftOrLow = diceRoll <= 6;
        const isRightOrHigh = diceRoll >= 7;

        const won = (choice === 'LEFT' && isLeftOrLow) || (choice === 'RIGHT' && isRightOrHigh);

        const diceEl = document.getElementById('gamble-dice-result');
        if (diceEl) diceEl.textContent = diceRoll;

        if (won) {
            this.pendingWinnings *= 2;
            this.credits += this.pendingWinnings / 2;
            this.sound.playWinMelody();
            this.showMarqueeMessage(`¡¡DUPLICASTE A ${this.pendingWinnings} MONEDAS!! (Salió ${diceRoll})`, '#2ed573');
            document.getElementById('gamble-pot-display').textContent = this.pendingWinnings;
            this.spawnFallingCoins(8);
        } else {
            this.credits -= this.pendingWinnings;
            this.pendingWinnings = 0;
            this.showMarqueeMessage(`¡Perdiste el Doble o Nada! (Salió ${diceRoll})`, '#ff4757');
            this.closeDoubleOrNothing();

            // Si se quedó sin monedas
            if (this.credits < COINS_PER_BET) {
                setTimeout(() => {
                    if (window.showShopModal) {
                        window.showShopModal(this.credits, 'frutitas');
                    }
                }, 1200);
            }
        }
        this.updateDisplays();
    }

    closeDoubleOrNothing() {
        const modal = document.getElementById('fruit-gamble-panel');
        if (modal) modal.style.display = 'none';
    }

    cashOut() {
        if (this.credits <= 0) {
            this.showMarqueeMessage('NO TIENES MONEDAS PARA COBRAR', '#ffa502');
            return;
        }

        const payout = this.credits;
        this.credits = 0;
        this.updateDisplays();

        this.sound.playCoinDispense(Math.min(20, Math.max(5, Math.floor(payout / 5))));
        this.spawnFallingCoins(25);
        this.showMarqueeMessage(`¡¡EXPULSANDO ${payout} MONEDAS POR LA BANDEJA!! 🪙`, '#ffd700');

        const tray = document.getElementById('fruit-coin-tray');
        if (tray) {
            tray.classList.add('tray-rattling');
            setTimeout(() => tray.classList.remove('tray-rattling'), 1500);
        }

        // Si quedó en 0, ofrecer recarga cómica
        setTimeout(() => {
            if (window.showShopModal) {
                window.showShopModal(0, 'frutitas');
            }
        }, 2200);
    }

    // Acreditar monedas desde la pasarela cómica
    creditCoins(amount, packageName = 'Recarga') {
        this.credits += amount;
        this.updateDisplays();
        this.sound.playWinMelody();
        this.sound.playCoinDispense(8);
        this.spawnFallingCoins(15);
        this.showMarqueeMessage(`¡¡RECARGA EXITOSA: +${amount} MONEDAS!! 🪙`, '#2ed573');
    }

    highlightSlot(index) {
        document.querySelectorAll('.fruit-slot').forEach(el => {
            el.classList.remove('active-light');
        });

        const activeEl = document.getElementById(`slot-${index}`);
        if (activeEl) {
            activeEl.classList.add('active-light');
        }
    }

    flashSlot(index) {
        const el = document.getElementById(`slot-${index}`);
        if (!el) return;
        el.classList.add('winner-flash');
        setTimeout(() => el.classList.remove('winner-flash'), 2500);
    }

    updateDisplays() {
        const pad = (n) => String(n).padStart(4, '0');
        const pad2 = (n) => String(n).padStart(2, '0');

        const elCredits = document.getElementById('display-credits');
        const elBet = document.getElementById('display-total-bet');
        const elWin = document.getElementById('display-winner');

        if (elCredits) elCredits.textContent = pad(this.credits);
        if (elBet) elBet.textContent = pad(this.totalBet);
        if (elWin) elWin.textContent = pad(this.lastWin);

        BET_SYMBOLS.forEach(s => {
            const counter = document.getElementById(`bet-counter-${s.key}`);
            if (counter) counter.textContent = pad2(this.bets[s.key] || 0);
        });
    }

    updateControlButtons() {
        const btnSpinLeft = document.getElementById('btn-spin-left');
        const btnSpinRight = document.getElementById('btn-spin-right');
        if (btnSpinLeft) btnSpinLeft.disabled = this.isSpinning;
        if (btnSpinRight) btnSpinRight.disabled = this.isSpinning;
    }

    showMarqueeMessage(msg, color = '#ffd700') {
        const marquee = document.getElementById('fruit-marquee-text');
        if (marquee) {
            marquee.textContent = msg;
            marquee.style.color = color;
        }
    }

    spawnFallingCoins(count = 8) {
        const tray = document.getElementById('fruit-coin-tray-mouth');
        if (!tray) return;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.className = 'physical-metal-coin';
                coin.style.left = `${10 + Math.random() * 80}%`;
                coin.style.animationDuration = `${0.45 + Math.random() * 0.25}s`;
                tray.appendChild(coin);

                setTimeout(() => coin.remove(), 1200);
            }, i * 65);
        }
    }
}

window.frutitasGame = new SuerteYFrutaGame();
