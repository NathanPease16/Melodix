const questionLoadingText = document.getElementById('question-loading-text');

const totalTime = 3;

function load(startCallback, endCallback) {
    if (startCallback) {
        startCallback();
    }

    let time = totalTime;
    questionLoadingText.textContent = `Question in starting in: ${time}`;

    const interval = setInterval(() => {
        time--;
        questionLoadingText.textContent = `Question in starting in: ${time}`;

        if (time === 0) {
            clearInterval(interval);

            if (endCallback) {
                endCallback();
            }
        }
    }, 1000);
}