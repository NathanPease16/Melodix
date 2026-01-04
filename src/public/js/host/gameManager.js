const lobby = document.getElementById('lobby');
const question = document.getElementById('question');
const loading = document.getElementById('question-loading');
const leaderboard = document.getElementById('leaderboard');
const standings = document.getElementById('standings');

const startButton = document.getElementById('start');

const cookies = Object.fromEntries(document.cookie.split('; ').map(cookie => cookie.split('=')));
const token = cookies.accessToken;

const answerBoxes = [];
const buttons = [];

let song = {};
let answerChoices = [];

let deviceId;

for (let i = 0; i < 4; i++) {
    buttons.push(document.getElementById(`${i}`));
    answerBoxes.push(document.getElementById(`${i}-d`));
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Melodix Player',
        getOAuthToken: cb => { cb(token); }
    });

    player.addListener('ready', async ({ device_id }) => {

        deviceId = device_id;

        startButton.addEventListener('click', () => {
            console.log('ready');
            loadQuestion(device_id);
        });
    });

    player.connect();
}

function loadQuestion(deviceId) {
    lobby.style.display = 'none';
    question.style.display = 'none';
    loading.style.display = '';
    leaderboard.style.display = 'none';
    
    socket.emit('loading');
    load(() => {}, async () => {
        lobby.style.display = 'none';
        question.style.display = '';
        loading.style.display = 'none';
        leaderboard.style.display = 'none';

        await generateQuestion(deviceId);

        socket.emit('question');
    });
}

async function generateQuestion(deviceId) {
    song = await getRandomSong();
    answerChoices = await getAnswerChoices(4, song);

    for (let i = 0; i < 4; i++) {
        buttons[i].textContent = answerChoices[i].name;
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

socket.on('finishQuestion', (roomPlayers) => {
    let correctChoice = -1;
    for (let i = 0; i < answerChoices.length; i++) {
        if (answerChoices[i] === song) {
            correctChoice = i;
            break;
        }
    }

    for (const roomPlayer of roomPlayers) {
        let player;
        for (const p of players) {
            if (p.name === roomPlayer.name) {
                player = p;
                break;
            }
        }

        if (roomPlayer.choice === correctChoice) {
            if (roomPlayer.order === 0) {
                player.score += Math.trunc(1000 / (roomPlayer.order + 1));
            }
        }
    }

    for (let i = 0; i < buttons.length; i++) {
        if (i === correctChoice) {
            answerBoxes[i].className = 'room-button green';
        } else {
            answerBoxes[i].className = 'room-button red';
        }
    }

    socket.emit('answerRevealed', correctChoice);

    players.sort((a, b) => a.socre - b.score);

    setTimeout(() => {
        standings.innerHTML = '';

        for (const player of players) {
            const p = document.createElement('p');
            p.textContent = `${player.name} | ${player.score}`;

            standings.appendChild(p);

            lobby.style.display = 'none';
            question.style.display = 'none';
            loading.style.display = 'none';
            leaderboard.style.display = '';
        }

        setTimeout(() => {
            answerBoxes[0].className = 'room-button red';
            answerBoxes[1].className = 'room-button orange';
            answerBoxes[2].className = 'room-button green';
            answerBoxes[3].className = 'room-button purple';

            loadQuestion(deviceId);
        }, 5000);
    }, 3000);
});
