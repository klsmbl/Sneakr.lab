/**
 * Sneakr.lab - DATASTALGO
 * Subscription feature gating: free vs premium
 */

import { createContext, useContext, useState, useCallback } from 'react';

const FREE_SAVED_DESIGNS_LIMIT = 2;

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [tier, setTier] = useState('free');
  const [savedDesignsCount, setSavedDesignsCount] = useState(0);

  const canSaveDesign = useCallback(() => {
    if (tier === 'premium') return true;
    return savedDesignsCount < FREE_SAVED_DESIGNS_LIMIT;
  }, [tier, savedDesignsCount]);

  const incrementSavedDesigns = useCallback(() => {
    setSavedDesignsCount((c) => c + 1);
  }, []);

  const value = {
    tier,
    setTier,
    savedDesignsCount,
    canSaveDesign,
    incrementSavedDesigns,
    canExportHD: () => tier === 'premium',
    canRemoveWatermark: () => tier === 'premium',
    canUseUnlimitedColors: () => tier === 'premium',
    canAccessAllModels: () => tier === 'premium',
    canDuplicateDesigns: () => tier === 'premium',
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

export { FREE_SAVED_DESIGNS_LIMIT };
