/**
 * Sneakr.lab - API routes for designs (SQLite)
 */

import { randomUUID } from 'crypto';
import db from '../db.js';

export async function listDesigns(req, res) {
  try {
    let result;
    if (req.user.role === 'admin') {
      const stmt = db.prepare(
        'SELECT id, design, created_at, user_id FROM designs ORDER BY created_at DESC LIMIT 100'
      );
      result = stmt.all();
    } else {
      const stmt = db.prepare(
        'SELECT id, design, created_at FROM designs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100'
      );
      result = stmt.all(req.user.id);
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list designs' });
  }
}

export async function getDesign(req, res) {
  try {
    const { id } = req.params;
    let result;
    if (req.user.role === 'admin') {
      const stmt = db.prepare('SELECT id, design, created_at, user_id FROM designs WHERE id = ?');
      result = stmt.get(id);
    } else {
      const stmt = db.prepare('SELECT id, design, created_at FROM designs WHERE id = ? AND user_id = ?');
      result = stmt.get(id, req.user.id);
    }
    
    if (!result) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get design' });
  }
}

export async function saveDesign(req, res) {
  try {
    const { design } = req.body;
    if (!design || typeof design !== 'object') {
      return res.status(400).json({ error: 'Invalid design payload' });
    }
    const designId = randomUUID();
    const stmt = db.prepare(
      'INSERT INTO designs (id, design, user_id) VALUES (?, ?, ?)'
    );
    stmt.run(designId, JSON.stringify(design), req.user.id);
    
    res.status(201).json({ id: designId, design, created_at: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save design' });
  }
}

export async function deleteDesign(req, res) {
  try {
    const { id } = req.params;
    let stmt;
    if (req.user.role === 'admin') {
      stmt = db.prepare('DELETE FROM designs WHERE id = ?');
    } else {
      stmt = db.prepare('DELETE FROM designs WHERE id = ? AND user_id = ?');
    }

    const info = req.user.role === 'admin' ? stmt.run(id) : stmt.run(id, req.user.id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete design' });
  }
}
