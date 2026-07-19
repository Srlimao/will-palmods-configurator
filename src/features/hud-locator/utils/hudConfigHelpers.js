export const DEFAULT_CONFIG = {
  Global: {
    Enabled: true,
    Language: "system",
    ScanIntervalMs: 1500,
    Debug: false,
    KeyBinds: {
      ToggleMenu: "F6",
      MenuUp: "UP_ARROW",
      MenuDown: "DOWN_ARROW",
      MenuLeft: "LEFT_ARROW",
      MenuRight: "RIGHT_ARROW"
    }
  },
  Players: {
    Enabled: true,
    MaxDistance: 15000.0,
    GraceRadiusM: 30,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 120.0,
      NameColor: { R: 1.0, G: 1.0, B: 1.0, A: 1.0 },
      DistColor: { R: 1.0, G: 1.0, B: 1.0, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Relics: {
    Enabled: true,
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.1, G: 0.9, B: 0.9, A: 1.0 },
      DistColor: { R: 0.1, G: 0.9, B: 0.9, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Chests: {
    Enabled: true,
    Filter: "Both",
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.9, G: 0.7, B: 0.1, A: 1.0 },
      DistColor: { R: 0.9, G: 0.7, B: 0.1, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Eggs: {
    Filter: "All",
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.8, G: 0.5, B: 0.8, A: 1.0 },
      DistColor: { R: 0.8, G: 0.5, B: 0.8, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Caves: {
    Enabled: true,
    MaxDistance: 15000.0,
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.6, G: 0.2, B: 0.9, A: 1.0 },
      DistColor: { R: 0.6, G: 0.2, B: 0.9, A: 1.0 },
      BoxColor: { R: 0.8, G: 0.8, B: 1.0, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  },
  Loot: {
    Enabled: false,
    MaxDistance: 15000.0,
    Filters: [],
    Style: {
      DrawBox: false,
      FontScale: 1.2,
      SmallFontScale: 0.9,
      TextOffsetZ: 80.0,
      NameColor: { R: 0.2, G: 0.9, B: 0.4, A: 1.0 },
      DistColor: { R: 0.2, G: 0.9, B: 0.4, A: 1.0 },
      BoxColor: { R: 0.8, G: 1.0, B: 0.8, A: 1.0 },
      BorderColor: { R: 0.0, G: 0.0, B: 0.0, A: 1.0 },
      BorderWidth: 1.5,
      BoxPadX: 10.0,
      BoxPadY: 6.0,
      FontCharW: 8.0,
      FontLineH: 12.0
    }
  }
};

export const normalizeSection = (sectionName, inputSection, defaultSection) => {
  if (!inputSection) return defaultSection;
  const section = { ...inputSection };
  if (!section.Style) {
    section.Style = {};
  } else {
    section.Style = { ...section.Style };
  }
  const styleKeys = [
    'DrawBox', 'FontScale', 'SmallFontScale', 'TextOffsetZ',
    'NameColor', 'DistColor', 'BoxColor', 'BorderColor',
    'BorderWidth', 'BoxPadX', 'BoxPadY', 'FontCharW', 'FontLineH'
  ];
  styleKeys.forEach(key => {
    if (section[key] !== undefined) {
      section.Style[key] = section[key];
      delete section[key];
    }
  });
  if (section.Color !== undefined) {
    if (section.Style.NameColor === undefined) {
      section.Style.NameColor = section.Color;
    }
    if (section.Style.DistColor === undefined) {
      section.Style.DistColor = section.Color;
    }
    delete section.Color;
  }
  section.Style = {
    ...defaultSection.Style,
    ...section.Style
  };
  const rootKeys = ['Enabled', 'Filter', 'Filters', 'MaxDistance', 'GraceRadiusM'];
  rootKeys.forEach(key => {
    if (section[key] === undefined && defaultSection[key] !== undefined) {
      section[key] = defaultSection[key];
    }
  });
  if (section.Filters && !Array.isArray(section.Filters)) {
    section.Filters = [];
  }
  return section;
};

export const normalizeConfig = (json) => {
  if (!json) return DEFAULT_CONFIG;
  return {
    Global: {
      ...DEFAULT_CONFIG.Global,
      ...(json.Global || {})
    },
    Players: normalizeSection('Players', json.Players, DEFAULT_CONFIG.Players),
    Relics: normalizeSection('Relics', json.Relics, DEFAULT_CONFIG.Relics),
    Chests: normalizeSection('Chests', json.Chests, DEFAULT_CONFIG.Chests),
    Eggs: normalizeSection('Eggs', json.Eggs, DEFAULT_CONFIG.Eggs),
    Caves: normalizeSection('Caves', json.Caves, DEFAULT_CONFIG.Caves),
    Loot: normalizeSection('Loot', json.Loot, DEFAULT_CONFIG.Loot)
  };
};
