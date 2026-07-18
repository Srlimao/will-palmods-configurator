export const downloadJson = async (data, filename) => {
  // Attempt to use modern File System Access API to prompt for a custom path
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'JSON Configuration File',
          accept: {
            'application/json': ['.json'],
          },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // User canceled the dialog
      }
      console.warn('showSaveFilePicker failed, falling back to standard download:', err);
    }
  }

  // Fallback: standard anchor tag download with a delay on revokeObjectURL to prevent UUID naming bug
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 250);
};

export const readFileAsJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch {
        reject(new Error('Invalid JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};
