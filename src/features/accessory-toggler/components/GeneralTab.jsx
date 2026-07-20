import KeyBindInput from '../../../components/shared/KeyBindInput/KeyBindInput';
import styles from '../styles/accessory.module.css';

export default function GeneralTab({ config, updateConfig, updateKeyBind, schemaProperties }) {
  return (
    <>
      {/* General Settings */}
      <div className={styles.formRow}>
        {schemaProperties.Debug && (
          <div 
            className={`${styles.formGroup} ${styles.checkboxGroup}`} 
            onClick={() => updateConfig('Debug', !config.Debug)}
          >
            <input type="checkbox" checked={config.Debug} readOnly />
            <span className={styles.checkboxText}>Debug Mode</span>
          </div>
        )}
        {schemaProperties.Language && (
          <div className={styles.formGroup}>
            <label>Language</label>
            <select 
              value={config.Language} 
              onChange={e => updateConfig('Language', e.target.value)} 
              style={{ padding: '0.55rem 0.75rem' }}
            >
              {schemaProperties.Language.options.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'system' ? 'System Default' : lang}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.formRow}>
        {schemaProperties.ScanIntervalMs && (
          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <label>Scan Interval <span className="val-label">{config.ScanIntervalMs}ms</span></label>
            <input 
              type="range" 
              min={schemaProperties.ScanIntervalMs.min} 
              max={schemaProperties.ScanIntervalMs.max} 
              step={schemaProperties.ScanIntervalMs.step} 
              value={config.ScanIntervalMs} 
              onChange={e => updateConfig('ScanIntervalMs', parseInt(e.target.value, 10))} 
            />
          </div>
        )}
      </div>

      {/* Keybinds Section */}
      <div className={styles.sectionTitle}>⌨️ Keybinds</div>
      <div className={styles.keybindWarning}>
        ⚠️ Changing keybinds requires a game restart to take effect.
      </div>
      {schemaProperties.KeyBinds && (
        <div className={styles.formRow} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          {Object.keys(schemaProperties.KeyBinds.properties).map(key => (
            <div key={key} className={styles.formGroup} style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>
                {key.replace('ToggleSlot', 'Toggle Slot ').replace('ToggleEditMode', 'Toggle Edit Mode').replace('ResetCoords', 'Reset Coords')}
              </label>
              <KeyBindInput 
                value={config.KeyBinds[key]} 
                onChange={v => updateKeyBind(key, v)} 
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
