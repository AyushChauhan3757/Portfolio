const image = document.getElementById('cover');
    title = document.getElementById('music-title');
    artist = document.getElementById('music-artist');
    currentTimeEl = document.getElementById('currnet-time');
    durationEl = document.getElementById('duration');
    progress = document.getElementById('progress');
    playerProgress = document.getElementById('player-progress');
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');
    playBtn = document.getElementById('play');
    background = document.getElementById('bg-img');

const music = new Audio();
const songs = [
    {
       path: 'assets/1.mp3',
       displayName:  'The Charmer\'s Call',
       cover: 'assets/1.jpg',
       artist: 'Hanu Dixit'
    },
    {
        path: 'assets/2.mp3',
        displayName:  'You Will Never See Me Coming',
        cover: 'assets/2.jpg',
        artist: 'NEFFEX'
    },
    {
        path: 'assets/3.mp3',
        displayName:  'Intellect',
        cover: 'assets/3.jpg',
        artist: 'Yung Logos'
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if(isPlaying) {
        pauseMusic();
    }else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;

    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;

    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'play');
    music.pause();
}

function loadMusic() {
    music.src = song.path;
    title.textContext = song.displayName;
    artist.textContext = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration , currentTime} = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime (time) => String(Math.floor(time)).padStart(2,'0');
}