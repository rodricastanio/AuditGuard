// Safe: validate redirect URL
import express from 'express';

const app = express();
const ALLOWED_REDIRECTS = ['/dashboard', '/profile'];

app.get('/redirect', (req, res) => {
  const next = req.query.next as string;
  if (ALLOWED_REDIRECTS.includes(next)) {
    res.redirect(next);
  } else {
    res.redirect('/dashboard');
  }
});

export default app;
