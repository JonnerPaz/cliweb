# MetHub: Explorador de la Colección del Met

## Descripción del Proyecto

MetHub es una aplicación web de página única (SPA) desarrollada como un cliente interactivo para la API pública del [Metropolitan Museum of Art](https://www.google.com/search?q=https://collectionapi.metmuseum.org/). El sistema permite explorar una colección de aproximadamente 470,000 obras de arte, ofreciendo herramientas avanzadas de filtrado, búsqueda y comparación, todo ello construido exclusivamente con tecnologías web estándar (HTML, CSS y JavaScript Vanilla).

## Estructura del Proyecto

    /met-hub
    ├── index.html          # Contenedor principal (SPA shell)
    ├── css/
    │   └── styles.css      # Estilos globales y específicos de vistas
    ├── js/
    │   ├── app.js          # Punto de entrada, router y lógica global
    │   ├── api.js          # Capa de servicio (fetch, peticiones, AbortController)
    │   ├── views.js        # Renderización dinámica de las seis vistas del  sistema
    │   └── components/     # Custom Elements (ej: Card.js, SearchBar.js)
    └── README.md           # Entregable requerido [cite: 197]

## Instrucciones de Ejecución

1. Clona este repositorio en tu máquina local.
2. Abre el archivo `index.html` directamente en cualquier navegador moderno.
3. No se requiere configuración de servidor local ni dependencias adicionales (Node.js/NPM no son necesarios).
