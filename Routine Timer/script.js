let timer;
let exercises = [];
let currentExerciseIndex = 0;
let totalElapsedSeconds = 0; // Initialize the overall total elapsed time in seconds
let remainingTime = 0; // Initialize the remaining time for the current exercise
let defaultExercisesAdded = false;
let isDefaultExercises = false; // Track if exercises are default
let isTimerRunning = false; // Track if the timer is currently running
let pausedTime = 0; // Track the time paused when the timer is stopped

function updateTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    document.getElementById("timer-display").textContent = `${hours}:${minutes}:${remainingSeconds}`;
}

function updateRemainingTimeDisplay() {
    if (currentExerciseIndex < exercises.length) {
        const remainingTimeCell = document.querySelectorAll('tbody tr td:nth-child(3)')[currentExerciseIndex];
        if (remainingTimeCell) {
            const remainingMinutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
            const remainingSecs = (remainingTime % 60).toString().padStart(2, '0');
            remainingTimeCell.textContent = `${remainingMinutes}:${remainingSecs}`;
        }
    }
}

function playSound() {
    const audio = new Audio('beep.mp3'); // Replace 'beep.mp3' with your audio file
    audio.play();
}


function startTimer() {
    if (currentExerciseIndex < exercises.length) {
        isTimerRunning = true; // Timer is running

        timer = setInterval(function() {
            if (remainingTime <= 0) {
                currentExerciseIndex++;

                if (currentExerciseIndex > 0) {
                    const previousRow = document.querySelector('.current-task');
                    previousRow.classList.remove('current-task');
                }

                if (currentExerciseIndex < exercises.length) {
                    const nextExercise = exercises[currentExerciseIndex];
                    remainingTime = nextExercise.time * 60;
                    const currentRow = document.querySelectorAll('tr')[currentExerciseIndex + 1];
                    currentRow.classList.add('current-task');
                    updateRemainingTimeDisplay();
                } else {
                    clearInterval(timer);
                    updateRemainingTimeDisplay();
                    updateTimerDisplay(totalElapsedSeconds);
                    playSound(); // Play sound at the end of the last exercise
                    isTimerRunning = false; // Timer is not running
                    return;
                }
            } else if (remainingTime <= 5) {
                // Play the beep sound 5 seconds before the end of the exercise
                playSound();
            }

            remainingTime--;
            totalElapsedSeconds++;
            updateRemainingTimeDisplay();
            updateTimerDisplay(totalElapsedSeconds);
        }, 1000);
    }
}

function setDefaultExercises() {
    if (!defaultExercisesAdded) {
        defaultExercisesAdded = true;
        isDefaultExercises = true; // Set the flag to indicate default exercises
        const exerciseList = document.querySelector("#exercise-list tbody");
        exerciseList.innerHTML = "";

        const defaultExercises = [
            { name: "Warm-up", time: 5 },
            { name: "Vandal Practice ", time: 12 },
            { name: "Movement and Flick Shots", time: 5 },
            { name: "Distance Training", time: 5 },
            { name: "Scenario Training", time: 5 },
            { name: "Cooldown", time: 2 }
        ];

        defaultExercises.forEach(exercise => {
            addExerciseToList(exercise);
        });

        exercises = defaultExercises; // Set default exercises in the 'exercises' array
    }
}


function addExerciseToList(exercise, index) {
    const exerciseList = document.querySelector("#exercise-list tbody");
    const newRow = exerciseList.insertRow();
    newRow.innerHTML = `
        <td>${exercise.name}</td>
        <td>${exercise.time}</td>
        <td>${exercise.time}:00</td>
        <td><button class="remove-button">-</button></td>
    `;

    const removeButton = newRow.querySelector(".remove-button");
    removeButton.addEventListener("click", function() {
        // Find the index of the clicked row
        const clickedRowIndex = Array.from(exerciseList.rows).indexOf(newRow);
        exercises.splice(clickedRowIndex, 1);
        updateExerciseList();
        updateRemainingTimeDisplay();
    });
}

function updateExerciseList() {
    const exerciseList = document.querySelector("#exercise-list tbody");
    exerciseList.innerHTML = "";
    exercises.forEach((exercise, index) => {
        addExerciseToList(exercise, index);
    });
}

window.addEventListener("load", function() {
    setDefaultExercises();
});

document.getElementById("add-exercise-button").addEventListener("click", function() {
    const exerciseNameInput = document.getElementById("exercise-name");
    const exerciseTimeInput = document.getElementById("exercise-time");

    const name = exerciseNameInput.value;
    const time = parseInt(exerciseTimeInput.value);

    if (name && !isNaN(time) && time > 0) {
        const exercise = { name, time };
        exercises.push(exercise);
        exerciseNameInput.value = "";
        exerciseTimeInput.value = "";

        addExerciseToList(exercise);
    }
});

document.getElementById("start-button").addEventListener("click", function() {
    if (!isTimerRunning) {
        pausedTime = 0; // Reset paused time
        if (pausedTime > 0) {
            // Resume timer from where it was stopped
            remainingTime = pausedTime;
            pausedTime = 0;
        }
        currentExerciseIndex = currentExerciseIndex || 0; // Use current index if it's set
        totalElapsedSeconds = totalElapsedSeconds || 0; // Use total elapsed time if it's set

        if (exercises.length > 0) {
            startTimer(); // Start the timer when the "Start" button is clicked
        }
    }
});

document.getElementById("stop-button").addEventListener("click", function() {
    clearInterval(timer);
    pausedTime = remainingTime; // Store the remaining time when stopped
    isTimerRunning = false; // Timer is not running
});

document.getElementById("reset-button").addEventListener("click", function() {
    clearInterval(timer);
    isTimerRunning = false; // Timer is not running
    currentExerciseIndex = 0; // Reset current exercise index to zero
    totalElapsedSeconds = 0;
    remainingTime = 0; // Immediately reset remaining time
    updateRemainingTimeDisplay();
    updateTimerDisplay(totalElapsedSeconds);
});