import { useState, useEffect } from 'react';
import { downloadJson, readFileAsJson } from '../../components/shared/utils/configParsers';
import HUDPreview from './components/HUDPreview';
import GlobalTab from './components/GlobalTab';
import SectionTab from './components/SectionTab';
import ChangelogView from '../changelog/ChangelogView';
import styles from './styles/hud.module.css';
import { DEFAULT_CONFIG, normalizeConfig } from './utils/hudConfigHelpers';
import schemaData from './utils/HUDLocator.schema.json';
export default function HUDLocatorConfig({ initialConfig, changelogData }) {
  const [config, setConfig] = useState(() => {
    if (initialConfig && (initialConfig.Global || initialConfig.Players || initialConfig.Relics)) {
      return normalizeConfig(initialConfig);
    }
    return DEFAULT_CONFIG;
  });
  const [activeTab, setActiveTab] = useState('Global');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastPos, setToastPos] = useState(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [hasUpdateAlert, setHasUpdateAlert] = useState(false);

  useEffect(() => {
    if (changelogData?.version) {
      const lastRead = localStorage.getItem('mcm_read_version_HUDLocator');
      setHasUpdateAlert(!lastRead || lastRead !== changelogData.version);
    }
  }, [changelogData]);

  useEffect(() => {
    if (!config.Global.Enabled && activeTab !== 'Global') {
      setActiveTab('Global');
    }
  }, [config.Global.Enabled, activeTab]);

  const openChangelog = () => {
    setShowChangelog(true);
    if (hasUpdateAlert && changelogData?.version) {
      setHasUpdateAlert(false);
      localStorage.setItem('mcm_read_version_HUDLocator', changelogData.version);
    }
  };

  const handleCopyPath = (e) => {
    navigator.clipboard.writeText("%localappdata%\\Pal\\Saved\\Mods\\HUDLocator");
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
      const normalized = normalizeConfig(json);
      setConfig(normalized);
    } catch (err) {
      alert(err.message);
    }
  };

  const updateSectionConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateStyleConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        Style: {
          ...prev[section].Style,
          [key]: value
        }
      }
    }));
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>
          <span>⚙️ HUD Locator Settings</span>
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
            %localappdata%\Pal\Saved\Mods\HUDLocator
          </span>
          <span className={styles.copyLabel}>Copy Path</span>
          <span className={styles.copyIconWrapper}>
            {copied ? '✅' : '📋'}
          </span>
        </div>

        <div 
          className={`${styles.dropZone} ${isDragging ? styles.dragover : ''}`} 
          onClick={() => document.getElementById('hud-file-input').click()} 
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }} 
          onDragLeave={e => { e.preventDefault(); setIsDragging(false); }} 
          onDrop={e => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
          }}
        >
          <input type="file" id="hud-file-input" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          <div className={styles.dropZoneText}>
            Drag & drop your <strong>config.json</strong> here or <strong>Click to Browse</strong>
          </div>
        </div>

        <div className={styles.tabs}>
          {Object.keys(schemaData.schema)
            .filter(tab => config.Global.Enabled || tab === 'Global')
            .map(tab => {
              const section = config[tab];
              const isEnabled = tab === 'Global' 
                ? config.Global.Enabled 
                : section?.Filter !== undefined 
                  ? section.Filter !== 'None' 
                  : (section?.Enabled ?? false);
              const tabIcons = {
                Global: '🌐',
                Players: '👥',
                Relics: '🔥',
                Chests: '📦',
                Eggs: '🥚',
                Caves: '🪨',
                Loot: '💎',
                Notes: '📜'
              };
              return (
                <button 
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''} ${!isEnabled ? styles.disabledTab : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className={styles.tabContent}>
                    <span>{tabIcons[tab] || '⚙️'}</span>
                    <span>{tab}</span>
                    <span className={`${styles.statusDot} ${isEnabled ? styles.statusEnabled : styles.statusDisabled}`} />
                  </span>
                </button>
              );
            })}
        </div>

        {activeTab === 'Global' ? (
          <GlobalTab config={config} updateSectionConfig={updateSectionConfig} />
        ) : (
          <SectionTab 
            key={activeTab}
            activeTab={activeTab} 
            config={config} 
            updateSectionConfig={updateSectionConfig} 
            updateStyleConfig={updateStyleConfig} 
          />
        )}
      </div>

      <div className={styles.previewContainer}>
        <HUDPreview config={config} />
        
        <div className={`${styles.panel} ${styles.actions}`}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => downloadJson(config, 'config.json')}>
            💾 Download config.json
          </button>
          <div className={styles.pathCopyContainer} onClick={handleCopyPath} title="Click to copy path" style={{ marginTop: '0.75rem', marginBottom: '0.5rem', width: '100%', fontSize: '0.8rem' }}>
            <span className={styles.pathText}>
              %localappdata%\Pal\Saved\Mods\HUDLocator
            </span>
            <span className={styles.copyLabel}>Copy Path</span>
            <span className={styles.copyIconWrapper}>
              {copied ? '✅' : '📋'}
            </span>
          </div>
          <div className="reload-tip">
            💡 Press <kbd>Alt</kbd> + <kbd>R</kbd> to reload the save in game.
          </div>
        </div>
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
