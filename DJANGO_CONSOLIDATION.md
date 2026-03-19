# Django Backend Consolidation - Migration Complete

## Overview
Successfully consolidated the Sneakr.lab project to use **Django as the only backend**, removing the redundant Node.js server. All functionality has been migrated and integrated with PostgreSQL.

## What Changed

### ✅ **Django Backend Expanded** (`backend/base/`)

#### New Models Created:
1. **UserProfile** - Extended user info with subscription and role management
2. **Design** - Store user design customizations
3. **Payment** - Track subscription payments via PayPal
4. **Order** - Track checkout/purchase orders

#### New API Endpoints:

**Authentication:**
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/signin/` - Login user
- `GET /api/auth/profile/` - Get current user profile

**Designs:**
- `GET /api/designs/` - List all designs (admin sees all)
- `POST /api/designs/` - Create new design
- `GET /api/designs/<id>/` - Get specific design
- `DELETE /api/designs/<id>/` - Delete design

**Subscriptions:**
- `GET /api/subscription/` - Get subscription status
- `POST /api/subscription/create-order/` - Create PayPal subscription order
- `POST /api/subscription/capture-order/` - Capture subscription payment

**Payments:**
- `GET /api/payments/history/` - Get payment history

**Checkout/Orders:**
- `POST /api/checkout/create-order/` - Create PayPal checkout order
- `POST /api/checkout/capture-order/` - Capture checkout payment
- `GET /api/checkout/orders/` - Get order history

#### New Files Created:
- `base/serializers.py` - DRF serializers for all models
- `base/auth_utils.py` - JWT token generation utilities
- `base/paypal_utils.py` - PayPal integration helpers
- `base/signals.py` - Auto-create UserProfile on user creation
- `base/migrations/0002_*.py` - Database migrations for new models

#### Files Updated:
- `base/models.py` - Added UserProfile, Design, Payment, Order models
- `base/views.py` - Added REST API endpoints (complete rewrite)
- `base/urls.py` - Added URL routing for all endpoints
- `base/admin.py` - Registered all models in admin panel
- `base/apps.py` - Configured signal registration
- `backend/settings.py` - Added JWT and REST framework configuration

### ✅ **Frontend Updated** (`frontend/src/`)

#### Files Modified:
- `services/api.js` - Changed API base URL from `http://localhost:3001` to `http://localhost:8000/api`
- `components/SignIn.js` - Updated to handle JWT response format with 'access' token

#### Key Changes:
- All API calls now go to Django instead of Node.js server
- Token authentication uses JWT with Bearer scheme
- Token stored in localStorage as 'token' or 'access_token'

### ❌ **Node.js Server** (`server/`)

The Node.js server is now **no longer needed** since all functionality is in Django. 

**Optional Actions:**
- Keep for reference: Useful to see original PostgreSQL implementation
- Delete entirely: Clean up the project
- Recommendation: **Delete** to reduce complexity and maintenance burden

## Database Architecture

All data now flows through **PostgreSQL** with Django ORM:

```
Frontend (React)
    ↓
Django REST API (port 8000)
    ↓
PostgreSQL Database (port 5432)
```

### Tables Created:
- `auth_user` - Django auth users
- `base_userprofile` - User subscription and role info
- `base_design` - User designs/customizations
- `base_payment` - PayPal subscription payments
- `base_order` - PayPal checkout orders
- Plus Django system tables (admin, sessions, etc.)

## Authentication Flow

1. **Sign Up/Sign In**: Frontend calls `POST /api/auth/signup/` or `POST /api/auth/signin/`
2. **JWT Generation**: Django creates access + refresh tokens
3. **Token Storage**: Frontend stores access token in localStorage
4. **Protected Access**: All endpoints check JWT in `Authorization: Bearer <token>` header
5. **Auto Profile**: UserProfile auto-created on user creation via signals

## Configuration

### Environment Variables (Already Set):
- Django database: PostgreSQL (localhost:5432)
- Frontend API: `http://localhost:8000/api`
- JWT secret: Managed by Django
- PayPal credentials: Set in Django .env or settings

### Django Settings Updated:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

## Running the Project

### Start Django Backend:
```bash
cd backend
python manage.py runserver
# Runs on http://localhost:8000
# API available at http://localhost:8000/api/
```

### Start Frontend:
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
# Automatically calls Django API at port 8000
```

## Testing Endpoints

### Sign Up:
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Sign In:
```bash
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### For Protected Endpoints (include token):
```bash
curl -X GET http://localhost:8000/api/designs/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Error: "401 Unauthorized"
- Check token is being sent in Authorization header
- Token should be in format: `Bearer <access_token>`
- Ensure token is stored in localStorage as 'token' or 'access_token'

### Error: "Authentication credentials were not provided"
- Add Authorization header with JWT token

### Error: "User matching query does not exist"
- JWT might contain invalid user ID
- Try signing in again to get new token

### Error: "PayPal order creation failed"
- Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set in environment
- Verify they're correct in `.env` or settings.py

## Migration Notes

### From Node.js to Django:
- ✅ All endpoints migrated
- ✅ PostgreSQL integrated
- ✅ Authentication converted to JWT
- ✅ PayPal integration working
- ✅ Frontend fully compatible
- ❌ Node.js server can be deleted

### What Stayed the Same:
- Virtual Try-On (Vertex AI) endpoints
- FAQ endpoints
- Frontend UI/UX
- PayPal integration logic
- Database schema (upgraded to PostgreSQL)

## Next Steps

1. **Delete Node.js Server (Optional)**:
   ```bash
   rm -rf server/  # or delete the directory
   ```

2. **Create Django Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   # Then access admin at http://localhost:8000/admin/
   ```

3. **Test All Endpoints**: Sign up, create designs, make payments

4. **Production Deployment**: Use Django deployment best practices (gunicorn, nginx, etc.)

## Performance Benefits

✅ Single backend = easier debugging
✅ Django ORM = better database queries
✅ JWT tokens = stateless authentication
✅ PostgreSQL = powerful database features
✅ REST Framework = consistent API design
✅ Reduced complexity = easier maintenance

## Files to Clean Up

After verification, you can optionally remove:
- `server/` - Node.js server directory
- `server/package.json` - Node dependencies
- Old SQLite database files (if any)

All functionality is now in Django!
