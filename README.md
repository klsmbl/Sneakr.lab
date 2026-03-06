# Sneakr.lab - Sneaker Customizer

**DATASTALGO Project** - A web-based sneaker customization platform with real-time 3D preview and subscription-based feature gating.

![Sneakr.lab](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-19.2.4-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black.svg)

## Features

### 🎨 Real-Time Customization
- **Multi-Zone Color Customization**: Upper, sole, and accent colors
- **Real-Time 3D Preview**: Interactive 3D model with rotation and zoom using Three.js
- **Classic Low Model**: Professional sneaker model with vertex coloring
- **Design Patterns**: Plain customization template

### 💎 Subscription Tiers
- **Free Tier**:
  - Classic Low sneaker model
  - 5 basic color options
  - Customizable upper, sole, and accents
  - Watermark on preview
  
- **Premium Tier**:
  - All free features
  - 15+ color options
  - Unlimited saved designs
  - HD export
  - No watermark
  - Access to premium models (coming soon)

### 💾 Database Integration (Optional)
- Save and load designs from PostgreSQL
- View design history
- Share designs via unique IDs


## Tech Stack

- **Frontend**: React 19, React Router DOM 7, Bootstrap 5
- **3D Rendering**: Three.js 0.182, React Three Fiber 9.5, React Three Drei 10.7
- **Backend**: Express.js, PostgreSQL (optional)
- **State Management**: React Context API
- **Styling**: Bootstrap 5, Custom CSS

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL (optional - only needed for saving designs)

### Installation

1. **Clone and Navigate to Frontend**
```bash
cd Sneakr.lab/frontend
npm install
```

2. **Install Backend Dependencies** (Optional - for saving designs)
```bash
cd ../server
npm install
```

3. **Set Up Database** (Optional - for save/load feature)
```bash
# Create a PostgreSQL database
createdb sneakrlab

# Set up environment variables
cd server
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Run schema
psql $DATABASE_URL -f schema.sql
```

### Running the App

1. **Start Frontend**
```bash
cd frontend
npm start
```
App opens at [http://localhost:3000](http://localhost:3000)

2. **Start Backend** (Optional - in another terminal)
```bash
cd server
npm start
```
API runs at [http://localhost:3001](http://localhost:3001)

## Routes

- `/` - Landing page with hero section
- `/customizer` - 3D sneaker customizer interface

## Project Structure

```
Sneakr.lab/
├── frontend/             # React application
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── *.png        # Landing page images
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── LandingPage.js
│   │   │   ├── LandingPage.css
│   │   │   ├── CustomizerPage.js
│   │   │   ├── SneakerSetup.js
│   │   │   ├── ColorCustomizer.js
│   │   │   ├── Mockup3D.js
│   │   │   ├── SaveExport.js
│   │   │   ├── OrderSummary.js
│   │   │   └── SubscriptionTierToggle.js
│   │   ├── context/      # React Context providers
│   │   │   ├── DesignContext.js
│   │   │   └── SubscriptionContext.js
│   │   ├── data/         # Static data and configurations
│   │   │   ├── sneakerOptions.js
│   │   │   └── sneakerModelAssets.js
│   │   ├── services/     # API client
│   │   │   └── api.js
│   │   ├── utils/        # Utility functions
│   │   │   └── designTextures.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── public/               # 3D models (legacy location)
│   └── models/
│       └── classic-low.glb
├── server/               # Express backend (optional)
│   ├── routes/
│   │   └── designs.js
│   ├── db.js
│   ├── index.js
│   ├── schema.sql
│   └── package.json
├── .gitignore
└── package.json          # Root package file
```

## Adding 3D Models

The app supports custom 3D sneaker models in `.glb` or `.gltf` format:
- Download free models from [Sketchfab](https://sketchfab.com)
- Place them in `public/models/` directory
- Configure new models in `frontend/src/data/sneakerOptions.js`

## Development

### Available Scripts

In the `frontend/` directory:
- `npm start` - Run development server (opens at http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

Frontend (optional - create `.env` in frontend/):
```bash
REACT_APP_API_URL=http://localhost:3001
```

Backend (create `.env` in server/):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/sneakrlab
PORT=3001
```

## Features in Detail

### Color Customization
Uses vertex coloring for real-time 3D model updates. The shoe starts with an all-white default and users can customize:
- **Upper**: Main body and sides
- **Sole**: Bottom section  
- **Accents**: Details and highlights

Colors are applied using Three.js vertex attributes based on Y-position of mesh vertices.

### Subscription System
- Free users see a watermark on the 3D preview
- Premium users get unlimited colors, no watermark, and HD export
- Tier status managed via React Context (`SubscriptionContext.js`)

## Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the build/ folder to Vercel, Netlify, or any static host
```

### Backend (Optional)
```bash
cd server
# Set DATABASE_URL environment variable on your hosting platform
npm start
# Deploy to Railway, Render, Heroku, or any Node.js hosting
```

## Key Technologies

- **Three.js Vertex Coloring**: Real-time color application without texture maps
- **React Context API**: Global state management for design and subscription
- **React Three Fiber**: Declarative Three.js in React
- **Bootstrap 5**: Responsive UI components
- **PostgreSQL**: Optional design persistence

## Roadmap

- [ ] Add more sneaker models (Air Force 1, Jordan 1, etc.)
- [ ] Implement texture patterns (stripes, camo, gradient)
- [ ] Add material options (leather, suede, mesh)
- [ ] Social sharing features
- [ ] Design marketplace

## Contributing

This is a DATASTALGO project for sneaker customization. 

## License

This project is for educational and demonstration purposes.

---

**Sneakr.lab** - Where ideas become sneakers ✨

