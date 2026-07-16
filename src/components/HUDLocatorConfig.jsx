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
    Enabled: true, MaxDistance: 15000.0, GraceRadiusM: 30, FontScale: 1.2, SmallFontScale: 0.9, TextOffsetZ: 120.0, DrawBox: false,
    NameColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 }, DistColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
    BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 }, BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
    BorderWidth: 1.5, BoxPadX: 10.0, BoxPadY: 6.0, FontCharW: 8.0, FontLineH: 12.0
  },
  Relics: { Enabled: true, MaxDistance: 15000.0, FontScale: 1.2, TextOffsetZ: 80.0, Color: { R: 0.1, G: 0.9, B: 0.9, A: 1.0 } },
  Chests: { Enabled: true, MaxDistance: 15000.0, FontScale: 1.2, TextOffsetZ: 80.0, Color: { R: 0.9, G: 0.7, B: 0.1, A: 1.0 } },
  Eggs: { Filter: "All", MaxDistance: 15000.0, FontScale: 1.2, TextOffsetZ: 80.0, Color: { R: 0.8, G: 0.5, B: 0.8, A: 1.0 } },
  Caves: { Enabled: true, MaxDistance: 15000.0, FontScale: 1.2, TextOffsetZ: 80.0, Color: { R: 0.6, G: 0.2, B: 0.9, A: 1.0 } }
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
      setConfig({ ...DEFAULT_CONFIG, ...json });
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

  const exportConfig = () => {
    downloadJson(config, 'config.json');
  };

  // Live preview helpers
  const getPlayerPreviewStyle = () => {
    if (!config.Players.DrawBox) return { background: 'transparent', border: 'none' };
    const { BoxColor, BorderColor, BorderWidth, BoxPadX, BoxPadY } = config.Players;
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
              <div className="form-group checkbox-group" onClick={() => updateSectionConfig('Players', 'DrawBox', !config.Players.DrawBox)}>
                <input type="checkbox" checked={config.Players.DrawBox} readOnly />
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
                <label>Name Font Scale <span className="val-label">{config.Players.FontScale}</span></label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={config.Players.FontScale} onChange={e => updateSectionConfig('Players', 'FontScale', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Distance Font Scale <span className="val-label">{config.Players.SmallFontScale}</span></label>
                <input type="range" min="0.5" max="2.0" step="0.1" value={config.Players.SmallFontScale} onChange={e => updateSectionConfig('Players', 'SmallFontScale', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height Offset <span className="val-label">{config.Players.TextOffsetZ}cm</span></label>
                <input type="range" min="0" max="300" step="10" value={config.Players.TextOffsetZ} onChange={e => updateSectionConfig('Players', 'TextOffsetZ', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Box Padding X <span className="val-label">{config.Players.BoxPadX}px</span></label>
                <input type="range" min="2" max="30" step="1" value={config.Players.BoxPadX} onChange={e => updateSectionConfig('Players', 'BoxPadX', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Box Padding Y <span className="val-label">{config.Players.BoxPadY}px</span></label>
                <input type="range" min="2" max="20" step="1" value={config.Players.BoxPadY} onChange={e => updateSectionConfig('Players', 'BoxPadY', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nameplate BG</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.BoxColor)} onChange={e => updateSectionConfig('Players', 'BoxColor', hexToRgbaObject(e.target.value, config.Players.BoxColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.BoxColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Nameplate Border</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.BorderColor)} onChange={e => updateSectionConfig('Players', 'BorderColor', hexToRgbaObject(e.target.value, config.Players.BorderColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.BorderColor)} readOnly />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.NameColor)} onChange={e => updateSectionConfig('Players', 'NameColor', hexToRgbaObject(e.target.value, config.Players.NameColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.NameColor)} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Distance Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config.Players.DistColor)} onChange={e => updateSectionConfig('Players', 'DistColor', hexToRgbaObject(e.target.value, config.Players.DistColor.A))} />
                  <input type="text" value={rgbaObjectToHex(config.Players.DistColor)} readOnly />
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
            {activeTab === 'Eggs' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Egg Filter</label>
                  <select value={config.Eggs.Filter} onChange={e => updateSectionConfig('Eggs', 'Filter', e.target.value)}>
                    <option value="All">Show All</option>
                    <option value="Large+">Large+ Only</option>
                    <option value="HugeOnly">Huge Only</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group checkbox-group" onClick={() => updateSectionConfig(activeTab, 'Enabled', !config[activeTab].Enabled)}>
                <input type="checkbox" checked={config[activeTab].Enabled} readOnly />
                <span className="checkbox-text">Show {activeTab}</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Range <span className="val-label">{config[activeTab].MaxDistance / 100}m</span></label>
                <input type="range" min="5000" max="50000" step="1000" value={config[activeTab].MaxDistance} onChange={e => updateSectionConfig(activeTab, 'MaxDistance', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Font Scale <span className="val-label">{config[activeTab].FontScale}</span></label>
                <input type="range" min="0.5" max="2.5" step="0.1" value={config[activeTab].FontScale} onChange={e => updateSectionConfig(activeTab, 'FontScale', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height Offset <span className="val-label">{config[activeTab].TextOffsetZ}cm</span></label>
                <input type="range" min="0" max="300" step="10" value={config[activeTab].TextOffsetZ} onChange={e => updateSectionConfig(activeTab, 'TextOffsetZ', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tag Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={rgbaObjectToHex(config[activeTab].Color)} onChange={e => updateSectionConfig(activeTab, 'Color', hexToRgbaObject(e.target.value, config[activeTab].Color.A))} />
                  <input type="text" value={rgbaObjectToHex(config[activeTab].Color)} readOnly />
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
                <div className="nameplate-box" style={getPlayerPreviewStyle()}>
                  <span className="nameplate-name" style={{ color: getTextColor(config.Players.NameColor), fontSize: `${config.Players.FontScale}em` }}>@ PalFriend</span>
                  <span className="nameplate-dist" style={{ color: getTextColor(config.Players.DistColor), fontSize: `${config.Players.SmallFontScale}em` }}>156m</span>
                </div>
              </div>
            )}

            {config.Global.Enabled && config.Relics.Enabled && (
              <div className="hud-label item-label" style={{ top: 40, left: 50, color: getTextColor(config.Relics.Color), fontSize: `${config.Relics.FontScale}em` }}>
                Relic [45m]
              </div>
            )}

            {config.Global.Enabled && config.Chests.Enabled && (
              <div className="hud-label item-label" style={{ bottom: 40, right: 50, color: getTextColor(config.Chests.Color), fontSize: `${config.Chests.FontScale}em` }}>
                Chest [12m]
              </div>
            )}

            {config.Global.Enabled && config.Eggs.Filter !== "None" && (
              <div className="hud-label item-label" style={{ top: 60, right: 60, color: getTextColor(config.Eggs.Color), fontSize: `${config.Eggs.FontScale}em` }}>
                Egg [8m]
              </div>
            )}

            {config.Global.Enabled && config.Caves.Enabled && (
              <div className="hud-label item-label" style={{ top: 100, left: 80, color: getTextColor(config.Caves.Color), fontSize: `${config.Caves.FontScale}em` }}>
                Cave [110m]
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
