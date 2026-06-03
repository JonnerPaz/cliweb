export class Card extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
              <div class="card">
              <div class="card__side card__side--front">
                <div class="card__picture card__picture--1">&nbsp; {POKEMON IMAGE}</div>
                <h4 class="card__heading">
                  <span class="card__heading-span card__heading-span--1">
                      {POKEMON NAME}
                  </span>
                </h4>
              </div>
              <div class="card__side card__side--back card__side--back-1">
                <div class="card__cta">
                  <div class="card__price-box">
                    <!-- <p class="card__price-only">Only</p> -->
                    <!-- <p class="card__price-value">297$</p> -->
                  </div>
                  <a href="#popup" class="btn btn--white">Book Now!</a>
                </div>
              </div>
            </div>
  `;
  }
}

customElements.define("pokemon-card", Card);
