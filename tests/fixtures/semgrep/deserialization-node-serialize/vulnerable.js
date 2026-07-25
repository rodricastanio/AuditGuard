// Vulnerable: insecure deserialization with node-serialize
import serialize from 'node-serialize';

function deserializeUser(data: string): unknown {
  return serialize.unserialize(data);
}

export { deserializeUser };
