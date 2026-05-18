# 📝 Ejercicio integrador — Clase 6 (Persistencia)

> **Objetivo:** construir una **app de notas offline-first** que combine LocalStorage e IndexedDB demostrando que sabes elegir la herramienta correcta para cada tipo de dato.

---

## 🎯 El reto: Bloc de Notas con sincronización local

Vas a construir una app de notas estilo Apple Notes / Google Keep, pero todo offline. La app debe funcionar **completa sin internet** porque toda la persistencia es del lado del cliente.

La clave de este ejercicio: **NO usar localStorage para todo NI IndexedDB para todo**. Hay que repartir los datos según su naturaleza.

---

## 📐 Especificación

### Lo que va en LocalStorage (preferencias, datos chicos)

- **Tema** (claro/oscuro).
- **Tamaño de fuente** (chico/medio/grande).
- **Última nota abierta** (id, para restaurar al recargar).
- **Orden de la lista** (por fecha / alfabético / favoritos primero).

### Lo que va en IndexedDB (datos pesados, búsqueda)

- **Las notas en sí**, cada una con:
  ```js
  {
    id: 1234567890,             // timestamp al crear
    titulo: "Mi nota",
    contenido: "Texto largo...",
    favorita: false,
    etiquetas: ["trabajo", "urgente"],
    creada: "2026-05-18T14:30:00",
    modificada: "2026-05-18T15:10:00"
  }
  ```
- Un índice secundario para **buscar por etiqueta**.
- Un índice secundario para **ordenar por fecha de modificación**.

### Funcionalidades mínimas

1. **Lista de notas** a la izquierda con título, fecha y un ícono de favorita.
2. **Editor** a la derecha con título, contenido (textarea) y etiquetas separadas por coma.
3. **Crear, editar, eliminar** notas. Cada acción persiste de inmediato.
4. **Marcar como favorita** desde la lista o desde el editor.
5. **Buscador** que filtra por título O etiqueta — usa el índice de IndexedDB, no JS.
6. **Cambiar tema** (claro/oscuro) — persiste en localStorage. Al recargar, restaura.
7. **Cambiar tamaño de fuente** del editor — persiste en localStorage.
8. **Restaurar última nota abierta** al cargar la app.
9. **Exportar todas las notas** como archivo JSON (clic en botón → descarga).
10. **Importar JSON**: seleccionar archivo, validar, y agregar las notas al IndexedDB (sin duplicar).

---

## 🚫 Reglas no negociables

- ❌ NO usar localStorage para las notas. Solo para preferencias.
- ❌ NO usar IndexedDB para preferencias simples. Solo para notas.
- ❌ NO librerías (Dexie, idb, localForage). API nativa.
- ❌ NO usar `innerHTML` con contenido del usuario (riesgo de XSS en notas).
- ✅ Envuelve la API de IndexedDB en promesas. Toda la lógica de DB con `async/await`.
- ✅ La app debe funcionar **al modo avión**: desconecta internet y prueba todo el flujo.
- ✅ Búsqueda usa el índice de IndexedDB (no `getAll()` + filter en JS).

---

## 📋 Criterios de evaluación (90 puntos + 10 bonus)

### Reparto correcto de datos — 20 puntos
- [ ] (10pts) Preferencias en localStorage, notas en IndexedDB. Sin contaminación entre ambos.
- [ ] (10pts) Las preferencias son strings/JSON simples, las notas son objetos completos.

### LocalStorage — 15 puntos
- [ ] (5pts) Helpers `getPref(key, default)` y `setPref(key, value)` con try/catch para JSON corrupto.
- [ ] (5pts) Tema y tamaño de fuente sobreviven al refresh.
- [ ] (5pts) "Última nota abierta" se restaura correctamente al cargar.

### IndexedDB — 30 puntos
- [ ] (8pts) DB creada con object store `notas` y al menos 2 índices (por etiqueta, por fecha de modificación).
- [ ] (8pts) Helper `promisify(request)` o equivalente para envolver requests.
- [ ] (8pts) CRUD completo funciona con async/await.
- [ ] (6pts) Búsqueda por etiqueta usa el índice (verificable en DevTools: aparece bajo "indices").

### Funcionalidad — 15 puntos
- [ ] (5pts) Crear, editar, eliminar notas funciona.
- [ ] (5pts) Marcar como favorita persiste y se ve.
- [ ] (5pts) Exportar e importar JSON funcionan, importar valida el formato.

### Calidad — 10 puntos
- [ ] (5pts) Manejo de errores: si IndexedDB no abre (modo incógnito en algunos navegadores), muestra mensaje claro.
- [ ] (5pts) Loading visible al cargar la app inicial (cuando la DB todavía no responde).

### Bonus — +10 puntos
- [ ] (+3pts) Soporte offline real: agrega un `manifest.json` y un mensaje "Modo offline" cuando `navigator.onLine` es false.
- [ ] (+3pts) Ordenamiento configurable (por fecha / alfabético / favoritos primero) que persiste en localStorage.
- [ ] (+4pts) Migración: cuando subes la versión de la DB de 1 a 2, agregas un nuevo índice (ej. por palabra clave del título) sin perder las notas existentes. Demuéstralo con notas reales antes y después.

---

## 📂 Entrega esperada

```
bloc-notas/
├── index.html        ← HTML mínimo
├── styles.css        ← incluye variables para tema claro/oscuro
├── app.js            ← orquesta todo
├── prefs.js          ← módulo LocalStorage (getPref/setPref)
└── db.js             ← módulo IndexedDB (abrir, CRUD, búsqueda)
```

> 🚨 Si tu `app.js` accede a `localStorage` o `indexedDB` directamente, lo estás haciendo mal. Pasa por los módulos `prefs.js` y `db.js`.

---

## 💡 Consejos antes de empezar

1. **Empieza por el módulo `db.js`** con la API que tú QUERRÍAS tener: `db.guardar(nota)`, `db.obtener(id)`, `db.listar()`, `db.eliminar(id)`, `db.buscarPorEtiqueta(tag)`. Luego implementa cada función envolviendo IndexedDB.

2. **El módulo `prefs.js` es trivial:** dos funciones, una para get con default y otra para set con JSON.

3. **`app.js` no debería tener `indexedDB.open` ni `localStorage.setItem` directamente.** Solo `db.*` y `prefs.*`.

4. **Prueba al modo avión:** cuando creas que tu app funciona, desconecta el WiFi/datos. ¿Sigue funcionando todo? Si no, no es offline-first.

5. **Si te atascas con IndexedDB:** la API es notablemente verbosa. Tómate 10 minutos para escribir el helper `promisify` y úsalo en TODOS los requests. Verás cómo el código se vuelve legible.

---

## 🏁 Cuando termines

Verifica en DevTools (F12):

- [ ] **Application → Local Storage:** ves `tema`, `tamFuente`, `ultimaNota`, `ordenLista`.
- [ ] **Application → IndexedDB:** ves tu DB con un object store `notas` y al menos 2 índices.
- [ ] **Cierra y vuelve a abrir el navegador:** la app se ve como la dejaste.
- [ ] **Modo incógnito:** la app inicia limpia (es lo esperado), pero no crashea.

Y al inicio de `app.js`:

```js
/*
  AUTOEVALUACIÓN:
  1. ¿Qué dato me costó decidir si iba en localStorage o IndexedDB? ¿Por qué?
  2. ¿En qué punto la API de IndexedDB me obligó a escribir un helper?
  3. Si mañana necesitara sincronizar las notas con un backend, ¿cuánto código tendría que tocar?
  4. ¿Qué refactor dejo pendiente?
*/
```

---

> 💭 **Reflexión final:** la persistencia del lado cliente es lo que separa una "página web" de una "aplicación web". Cuando tu app sobrevive a un refresh y funciona sin internet, ya estás construyendo algo que la gente usa de verdad. Los frameworks modernos (PWA, Service Workers, offline-first) están construidos sobre estas dos APIs que acabas de dominar.

¡Éxito! 💾
