// Get DOM elements
const image = document.getElementById('cover'); // Image element for the album cover
const title = document.getElementById('music-title'); // Title element for the music
const artist = document.getElementById('music-artist'); // Artist element
const currentTimeEl = document.getElementById('current-time'); // Element to display current time
const durationEl = document.getElementById('duration'); // Element to display music duration
const progress = document.getElementById('progress'); // Progress bar
const playerProgress = document.getElementById('player-progress'); // Player progress container
const prevBtn = document.getElementById('prev'); // Previous button
const nextBtn = document.getElementById('next'); // Next button
const playBtn = document.getElementById('play'); // Play/pause button
const background = document.getElementById('bg-image'); // Background image element

// Create an Audio object for music playback
const music = new Audio();

// Define an array of songs with their details
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

// Initialize music index and playback state
let musicIndex = 0; // Index of the current song
let isPlaying = false; // Flag to track if music is playing or paused

// Function to toggle play/pause
function togglePlay() {
    if(isPlaying) {
        pauseMusic(); // If music is playing, pause it
    } else {
        playMusic(); // If music is paused, play it
    }
}

// Function to play music
function playMusic() {
    isPlaying = true;

    playBtn.classList.replace('fa-play', 'fa-pause'); // Change play button icon to pause
    playBtn.setAttribute('title', 'Pause'); // Change tooltip to "Pause"
    music.play(); // Start playing music
}

// Function to pause music
function pauseMusic() {
    isPlaying = false;

    playBtn.classList.replace('fa-pause', 'fa-play'); // Change pause button icon to play
    playBtn.setAttribute('title', 'Play'); // Change tooltip to "Play"
    music.pause(); // Pause the music
}

// Function to load a specific song
function loadMusic(song) {
    music.src = song.path; // Set the audio source to the selected song's path
    title.textContent = song.displayName; // Display song title
    artist.textContent = song.artist; // Display artist name
    image.src = song.cover; // Set album cover image
    background.src = song.cover; // Set background image
}

// Function to change music (previous or next)
function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length; // Calculate the next song index
    loadMusic(songs[musicIndex]); // Load and play the next song
    playMusic();
}

// Function to update the progress bar and time display
function updateProgressBar() {
    const { duration , currentTime } = music; // Get the duration and current time of the song
    const progressPercent = (currentTime / duration) * 100; // Calculate the progress percentage
    progress.style.width = `${progressPercent}%`; // Set the width of the progress bar

    // Function to format time as "mm:ss"
    const formatTime = (time) => String(Math.floor(time)).padStart(2,'0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`; // Display song duration
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`; // Display current time
}

// Function to set the playback position when the progress bar is clicked
function setProgressBar(e) {
    const width = playerProgress.clientWidth; // Get the width of the progress container
    const clickX = e.offsetX; // Get the X-coordinate of the click within the progress container
    music.currentTime = (clickX / width) * music.duration; // Set the playback position based on the click position
}

// Event listeners for various actions
playBtn.addEventListener('click', togglePlay); // Play/pause button click
prevBtn.addEventListener('click', () => changeMusic(-1)); // Previous button click
nextBtn.addEventListener('click', () => changeMusic(1)); // Next button click
music.addEventListener('ended', () => changeMusic(1)); // When a song ends, play the next one
music.addEventListener('timeupdate', updateProgressBar); // Update the progress bar as the music plays
playerProgress.addEventListener('click', setProgressBar); // Click on the progress bar to set playback position

// Load the initial song when the page loads
loadMusic(songs[musicIndex]);
