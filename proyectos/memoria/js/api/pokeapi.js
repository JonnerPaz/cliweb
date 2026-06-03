import { PokemonEntity } from "../state/Pokemon.js";

export class PokeApi {
  // Cantidad máxima de pokemons que existen (hasta la 9na generación)
  static MAX_POKEMON_NUM = 1025;

  async _generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @param {number} id - Id del pokemon
   * @returns {Promise<PokemonEntity>} - Objeto con los datos del pokemon
   */
  async getPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    /** @type {import("./Pokemon.dto.js").PokemonResponse} */
    const pokemonRes = await response.json();

    return new PokemonEntity(pokemonRes.name);
  }

  /**
   * @param {string} name - Nombre del pokemon
   * @returns {Promise<PokemonEntity>} - Objeto con los datos del pokemon
   */
  async getPokemonByName(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    /** @type {import("./Pokemon.dto.js").PokemonResponse} */
    const pokemonRes = await response.json();

    return new PokemonEntity(pokemonRes.name);
  }

  async getRandomPokemon(max) {
    if (max < 1 || max > PokeApi.MAX_POKEMON_NUM) {
      return this.getRandomPokemon(PokeApi.MAX_POKEMON_NUM);
    }

    const id = await this._generateRandomNumber(1, max);
    return this.getPokemonById(id);
  }
}
