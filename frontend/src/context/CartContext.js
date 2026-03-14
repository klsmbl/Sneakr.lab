import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CART_STORAGE_KEY = 'sneakr_cart_items';

const CartContext = createContext(null);

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeQuantity(quantity) {
  const safe = Number(quantity) || 1;
  return Math.max(1, Math.min(10, safe));
}

function getCartFingerprint(item) {
  const colorKey = Object.entries(item.layerColors || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([part, color]) => `${part}:${color}`)
    .join('|');

  return [
    item.modelId,
    item.designId,
    item.size,
    item.logoPrompt || '',
    colorKey,
  ].join('::');
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item) => {
    const normalized = {
      ...item,
      quantity: normalizeQuantity(item.quantity),
      cartFingerprint: getCartFingerprint(item),
      id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      unitPrice: item.unitPrice || 120,
    };

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.cartFingerprint === normalized.cartFingerprint);
      if (idx === -1) return [normalized, ...prev];

      const updated = [...prev];
      const mergedQty = normalizeQuantity(updated[idx].quantity + normalized.quantity);
      updated[idx] = { ...updated[idx], quantity: mergedQty };
      return updated;
    });

    setIsCartOpen(true);
  }, []);

  const updateItemQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: normalizeQuantity(quantity) } : item))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.unitPrice, 0),
    [items]
  );

  const value = {
    items,
    isCartOpen,
    itemCount,
    subtotal,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((v) => !v),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
