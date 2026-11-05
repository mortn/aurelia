const STORAGE_KEY = 'one-shot-auction-v1';
const STARTING_BID = 12500;
const MINIMUM_INCREMENT = 100;
const AUCTION_LENGTH = 24 * 60 * 60 * 1000;

const form = document.querySelector('#bid-form');
const amountInput = document.querySelector('#bid-amount');
const message = document.querySelector('#bid-message');
const button = document.querySelector('#bid-button');

function readAuction() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.highBid) && Number.isFinite(saved.endsAt)) {
      return { highBid: saved.highBid, endsAt: saved.endsAt, hasBid: saved.hasBid === true };
    }
  } catch {
    // Fall back to an in-memory auction if browser storage is unavailable.
  }
  return { highBid: STARTING_BID, endsAt: Date.now() + AUCTION_LENGTH, hasBid: false };
}

let auction = readAuction();
saveAuction();

function saveAuction() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auction));
  } catch {
    // The auction remains usable for this page view without browser storage.
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderAuction() {
  const minimumBid = auction.highBid + MINIMUM_INCREMENT;
  document.querySelector('#current-bid').textContent = formatCurrency(auction.highBid);
  document.querySelector('#minimum-bid').textContent = formatCurrency(minimumBid);
  amountInput.min = String(minimumBid);
  amountInput.placeholder = `At least ${formatCurrency(minimumBid)}`;
  const ended = Date.now() >= auction.endsAt;
  amountInput.disabled = auction.hasBid || ended;
  button.disabled = auction.hasBid || ended;

  if (auction.hasBid) {
    message.textContent = 'Your one bid is in. Good luck!';
  } else if (ended) {
    message.textContent = 'This auction has closed.';
  }

  if (auction.hasBid || ended) {
    button.textContent = auction.hasBid ? 'BID PLACED' : 'AUCTION CLOSED';
  }
}

function updateCountdown() {
  const remaining = Math.max(0, auction.endsAt - Date.now());
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  document.querySelector('#hours').textContent = String(hours).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
  document.querySelector('#seconds').textContent = String(seconds).padStart(2, '0');
  if (remaining === 0) renderAuction();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(amountInput.value);
  const minimumBid = auction.highBid + MINIMUM_INCREMENT;

  if (auction.hasBid || Date.now() >= auction.endsAt) {
    renderAuction();
    return;
  }
  if (!Number.isSafeInteger(amount) || amount < minimumBid) {
    message.textContent = `Enter a whole-dollar amount of at least ${formatCurrency(minimumBid)}.`;
    message.classList.add('error');
    amountInput.focus();
    return;
  }

  auction = { ...auction, highBid: amount, hasBid: true };
  saveAuction();
  message.classList.remove('error');
  renderAuction();
});

renderAuction();
updateCountdown();
window.setInterval(updateCountdown, 1000);
