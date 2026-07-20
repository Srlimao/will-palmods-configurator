import { useState, useEffect } from 'react';
import { hexToRgbaObject, rgbaObjectToHex } from '../../components/shared/utils/colorUtils';
import { readFileAsJson } from '../../components/shared/utils/configParsers';
import KeyBindInput from '../../components/shared/KeyBindInput/KeyBindInput';
import DownloadCard from '../../components/shared/DownloadCard/DownloadCard';
import ChangelogView from '../changelog/ChangelogView';
import styles from './styles/accessory.module.css';
import { DEFAULT_CONFIG, normalizeConfig } from './utils/accessoryConfigHelpers';
import schemaData from './AccessoryToggler.schema.json';

export default function AccessoryConfig({ initialConfig, changelogData }) {
  const [config, setConfig] = useState(() => {
    if (initialConfig) {
      return normalizeConfig(initialConfig);
    }
    return DEFAULT_CONFIG;
  });
  const [subTab, setSubTab] = useState('General');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastPos, setToastPos] = useState(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [hasUpdateAlert, setHasUpdateAlert] = useState(false);

  useEffect(() => {
    if (changelogData?.version) {
      const lastRead = localStorage.getItem('mcm_read_version_AccessoryToggler');
      setHasUpdateAlert(!lastRead || lastRead !== changelogData.version);
    }
  }, [changelogData]);

  const openChangelog = () => {
    setShowChangelog(true);
    if (hasUpdateAlert && changelogData?.version) {
      setHasUpdateAlert(false);
      localStorage.setItem('mcm_read_version_AccessoryToggler', changelogData.version);
    }
  };

  const handleCopyPath = (e) => {
    navigator.clipboard.writeText("%localappdata%\\Pal\\Saved\\Mods\\AccessoryToggler");
    setCopied(true);
    setToastPos({ x: e.clientX, y: e.clientY });
    setTimeout(() => {
      setCopied(false);
      setToastPos(null);
    }, 1500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file) => {
    try {
      const json = await readFileAsJson(file);
      setConfig(normalizeConfig(json));
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

  const schemaProperties = schemaData.schema;

  // Manual coordinates handler
  const hasManualCoords = config.HUDX !== null && config.HUDY !== null;
  const toggleManualCoords = () => {
    if (hasManualCoords) {
      updateConfig('HUDX', null);
      updateConfig('HUDY', null);
    } else {
      updateConfig('HUDX', 1525);
      updateConfig('HUDY', 1226);
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>
          <span>⚙️ Accessory Toggler Settings</span>
          <div className={styles.changelogBtnWrapper}>
            {hasUpdateAlert && (
              <div className={styles.tooltip}>
                An update has been detected. Please ensure this mod is updated to the latest version before proceeding.
                <div className={styles.tooltipArrow}></div>
              </div>
            )}
            <button 
              className={styles.btnSecondary} 
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', width: 'auto', borderRadius: '20px' }} 
              onClick={openChangelog}
            >
              <span className={styles.iconWrapper}>
                📜
                {hasUpdateAlert && <span className={styles.redDot}></span>}
              </span>
              Changelog
            </button>
          </div>
        </div>

        <div className={styles.pathCopyContainer} onClick={handleCopyPath} title="Click to copy path" style={{ marginBottom: '1rem' }}>
          <span className={styles.pathText}>
            %localappdata%\Pal\Saved\Mods\AccessoryToggler
          </span>
          <span className={styles.copyLabel}>Copy Path</span>
          <span className={styles.copyIconWrapper}>
            {copied ? '✅' : '📋'}
          </span>
        </div>

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

        {/* Master Enabled above tabs */}
        <div className={styles.formRow} style={{ marginBottom: '0.85rem' }}>
          {schemaProperties.Enabled && (
            <div 
              className={`${styles.formGroup} ${styles.checkboxGroup}`} 
              onClick={() => updateConfig('Enabled', !config.Enabled)}
              style={{ width: '100%', marginBottom: 0 }}
            >
              <input type="checkbox" checked={config.Enabled} readOnly />
              <span className={styles.checkboxText}>Master Enabled</span>
            </div>
          )}
        </div>

        {/* Render settings only when master is active */}
        {config.Enabled && (
          <>
            {/* Sub-tabs Selector */}
            <div className={styles.subTabs}>
              <button 
                type="button" 
                className={`${styles.subTabBtn} ${subTab === 'General' ? styles.active : ''}`}
                onClick={() => setSubTab('General')}
              >
                General Settings
              </button>
              <button 
                type="button" 
                className={`${styles.subTabBtn} ${subTab === 'Style' ? styles.active : ''}`}
                onClick={() => setSubTab('Style')}
              >
                Style Customization
              </button>
            </div>

            {subTab === 'General' ? (
              <>
                {/* General Settings */}
                <div className={styles.formRow}>
                  {schemaProperties.Debug && (
                    <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateConfig('Debug', !config.Debug)}>
                      <input type="checkbox" checked={config.Debug} readOnly />
                      <span className={styles.checkboxText}>Debug Mode</span>
                    </div>
                  )}
                  {schemaProperties.Language && (
                    <div className={styles.formGroup}>
                      <label>Language</label>
                      <select value={config.Language} onChange={e => updateConfig('Language', e.target.value)} style={{ padding: '0.55rem 0.75rem' }}>
                        {schemaProperties.Language.options.map(lang => (
                          <option key={lang} value={lang}>{lang === 'system' ? 'System Default' : lang}</option>
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

                {/* Coordinates Section */}
                <div className={styles.formRow} style={{ marginTop: '0.5rem' }}>
                  <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={toggleManualCoords} style={{ gridColumn: 'span 2' }}>
                    <input type="checkbox" checked={hasManualCoords} readOnly />
                    <span className={styles.checkboxText}>Manual Coordinates (Lock Position)</span>
                  </div>
                </div>

                {hasManualCoords && (
                  <div className={styles.formRow}>
                    {schemaProperties.HUDX && (
                      <div className={styles.formGroup}>
                        <label>HUD X Position <span className="val-label">{config.HUDX}px</span></label>
                        <input 
                          type="range" 
                          min={schemaProperties.HUDX.min} 
                          max={schemaProperties.HUDX.max} 
                          step={schemaProperties.HUDX.step} 
                          value={config.HUDX} 
                          onChange={e => updateConfig('HUDX', parseInt(e.target.value, 10))} 
                        />
                      </div>
                    )}
                    {schemaProperties.HUDY && (
                      <div className={styles.formGroup}>
                        <label>HUD Y Position <span className="val-label">{config.HUDY}px</span></label>
                        <input 
                          type="range" 
                          min={schemaProperties.HUDY.min} 
                          max={schemaProperties.HUDY.max} 
                          step={schemaProperties.HUDY.step} 
                          value={config.HUDY} 
                          onChange={e => updateConfig('HUDY', parseInt(e.target.value, 10))} 
                        />
                      </div>
                    )}
                  </div>
                )}

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
                        <KeyBindInput value={config.KeyBinds[key]} onChange={v => updateKeyBind(key, v)} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Style Customization */}
                <div className={styles.formRow}>
                  {schemaProperties.HUDScale && (
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>HUD Scale <span className="val-label">{config.HUDScale}</span></label>
                      <input 
                        type="range" 
                        min={schemaProperties.HUDScale.min} 
                        max={schemaProperties.HUDScale.max} 
                        step={schemaProperties.HUDScale.step} 
                        value={config.HUDScale} 
                        onChange={e => updateConfig('HUDScale', parseFloat(e.target.value))} 
                      />
                    </div>
                  )}
                </div>

                {/* Colors Section */}
                <div className={styles.sectionTitle}>🎨 Colors</div>
                <div className={styles.formRow} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {Object.entries(schemaProperties)
                    .filter(([_, prop]) => prop.type === 'color')
                    .map(([key]) => (
                      <div key={key} className={styles.formGroup} style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <div className={styles.colorPickerWrapper}>
                          <input type="color" value={rgbaObjectToHex(config[key])} onChange={e => updateConfig(key, hexToRgbaObject(e.target.value, config[key].A))} />
                          <input type="text" value={rgbaObjectToHex(config[key])} readOnly />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.previewContainer}>
        <DownloadCard 
          config={config}
          copied={copied}
          handleCopyPath={handleCopyPath}
          modName="AccessoryToggler"
          styles={styles}
        />
      </div>

      {toastPos && (
        <div 
          className={styles.cursorToast} 
          style={{ left: toastPos.x + 12, top: toastPos.y - 12 }}
        >
          Path copied!
        </div>
      )}

      <ChangelogView 
        changelogData={changelogData} 
        isOpen={showChangelog} 
        onClose={() => setShowChangelog(false)} 
      />
    </>
  );
}
