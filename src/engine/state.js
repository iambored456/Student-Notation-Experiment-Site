export const sections = ['welcome', 'tutorial', 'menu', 'runner'];

export const state = {
  mode: 'guided',
  participant: '',
  // current run
  run: {
    task: null,     // 'AS' | 'AW' | 'BS' | 'BW'
    queue: [],
    idx: 0,
    startTime: 0,
    rows: [],       // completed rows for CSV
  }
};

export function showSection(id) {
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
