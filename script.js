
let timerSeconds = 0;
let restSeconds = 0;
let isRunning = false;
let timerInterval;

const workoutInput = document.getElementById('workout-time');
const workoutUnit = document.getElementById('workout-unit');
const restInput = document.getElementById('rest-time');
const restUnit = document.getElementById('rest-unit');
const timerDisplay = document.getElementById('timer-display');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function startTimer() {
  if (!isRunning) {
    const workoutTime = parseInt(workoutInput.value) || 0;
    const restTime = parseInt(restInput.value) || 0;
    if (timerSeconds === 0 && restSeconds === 0) {
      timerSeconds = workoutUnit.value === 'minutes' ? workoutTime * 60 : workoutTime;
      restSeconds = restUnit.value === 'minutes' ? restTime * 60 : restTime;
    }
    isRunning = true;
    startStopBtn.textContent = 'Stop';
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        timerDisplay.textContent = formatTime(timerSeconds);
      } else if (restSeconds > 0) {
        restSeconds--;
        timerDisplay.textContent = formatTime(restSeconds);
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startStopBtn.textContent = 'Start';
        resetTimer(); // Automatically reset after each workout and rest session
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    startStopBtn.textContent = 'Start';
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timerSeconds = 0;
  restSeconds = 0;
  timerDisplay.textContent = '00:00';
  startStopBtn.textContent = 'Start';
}

startStopBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);