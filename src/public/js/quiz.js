const questionsContainer = document.getElementById('questions-container');
const startButton = document.getElementById('start');
const answers = document.getElementById('answers');

const correct = document.getElementById('correct');
const incorrect = document.getElementById('incorrect');
const correctAnswerText = document.getElementById('correct-answer');

const audio = new Audio();

async function generateQuestion() {
    const song = await getRandomSong(albums);
    const answerChoices = await getAnswerChoices(4, song);

    answers.innerHTML = '';
    for (const answer of answerChoices) {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer.name;
        answerButton.className = 'button';

        if (answer === song) {
            answerButton.addEventListener('click', () => {
                correct.style.display = '';
                questionsContainer.style.display = 'none';

                setTimeout(() => {
                    correct.style.display = 'none';
                    questionsContainer.style.display = '';
                    generateQuestion();
                }, 1000);
            });
        } else {
            answerButton.addEventListener('click', () => {
                incorrect.style.display = '';
                questionsContainer.style.display = 'none';
                correctAnswerText.textContent = `Correct Answer: ${song.name}`;

                setTimeout(() => {
                    incorrect.style.display = 'none';
                    questionsContainer.style.display = '';
                    generateQuestion();
                }, 1000);
            });
        }

        answers.appendChild(answerButton);
    }

    audio.pause();
    
    audio.src = song.url;
    audio.load();
    audio.loop = true;

    audio.play();
}

startButton.addEventListener('click', async () => {
    startContainer.style.display = 'none';
    questionsContainer.style.display = '';

    generateQuestion();
});