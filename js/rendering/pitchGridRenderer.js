// js/rendering/pitchGridRenderer.js
import { drawHorizontalLines, drawVerticalLines } from './gridLines.js';
import { drawLegends } from './legend.js';
import { drawSingleColumnOvalNote, drawTwoColumnOvalNote } from './notes.js';
import { getVisibleRowRange } from './rendererUtils.js';

export function drawPitchGrid(ctx, options) {
    console.log('🎨 drawPitchGrid started', { 
        canvasSize: { width: ctx.canvas.width, height: ctx.canvas.height },
        optionsKeys: Object.keys(options),
        placedNotesCount: options.placedNotes?.length || 0
    });
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Add a light background so we can see the canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Add a visible border
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, ctx.canvas.width - 4, ctx.canvas.height - 4);
    
    // Add debug text
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText(`Canvas: ${ctx.canvas.width}x${ctx.canvas.height}`, 10, 30);
    ctx.fillText('Grid Rendering...', 10, 50);
    
    console.log('🧹 Canvas cleared, background set, and debug elements added');

    const { startRow, endRow } = getVisibleRowRange(options);
    console.log('👁️ Visible range calculated', { startRow, endRow });
    
    console.log('🏛️ Drawing legends...');
    drawLegends(ctx, options, startRow, endRow);
    
    console.log('📏 Drawing horizontal lines...');
    drawHorizontalLines(ctx, options, startRow, endRow);
    
    console.log('📐 Drawing vertical lines...');
    drawVerticalLines(ctx, options);
    
    // Draw notes
    const visibleNotes = (options.placedNotes || []).filter(note => 
        !note.isDrum && note.row >= startRow && note.row <= endRow
    );
    
    console.log('🎵 Notes to draw', { 
        totalNotes: options.placedNotes?.length || 0,
        visibleNotesCount: visibleNotes.length,
        visibleNotes: visibleNotes.map(n => ({ row: n.row, shape: n.shape, column: n.startColumnIndex }))
    });

    visibleNotes.forEach((note, index) => {
        console.log(`🎶 Drawing note ${index + 1}/${visibleNotes.length}`, note);
        if (note.shape === 'oval') {
            drawSingleColumnOvalNote(ctx, options, note, note.row);
        } else if (note.shape === 'circle') {
            drawTwoColumnOvalNote(ctx, options, note, note.row);
        }
    });
    
    console.log('✅ drawPitchGrid completed');
}