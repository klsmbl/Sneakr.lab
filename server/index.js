/**
 * Sneakr.lab - Express API server (PostgreSQL)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as designs from './routes/designs.js';
import * as auth from './routes/auth.js';
import * as payments from './routes/payments.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Auth routes
app.post('/api/auth/signup', auth.signUp);
app.post('/api/auth/signin', auth.signIn);

// Design routes
app.get('/api/designs', auth.authenticate, designs.listDesigns);
app.get('/api/designs/:id', auth.authenticate, designs.getDesign);
app.post('/api/designs', auth.authenticate, designs.saveDesign);
app.delete('/api/designs/:id', auth.authenticate, designs.deleteDesign);

// Payment & Subscription routes
app.get('/api/subscription', auth.authenticate, payments.getSubscription);
app.post('/api/subscription/create-order', auth.authenticate, payments.createSubscriptionOrder);
app.post('/api/subscription/capture-order', auth.authenticate, payments.captureSubscriptionOrder);
app.get('/api/payments/history', auth.authenticate, payments.getPaymentHistory);

app.listen(PORT, () => {
  console.log(`Sneakr.lab API running on http://localhost:${PORT}`);
});
