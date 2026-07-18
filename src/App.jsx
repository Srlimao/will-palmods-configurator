import { useState, useEffect } from 'react';
import HUDLocatorConfig from './features/hud-locator/HUDLocatorConfig';
import AccessoryConfig from './features/accessory-toggler/AccessoryConfig';

// Parse query parameters once at module load
const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  const modParam = params.get('mod');
  const configParam = params.get('config');

  let parsedConfig = null;
  let parseError = null;

  if (configParam) {
    try {
      parsedConfig = JSON.parse(configParam);
    } catch (e) {
      console.error("Failed to parse config from URL:", e);
      parseError = "Failed to load config from URL parameter. Invalid JSON structure.";
    }
  }

  // Determine if config belongs to HUD Locator or Accessory Toggler
  let isHud = false;
  if (parsedConfig) {
    isHud = parsedConfig.Global !== undefined || 
            parsedConfig.Players !== undefined || 
            parsedConfig.Relics !== undefined || 
            parsedConfig.Chests !== undefined || 
            parsedConfig.Eggs !== undefined || 
            parsedConfig.Caves !== undefined;
  }

  // Determine active mod tab based on tab/mod parameters, or infer from config fields if absent
  let initialTab = 'hudlocator';
  const rawTab = tabParam || modParam;
  if (rawTab) {
    const normalizedTab = rawTab.toLowerCase().replace(/[^a-z]/g, '');
    if (normalizedTab === 'accessory' || normalizedTab === 'accessorytoggler') {
      initialTab = 'accessory';
    } else if (normalizedTab === 'hudlocator' || normalizedTab === 'hud') {
      initialTab = 'hudlocator';
    }
  } else if (parsedConfig) {
    if (!isHud) {
      initialTab = 'accessory';
    }
  }

  const hudConfig = isHud ? parsedConfig : null;
  const accConfig = (parsedConfig && !isHud) ? parsedConfig : null;

  return { initialTab, hudConfig, accConfig, parseError };
};

const { initialTab, hudConfig, accConfig, parseError } = parseUrlParams();

function App() {
  const [activeMod, setActiveMod] = useState(initialTab);
  const [notification, setNotification] = useState(() => {
    if (parseError) {
      return { type: 'error', message: parseError };
    }
    if (hudConfig || accConfig) {
      return { type: 'success', message: 'Configuration settings loaded from game!' };
    }
    return null;
  });

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container">
      {notification && (
        <div className="toast-container">
          <div className={`toast toast-${notification.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {notification.type === 'success' ? '✨' : '⚠️'}
              </span>
              <span>{notification.message}</span>
            </div>
            <button className="toast-close" onClick={() => setNotification(null)}>
              &times;
            </button>
          </div>
        </div>
      )}

      <header>
        <h1>Mod Configuration Center</h1>
        <p>Configure Palworld Mods: HUD Locator and Accessory Toggler</p>
      </header>

      <div className="tabs" style={{ justifyContent: 'center', marginBottom: '2.5rem' }}>
        <button 
          className={`tab-btn ${activeMod === 'hudlocator' ? 'active' : ''}`}
          onClick={() => setActiveMod('hudlocator')}
        >
          HUD Locator
        </button>
        <button 
          className={`tab-btn ${activeMod === 'accessory' ? 'active' : ''}`}
          onClick={() => setActiveMod('accessory')}
        >
          Accessory Toggler
        </button>
      </div>

      <div className="layout">
        {activeMod === 'hudlocator' && <HUDLocatorConfig initialConfig={hudConfig} />}
        {activeMod === 'accessory' && <AccessoryConfig initialConfig={accConfig} />}
      </div>
    </div>
  );
}

export default App;

