export class User {
  #name;
  #points;
  #awards;
  #movements;

  constructor(name, points, movements, awards) {
    this.#name = name;
    this.#points = points;
    this.#movements = movements;
    this.#awards = awards;
  }

  addPoints(points) {
    if (this.#points < 0 || points < 0) return;
    this.#points += points;
  }

  addMovements(movements) {
    if (this.#movements < 0 || movements < 0) return;
    this.#movements += movements;
  }

  addAwards(awards) {
    if (this.#awards < 0 || awards < 0) return;
    this.#awards += awards;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get points() {
    return this.#points;
  }

  get awards() {
    return this.#awards;
  }

  get movements() {
    return this.#movements;
  }

  reset() {
    this.#points = 0;
    this.#movements = 0;
    this.#awards = 0;
    this.#name = "";
  }
}
