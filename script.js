const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const multiplierDisplay = document.getElementById('multiplier');
const balanceDisplays = [document.getElementById('balance1'), document.getElementById('balance2')];
const statusDisplays = [document.getElementById('status1'), document.getElementById('status2')];
const betAmountInputs = [document.getElementById('betAmount1'), document.getElementById('betAmount2')];
const placeBetButtons = [document.getElementById('placeBet1'), document.getElementById('placeBet2')];
const cashOutButtons = [document.getElementById('cashOut1'), document.getElementById('cashOut2')];

let balance = [100, 100];
let bets = [0, 0];
let multiplier = 1;
let isGameRunning = false;
let time = 0;
let lineX = canvas.width / 2;
let lineY = canvas.height - 50;
let linePath = [];
let activeBets = [false, false];
let animationFrame;

function drawLine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = '#ff5555';
  ctx.lineWidth = 4;
  ctx.moveTo(canvas.width / 2, canvas.height - 50);
  linePath.forEach(point => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}

function updateGame() {
  if (!isGameRunning) return;

  time += 0.05;
  multiplier = Math.exp(time * 0.2); // Exponential growth like Pakakumi
  lineX = canvas.width / 2 + Math.sin(time * 0.4) * 150; // Curved path
  lineY = canvas.height - 50 - time * 60; // Upward movement
  linePath.push({ x: lineX, y: lineY });

  if (linePath.length > 200) {
    linePath.shift();
  }

  if (Math.random() < 0.01 || multiplier > 50 || lineY < -50) {
    endGame(false);
    return;
  }

  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  drawLine();
  animationFrame = requestAnimationFrame(updateGame);
}

function placeBet(index) {
  const betAmount = parseFloat(betAmountInputs[index - 1].value);
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance[index - 1]) {
    statusDisplays[index - 1].textContent = 'Invalid bet amount!';
    return;
  }

  bets[index - 1] = betAmount;
  balance[index - 1] -= betAmount;
  balanceDisplays[index - 1].textContent = balance[index - 1].toFixed(2);
  statusDisplays[index - 1].textContent = 'Bet Placed!';
  activeBets[index - 1] = true;
  placeBetButtons[index - 1].disabled = true;
  cashOutButtons[index - 1].disabled = false;

  if (!isGameRunning) {
    isGameRunning = true;
    multiplier = 1;
    time = 0;
    lineX = canvas.width / 2;
    lineY = canvas.height - 50;
    linePath = [];
    updateGame();
  }
}

function cashOut(index) {
  if (!activeBets[index - 1]) return;

  const winnings = bets[index - 1] * multiplier;
  balance[index - 1] += winnings;
  balanceDisplays[index - 1].textContent = balance[index - 1].toFixed(2);
  statusDisplays[index - 1].textContent = `Cashed out at ${multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`;
  activeBets[index - 1] = false;
  bets[index - 1] = 0;
  placeBetButtons[index - 1].disabled = false;
  cashOutButtons[index - 1].disabled = true;

  if (!activeBets[0] && !activeBets[1]) {
    endGame(true);
  }
}

function endGame(didCashOut) {
  isGameRunning = false;
  cancelAnimationFrame(animationFrame);
  for (let i = 0; i < 2; i++) {
    if (activeBets[i]) {
      statusDisplays[i].textContent = `Crashed at ${multiplier.toFixed(2)}x! Lost $${bets[i].toFixed(2)}`;
      bets[i] = 0;
      activeBets[i] = false;
      placeBetButtons[i].disabled = false;
      cashOutButtons[i].disabled = true;
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawLine();
