import { useState } from 'react';
import { downloadJson, readFileAsJson } from '../../components/shared/utils/configParsers';
import HUDPreview from './components/HUDPreview';
import GlobalTab from './components/GlobalTab';
import SectionTab from './components/SectionTab';
import styles from './styles/hud.module.css';

const DEFAULT_CONFIG = {
  Global: {
    Enabled: true,
    Language: "system",
    ScanIntervalMs: 1500,
    Debug: false,
    KeyBinds: {
      ToggleMenu: "F6",
      MenuUp: "UP_ARROW",
      MenuDown: "DOWN_ARROW",
      MenuLeft: "LEFT_ARROW",
      MenuRight: "RIGHT_ARROW"
    }
  },
  Players: {
    Enabled: true,
    MaxDistance: 15000.0,
    GraceRadiusM: 30,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 120.0,
      NameColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      DistColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Relics: {
    Enabled: true,
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.1, G: 0.9, B: 0.9, A: 1.0 },
      DistColor: { R: 0.1, G: 0.9, B: 0.9, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Chests: {
    Enabled: true,
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.9, G: 0.7, B: 0.1, A: 1.0 },
      DistColor: { R: 0.9, G: 0.7, B: 0.1, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Eggs: {
    Filter: "All",
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.8, G: 0.5, B: 0.8, A: 1.0 },
      DistColor: { R: 0.8, G: 0.5, B: 0.8, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Caves: {
    Enabled: true,
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.6, G: 0.2, B: 0.9, A: 1.0 },
      DistColor: { R: 0.6, G: 0.2, B: 0.9, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  }
};

const normalizeSection = (sectionName, inputSection, defaultSection) => {
  if (!inputSection) return defaultSection;
  const section = { ...inputSection };
  if (!section.Style) {
    section.Style = {};
  } else {
    section.Style = { ...section.Style };
  }
  const styleKeys = [
    'DrawBox', 'FontScale', 'SmallFontScale', 'TextOffsetZ',
    'NameColor', 'DistColor', 'BoxColor', 'BorderColor',
    'BorderWidth', 'BoxPadX', 'BoxPadY', 'FontCharW', 'FontLineH'
  ];
  styleKeys.forEach(key => {
    if (section[key] !== undefined) {
      section.Style[key] = section[key];
      delete section[key];
    }
  });
  if (section.Color !== undefined) {
    if (section.Style.NameColor === undefined) {
      section.Style.NameColor = section.Color;
    }
    if (section.Style.DistColor === undefined) {
      section.Style.DistColor = section.Color;
    }
    delete section.Color;
  }
  section.Style = {
    ...defaultSection.Style,
    ...section.Style
  };
  const rootKeys = ['Enabled', 'Filter', 'MaxDistance', 'GraceRadiusM'];
  rootKeys.forEach(key => {
    if (section[key] === undefined && defaultSection[key] !== undefined) {
      section[key] = defaultSection[key];
    }
  });
  return section;
};

const normalizeConfig = (json) => {
  if (!json) return DEFAULT_CONFIG;
  return {
    Global: {
      ...DEFAULT_CONFIG.Global,
      ...(json.Global || {})
    },
    Players: normalizeSection('Players', json.Players, DEFAULT_CONFIG.Players),
    Relics: normalizeSection('Relics', json.Relics, DEFAULT_CONFIG.Relics),
    Chests: normalizeSection('Chests', json.Chests, DEFAULT_CONFIG.Chests),
    Eggs: normalizeSection('Eggs', json.Eggs, DEFAULT_CONFIG.Eggs),
    Caves: normalizeSection('Caves', json.Caves, DEFAULT_CONFIG.Caves)
  };
};

export default function HUDLocatorConfig({ initialConfig }) {
  const [config, setConfig] = useState(() => {
    if (initialConfig && (initialConfig.Global || initialConfig.Players || initialConfig.Relics)) {
      return normalizeConfig(initialConfig);
    }
    return DEFAULT_CONFIG;
  });
  const [activeTab, setActiveTab] = useState('Global');
  const [isDragging, setIsDragging] = useState(false);

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
        <div className={styles.panelTitle}>⚙️ HUD Locator Settings</div>
        
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
          <div className={styles.dropZoneHint}>
            Note: In-game configuration is loaded from: <code>%USERPROFILE%\Documents\My Games\Palworld\ModConfigs\HUDLocator\config.json</code>
          </div>
        </div>

        <div className={styles.tabs}>
          {['Global', 'Players', 'Relics', 'Chests', 'Eggs', 'Caves'].map(tab => (
            <button 
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Global' ? (
          <GlobalTab config={config} updateSectionConfig={updateSectionConfig} />
        ) : (
          <SectionTab 
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
          <div className="help-text">
            Save this file to your mod's directory to apply changes.
          </div>
        </div>
      </div>
    </>
  );
}
