# Plan de Desarrollo — LeagueHub

> **Deportes:** Fútbol, Básquet, Tenis
> **Plazo:** 1-2 semanas
> **Modalidad:** Trabajo en pareja

---

## Fase 0 — Fundación (Día 1) — HACER JUNTOS

- [ ] Crear estructura de carpetas:
  ```
  LeagueHub/
  ├── index.html
  ├── css/
  │   └── styles.css
  ├── js/
  │   ├── app.js          (entry point, router)
  │   ├── db.js            (capa IndexedDB)
  │   ├── sports-terms.js  (mapa de terminología)
  │   ├── router.js        (hash router)
  │   ├── components/      (Custom Elements)
  │   └── views/           (lógica de cada vista)
  └── assets/
  ```
- [ ] `index.html` básico: navbar placeholder, `<main id="app">`, footer
- [ ] Implementar **NavBar** (Custom Element) con logo, liga activa, enlaces
- [ ] Implementar **Footer** (Custom Element) con créditos y estado IndexedDB
- [ ] Implementar **Toast**, **ConfirmDialog**, **LoadingState** como Custom Elements
- [ ] Implementar **hash router** básico que cargue vistas según `window.location.hash`
- [ ] Definir estructura de los 3 deportes en `sports-terms.js`:
  - **Fútbol:** `eventName: "Gol"`, `gf: "GF"`, `gc: "GC"`, `scorers: "Goleadores"`
  - **Básquet:** `eventName: "Canasta"`, `gf: "PF"`, `gc: "PC"`, `scorers: "Encestadores"`
  - **Tenis:** `eventName: "Punto"`, `gf: "PF"`, `gc: "PC"`, `scorers: "Punteadores"`

---

## Fase 1 — Capa de Datos (Día 1-2) — HACER JUNTOS

- [ ] Abrir DB `leaguehub-db` con versionado (`onupgradeneeded`)
- [ ] Crear 5 object stores con índices:
  - `leagues`: índice por `name` (único), `isActive`
  - `teams`: índices por `leagueId`, `name`
  - `players`: índices por `teamId`, `name`
  - `matches`: índices por `leagueId`, `homeTeamId`, `awayTeamId`, `date`, `status`
  - `events`: índices por `matchId`, `playerId`
- [ ] Implementar funciones helper en `db.js`:
  - `openDB()` → instancia única
  - `getAll(storeName)`, `getById(storeName, id)`, `getByIndex(storeName, index, value)`
  - `add(storeName, data)`, `put(storeName, data)`, `delete(storeName, id)`
  - `runTransaction(stores, mode, callback)` → para operaciones de integridad
  - `getActiveLeague()`, `setActiveLeague(id)` (con LocalStorage)

---

## Fase 2A — Estudiante A: Ligas, Partidos, Transacciones (Días 2-5)

- [ ] **Vista `#leagues`:**
  - [ ] Listado de ligas (tarjetas con nombre, deporte, temporada, #equipos, #partidos)
  - [ ] Crear liga (formulario con nombre, deporte, modalidad, vueltas o #equipos, temporada)
  - [ ] Editar liga (nombre, temporada, descripción — modalidad bloqueada)
  - [ ] Activar liga (transaccional, desactiva la anterior, persiste en LocalStorage)
  - [ ] Eliminar liga (con confirmación, borra en cascada todo)
  - [ ] Botón "Generar fixture" (liga) → algoritmo round-robin
  - [ ] Botón "Generar bracket" (eliminación directa) → bracket con slots
  - [ ] Exportar liga a JSON
  - [ ] Importar liga desde JSON (validación + transacción)
- [ ] **Vista `#matches`:**
  - [ ] Listado con filtros (estado, equipo, fecha, ronda)
  - [ ] Crear/editar partido (solo modalidad liga) con validaciones
- [ ] **Vista `#match/:id`:**
  - [ ] Cabecera con equipos, fecha, estado
  - [ ] **EventForm** (Custom Element) — registrar anotaciones por equipo
  - [ ] Acumulador visual de eventos (local | visitante)
  - [ ] **Operación: Finalizar partido** — transacción que:
    1. Actualiza match a "Finalizado" con marcador
    2. Actualiza estadísticas de ambos equipos
    3. Actualiza estadísticas de jugadores anotadores
    4. Persiste eventos
    5. En eliminación directa: avanza ganador al siguiente partido
  - [ ] **Operación: Deshacer partido** — transacción inversa
  - [ ] Validación: no deshacer si el siguiente partido ya está finalizado
  - [ ] Manejo de empate en eliminación directa (selector de ganador)

---

## Fase 2B — Estudiante B: Equipos, Jugadores, Estadísticas (Días 2-5)

- [ ] **Vista `#teams`:**
  - [ ] Galería de tarjetas de equipos con escudo
  - [ ] Crear/editar equipo (nombre, escudo URL, colores, ciudad)
  - [ ] Eliminar equipo (bloqueado si tiene partidos; en cascada con jugadores si no)
- [ ] **Vista `#team/:id`:**
  - [ ] Cabecera con estadísticas (PJ, PG, PE, PP, PF, PC, DIF, Pts)
  - [ ] Plantilla de jugadores
  - [ ] Próximos partidos y partidos jugados
  - [ ] Mini gráfico de líneas (evolución de puntos)
- [ ] **Vista `#players`:**
  - [ ] Filtros: búsqueda con debounce, por equipo, por posición
  - [ ] Galería de tarjetas
  - [ ] Crear/editar jugador
  - [ ] Eliminar jugador (bloqueado si tiene eventos)
- [ ] **Vista `#player/:id`:**
  - [ ] Cabecera con foto, nombre, equipo, número
  - [ ] Estadísticas: PJ, anotaciones, promedio
  - [ ] Historial de partidos donde anotó
  - [ ] Mini gráfico de barras (anotaciones por partido)
- [ ] **Vista `#stats`:**
  - [ ] **StandingsTable** (liga) — ordenado por pts, DIF, PF
  - [ ] **BracketView** (eliminación directa) — árbol visual de rondas
  - [ ] **RankingTable** — top 10 anotadores
  - [ ] 3 gráficos avanzados con Chart.js (barras top 10, líneas multi-equipo, +1 a elección)

---

## Fase 3 — Dashboard (Días 5-6) — ESTUDIANTE B

- [ ] **Vista `#dashboard`:**
  - [ ] Cabecera con nombre de liga, deporte, temporada
  - [ ] Mensaje vacío si no hay ligas + botón "Crear primera liga"
  - [ ] Tarjeta de próximo partido y último resultado
  - [ ] Mini tabla top 5 (liga) o resumen de bracket (eliminación directa)
  - [ ] 3 gráficos Chart.js:
    - Barras/radar: equipos con más puntos a favor
    - Torta/anillo: distribución resultados (V/E/D)
    - Líneas: evolución de puntos por fecha
  - [ ] Manejo de "No hay datos suficientes" en gráficos

---

## Fase 4 — Integración y Pruebas (Días 6-7) — AMBOS

- [ ] Integrar vistas de ambos estudiantes, probar navegación completa
- [ ] Verificar que el router de hash funciona con botones atrás/adelante
- [ ] Probar los 12 escenarios de prueba manual (sección 9 del documento)
- [ ] Verificar que los cambios de liga activa redirigen al dashboard
- [ ] Verificar que la terminología cambia según el deporte de la liga activa
- [ ] Verificar persistencia: cerrar/abrir navegador

---

## Fase 5 — Pulido (Días 7-8 si hay tiempo)

- [ ] Identidad visual por deporte (paletas de colores, iconos, tipografía)
- [ ] Ligas plantilla de ejemplo precargadas para test rápido
- [ ] README.md completo (nombres, división de trabajo, deportes, instrucciones, capturas, esquema DB, decisiones técnicas)
- [ ] Capturas de pantalla de las 9 vistas con 2+ deportes
