export const startTimer = (onTick) => {
    let seconds = 0;
    const intervalId = setInterval(() => {
        seconds++;
        if (onTick) onTick(seconds);
    }, 1000);
    return {
        stop: () => clearInterval(intervalId),
        get seconds() { return seconds; },
    };
};