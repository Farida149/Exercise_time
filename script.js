const workoutInput = document.getElementById('workout-time');
const workoutUnit = document.getElementById('workout-unit');
const restInput = document.getElementById('rest-time');
const restUnit = document.getElementById('rest-unit');
const timerDisplay = document.getElementById('timer-display');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const alarmSound = document.getElementById('alarm-sound');

let initialWorkoutSeconds = 0;
let initialRestSeconds = 0;
let currentSeconds = 0;
let isRunning = false;
let isWorkoutPhase = true; // Start with workout phase by default
let timerInterval;

// Helper to format seconds into MM:SS
function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

// Initialize the workout and rest times
function initializeTimers() {
  const workoutTime = parseInt(workoutInput.value) || 0;
  const restTime = parseInt(restInput.value) || 0;
  initialWorkoutSeconds = workoutUnit.value === 'minutes' ? workoutTime * 60 : workoutTime;
  initialRestSeconds = restUnit.value === 'minutes' ? restTime * 60 : restTime;

  if (initialWorkoutSeconds > 0) {
    isWorkoutPhase = true; // Start with workout phase if workout time is specified
    currentSeconds = initialWorkoutSeconds;
  } else if (initialRestSeconds > 0) {
    isWorkoutPhase = false; // Start with rest phase if only rest time is specified
    currentSeconds = initialRestSeconds;
  } else {
    currentSeconds = 0; // No time specified, do nothing
  }

  timerDisplay.textContent = formatTime(currentSeconds);
}

// Start or stop the timer
function toggleTimer() {
  if (!isRunning) {
    if (currentSeconds === 0) {
      // If time is 0, reset based on current phase
      if (isWorkoutPhase && initialWorkoutSeconds > 0) {
        currentSeconds = initialWorkoutSeconds;
      } else if (!isWorkoutPhase && initialRestSeconds > 0) {
        currentSeconds = initialRestSeconds;
      } else {
        return; // Nothing to start if both are 0
      }
    }

    isRunning = true;
    startStopBtn.textContent = isWorkoutPhase ? 'Stop Workout' : 'Stop Rest';
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    stopTimer();
  }
}

// Update the timer every second
function updateTimer() {
  if (currentSeconds > 0) {
    currentSeconds--;
    timerDisplay.textContent = formatTime(currentSeconds);
  } else {
    stopTimer();
    playAlarm();

    if (isWorkoutPhase && initialRestSeconds > 0) {
      // Transition to rest phase if rest time exists
      isWorkoutPhase = false;
      currentSeconds = initialRestSeconds;
      startStopBtn.textContent = 'Start Rest';
      stopAlarm(); // Stop the alarm when transitioning
    } else if (!isWorkoutPhase && initialWorkoutSeconds > 0) {
      // Transition back to workout phase if workout time exists
      isWorkoutPhase = true;
      currentSeconds = initialWorkoutSeconds;
      startStopBtn.textContent = 'Start Workout';
      stopAlarm(); // Stop the alarm when transitioning
    } else {
      // End timer if neither phase has time
      currentSeconds = 0;
      timerDisplay.textContent = formatTime(currentSeconds);
      startStopBtn.textContent = 'Start Timer';
    }
  }
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startStopBtn.textContent = isWorkoutPhase ? 'Start Workout' : 'Start Rest';
}

// Reset the timer
function resetTimer() {
  stopTimer();
  if (isWorkoutPhase) {
    // Reset to initial workout time
    currentSeconds = initialWorkoutSeconds;
  } else {
    // Reset to initial rest time
    currentSeconds = initialRestSeconds;
  }
  timerDisplay.textContent = formatTime(currentSeconds);
  stopAlarm(); // Stop alarm when reset
}

// Play alarm sound
function playAlarm() {
  alarmSound.play();
}

// Stop alarm sound
function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

// Event listeners
startStopBtn.addEventListener('click', () => {
  if (!isRunning && currentSeconds === 0) {
    stopAlarm(); // Stop alarm when transitioning
  }
  toggleTimer();
});

resetBtn.addEventListener('click', () => {
  stopAlarm(); // Stop alarm if playing
  resetTimer();
});

// Update timers when inputs or units are changed
workoutInput.addEventListener('change', initializeTimers);
workoutUnit.addEventListener('change', initializeTimers);
restInput.addEventListener('change', initializeTimers);
restUnit.addEventListener('change', initializeTimers);

initializeTimers();
