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


function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}


function initializeTimers() {
  const workoutTime = parseInt(workoutInput.value) || 0;
  const restTime = parseInt(restInput.value) || 0;
  initialWorkoutSeconds = workoutUnit.value === 'minutes' ? workoutTime * 60 : workoutTime;
  initialRestSeconds = restUnit.value === 'minutes' ? restTime * 60 : restTime;

  if (initialWorkoutSeconds > 0) {
    isWorkoutPhase = true; // Start with workout phase if workout time is specified
    currentSeconds = initialWorkoutSeconds;
  } else if (initialRestSeconds > 0) {
    isWorkoutPhase = false; 
    currentSeconds = initialRestSeconds;
  } else {
    currentSeconds = 0;
  }

  timerDisplay.textContent = formatTime(currentSeconds);
}


function toggleTimer() {
  if (!isRunning) {
    if (currentSeconds === 0) {
      
      if (isWorkoutPhase && initialWorkoutSeconds > 0) {
        currentSeconds = initialWorkoutSeconds;
      } else if (!isWorkoutPhase && initialRestSeconds > 0) {
        currentSeconds = initialRestSeconds;
      } else {
        return;
      }
    }

    isRunning = true;
    startStopBtn.textContent = isWorkoutPhase ? 'Stop Workout' : 'Stop Rest';
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    stopTimer();
  }
}


function updateTimer() {
  if (currentSeconds > 0) {
    currentSeconds--;
    timerDisplay.textContent = formatTime(currentSeconds);
  } else {
    stopTimer();
    playAlarm();

    if (isWorkoutPhase && initialRestSeconds > 0) {
      
      isWorkoutPhase = false;
      currentSeconds = initialRestSeconds;
      startStopBtn.textContent = 'Start Rest';
      stopAlarm(); 
    } else if (!isWorkoutPhase && initialWorkoutSeconds > 0) {
      
      isWorkoutPhase = true;
      currentSeconds = initialWorkoutSeconds;
      startStopBtn.textContent = 'Start Workout';
      stopAlarm(); 
    } else {
      
      currentSeconds = 0;
      timerDisplay.textContent = formatTime(currentSeconds);
      startStopBtn.textContent = 'Start Timer';
    }
  }
}


function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startStopBtn.textContent = isWorkoutPhase ? 'Start Workout' : 'Start Rest';
}


function resetTimer() {
  stopTimer();
  if (isWorkoutPhase) {
    
    currentSeconds = initialWorkoutSeconds;
  } else {
    
    currentSeconds = initialRestSeconds;
  }
  timerDisplay.textContent = formatTime(currentSeconds);
  stopAlarm(); 
}


function playAlarm() {
  alarmSound.play();
}


function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}


startStopBtn.addEventListener('click', () => {
  if (!isRunning && currentSeconds === 0) {
    stopAlarm(); 
  }
  toggleTimer();
});

resetBtn.addEventListener('click', () => {
  stopAlarm(); 
  resetTimer();
});


workoutInput.addEventListener('change', initializeTimers);
workoutUnit.addEventListener('change', initializeTimers);
restInput.addEventListener('change', initializeTimers);
restUnit.addEventListener('change', initializeTimers);

initializeTimers();
