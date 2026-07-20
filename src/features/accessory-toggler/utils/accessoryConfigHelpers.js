import schemaData from '../AccessoryToggler.schema.json';

const buildDefaultConfig = () => {
  const config = {};
  const schemaProperties = schemaData.schema;
  for (const [propName, prop] of Object.entries(schemaProperties)) {
    if (prop.type === 'section') {
      config[propName] = {};
      for (const [subPropName, subProp] of Object.entries(prop.properties)) {
        config[propName][subPropName] = subProp.default;
      }
    } else {
      config[propName] = prop.default;
    }
  }
  return config;
};

export const DEFAULT_CONFIG = buildDefaultConfig();

export const normalizeConfig = (json) => {
  if (!json) return DEFAULT_CONFIG;
  const normalized = {};
  const schemaProperties = schemaData.schema;
  for (const [propName, prop] of Object.entries(schemaProperties)) {
    if (prop.type === 'section') {
      normalized[propName] = {};
      const inputSection = json[propName] || {};
      for (const [subPropName, subProp] of Object.entries(prop.properties)) {
        normalized[propName][subPropName] = inputSection[subPropName] !== undefined
          ? inputSection[subPropName]
          : subProp.default;
      }
    } else {
      normalized[propName] = json[propName] !== undefined
        ? json[propName]
        : prop.default;
    }
  }
  return normalized;
};
