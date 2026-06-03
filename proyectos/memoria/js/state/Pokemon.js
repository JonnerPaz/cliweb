export class PokemonEntity {
  #id = 0;
  #name = "";
  #cries = { latest: "", legacy: "" };
  #types = [{ type: { name: "" } }];
  #sprites = { front: "", back: "" };

  /**
   * @param {string} name - Nombre del pokemon
   * @param {import("./Pokemon.dto.js").Cries} cries - Gritos del pokemon
   * @param {import("./Pokemon.dto.js").Type[]} types - Tipos del pokemon
   * @param {import("./Pokemon.dto.js").Sprites} sprites - Sprites del pokemon
   */
  constructor({ name, cries, types, sprites }) {
    this.#name = name ?? "";
    this.#cries = cries ?? { latest: "", legacy: "" };
    this.#types = types ?? [];
    this.#sprites = sprites ?? { front: "", back: "" };
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get types() {
    return this.#types;
  }

  get sprites() {
    return this.#sprites;
  }

  get cries() {
    return this.#cries;
  }
}
