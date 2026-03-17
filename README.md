# Sneakr.lab - AI Sneaker Customizer

**Sneakr.lab** is a web-based sneaker customization platform that combines **AI-assisted logo generation** with **real-time 3D visualization**. This project demonstrates DATASTALGO concepts through structured data handling, algorithm-based calculations, and a subscription-based feature gating system.

![Sneakr.lab](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-19.2.4-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black.svg)
![PayPal](https://img.shields.io/badge/Payments-PayPal_Sandbox-blue.svg)

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** and **npm**
- **PayPal Sandbox Account** (for testing payments)

### One-Time Setup
Run the following command from the **root directory** to install all dependencies for the frontend and backend:
```bash
npm run install:all
```

### Starting the Project
To start both the **frontend** and **backend** servers concurrently, run:
```bash
npm start
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🎨 Key Features

### 1. Real-Time 3D Customizer
- **Interactive 3D Preview**: Rotate, zoom, and view your sneaker design in real-time.
- **Layer-Based Coloring**: Customize individual shoe parts (Upper, Sole, Accents, etc.) using Nike-style vertex coloring.
- **3D Capture**: Snap a screenshot of your 3D design for export or virtual try-on.

### 2. Subscription & PayPal Integration
- **Feature Gating**: Access depends on your subscription tier (Free vs. Premium).
- **Official PayPal SDK**: Secure payment processing via PayPal Sandbox.
- **Automated Upgrades**: Real-time account status updates upon successful payment.

### 3. AI Logo Generator (Planned/Integrated)
- Generate unique sneaker logos using AI prompts.
- Apply generated textures directly to the 3D shoe model.

---

## 💎 Subscription Tiers

| Feature | Free Tier | Premium Tier |
| :--- | :--- | :--- |
| **Models** | 1 Classic Model | All Sneaker Models |
| **Colors** | Limited Palette | Unlimited Colors |
| **AI Generations** | 3 per Day | Unlimited |
| **Design Saves** | Up to 2 Designs | Unlimited Saves |
| **Export** | Standard Quality | HD Export (No Watermark) |
| **Price** | $0 | $9.99/mo or $99.99/yr |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7, Bootstrap 5, Lucide Icons
- **3D Engine**: Three.js, React Three Fiber (R3F), Drei
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Payments**: PayPal JavaScript SDK (`@paypal/react-paypal-js`)
- **State**: React Context API (User, Design, and Subscription contexts)

---

## 📂 Project Structure

```
Sneakr.lab/
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # UI Components (Customizer, Payment, etc.)
│   │   ├── context/      # Subscription & User State
│   │   ├── services/     # API Client (PayPal, Auth, Designs)
│   │   └── pages/        # Full-page views (WhoAreWe, Policies)
├── server/               # Node.js Express Backend
│   ├── routes/           # API Endpoints (Auth, Payments, Designs)
│   ├── sneakrlab.db      # SQLite Database
│   └── index.js          # Server Entry Point
├── package.json          # Root orchestration (Concurrent startup)
└── README.md             # This file
```

---

## 🧪 Testing Payments (PayPal Sandbox)

To test the premium upgrade:
1. Sign in or Sign up at `/signin`.
2. Click **"Upgrade to Premium"** in the navigation bar.
3. Select a plan and use a **PayPal Sandbox Buyer account** (e.g., `sb-mock@paypal.com`) to complete the transaction.
4. Your account will automatically upgrade to **Premium** status.

---

## 📜 License
This project is built by computer engineering students for the **DATASTALGO** course. For educational purposes only.

**Sneakr.lab** - *Where ideas become sneakers ✨*
