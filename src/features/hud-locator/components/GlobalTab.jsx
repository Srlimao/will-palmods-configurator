import KeyBindInput from '../../../components/shared/KeyBindInput/KeyBindInput';
import styles from '../styles/hud.module.css';

export default function GlobalTab({ config, updateSectionConfig }) {
  return (
    <>
      <div className={styles.formRow}>
        <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateSectionConfig('Global', 'Enabled', !config.Global.Enabled)}>
          <input type="checkbox" checked={config.Global.Enabled} readOnly />
          <span className={styles.checkboxText}>Master Enabled</span>
        </div>
        <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateSectionConfig('Global', 'Debug', !config.Global.Debug)}>
          <input type="checkbox" checked={config.Global.Debug || false} readOnly />
          <span className={styles.checkboxText}>Debug Mode</span>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Scan Interval <span className="val-label">{config.Global.ScanIntervalMs}ms</span></label>
          <input type="range" min="500" max="5000" step="100" value={config.Global.ScanIntervalMs} onChange={e => updateSectionConfig('Global', 'ScanIntervalMs', parseInt(e.target.value))} />
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
        </div>
      </div>
      <div className={styles.sectionTitle}>⌨️ Keybinds</div>
      <div className={styles.keybindWarning}>
        ⚠️ Changing keybinds requires a game restart to take effect (does not work with Alt+R config reload).
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
