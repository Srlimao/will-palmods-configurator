import { useState } from 'react';
import { rgbaObjectToHex, hexToRgbaObject } from '../../../components/shared/utils/colorUtils';
import styles from '../styles/hud.module.css';
import schemaData from '../utils/HUDLocator.schema.json';

export default function SectionTab({ activeTab, config, updateSectionConfig, updateStyleConfig }) {
  const [subTab, setSubTab] = useState('General');
  const sectionData = config[activeTab];
  if (!sectionData) return null;

  const tabSchema = schemaData.schema[activeTab];
  const properties = tabSchema?.properties || {};
  const styleProps = properties.Style?.properties || {};

  // Resolve schema-based bounds and defaults
  const distSchema = properties.MaxDistance;
  const minDist = distSchema?.min ?? 1000;
  const maxDist = distSchema?.max ?? 100000;
  const stepDist = distSchema?.step ?? 1000;

  const graceSchema = properties.GraceRadiusM;
  const minGrace = graceSchema?.min ?? 0;
  const maxGrace = graceSchema?.max ?? 100;
  const stepGrace = graceSchema?.step ?? 5;

  const fontScaleSchema = styleProps.FontScale;
  const smallFontScaleSchema = styleProps.SmallFontScale;
  const textOffsetSchema = styleProps.TextOffsetZ;
  const boxPadXSchema = styleProps.BoxPadX;
  const boxPadYSchema = styleProps.BoxPadY;

  // Determine if the tracker is currently enabled
  const isTrackerEnabled = activeTab === 'Eggs'
    ? sectionData.Filter !== 'None'
    : !!sectionData.Enabled;

  // 1. Enabling control always at the top so it doesn't move around
  return (
    <>
      <div className={styles.formRow} style={{ marginBottom: '0.85rem' }}>
        {properties.Enabled && (
          <div 
            className={`${styles.formGroup} ${styles.checkboxGroup}`} 
            onClick={() => updateSectionConfig(activeTab, 'Enabled', !sectionData.Enabled)}
            title={properties.Enabled.description}
            style={{ width: '100%', marginBottom: 0 }}
          >
            <input type="checkbox" checked={sectionData.Enabled} readOnly />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={styles.checkboxText}>
                {activeTab === 'Players' ? 'Track Players' : activeTab === 'Loot' ? 'Show Ground Loot' : activeTab === 'Notes' ? 'Show Notes' : `Show ${activeTab}`}
              </span>
              {properties.Enabled.description && (
                <span className={styles.fieldHelpText} style={{ marginTop: '0.15rem', fontSize: '0.75rem' }}>
                  {properties.Enabled.description}
                </span>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'Eggs' && properties.Filter && (
          <div className={styles.formGroup} style={{ width: '100%', marginBottom: 0 }}>
            <label>Egg Filter</label>
            <select value={sectionData.Filter} onChange={e => updateSectionConfig('Eggs', 'Filter', e.target.value)}>
              <option value="All">Show All</option>
              <option value="Large+">Large+ Only</option>
              <option value="HugeOnly">Huge Only</option>
              <option value="None">None (Disabled)</option>
            </select>
            {properties.Filter.description && (
              <div className={styles.fieldHelpText}>{properties.Filter.description}</div>
            )}
          </div>
        )}
      </div>

      {/* 2. Sub-tabs and configuration inputs are rendered only when enabled */}
      {isTrackerEnabled && (
        <>
          {/* Sub-tabs Selector */}
          <div className={styles.subTabs}>
            <button 
              type="button" 
              className={`${styles.subTabBtn} ${subTab === 'General' ? styles.active : ''}`}
              onClick={() => setSubTab('General')}
            >
              General Settings
            </button>
            <button 
              type="button" 
              className={`${styles.subTabBtn} ${subTab === 'Style' ? styles.active : ''}`}
              onClick={() => setSubTab('Style')}
            >
              Style Customization
            </button>
          </div>

          {subTab === 'General' && (
            <>
              {activeTab === 'Chests' && properties.Filter && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label>Chest Filter</label>
                    <select value={sectionData.Filter || 'Both'} onChange={e => updateSectionConfig('Chests', 'Filter', e.target.value)}>
                      <option value="Both">Both (Standard & Junk)</option>
                      <option value="Chests">Chests Only</option>
                      <option value="Junk">Junk Only</option>
                    </select>
                    {properties.Filter.description && (
                      <div className={styles.fieldHelpText}>{properties.Filter.description}</div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ gridColumn: activeTab !== 'Players' ? 'span 2' : 'auto' }}>
                  <label>Max Range <span className="val-label">{sectionData.MaxDistance / 100}m</span></label>
                  <input 
                    type="range" 
                    min={minDist} 
                    max={maxDist} 
                    step={stepDist} 
                    value={sectionData.MaxDistance} 
                    onChange={e => updateSectionConfig(activeTab, 'MaxDistance', parseFloat(e.target.value))} 
                  />
                  {distSchema?.description && (
                    <div className={styles.fieldHelpText}>{distSchema.description}</div>
                  )}
                </div>
                
                {activeTab === 'Players' && graceSchema && (
                  <div className={styles.formGroup}>
                    <label>Grace Radius <span className="val-label">{sectionData.GraceRadiusM}m</span></label>
                    <input 
                      type="range" 
                      min={minGrace} 
                      max={maxGrace} 
                      step={stepGrace} 
                      value={sectionData.GraceRadiusM} 
                      onChange={e => updateSectionConfig('Players', 'GraceRadiusM', parseFloat(e.target.value))} 
                    />
                    {graceSchema.description && (
                      <div className={styles.fieldHelpText}>{graceSchema.description}</div>
                    )}
                  </div>
                )}
              </div>

              {activeTab === 'Loot' && (
                <div className={styles.formRowFull}>
                  <div className={styles.formGroup}>
                    <label>Item Name / ID Filters</label>
                    {properties.Filters?.description && (
                      <div className={styles.fieldHelpText} style={{ marginBottom: '0.5rem' }}>
                        {properties.Filters.description}
                      </div>
                    )}
                    <div className={styles.filterInfoBox}>
                      💡 <strong>How filters work:</strong>
                      <ul>
                        <li>Matches either the item name in your language or its internal English code name.</li>
                        <li>Matches are partial (e.g. <code>Pald</code> matches <code>Paldium Fragment</code>) and not case-sensitive.</li>
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
          )}

          {subTab === 'Style' && (
            <>
              <div className={styles.formRow}>
                {styleProps.DrawBox && (
                  <div 
                    className={`${styles.formGroup} ${styles.checkboxGroup}`} 
                    onClick={() => updateStyleConfig(activeTab, 'DrawBox', !sectionData.Style.DrawBox)}
                    title={styleProps.DrawBox.description}
                    style={{ width: '100%' }}
                  >
                    <input type="checkbox" checked={sectionData.Style.DrawBox} readOnly />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={styles.checkboxText}>Draw Background Box</span>
                      {styleProps.DrawBox.description && (
                        <span className={styles.fieldHelpText} style={{ marginTop: '0.15rem', fontSize: '0.75rem' }}>
                          {styleProps.DrawBox.description}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {styleProps.TextOffsetZ && (
                  <div className={styles.formGroup} style={{ width: '100%' }}>
                    <label>Height Offset <span className="val-label">{sectionData.Style.TextOffsetZ}cm</span></label>
                    <input 
                      type="range" 
                      min={textOffsetSchema?.min ?? 0} 
                      max={textOffsetSchema?.max ?? 300} 
                      step={textOffsetSchema?.step ?? 10} 
                      value={sectionData.Style.TextOffsetZ} 
                      onChange={e => updateStyleConfig(activeTab, 'TextOffsetZ', parseFloat(e.target.value))} 
                    />
                    {styleProps.TextOffsetZ.description && (
                      <div className={styles.fieldHelpText}>{styleProps.TextOffsetZ.description}</div>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name Font Scale <span className="val-label">{sectionData.Style.FontScale}</span></label>
                  <input 
                    type="range" 
                    min={fontScaleSchema?.min ?? 0.5} 
                    max={fontScaleSchema?.max ?? 2.5} 
                    step={fontScaleSchema?.step ?? 0.1} 
                    value={sectionData.Style.FontScale} 
                    onChange={e => updateStyleConfig(activeTab, 'FontScale', parseFloat(e.target.value))} 
                  />
                  {fontScaleSchema?.description && (
                    <div className={styles.fieldHelpText}>{fontScaleSchema.description}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Distance Font Scale <span className="val-label">{sectionData.Style.SmallFontScale}</span></label>
                  <input 
                    type="range" 
                    min={smallFontScaleSchema?.min ?? 0.5} 
                    max={smallFontScaleSchema?.max ?? 2.0} 
                    step={smallFontScaleSchema?.step ?? 0.1} 
                    value={sectionData.Style.SmallFontScale} 
                    onChange={e => updateStyleConfig(activeTab, 'SmallFontScale', parseFloat(e.target.value))} 
                  />
                  {smallFontScaleSchema?.description && (
                    <div className={styles.fieldHelpText}>{smallFontScaleSchema.description}</div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Box Padding X <span className="val-label">{sectionData.Style.BoxPadX}px</span></label>
                  <input 
                    type="range" 
                    min={boxPadXSchema?.min ?? 2} 
                    max={boxPadXSchema?.max ?? 30} 
                    step={boxPadXSchema?.step ?? 1} 
                    value={sectionData.Style.BoxPadX} 
                    onChange={e => updateStyleConfig(activeTab, 'BoxPadX', parseFloat(e.target.value))} 
                  />
                  {boxPadXSchema?.description && (
                    <div className={styles.fieldHelpText}>{boxPadXSchema.description}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Box Padding Y <span className="val-label">{sectionData.Style.BoxPadY}px</span></label>
                  <input 
                    type="range" 
                    min={boxPadYSchema?.min ?? 2} 
                    max={boxPadYSchema?.max ?? 20} 
                    step={boxPadYSchema?.step ?? 1} 
                    value={sectionData.Style.BoxPadY} 
                    onChange={e => updateStyleConfig(activeTab, 'BoxPadY', parseFloat(e.target.value))} 
                  />
                  {boxPadYSchema?.description && (
                    <div className={styles.fieldHelpText}>{boxPadYSchema.description}</div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nameplate BG</label>
                  <div className={styles.colorPickerWrapper}>
                    <input type="color" value={rgbaObjectToHex(sectionData.Style.BoxColor)} onChange={e => updateStyleConfig(activeTab, 'BoxColor', hexToRgbaObject(e.target.value, sectionData.Style.BoxColor.A))} />
                    <input type="text" value={rgbaObjectToHex(sectionData.Style.BoxColor)} readOnly />
                  </div>
                  {styleProps.BoxColor?.description && (
                    <div className={styles.fieldHelpText}>{styleProps.BoxColor.description}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Nameplate Border</label>
                  <div className={styles.colorPickerWrapper}>
                    <input type="color" value={rgbaObjectToHex(sectionData.Style.BorderColor)} onChange={e => updateStyleConfig(activeTab, 'BorderColor', hexToRgbaObject(e.target.value, sectionData.Style.BorderColor.A))} />
                    <input type="text" value={rgbaObjectToHex(sectionData.Style.BorderColor)} readOnly />
                  </div>
                  {styleProps.BorderColor?.description && (
                    <div className={styles.fieldHelpText}>{styleProps.BorderColor.description}</div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name Text Color</label>
                  <div className={styles.colorPickerWrapper}>
                    <input type="color" value={rgbaObjectToHex(sectionData.Style.NameColor)} onChange={e => updateStyleConfig(activeTab, 'NameColor', hexToRgbaObject(e.target.value, sectionData.Style.NameColor.A))} />
                    <input type="text" value={rgbaObjectToHex(sectionData.Style.NameColor)} readOnly />
                  </div>
                  {styleProps.NameColor?.description && (
                    <div className={styles.fieldHelpText}>{styleProps.NameColor.description}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Distance Text Color</label>
                  <div className={styles.colorPickerWrapper}>
                    <input type="color" value={rgbaObjectToHex(sectionData.Style.DistColor)} onChange={e => updateStyleConfig(activeTab, 'DistColor', hexToRgbaObject(e.target.value, sectionData.Style.DistColor.A))} />
                    <input type="text" value={rgbaObjectToHex(sectionData.Style.DistColor)} readOnly />
                  </div>
                  {styleProps.DistColor?.description && (
                    <div className={styles.fieldHelpText}>{styleProps.DistColor.description}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
