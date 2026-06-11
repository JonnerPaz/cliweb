import { PokeApi } from "../api/pokeapi.js";
import { createCard } from "./createCard.js";
import gameState from "../state/GameState.js";

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
  const theme = gameState.theme;

  if (theme !== "random") {
    const pokemonsByType = await api.getPokemonsByType(theme);

    if (pokemonsByType.isError) {
      throw new Error(`Error al obtener Pokemons: ${pokemonsByType.error}`);
    }

    if (!pokemonsByType.value) {
      throw new Error("No se encontraron Pokemons");
    }

    const shuffledPokemons = shuffle(pokemonsByType.value);

    // Devolvemos la cantidad de pares de Pokemons, no todos los que traiga la API
    return shuffledPokemons.slice(0, pairsCount);
  }

  const promises = [];
  for (let i = 0; i < pairsCount; i++) {
    promises.push(api.getRandomPokemon(PokeApi.MAX_POKEMON_NUM));
  }

  const results = await Promise.all(promises);

  if (results.some((res) => res.isError)) {
    throw new Error("Error al obtener Pokemons");
  }

  return results.map((res) => res.value);
}

function createCards(deck, engine) {
  return deck.map((pokemon, index) => {
    return createCard(pokemon, index, (card) => engine.handleCardClick(card));
  });
}

export async function renderBoard(container, pairsCount, engine) {
  // Mostramos un "spinner" (XD) mientras se cargan los Pokémon
  container.innerHTML = `
    <div class="gameboard-loading">
      <h2>Cargando Pokémon...</h2>
    </div>
  `;

  try {
    const validPokemons = await fetchPokemons(pairsCount);

    if (validPokemons.length < pairsCount) {
      throw new Error("No se encontraron suficientes Pokémon.");
    }

    const rawDeck = shuffle([...validPokemons, ...validPokemons]);
    engine.init(pairsCount);

    container.innerHTML = "";

    const gridContainer = document.createElement("div");
    const cols = Math.sqrt(pairsCount * 2);
    gridContainer.className = `gameboard gameboard--${cols}`;

    const cards = createCards(rawDeck, engine);
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
