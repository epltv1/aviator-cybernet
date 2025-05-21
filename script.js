const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const multiplierDisplay = document.getElementById('multiplier');
const balanceDisplay = document.getElementById('balance');
const statusDisplay = document.getElementById('status');
const betAmountInput = document.getElementById('betAmount');
const placeBetButton = document.getElementById('placeBet');
const cashOutButton = document.getElementById('cashOut');

let balance = 100;
let bet = 0;
let multiplier = 1;
let isGameRunning = false;
let planeX = 0;
let planeY = canvas.height - 50;
let animationFrame;

function drawPlane() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(planeX, planeY);
  ctx.lineTo(planeX + 30, planeY);
  ctx.lineTo(planeX + 15, planeY - 20);
  ctx.closePath();
  ctx.fill();
}

function updateGame() {
  if (!isGameRunning) return;

  multiplier += 0.02;
  planeX += 2;
  planeY -= 1;

  // Random crash
  if (Math.random() < 0.01 || multiplier > 10) {
    endGame(false);
    return;
  }

  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  drawPlane();
  animationFrame = requestAnimationFrame(updateGame);
}

function placeBet() {
  const betAmount = parseFloat(betAmountInput.value);
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    statusDisplay.textContent = 'Invalid bet amount!';
    return;
  }

  bet = betAmount;
  balance -= bet;
  balanceDisplay.textContent = balance.toFixed(2);
  statusDisplay.textContent = 'Game Started!';
  isGameRunning = true;
  multiplier = 1;
  planeX = 0;
  planeY = canvas.height - 50;
  placeBetButton.disabled = true;
  cashOutButton.disabled = false;
  updateGame();
}

function cashOut() {
  if (!isGameRunning) return;

  const winnings = bet * multiplier;
  balance += winnings;
  balanceDisplay.textContent = balance.toFixed(2);
  statusDisplay.textContent = `Cashed out at ${multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`;
  endGame(true);
}

function endGame(didCashOut) {
  isGameRunning = false;
  cancelAnimationFrame(animationFrame);
  placeBetButton.disabled = false;
  cashOutButton.disabled = true;
  if (!didCashOut) {
    statusDisplay.textContent = `Crashed at ${multiplier.toFixed(2)}x! You lost $${bet.toFixed(2)}`;
    bet = 0;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawPlane();
