let sessionId = null;
let countdownInterval = null;
const COUNTDOWN_SEC = 20;

// Tab switch
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.pair-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tab+'-tab').classList.add('active');
  event.target.classList.add('active');
}

// ========== QR Pairing ==========
async function startQRPairing() {
  clearCountdown();
  showLoading(true);
  hideStatus();
  document.getElementById('qrImage').style.display = 'none';
  document.getElementById('qrPlaceholder').style.display = 'flex';
  document.getElementById('expiryBar').style.display = 'none';

  try {
    const res = await fetch('/pair/start-qr', { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    sessionId = data.sessionId;
    if (data.qrImage) {
      document.getElementById('qrImage').src = data.qrImage;
      document.getElementById('qrImage').style.display = 'block';
      document.getElementById('qrPlaceholder').style.display = 'none';
    }
    document.getElementById('expiryBar').style.display = 'block';
    startCountdown();
    pollStatus();
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function startCountdown() {
  let timeLeft = COUNTDOWN_SEC;
  const fill = document.querySelector('.progress-fill');
  const countdownEl = document.getElementById('qrCountdown');
  countdownEl.textContent = `${timeLeft}s`;
  fill.style.width = '100%';

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = `${timeLeft}s`;
    fill.style.width = `${(timeLeft / COUNTDOWN_SEC) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownEl.textContent = 'Expired';
      fill.style.width = '0%';
      // Auto refresh
      startQRPairing();
    }
  }, 1000);
}

function clearCountdown() {
  clearInterval(countdownInterval);
  document.getElementById('qrCountdown').textContent = '';
}

// ========== Pair Code Flow ==========
async function startPairCode() {
  const countryCode = document.getElementById('countryCode').value;
  const number = document.getElementById('phoneNumber').value.trim();
  if (!number) return showError('Please enter your WhatsApp number.');

  showLoading(true);
  hideStatus();
  try {
    const res = await fetch('/pair/start-paircode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode, phoneNumber: number })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    sessionId = data.sessionId;
    document.getElementById('pairCode').value = data.pairCode;
    document.getElementById('pairCodeResult').style.display = 'flex';
    showSuccess('Pair code generated! Enter it in WhatsApp (Linked Devices → Link with phone number).');
    pollStatus();
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function copyPairCode() {
  const code = document.getElementById('pairCode').value;
  if (code) {
    navigator.clipboard.writeText(code);
    showSuccess('Copied!');
  }
}

// ========== Polling ==========
let pollingInterval = null;
async function pollStatus() {
  if (!sessionId) return;
  clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch(`/pair/status/${sessionId}`);
      const data = await res.json();
      if (data.connected) {
        clearInterval(pollingInterval);
        clearCountdown();
        showSuccess('✅ Connected! Bot is now active. Reloading...');
        setTimeout(() => window.location.href = '/', 3000);
      }
    } catch {}
  }, 2000);
}

// ========== UI Helpers ==========
function showLoading(show) {
  document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}
function showSuccess(msg) {
  const el = document.getElementById('statusMessage');
  el.innerHTML = `<span class="success-anim">${msg}</span>`;
}
function showError(msg) {
  const el = document.getElementById('statusMessage');
  el.innerHTML = `<span class="error-anim">❌ ${msg}</span>`;
}
function hideStatus() {
  document.getElementById('statusMessage').innerHTML = '';
  }
