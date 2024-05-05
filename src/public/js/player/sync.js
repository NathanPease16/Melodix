const waiting = document.getElementById('waiting');
const loading = document.getElementById('question-loading');
const answers = document.getElementById('answers');
const questionSubmit = document.getElementById('question-submit');

const correct = document.getElementById('correct');
const incorrect = document.getElementById('incorrect');

const roomCodeText = document.getElementById('room-code');

const socket = io();

const urlSearchParams = new URLSearchParams(window.location.search);
const code = urlSearchParams.get('code');
const name = urlSearchParams.get('name');

let choice = -1;

for (let i = 0; i < 4; i++) {
    document.getElementById(`${i}`).addEventListener('click', () => {
        waiting.style.display = 'none';
        loading.style.display = 'none';
        answers.style.display = 'none';
        questionSubmit.style.display = '';
        correct.style.display = 'none';
        incorrect.style.display = 'none';

        socket.emit('submitQuestion', i);
        choice = i;
    });
}

socket.emit('joinRoom', { name, code });
roomCodeText.textContent = code;

socket.on('loading', () => {
    waiting.style.display = 'none';
    loading.style.display = '';
    answers.style.display = 'none';
    questionSubmit.style.display = 'none';
    correct.style.display = 'none';
    incorrect.style.display = 'none';

    load();
});

socket.on('question', () => {
    waiting.style.display = 'none';
    loading.style.display = 'none';
    answers.style.display = '';
    questionSubmit.style.display = 'none';
    correct.style.display = 'none';
    incorrect.style.display = 'none';
});

socket.on('answerRevealed', (correctChoice) => {
    if (choice === correctChoice) {
        waiting.style.display = 'none';
        loading.style.display = 'none';
        answers.style.display = 'none';
        questionSubmit.style.display = 'none';
        correct.style.display = '';
        incorrect.style.display = 'none';
    } else {
        waiting.style.display = 'none';
        loading.style.display = 'none';
        answers.style.display = 'none';
        questionSubmit.style.display = 'none';
        correct.style.display = 'none';
        incorrect.style.display = '';
    }
})