// Vulnerable: SQL injection via string concatenation
import { query } from './db';

function getUser(userId: string): unknown {
  // noinspection SqlInjectionAnnotator
  return query('SELECT * FROM users WHERE id = ' + userId);
}

export { getUser };
