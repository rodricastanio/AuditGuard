// Safe: use parameterized query
import { query } from './db';

function getUser(userId: string): unknown {
  return query('SELECT * FROM users WHERE id = $1', [userId]);
}

export { getUser };
