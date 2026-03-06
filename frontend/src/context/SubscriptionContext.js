/**
 * Sneakr.lab - DATASTALGO
 * Subscription feature gating: free vs premium (synced with backend)
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser } from './UserContext';
import { getSubscription } from '../services/api';

const FREE_SAVED_DESIGNS_LIMIT = 2;
const FREE_AI_GENERATIONS_PER_DAY = 3;

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user, token } = useUser();
  const [tier, setTier] = useState('free');
  const [savedDesignsCount, setSavedDesignsCount] = useState(0);
  const [aiGenerationsUsedToday, setAiGenerationsUsedToday] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch subscription status from backend when user logs in
  useEffect(() => {
    if (user && token) {
      loadSubscription();
    } else {
      setTier('free');
      setSavedDesignsCount(0);
      setAiGenerationsUsedToday(0);
    }
  }, [user, token]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const subData = await getSubscription();
      setTier(subData.tier);
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setTier('free');
    } finally {
      setLoading(false);
    }
  };

  const canSaveDesign = useCallback(() => {
    if (tier === 'premium') return true;
    return savedDesignsCount < FREE_SAVED_DESIGNS_LIMIT;
  }, [tier, savedDesignsCount]);

  const incrementSavedDesigns = useCallback(() => {
    setSavedDesignsCount((c) => c + 1);
  }, []);

  const incrementAiGenerations = useCallback(() => {
    if (tier === 'premium' || aiGenerationsUsedToday < FREE_AI_GENERATIONS_PER_DAY) {
      setAiGenerationsUsedToday((c) => c + 1);
      return true;
    }
    return false;
  }, [tier, aiGenerationsUsedToday]);

  const value = {
    tier,
    setTier,
    savedDesignsCount,
    aiGenerationsUsedToday,
    canSaveDesign,
    incrementSavedDesigns,
    incrementAiGenerations,
    canExportHD: () => tier === 'premium',
    canRemoveWatermark: () => tier === 'premium',
    canUseUnlimitedColors: () => tier === 'premium',
    canAccessAllModels: () => tier === 'premium',
    canDuplicateDesigns: () => tier === 'premium',
    loading
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

export { FREE_SAVED_DESIGNS_LIMIT, FREE_AI_GENERATIONS_PER_DAY };
