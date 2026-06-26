import { Card } from './components/card.js';

const app = document.getElementById('app');
const pruebaData = { title: "Prueba", artistDisplayName: "Artista" };
const miTarjeta = new Card(pruebaData);
app.appendChild(miTarjeta.render());
