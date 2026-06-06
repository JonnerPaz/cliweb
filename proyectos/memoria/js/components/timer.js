/**
 * Crea y retorna el elemento del temporizador.
 * @returns {HTMLElement} El elemento DOM creado.
 */

export function createGameTimer() {
    const timerContainer = document.createElement('div');
    timerContainer.className = 'game-timer';

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = 'Time: ';
    
    const valueElement = document.createElement('span');
    valueElement.className = 'value';
    valueElement.textContent = '00:00'; // Valor inicial

    timerContainer.appendChild(label);
    timerContainer.appendChild(valueElement);

    return {
        element: timerContainer,
        updateTime: (seconds) => {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            valueElement.textContent = `${mins}:${secs}`;
        }
    };
}