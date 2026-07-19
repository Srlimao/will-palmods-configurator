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
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Scan Interval <span className="val-label">{config.Global.ScanIntervalMs}ms</span></label>
          <input type="range" min="500" max="5000" step="100" value={config.Global.ScanIntervalMs} onChange={e => updateSectionConfig('Global', 'ScanIntervalMs', parseInt(e.target.value))} />
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
