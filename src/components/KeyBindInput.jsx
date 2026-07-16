import { useState, useRef, useEffect } from 'react';
import { UE_KEYCODES, mapJsKeyToUE } from '../utils/keycodes';

export default function KeyBindInput({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const containerRef = useRef(null);

  // Filter keycodes based on search
  const filteredKeys = UE_KEYCODES.filter(k => k.toLowerCase().includes(search.toLowerCase()));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsListening(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for keydown if isListening is true
  useEffect(() => {
    if (!isListening) return;

    function handleKeyDown(e) {
      e.preventDefault();
      e.stopPropagation();
      const mapped = mapJsKeyToUE(e);
      if (mapped) {
        onChange(mapped);
      } else {
        // If not mapped natively, we just cancel and let them search it manually to prevent bad config.
        // We could alert here, but silently ignoring unmappable complex keys is safer.
      }
      setIsListening(false);
      setIsOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isListening, onChange]);

  return (
    <div className="keybind-wrapper" ref={containerRef}>
      <div className="keybind-input-group">
        <button 
          className={`btn-record ${isListening ? 'listening' : ''}`}
          onClick={() => { setIsListening(!isListening); setIsOpen(false); }}
          title="Press to capture keystroke"
        >
          {isListening ? 'Press Key...' : '⌨️'}
        </button>
        <div className="keybind-select" onClick={() => { setIsOpen(!isOpen); setIsListening(false); setSearch(''); }}>
          <span className="keybind-value">{value || 'Select Key...'}</span>
          <span className="keybind-arrow">▼</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="keybind-dropdown">
          <input 
            type="text" 
            className="keybind-search" 
            placeholder="Search key..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="keybind-list">
            {filteredKeys.length > 0 ? filteredKeys.map(k => (
              <div 
                key={k} 
                className={`keybind-item ${k === value ? 'selected' : ''}`}
                onClick={() => { onChange(k); setIsOpen(false); }}
              >
                {k}
              </div>
            )) : (
              <div className="keybind-no-results">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
