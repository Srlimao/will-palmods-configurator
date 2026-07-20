import KeyBindInput from '../../../components/shared/KeyBindInput/KeyBindInput';
import styles from '../styles/hud.module.css';
import schemaData from '../utils/HUDLocator.schema.json';

export default function GlobalTab({ config, updateSectionConfig }) {
  const globalProps = schemaData.schema.Global.properties;

  return (
    <>
      <div className={styles.formRow}>
        <div 
          className={`${styles.formGroup} ${styles.checkboxGroup}`} 
          onClick={() => updateSectionConfig('Global', 'Enabled', !config.Global.Enabled)}
          title={globalProps.Enabled?.description}
        >
          <input type="checkbox" checked={config.Global.Enabled} readOnly />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.checkboxText}>Master Enabled</span>
            {globalProps.Enabled?.description && (
              <span className={styles.fieldHelpText} style={{ marginTop: '0.15rem', fontSize: '0.75rem' }}>
                {globalProps.Enabled.description}
              </span>
            )}
          </div>
        </div>
        <div 
          className={`${styles.formGroup} ${styles.checkboxGroup}`} 
          onClick={() => updateSectionConfig('Global', 'Debug', !config.Global.Debug)}
          title={globalProps.Debug?.description}
        >
          <input type="checkbox" checked={config.Global.Debug || false} readOnly />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.checkboxText}>Debug Mode</span>
            {globalProps.Debug?.description && (
              <span className={styles.fieldHelpText} style={{ marginTop: '0.15rem', fontSize: '0.75rem' }}>
                {globalProps.Debug.description}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Scan Interval <span className="val-label">{config.Global.ScanIntervalMs}ms</span></label>
          <input 
            type="range" 
            min={globalProps.ScanIntervalMs?.min ?? 500} 
            max={globalProps.ScanIntervalMs?.max ?? 5000} 
            step={globalProps.ScanIntervalMs?.step ?? 250} 
            value={config.Global.ScanIntervalMs} 
            onChange={e => updateSectionConfig('Global', 'ScanIntervalMs', parseInt(e.target.value))} 
          />
          {globalProps.ScanIntervalMs?.description && (
            <div className={styles.fieldHelpText}>{globalProps.ScanIntervalMs.description}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Language</label>
          <select value={config.Global.Language || 'system'} onChange={e => updateSectionConfig('Global', 'Language', e.target.value)}>
            <option value="system">System Default</option>
            <option value="en">English</option>
            <option value="es">Spanish (ES)</option>
            <option value="es-MX">Spanish (MX)</option>
            <option value="ja">Japanese</option>
            <option value="zh-Hans">Chinese (Simplified)</option>
            <option value="zh-Hant">Chinese (Traditional)</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
            <option value="de">German</option>
            <option value="ko">Korean</option>
            <option value="pt-BR">Portuguese (BR)</option>
            <option value="ru">Russian</option>
            <option value="th">Thai</option>
            <option value="vi">Vietnamese</option>
            <option value="id">Indonesian</option>
            <option value="tr">Turkish</option>
            <option value="pl">Polish</option>
          </select>
          {globalProps.Language?.description && (
            <div className={styles.fieldHelpText}>{globalProps.Language.description}</div>
          )}
        </div>
      </div>
      <div className={styles.sectionTitle}>⌨️ Keybinds</div>
      {globalProps.KeyBinds?.description && (
        <div className={styles.fieldHelpText} style={{ marginBottom: '0.75rem', marginTop: '-0.25rem', paddingLeft: '2px' }}>
          {globalProps.KeyBinds.description}
        </div>
      )}
      <div className={styles.keybindWarning}>
        <span className={styles.warningIcon}>🐑</span>
        <span className={styles.warningText}>
          Changing keybinds requires a game restart to take effect (does not work with Alt+R config reload).
        </span>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Toggle Menu Key</label>
          <KeyBindInput value={config.Global.KeyBinds.ToggleMenu} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, ToggleMenu: v })} />
        </div>
        <div className={styles.formGroup}>
          <label>Menu Up Key</label>
          <KeyBindInput value={config.Global.KeyBinds.MenuUp} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuUp: v })} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Menu Down Key</label>
          <KeyBindInput value={config.Global.KeyBinds.MenuDown} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuDown: v })} />
        </div>
        <div className={styles.formGroup}>
          <label>Menu Left Key</label>
          <KeyBindInput value={config.Global.KeyBinds.MenuLeft} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuLeft: v })} />
        </div>
        <div className={styles.formGroup}>
          <label>Menu Right Key</label>
          <KeyBindInput value={config.Global.KeyBinds.MenuRight} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuRight: v })} />
        </div>
      </div>
    </>
  );
}
