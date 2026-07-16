import { useState } from 'react';
import HUDLocatorConfig from './components/HUDLocatorConfig';
import AccessoryConfig from './components/AccessoryConfig';

function App() {
  const [activeMod, setActiveMod] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'accessory' || tabParam === 'hudlocator') {
      return tabParam;
    }
    return 'hudlocator';
  });

  return (
    <div className="container">
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
        {activeMod === 'hudlocator' && <HUDLocatorConfig />}
        {activeMod === 'accessory' && <AccessoryConfig />}
      </div>
    </div>
  );
}

export default App;
