/**
 * Sneakr.lab - DATASTALGO
 * Toggle between free and premium for demo/testing
 */

import { useSubscription } from '../context/SubscriptionContext';

export function SubscriptionTierToggle() {
  const { tier, setTier } = useSubscription();

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <span className="small text-muted">Subscription:</span>
      <div className="btn-group btn-group-sm" role="group">
        <input
          type="radio"
          className="btn-check"
          name="tier"
          id="tier-free"
          checked={tier === 'free'}
          onChange={() => setTier('free')}
        />
        <label className="btn btn-outline-secondary" htmlFor="tier-free">
          Free
        </label>
        <input
          type="radio"
          className="btn-check"
          name="tier"
          id="tier-premium"
          checked={tier === 'premium'}
          onChange={() => setTier('premium')}
        />
        <label className="btn btn-outline-primary" htmlFor="tier-premium">
          Premium
        </label>
      </div>
    </div>
  );
}
