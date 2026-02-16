/**
 * Sneakr.lab - API routes for designs (PostgreSQL)
 */

import { query } from '../db.js';

export async function listDesigns(req, res) {
  try {
    const { rows } = await query(
      'SELECT id, design, created_at FROM designs ORDER BY created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list designs' });
  }
}

export async function getDesign(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT id, design, created_at FROM designs WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(rows[0]);
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
    const { rows } = await query(
      'INSERT INTO designs (design) VALUES ($1) RETURNING id, design, created_at',
      [JSON.stringify(design)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save design' });
  }
}

export async function deleteDesign(req, res) {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM designs WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete design' });
  }
}
