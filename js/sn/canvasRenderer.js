// js/sn/canvasRenderer.js
import { fullRowData } from '../data/pitchData.js';
import { drawPitchGrid } from '../rendering/pitchGridRenderer.js';

const DEFAULT_VISIBLE_SEMITONES = 24;
const DEFAULT_CELL_WIDTH = 40;
const DEFAULT_CELL_HEIGHT = 30;
const SIDE_COLUMN_WIDTH = 2;

/**
 * Render a full Student Notation grid with canvas-based rendering
 * @param {HTMLElement} container - container element 
 * @param {{ scrollOffset?: number, zoomLevel?: number, notes?: any[] }} config
 */
export function renderFullSN(container, { scrollOffset = 0, zoomLevel = 1, notes = [] } = {}) {
  console.log('🎵 renderFullSN called', { container, scrollOffset, zoomLevel, notes });
  
  if (!container) {
    console.error('❌ No container provided to renderFullSN');
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  console.log('✅ Container cleared');
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '500px';
  container.appendChild(canvas);
  console.log('✅ Canvas created and added to container');
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ Failed to get canvas context');
    return;
  }
  console.log('✅ Canvas context obtained');
  
  // Set canvas dimensions with fallback
  const containerRect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  // Use fallback width if container has no width
  const containerWidth = containerRect.width > 0 ? containerRect.width : 800;
  const canvasHeight = 500;
  
  // Set actual canvas buffer size (for drawing)
  canvas.width = containerWidth;
  canvas.height = canvasHeight;
  
  // Set CSS display size
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = canvasHeight + 'px';
  
  console.log('📐 Canvas dimensions set', { 
    canvasWidth: canvas.width, 
    canvasHeight: canvas.height, 
    containerWidth: containerRect.width,
    fallbackWidth: containerWidth,
    cssWidth: canvas.style.width,
    cssHeight: canvas.style.height,
    dpr 
  });
  
  // Don't scale for now to avoid confusion
  // ctx.scale(dpr, dpr);
  
  // Calculate layout
  const viewportHeight = canvasHeight;
  const totalRows = fullRowData.length;
  const cellWidth = DEFAULT_CELL_WIDTH * zoomLevel;
  const cellHeight = DEFAULT_CELL_HEIGHT * zoomLevel;
  
  console.log('📏 Layout calculated', {
    viewportHeight,
    totalRows,
    cellWidth,
    cellHeight,
    zoomLevel
  });
  
  // Simple column setup for basic grid with proper spacing for notes
  const musicColumns = Math.max(8, notes.length + 4); // Ensure enough space for notes
  const columnWidths = [SIDE_COLUMN_WIDTH, SIDE_COLUMN_WIDTH, ...Array(musicColumns).fill(1), SIDE_COLUMN_WIDTH, SIDE_COLUMN_WIDTH];
  console.log('📊 Column setup', { musicColumns, columnWidths, notesCount: notes.length });
  
  // Render options
  const renderOptions = {
    fullRowData,
    columnWidths,
    cellWidth,
    cellHeight,
    viewportHeight,
    scrollOffset,
    totalRows,
    placedNotes: notes || [],
    placedTonicSigns: []
  };
  
  console.log('🎯 Render options prepared', renderOptions);
  console.log('🎨 About to call drawPitchGrid');
  
  // Draw the grid
  drawPitchGrid(ctx, renderOptions);
  
  console.log('✅ drawPitchGrid completed');
}

/**
 * Enhanced version of the original renderSN for backwards compatibility
 */
export function renderSN(container, { keyRoot = null, notes = [], useCanvas = true } = {}) {
  if (useCanvas) {
    renderFullSN(container, { notes });
  } else {
    // Fall back to original DOM rendering if needed
    import('./renderer.js').then(({ renderSN: originalRenderSN }) => {
      originalRenderSN(container, { keyRoot, notes });
    });
  }
}