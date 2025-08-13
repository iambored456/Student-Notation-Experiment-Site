export const PC_ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const PC_INDEX = Object.fromEntries(PC_ORDER.map((pc, i) => [pc, i]));

export const INTERVAL_UI = [
  ['U','Unison'],['minor2','m2'],['major2','M2'],['minor3','m3'],['major3','M3'],
  ['P4','P4'],['TT','TT'],['P5','P5'],['minor6','m6'],['major6','M6'],['minor7','m7'],['major7','M7']
];

export const DEGREE_LABELS = ['1','b2','2','b3','3','4','TT','5','b6','6','b7','7'];

// Map enharmonics to the “TT” bucket for degree scoring
export const normalizeDegree = (lab) => lab.replace('#4', 'TT').replace('b5', 'TT');
