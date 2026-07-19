import styles from './styles/changelog.module.css';

export default function ChangelogView({ changelogData, isOpen, onClose }) {
  if (!isOpen || !changelogData) {
    return null;
  }

  const { version, entries = [] } = changelogData;

  const parseChanges = (changeString) => {
    if (!changeString) return [];
    return changeString
      .split(/<br\s*\/?>/gi)
      .map(c => c.trim().replace(/^-\s*/, '')) // Remove bullet dash if already present
      .filter(Boolean);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCtn} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span>📜 Version History</span>
            <span className={styles.versionBadge}>v{version}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close changelog">
            &times;
          </button>
        </div>
        
        <div className={styles.body}>
          {entries.length === 0 ? (
            <div className={styles.noEntries}>No updates recorded.</div>
          ) : (
            entries.map((entry, index) => (
              <div 
                key={index} 
                className={`${styles.entry} ${index === 0 ? styles.entryFirst : ''}`}
              >
                <div className={styles.dateRow}>
                  <span className={styles.date}>{entry.date}</span>
                  {index === 0 && <span className={styles.latestBadge}>Latest Update</span>}
                </div>
                <ul className={styles.list}>
                  {entry.changes.flatMap(parseChanges).map((change, cIdx) => (
                    <li key={cIdx} className={styles.item}>
                      • {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
