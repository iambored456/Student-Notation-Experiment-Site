// js/rendering/notes.js
import { getColumnX, getRowY } from './rendererUtils.js';

const SHADOW_BLUR_RADIUS = 3;
const MIN_STROKE_WIDTH_THICK = 1;
const STROKE_WIDTH_RATIO = 0.1;

export function drawSingleColumnOvalNote(ctx, options, note, rowIndex) {
    console.log('🎵 drawSingleColumnOvalNote called', { note, rowIndex, options: Object.keys(options) });
    
    const { columnWidths, cellWidth, cellHeight } = options;
    const y = getRowY(rowIndex, options);
    const x = getColumnX(note.startColumnIndex, options);
    const currentCellWidth = columnWidths[note.startColumnIndex] * cellWidth;
    
    console.log('📐 Note calculations', { y, x, currentCellWidth, cellWidth, cellHeight });
    
    const dynamicStrokeWidth = Math.max(1, currentCellWidth * 0.1);
    const cx = x + currentCellWidth / 2;
    
    // Ensure radii are always positive with minimum values
    const rx = Math.max(10, (currentCellWidth / 2) - (dynamicStrokeWidth / 2));
    const ry = Math.max(10, (cellHeight / 2) - (dynamicStrokeWidth / 2));

    console.log('🎯 Drawing ellipse at', { cx, y, rx, ry, strokeWidth: dynamicStrokeWidth });

    // Safety check - don't draw if dimensions are too small
    if (rx <= 0 || ry <= 0 || currentCellWidth < 6 || cellHeight < 6) {
        console.log('⚠️ Skipping note - dimensions too small');
        return;
    }

    // Draw a simple rectangle first as a fallback test
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(cx - 20, y - 10, 40, 20);
    console.log('✅ Drew red rectangle fallback');

    ctx.save();
    
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, ry, 0, 0, 2 * Math.PI);
    
    ctx.strokeStyle = note.color || '#4a90e2';
    ctx.lineWidth = dynamicStrokeWidth;
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fill();
    ctx.stroke();
    
    console.log('✅ Drew ellipse note');
    
    ctx.restore();
}

export function drawTwoColumnOvalNote(ctx, options, note, rowIndex) {
    const { cellWidth, cellHeight } = options;
    const y = getRowY(rowIndex, options);
    const xStart = getColumnX(note.startColumnIndex, options);
    const centerX = xStart + cellWidth;
    
    const dynamicStrokeWidth = Math.max(MIN_STROKE_WIDTH_THICK, cellWidth * STROKE_WIDTH_RATIO);

    // Draw tail line if note extends
    if (note.endColumnIndex > note.startColumnIndex) {
        const endX = getColumnX(note.endColumnIndex + 1, options);
        ctx.beginPath();
        ctx.moveTo(centerX, y);
        ctx.lineTo(endX, y);
        ctx.strokeStyle = note.color || '#4a90e2';
        ctx.lineWidth = Math.max(1, cellWidth * 0.1);
        ctx.stroke();
    }

    // Ensure radii are always positive with minimum values
    const rx = Math.max(3, cellWidth - (dynamicStrokeWidth / 2));
    const ry = Math.max(3, (cellHeight / 2) - (dynamicStrokeWidth / 2));

    // Safety check - don't draw if dimensions are too small
    if (rx <= 0 || ry <= 0 || cellWidth < 6 || cellHeight < 6) {
        return;
    }

    ctx.save();
    
    ctx.beginPath();
    ctx.ellipse(centerX, y, rx, ry, 0, 0, 2 * Math.PI);
    
    ctx.strokeStyle = note.color || '#4a90e2';
    ctx.lineWidth = dynamicStrokeWidth;
    ctx.shadowColor = note.color || '#4a90e2';
    ctx.shadowBlur = SHADOW_BLUR_RADIUS;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    
    ctx.restore();
}