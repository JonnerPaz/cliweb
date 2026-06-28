import { Card } from './components/card.js';

window.addEventListener('DOMContentLoaded', () => {
  // Prueba del carrds 
  const app = document.getElementById('app');

  if (!app) {
    console.error('No se encontró el contenedor #app');
    return;
  }

  const miTarjeta = document.createElement('met-card');

  miTarjeta.data = {
    title: 'Prueba',
    artistDisplayName: 'Artista',
    primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/original/DP-14201-001.jpg'
  };

  app.appendChild(miTarjeta);

  console.log('App inyectada y met-card renderizada');
});