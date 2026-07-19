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
  const [changelogs, setChangelogs] = useState(null);
  const [unreadTabs, setUnreadTabs] = useState({ hudlocator: false, accessory: false });
  const [notification, setNotification] = useState(() => {
    if (parseError) {
      return { type: 'error', message: parseError };
    }
    if (hudConfig || accConfig) {
      return { type: 'success', message: 'Configuration settings loaded from game!' };
    }
    return null;
  });

  // Fetch changelogs on mount
  useEffect(() => {
    fetch('/changelog.json')
      .then(res => res.json())
      .then(data => {
        setChangelogs(data);
        
        const readLogs = JSON.parse(localStorage.getItem('mcm_read_changelogs') || '{}');
        const nextUnread = { hudlocator: false, accessory: false };

        if (data.HUDLocator?.entries?.[0]) {
          const latestHudDate = data.HUDLocator.entries[0].date;
          if (readLogs.HUDLocator !== latestHudDate && initialTab !== 'hudlocator') {
            nextUnread.hudlocator = true;
          } else if (initialTab === 'hudlocator') {
            readLogs.HUDLocator = latestHudDate;
          }
        }

        if (data.AccessoryToggler?.entries?.[0]) {
          const latestAccDate = data.AccessoryToggler.entries[0].date;
          if (readLogs.AccessoryToggler !== latestAccDate && initialTab !== 'accessory') {
            nextUnread.accessory = true;
          } else if (initialTab === 'accessory') {
            readLogs.AccessoryToggler = latestAccDate;
          }
        }

        localStorage.setItem('mcm_read_changelogs', JSON.stringify(readLogs));
        setUnreadTabs(nextUnread);
      })
      .catch(err => console.error('Failed to load changelogs:', err));
  }, []);

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleTabChange = (tab) => {
    setActiveMod(tab);
    if (!changelogs) return;

    const readLogs = JSON.parse(localStorage.getItem('mcm_read_changelogs') || '{}');
    let updated = false;

    if (tab === 'hudlocator' && changelogs.HUDLocator?.entries?.[0]) {
      const latestDate = changelogs.HUDLocator.entries[0].date;
      if (readLogs.HUDLocator !== latestDate) {
        readLogs.HUDLocator = latestDate;
        updated = true;
        setUnreadTabs(prev => ({ ...prev, hudlocator: false }));
      }
    } else if (tab === 'accessory' && changelogs.AccessoryToggler?.entries?.[0]) {
      const latestDate = changelogs.AccessoryToggler.entries[0].date;
      if (readLogs.AccessoryToggler !== latestDate) {
        readLogs.AccessoryToggler = latestDate;
        updated = true;
        setUnreadTabs(prev => ({ ...prev, accessory: false }));
      }
    }

    if (updated) {
      localStorage.setItem('mcm_read_changelogs', JSON.stringify(readLogs));
    }
  };

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
          onClick={() => handleTabChange('hudlocator')}
        >
          HUD Locator
          {unreadTabs.hudlocator && <span className="update-badge">NEW</span>}
        </button>
        <button 
          className={`tab-btn ${activeMod === 'accessory' ? 'active' : ''}`}
          onClick={() => handleTabChange('accessory')}
        >
          Accessory Toggler
          {unreadTabs.accessory && <span className="update-badge">NEW</span>}
        </button>
      </div>

      <div className="layout">
        {activeMod === 'hudlocator' && (
          <HUDLocatorConfig 
            initialConfig={hudConfig} 
            changelogData={changelogs?.HUDLocator} 
          />
        )}
        {activeMod === 'accessory' && (
          <AccessoryConfig 
            initialConfig={accConfig} 
            changelogData={changelogs?.AccessoryToggler} 
          />
        )}
      </div>
    </div>
  );
}

export default App;

