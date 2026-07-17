import { useState } from 'react';
import { hexToRgbaObject, rgbaObjectToHex } from '../utils/colorUtils';
import { downloadJson, readFileAsJson } from '../utils/configParsers';
import KeyBindInput from './KeyBindInput';

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

export default function HUDLocatorConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('Global');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file) => {
    try {
      const json = await readFileAsJson(file);
      const normalized = {
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

  const exportConfig = () => {
    downloadJson(config, 'config.json');
  };

  // Live preview helpers
  const getPreviewStyle = (section) => {
    const secStyle = config[section]?.Style;
    if (!secStyle || !secStyle.DrawBox) return { background: 'transparent', border: 'none' };
    const { BoxColor, BorderColor, BorderWidth, BoxPadX, BoxPadY } = secStyle;
    return {
      backgroundColor: `rgba(${Math.round(BoxColor.R*255)}, ${Math.round(BoxColor.G*255)}, ${Math.round(BoxColor.B*255)}, ${BoxColor.A})`,
      borderColor: `rgba(${Math.round(BorderColor.R*255)}, ${Math.round(BorderColor.G*255)}, ${Math.round(BorderColor.B*255)}, ${BorderColor.A})`,
      borderWidth: `${BorderWidth}px`,
      padding: `${BoxPadY}px ${BoxPadX}px`
    };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Global':
        return (
          <>
            <div className="form-row">
              <div className="form-group checkbox-group" onClick={() => updateSectionConfig('Global', 'Enabled', !config.Global.Enabled)}>
                <input type="checkbox" checked={config.Global.Enabled} readOnly />
                <span className="checkbox-text">Master Enabled</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Scan Interval <span className="val-label">{config.Global.ScanIntervalMs}ms</span></label>
                <input type="range" min="500" max="5000" step="100" value={config.Global.ScanIntervalMs} onChange={e => updateSectionConfig('Global', 'ScanIntervalMs', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="section-title">⌨️ Keybinds</div>
            <div className="form-row">
              <div className="form-group">
                <label>Toggle Menu Key</label>
                <KeyBindInput value={config.Global.KeyBinds.ToggleMenu} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, ToggleMenu: v })} />
              </div>
              <div className="form-group">
                <label>Menu Up Key</label>
                <KeyBindInput value={config.Global.KeyBinds.MenuUp} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuUp: v })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Menu Down Key</label>
                <KeyBindInput value={config.Global.KeyBinds.MenuDown} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuDown: v })} />
              </div>
              <div className="form-group">
                <label>Menu Left Key</label>
                <KeyBindInput value={config.Global.KeyBinds.MenuLeft} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuLeft: v })} />
              </div>
              <div className="form-group">
                <label>Menu Right Key</label>
                <KeyBindInput value={config.Global.KeyBinds.MenuRight} onChange={v => updateSectionConfig('Global', 'KeyBinds', { ...config.Global.KeyBinds, MenuRight: v })} />
              </div>
            </div>
          </>
        );
      case 'Players':
        return (
          <>
            <div className="form-row">
              <div className="form-group checkbox-group" onClick={() => updateSectionConfig('Players', 'Enabled', !config.Players.Enabled)}>
                <input type="checkbox" checked={config.Players.Enabled} readOnly />
                <span className="checkbox-text">Track Players</span>
              </div>
              <div className="form-group checkbox-group" onClick={() => updateStyleConfig('Players', 'DrawBox', !config.Players.Style.DrawBox)}>
                <input type="checkbox" checked={config.Players.Style.DrawBox} readOnly />
                <span className="checkbox-text">Draw Background Box</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Range <span className="val-label">{config.Players.MaxDistance / 100}m</span></label>
                <input type="range" min="5000" max="50000" step="1000" value={config.Players.MaxDistance} onChange={e => updateSectionConfig('Players', 'MaxDistance', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Grace Radius <span className="val-label">{config.Players.GraceRadiusM}m</span></label>
                <input type="range" min="0" max="100" step="5" value={config.Players.GraceRadiusM} onChange={e => updateSectionConfig('Players', 'GraceRadiusM', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name Font Scale <span className="val-label">{config.Players.Style.FontScale}</span></label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={config.Players.Style.FontScale} onChange={e => updateStyleConfig('Players', 'FontScale', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Distance Font Scale <span className="val-label">{config.Players.Style.SmallFontScale}</span></label>
                <input type="range" min="0.5" max="2.0" step="0.1" value={config.Players.Style.SmallFontScale} onChange={e => updateStyleConfig('Players', 'SmallFontScale', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height Offset <span className="val-label">{config.Players.Style.TextOffsetZ}cm</span></label>
                <input type="range" min="0" max="300" step="10" value={config.Players.Style.TextOffsetZ} onChange={e => updateStyleConfig('Players', 'TextOffsetZ', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Box Padding X <span className="val-label">{config.Players.Style.BoxPadX}px</span></label>
                <input type="range" min="2" max="30" step="1" value={config.Players.Style.BoxPadX} onChange={e => updateStyleConfig('Players', 'BoxPadX', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Box Padding Y <span className="val-label">{config.Players.Style.BoxPadY}px</span></label>
                <input type="range" min="2" max="20" step="1" value={config.Players.Style.BoxPadY} onChange={e => updateStyleConfig('Players', 'BoxPadY', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nameplate BG</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.Style.BoxColor)} onChange={e => updateStyleConfig('Players', 'BoxColor', hexToRgbaObject(e.target.value, config.Players.Style.BoxColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.Style.BoxColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Nameplate Border</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.Style.BorderColor)} onChange={e => updateStyleConfig('Players', 'BorderColor', hexToRgbaObject(e.target.value, config.Players.Style.BorderColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.Style.BorderColor)} readOnly />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.Style.NameColor)} onChange={e => updateStyleConfig('Players', 'NameColor', hexToRgbaObject(e.target.value, config.Players.Style.NameColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.Style.NameColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Distance Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.Style.DistColor)} onChange={e => updateStyleConfig('Players', 'DistColor', hexToRgbaObject(e.target.value, config.Players.Style.DistColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.Style.DistColor)} readOnly />
                </div>
              </div>
            </div>
          </>
        );
      case 'Relics':
      case 'Chests':
      case 'Caves':
      case 'Eggs':
        return (
          <>
            <div className="form-row">
              {activeTab === 'Eggs' ? (
                <div className="form-group">
                  <label>Egg Filter</label>
                  <select value={config.Eggs.Filter} onChange={e => updateSectionConfig('Eggs', 'Filter', e.target.value)}>
                    <option value="All">Show All</option>
                    <option value="Large+">Large+ Only</option>
                    <option value="HugeOnly">Huge Only</option>
                    <option value="None">None</option>
                  </select>
                </div>
              ) : (
                <div className="form-group checkbox-group" onClick={() => updateSectionConfig(activeTab, 'Enabled', !config[activeTab].Enabled)}>
                  <input type="checkbox" checked={config[activeTab].Enabled} readOnly />
                  <span className="checkbox-text">Show {activeTab}</span>
                </div>
              )}
              <div className="form-group checkbox-group" onClick={() => updateStyleConfig(activeTab, 'DrawBox', !config[activeTab].Style.DrawBox)}>
                <input type="checkbox" checked={config[activeTab].Style.DrawBox} readOnly />
                <span className="checkbox-text">Draw Background Box</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Range <span className="val-label">{config[activeTab].MaxDistance / 100}m</span></label>
                <input type="range" min="5000" max="50000" step="1000" value={config[activeTab].MaxDistance} onChange={e => updateSectionConfig(activeTab, 'MaxDistance', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Height Offset <span className="val-label">{config[activeTab].Style.TextOffsetZ}cm</span></label>
                <input type="range" min="0" max="300" step="10" value={config[activeTab].Style.TextOffsetZ} onChange={e => updateStyleConfig(activeTab, 'TextOffsetZ', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name Font Scale <span className="val-label">{config[activeTab].Style.FontScale}</span></label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={config[activeTab].Style.FontScale} onChange={e => updateStyleConfig(activeTab, 'FontScale', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Distance Font Scale <span className="val-label">{config[activeTab].Style.SmallFontScale}</span></label>
                <input type="range" min="0.5" max="2.0" step="0.1" value={config[activeTab].Style.SmallFontScale} onChange={e => updateStyleConfig(activeTab, 'SmallFontScale', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Box Padding X <span className="val-label">{config[activeTab].Style.BoxPadX}px</span></label>
                <input type="range" min="2" max="30" step="1" value={config[activeTab].Style.BoxPadX} onChange={e => updateStyleConfig(activeTab, 'BoxPadX', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Box Padding Y <span className="val-label">{config[activeTab].Style.BoxPadY}px</span></label>
                <input type="range" min="2" max="20" step="1" value={config[activeTab].Style.BoxPadY} onChange={e => updateStyleConfig(activeTab, 'BoxPadY', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nameplate BG</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config[activeTab].Style.BoxColor)} onChange={e => updateStyleConfig(activeTab, 'BoxColor', hexToRgbaObject(e.target.value, config[activeTab].Style.BoxColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config[activeTab].Style.BoxColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Nameplate Border</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config[activeTab].Style.BorderColor)} onChange={e => updateStyleConfig(activeTab, 'BorderColor', hexToRgbaObject(e.target.value, config[activeTab].Style.BorderColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config[activeTab].Style.BorderColor)} readOnly />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config[activeTab].Style.NameColor)} onChange={e => updateStyleConfig(activeTab, 'NameColor', hexToRgbaObject(e.target.value, config[activeTab].Style.NameColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config[activeTab].Style.NameColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Distance Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config[activeTab].Style.DistColor)} onChange={e => updateStyleConfig(activeTab, 'DistColor', hexToRgbaObject(e.target.value, config[activeTab].Style.DistColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config[activeTab].Style.DistColor)} readOnly />
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTextColor = (rgbaObj) => `rgba(${Math.round(rgbaObj.R*255)}, ${Math.round(rgbaObj.G*255)}, ${Math.round(rgbaObj.B*255)}, ${rgbaObj.A})`;

  return (
    <>
      <div className="panel">
        <div className="panel-title">⚙️ HUD Locator Settings</div>
        
        <div className={`drop-zone ${isDragging ? 'dragover' : ''}`} onClick={() => document.getElementById('hud-file-input').click()} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
          <input type="file" id="hud-file-input" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          <div className="drop-zone-text">
            Drag & drop your <strong>config.json</strong> here or <strong>Click to Browse</strong>
          </div>
        </div>

        <div className="tabs">
          {['Global', 'Players', 'Relics', 'Chests', 'Eggs', 'Caves'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>

      <div className="preview-container">
        <div className="panel">
          <div className="panel-title">🖥️ HUD Live Preview</div>
          <div className="hud-preview">
            {config.Global.Enabled && config.Players.Enabled && (
              <div className="hud-label">
                <div className={config.Players.Style.DrawBox ? "nameplate-box" : "nameplate-box item-label"} style={getPreviewStyle('Players')}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Players.Style.NameColor), fontSize: `${config.Players.Style.FontScale}em` }}>@ PalFriend</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Players.Style.DistColor), fontSize: `${config.Players.Style.SmallFontScale}em` }}>156m</span>
                </div>
              </div>
            )}

            {config.Global.Enabled && config.Relics.Enabled && (
              <div className="hud-label" style={{ top: 40, left: 50 }}>
                <div className={config.Relics.Style.DrawBox ? "nameplate-box" : "nameplate-box item-label"} style={getPreviewStyle('Relics')}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Relics.Style.NameColor), fontSize: `${config.Relics.Style.FontScale}em` }}>Relic</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Relics.Style.DistColor), fontSize: `${config.Relics.Style.SmallFontScale}em` }}>45m</span>
                </div>
              </div>
            )}

            {config.Global.Enabled && config.Chests.Enabled && (
              <div className="hud-label" style={{ bottom: 40, right: 50 }}>
                <div className={config.Chests.Style.DrawBox ? "nameplate-box" : "nameplate-box item-label"} style={getPreviewStyle('Chests')}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Chests.Style.NameColor), fontSize: `${config.Chests.Style.FontScale}em` }}>Chest</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Chests.Style.DistColor), fontSize: `${config.Chests.Style.SmallFontScale}em` }}>12m</span>
                </div>
              </div>
            )}

            {config.Global.Enabled && config.Eggs.Filter !== "None" && (
              <div className="hud-label" style={{ top: 60, right: 60 }}>
                <div className={config.Eggs.Style.DrawBox ? "nameplate-box" : "nameplate-box item-label"} style={getPreviewStyle('Eggs')}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Eggs.Style.NameColor), fontSize: `${config.Eggs.Style.FontScale}em` }}>Egg</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Eggs.Style.DistColor), fontSize: `${config.Eggs.Style.SmallFontScale}em` }}>8m</span>
                </div>
              </div>
            )}

            {config.Global.Enabled && config.Caves.Enabled && (
              <div className="hud-label" style={{ top: 100, left: 80 }}>
                <div className={config.Caves.Style.DrawBox ? "nameplate-box" : "nameplate-box item-label"} style={getPreviewStyle('Caves')}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Caves.Style.NameColor), fontSize: `${config.Caves.Style.FontScale}em` }}>Cave</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Caves.Style.DistColor), fontSize: `${config.Caves.Style.SmallFontScale}em` }}>110m</span>
                </div>
              </div>
            )}
          </div>
          <div className="preview-legend">Simulated overlay on standard 1080p screen space</div>
        </div>

        <div className="panel actions">
          <button className="btn btn-primary" onClick={exportConfig}>
            💾 Export config.json
          </button>
        </div>
      </div>
    </>
  );
}
