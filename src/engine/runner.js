import { renderSN, renderWSPlaceholder } from '../sn/renderer.js';
import { INTERVAL_UI, DEGREE_LABELS, normalizeDegree } from '../sn/constants.js';
import { BANK, shuffle } from './bank.js';
import { state } from './state.js';

const $ = (q, el = document) => el.querySelector(q);

const answerPad = $('#answerPad');
const feedbackEl = $('#feedback');
const progressEl = $('#progress');
const timerEl = $('#timer');
const displayKind = $('#displayKind');
const taskLabel = $('#taskLabel');
const canvas = $('#taskCanvas');
const nextBtn = $('#nextBtn');

let timerHandle = null, t0 = 0;

function startTimer() {
  stopTimer();
  t0 = performance.now();
  timerHandle = setInterval(() => {
    const dt = (performance.now() - t0) / 1000;
    timerEl.textContent = (Math.round(dt * 100) / 100).toFixed(2) + 's';
  }, 50);
}
function stopTimer() { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }

function padForTask(task) {
  answerPad.innerHTML = '';
  const isInterval = (task === 'AS' || task === 'AW');
  const opts = isInterval ? INTERVAL_UI : DEGREE_LABELS.map(l => [l, l]);
  for (const [val, lab] of opts) {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.type = 'button';
    btn.textContent = lab;
    btn.dataset.val = val;
    btn.addEventListener('click', () => handleAnswer(val));
    answerPad.appendChild(btn);
  }
}

export function startTask(code, participantId) {
  state.participant = participantId || '';
  state.run.task = code;
  state.run.queue = shuffle(BANK[code].slice());
  state.run.idx = 0;
  state.run.rows = [];
  nextBtn.disabled = true; feedbackEl.textContent = '';

  taskLabel.textContent = (code === 'AS' || code === 'AW') ? 'Interval' : 'Scale Degree';
  displayKind.textContent = (code === 'AS' || code === 'BS') ? 'Student Notation' : 'WSMN';
  padForTask(code);
  renderCurrent();
}

function renderCurrent() {
  const item = state.run.queue[state.run.idx];
  progressEl.textContent = `${state.run.idx + 1}/${state.run.queue.length}`;
  nextBtn.disabled = true; feedbackEl.className = 'feedback'; feedbackEl.textContent = '';

  if (state.run.task === 'AS') {
    renderSN(canvas, { keyRoot: null, notes: item.pitches });
  } else if (state.run.task === 'BS') {
    renderSN(canvas, { keyRoot: item.key, notes: [item.pitch] });
  } else {
    renderWSPlaceholder(canvas); // swap with real images or renderer
  }

  state.run.startTime = performance.now();
  startTimer();
}

function labelFor(val) {
  const found = INTERVAL_UI.find(x => x[0] === val);
  return found ? found[1] : val;
}

function handleAnswer(val) {
  const ms = performance.now() - state.run.startTime;
  const item = state.run.queue[state.run.idx];
  const isDegree = (state.run.task === 'BS' || state.run.task === 'BW');
  const user = isDegree ? normalizeDegree(val) : val;
  const correct = isDegree ? normalizeDegree(item.answer) : item.answer;
  const ok = user === correct;

  feedbackEl.textContent = ok
    ? `Correct`
    : `Incorrect — your answer: ${labelFor(user)}; correct: ${labelFor(correct)}`;
  feedbackEl.className = 'feedback ' + (ok ? 'good' : 'bad');
  nextBtn.disabled = false;

  state.run.rows.push({
    participant: state.participant,
    task: state.run.task,
    questionID: item.id,
    userAnswer: user,
    answer: correct,
    accuracy: ok ? 1 : 0,
    responseTimeMs: Math.round(ms)
  });
}

export function skipTrial() {
  const item = state.run.queue[state.run.idx];
  state.run.rows.push({
    participant: state.participant,
    task: state.run.task,
    questionID: item.id,
    userAnswer: 'SKIP',
    answer: item.answer,
    accuracy: 0,
    responseTimeMs: 0
  });
  feedbackEl.className = 'feedback bad';
  feedbackEl.textContent = 'Skipped. Marked as incorrect.';
  nextBtn.disabled = false;
}

export function nextTrial() {
  stopTimer();
  if (state.run.idx < state.run.queue.length - 1) {
    state.run.idx++;
    renderCurrent();
  } else {
    feedbackEl.className = 'feedback good';
    feedbackEl.textContent = 'Task complete. Export data or choose another task.';
  }
}
