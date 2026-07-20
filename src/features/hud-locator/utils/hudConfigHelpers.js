import schemaData from './HUDLocator.schema.json';

const buildDefaultConfig = () => {
  const config = {};
  const sections = schemaData.schema;
  for (const [sectionName, section] of Object.entries(sections)) {
    config[sectionName] = {};
    for (const [propName, prop] of Object.entries(section.properties)) {
      if (prop.type === 'group') {
        config[sectionName][propName] = {};
        for (const [subPropName, subProp] of Object.entries(prop.properties)) {
          config[sectionName][propName][subPropName] = subProp.default;
        }
      } else {
        if (sectionName === 'Loot' && propName === 'Filters') {
          config[sectionName][propName] = [];
        } else {
          config[sectionName][propName] = prop.default;
        }
      }
    }
  }
  return config;
};

export const DEFAULT_CONFIG = buildDefaultConfig();

export const normalizeSection = (sectionName, inputSection, defaultSection) => {
  if (!inputSection) return defaultSection;
  const section = { ...inputSection };
  const schemaSection = schemaData.schema[sectionName];
  if (!schemaSection) return section;

  for (const [propName, prop] of Object.entries(schemaSection.properties)) {
    if (prop.type === 'group') {
      if (!section[propName]) {
        section[propName] = { ...defaultSection[propName] };
      } else {
        section[propName] = { ...defaultSection[propName], ...section[propName] };
      }

      // Handle legacy migration of style fields to the Style group
      if (propName === 'Style' && prop.properties) {
        Object.keys(prop.properties).forEach(styleKey => {
          if (section[styleKey] !== undefined) {
            section.Style[styleKey] = section[styleKey];
            delete section[styleKey];
          }
        });

        // Handle legacy Color migrating to NameColor and DistColor inside Style
        if (section.Color !== undefined) {
          if (section.Style.NameColor === undefined) {
            section.Style.NameColor = section.Color;
          }
          if (section.Style.DistColor === undefined) {
            section.Style.DistColor = section.Color;
          }
          delete section.Color;
        }
      }
    } else {
      if (section[propName] === undefined) {
        section[propName] = defaultSection[propName];
      }
    }
  }

  if (sectionName === 'Loot' && section.Filters && !Array.isArray(section.Filters)) {
    section.Filters = [];
  }

  return section;
};

export const normalizeConfig = (json) => {
  if (!json) return DEFAULT_CONFIG;
  const normalized = {};
  Object.keys(schemaData.schema).forEach(sectionName => {
    normalized[sectionName] = normalizeSection(sectionName, json[sectionName], DEFAULT_CONFIG[sectionName]);
  });
  return normalized;
};

