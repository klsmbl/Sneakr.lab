/**
 * Sneakr.lab - API client for designs and authentication
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function signIn(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Sign in failed' }));
    throw new Error(err.error || 'Sign in failed');
  }
  return res.json();
}

export async function signUp(email, password, role = 'user') {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Sign up failed' }));
    throw new Error(err.error || 'Sign up failed');
  }
  return res.json();
}

export async function saveDesign(design) {
  const res = await fetch(`${API_BASE}/api/designs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ design }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Failed to save design');
  }
  return res.json();
}

export async function getDesigns() {
  const res = await fetch(`${API_BASE}/api/designs`, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to load designs');
  return res.json();
}

export async function getDesign(id) {
  const res = await fetch(`${API_BASE}/api/designs/${id}`, {
    headers: getAuthHeader()
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Design not found');
    throw new Error('Failed to load design');
  }
  return res.json();
}

export async function deleteDesign(id) {
  const res = await fetch(`${API_BASE}/api/designs/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete design');
}

// Subscription and Payment APIs
export async function getSubscription() {
  const res = await fetch(`${API_BASE}/api/subscription`, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to get subscription');
  return res.json();
}

export async function createSubscriptionOrder(plan) {
  const res = await fetch(`${API_BASE}/api/subscription/create-order`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ plan })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create order' }));
    throw new Error(err.error || 'Failed to create order');
  }
  return res.json();
}

export async function captureSubscriptionOrder(orderId) {
  const res = await fetch(`${API_BASE}/api/subscription/capture-order`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ orderId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to capture order' }));
    throw new Error(err.error || 'Failed to capture order');
  }
  return res.json();
}

export async function getPaymentHistory() {
  const res = await fetch(`${API_BASE}/api/payments/history`, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to get payment history');
  return res.json();
}
