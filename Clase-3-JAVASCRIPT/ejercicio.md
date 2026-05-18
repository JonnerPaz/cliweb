# 📝 Ejercicio integrador — Clase 3 (JavaScript)

> **Objetivo:** demostrar que dominas los 4 temas de la clase **construyendo una mini-app funcional sin frameworks**.

---

## 🎯 El reto: Gestor de Tareas Personal

Vas a construir una app de tareas (To-Do List) **completamente funcional**, en una sola página HTML + un archivo JS. Sin librerías, sin React, sin nada externo. Solo JavaScript del navegador.

Cada uno de los 4 temas de la clase debe estar presente:

| Tema | Cómo lo usarás |
|------|----------------|
| JS Basics | Variables, funciones, arrays de objetos, métodos `map`/`filter`/`reduce` |
| DOM | Crear y eliminar elementos dinámicamente desde JS |
| Events | Click, submit, keyboard, delegación |
| JSON | Serializar el estado para "guardar" y "exportar" tareas |

---

## 📐 Especificación funcional

### Estado de cada tarea

Cada tarea es un objeto con esta forma:

```js
{
  id: 1234567890,           // timestamp al crearla
  texto: "Hacer la tarea",  // string no vacío
  completada: false,        // boolean
  prioridad: "media",       // "baja" | "media" | "alta"
  creada: "2026-05-18"      // fecha ISO
}
```

### Funcionalidades mínimas

1. **Agregar tarea**
   - Un formulario con: input de texto, selector de prioridad, botón "Agregar".
   - Validación: texto no vacío y al menos 3 caracteres.
   - Al presionar Enter en el input también se agrega.

2. **Listar tareas**
   - Mostrar todas las tareas en una lista.
   - Cada tarea muestra: texto, prioridad (con color: rojo/amarillo/verde), fecha, checkbox "completada", botón "eliminar".
   - Las tareas completadas se ven tachadas (CSS).

3. **Marcar como completada**
   - Al hacer click en el checkbox, la tarea cambia de estado.
   - Persiste el cambio (ver punto 6).

4. **Eliminar tarea**
   - Botón "🗑️" en cada tarea.
   - Pide confirmación antes de eliminar (`confirm()`).

5. **Filtros**
   - 3 botones: "Todas", "Pendientes", "Completadas".
   - Al hacer click, filtra la lista en pantalla sin recargar.

6. **Persistencia con JSON + LocalStorage**
   - Cada vez que cambia el estado (agregar/eliminar/completar), serializar el array de tareas con `JSON.stringify` y guardarlo en `localStorage`.
   - Al cargar la página, leer de `localStorage` con `JSON.parse` y restaurar las tareas.

7. **Exportar/Importar**
   - Botón "📥 Exportar JSON" que descarga un archivo `tareas.json` con todas las tareas (truco: crear un `<a>` con `download` y un Blob).
   - Botón "📤 Importar JSON" que abre un selector de archivo, lee el JSON y restaura el estado (validando que sea JSON válido y con la forma correcta).

8. **Estadísticas**
   - En la parte superior: "Tienes X tareas pendientes, Y completadas. Productividad: Z%".
   - Calculado con `reduce` o `filter` + `length`.

---

## 🚫 Reglas no negociables

- ❌ **NO usar frameworks** (React, Vue, jQuery, etc.).
- ❌ **NO copiar/pegar una solución de internet completa**. Inspírate, pero escribe TU código.
- ❌ **NO usar `innerHTML` para insertar contenido del usuario**. Usa `textContent` o `createElement`. (Riesgo de XSS.)
- ❌ **NO loops `for`** donde puedas usar `map`/`filter`/`reduce`/`forEach`.
- ❌ **NO un solo listener por tarea**. Usa **delegación de eventos** en el contenedor de la lista.
- ✅ **Sí usar** `const`/`let` apropiadamente. `var` en ningún lado.
- ✅ **Sí dividir** el código en funciones pequeñas con un solo propósito.
- ✅ **Sí debe sobrevivir** un refresh de la página (gracias a LocalStorage).

---

## 📋 Criterios de evaluación (90 puntos + 10 bonus)

### JS Basics — 20 puntos
- [ ] (5pts) Variables declaradas con `const` por defecto, `let` solo cuando se reasigna. Cero `var`.
- [ ] (5pts) Funciones pequeñas (idealmente < 20 líneas) con nombres claros.
- [ ] (5pts) Uso correcto de `map`/`filter`/`reduce` en al menos 3 lugares distintos.
- [ ] (5pts) Destructuring en al menos 2 lugares (parámetros de función o asignaciones).

### DOM — 20 puntos
- [ ] (8pts) Crear cada tarea en el DOM con `createElement`, no con `innerHTML`.
- [ ] (6pts) Eliminar elementos del DOM correctamente (no quedan "huérfanos").
- [ ] (6pts) Actualizar la UI sin "redibujar todo" innecesariamente (al marcar completada solo cambia esa tarea, no se borra y rehace toda la lista).

### Events — 20 puntos
- [ ] (8pts) Delegación de eventos: UN solo listener en el contenedor de la lista que maneja click en checkbox y en botón eliminar.
- [ ] (6pts) Submit del formulario con `preventDefault`, no recarga la página.
- [ ] (6pts) Soporte para Enter en el input de texto (sin esperar al botón).

### JSON — 20 puntos
- [ ] (5pts) Persistencia con `JSON.stringify`/`JSON.parse` + LocalStorage funciona al refrescar.
- [ ] (5pts) Exportar descarga un archivo `.json` válido.
- [ ] (5pts) Importar lee un archivo `.json` y restaura el estado.
- [ ] (5pts) Validación: si el JSON importado está mal formado o no tiene la estructura esperada, muestra un mensaje de error claro (no rompe la app).

### Calidad general — 10 puntos
- [ ] (5pts) Estructura visual decente (no tiene que ser bonito, pero sí usable).
- [ ] (5pts) Maneja casos borde: lista vacía muestra "No hay tareas aún", eliminar la última tarea no rompe nada.

### Bonus — +10 puntos
- [ ] (+3pts) Editar tarea: doble click en el texto la convierte en input editable.
- [ ] (+3pts) Ordenar por prioridad o por fecha (selector arriba de la lista).
- [ ] (+4pts) Construye TODA la app inicial **sin guardar el archivo** y refrescando solo al final para probar (modo "TDD visual"): primero piensa todo el flujo en papel y luego escribe sin compilar hasta el final.

---

## 📂 Entrega

Estructura esperada:

```
gestor-tareas/
├── index.html       ← HTML mínimo + link a styles.css y script.js
├── styles.css       ← todo el CSS aquí
└── script.js        ← toda la lógica JS aquí
```

> 🚨 Si tu archivo `script.js` tiene más de 200 líneas, probablemente puedes separar funciones. Si tiene más de 400, definitivamente hay algo que extraer.

---

## 💡 Consejos antes de empezar

1. **Diseña el estado primero.** Antes de tocar HTML, escribe en un papel cómo se vería el array de tareas. Si el estado está bien diseñado, la UI sale sola.

2. **Construye en este orden:**
   - HTML estático (sin JS): formulario + lista vacía + botones.
   - JS para agregar (sin persistencia).
   - JS para listar/eliminar.
   - JS para completar.
   - JS para filtrar.
   - JS para persistir.
   - JS para exportar/importar.

3. **Una función = un propósito.** Si tu función `agregarTarea()` también renderiza y persiste, divídela en `agregarTarea()`, `renderizar()`, `guardar()`.

4. **Re-render simple > diff complejo.** No te compliques con "actualizar solo lo que cambió". Una función `renderizarLista()` que limpia el contenedor y vuelve a dibujar TODO está bien para empezar. (Luego, en el criterio de optimización, podrás mejorarlo.)

5. **Si te atascas:** abre los `retos.html` del subtema correspondiente. Pero NO copies — entiende y reescribe.

---

## 🏁 Cuando termines

Antes de entregar, abre la consola del navegador (F12) y verifica:

- [ ] Cero errores rojos.
- [ ] Cero warnings amarillos (idealmente).
- [ ] `localStorage.getItem('tareas')` devuelve un JSON válido.

Y responde al inicio de tu `script.js`:

```js
/*
  AUTOEVALUACIÓN — completa con sinceridad:
  1. ¿Qué parte fue la más difícil y por qué?
  2. ¿En qué parte usaste código que copiaste sin entender del todo?
  3. Si tuvieras que rehacer esta app desde cero mañana, ¿cuánto tardarías?
  4. ¿Qué harías diferente?
*/
```

> Esto no es para nota — es para **ti**.

---

¡Éxito! 🚀
