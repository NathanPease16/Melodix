const loading = document.getElementById('loading');
const content = document.getElementById('content');

const startContainer = document.getElementById('start-container');
const startButton = document.getElementById('start');

const questionsContainer = document.getElementById('questions-container');

const answers = document.getElementById('answers');
const correct = document.getElementById('correct');
const incorrect = document.getElementById('incorrect');
const correctAnswerText = document.getElementById('correct-answer');

const cookies = Object.fromEntries(document.cookie.split('; ').map(cookie => cookie.split('=')));
const token = cookies.accessToken;

loading.style.display = 'none';
content.style.display = '';

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Melodix Player',
        getOAuthToken: cb => { cb(token); }
    });

    player.addListener('ready', ({ device_id }) => {
        loading.style.display = 'none';
        content.style.display = '';

        startButton.addEventListener('click', () => {
            questionsContainer.style.display = '';
            startContainer.style.display = 'none';
            generateQuestion(device_id);
        });
    });

    player.connect();
}

async function generateQuestion(deviceId) {
    let songChoices = Math.min(songs.length, 4);

    const song = await getRandomSong();
    const answerChoices = await getAnswerChoices(songChoices, song);

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
                    generateQuestion(deviceId);
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
                    generateQuestion(deviceId);
                }, 1000);
            });
        }

        answers.appendChild(answerButton);
    }

    playSong(deviceId, song.uri);
}

function playSong(deviceId, uri) {    
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uris: [uri]}),
    });
}