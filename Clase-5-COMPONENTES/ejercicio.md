# 📝 Ejercicio integrador — Clase 5 (Componentes)

> **Objetivo:** construir una **mini app real** compuesta por **tus propios Custom Elements**, demostrando que sabes estructurar una interfaz dividiéndola en piezas reutilizables.

---

## 🎯 El reto: Tablero de tareas (Kanban mínimo)

Vas a construir un tablero de tareas estilo Trello / Jira con 3 columnas (Pendiente / En curso / Hecho) y tarjetas que se pueden agregar, mover entre columnas y eliminar.

Pero la regla es: **toda la UI debe construirse con tus propios componentes** (Custom Elements). El HTML principal solo declara las etiquetas.

```html
<!-- index.html (esto es prácticamente todo) -->
<mi-tablero>
  <mi-columna titulo="Pendiente"></mi-columna>
  <mi-columna titulo="En curso"></mi-columna>
  <mi-columna titulo="Hecho"></mi-columna>
</mi-tablero>

<mi-formulario-tarea></mi-formulario-tarea>
```

---

## 📐 Especificación

### Componentes requeridos (mínimo 4)

| Componente | Responsabilidad |
|------------|-----------------|
| `<mi-tablero>` | Contenedor que organiza columnas horizontalmente |
| `<mi-columna>` | Muestra título + lista de tarjetas. Tiene su estado: lista de tarjetas |
| `<mi-tarjeta>` | Muestra texto + prioridad + botones "✏️ editar", "🗑️ eliminar", "⬅️" y "➡️" para mover |
| `<mi-formulario-tarea>` | Formulario para crear nuevas tarjetas |

### Componentes adicionales sugeridos (bonus)

- `<mi-badge>` — etiqueta de prioridad (alta/media/baja) reutilizada de los retos.
- `<mi-modal>` — para confirmar antes de eliminar una tarjeta.
- `<mi-toggle>` — para alternar entre modo claro/oscuro.

### Funcionalidad mínima

1. **Crear tarjeta**: el formulario tiene un input de texto, un selector de prioridad y un selector de columna inicial. Al enviar, la tarjeta aparece en la columna correspondiente.
2. **Mover tarjeta**: cada tarjeta tiene flechas "⬅️" y "➡️" que la mueven a la columna anterior o siguiente. En los extremos, la flecha correspondiente se deshabilita.
3. **Eliminar tarjeta**: botón 🗑️ con confirmación.
4. **Editar tarjeta**: doble click en el texto lo convierte en input editable.
5. **Persistencia**: el estado del tablero se guarda en `localStorage` y se restaura al recargar la página.

---

## 🚫 Reglas no negociables

- ✅ **Todo es Custom Element**. Cero `document.createElement('div')` en el archivo principal.
- ✅ **Cada componente en su carpeta**: `tablero/`, `columna/`, `tarjeta/`, `formulario/`. Cada uno con su `.js` y su `.css`.
- ✅ **Comunicación entre componentes con eventos personalizados** (`CustomEvent`), nunca con referencias globales o acceso directo a otro componente.
- ✅ **El HTML principal cabe en menos de 30 líneas**. Si tiene más, estás resolviendo en HTML lo que debería resolver tu componente.
- ❌ Cero frameworks.
- ❌ Cero `innerHTML` con texto que viene del usuario (riesgo de XSS).

---

## 📋 Criterios de evaluación (90 puntos + 10 bonus)

### Arquitectura de componentes — 30 puntos
- [ ] (10pts) Los 4 componentes mínimos existen y se usan como etiquetas HTML.
- [ ] (10pts) Cada componente está en su propia carpeta con JS y CSS separados.
- [ ] (10pts) `customElements.define` se llama una vez por componente y los nombres tienen guion.

### Comunicación — 20 puntos
- [ ] (8pts) Las tarjetas notifican sus cambios (mover, eliminar) mediante `CustomEvent`.
- [ ] (6pts) El formulario emite un evento `tarea-creada` con los datos en `detail`.
- [ ] (6pts) Ningún componente accede directamente a otro por `querySelector` global.

### Funcionalidad — 25 puntos
- [ ] (8pts) Crear tarjetas funciona.
- [ ] (8pts) Mover tarjetas entre columnas funciona.
- [ ] (5pts) Eliminar con confirmación funciona.
- [ ] (4pts) Editar in-place funciona.

### Persistencia — 10 puntos
- [ ] (5pts) Al recargar, el tablero se restaura completo.
- [ ] (5pts) Se persiste con `JSON.stringify` + `localStorage` (combina con lo de Clase 3).

### Calidad de código — 5 puntos
- [ ] (5pts) Funciones pequeñas, nombres claros, sin código muerto.

### Bonus — +10 puntos
- [ ] (+3pts) Drag & drop entre columnas en vez de flechas.
- [ ] (+3pts) Reutilizas `<mi-badge>` para la prioridad y `<mi-modal>` para confirmar eliminación.
- [ ] (+4pts) Modo oscuro funcional con `<mi-toggle>`.

---

## 📂 Entrega esperada

```
mi-kanban/
├── index.html              ← muy corto, solo declara componentes
├── styles.css              ← estilos globales (variables, layout)
├── app.js                  ← inicialización + persistencia
└── componentes/
    ├── tablero/
    │   ├── tablero.js
    │   └── tablero.css
    ├── columna/
    │   ├── columna.js
    │   └── columna.css
    ├── tarjeta/
    │   ├── tarjeta.js
    │   └── tarjeta.css
    └── formulario/
        ├── formulario.js
        └── formulario.css
```

---

## 💡 Consejos antes de empezar

1. **Diseña el flujo de eventos en papel:** ¿qué emite cada componente? ¿quién lo escucha? ¿qué responde?

2. **Empieza por el más simple (`<mi-tarjeta>`)** y súbete hasta `<mi-tablero>`. Si construyes de afuera hacia adentro, te bloqueas al primer componente que no funciona.

3. **No anides demasiado pronto.** Haz que `<mi-tarjeta>` funcione sola (puesta a mano en el HTML) antes de meterla dentro de `<mi-columna>`.

4. **Estado en el lugar correcto:** la lista de tarjetas vive en cada `<mi-columna>`. La estructura total (qué columnas hay) vive en `<mi-tablero>`. Cada uno persiste su propio pedazo.

5. **Si te trabas en eventos personalizados:** revisa el reto 2 (contador) y el reto 5 (card) — ahí está exactamente el patrón.

---

## 🏁 Cuando termines

Antes de entregar, verifica en el navegador:

- [ ] Inspector → Elements: ves tus etiquetas (`<mi-tablero>`, `<mi-columna>`, etc.) directamente en el DOM, no son divs disfrazados.
- [ ] Consola: cero errores rojos.
- [ ] Refresh: el estado se conserva.
- [ ] Inspector → Application → Local Storage: ves tu JSON guardado.

Y al inicio de tu `app.js`:

```js
/*
  AUTOEVALUACIÓN:
  1. ¿Qué componente fue más difícil de diseñar? ¿Por qué?
  2. ¿En algún momento tuve la tentación de hacer trampa y acceder a otro componente directamente? ¿Cómo lo resolví?
  3. Si me dieran que agregar un 4to estado (ej. "Archivado"), ¿cuánto tendría que tocar?
  4. ¿Qué refactor dejé pendiente?
*/
```

---

> 💭 **Reflexión final:** lo que acabas de construir es, en pequeño, lo que React, Vue y Angular hacen por ti. Cada uno tiene sintaxis distinta y optimizaciones distintas, pero la idea central es la misma: **una interfaz es la composición de componentes que se comunican entre sí**. Ya sabes el patrón. Cualquier framework moderno que aprendas después será mucho menos misterioso.

¡Éxito! 🧩
