# Sneakr.lab PostgreSQL Migration Guide

## Transformation Summary

Your Sneakr.lab project has been successfully transformed to use **PostgreSQL** as the database. This replaces the previous SQLite implementation.

### What Was Changed

#### 1. **Node.js API Server** (`server/`)
   - **package.json**: Replaced `better-sqlite3` with `pg` (PostgreSQL client library)
   - **db.js**: Completely rewritten to use PostgreSQL connection pooling with async/await
   - **routes/auth.js**: Updated all database queries to use PostgreSQL parameterized queries
   - **routes/designs.js**: Converted to async PostgreSQL queries
   - **routes/payments.js**: Migrated all database operations to PostgreSQL
   - **.env**: Added PostgreSQL connection credentials

#### 2. **Django Backend** (`backend/`)
   - **settings.py**: Already configured to use PostgreSQL
   - **PostgreSQL Driver**: Installed `psycopg2-binary` for Django-PostgreSQL integration
   - **requirements.txt**: Created with all dependencies including psycopg2-binary

#### 3. **Database Schema**
   - **init-db.sql**: SQL initialization script for PostgreSQL database setup
   - **UUID Primary Keys**: Using PostgreSQL native UUIDs instead of text IDs
   - **JSONB Columns**: Using PostgreSQL's JSONB type for design storage (faster querying)
   - **Enum Types**: Created PostgreSQL enum types for user_role, subscription_tier, and payment_status

### Database Schema

#### Tables Created:
1. **users**
   - id (UUID, PK)
   - email (TEXT, UNIQUE)
   - password_hash (TEXT)
   - role (user_role enum: 'admin', 'user')
   - subscription (subscription_tier enum: 'free', 'premium')
   - full_name (TEXT)
   - subscription_date (TIMESTAMP)
   - created_at (TIMESTAMP)

2. **payments**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - paypal_order_id (TEXT, UNIQUE)
   - amount (DECIMAL)
   - currency (TEXT)
   - status (payment_status enum)
   - subscription_months (INTEGER)
   - created_at (TIMESTAMP)

3. **designs**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - design (JSONB)
   - created_at (TIMESTAMP)

4. **orders**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - paypal_order_id (TEXT, UNIQUE)
   - amount (DECIMAL)
   - currency (TEXT)
   - status (payment_status enum)
   - Delivery information fields
   - tracking_number (TEXT)
   - created_at, updated_at (TIMESTAMP)

### Configuration

#### PostgreSQL Connection Settings
The following environment variables are used in `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Sneakr.lab
DB_USER=postgres
DB_PASSWORD=admin123
```

#### Django Settings
PostgreSQL is configured in `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Sneakr.lab',
        'USER': 'postgres',
        'PASSWORD': 'admin123',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },
    }
}
```

## Setup Instructions

### Prerequisites
- PostgreSQL server running on `localhost:5432`
- PostgreSQL user `postgres` with password `admin123`
- Database `Sneakr.lab` created

### Step 1: Verify PostgreSQL Installation

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d postgres -c "SELECT version();"
```

### Step 2: Create PostgreSQL Database (if not exists)

```bash
# Connect as postgres user
psql -h localhost -U postgres

# Then run:
CREATE DATABASE "Sneakr.lab" ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
```

### Step 3: Initialize Database Schema

Choose one of these methods:

**Method A: Using SQL Script**
```bash
psql -h localhost -U postgres -d "Sneakr.lab" -f server/init-db.sql
```

**Method B: Auto-initialization by Node.js**
The database schema is automatically created when the Node.js server starts (via `db.js`).

### Step 4: Start Services

**Option 1: Using the existing tasks**
```bash
# In VS Code, run the task: "start all services"
# Or run individual services:
npm start frontend
npm start node-api
python manage.py runserver
```

**Option 2: Using task automation**
```powershell
# Start all services in parallel
Set-Location frontend; npm install; npm start &
Set-Location server; npm install; npm start &
Set-Location backend; python manage.py runserver &
```

### Step 5: Verify Setup

1. **Test API Health**
   ```bash
   curl http://localhost:3001/api/health
   # Expected response: {"ok":true}
   ```

2. **Test Django Admin**
   ```bash
   # Navigate to http://localhost:8000/admin
   # Username: (configured in Django)
   ```

3. **Test Frontend**
   ```bash
   # Navigate to http://localhost:3000
   ```

## Migration from SQLite to PostgreSQL

### Data Migration (if needed)

If you had existing data in SQLite that needs to be transferred:

1. **Export SQLite data:**
   ```bash
   sqlite3 server/sneakrlab.db ".mode json" "SELECT * FROM users;" > users.json
   ```

2. **Import to PostgreSQL:**
   ```bash
   # Use a migration script or manually insert via psql
   psql -h localhost -U postgres -d "Sneakr.lab" -c "INSERT INTO users (...) VALUES (...);"
   ```

## Key Improvements

✅ **Connection Pooling**: Better performance with multiple concurrent connections
✅ **JSONB Support**: Faster queries on design data with PostgreSQL's native JSONB type
✅ **Async/Await**: All database operations now use async/await patterns
✅ **Parameterized Queries**: Protection against SQL injection attacks
✅ **Enum Types**: Type safety for role, subscription tier, and payment status
✅ **UUID Support**: Native PostgreSQL UUID type support
✅ **Transactions**: Better support for complex operations with database transactions

## Troubleshooting

### Error: "ECONNREFUSED - PostgreSQL connection refused"
- Verify PostgreSQL is running: `psql -h localhost -U postgres -c "\q"`
- Check if port 5432 is listening: `netstat -an | grep 5432`
- Verify credentials in `.env` file match PostgreSQL config

### Error: "Database does not exist"
```bash
# Create the database:
psql -h localhost -U postgres -c "CREATE DATABASE \"Sneakr.lab\";"
```

### Error: "psycopg2.errors.ProgrammingError: type 'user_role' does not exist"
- Run the initialization script: `psql -h localhost -U postgres -d "Sneakr.lab" -f server/init-db.sql`

### Port Already in Use
- Check what's using the port:
  ```bash
  netstat -ano | findstr :5432
  # Then kill the process
  taskkill /PID <PID> /F
  ```

## Environment Variables

### Node.js Server (.env)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=sneakr_lab_secret_key_2024
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Sneakr.lab
DB_USER=postgres
DB_PASSWORD=admin123
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### Django Backend
- Uses environment variables from `backend/.env` if present
- Falls back to hardcoded values in `settings.py`

## Next Steps

1. **Update Frontend API Calls**: Ensure frontend is compatible with the new async API responses
2. **Add Error Handling**: Test error scenarios for database connection failures
3. **Performance Tuning**: Monitor connection pool usage and adjust settings if needed
4. **Backup Strategy**: Set up regular PostgreSQL backups
5. **Security**: Update credentials in production environment

## Files Modified

- `server/package.json` - Updated dependencies
- `server/db.js` - New PostgreSQL pooling implementation
- `server/routes/auth.js` - Async PostgreSQL queries
- `server/routes/designs.js` - Async PostgreSQL queries
- `server/routes/payments.js` - Async PostgreSQL queries
- `server/.env` - Added PostgreSQL credentials
- `backend/requirements.txt` - Added psycopg2-binary
- `server/init-db.sql` - New database initialization script

## Support & Documentation

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- node-pg Documentation: https://node-postgres.com/
- Django PostgreSQL: https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes
