import { useState, useEffect, useRef } from 'react';
import styles from '../styles/accessory.module.css';

export default function AccessoryPreview({ config, updateConfig }) {
  const screenRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(480);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, hudX: 0, hudY: 0 });

  // Mock accessory slots state for interactive preview toggling
  const [slotActiveStates, setSlotActiveStates] = useState([true, true, true, false]);

  useEffect(() => {
    if (!screenRef.current) return;
    const updateSize = () => {
      const rect = screenRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setContainerWidth(rect.width);
      }
    };
    updateSize();
    
    // Resize observer is more reliable than window event
    const observer = new ResizeObserver(updateSize);
    observer.observe(screenRef.current);
    
    return () => observer.disconnect();
  }, []);

  const scaleFactor = containerWidth / 1920;
  const isAutoPos = config.HUDX === null || config.HUDY === null;

  // Actual HUD size at 1.0 scale is 260px wide by 56px high
  const hudScale = config.HUDScale || 1.5;
  const baseSlotSize = 56;
  const baseGap = 12;
  const baseWidth = (4 * baseSlotSize) + (3 * baseGap); // 260px
  const baseHeight = baseSlotSize; // 56px

  const hudWidth = baseWidth * hudScale;
  const hudHeight = baseHeight * hudScale;

  // Use config percentages, default to auto position if null
  // Auto positions: Centered (50%) and near bottom (85%)
  const hudPctX = config.HUDX !== null ? config.HUDX : 50.0;
  const hudPctY = config.HUDY !== null ? config.HUDY : 85.0;

  const mockMaxX = 1920 - hudWidth;
  const mockMaxY = 1080 - hudHeight;

  const mockX = (hudPctX / 100) * mockMaxX;
  const mockY = (hudPctY / 100) * mockMaxY;

  // Handle Drag Start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    // If starting drag from auto position, manifest it into manual coordinates
    const initialX = config.HUDX !== null ? config.HUDX : 50.0;
    const initialY = config.HUDY !== null ? config.HUDY : 85.0;

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      hudX: initialX,
      hudY: initialY
    };

    if (isAutoPos) {
      updateConfig('HUDX', initialX);
      updateConfig('HUDY', initialY);
    }

    document.body.style.cursor = 'grabbing';
  };

  // Handle Dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = (e.clientX - dragStart.current.mouseX) / scaleFactor;
      const dy = (e.clientY - dragStart.current.mouseY) / scaleFactor;

      // Start mock position in 1920x1080 space
      const startMockX = (dragStart.current.hudX / 100) * mockMaxX;
      const startMockY = (dragStart.current.hudY / 100) * mockMaxY;

      let newMockX = startMockX + dx;
      let newMockY = startMockY + dy;

      // Clamp position within 1920x1080 bounds
      newMockX = Math.max(0, Math.min(mockMaxX, newMockX));
      newMockY = Math.max(0, Math.min(mockMaxY, newMockY));

      const finalPctX = mockMaxX > 0 ? (newMockX / mockMaxX) * 100 : 0;
      const finalPctY = mockMaxY > 0 ? (newMockY / mockMaxY) * 100 : 0;

      updateConfig('HUDX', parseFloat(finalPctX.toFixed(1)));
      updateConfig('HUDY', parseFloat(finalPctY.toFixed(1)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, scaleFactor, mockMaxX, mockMaxY, updateConfig]);

  const handleResetToAuto = () => {
    updateConfig('HUDX', null);
    updateConfig('HUDY', null);
  };

  const toggleSlotActive = (idx) => {
    setSlotActiveStates(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Color parsers matching index.css utilities
  const getRGBA = (colorObj, alphaOverride = null) => {
    if (!colorObj) return 'rgba(255, 255, 255, 1)';
    const r = Math.round(colorObj.R * 255);
    const g = Math.round(colorObj.G * 255);
    const b = Math.round(colorObj.B * 255);
    const a = alphaOverride !== null ? alphaOverride : colorObj.A;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Styles computed from active config
  const customHUDStyle = {
    position: 'absolute',
    left: `${mockX * scaleFactor}px`,
    top: `${mockY * scaleFactor}px`,
    width: `${hudWidth * scaleFactor}px`,
    height: `${hudHeight * scaleFactor}px`,
    display: 'flex',
    gap: `${baseGap * hudScale * scaleFactor}px`,
    userSelect: 'none',
    zIndex: 10,
    boxShadow: `0 0 ${12 * hudScale * scaleFactor}px ${getRGBA(config.ShadowColor)}`,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const cardBgColor = getRGBA(config.CardBg);
  const textLabelColor = getRGBA(config.TextColorLabel);
  const textEnabledColor = getRGBA(config.TextColorEnabled);
  const textDisabledColor = getRGBA(config.TextColorDisabled);

  // Pre-defined mockup accessory cards data
  const mockAccessories = [
    { num: '5', cat: 'ANEL', name: 'Clemência' },
    { num: '6', cat: 'PINGENTE', name: 'Defesa' },
    { num: '7', cat: 'EQUIPAMENTO', name: 'OTOMO' },
    { num: '8', cat: 'CAMISA', name: 'FRIO+1' }
  ];

  return (
    <div className={styles.simContainer}>
      <div className={styles.panel}>
        <div className={styles.panelTitle} style={{ marginBottom: '0.5rem' }}>
          🖥️ HUD Live Preview
        </div>
        
        <div ref={screenRef} className={styles.simScreen}>
          {/* Screen Background grid overlay */}
          <div className={styles.simGrid} />
          
          {/* Guidelines showing X/Y positioning */}
          {isDragging && (
            <>
              <div 
                className={styles.simGuidelineX} 
                style={{ top: `${(mockY + hudHeight / 2) * scaleFactor}px` }} 
              />
              <div 
                className={styles.simGuidelineY} 
                style={{ left: `${(mockX + hudWidth / 2) * scaleFactor}px` }} 
              />
              <div 
                className={styles.simCoordsOverlay}
                style={{
                  left: `${Math.min(1920 - 150, Math.max(10, mockX + hudWidth + 10)) * scaleFactor}px`,
                  top: `${Math.min(1080 - 60, Math.max(10, mockY + hudHeight + 10)) * scaleFactor}px`
                }}
              >
                X: {hudPctX.toFixed(1)}% | Y: {hudPctY.toFixed(1)}%
              </div>
            </>
          )}

          {/* Simulated HUD Hotbar */}
          <div 
            style={customHUDStyle} 
            onMouseDown={handleMouseDown}
          >
            {mockAccessories.map((acc, idx) => {
              const isActive = slotActiveStates[idx];
              const slotBorderColor = isActive ? textEnabledColor : textDisabledColor;

              return (
                <div 
                  key={idx}
                  className={styles.simSlot}
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid triggering drag
                    toggleSlotActive(idx);
                  }}
                  style={{
                    width: `${baseSlotSize * hudScale * scaleFactor}px`,
                    height: `${baseSlotSize * hudScale * scaleFactor}px`,
                    backgroundColor: cardBgColor,
                    borderColor: slotBorderColor,
                    borderWidth: `${1.5 * scaleFactor}px`,
                    borderStyle: 'solid',
                    borderRadius: `${4 * scaleFactor}px`
                  }}
                  title="Click to toggle active/disabled style preview"
                >
                  {/* Slot Key Label */}
                  <span 
                    className={styles.simSlotKey}
                    style={{ 
                      color: textLabelColor,
                      fontSize: `${10 * hudScale * scaleFactor}px`,
                      left: `${5 * hudScale * scaleFactor}px`,
                      top: `${4 * hudScale * scaleFactor}px`
                    }}
                  >
                    {acc.num} <span style={{ fontSize: '0.8em', opacity: 0.85 }}>{acc.cat}</span>
                  </span>

                  {/* Slot Name */}
                  <span 
                    className={styles.simSlotName}
                    style={{ 
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      fontSize: `${8 * hudScale * scaleFactor}px`,
                      bottom: `${12 * hudScale * scaleFactor}px`
                    }}
                  >
                    {acc.name}
                  </span>

                  {/* Bottom Indicator Bar */}
                  <div 
                    className={styles.simSlotLine}
                    style={{
                      backgroundColor: slotBorderColor,
                      height: `${2 * hudScale * scaleFactor}px`,
                      left: `${5 * hudScale * scaleFactor}px`,
                      right: `${5 * hudScale * scaleFactor}px`,
                      bottom: `${4 * hudScale * scaleFactor}px`,
                      boxShadow: isActive ? `0 0 ${4 * scaleFactor}px ${slotBorderColor}` : 'none'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Automatic HUD Position Indicator */}
          {isAutoPos && (
            <div className={styles.simAutoBanner}>
              🌟 Position: Auto (Centered at bottom)
            </div>
          )}
        </div>

        {/* Legend / Help */}
        <div className={styles.simLegend}>
          <span>💡 Click and drag hotbar inside the screen to position</span>
          <span>• Click slots to toggle active/inactive styles</span>
        </div>

        {/* Precise Numerical Inputs Row */}
        <div className={styles.coordsRow}>
          <div className={styles.coordBox}>
            <span className={styles.coordLabel}>X Position</span>
            <div className={styles.coordInputWrapper}>
              <input 
                type="number" 
                value={config.HUDX !== null ? config.HUDX : 50.0} 
                onChange={e => {
                  const val = e.target.value === '' ? null : Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  updateConfig('HUDX', val);
                }}
                step="0.1"
                min="0"
                max="100"
                disabled={isAutoPos}
                className={styles.coordInput}
              />
              <span className={styles.coordUnit}>%</span>
            </div>
          </div>

          <div className={styles.coordBox}>
            <span className={styles.coordLabel}>Y Position</span>
            <div className={styles.coordInputWrapper}>
              <input 
                type="number" 
                value={config.HUDY !== null ? config.HUDY : 85.0} 
                onChange={e => {
                  const val = e.target.value === '' ? null : Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  updateConfig('HUDY', val);
                }}
                step="0.1"
                min="0"
                max="100"
                disabled={isAutoPos}
                className={styles.coordInput}
              />
              <span className={styles.coordUnit}>%</span>
            </div>
          </div>

          <div className={styles.coordActions}>
            {isAutoPos ? (
              <button 
                onClick={() => {
                  updateConfig('HUDX', 50.0);
                  updateConfig('HUDY', 85.0);
                }}
                className={`${styles.btn} ${styles.btnSecondary}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', margin: 0, width: 'auto' }}
              >
                🔒 Lock Position
              </button>
            ) : (
              <button 
                onClick={handleResetToAuto}
                className={`${styles.btn} ${styles.btnSecondary}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', margin: 0, width: 'auto', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.25)' }}
              >
                🔄 Reset to Auto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
