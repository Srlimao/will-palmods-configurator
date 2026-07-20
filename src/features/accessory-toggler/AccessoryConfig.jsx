import { useState, useEffect } from 'react';
import { readFileAsJson } from '../../components/shared/utils/configParsers';
import DownloadCard from '../../components/shared/DownloadCard/DownloadCard';
import ChangelogView from '../changelog/ChangelogView';
import GeneralTab from './components/GeneralTab';
import StyleTab from './components/StyleTab';
import AccessoryPreview from './components/AccessoryPreview';
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
              <GeneralTab 
                config={config} 
                updateConfig={updateConfig} 
                updateKeyBind={updateKeyBind} 
                schemaProperties={schemaProperties} 
              />
            ) : (
              <StyleTab 
                config={config} 
                updateConfig={updateConfig} 
                schemaProperties={schemaProperties} 
              />
            )}
          </>
        )}
      </div>

      <div className={styles.previewContainer}>
        <AccessoryPreview config={config} updateConfig={updateConfig} />
        
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
