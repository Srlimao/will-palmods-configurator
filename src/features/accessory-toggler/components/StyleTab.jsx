import { hexToRgbaObject, rgbaObjectToHex } from '../../../components/shared/utils/colorUtils';
import styles from '../styles/accessory.module.css';

export default function StyleTab({ config, updateConfig, schemaProperties }) {
  return (
    <>
      <div className={styles.formRow}>
        {schemaProperties.HUDScale && (
          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <label>HUD Scale <span className="val-label">{config.HUDScale}</span></label>
            <input 
              type="range" 
              min={schemaProperties.HUDScale.min} 
              max={schemaProperties.HUDScale.max} 
              step={schemaProperties.HUDScale.step} 
              value={config.HUDScale} 
              onChange={e => updateConfig('HUDScale', parseFloat(e.target.value))} 
            />
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className={styles.sectionTitle}>🎨 Colors</div>
      <div className={styles.formRow} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        {Object.entries(schemaProperties)
          .filter(([_, prop]) => prop.type === 'color')
          .map(([key]) => (
            <div key={key} className={styles.formGroup} style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className={styles.colorPickerWrapper}>
                <input 
                  type="color" 
                  value={rgbaObjectToHex(config[key])} 
                  onChange={e => updateConfig(key, hexToRgbaObject(e.target.value, config[key].A))} 
                />
                <input type="text" value={rgbaObjectToHex(config[key])} readOnly />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
