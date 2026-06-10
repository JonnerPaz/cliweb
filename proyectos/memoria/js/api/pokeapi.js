import { PokemonEntity } from "../state/Pokemon.js";
import { Result } from "../utils/Result.js";

export class PokeApi {
  // Cantidad máxima de pokemons que existen (hasta la 9na generación)
  static MAX_POKEMON_NUM = 1025;

  async _generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @param {number} id - Id del pokemon
   * @returns {Promise<Result<PokemonEntity, Error>>} - Resultado con los datos del pokemon
   */
  async getPokemonById(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        return Result.err(new Error(`Error HTTP: ${response.status}`));
      }
      /** @type {import("./Pokemon.dto.js").PokemonResponse} */
      const pokemonRes = await response.json();

      const frontSprite =
        pokemonRes.sprites?.other?.dream_world?.front_default ||
        pokemonRes.sprites?.front_default;

      return Result.ok(
        new PokemonEntity({
          id: pokemonRes.id,
          name: pokemonRes.name,
          cries: pokemonRes.cries,
          types: pokemonRes.types,
          sprites: {
            front: frontSprite,
            back: pokemonRes.sprites?.back_default,
          },
        })
      );
    } catch (error) {
      return Result.err(error);
    }
  }

  /**
   * @param {string} name - Nombre del pokemon
   * @returns {Promise<Result<PokemonEntity, Error>>} - Resultado con los datos del pokemon
   */
  async getPokemonByName(name) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) {
        return Result.err(new Error(`Error HTTP: ${response.status}`));
      }

      /** @type {import("./Pokemon.dto.js").PokemonResponse} */
      const pokemonRes = await response.json();

      const frontSprite =
        pokemonRes.sprites?.other?.dream_world?.front_default ||
        pokemonRes.sprites?.front_default;

      return Result.ok(
        new PokemonEntity({
          id: pokemonRes.id,
          name: pokemonRes.name,
          cries: pokemonRes.cries,
          types: pokemonRes.types,
          sprites: {
            front: frontSprite,
            back: pokemonRes.sprites?.back_default,
          },
        })
      );
    } catch (error) {
      return Result.err(error);
    }
  }

  /**
   * @param {number} max
   * @returns {Promise<Result<PokemonEntity, Error>>}
   */
  async getRandomPokemon(max) {
    if (max < 1 || max > PokeApi.MAX_POKEMON_NUM) {
      return this.getRandomPokemon(PokeApi.MAX_POKEMON_NUM);
    }

    const id = await this._generateRandomNumber(1, max);
    return this.getPokemonById(id);
  }

  /**
   * @description Devuelve la lista de pokemons de un determinado tipo
   * @param {string} type
   * @returns {Promise<Result<PokemonEntity[], Error>>}
   */
  async getPokemonsByType(type) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!response.ok) {
        return Result.err(new Error(`Error HTTP: ${response.status}`));
      }

      const data = await response.json();
      const ids = await data.pokemon
        .map((entry) => {
          const parts = entry.pokemon.url.split("/").filter(Boolean);
          return parseInt(parts[parts.length - 1], 10);
        })
        .filter((id) => !isNaN(id) && id <= PokeApi.MAX_POKEMON_NUM);

      const promises = ids.map((id) => this.getPokemonById(id));
      const results = await Promise.all(promises);
      const pokemons = results
        .filter((res) => res.isSuccess)
        .map((res) => res.value);

      return Result.ok(pokemons);
    } catch (error) {
      return Result.err(error);
    }
  }
}
