export function buildCSV(rows) {
    const header = ['participant','task','questionID','userAnswer','answer','accuracy','responseTimeMs'];
    const lines = [header.join(',')];
    for (const r of rows) {
      const vals = header.map(h => String(r[h] ?? ''));
      const escaped = vals.map(v => /[",\n]/.test(v) ? `"${v.replaceAll('"','""')}"` : v);
      lines.push(escaped.join(','));
    }
    return lines.join('\n');
  }
  
  export function download(filename, text, mime = 'text/csv;charset=utf-8;') {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  