// Safe: use safe YAML loading
import yaml from 'yaml';

function parseConfig(data: string): unknown {
  return yaml.parse(data, { schema: yaml.DEFAULT_SCHEMA });
}

export { parseConfig };
