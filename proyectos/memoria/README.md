# PokeMory: Juego de Memoria con temática de Pokémon

## Introducción

PokeMory es un juego de memoria inspirado con temática de pokémon. Esta aplicación web 
está siendo desarrollada por Jonner Paz y Vanessa Pérez en el marco de la asignatura 
de lenguajes de clientes web de la Universidad Rafael Urdaneta.

Este documento describe la arquitectura de software, la organización 
de carpetas y el flujo de datos para el proyecto "PokeMory", desarrollado en 
HTML5, CSS3 y JavaScript.

El diseño se fundamenta en dos pilares: **ES Modules (`import`/`export`)** para
la encapsulación del código y **Atomic Design** para la construcción escalable 
de la interfaz de usuario.

## 1. Estructura de Directorios

La base de código está organizada para separar claramente la lógica de negocio,
el manejo del estado, el consumo de APIs externas y la renderización del DOM.

```text
/
├── index.html            -> Punto de entrada. Carga únicamente `<script type="module" src="./js/app.js">`
├── css/
│   └── styles.css        → Estilos globales, variables CSS, utilidades de Grid/Flexbox 
├── assets/
│   └── images/           -> Recursos estáticos locales (fondos, logos)
└── js/
    ├── app.js            -> Entry point: inicializa el router básico y monta la vista inicial
    │
    ├── api/              
    │   └── pokeApi.js    -> Servicios: `fetch` a la PokeAPI, normalización de datos y manejo de errores
    │
    ├── state/            
    │   └── store.js      -> Estado global: almacena jugadores, puntajes, turnos y configuraciones actuales
    │
    ├── core/             -> Lógica de negocio (Independiente del DOM)
    │   ├── timer.js      -> Lógica del cronómetro para el Modo Solitario 
    │   ├── modes.js      -> Reglas de los 3 modos: Solitario, PvP, Libre 
    │   ├── themes.js     -> Definición y validación de las 3 temáticas visuales 
    │   └── achievements.js -> Sistema de verificación para los 4 logros en sesión 
    │
    └── components/       -> Capa de Presentación (Atomic Design)
        ├── 1-atoms/      -> Elementos UI indivisibles
        │   ├── card.js   -> Crea `<article class="card">` y maneja su propia animación de giro 
        │   └── button.js -> Creación estandarizada de botones de la interfaz
        │
        ├── 2-molecules/  -> Agrupación simple de átomos
        │   ├── playerBadge.js -> Combina el nombre del jugador con su puntaje y estado de turno 
        │   └── toast.js       -> Notificación flotante en el DOM para logros  
        │
        ├── 3-organisms/  -> Secciones complejas de la UI
        │   ├── gameBoard.js   -> Genera dinámicamente la cuadrícula (4x4, 6x6, 8x8) inyectando átomos `card` 
        │   ├── hudMenu.js     -> Panel superior que renderiza `timer` y `playerBadge`s 
        │   └── configForm.js  -> Formulario de selección de modo, dificultad, temática y nombres 
        │
        └── 4-pages/      -> Vistas principales orquestadoras
            ├── Home.js        -> Vista inicial de configuración 
            ├── Game.js        -> Vista principal del juego activo (integra HUD y Tablero)
            └── Results.js     -> Vista modal/pantalla final con estadísticas y opciones de reinicio 
```


## 2. Flujo de Datos y Módulos

Al utilizar ES Modules, abandonamos la dependencia del ámbito global (window).
El flujo de ejecución es el siguiente:

1. Inicialización (`app.js`): El archivo actúa como un orquestador. Importa la página 
Home.js y la renderiza en el contenedor principal del index.html.

2. Configuración (`components/4-pages/Home.js`): Captura los eventos del formulario 
inicial y guarda la configuración llamando a los métodos exportados por state/store.js.

3. Generación del Tablero (`components/3-organisms/gameBoard.js`): Lee la dificultad 
y la temática desde store.js. Si la temática es Pokémon, realiza una llamada asíncrona
a la pokeapi para obtener los sprites necesarios antes de renderizar las cartas.

4. Mecánica de Juego (`core/modes.js` y `components/1-atoms/card.js`): Al hacer clic 
en una carta, esta despacha un evento o llama a una función del core para validar el par.
El core evalúa la coincidencia, bloquea temporalmente el tablero si es necesario,
actualiza el store.js, y notifica a la UI que debe re-renderizar los puntajes 
o mostrar un logro (`achievements.js -> toast.js`).

## 3. Manejo del estado (`state/store.js`)

Dado que Vanilla JS no cuenta con reactividad nativa, el estado se maneja mediante 
un módulo centralizado que exporta funciones getter y setter.

```javascript
// Ejemplo conceptual del estado
let gameState = {
  mode: null, // 'solitario' | 'pvp' | 'libre'
  difficulty: null, // 16 | 36 | 64
  theme: 'pokemon',
  players: [],
  currentPlayerIndex: 0,
  moves: 0,
  pairsFound: 0,
  achievementsUnlocked: []
};

export const getState = () => ({ ...gameState });
export const updateState = (updates) => {
  gameState = { ...gameState, ...updates };
  // Aquí se podrían disparar eventos personalizados del DOM para notificar a la UI
}
};
```
