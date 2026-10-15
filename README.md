# Salón de Juegos Interactivos - GR3 (ISWD823)

**Autor:** Leonardo Maldonado  
**Institución:** Escuela Politécnica Nacional (EPN)  
**Materia:** Juegos Interactivos (ISWD823 - GR3)  
**Tecnologías:** HTML5, CSS3 Moderno, JavaScript, Phaser 3, Web Audio API  

---

## 🎮 Plataforma y Menú Principal

El proyecto cuenta con un **Menú Principal (Lobby de Juegos)** interactivo que permite alternar fluidamente entre dos juegos completos:

1. **♠ Blackjack 21 Royale** (Casino interactivo profesional en Phaser 3)
2. **🍒 Suerte & Fruta** (Máquina tragamonedas retro clásica de barrio de los años 80/90)

---

## ♠ 1. Blackjack 21 Royale

Implementación completa de un juego de cartas de casino sobre el framework **Phaser 3**.

### Características:
- **Gráficos procedimentales**: Generación dinámica de la baraja completa de 52 cartas y reverso ornamental mediante Canvas API sin dependencias externas de imágenes.
- **5 denominaciones de fichas de casino**: $5, $25, $50, $100 y $500 con física de apilado.
- **Mecánicas oficiales**: Blackjack Natural con pago 3 a 2, crupier obligatorio de pedir con 16 y plantarse con 17, carta oculta con animación 3D de volteo (flip), Pedir (Hit), Plantarse (Stand) y Doblar (Double Down).
- **Easter Egg Cómico ("Tienda de Fichas de Broma")**:
  - Si el jugador pierde sus fichas o baja a $20 o menos, se activa una ventana satírica con 3 paquetes exagerados (+500, +2,500 y +10,000 fichas).
  - Incluye un formulario cómico con tarjeta de débito virtual interactiva, botón para rellenar tarjetas falsas y acreditación gratuita de fichas tras una divertida simulación bancaria.
  - Disponible en cualquier momento desde el botón **"🛒 Tienda de Fichas"**.

### Controles de Blackjack:
- **Ratón**: Clic en fichas, botones y modales.
- **Teclado**:
  - <kbd>ESPACIO</kbd> o <kbd>H</kbd>: Pedir Carta (Hit)
  - <kbd>S</kbd>: Plantarse (Stand)
  - <kbd>D</kbd>: Doblar Apuesta (Double Down)
  - <kbd>ENTER</kbd>: Repartir / Nueva Mano
  - <kbd>C</kbd>: Limpiar Apuesta

---

## 🍒 2. Suerte & Fruta (Taiwan Golden Star 90s)

Inspirado en las míticas máquinas tragamonedas de barrio latinoamericano, basadas en clones de placas arcade taiwanesas y chinas de los años 80 y 90 (las famosas placas **Golden Star** / **Taiwan Fruit Machine** o **Super Alianza**):

### Características y Mecánicas:
- **Economía y Apuestas**:
  - **100 Monedas Iniciales** disponibles para jugar.
  - **Cada apuesta equivale a 5 monedas** por figura.
- **Lanzamiento con Dirección**:
  - El jugador puede elegir lanzar el giro hacia la **◀ IZQUIERDA (Antihorario)** o **DERECHA ▶ (Horario)** con botones directos.
- **Cuadro Perimetral de 24 Luces LED**:
  - Casillas con multiplicadores: **BAR (x50)**, **77 (x40)**, **Estrella (x30)**, **Sandía (x20)**, **Campana (x20)**, **Mango (x15)**, **Naranja (x10)** y **Manzana (x5)**.
  - Casilla especial de **¡Bono Mario!** que dispara luces múltiples con premios aleatorios acumulados.
  - Curva de aceleración y desaceleración progresiva con beeps digitales retro de 8 bits.
- **Doble o Nada al Acertar la Pronosticada**:
  - Si la luz frena en una figura apostada, se activa automáticamente el **Doble o Nada**: el jugador elige **◀ IZQUIERDA (1-6)** o **DERECHA (7-12) ▶** para duplicar sus monedas o puede presionar **💰 COBRAR PREMIO**.
- **Pasarela Cómica en Bancarrota**:
  - Si el jugador se queda sin monedas (< 5), se activa la misma pasarela satírica de tarjeta de débito para recargar +500, +2,500 o +10,000 monedas gratis (o pedir limosna +100).
- **Bandeja Metálica y Expulsión Real de Monedas**:
  - Al cobrar o ganar premios grandes, la máquina expulsa monedas doradas animadas que caen y rebotan en la bandeja inferior con traqueteo metálico.

---

## 🚀 Cómo Ejecutar el Proyecto

Puedes abrir directamente el archivo [first-game/index.html](file:///c:/Users/Leo/Desktop/EPN/JuegosInter/maldonado-leonardo-jueg-gr3/first-game/index.html) en tu navegador habitual, o levantarlo con un servidor local:

```bash
# Servidor local con Python (ya activo en puerto 8080)
python -m http.server 8080 --directory first-game

# Acceso en el navegador
http://localhost:8080
```
