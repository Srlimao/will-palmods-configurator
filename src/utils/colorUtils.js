/**
 * Converts a hex string (#RRGGBB) to a Unreal Engine standard RGBA format used in the mod JSON.
 * @param {string} hex 
 * @param {number} alpha 
 * @returns {object} { R, G, B, A }
 */
export const hexToRgbaObject = (hex, alpha = 1.0) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  return { R: r, G: g, B: b, A: alpha };
};

/**
 * Converts an RGBA object back to a hex string for HTML color inputs.
 * @param {object} colorObj { R, G, B, A }
 * @returns {string} #RRGGBB
 */
export const rgbaObjectToHex = (colorObj) => {
  if (!colorObj) return '#ffffff';
  const r = Math.round((colorObj.R ?? 1) * 255).toString(16).padStart(2, '0');
  const g = Math.round((colorObj.G ?? 1) * 255).toString(16).padStart(2, '0');
  const b = Math.round((colorObj.B ?? 1) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

/**
 * Ensures float format string (e.g., 1.0 instead of 1) for JSON export if needed.
 */
export const toFloatString = (num) => {
  return Number.isInteger(num) ? num.toFixed(1) : num.toString();
};
