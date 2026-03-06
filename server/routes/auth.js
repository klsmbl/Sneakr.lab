/**
 * Sneakr.lab - Authentication routes (SQLite)
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export async function signUp(req, res) {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();
    
    const stmt = db.prepare(
      'INSERT INTO users (id, email, password_hash, role, subscription) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(userId, email, passwordHash, role, 'free');
    
    const user = { id: userId, email, role, subscription: 'free' };
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'User already exists' });
    }
    console.error('Sign up error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password_hash, ...userData } = user;

    res.json({ user: userData, token });
  } catch (err) {
    console.error('Sign in error:', err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required' });
  }
  next();
}
