# 📝 Ejercicio integrador — Clase 2 (HTML & CSS)

> **Objetivo:** demostrar que dominas los 4 temas de la clase **construyendo una página completa desde cero, sin frameworks ni librerías**.

---

## 🎯 El reto: tu portafolio personal

Vas a construir tu propio portafolio personal en una sola página HTML + CSS. No te vamos a dar el HTML — esa es justamente la prueba.

Vas a usar **todo** lo que aprendiste en la clase:

| Tema | Cómo lo usarás |
|------|----------------|
| HTML semántico | Estructura general con `header`, `nav`, `main`, `section`, `article`, `footer` |
| CSS básico | Selectores, especificidad, tipografía, colores, box model |
| Flexbox | Navbar (logo + menú), botones de redes sociales, footer |
| CSS Grid | Galería de proyectos, sección de habilidades en columnas |

---

## 📐 Especificación de la página

### Estructura mínima (en orden, de arriba a abajo)

1. **Navbar fijo arriba**
   - Tu nombre o logo a la izquierda.
   - Menú con 4 enlaces a la derecha: `#sobre-mi`, `#proyectos`, `#habilidades`, `#contacto`.
   - Al hacer click en cada enlace, la página hace scroll suave a la sección correspondiente.

2. **Hero (sección de bienvenida)**
   - Ocupa toda la pantalla al cargar (`100vh`).
   - Tu nombre como `h1`, una frase corta debajo, un botón "Ver mis proyectos" centrado.
   - Todo verticalmente y horizontalmente centrado.
   - Fondo con un gradiente o color sólido vivo.

3. **Sobre mí** (`#sobre-mi`)
   - Una foto a la izquierda (puedes usar `https://i.pravatar.cc/300`).
   - 2-3 párrafos sobre ti a la derecha.
   - En móvil: la foto va arriba y el texto abajo.

4. **Proyectos** (`#proyectos`)
   - Al menos **6 tarjetas de proyectos** en una galería responsive.
   - Cada tarjeta: imagen, título, descripción corta, etiquetas de tecnologías, botón "Ver más".
   - Se acomodan en columnas según el ancho de la pantalla (mínimo 250px por tarjeta).
   - Todas las tarjetas deben tener exactamente la misma altura aunque el contenido difiera.
   - El botón "Ver más" debe quedar siempre pegado a la base de la tarjeta.

5. **Habilidades** (`#habilidades`)
   - Una grid de habilidades organizadas en categorías (Frontend, Backend, Herramientas, etc.).
   - Cada categoría es una columna con su título y una lista de tecnologías.

6. **Contacto** (`#contacto`)
   - Un formulario con: nombre, email, asunto, mensaje, botón enviar.
   - Validación HTML nativa (campos requeridos, email correcto).
   - Cada campo con su `<label>` asociado.

7. **Footer**
   - Tu nombre y año.
   - Íconos de redes sociales alineados a la derecha (usa emojis o texto si no quieres descargar íconos).

---

## 🚫 Reglas no negociables

- ❌ **NO usar frameworks** (Bootstrap, Tailwind, Material, etc.).
- ❌ **NO copiar/pegar de internet** una solución completa. Inspírate, pero escribe TU código.
- ❌ **NO usar JavaScript** (excepto el scroll suave, que puede ser CSS puro: `scroll-behavior: smooth`).
- ❌ **NO usar `<div>` para todo**. Si no puedes justificar por qué un elemento es `<div>` y no algo semántico, está mal.
- ✅ **Sí usar** Flexbox y Grid donde corresponda.
- ✅ **Sí usar** variables CSS para colores y espaciados (`--primary`, `--gap`, etc.).
- ✅ **Sí debe ser responsive** — pruébalo en móvil (DevTools → modo dispositivo).

---

## 📋 Criterios de evaluación (90 puntos + 10 bonus)

### HTML — 20 puntos
- [ ] (5pts) Estructura completa y válida (DOCTYPE, lang, head con meta, title).
- [ ] (5pts) Uso correcto de etiquetas semánticas (header, nav, main, section, article, footer).
- [ ] (5pts) Todos los `<img>` tienen `alt` descriptivo.
- [ ] (5pts) El formulario tiene labels asociadas, validación nativa y agrupa los campos lógicamente.

### CSS básico — 20 puntos
- [ ] (5pts) Uso de variables CSS (`:root { --... }`) para colores y espaciados.
- [ ] (5pts) Aplica reset/normalización al inicio (`* { box-sizing: border-box; }` mínimo).
- [ ] (5pts) Selectores apropiados (no abuso de ids ni de `!important`).
- [ ] (5pts) Tipografía coherente: jerarquía visual clara entre h1, h2, h3 y párrafos.

### Flexbox — 20 puntos
- [ ] (8pts) Navbar con logo a la izquierda y menú a la derecha, todo alineado verticalmente.
- [ ] (6pts) Hero con contenido perfectamente centrado horizontal y verticalmente.
- [ ] (6pts) En las tarjetas de proyectos: el botón "Ver más" siempre pegado abajo.

### CSS Grid — 20 puntos
- [ ] (10pts) Galería de proyectos responsive sin media queries (usa `auto-fit` + `minmax`).
- [ ] (10pts) Sección de habilidades en grid de columnas con `grid-template-columns`.

### Responsive — 10 puntos
- [ ] (5pts) En móvil (<600px) no hay scroll horizontal en ningún lugar.
- [ ] (5pts) El menú navbar tiene un comportamiento razonable en móvil (puede colapsar a vertical o quedar bien, pero NO superponerse al logo).

### Bonus — +10 puntos
- [ ] (+3pts) Efectos hover suaves en los enlaces y tarjetas.
- [ ] (+3pts) Modo oscuro: agrega una segunda paleta vía variables CSS y un selector (`[data-theme="dark"]`).
- [ ] (+4pts) Reproduce, sin mirar el código, una sección de un portafolio real que admires (cita la fuente).

---

## 📂 Entrega

Estructura de archivos esperada:

```
mi-portafolio/
├── index.html       ← una sola página
├── styles.css       ← todo el CSS aquí, NO inline
└── assets/          ← imágenes propias (opcional)
```

> 🚨 Si encuentras un `<style>` o `style="..."` en tu HTML, está mal. Separación de concerns: HTML para estructura, CSS aparte.

---

## 💡 Consejos antes de empezar

1. **Dibújalo en papel primero.** Sketch del layout antes de tocar el teclado. Te ahorrará horas.
2. **Construye sección por sección**, no todo a la vez. Termina el navbar y vuelve a verlo en el navegador antes de empezar el hero.
3. **Mobile-first es opcional aquí**, pero al menos prueba en móvil al terminar cada sección.
4. **Si te trabas:** abre los `retos.html` del tema correspondiente y revisa esa técnica específica. Pero NO copies — entiende y reescribe.
5. **El "ver más" pegado abajo** es el reto técnico más interesante de este ejercicio. Búscalo en los retos de Flexbox si dudas.

---

## 🏁 Cuando termines

Antes de entregar, responde en un comentario al inicio del HTML:

```html
<!--
  AUTOEVALUACIÓN — completa con sinceridad:
  - ¿Qué parte fue la más difícil y por qué?
  - ¿Qué parte hiciste copiando ideas que no entiendes del todo?
  - Si tuvieras que rehacer este portafolio desde cero mañana, ¿cuánto tardarías?
-->
```

> Esto no es para nota — es para **ti**. Identificar lo que aún no dominas es más valioso que esconderlo.

---

¡Éxito! 🚀
