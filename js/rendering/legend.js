// js/rendering/legend.js
import { getColumnX, getRowY, getPitchClass, getLineStyleFromPitchClass } from './rendererUtils.js';

function drawSpecialBorder(ctx, x, y, width, style) {
    if (!style) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineWidth = style.lineWidth;
    ctx.strokeStyle = style.color;
    ctx.setLineDash(style.dash);
    ctx.stroke();
    ctx.setLineDash([]);
}

export function drawLegends(ctx, options, startRow, endRow) {
    const { fullRowData, columnWidths, cellWidth, cellHeight } = options;

    const processLabel = (label) => {
        if (!label.includes('/')) return label;

        const octave = label.slice(-1);
        const pitches = label.substring(0, label.length - 1);
        const [flatName, sharpName] = pitches.split('/');
        
        return `${flatName}/${sharpName}${octave}`;
    };
    
    function drawLegendColumn(startCol, columnsOrder) {
        const xStart = getColumnX(startCol, options);
        const colWidthsPx = columnWidths.slice(startCol, startCol + 2).map(w => w * cellWidth);
        let cumulativeX = xStart;

        columnsOrder.forEach((colLabel, colIndex) => {
            const colWidth = colWidthsPx[colIndex];
            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                const row = fullRowData[rowIndex];
                if (!row || row.isDummy) continue;

                if (row.column === colLabel) {
                    const y = getRowY(rowIndex, options);
                    
                    ctx.fillStyle = row.hex || '#ffffff';
                    ctx.fillRect(cumulativeX, y - cellHeight / 2, colWidth, cellHeight);
                    
                    const pitchClass = getPitchClass(row.pitch);
                    const cellTopY = y - cellHeight / 2;

                    if (pitchClass === 'B') {
                        drawSpecialBorder(ctx, cumulativeX, cellTopY, colWidth, getLineStyleFromPitchClass('C'));
                    }
                    if (pitchClass === 'E♭/D♯') {
                        drawSpecialBorder(ctx, cumulativeX, cellTopY, colWidth, getLineStyleFromPitchClass('E'));
                    }

                    const pitchToDraw = processLabel(row.pitch);

                    const isShortLabel = pitchToDraw.length <= 3;
                    const baseFontSize = Math.max(10, Math.min(cellWidth * 1.2, cellHeight * 1.2));
                    const finalFontSize = isShortLabel ? baseFontSize : baseFontSize * 0.7;

                    ctx.font = `bold ${finalFontSize}px 'Atkinson Hyperlegible', sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const textX = cumulativeX + colWidth / 2;
                    const textY = y;

                    ctx.strokeStyle = '#212529';
                    ctx.lineWidth = 2.5;        
                    ctx.lineJoin = 'round';     
                    ctx.strokeText(pitchToDraw, textX, textY);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(pitchToDraw, textX, textY);
                }
            }
            cumulativeX += colWidth;
        });
    }

    drawLegendColumn(0, ['B', 'A']);
    drawLegendColumn(columnWidths.length - 2, ['A', 'B']);
}