/*
 * @description Crea un card de pokemon
 * @param {PokemonEntity} pokemon - Objeto con los datos del pokemon
 * @param {number} index - Indice del pokemon
 * @param {function} onCardClick - Funcion que se ejecuta cuando se hace click en el card
 */
export function createCard(pokemon, index, onCardClick) {
  const cardElement = document.createElement("article");
  cardElement.className = "card gameboard__card";
  cardElement.dataset.index = index;
  cardElement.dataset.pokemonId = pokemon.id;
  cardElement.dataset.pokemonName = pokemon.name;

  const imageUrl =
    pokemon.image || (pokemon.sprites && pokemon.sprites.front) || "";

  cardElement.innerHTML = `
    <div class="card__side card__side--back">
      <div class="pokeball">
        <div class="pokeball__button"></div>
      </div>
    </div>
    <div class="card__side card__side--front">
      <div class="card__image-container">
        <img class="card__image" src="${imageUrl}" alt="${pokemon.name}" loading="lazy" />
      </div>
    </div>
  `;

  let isFlipped = false;
  let isMatched = false;

  const cardAPI = {
    element: cardElement,
    pokemon: pokemon,
    flip: () => {
      isFlipped = !isFlipped;
      cardElement.classList.toggle("is-flipped", isFlipped);
    },
    markAsMatched: () => {
      isMatched = true;
      cardElement.classList.add("is-matched");
    },
    unflip: () => {
      isFlipped = false;
      cardElement.classList.remove("is-flipped");
    },
    get isFlipped() {
      return isFlipped;
    },
    get isMatched() {
      return isMatched;
    },
  };

  cardElement.addEventListener("click", () => {
    if (!isMatched && !isFlipped) {
      onCardClick(cardAPI);
    }
  });

  return cardAPI;
}
