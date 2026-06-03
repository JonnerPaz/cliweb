export class Api {
  async getPokemon() {
    const request = await fetch("https://pokeapi.co/api/v2/pokemon/43");
    const pokemon = await request.json();
    return { pokemon.name, pokemon.id };
  }
}
