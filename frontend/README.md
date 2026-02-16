# Sneakr.lab - AI Sneaker Customizer

**DATASTALGO Project** - A web-based sneaker customization platform with real-time 3D preview, AI-powered logo generation, and subscription-based feature gating.

![Sneakr.lab](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-19.2.4-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black.svg)

## Features

### 🎨 Nike-Style Customization
- **Multi-Zone Color Customization**: Upper, sole, and accent colors with smooth gradients
- **Real-Time 3D Preview**: Interactive 3D model with rotation and zoom using Three.js
- **Multiple Sneaker Models**: Choose from Classic Low, New Balance 574, and premium models
- **Design Patterns**: Plain, Stripes, Camo, Gradient, and Vintage textures

### 🤖 AI-Powered Features
- **Logo Generator**: Create custom logos from text descriptions
- **Smart Material Application**: Automatically applies colors to 3D models with vertex coloring

### 💎 Subscription Tiers
- **Free Tier**:
  - 2 sneaker models
  - 5 color options
  - 3 AI generations per day
  - 2 saved designs
  
- **Premium Tier**:
  - 11+ sneaker models
  - 15+ color options
  - Unlimited AI generations
  - Unlimited saved designs
  - HD export
  - No watermark

### 💾 Database Integration
- Save and load designs from PostgreSQL
- View design history
- Share designs via unique IDs

## Tech Stack

- **Frontend**: React 19, React Router, Bootstrap 5
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Backend**: Express.js, PostgreSQL
- **State Management**: React Context API
- **Styling**: Bootstrap 5, Custom CSS

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL (for saving designs)

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies** (Optional - for saving designs)
```bash
cd server
npm install
```

3. **Set Up Database** (Optional)
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
npm start
```
Open [http://localhost:3000](http://localhost:3000)

2. **Start Backend** (Optional - in another terminal)
```bash
cd server
npm start
```
Server runs on [http://localhost:3001](http://localhost:3001)

## Project Structure

```
Sneakr.lab/
├── public/
│   ├── models/           # 3D sneaker models (.glb files)
│   │   └── README.md     # Instructions for downloading models
│   └── index.html
├── src/
│   ├── components/       # React components
│   │   ├── LandingPage.js
│   │   ├── CustomizerPage.js
│   │   ├── SneakerSetup.js
│   │   ├── ColorCustomizer.js
│   │   ├── Mockup3D.js
│   │   ├── AIHelper.js
│   │   ├── SaveExport.js
│   │   ├── OrderSummary.js
│   │   └── SubscriptionTierToggle.js
│   ├── context/          # React Context providers
│   │   ├── DesignContext.js
│   │   └── SubscriptionContext.js
│   ├── data/             # Static data and configurations
│   │   ├── sneakerOptions.js
│   │   └── sneakerModelAssets.js
│   ├── services/         # API client
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   └── designTextures.js
│   ├── App.js
│   └── index.js
├── server/               # Express backend
│   ├── routes/
│   │   └── designs.js
│   ├── db.js
│   ├── index.js
│   └── schema.sql
└── package.json
```

## Adding 3D Models

The app supports custom 3D sneaker models. See `public/models/README.md` for instructions on:
- Downloading free models from Sketchfab
- Supported formats (.glb, .gltf)
- Configuring new models in the app

## Development

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

Frontend (optional):
```bash
REACT_APP_API_URL=http://localhost:3001
```

Backend (.env file in server/):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/sneakrlab
PORT=3001
```

## Features in Detail

### Color Customization
Uses vertex coloring for real-time 3D model updates. Each shoe is divided into zones:
- **Upper**: Main body (60% of shoe)
- **Sole**: Bottom section (25% of shoe)
- **Accent**: Details and collar (15% of shoe)

### AI Logo Generation
Generates simple canvas-based logos from text prompts. Premium users get unlimited generations.

### Design Patterns
- **Plain**: Solid color
- **Stripes**: Horizontal stripe pattern
- **Camo**: Organic camouflage pattern
- **Gradient**: Linear color gradient
- **Vintage**: Aged leather effect

## Deployment

### Frontend
```bash
npm run build
# Deploy the build/ folder to any static hosting (Vercel, Netlify, etc.)
```

### Backend
```bash
cd server
# Set DATABASE_URL environment variable
npm start
# Deploy to Heroku, Railway, or any Node.js hosting
```

## Contributing

This is a DATASTALGO project. For contributions or issues, please follow standard Git workflow.

## License

This project is for educational and demonstration purposes.

## Credits

- 3D Models: Khronos Group glTF samples, Sketchfab community
- Design: Nike-inspired color customization
- Framework: React, Three.js, Bootstrap

---

**Sneakr.lab** - Where ideas become sneakers ✨


### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
