/**
 * Crea y muestra un mensaje toast.
 */
export function showToast(message = 'Congratulations!', type = 'success') {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide'); // Dispara la transición CSS     
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}