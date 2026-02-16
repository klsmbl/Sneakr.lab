/**
 * Sneakr.lab - API client for designs (PostgreSQL backend)
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function saveDesign(design) {
  const res = await fetch(`${API_BASE}/api/designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ design }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Failed to save design');
  }
  return res.json();
}

export async function getDesigns() {
  const res = await fetch(`${API_BASE}/api/designs`);
  if (!res.ok) throw new Error('Failed to load designs');
  return res.json();
}

export async function getDesign(id) {
  const res = await fetch(`${API_BASE}/api/designs/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Design not found');
    throw new Error('Failed to load design');
  }
  return res.json();
}

export async function deleteDesign(id) {
  const res = await fetch(`${API_BASE}/api/designs/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete design');
}
