# Sneakr.lab - Quick Setup Guide

## ✅ What's Been Integrated

The shoe creation feature from `sneakr-lab` has been fully integrated into `Sneakr.lab` as the main project. Here's what's included:

### Features Integrated:
✅ Landing page with navigation to customizer
✅ 3D sneaker customization with Three.js
✅ Nike-style multi-zone color customization (upper, sole, accents)
✅ Multiple sneaker models (11 total, 2 free)
✅ AI-powered logo generation
✅ Design patterns (Plain, Stripes, Camo, Gradient, Vintage)
✅ Save/Load designs with PostgreSQL backend
✅ Free vs Premium tier system
✅ Real-time 3D preview with rotation
✅ Order summary and export features
✅ Bootstrap 5 UI components

## 🚀 Quick Start

### 1. Install Dependencies (Already Done!)
```bash
npm install
```

### 2. Start the Frontend
```bash
npm start
```

The app will open at http://localhost:3000

### 3. Navigate the App
- **Landing Page**: Click "Get Started" button
- **Customizer**: Design your sneaker with:
  - Sneaker model selection
  - Multi-zone color picker
  - AI logo generator
  - 3D preview (drag to rotate)
  - Save/Export options

### 4. Test Premium Features
Toggle between Free/Premium using the subscription toggle in the top-right of the customizer page.

## 🗄️ Optional: Backend Setup

To enable Save/Load features:

### 1. Install PostgreSQL
Download from: https://www.postgresql.org/download/

### 2. Create Database
```bash
createdb sneakrlab
```

### 3. Setup Server
```bash
cd server
npm install
cp .env.example .env
```

### 4. Edit server/.env
```
DATABASE_URL=postgresql://localhost:5432/sneakrlab
```

### 5. Initialize Database
```bash
psql $DATABASE_URL -f schema.sql
```

### 6. Start Server
```bash
npm start
```

Server runs on http://localhost:3001

## 📁 Project Structure

```
Sneakr.lab/                    ← Main project (this is your primary project now)
├── src/
│   ├── components/            ← All shoe customization components
│   │   ├── LandingPage.js
│   │   ├── CustomizerPage.js  ← Main customizer interface
│   │   ├── ColorCustomizer.js ← Nike-style color zones
│   │   ├── Mockup3D.js        ← 3D rendering with Three.js
│   │   └── ...
│   ├── context/               ← Design & subscription state
│   ├── data/                  ← Sneaker models & color options
│   ├── services/              ← API client
│   └── utils/                 ← Design textures & utilities
├── server/                    ← Express backend (optional)
└── public/models/             ← 3D sneaker models

sneakr-lab/                    ← Reference project (you can keep or delete)
```

## 🎨 How to Use

### Basic Customization:
1. **Select Model**: Choose from available sneaker models
2. **Choose Colors**: Click on zones (Upper, Sole, Accents) and pick colors
3. **Add Design**: Apply patterns like Stripes or Camo
4. **Generate Logo**: Use AI to create a logo from text
5. **Preview**: Rotate the 3D model to see all angles

### Advanced Features (Premium):
- 11+ sneaker models vs 2 free models
- 15+ colors vs 5 free colors
- Unlimited AI generations vs 3/day
- Save unlimited designs vs 2 max
- Export HD mockups
- Remove watermark

## 🔧 Customization

### Add More Colors
Edit `src/data/sneakerOptions.js`:
```javascript
export const PREMIUM_COLORS = [
  ...FREE_COLORS,
  '#YourColor', // Add new color hex codes
];
```

### Add 3D Models
1. Download .glb files from Sketchfab
2. Place in `public/models/`
3. Configure in `src/data/sneakerModelAssets.js`

See `public/models/README.md` for detailed instructions.

## 📱 Testing

### Free Tier:
- Can select: Classic Low, New Balance 574
- Can use: 5 colors (Black, White, Red, Blue, Green)
- Can generate: 3 AI logos per day
- Can save: 2 designs

### Premium Tier:
- All 11+ sneaker models
- All 15+ colors
- Unlimited AI generations
- Unlimited saves
- HD export enabled

## 🐛 Troubleshooting

### "Server not running" error when saving:
- Start the backend server: `cd server && npm start`
- Or ignore if you don't need save functionality

### 3D model not loading:
- Check browser console for errors
- Ensure you have a stable internet connection (some models load from CDN)
- Try downloading models locally (see public/models/README.md)

### Colors not updating:
- Ensure you're clicking on the color zone button first
- Then click on a color swatch
- The 3D preview updates in real-time

## 📚 Next Steps

1. ✅ Test the customizer at http://localhost:3000
2. ⚙️ (Optional) Set up PostgreSQL backend for save/load
3. 🎨 Download additional 3D models from Sketchfab
4. 🚀 Customize colors, models, and features to your needs
5. 📦 Build for production: `npm run build`

## 🎯 Key Files to Know

- `src/App.js` - Main router
- `src/components/CustomizerPage.js` - Customizer layout
- `src/components/Mockup3D.js` - 3D rendering logic
- `src/context/DesignContext.js` - Design state management
- `src/data/sneakerOptions.js` - Models, colors, patterns
- `server/index.js` - Backend API (optional)

## 💡 Tips

- **Free models work immediately** - Classic Low and New Balance 574 are configured
- **Premium models need downloads** - See public/models/DOWNLOAD-INSTRUCTIONS.txt
- **Toggle subscription anytime** - Use the toggle in the customizer header
- **Designs work without backend** - Save/load requires server setup
- **3D preview is interactive** - Drag to rotate, scroll to zoom

---

**You're all set! 🎉**

Your Sneakr.lab project now has full shoe customization features integrated.
Start the app with `npm start` and click "Get Started" to begin designing!
