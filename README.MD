# 🚀 Lenguaje de Clientes Web

> Curso completo de desarrollo web frontend · Universidad Rafael Urdaneta · Ing. Victor Kneider

Este repositorio contiene **todo el material del curso**: teoría, retos prácticos y ejercicios integradores. Está pensado para que cada alumno pueda recorrerlo a su ritmo, ejecutar el código, romperlo, y reconstruirlo desde cero.

---

## 🎯 Cómo abrir el curso

### Opción A — la fácil (recomendada para empezar)
Abre el archivo **`index.html`** raíz haciendo doble click. Funciona en cualquier máquina sin configuración previa, navega por toda la estructura desde ahí.

### Opción B — la profesional (con servidor local)
Para una experiencia más realista (sin restricciones de `file://`):

```bash
# Si tienes Python (la mayoría sí):
python -m http.server 8000
# Luego abre http://localhost:8000

# Si tienes Node:
npx serve
# Luego abre la URL que muestre

# Si usas VS Code:
# Instala la extensión "Live Server", clic derecho sobre index.html → "Open with Live Server"
```

---

## 📚 Estructura del curso

```
URU-LenguajeClientesWeb/
├── index.html              ← Hub principal del curso
├── assets/
│   ├── base.css           ← Sistema visual compartido (variables, componentes)
│   └── favicon.svg
├── Clase-2-HTML-CSS/      ← HTML semántico, CSS, Flexbox, Grid
├── Clase-3-JAVASCRIPT/    ← Basics, DOM, Events, JSON
├── Clase-4-ASINCRONIA/    ← Callbacks, Promesas, async/await, Fetch, PokeAPI
├── Clase-5-COMPONENTES/   ← Progresión: del botón simple a Custom Elements
├── Clase-6-PERSISTENCIA/  ← LocalStorage e IndexedDB
└── GIT/                    ← Git hacks (semana introductoria)
```

Cada clase sigue el mismo patrón:

| Archivo | Qué contiene |
|---------|--------------|
| `index.html` | Hub con objetivos, ruta sugerida y enlaces a todo el material de la clase |
| Teoría (`tema/index.html`) | Material explicativo de cada subtema |
| Retos (`retos.html` o `tema/retos.html`) | 5 retos prácticos progresivos + bonus |
| `ejercicio.md` | Ejercicio integrador que combina todos los temas de la clase |
| Contenido.pdf (cuando aplica) | Material complementario |

---

## 🛠️ Filosofía de los retos

Los retos **no son ejercicios de escribir lo que ya viste**. Cada uno te da:

- **📥 Código base** que copias en un archivo nuevo.
- **🎯 Misión** clara: qué debes lograr.
- **💡 Pistas** colapsadas — úsalas solo si te atascas, no antes.
- **✅ Autocomprobación** con checkboxes para que tú mismo valides.

> **La regla del bonus:** después de resolver un reto, borra todo y reescríbelo desde cero sin mirar. Ahí es donde realmente aprendes.

---

## 📖 Qué cubre cada clase

### Clase 2 — HTML & CSS
HTML semántico, selectores CSS, especificidad, box model, display, **Flexbox** (1D) y **CSS Grid** (2D). Ejercicio integrador: portafolio personal completo.

### Clase 3 — JavaScript
Variables modernas (`let`/`const`), funciones, arrays con `map`/`filter`/`reduce`, manipulación del **DOM**, **eventos** (incluyendo delegación) y **JSON**. Ejercicio integrador: gestor de tareas funcional.

### Clase 4 — Asincronía
Callbacks → Promesas → `async/await`. `Promise.all`/`race`/`allSettled`. **Fetch API** y consumo de APIs reales (PokeAPI con UI guiada incluida). Ejercicio integrador: app de clima en tiempo real.

### Clase 5 — Componentes
Progresión de 5 pasos: del botón a mano (3 botones repetidos) hasta **Custom Elements** nativos (`extends HTMLElement`). Retos: badge, contador, toggle, modal, card. Ejercicio integrador: Kanban con Custom Elements.

### Clase 6 — Persistencia
**LocalStorage** (datos simples) e **IndexedDB** (datos estructurados, offline-first). Tabla comparativa para decidir cuándo usar cada uno. Ejercicio integrador: bloc de notas offline-first.

### Extra — Git & GitHub
8 hacks progresivos para dominar Git, branches, GitHub y armar tu repositorio personal de la materia.

---

## 👨‍💻 Cómo trabajar el material

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/<usuario>/URU-LenguajeClientesWeb.git
    cd URU-LenguajeClientesWeb
    ```

2. **Abre `index.html`** y navega por las clases en orden.

3. **Para cada clase:**
   - Lee la teoría de cada subtema (en orden, siguiendo la ruta sugerida del hub).
   - Pasa a los **retos** y resuélvelos en un archivo aparte (no edites el material original).
   - Al final, descarga el **ejercicio integrador** (botón "📝 Ejercicio integrador" del hub) y construye el proyecto completo en una carpeta separada.

4. **Experimenta sin miedo:** modifica el código de los ejemplos, observa qué pasa, vuelve atrás. Esa es la única forma de aprender a programar para la web.

---

## 🤝 ¿Para profesores?

Si quieres adaptar este material para tu propio curso:

- El sistema visual está centralizado en `assets/base.css`. Cambiar las variables CSS de paleta y todo el curso se reestyle.
- Los ejercicios integradores están en `Clase-X/ejercicio.md` — fáciles de editar.
- Los retos siguen un patrón consistente (HTML + clases del `base.css`) — agregar uno nuevo toma minutos.

---

¡Feliz desarrollo web! 🌐💻✨
