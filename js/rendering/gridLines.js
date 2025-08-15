// js/rendering/gridLines.js
import { getColumnX, getRowY, getPitchClass, getLineStyleFromPitchClass } from './rendererUtils.js';

function drawHorizontalMusicLines(ctx, options, startRow, endRow) {
    const musicAreaStartX = getColumnX(2, options);
    const musicAreaEndX = getColumnX(options.columnWidths.length - 2, options);

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        const row = options.fullRowData[rowIndex];
        if (!row) continue;

        const y = getRowY(rowIndex, options);
        if (y < -10 || y > options.viewportHeight + 10) continue;

        const pitchClass = getPitchClass(row.pitch);
        const style = getLineStyleFromPitchClass(pitchClass);
        
        if (!style) continue;

        if (style.color === '#f8f9fa') { 
            ctx.fillStyle = style.color;
            ctx.fillRect(musicAreaStartX, y - options.cellHeight / 2, musicAreaEndX - musicAreaStartX, options.cellHeight);
        } else {
            ctx.beginPath();
            ctx.moveTo(musicAreaStartX, y);
            ctx.lineTo(musicAreaEndX, y);
            ctx.lineWidth = style.lineWidth;
            ctx.strokeStyle = style.color;
            ctx.setLineDash(style.dash);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

export function drawHorizontalLines(ctx, options, startRow, endRow) {
    drawHorizontalMusicLines(ctx, options, startRow, endRow);
}

export function drawVerticalLines(ctx, options) {
    const { columnWidths } = options;
    const totalColumns = columnWidths.length;
    
    for (let i = 0; i <= totalColumns; i++) {
        const x = getColumnX(i, options);
        let style;
        const isBoundary = i === 2 || i === totalColumns - 2;

        if (isBoundary) {
            style = { lineWidth: 2, strokeStyle: '#dee2e6', dash: [] };
        } else { 
            continue; 
        }
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.lineWidth = style.lineWidth;
        ctx.strokeStyle = style.strokeStyle;
        ctx.setLineDash(style.dash);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}