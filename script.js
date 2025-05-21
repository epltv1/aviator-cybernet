const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const multiplierDisplay = document.getElementById('multiplier');
const balanceDisplay = document.getElementById('balance');
const statusDisplay = document.getElementById('status');
const betAmountInput = document.getElementById('betAmount');
const placeBetButton = document.getElementById('placeBet');
const cashOutButton = document.getElementById('cashOut');
const takeoffSound = document.getElementById('takeoffSound');
const crashSound = document.getElementById('crashSound');
const cashoutSound = document.getElementById('cashoutSound');

let balance = 100;
let bet = 0;
let multiplier = 1;
let isGameRunning = false;
let planeX = canvas.width / 2;
let planeY = canvas.height - 50;
let time = 0;
let planeImage = new Image();
planeImage.src = 'assets/plane.png';
let animationFrame;

function drawPlane() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(planeX, planeY);
  ctx.rotate((Math.PI / 180) * (time * 2 - 45)); // Rotate plane based on time
  ctx.drawImage(planeImage, -25, -25, 50, 50); // Center image
  ctx.restore();
}

function updateGame() {
  if (!isGameRunning) return;

  time += 0.05;
  multiplier = 1 + time * time * 0.1; // Quadratic growth for multiplier
  planeX = canvas.width / 2 + Math.sin(time * 0.5) * 100; // Curved horizontal path
  planeY = canvas.height - 50 - time * 50; // Upward movement

  if (Math.random() < 0.01 || multiplier > 20 || planeY < -50) {
    crashSound.play();
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
  statusDisplay.textContent = 'Taking Off!';
  isGameRunning = true;
  multiplier = 1;
  time = 0;
  planeX = canvas.width / 2;
  planeY = canvas.height - 50;
  placeBetButton.disabled = true;
  cashOutButton.disabled = false;
  takeoffSound.play();
  updateGame();
}

function cashOut() {
  if (!isGameRunning) return;

  const winnings = bet * multiplier;
  balance += winnings;
  balanceDisplay.textContent = balance.toFixed(2);
  statusDisplay.textContent = `Cashed out at ${multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`;
  cashoutSound.play();
  endGame(true);
}

function endGame(didCashOut) {
  isGameRunning = false;
  cancelAnimationFrame(animationFrame);
  placeBetButton.disabled = false;
  cashOutButton.disabled = true;
  if (!didCashOut) {
    statusDisplay.textContent = `Crashed at ${multiplier.toFixed(2)}x! Lost $${bet.toFixed(2)}`;
    bet = 0;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

planeImage.onload = drawPlane;
