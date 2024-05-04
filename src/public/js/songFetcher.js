const button = document.getElementById('btn');

let selectedSongs = [];

async function getRandomSong() {
    if (selectedSongs.length == songs.length) {
        selectedSongs = [];
    }

    let index = Math.floor(Math.random() * songs.length);
    while (selectedSongs.includes(songs[index])) {
        index = Math.floor(Math.random() * songs.length);
    }
    selectedSongs.push(songs[index]);
    return songs[index];
    // return songs[Math.floor(Math.random() * songs.length)];
}

async function getAnswerChoices(numberOfChoices, correctAnswer) {
    const answers = [];
    const correctIndex = Math.floor(Math.random() * numberOfChoices);

    for (i = 0; i < numberOfChoices; i++) {
        if (i == correctIndex) {
            answers.push(correctAnswer);
            continue;
        }

        let index = Math.floor(Math.random() * songs.length);
        while (songs[index].url === correctAnswer.url || answers.includes(songs[index])) {
            index = Math.floor(Math.random() * songs.length);
        }

        answers.push(songs[index]);
    }

    return answers;
}

/*
(async () => {
    const response = await fetch('/songs/7gW0r5CkdEUMm42w9XpyZO', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const songs = (await response.json()).filter(song => song.url !== null);
    const audio = new Audio();
    
    button.addEventListener('click', async () => {
        audio.pause();

        const song = songs[Math.floor(Math.random() * songs.length)];
        audio.src = song.url;
        audio.load();

        audio.play();

        console.log(song.name);
    });
})();
*/