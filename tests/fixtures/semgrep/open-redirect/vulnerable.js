// Vulnerable: open redirect
import express from 'express';

const app = express();
app.get('/redirect', (req, res) => {
  res.redirect(req.query.next as string);
});

export default app;
