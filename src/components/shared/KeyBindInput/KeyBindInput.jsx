import { useState, useRef, useEffect } from 'react';
import { UE_KEYCODES, mapJsKeyToUE } from './keycodes';
import styles from './keybind.module.css';

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
      }
      setIsListening(false);
      setIsOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isListening, onChange]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.inputGroup}>
        <button 
          className={`${styles.btnRecord} ${isListening ? styles.listening : ''}`}
          onClick={() => { setIsListening(!isListening); setIsOpen(false); }}
          title="Press to capture keystroke"
        >
          {isListening ? 'Press Key...' : '⌨️'}
        </button>
        <div className={styles.select} onClick={() => { setIsOpen(!isOpen); setIsListening(false); setSearch(''); }}>
          <span className="keybind-value">{value || 'Select Key...'}</span>
          <span className="keybind-arrow">▼</span>
        </div>
      </div>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <input 
            type="text" 
            className={styles.search} 
            placeholder="Search key..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className={styles.list}>
            {filteredKeys.length > 0 ? filteredKeys.map(k => (
              <div 
                key={k} 
                className={`${styles.item} ${k === value ? styles.selected : ''}`}
                onClick={() => { onChange(k); setIsOpen(false); }}
              >
                {k}
              </div>
            )) : (
              <div className={styles.noResults}>No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
