import { Home } from "./pages/Home.js";
import { MusicToggle } from "./components/organism/MusicToggle.js";

const app = document.getElementById("app");
app.appendChild(new Home());
app.appendChild(new MusicToggle());
