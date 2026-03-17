# Sneakr.lab - Subscription Feature Implementation

## Overview
The subscription system is now fully integrated with PayPal Sandbox for testing payment processing. Users can upgrade from Free to Premium tier with monthly or yearly plans.

## Features Implemented

### 1. **Backend (Node.js + Express)**
- ✅ Subscription management endpoints
- ✅ PayPal Sandbox REST API integration
- ✅ Payment order creation and capture
- ✅ Payment history tracking
- ✅ SQLite database with payments table

### 2. **Frontend (React)**
- ✅ Subscription page with pricing plans
- ✅ Premium button in navigation
- ✅ Subscription context synced with backend
- ✅ Feature gating based on tier

## API Endpoints

### Authentication Required Endpoints

#### Get Subscription Status
```
GET /api/subscription
Response: { tier: 'free'|'premium', subscription_date: ISO8601, can_upgrade: boolean }
```

#### Create PayPal Order
```
POST /api/subscription/create-order
Body: { plan: 'monthly'|'yearly' }
Response: { id: string, status: string }
```

#### Capture PayPal Order
```
POST /api/subscription/capture-order
Body: { orderId: string }
Response: { success: boolean, subscription: string, subscription_date: ISO8601 }
```

#### Get Payment History
```
GET /api/payments/history
Response: [{ id, amount, status, created_at, ... }]
```

## Subscription Tiers

### Free Plan
- ✓ Customize 1 sneaker model
- ✓ Limited color palette
- ✓ 3 AI logo generations per day
- ✓ Standard 3D preview quality
- ✓ Save 1-2 designs
- ✗ Watermark on designs
- ✗ HD export

### Premium Plan
- ✓ **$9.99/month** or **$99.99/year**
- ✓ All sneaker models
- ✓ Unlimited colors & materials
- ✓ Unlimited AI logo generations
- ✓ HD quality output
- ✓ Unlimited design saves
- ✓ Remove watermarks
- ✓ Export high-definition mockups
- ✓ Duplicate & edit designs
- ✓ Advanced design presets

## Feature Gating Implementation

The `SubscriptionContext` provides methods for feature access:

```javascript
const { tier, canExportHD, canRemoveWatermark, canAccessAllModels } = useSubscription();

// Usage in components:
if (canExportHD()) {
  // Show HD export button
}
```

### Available Methods
- `canSaveDesign()` - Check if design save is allowed
- `canExportHD()` - Check if HD export is available
- `canRemoveWatermark()` - Check if watermark removal available
- `canUseUnlimitedColors()` - Check if unlimited colors available
- `canAccessAllModels()` - Check if all models available
- `canDuplicateDesigns()` - Check if design duplication available

## PayPal Sandbox Credentials

**Demo Test Account (Buyer)**
- Email: sb-mock@paypal.com
- Password: 123456

**Demo Test Account (Seller)**
- Email: sb-seller@paypal.com
- Password: 123456

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  subscription TEXT DEFAULT 'free',
  subscription_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  paypal_order_id TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,  -- CREATED, APPROVED, COMPLETED, FAILED
  subscription_months INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

## How to Test

### 1. Sign Up or Sign In
Navigate to `/signin` and create a test account

### 2. Access Subscription Page
Click the "⭐ Upgrade to Premium" button in the header (visible to free users)
Or navigate directly to `/subscription`

### 3. Choose a Plan
- **Monthly**: $9.99/month
- **Yearly**: $99.99/year (Save $19.89!)

### 4. Complete Payment
- Click "Upgrade Monthly" or "Upgrade Yearly"
- The official PayPal checkout window will open
- Log in with your Sandbox Buyer account (sb-mock@paypal.com / 123456)
- Review and complete the payment
- Your account will be upgraded automatically and your payment history updated!

### 5. Verify Features
Check payment history and feature access in the app

## Environment Variables

### Backend (.env)
```
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000

# PayPal Sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## File Structure

### Backend
```
server/
├── index.js                 (Main server with routes)
├── db.js                    (SQLite database setup)
├── routes/
│   ├── auth.js             (Authentication)
│   ├── designs.js          (Design CRUD)
│   └── payments.js         (Subscription & PayPal)
└── .env                    (Configuration)
```

### Frontend
```
frontend/src/
├── components/
│   ├── SubscriptionPage.js        (Pricing page)
│   ├── SubscriptionPage.css       (Styling)
│   └── LandingPage.js             (Updated with Premium button)
├── context/
│   ├── SubscriptionContext.js     (Tier gating logic)
│   ├── UserContext.js             (User state)
│   └── DesignContext.js           (Design state)
├── services/
│   └── api.js                     (API calls with subscription methods)
└── App.js                         (Updated routes with /subscription)
```

## Key Features

### 1. Automatic Subscription Sync
- When user logs in, subscription status is automatically fetched from backend
- Tier state updates across the entire app
- Reflects in UI with tier indicator

### 2. Payment Tracking
- All payment attempts are stored in database
- Payment history accessible to users
- Status tracking: CREATED, APPROVED, COMPLETED, FAILED

### 3. Feature Gating
- Free users see limited features
- Premium users unlock all capabilities
- Real-time updates without page refresh

### 4. Demo Mode
- Uses PayPal Sandbox credentials
- No real money transactions
- Safe for testing and development

## Future Enhancements

1. **Stripe Integration** - Add Stripe as alternative payment method
2. **Subscription Management** - Allow users to cancel/upgrade
3. **Renewal Handling** - Auto-renewal for subscriptions
4. **Invoice Generation** - PDF invoices for payments
5. **Promotional Codes** - Support discount codes
6. **Trial Period** - Free trial before subscription

## Troubleshooting

### "Failed to create user"
- Ensure backend is running: `cd server && npm start`
- Check database connection in `server/.env`

### Payment not working
- Verify API keys in `server/.env`
- Check browser console for error details
- Test with PayPal sandbox credentials

### Subscription not showing
- Clear browser cache and localStorage
- Ensure user is logged in
- Check network tab in DevTools for API calls

## Support
For issues or questions, check the API response errors in browser DevTools Console tab.
