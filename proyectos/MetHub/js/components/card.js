export class Card {
  constructor(data) { this.data = data; }

  render() {
    const card = document.createElement('article');
    card.className = 'card';

    const imgContainer = document.createElement('div');
    imgContainer.className = "card-img-container";
    
    const img = document.createElement('img');
    // Usamos primaryImageSmall que es el campo estándar de la API del MET
    img.src = this.data.primaryImageSmall || 'ruta/a/placeholder.jpg'; 
    img.alt = this.data.title || 'Arte';
    
    imgContainer.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h3"); 
    cardTitle.className = "card-title";
    cardTitle.textContent = this.data.title || 'Título desconocido';

    const cardText = document.createElement("p"); 
    cardText.className = "card-text";
    cardText.textContent = this.data.artistDisplayName || 'Artista desconocido';

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    
    card.appendChild(imgContainer);
    card.appendChild(cardBody);
    
    return card;
  }
}