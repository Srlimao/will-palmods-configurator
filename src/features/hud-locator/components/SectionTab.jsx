import { rgbaObjectToHex, hexToRgbaObject } from '../../../components/shared/utils/colorUtils';
import styles from '../styles/hud.module.css';

export default function SectionTab({ activeTab, config, updateSectionConfig, updateStyleConfig }) {
  const sectionData = config[activeTab];
  if (!sectionData) return null;

  return (
    <>
      <div className={styles.formRow}>
        {activeTab === 'Players' && (
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateSectionConfig('Players', 'Enabled', !sectionData.Enabled)}>
            <input type="checkbox" checked={sectionData.Enabled} readOnly />
            <span className={styles.checkboxText}>Track Players</span>
          </div>
        )}
        
        {activeTab === 'Eggs' && (
          <div className={styles.formGroup}>
            <label>Egg Filter</label>
            <select value={sectionData.Filter} onChange={e => updateSectionConfig('Eggs', 'Filter', e.target.value)}>
              <option value="All">Show All</option>
              <option value="Large+">Large+ Only</option>
              <option value="HugeOnly">Huge Only</option>
              <option value="None">None</option>
            </select>
          </div>
        )}

        {activeTab !== 'Players' && activeTab !== 'Eggs' && (
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateSectionConfig(activeTab, 'Enabled', !sectionData.Enabled)}>
            <input type="checkbox" checked={sectionData.Enabled} readOnly />
            <span className={styles.checkboxText}>
              {activeTab === 'Loot' ? 'Show Ground Loot' : `Show ${activeTab}`}
            </span>
          </div>
        )}

        <div className={`${styles.formGroup} ${styles.checkboxGroup}`} onClick={() => updateStyleConfig(activeTab, 'DrawBox', !sectionData.Style.DrawBox)}>
          <input type="checkbox" checked={sectionData.Style.DrawBox} readOnly />
          <span className={styles.checkboxText}>Draw Background Box</span>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Max Range <span className="val-label">{sectionData.MaxDistance / 100}m</span></label>
          <input type="range" min="5000" max="50000" step="1000" value={sectionData.MaxDistance} onChange={e => updateSectionConfig(activeTab, 'MaxDistance', parseFloat(e.target.value))} />
        </div>
        
        {activeTab === 'Players' ? (
          <div className={styles.formGroup}>
            <label>Grace Radius <span className="val-label">{sectionData.GraceRadiusM}m</span></label>
            <input type="range" min="0" max="100" step="5" value={sectionData.GraceRadiusM} onChange={e => updateSectionConfig('Players', 'GraceRadiusM', parseFloat(e.target.value))} />
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label>Height Offset <span className="val-label">{sectionData.Style.TextOffsetZ}cm</span></label>
            <input type="range" min="0" max="300" step="10" value={sectionData.Style.TextOffsetZ} onChange={e => updateStyleConfig(activeTab, 'TextOffsetZ', parseFloat(e.target.value))} />
          </div>
        )}
      </div>

      {activeTab === 'Players' && (
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Height Offset <span className="val-label">{sectionData.Style.TextOffsetZ}cm</span></label>
            <input type="range" min="0" max="300" step="10" value={sectionData.Style.TextOffsetZ} onChange={e => updateStyleConfig('Players', 'TextOffsetZ', parseFloat(e.target.value))} />
          </div>
        </div>
      )}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Name Font Scale <span className="val-label">{sectionData.Style.FontScale}</span></label>
          <input type="range" min="0.5" max="2.5" step="0.1" value={sectionData.Style.FontScale} onChange={e => updateStyleConfig(activeTab, 'FontScale', parseFloat(e.target.value))} />
        </div>
        <div className={styles.formGroup}>
          <label>Distance Font Scale <span className="val-label">{sectionData.Style.SmallFontScale}</span></label>
          <input type="range" min="0.5" max="2.0" step="0.1" value={sectionData.Style.SmallFontScale} onChange={e => updateStyleConfig(activeTab, 'SmallFontScale', parseFloat(e.target.value))} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Box Padding X <span className="val-label">{sectionData.Style.BoxPadX}px</span></label>
          <input type="range" min="2" max="30" step="1" value={sectionData.Style.BoxPadX} onChange={e => updateStyleConfig(activeTab, 'BoxPadX', parseFloat(e.target.value))} />
        </div>
        <div className={styles.formGroup}>
          <label>Box Padding Y <span className="val-label">{sectionData.Style.BoxPadY}px</span></label>
          <input type="range" min="2" max="20" step="1" value={sectionData.Style.BoxPadY} onChange={e => updateStyleConfig(activeTab, 'BoxPadY', parseFloat(e.target.value))} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Nameplate BG</label>
          <div className={styles.colorPickerWrapper}>
            <input type="color" value={rgbaObjectToHex(sectionData.Style.BoxColor)} onChange={e => updateStyleConfig(activeTab, 'BoxColor', hexToRgbaObject(e.target.value, sectionData.Style.BoxColor.A))} />
            <input type="text" value={rgbaObjectToHex(sectionData.Style.BoxColor)} readOnly />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Nameplate Border</label>
          <div className={styles.colorPickerWrapper}>
            <input type="color" value={rgbaObjectToHex(sectionData.Style.BorderColor)} onChange={e => updateStyleConfig(activeTab, 'BorderColor', hexToRgbaObject(e.target.value, sectionData.Style.BorderColor.A))} />
            <input type="text" value={rgbaObjectToHex(sectionData.Style.BorderColor)} readOnly />
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Name Text Color</label>
          <div className={styles.colorPickerWrapper}>
            <input type="color" value={rgbaObjectToHex(sectionData.Style.NameColor)} onChange={e => updateStyleConfig(activeTab, 'NameColor', hexToRgbaObject(e.target.value, sectionData.Style.NameColor.A))} />
            <input type="text" value={rgbaObjectToHex(sectionData.Style.NameColor)} readOnly />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Distance Text Color</label>
          <div className={styles.colorPickerWrapper}>
            <input type="color" value={rgbaObjectToHex(sectionData.Style.DistColor)} onChange={e => updateStyleConfig(activeTab, 'DistColor', hexToRgbaObject(e.target.value, sectionData.Style.DistColor.A))} />
            <input type="text" value={rgbaObjectToHex(sectionData.Style.DistColor)} readOnly />
          </div>
        </div>
      </div>

      {activeTab === 'Loot' && (
        <div className={styles.formRowFull}>
          <div className={styles.formGroup}>
            <label>Item Name / ID Filters</label>
            <div className={styles.filterInfoBox}>
              💡 <strong>How filters work:</strong>
              <ul>
                <li>Matches either the item name in your language or its internal English code name.</li>
                <li>Matches are partial (e.g. <code>Pald</code> matches <code>Paldium Fragment</code>) and not case-sensitive.</li>
                <li><strong>Examples:</strong> <code>Sphere</code>, <code>Lotus</code></li>
              </ul>
            </div>
            <div className={styles.filterListContainer}>
              <div className={styles.tagInputWrapper}>
                <input 
                  type="text" 
                  placeholder="Type a filter and press Enter (e.g., Sphere)" 
                  className={styles.tagInput}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !(sectionData.Filters || []).includes(val)) {
                        updateSectionConfig('Loot', 'Filters', [...(sectionData.Filters || []), val]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button 
                  type="button" 
                  className={styles.addTagBtn}
                  onClick={e => {
                    const input = e.target.previousSibling;
                    const val = input.value.trim();
                    if (val && !(sectionData.Filters || []).includes(val)) {
                      updateSectionConfig('Loot', 'Filters', [...(sectionData.Filters || []), val]);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </button>
              </div>
              <div className={styles.tagsContainer}>
                {sectionData.Filters && sectionData.Filters.length > 0 ? (
                  sectionData.Filters.map((filter, index) => (
                    <span key={index} className={styles.tagBadge}>
                      {filter}
                      <button 
                        type="button" 
                        className={styles.removeTagBtn}
                        onClick={() => {
                          updateSectionConfig('Loot', 'Filters', sectionData.Filters.filter((_, i) => i !== index));
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className={styles.noTagsHint}>Showing all ground loot (no filters applied)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
