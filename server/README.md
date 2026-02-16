# Sneakr.lab Server

Express API server with PostgreSQL for saving and loading sneaker designs.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file with your PostgreSQL connection:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sneakrlab
```

3. Initialize the database schema:
```bash
psql $DATABASE_URL -f schema.sql
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/designs` - List all designs
- `GET /api/designs/:id` - Get a specific design
- `POST /api/designs` - Save a new design
- `DELETE /api/designs/:id` - Delete a design
