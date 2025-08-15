import { state, showSection } from './engine/state.js';
import { startTask, skipTrial, nextTrial } from './engine/runner.js';
import { renderSN, renderFullSN } from './sn/canvasRenderer.js';
import { buildCSV, download } from './utils/csv.js';
import { getPitchRowIndex } from './utils/pitchMapping.js';

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

// Section routing
$$('[data-nav]').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.nav)));

// Mode selection
const modeChip = $('#modeChip');
$$('[data-mode]').forEach(b => b.addEventListener('click', () => {
  state.mode = b.dataset.mode;
  modeChip.textContent = state.mode === 'guided' ? 'Guided' : 'Free-run';
  $$('[data-mode]').forEach(x => x.classList.remove('primary'));
  b.classList.add('primary');
}));

// Tutorial wiring
const tutCanvas = $('#tutCanvas');
const tutDemo = { keyRoot: 'Ab', notes: ['F', 'A'] };
const tutPitchAns = 'A';
const tutIntAns = 'M3';

// Helper function to convert tutorial notes to canvas format
function convertTutorialNotes(notes) {
  console.log('🎼 Converting tutorial notes', notes);
  
  const convertedNotes = notes.map((pitch, index) => {
    const row = getPitchRowIndex(pitch);
    const note = {
      row: row,
      startColumnIndex: 2 + index,
      endColumnIndex: 2 + index,
      shape: 'oval',
      color: '#4a90e2',
      isDrum: false
    };
    console.log(`📝 Converted ${pitch} to`, note);
    return note;
  }).filter(note => note.row !== -1);
  
  console.log('✅ Tutorial notes converted', convertedNotes);
  return convertedNotes;
}

function renderTutorial() { 
  console.log('🎓 renderTutorial called');
  console.log('📋 Tutorial canvas element', tutCanvas);
  
  const canvasNotes = convertTutorialNotes(tutDemo.notes);
  console.log('🎯 Calling renderFullSN with', { 
    canvas: tutCanvas,
    scrollOffset: 1000,
    zoomLevel: 1.5,
    notes: canvasNotes 
  });
  
  renderFullSN(tutCanvas, {
    scrollOffset: 1650, // Adjust to center F4/A4 notes in view (bring them up)
    zoomLevel: 1.5,
    notes: canvasNotes
  });
}

// Render tutorial after a short delay to ensure DOM is ready
setTimeout(renderTutorial, 100);

$$('[data-check]').forEach(b => {
  b.addEventListener('click', () => {
    b.disabled = true;
    const fb = document.createElement('div');
    fb.className = 'chip';
    fb.textContent = b.dataset.check === 'pitch' ? `Answer: ${tutPitchAns}` : `Answer: ${tutIntAns}`;
    b.after(fb);
  });
});

// Start task buttons
const pidInput = $('#pid');
$$('[data-start]').forEach(b => b.addEventListener('click', () => {
  startTask(b.dataset.start, pidInput.value.trim());
  showSection('runner');
}));

// Runner controls
$('#skipBtn').addEventListener('click', () => skipTrial());
$('#nextBtn').addEventListener('click', () => nextTrial());

// CSV export
const exportBtn = $('#exportBtn');
exportBtn.addEventListener('click', () => {
  const rows = state.run.rows || [];
  if (!rows.length) { alert('No data to export yet. Run a task first.'); return; }
  const csv = buildCSV(rows);
  download(`sn_results_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`, csv);
});
