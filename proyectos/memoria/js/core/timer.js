export const startTimer = (onTick) => {
    let seconds = 0;
    return setInterval(() => {
        seconds++;
        onTick(seconds);
    }, 1000);
};