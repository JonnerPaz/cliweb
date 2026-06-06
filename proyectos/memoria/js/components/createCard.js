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

  cardElement.innerHTML = `
    <div class="card__side card__side--front">
      <div class="card__picture card__picture--1" style="background-image: url(${pokemon.image || ""})">&nbsp;</div>
      <h4 class="card__heading">
        <span class="card__heading-span card__heading-span--1">
            ${pokemon.name}
        </span>
      </h4>
    </div>
    <div class="card__side card__side--back card__side--back-1">
      <div class="card__cta">
        <div class="card__price-box">
          <p class="card__price-only">Poké</p>
        </div>
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
