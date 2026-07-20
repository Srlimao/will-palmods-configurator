import { downloadJson } from '../utils/configParsers';

export default function DownloadCard({ config, copied, handleCopyPath, modName, path, styles }) {
  const displayPath = path || `%localappdata%\\Pal\\Saved\\Mods\\${modName}`;
  
  return (
    <div className={`${styles.panel} ${styles.actions}`}>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => downloadJson(config, 'config.json')}>
        💾 Download config.json
      </button>
      <div 
        className={styles.pathCopyContainer} 
        onClick={handleCopyPath} 
        title="Click to copy path" 
        style={{ marginTop: '0.75rem', marginBottom: '0.5rem', width: '100%', fontSize: '0.8rem' }}
      >
        <span className={styles.pathText}>
          {displayPath}
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
  );
}
