/**
 * Sneakr.lab - Express API server (PostgreSQL)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as designs from './routes/designs.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/designs', designs.listDesigns);
app.get('/api/designs/:id', designs.getDesign);
app.post('/api/designs', designs.saveDesign);
app.delete('/api/designs/:id', designs.deleteDesign);

app.listen(PORT, () => {
  console.log(`Sneakr.lab API running on http://localhost:${PORT}`);
});
