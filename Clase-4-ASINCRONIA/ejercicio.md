# 📝 Ejercicio integrador — Clase 4 (Asincronía + Fetch)

> **Objetivo:** demostrar que dominas asincronía y fetch construyendo una **mini-app de clima en tiempo real** que consume una API pública.

---

## 🎯 El reto: Mini-app de Clima

Vas a construir una app que muestra el clima actual de cualquier ciudad. Sin frameworks, solo HTML + CSS + JS nativo.

| Tema | Cómo lo usarás |
|------|----------------|
| Promesas | Encadenar peticiones, manejar errores con try/catch |
| async/await | Toda la lógica de peticiones |
| Fetch | GET a una API pública de clima |
| Promise.all | Obtener clima de múltiples ciudades en paralelo |
| Manejo de errores | 4 tipos de error distintos con mensajes específicos |

---

## 🌤️ API a consumir: Open-Meteo (gratis, sin API key)

Vas a usar dos endpoints:

### 1. Geocoding (convertir nombre de ciudad → coordenadas)

```
https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=1&language=es
```

Devuelve algo como:

```json
{
  "results": [
    {
      "name": "Madrid",
      "latitude": 40.4165,
      "longitude": -3.70256,
      "country": "España",
      "admin1": "Comunidad de Madrid"
    }
  ]
}
```

### 2. Clima actual (a partir de coordenadas)

```
https://api.open-meteo.com/v1/forecast?latitude=40.41&longitude=-3.70&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
```

Devuelve algo como:

```json
{
  "current": {
    "temperature_2m": 18.5,
    "relative_humidity_2m": 65,
    "weather_code": 2,
    "wind_speed_10m": 12.4
  }
}
```

> El `weather_code` es un número que representa una condición (soleado, lluvia, nieve...). Tabla en [open-meteo.com/en/docs](https://open-meteo.com/en/docs).

---

## 📐 Especificación funcional

### Vista principal

1. **Input + botón "Buscar"**
   - Escribir ciudad y buscar.
   - Enter también busca.
   - Trim + validación de no vacío.

2. **Resultado del clima**
   - Nombre de ciudad, país.
   - Temperatura actual (°C).
   - Sensación: convierte el `weather_code` a un texto y emoji ("☀️ Despejado", "🌧️ Lluvia ligera", etc. — al menos 6 mapeos).
   - Humedad y velocidad del viento.

3. **Lista de ciudades favoritas**
   - Botón "⭐ Guardar" debajo del resultado.
   - Sección inferior: lista de las ciudades guardadas con su clima actual.
   - Cada ciudad guardada tiene botón "🗑️ Quitar".
   - **Persistir** la lista de favoritas en `localStorage`.
   - Al cargar la página, restaurar y refrescar el clima de cada una en **paralelo** con `Promise.all`.

4. **Refrescar todo**
   - Botón "🔄 Refrescar todo" que actualiza el clima de TODAS las ciudades en paralelo y muestra un loading.

---

## 🚫 Reglas no negociables

- ❌ Cero librerías (axios, jQuery, frameworks).
- ❌ Cero `.then()` encadenados. **Todo con `async/await`**.
- ❌ Cero `innerHTML` con datos de la API. Usa `textContent` y `createElement`.
- ❌ Cero `console.log` de errores: el usuario debe ver mensajes en pantalla.
- ✅ `try/catch` en cada función async.
- ✅ Loading visible en cada operación (no la app congelada).
- ✅ Sin API key — Open-Meteo es 100% gratis.

---

## 📋 Criterios de evaluación (90 puntos + 10 bonus)

### Asincronía — 25 puntos
- [ ] (8pts) Toda la lógica async usa `async/await`, no `.then()`.
- [ ] (8pts) Cada función `async` tiene su `try/catch`.
- [ ] (9pts) El refresh de favoritas usa `Promise.all`, no espera secuencialmente.

### Fetch — 25 puntos
- [ ] (8pts) Helper `fetchSeguro(url)` que centraliza manejo de errores HTTP y de red.
- [ ] (8pts) Verificas `response.ok` antes de leer JSON.
- [ ] (9pts) Mostraste claramente la cadena: input → geocoding → coordenadas → clima.

### Manejo de errores — 20 puntos
- [ ] (5pts) Input vacío: mensaje "Escribe una ciudad" sin llamar a la API.
- [ ] (5pts) Ciudad no existe: "No encontramos esa ciudad" (geocoding devuelve `results: []`).
- [ ] (5pts) Red caída: "Sin conexión, revisa tu internet".
- [ ] (5pts) API caída (500): "El servicio de clima está fuera. Intenta luego".

### DOM y UX — 10 puntos
- [ ] (4pts) Loading visible durante cada petición.
- [ ] (3pts) Sin scroll horizontal en móvil.
- [ ] (3pts) Resultado anterior se limpia antes de mostrar uno nuevo.

### Persistencia — 10 puntos
- [ ] (5pts) Favoritas sobreviven a refresh de la página.
- [ ] (5pts) Quitar favorita la elimina del DOM y del localStorage.

### Bonus — +10 puntos
- [ ] (+3pts) Implementas **debounce** en el input para auto-buscar mientras escribe.
- [ ] (+3pts) Usas **AbortController** para cancelar peticiones obsoletas cuando el usuario sigue escribiendo.
- [ ] (+4pts) Diseño cuidado: gradientes, animaciones suaves, íconos coherentes.

---

## 📂 Entrega

Estructura esperada:

```
clima-app/
├── index.html       ← HTML mínimo
├── styles.css       ← todo el CSS
└── script.js        ← toda la lógica
```

---

## 💡 Consejos antes de empezar

1. **Diseña el flujo en papel:** input → buscar → mostrar. Antes de teclear nada.

2. **Construye en orden:**
   - HTML estático con input, botón y zona de resultado.
   - Función `obtenerCoordenadas(ciudad)` que pruebes en consola.
   - Función `obtenerClima(lat, lon)` que pruebes en consola.
   - Función `buscar(ciudad)` que las combine.
   - Renderizado.
   - Favoritas.
   - Refrescar todo.

3. **Una función = un propósito.** Si tu `buscar()` también renderiza y persiste, divídela.

4. **Las promesas más útiles para este ejercicio:**
   - `Promise.all` para refrescar varias ciudades en paralelo.
   - `Promise.allSettled` si quieres que el refresh complete aunque una ciudad falle.

5. **Si te trabas:** los retos de fetch y asincronía cubren cada técnica. Vuelve a ellos.

---

## 🏁 Cuando termines

Abre la consola del navegador y verifica:

- [ ] Cero errores rojos al cargar.
- [ ] Cero errores al buscar una ciudad existente.
- [ ] Errores controlados al buscar "asdfgh".
- [ ] `localStorage.getItem('favoritas')` devuelve un JSON válido.

Y al inicio de tu `script.js` responde:

```js
/*
  AUTOEVALUACIÓN:
  1. ¿Qué parte de la asincronía aún no domino del todo?
  2. ¿Dónde usé Promise.all y dónde Promise.allSettled? ¿Por qué?
  3. Si tuviera que agregar una nueva API (ej. pronóstico de 7 días), ¿cuánto me tardaría?
  4. ¿Qué refactorización dejo pendiente?
*/
```

---

¡Éxito! ☀️🌧️❄️
