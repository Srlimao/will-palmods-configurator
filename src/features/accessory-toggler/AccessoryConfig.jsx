import { useState } from 'react';
import { hexToRgbaObject, rgbaObjectToHex } from '../../components/shared/utils/colorUtils';
import { downloadJson, readFileAsJson } from '../../components/shared/utils/configParsers';
import KeyBindInput from '../../components/shared/KeyBindInput/KeyBindInput';
import styles from './styles/accessory.module.css';

const DEFAULT_CONFIG = {
  ScanIntervalMs: 1000,
  Language: "system",
  DisabledSlots: [],
  TextColorEnabled: { R: 0.0, G: 0.96, B: 0.83, A: 1.0 },
  Debug: true,
  Enabled: true,
  CardBg: { R: 0.05, G: 0.07, B: 0.15, A: 0.85 },
  HUDY: 1226.0,
  KeyBinds: {
    ToggleSlot4: "EIGHT",
    ResetCoords: "R",
    ToggleSlot3: "SEVEN",
    ToggleEditMode: "F7",
    ToggleSlot2: "SIX",
    ToggleSlot1: "FIVE"
  },
  TextColorLabel: { R: 0.9, G: 0.9, B: 0.95, A: 1.0 },
  ShadowColor: { R: 0.0, G: 0.0, B: 0.0, A: 0.9 },
  TextColorDisabled: { R: 1.0, G: 0.35, B: 0.37, A: 1.0 },
  HUDX: 1525.0,
  AccessoryNames: {
    Accessory_Attack_1: "Attack Pendant"
  },
  HUDScale: 1.5,
  BorderColor: { R: 0.0, G: 0.95, B: 1.0, A: 0.6 }
};

export default function AccessoryConfig({ initialConfig }) {
  const [config, setConfig] = useState(() => {
    if (initialConfig) {
      return { ...DEFAULT_CONFIG, ...initialConfig };
    }
    return DEFAULT_CONFIG;
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file) => {
    try {
      const json = await readFileAsJson(file);
      setConfig({ ...DEFAULT_CONFIG, ...json });
    } catch (err) {
      alert(err.message);
    }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateKeyBind = (key, value) => {
    setConfig(prev => ({
      ...prev,
      KeyBinds: { ...prev.KeyBinds, [key]: value }
    }));
  };

  const exportConfig = () => {
    downloadJson(config, 'config.json');
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>⚙️ Accessory Toggler Settings</div>

        <div 
          className={`${styles.dropZone} ${isDragging ? styles.dragover : ''}`} 
          onClick={() => document.getElementById('acc-file-input').click()} 
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }} 
          onDragLeave={e => { e.preventDefault(); setIsDragging(false); }} 
          onDrop={e => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
          }}
        >
          <input type="file" id="acc-file-input" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          <div className={styles.dropZoneText}>
            Drag & drop your <strong>config.json</strong> here or <strong>Click to Browse</strong>
          </div>
        </div>

        <div className={styles.sectionTitle}>General</div>
        <div className={styles.formRow}>
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateConfig('Enabled', !config.Enabled)}>
            <input type="checkbox" checked={config.Enabled} readOnly />
            <span className={styles.checkboxText}>Master Enabled</span>
          </div>
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateConfig('Debug', !config.Debug)}>
            <input type="checkbox" checked={config.Debug} readOnly />
            <span className={styles.checkboxText}>Debug Mode</span>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>HUD Scale <span className="val-label">{config.HUDScale}</span></label>
            <input 
              type="range" min="0.5" max="3.0" step="0.1" 
              value={config.HUDScale} 
              onChange={e => updateConfig('HUDScale', parseFloat(e.target.value))} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Scan Interval (ms) <span className="val-label">{config.ScanIntervalMs}</span></label>
            <input 
              type="range" min="500" max="5000" step="100" 
              value={config.ScanIntervalMs} 
              onChange={e => updateConfig('ScanIntervalMs', parseInt(e.target.value, 10))} 
            />
          </div>
        </div>

        <div className={styles.sectionTitle}>⌨️ Keybinds</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Toggle Edit Mode</label>
            <KeyBindInput value={config.KeyBinds.ToggleEditMode} onChange={v => updateKeyBind('ToggleEditMode', v)} />
          </div>
          <div className={styles.formGroup}>
            <label>Reset Coords</label>
            <KeyBindInput value={config.KeyBinds.ResetCoords} onChange={v => updateKeyBind('ResetCoords', v)} />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label>Toggle Slot 1</label><KeyBindInput value={config.KeyBinds.ToggleSlot1} onChange={v => updateKeyBind('ToggleSlot1', v)} /></div>
          <div className={styles.formGroup}><label>Toggle Slot 2</label><KeyBindInput value={config.KeyBinds.ToggleSlot2} onChange={v => updateKeyBind('ToggleSlot2', v)} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label>Toggle Slot 3</label><KeyBindInput value={config.KeyBinds.ToggleSlot3} onChange={v => updateKeyBind('ToggleSlot3', v)} /></div>
          <div className={styles.formGroup}><label>Toggle Slot 4</label><KeyBindInput value={config.KeyBinds.ToggleSlot4} onChange={v => updateKeyBind('ToggleSlot4', v)} /></div>
        </div>

        <div className={styles.sectionTitle}>🎨 Colors</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Card Background</label>
            <div className={styles.colorPickerWrapper}>
              <input type="color" value={rgbaObjectToHex(config.CardBg)} onChange={e => updateConfig('CardBg', hexToRgbaObject(e.target.value, config.CardBg.A))} />
              <input type="text" value={rgbaObjectToHex(config.CardBg)} readOnly />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Border Color</label>
            <div className={styles.colorPickerWrapper}>
              <input type="color" value={rgbaObjectToHex(config.BorderColor)} onChange={e => updateConfig('BorderColor', hexToRgbaObject(e.target.value, config.BorderColor.A))} />
              <input type="text" value={rgbaObjectToHex(config.BorderColor)} readOnly />
            </div>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Text Color (Enabled)</label>
            <div className={styles.colorPickerWrapper}>
              <input type="color" value={rgbaObjectToHex(config.TextColorEnabled)} onChange={e => updateConfig('TextColorEnabled', hexToRgbaObject(e.target.value, config.TextColorEnabled.A))} />
              <input type="text" value={rgbaObjectToHex(config.TextColorEnabled)} readOnly />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Text Color (Disabled)</label>
            <div className={styles.colorPickerWrapper}>
              <input type="color" value={rgbaObjectToHex(config.TextColorDisabled)} onChange={e => updateConfig('TextColorDisabled', hexToRgbaObject(e.target.value, config.TextColorDisabled.A))} />
              <input type="text" value={rgbaObjectToHex(config.TextColorDisabled)} readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.previewContainer}>
        <div className={`${styles.panel} ${styles.actions}`}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={exportConfig}>
            💾 Download config.json
          </button>
          <div className="help-text">
            Save this file to your mod's directory to apply changes.
          </div>
        </div>
      </div>
    </>
  );
}
