const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const graphCanvas = document.getElementById('graphCanvas');
const graphCtx = graphCanvas.getContext('2d');
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
let planeX = 0;
let planeY = canvas.height - 50;
let planeImage = new Image();
planeImage.src = 'assets/plane.png';
let multiplierHistory = [];
let animationFrame;

function drawPlane() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(planeImage, planeX, planeY, 50, 50);
}

function drawGraph() {
  graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
  graphCtx.beginPath();
  graphCtx.moveTo(0, graphCanvas.height);
  multiplierHistory.forEach((m, i) => {
    const x = (i / (multiplierHistory.length - 1)) * graphCanvas.width;
    const y = graphCanvas.height - (m / 10) * graphCanvas.height;
    graphCtx.lineTo(x, y);
  });
  graphCtx.strokeStyle = '#00ffcc';
  graphCtx.lineWidth = 2;
  graphCtx.stroke();
}

function updateGame() {
  if (!isGameRunning) return;

  multiplier += 0.02;
  planeX += 2.5;
  planeY -= 1.5;
  multiplierHistory.push(multiplier);

  if (multiplierHistory.length > 100) {
    multiplierHistory.shift();
  }

  if (Math.random() < 0.008 || multiplier > 15) {
    crashSound.play();
    endGame(false);
    return;
  }

  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  drawPlane();
  drawGraph();
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
  planeX = 0;
  planeY = canvas.height - 50;
  multiplierHistory = [1];
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
  drawGraph();
}

planeImage.onload = drawPlane;
