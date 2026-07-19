import styles from '../styles/hud.module.css';

export default function HUDPreview({ config }) {
  const getPreviewStyle = (section) => {
    const secStyle = config[section]?.Style;
    if (!secStyle || !secStyle.DrawBox) return { background: 'transparent', border: 'none' };
    const { BoxColor, BorderColor, BorderWidth, BoxPadX, BoxPadY } = secStyle;
    return {
      backgroundColor: `rgba(${Math.round(BoxColor.R*255)}, ${Math.round(BoxColor.G*255)}, ${Math.round(BoxColor.B*255)}, ${BoxColor.A})`,
      borderColor: `rgba(${Math.round(BorderColor.R*255)}, ${Math.round(BorderColor.G*255)}, ${Math.round(BorderColor.B*255)}, ${BorderColor.A})`,
      borderWidth: `${BorderWidth}px`,
      padding: `${BoxPadY}px ${BoxPadX}px`
    };
  };

  const getTextColor = (rgbaObj) => `rgba(${Math.round(rgbaObj.R*255)}, ${Math.round(rgbaObj.G*255)}, ${Math.round(rgbaObj.B*255)}, ${rgbaObj.A})`;

  return (
    <div className={styles.previewContainer}>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>🖥️ HUD Live Preview</div>
        <div className={styles.hudPreview}>
          {!config.Global.Enabled && (
            <div className={styles.disabledPreviewBanner}>
              ⚠️ HUD Locator is Master Disabled
            </div>
          )}
          {config.Global.Enabled && config.Players.Enabled && (
            <div className={styles.hudLabel}>
              <div 
                className={config.Players.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Players')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Players.Style.NameColor), fontSize: `${config.Players.Style.FontScale}em` }}>👤 @ PalFriend</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Players.Style.DistColor), fontSize: `${config.Players.Style.SmallFontScale}em` }}>
                  {config.Players.Style.DrawBox ? '156m' : '[156m]'}
                </span>
              </div>
            </div>
          )}

          {config.Global.Enabled && config.Relics.Enabled && (
            <div className={styles.hudLabel} style={{ top: 40, left: 50 }}>
              <div 
                className={config.Relics.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Relics')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Relics.Style.NameColor), fontSize: `${config.Relics.Style.FontScale}em` }}>🔥 Relic</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Relics.Style.DistColor), fontSize: `${config.Relics.Style.SmallFontScale}em` }}>
                  {config.Relics.Style.DrawBox ? '45m' : '[45m]'}
                </span>
              </div>
            </div>
          )}

          {config.Global.Enabled && config.Chests.Enabled && (
            <div className={styles.hudLabel} style={{ bottom: 40, right: 50 }}>
              <div 
                className={config.Chests.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Chests')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Chests.Style.NameColor), fontSize: `${config.Chests.Style.FontScale}em` }}>📦 Chest</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Chests.Style.DistColor), fontSize: `${config.Chests.Style.SmallFontScale}em` }}>
                  {config.Chests.Style.DrawBox ? '12m' : '[12m]'}
                </span>
              </div>
            </div>
          )}

          {config.Global.Enabled && config.Eggs.Filter !== "None" && (
            <div className={styles.hudLabel} style={{ top: 60, right: 60 }}>
              <div 
                className={config.Eggs.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Eggs')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Eggs.Style.NameColor), fontSize: `${config.Eggs.Style.FontScale}em` }}>🥚 Egg</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Eggs.Style.DistColor), fontSize: `${config.Eggs.Style.SmallFontScale}em` }}>
                  {config.Eggs.Style.DrawBox ? '8m' : '[8m]'}
                </span>
              </div>
            </div>
          )}

          {config.Global.Enabled && config.Caves.Enabled && (
            <div className={styles.hudLabel} style={{ top: 100, left: 80 }}>
              <div 
                className={config.Caves.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Caves')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Caves.Style.NameColor), fontSize: `${config.Caves.Style.FontScale}em` }}>🪨 Cave</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Caves.Style.DistColor), fontSize: `${config.Caves.Style.SmallFontScale}em` }}>
                  {config.Caves.Style.DrawBox ? '110m' : '[110m]'}
                </span>
              </div>
            </div>
          )}

          {config.Global.Enabled && config.Loot && config.Loot.Enabled && (
            <div className={styles.hudLabel} style={{ bottom: 70, left: 120 }}>
              <div 
                className={config.Loot.Style.DrawBox ? styles.nameplateBox : `${styles.nameplateBox} ${styles.itemLabel}`} 
                style={getPreviewStyle('Loot')}
              >
                <span className={styles.nameplateName} style={{ color: getTextColor(config.Loot.Style.NameColor), fontSize: `${config.Loot.Style.FontScale}em` }}>💎 Mega Sphere</span>
                <span className={styles.nameplateDist} style={{ color: getTextColor(config.Loot.Style.DistColor), fontSize: `${config.Loot.Style.SmallFontScale}em` }}>
                  {config.Loot.Style.DrawBox ? '23m' : '[23m]'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.previewLegend}>Simulated overlay on standard 1080p screen space</div>
      </div>
    </div>
  );
}
