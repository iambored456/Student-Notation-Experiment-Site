// Sample mini-banks (replace with your question banks)
export const BANK = {
  AS: [
    { id:'AS001', pitches:['F','A'], answer:'major3' },
    { id:'AS002', pitches:['C','G'], answer:'P5' },
    { id:'AS003', pitches:['E','F'], answer:'minor2' }
  ],
  AW: [
    { id:'AW001', img:'assets/AW/aw_001.png', answer:'major3' },
    { id:'AW002', img:'assets/AW/aw_002.png', answer:'P5' },
    { id:'AW003', img:'assets/AW/aw_003.png', answer:'minor2' }
  ],
  BS: [
    { id:'BS001', key:'Ab', pitch:'Db', answer:'4' },
    { id:'BS002', key:'E',  pitch:'G',  answer:'b3' },
    { id:'BS003', key:'C',  pitch:'F#', answer:'#4' } // normalized → TT
  ],
  BW: [
    { id:'BW001', img:'assets/BW/bw_001.png', answer:'4'  },
    { id:'BW002', img:'assets/BW/bw_002.png', answer:'b3' },
    { id:'BW003', img:'assets/BW/bw_003.png', answer:'TT' }
  ]
};

export const shuffle = (arr) =>
  arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
