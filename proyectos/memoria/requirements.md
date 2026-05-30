# Especificaciones del Proyecto: "Memory Match" (Edición en Pareja)
* **Curso:** Desarrollo de Lenguajes para Clientes Web
* **Tecnologías:** HTML5, CSS3, JavaScript (Vanilla)
* **Modalidad:** Trabajo en pareja (2 integrantes)
* **Duración estimada:** 2
* **Profesor:** Ing. Victor Kneider
---

## 1. Descripción General

El objetivo de este proyecto es desarrollar un juego de memoria ("Memory Match") interactivo trabajado en pareja. La aplicación debe generar dinámicamente un tablero de cartas basado en la dificultad seleccionada por el usuario y ofrecer **tres modos de juego distintos**: un modo solitario cronometrado, un modo multijugador local por turnos y un modo libre de práctica.

Además, la aplicación debe permitir al jugador elegir entre **varias temáticas visuales**, desbloquear **logros durante la partida** y finalizar mostrando una **pantalla de resumen con estadísticas detalladas**. El proyecto pone énfasis en el flujo de juego, la calidad visual y la coordinación entre los dos integrantes de la pareja.

## 2. Objetivos de Aprendizaje

Al finalizar este proyecto, los estudiantes serán capaces de:

* Utilizar **CSS Grid o Flexbox** para generar estructuras bidimensionales dinámicas y responsivas.
* Manipular el **DOM** (crear, leer, actualizar y eliminar nodos) mediante JavaScript nativo.
* Manejar **eventos** del navegador y la lógica del flujo de una aplicación (inicio, validación, fin, reinicio).
* **Organizar el código JavaScript en múltiples archivos** según su responsabilidad y coordinarlos mediante etiquetas `<script>` en el `index.html`.
* **Trabajar de forma colaborativa** con Git, dividiendo responsabilidades, resolviendo conflictos y manteniendo un historial de commits consistente por ambos integrantes.

---

## 3. Requerimientos Funcionales

### 3.1. Pantalla de Inicio y Configuración
Al cargar la página, el usuario debe ver una interfaz de configuración que incluya:

* **Modo de juego:** Selector entre las tres modalidades disponibles (ver sección 3.2).
* **Campo(s) de texto para nombre(s) del / los jugador(es):**
    * En modo solitario y modo libre se solicita un solo nombre.
    * En modo PvP se solicitan **dos nombres** (Jugador 1 y Jugador 2).
* **Selector de Dificultad:** Permite elegir las dimensiones del tablero:
    * **Fácil:** 4x4 (16 cartas).
    * **Intermedio:** 6x6 (36 cartas).
    * **Difícil:** 8x8 (64 cartas).
* **Selector de Temática Visual:** Permite elegir entre al menos **3 temáticas distintas** que cambian el set de imágenes/iconos de las cartas y la paleta de colores general (ver sección 3.4).
* **Botón "Iniciar Juego":** Al activarse, debe ocultar el menú, generar el tablero correspondiente e iniciar la partida según el modo elegido.

### 3.2. Modos de Juego

La aplicación debe ofrecer **tres modos de juego** seleccionables desde la pantalla inicial. Todos comparten la mecánica básica de voltear cartas y emparejar

#### 3.2.1. Modo Solitario Cronometrado
* Un solo jugador.
* Se inicia un **cronómetro** en cuanto se voltea la primera carta.
* El cronómetro se detiene al encontrar todos los pares.
* El MENU muestra: nombre del jugador, tiempo transcurrido y contador de movimientos.
* Al terminar se muestra la pantalla de fin de partida con las estadísticas correspondientes.

#### 3.2.2. Modo PvP Local (Dos Jugadores por Turnos)
* Dos jugadores comparten la misma máquina y se turnan.
* El MENU muestra ambos nombres, el puntaje de pares de cada uno y **resalta visualmente al jugador que tiene el turno activo**.
* **Mecánica de turnos:**
    1. El jugador activo voltea dos cartas.
    2. **Si coinciden:** suma un par a su puntaje y **mantiene el turno**.
    3. **Si no coinciden:** las cartas se ocultan y el **turno pasa al otro jugador**.
* La partida termina cuando se emparejan todas las cartas.
* Gana el jugador con más pares; debe contemplarse el caso de **empate** y mostrarlo de forma clara.
* La pantalla de fin de partida muestra los resultados de ambos jugadores y declara al ganador (o el empate).

#### 3.2.3. Modo Libre (Práctica)
* Un solo jugador, sin cronómetro y sin presión.
* El MENU muestra solo el contador de movimientos y los pares encontrados.
* Está orientado a familiarizarse con las cartas de una temática o practicar tableros grandes.
* Al terminar la partida se muestra una pantalla de fin con estadísticas básicas, pero sin tiempo ni evaluación de rendimiento.

### 3.3. Dinámica del Tablero
* El tablero debe generarse **íntegramente desde JavaScript** tras la selección de dificultad y modo.
* Las cartas deben iniciar "boca abajo". El contenido (emojis, iconos o imágenes locales) se asigna de forma aleatoria en cada partida.
* **Mecánica de juego (común a todos los modos):**
    1. El jugador voltea dos cartas consecutivamente.
    2. **Si coinciden:** permanecen visibles y se marcan como "emparejadas".
    3. **Si no coinciden:** se vuelven a ocultar tras un breve retraso.
* **Restricción de flujo:** Mientras se está mostrando el resultado de un par incorrecto, el tablero debe **bloquear nuevos clics** para evitar selecciones encadenadas. El feedback visual del error debe mostrarse en pantalla (no con `alert()`).

### 3.4. Sistema de Temáticas Visuales
* La aplicación debe ofrecer **mínimo 3 temáticas visuales** seleccionables antes de iniciar la partida. Ejemplos válidos: animales, espacio, frutas, banderas, emojis, deportes, etc.
* Cada temática debe modificar **al menos:**
    * El conjunto de iconos/imágenes usados en las cartas.
* La temática elegida se mantiene durante toda la partida y puede cambiarse al volver al menú principal.
* El cambio de temática debe ser visible de forma inmediata, sin necesidad de recargar la página.

### 3.5. Sistema de Logros en Sesión
Durante la partida deben desbloquearse **logros visibles en pantalla** según el desempeño del jugador. Los logros son válidos solo durante la sesión actual (no se persisten entre recargas).

Se requiere implementar **mínimo 4 logros** distintos, que pueden incluir (a modo de ejemplo):

| Logro | Condición |
| :--- | :--- |
| Primer paso | Encontrar el primer par de la partida. |
| Racha caliente | Encontrar 3 pares consecutivos sin fallar. |
| Velocista | Completar el modo fácil en menos de 30 segundos. |
| Sin titubeos | Encontrar un par en el primer intento (movimientos #1 y #2). |

Cada logro debe **notificarse visualmente** en el momento en que se desbloquea (por ejemplo, mediante una notificación flotante o una insignia que aparece en pantalla). **No se permite usar `alert()` para estas notificaciones**.

### 3.6. Interfaz de Seguimiento (MENU)
Durante la partida debe ser visible en todo momento:

* El o los nombres de los jugadores.
* Un **contador de movimientos** (intentos realizados).
* El **cronómetro** (solo en modo solitario cronometrado).
* El **puntaje de cada jugador y el turno activo** (solo en modo PvP).
* Un botón de **Reiniciar** para volver a la pantalla de configuración inicial.
* Los logros desbloqueados durante la partida en curso.

### 3.7. Pantalla de Fin de Partida
Al completar todas las parejas debe mostrarse una **pantalla de resumen** integrada al DOM (no `alert`) que contenga, según el modo:

* Tiempo total empleado (modo solitario).
* Total de movimientos.
* Total de pares encontrados.
* Tasa de aciertos (pares correctos / movimientos).
* Lista de logros desbloqueados durante esa partida.
* En modo PvP: puntaje de cada jugador y mensaje del ganador (o empate).
* Botones para **"Jugar de nuevo"** (misma configuración) y **"Volver al menú"**.

---

## 4. Requerimientos Técnicos

### 4.1. Maquetación y Estilos (HTML/CSS)
* **Estructura HTML:** Debe ser semántica y bien organizada, utilizando elementos apropiados para cada sección.
* **Diseño Responsivo:** Uso de **CSS Grid o Flexbox** para la disposición de las cartas y la estructura general. Las columnas y filas deben adaptarse dinámicamente según la dificultad elegida.
* **Estética Visual:** Diseño coherente con paleta de colores, tipografía consistente y espaciado apropiado para cada temática.
* **Animaciones y transiciones:** Se requiere implementar al menos:
    * Animación de **giro (flip)** de las cartas mediante transformaciones CSS.
    * Feedback visual diferenciado para parejas **correctas** (por ejemplo, brillo o pulso) e **incorrectas** (por ejemplo, sacudida).
* **Pantalla de fin de partida:** Debe presentarse como un modal o vista a pantalla completa integrada al DOM, con transición visual de entrada.

### 4.2. Lógica y Estructura (JavaScript)
* **Sin librerías externas:** No se permite el uso de jQuery, frameworks o utilidades externas. Todo el código debe ser JavaScript puro (Vanilla).
* **Manipulación del DOM:** Uso de métodos como `createElement`, `appendChild`, `classList` y manejo de eventos con `addEventListener`.
* **Prohibido:** El uso de `alert()`, `confirm()` o `prompt()` para cualquier interacción con el usuario. Todos los mensajes (victoria, derrota, error, logros, configuración) deben integrarse al DOM.
* **Organización en múltiples archivos:** El código JavaScript debe estar separado en **varios archivos** según su responsabilidad. Los archivos se cargan desde `index.html` mediante etiquetas `<script>` en el orden correcto. **No se requiere ni se evaluará el uso de módulos ES (`import`/`export`)** — las funciones declaradas en cada archivo quedan disponibles en el ámbito global.

### 4.3. Estructura de Archivos Sugerida

A modo de referencia, una organización válida del proyecto es:

```
/proyecto
  index.html
  /css
    styles.css
  /js
    menu.js          → pantalla de inicio y selección de configuración
    board.js         → generación y manejo del tablero
    game.js          → lógica común del juego (voltear, validar pares, bloquear tablero)
    modes.js         → reglas específicas de cada modo (solitario, PvP, libre)
    timer.js         → cronómetro
    MENU.js           → renderizado del MENU (nombres, movimientos, tiempo, turnos)
    achievements.js  → definición y verificación de logros
    themes.js        → catálogo de temáticas e iconos
    endScreen.js     → pantalla de fin de partida
    app.js           → punto de entrada / coordinación general
  /assets
    /themes
      ...            → imágenes o iconos por temática (si aplica)
```

Esta estructura es una **sugerencia**; la pareja puede ajustarla siempre que justifique la separación por responsabilidades y mantenga la carga ordenada de scripts en `index.html`.

### 4.4. Originalidad y Personalización
* **Identidad del Juego:** El proyecto debe incluir un **nombre original y creativo** que le dé personalidad al juego (diferente a "Memory Match", que es solo el nombre genérico del proyecto).
* **Temática Visual:** La pareja debe diseñar al menos 3 temáticas coherentes y originales que unifiquen toda la aplicación (colores, tipografías, iconografía de las cartas).
* **Elementos Personalizados:** Se valorará la creatividad en:
    * El diseño visual de las cartas y sus animaciones.
    * La interfaz de usuario y su presentación.
    * Detalles adicionales que hagan única la experiencia (efectos visuales, mensajes personalizados, micro-interacciones, etc.).

---

## 5. Modalidad de Trabajo en Pareja

El proyecto se desarrolla en parejas de **dos integrantes**. Ambos miembros son responsables del producto final en su totalidad, pero deben repartir el trabajo de forma equilibrada y dejar evidencia de ello.

La **coordinación de la arquitectura general** (estructura de archivos, definición de qué función vive en qué archivo, integración final) es **responsabilidad conjunta**.

### 5.2. Evidencia de Trabajo Colaborativo
* **Ambos integrantes deben tener commits propios** en el repositorio de forma consistente a lo largo de las 2-3 semanas. No se aceptarán repositorios donde más del 80% de los commits sean de un solo integrante.
* En la presentación final, **ambos integrantes deben poder explicar cualquier parte del código**, no únicamente la suya.

---

## 6. Entrega y Control de Versiones

> **Nota:** Los criterios y la escala de evaluación del proyecto están detallados en el documento de **rúbrica** adjunto, publicado junto a este enunciado en Google Classroom.

### 6.1. Repositorio Git
* El proyecto debe estar alojado en un repositorio de Git (GitHub).
* El repositorio debe tener configurados como colaboradores a **ambos integrantes** desde el inicio del proyecto.
* **Estructura recomendada de commits:**
    * Commit inicial con estructura básica del proyecto.
    * Commits incrementales por funcionalidad (pantalla de inicio, lógica del tablero, modo solitario, modo PvP, temáticas, logros, pantalla final, etc.).
    * Mensajes de commit descriptivos en español o inglés, consistentes en idioma.

### 6.2. Entregables
1. **Código fuente completo** en repositorio Git (link entregado por Google Classroom).
2. Aplicación funcionando localmente abriendo `index.html` (no requiere servidor).
3. **Archivo `README.md`** que incluya:
    * Nombre original del juego y descripción.
    * Nombres de los dos integrantes y división del trabajo realizado.
    * Instrucciones para ejecutar el proyecto.
    * Lista de temáticas implementadas.
    * Lista de logros implementados y cómo se desbloquean.
    * Capturas de pantalla de la aplicación.

---
