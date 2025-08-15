// js/rendering/rendererUtils.js

export function getColumnX(index, options) {
    let x = 0;
    for (let i = 0; i < index; i++) {
        const widthMultiplier = options.columnWidths[i] || 0;
        x += widthMultiplier * options.cellWidth;
    }
    return x;
}

export function getRowY(rowIndex, options) {
    // Use consistent cell height for row positioning
    const absoluteY = rowIndex * options.cellHeight;
    const scrollOffset = options.scrollOffset || 0;
    const y = absoluteY - scrollOffset;
    console.log(`📍 getRowY for row ${rowIndex}: absoluteY=${absoluteY}, scrollOffset=${scrollOffset}, final=${y}`);
    return y;
}

export function getPitchClass(pitchWithOctave) {
  let pc = (pitchWithOctave || '').replace(/\d/g, '').trim();
  pc = pc.replace(/b/g, '♭').replace(/#/g, '♯');
  return pc;
}

export function getLineStyleFromPitchClass(pc) {
    switch (pc) {
        case 'C': return { lineWidth: 2, dash: [], color: '#dee2e6' };
        case 'E': return { lineWidth: 1, dash: [10, 10], color: '#dee2e6' };
        case 'G': return { lineWidth: 1, dash: [], color: '#f8f9fa' };
        case 'D♭/C♯':
        case 'E♭/D♯':
        case 'F':
        case 'A':
        case 'B':
            return null;
        default: return { lineWidth: 1, dash: [], color: '#e9ecef' };
    }
}

export function getVisibleRowRange(options) {
    const { viewportHeight, cellHeight, scrollOffset, totalRows } = options;
    const startRow = Math.max(0, Math.floor(scrollOffset / cellHeight) - 2);
    const visibleRowCount = Math.ceil(viewportHeight / cellHeight);
    const endRow = Math.min(totalRows - 1, startRow + visibleRowCount + 4);
    
    console.log(`👁️ getVisibleRowRange: scrollOffset=${scrollOffset}, cellHeight=${cellHeight}, startRow=${startRow}, endRow=${endRow}, visibleRowCount=${visibleRowCount}`);
    return { startRow, endRow };
}