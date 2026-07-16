export const UE_KEYCODES = [
  "LEFT_MOUSE_BUTTON", "RIGHT_MOUSE_BUTTON", "CANCEL", "MIDDLE_MOUSE_BUTTON",
  "XBUTTON_ONE", "XBUTTON_TWO", "BACKSPACE", "TAB", "CLEAR", "RETURN", "PAUSE",
  "CAPS_LOCK", "IME_KANA", "IME_HANGUEL", "IME_HANGUL", "IME_ON", "IME_JUNJA",
  "IME_FINAL", "IME_HANJA", "IME_KANJI", "IME_OFF", "ESCAPE", "IME_CONVERT",
  "IME_NONCONVERT", "IME_ACCEPT", "IME_MODECHANGE", "SPACE", "PAGE_UP",
  "PAGE_DOWN", "END", "HOME", "LEFT_ARROW", "UP_ARROW", "RIGHT_ARROW",
  "DOWN_ARROW", "SELECT", "PRINT", "EXECUTE", "PRINT_SCREEN", "INS", "DEL",
  "HELP", "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
  "NINE", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
  "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "LEFT_WIN",
  "RIGHT_WIN", "APPS", "SLEEP", "NUM_ZERO", "NUM_ONE", "NUM_TWO", "NUM_THREE",
  "NUM_FOUR", "NUM_FIVE", "NUM_SIX", "NUM_SEVEN", "NUM_EIGHT", "NUM_NINE",
  "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2",
  "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14",
  "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
  "NUM_LOCK", "SCROLL_LOCK", "BROWSER_BACK", "BROWSER_FORWARD", "BROWSER_REFRESH",
  "BROWSER_STOP", "BROWSER_SEARCH", "BROWSER_FAVORITES", "BROWSER_HOME",
  "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "MEDIA_NEXT_TRACK",
  "MEDIA_PREV_TRACK", "MEDIA_STOP", "MEDIA_PLAY_PAUSE", "LAUNCH_MAIL",
  "LAUNCH_MEDIA_SELECT", "LAUNCH_APP1", "LAUNCH_APP2", "OEM_ONE", "OEM_PLUS",
  "OEM_COMMA", "OEM_MINUS", "OEM_PERIOD", "OEM_TWO", "OEM_THREE", "OEM_FOUR",
  "OEM_FIVE", "OEM_SIX", "OEM_SEVEN", "OEM_EIGHT", "OEM_102", "IME_PROCESS",
  "PACKET", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "PA1", "OEM_CLEAR"
];

const jsToUeMap = {
  "Backspace": "BACKSPACE",
  "Tab": "TAB",
  "Enter": "RETURN",
  "Pause": "PAUSE",
  "CapsLock": "CAPS_LOCK",
  "Escape": "ESCAPE",
  "Space": "SPACE",
  "PageUp": "PAGE_UP",
  "PageDown": "PAGE_DOWN",
  "End": "END",
  "Home": "HOME",
  "ArrowLeft": "LEFT_ARROW",
  "ArrowUp": "UP_ARROW",
  "ArrowRight": "RIGHT_ARROW",
  "ArrowDown": "DOWN_ARROW",
  "Insert": "INS",
  "Delete": "DEL",
  "Meta": "LEFT_WIN",
  "ContextMenu": "APPS",
  "NumLock": "NUM_LOCK",
  "ScrollLock": "SCROLL_LOCK"
};

export function mapJsKeyToUE(e) {
  // Check exact map
  if (jsToUeMap[e.code]) return jsToUeMap[e.code];
  if (jsToUeMap[e.key]) return jsToUeMap[e.key];

  // Letters
  if (e.code.startsWith("Key") && e.code.length === 4) {
    return e.code.charAt(3).toUpperCase();
  }

  // Digits (top row)
  const digits = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  if (e.code.startsWith("Digit") && e.code.length === 6) {
    const num = parseInt(e.code.charAt(5));
    if (!isNaN(num)) return digits[num];
  }

  // Numpad digits
  if (e.code.startsWith("Numpad") && e.code.length === 7) {
    const num = parseInt(e.code.charAt(6));
    if (!isNaN(num)) return "NUM_" + digits[num];
  }

  // Numpad operations
  if (e.code === "NumpadMultiply") return "MULTIPLY";
  if (e.code === "NumpadAdd") return "ADD";
  if (e.code === "NumpadSubtract") return "SUBTRACT";
  if (e.code === "NumpadDecimal") return "DECIMAL";
  if (e.code === "NumpadDivide") return "DIVIDE";

  // F keys
  if (e.code.match(/^F[1-9][0-9]?$/)) {
    return e.code.toUpperCase();
  }

  return null;
}
