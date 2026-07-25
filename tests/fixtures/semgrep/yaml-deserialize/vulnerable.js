// Vulnerable: unsafe YAML deserialization
import yaml from 'yaml';

function parseConfig(data: string): unknown {
  return yaml.parse(data);
}

export { parseConfig };
