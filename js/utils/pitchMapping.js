// js/utils/pitchMapping.js
import { fullRowData } from '../data/pitchData.js';

// Cache for performance
let pitchToRowCache = null;

function buildPitchToRowMapping() {
  if (pitchToRowCache) return pitchToRowCache;
  
  pitchToRowCache = new Map();
  
  fullRowData.forEach((row, index) => {
    // Map various formats
    pitchToRowCache.set(row.toneNote, index);
    pitchToRowCache.set(row.pitch, index);
    
    // Handle common enharmonic equivalents
    const pitch = row.pitch;
    if (pitch.includes('♯')) {
      const flatVersion = pitch.replace('♯', 'b');
      pitchToRowCache.set(flatVersion, index);
    }
    if (pitch.includes('♭')) {
      const sharpVersion = pitch.replace('♭', '#');
      pitchToRowCache.set(sharpVersion, index);
    }
    
    // Add simple pitch class versions (assume octave 4)
    const simplePitch = row.pitch.replace(/\d/g, '');
    if (row.pitch.includes('4')) {
      pitchToRowCache.set(simplePitch, index);
    }
  });
  
  return pitchToRowCache;
}

export function getPitchRowIndex(pitch) {
  console.log(`🔍 Getting row index for pitch: "${pitch}"`);
  
  const mapping = buildPitchToRowMapping();
  console.log(`📊 Mapping has ${mapping.size} entries`);
  
  // Try exact match first
  if (mapping.has(pitch)) {
    const result = mapping.get(pitch);
    console.log(`✅ Exact match found: ${pitch} -> row ${result}`);
    return result;
  }
  
  // Try with octave 4 if no octave specified
  if (!/\d/.test(pitch)) {
    const pitchWith4 = pitch + '4';
    if (mapping.has(pitchWith4)) {
      const result = mapping.get(pitchWith4);
      console.log(`✅ Match with octave 4: ${pitchWith4} -> row ${result}`);
      return result;
    }
  }
  
  // Try normalizing enharmonics
  const normalized = pitch.replace('#', '♯').replace('b', '♭');
  if (mapping.has(normalized)) {
    const result = mapping.get(normalized);
    console.log(`✅ Normalized match: ${normalized} -> row ${result}`);
    return result;
  }
  
  // Fallback: find approximate match
  const basePitch = pitch.replace(/[0-9#b♯♭]/g, '');
  const octave = pitch.match(/\d/) ? parseInt(pitch.match(/\d/)[0]) : 4;
  console.log(`🔍 Fallback search for basePitch: ${basePitch}, octave: ${octave}`);
  
  for (const [key, rowIndex] of mapping.entries()) {
    if (key.includes(basePitch) && key.includes(octave.toString())) {
      console.log(`✅ Fallback match: ${key} -> row ${rowIndex}`);
      return rowIndex;
    }
  }
  
  // Last resort: return middle range
  console.log(`⚠️ No match found for "${pitch}", using fallback row 50`);
  return 50;
}