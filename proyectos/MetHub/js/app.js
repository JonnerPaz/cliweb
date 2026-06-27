import "./components/nav-bar.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/art-card.js";

const app = document.getElementById("app");
const card = document.createElement("art-card");
card.data = {
  title: "Prueba",
  artistDisplayName: "Artista",
  objectDate: "1900",
  department: "Test",
};
app.appendChild(card);
