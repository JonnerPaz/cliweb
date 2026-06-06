import { PokeApi } from "../api/pokeapi.js";
import { createCard } from "./createCard.js";
import gameEngine from "../core/gameEngine.js";

const api = new PokeApi();

/**
 * @description - Shuffles an array using Fisher-Yates algorithm
 */
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

/**
 * @description - Carga aleatoriamente un conjunto de Pokemons
 * @param {number} pairsCount - Cantidad de pares de Pokemons
 */
async function fetchPokemons(pairsCount) {
  // Obtener Pokemons
  const promises = [];
  for (let i = 0; i < pairsCount; i++) {
    promises.push(api.getRandomPokemon(PokeApi.MAX_POKEMON_NUM));
  }

  const results = await Promise.all(promises);
  return results.filter((res) => res.isSuccess).map((res) => res.value);
}

/**
 * @description - Crea las tarjetas de Pokemons
 * @param {PokemonEntity[]} deck - Conjunto de Pokemons
 */
function createCards(deck) {
  return deck.map((pokemon, index) => {
    const onClickCard = (card) => gameEngine.handleCardClick(card);
    return createCard(pokemon, index, (card) => onClickCard(card));
  });
}

/**
 * @description - Renderiza la grilla de Pokemons
 * @param {HTMLElement} container - Contenedor donde se van a colocar las tarjetas
 * @param {number} pairsCount - Cantidad de pares de Pokemons
 * @param {function} onWinCallback - Funcion que se ejecuta cuando se gana el juego
 * @param {function} onTurnUpdateCallback - Funcion que se ejecuta cuando se actualiza el turno
 */
export async function renderBoard(
  container,
  pairsCount,
  onWinCallback,
  onTurnUpdateCallback
) {
  container.innerHTML = `
    <div class="gameboard-loading">
      <h2>Cargando Pokémon...</h2>
    </div>
  `;

  try {
    const validPokemons = await fetchPokemons(pairsCount);

    // Si no hay suficientes pokemons, mostrar error
    if (validPokemons.length < pairsCount) {
      throw new Error("No se encontraron suficientes Pokémon.");
    }

    const rawDeck = shuffle([...validPokemons, ...validPokemons]);
    gameEngine.init(pairsCount, onWinCallback, onTurnUpdateCallback);

    container.innerHTML = "";

    // Crear grilla donde se van a colocar las tarjetas
    const gridContainer = document.createElement("div");
    gridContainer.className = "gameboard";
    const cols = Math.sqrt(pairsCount * 2);
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Crear tarjetas
    const cards = createCards(rawDeck);
    cards.forEach((cardApi) => {
      gridContainer.appendChild(cardApi.element);
    });

    // Mostrar grilla en DOM
    container.appendChild(gridContainer);

    return {
      cards,
      cleanup: () => {
        container.innerHTML = "";
      },
    };
  } catch (error) {
    console.error("Error inicializando el tablero:", error);
    container.innerHTML = `<div class="error">Error cargando el juego. Intenta de nuevo.</div>`;
    return { cleanup: () => {} };
  }
}
