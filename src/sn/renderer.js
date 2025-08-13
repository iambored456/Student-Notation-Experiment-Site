import { PC_ORDER, PC_INDEX } from './constants.js';

/**
 * Render a 12-row chromatic Student Notation grid into a target element.
 * @param {HTMLElement} canvas - container with CSS class `.canvas`
 * @param {{ keyRoot?: string|null, notes?: string[] }} config
 */
export function renderSN(canvas, { keyRoot = null, notes = [] } = {}) {
  if (!canvas) return;
  canvas.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'sn';

  for (let i = 0; i < 12; i++) {
    const pc = PC_ORDER[i];
    const row = document.createElement('div');
    row.className = 'sn-row';
    row.dataset.pc = pc;
    const lab = document.createElement('div');
    lab.className = 'sn-label';
    lab.textContent = pc;
    row.appendChild(lab);
    grid.appendChild(row);
  }
  canvas.appendChild(grid);

  if (keyRoot) {
    const key = document.createElement('div');
    key.className = 'sn-key';
    key.innerHTML = `<span class="root">1</span><span>Key: <b>${keyRoot}</b></span>`;
    canvas.appendChild(key);
  }

  // position notes
  const height = canvas.clientHeight || 360;
  const rowH = height / 12;
  const xStart = 140;
  const noteGap = 56;

  notes.forEach((pc, idx) => {
    const ix = PC_INDEX[pc.replace('♯', '#').replace('♭', 'b')];
    if (ix == null) return;
    const y = (ix * rowH) + (rowH / 2) - 9;
    const x = xStart + idx * noteGap;
    const dot = document.createElement('div');
    dot.className = 'note';
    dot.style.setProperty('--x', `${x}px`);
    dot.style.setProperty('--y', `${y}px`);
    dot.setAttribute('aria-label', `Note ${pc}`);
    dot.innerHTML = '<span class="sr" aria-hidden="true"></span>';
    canvas.appendChild(dot);
  });
}

/** Render a placeholder box for WSMN until images or a library are wired. */
export function renderWSPlaceholder(canvas, text = 'WSMN image or score rendering goes here') {
  if (!canvas) return;
  canvas.innerHTML = `<div class="ws-placeholder">${text}</div>`;
}
