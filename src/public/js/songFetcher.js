const songs = JSON.parse(sessionStorage.getItem('songs'));
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
        while (songs[index].uri === correctAnswer.uri || answers.includes(songs[index])) {
            index = Math.floor(Math.random() * songs.length);
        }

        answers.push(songs[index]);
    }

    return answers;
}