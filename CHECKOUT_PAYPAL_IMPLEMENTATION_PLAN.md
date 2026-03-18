# Checkout PayPal Payment Implementation Plan

## Overview
Implement PayPal payment integration for the checkout feature following the same pattern used in the subscription feature. This will enable users to purchase custom sneakers using PayPal.

---

## Architecture Pattern (Based on Subscription)

### Current Subscription Flow
1. **Frontend**: Load PayPal SDK → Show PayPal Buttons
2. **PayPal Button**: `createOrder()` → Call backend to create order
3. **Backend**: Generate PayPal order with amount/description → Store in DB → Return OrderID
4. **PayPal UI**: User authenticates and approves
5. **Frontend**: `onApprove()` → Call backend to capture order
6. **Backend**: Capture with PayPal API → Verify COMPLETED status → Update user subscription
7. **Frontend**: Update UI and context

---

## Implementation Plan

### Phase 1: Backend API Routes

**File**: `server/routes/payments.js`

#### New Functions to Add:

```
1. createCheckoutOrder(req, res)
   - Accept: { amount, shippingMethod, modelName, designName }
   - Create PayPal order with return_url pointing to /checkout/success
   - Store in database (orders table) with status='CREATED'
   - Return: { id: orderId, status }

2. captureCheckoutOrder(req, res)
   - Accept: { orderId }
   - Call PayPal /capture endpoint
   - Verify status === 'COMPLETED'
   - Update order table with status='COMPLETED'
   - Create corresponding design/product record
   - Return: { success: true, orderId, amount }

3. getOrderHistory(req, res)
   - Retrieve user's order history from orders table
   - Return: array of orders with details
```

#### New Routes in `server/index.js`:

```javascript
app.post('/api/checkout/create-order', auth.authenticate, payments.createCheckoutOrder);
app.post('/api/checkout/capture-order', auth.authenticate, payments.captureCheckoutOrder);
app.get('/api/checkout/orders', auth.authenticate, payments.getOrderHistory);
```

---

### Phase 2: Database Schema Update

**File**: `server/db.js`

#### Add New `orders` Table:

```sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  paypal_order_id TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('CREATED', 'APPROVED', 'COMPLETED', 'FAILED')),
  
  -- Order Details
  shipping_method TEXT NOT NULL,
  model_name TEXT NOT NULL,
  design_name TEXT,
  design_image TEXT,
  
  -- Shipping Info
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  
  -- Tracking
  tracking_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON orders(paypal_order_id);
```

---

### Phase 3: Frontend API Service

**File**: `frontend/src/services/api.js`

#### New API Functions:

```javascript
// Create checkout order with PayPal
export async function createCheckoutOrder(orderData) {
  const response = await fetch(`${API_BASE}/checkout/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}

// Capture checkout order payment
export async function captureCheckoutOrder(orderId) {
  const response = await fetch(`${API_BASE}/checkout/capture-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to capture payment');
  return response.json();
}

// Get order history
export async function getOrderHistory() {
  const response = await fetch(`${API_BASE}/checkout/orders`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to load orders');
  return response.json();
}
```

---

### Phase 4: Frontend Context (Optional but Recommended)

Create `frontend/src/context/OrderContext.js` similar to `SubscriptionContext.js`:

```javascript
export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderData = await getOrderHistory();
      setOrders(orderData);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  // ... rest of context logic
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
```

---

### Phase 5: Update CheckoutPage Component

**File**: `frontend/src/pages/CheckoutPage.js`

#### Changes Required:

1. **State Management**:
   ```javascript
   const [formData, setFormData] = useState({
     email: '',
     fullName: '',
     address: '',
     city: '',
     state: '',
     postalCode: '',
     country: ''
   });
   const [paypalReady, setPaypalReady] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const paypalButtonRef = useRef(null);
   const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
   ```

2. **Load PayPal SDK** (like SubscriptionPage):
   ```javascript
   useEffect(() => {
     if (!PAYPAL_CLIENT_ID) {
       setError('PayPal configuration missing');
       return;
     }

     if (window.paypal) {
       setPaypalReady(true);
       return;
     }

     const script = document.createElement('script');
     script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
     script.async = true;
     script.onload = () => setPaypalReady(true);
     script.onerror = () => setError('Failed to load PayPal SDK');
     document.body.appendChild(script);

     return () => {
       if (script.parentNode) {
         script.parentNode.removeChild(script);
       }
     };
   }, [PAYPAL_CLIENT_ID]);
   ```

3. **Handle PayPal Order Creation**:
   ```javascript
   const handleCreateCheckoutOrder = async () => {
     try {
       setLoading(true);
       // Validate form data
       if (!formData.fullName || !formData.address) {
         throw new Error('Please fill in all required fields');
       }

       const orderData = await createCheckoutOrder({
         amount: total.toFixed(2),
         shippingMethod,
         modelName: checkoutModelName,
         designName: checkoutDesignName,
         email: formData.email,
         fullName: formData.fullName,
         address: formData.address,
         city: formData.city,
         state: formData.state,
         postalCode: formData.postalCode,
         country: formData.country
       });

       return orderData.id;
     } catch (err) {
       setError(err.message);
       throw err;
     } finally {
       setLoading(false);
     }
   };
   ```

4. **Handle Payment Capture**:
   ```javascript
   const handleCapturePayment = async (orderId) => {
     try {
       setLoading(true);
       const result = await captureCheckoutOrder(orderId);
       setError('');
       // Redirect to success page
       navigate('/checkout/success', { 
         state: { orderId: result.orderId, amount: result.amount }
       });
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };
   ```

5. **Render PayPal Buttons**:
   ```javascript
   useEffect(() => {
     if (!paypalReady || !window.paypal || !paypalButtonRef.current) return;

     paypalButtonRef.current.innerHTML = '';
     window.paypal.Buttons({
       style: { layout: 'vertical', color: 'gold', shape: 'pill', height: 42 },
       createOrder: () => handleCreateCheckoutOrder(),
       onApprove: async (data) => {
         await handleCapturePayment(data.orderID);
       },
       onError: () => {
         setError('PayPal payment failed. Please try again.');
       }
     }).render(paypalButtonRef.current);
   }, [paypalReady]);
   ```

6. **Replace Card Payment Section**:
   ```javascript
   <div className="checkout-section">
     <h2>Payment</h2>
     {error && <div className="alert alert-danger">{error}</div>}
     <div ref={paypalButtonRef} />
   </div>
   ```

---

### Phase 6: Create Success/Confirmation Pages

**File**: `frontend/src/pages/CheckoutSuccessPage.js`

```javascript
export default function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  return (
    <div className="checkout-success">
      <div className="success-icon">✓</div>
      <h1>Order Confirmed</h1>
      <p>Order ID: {orderId}</p>
      <p>You will receive a confirmation email shortly.</p>
      <button onClick={() => navigate('/account')}>View Orders</button>
    </div>
  );
}
```

**Add Route** in `App.js`:
```javascript
<Route path="/checkout/success" element={<CheckoutSuccessPage />} />
```

---

## Implementation Order

### Step 1: Database
- [ ] Add `orders` table to `server/db.js`

### Step 2: Backend API
- [ ] Add `createCheckoutOrder` function to `payments.js`
- [ ] Add `captureCheckoutOrder` function to `payments.js`
- [ ] Add `getOrderHistory` function to `payments.js`
- [ ] Add routes to `server/index.js`

### Step 3: Frontend Services
- [ ] Add API functions to `frontend/src/services/api.js`

### Step 4: Frontend Components
- [ ] Update `CheckoutPage.js` with PayPal SDK and buttons
- [ ] Create `CheckoutSuccessPage.js`
- [ ] Update `App.js` with new route

### Step 5: (Optional) Frontend Context
- [ ] Create `OrderContext.js`
- [ ] Update `App.js` to wrap with `OrderProvider`

### Step 6: Testing
- [ ] Test PayPal sandbox integration
- [ ] Verify order creation in database
- [ ] Verify payment capture flow
- [ ] Test with test PayPal account

---

## Key Differences from Card Payment

1. **No Card Fields**: Remove manual card input fields
2. **SDK Integration**: Use PayPal's official SDK with safe button component
3. **Server-Side Security**: All payment processing happens at backend with PayPal API
4. **Order Tracking**: Similar to subscriptions, orders tracked in `orders` table
5. **User Experience**: Redirect users to PayPal, then back to app

---

## Environment Variables Required

```
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
REACT_APP_PAYPAL_CLIENT_ID=your_sandbox_client_id
FRONTEND_URL=http://localhost:3000
```

---

## Testing Checklist

- [ ] Test with PayPal Sandbox Account
- [ ] Test order creation with various amounts
- [ ] Test payment capture success flow
- [ ] Test payment cancellation flow
- [ ] Test error handling edge cases
- [ ] Verify database records created correctly
- [ ] Verify user redirect to success page
- [ ] Test order history retrieval

---

## Error Handling Points

1. **SDK Loading**: Show user-friendly message if SDK fails
2. **Form Validation**: Validate all shipping fields before creating order
3. **Order Creation**: Handle PayPal API errors with user feedback
4. **Capture Failure**: Allow user to retry or contact support
5. **Network Issues**: Graceful degradation and retry logic

---

## Future Enhancements

- [ ] Order invoice generation and email
- [ ] Shipping tracking integration
- [ ] Order history page with details
- [ ] Refund process integration
- [ ] Order notifications (processing, shipped, delivered)
- [ ] Multiple payment methods (Apple Pay, Google Pay)
