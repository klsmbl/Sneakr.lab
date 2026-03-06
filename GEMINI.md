GEMINI.md

# Sneakr.lab – AI Sneaker Customizer

## Project Overview

Sneakr.lab is a **React-based web application** that allows users to design sneakers interactively with the help of **AI-assisted logo generation and 3D visualization**.

The system demonstrates **DATASTALGO concepts** including:

* structured data handling
* conditional logic
* system flow control
* algorithm-based calculations

The application follows a **step-by-step sneaker design workflow** and includes a **subscription feature gating system**.

---

# Core System Flow

User Journey:

1. User opens Design Studio
2. User selects sneaker model
3. User selects color palette
4. User selects materials or design patterns
5. User generates AI logo suggestions
6. Logo is applied to sneaker
7. Sneaker is previewed in 3D
8. User saves design
9. Optional: user views order summary

---

# Technology Stack

Frontend

* React JS
* HTML
* CSS
* Bootstrap

3D Rendering

* Three.js
* React Three Fiber (optional)

Backend (Optional)

* Node.js
* Express

Database

* Firebase Firestore
  or
* MongoDB

AI Integration

* AI API for logo generation

Development Environment

* VS Code

---

# Application Architecture

The project follows a **component-based architecture**.

Suggested structure:

src/

components/
SneakerCustomizer.jsx
ColorSelector.jsx
MaterialSelector.jsx
LogoGenerator.jsx
ThreePreview.jsx
SaveDesignModal.jsx

pages/
Home.jsx
DesignStudio.jsx
SavedDesigns.jsx

services/
aiService.js
subscriptionService.js
designService.js

context/
DesignContext.jsx
UserContext.jsx

utils/
priceCalculator.js
featureGate.js

assets/
models/
textures/

---

# State Management

Sneaker customization state should be centralized.

Example state structure:

```
designState = {
model: "air_runner",
primaryColor: "#FF0000",
secondaryColor: "#000000",
material: "leather",
logo: "generatedLogoURL",
rotation: 0
}
```

This state should update **in real time** when the user changes design options.

Use React hooks:

* useState
* useContext
* useReducer (optional)

---

# Sneaker Customization Logic

Each customization action updates the sneaker state.

Example logic:

```
updateColor(colorType, value)
updateMaterial(material)
updateLogo(logoImage)
```

These updates should trigger **re-rendering of the 3D preview**.

---

# AI Logo Generation

Users input a text description.

Example prompt:

"minimal lightning bolt sneaker logo"

The prompt is sent to the AI API.

Example flow:

User Prompt → AI API → Generated Logos → User Selects Logo → Apply to Sneaker

AI responses should return:

```
{
logos: [
logoURL1,
logoURL2,
logoURL3
]
}
```

---

# AI Generation Limits

Free users:

* maximum 3 generations per day

Premium users:

* unlimited AI generations

Logic example:

```
if(user.subscription === "premium"){
allowAIGeneration()
}
else if(user.dailyGenerations < 3){
allowAIGeneration()
}
else{
showUpgradePrompt()
}
```

---

# 3D Sneaker Preview

Three.js is used for rendering the sneaker.

Capabilities:

* rotate sneaker
* zoom
* view logo placement
* update colors in real time

Key logic:

```
applyTextureToModel(texture)
updateSneakerColor(color)
placeLogoOnMesh(mesh)
```

---

# Save Design System

Each design contains:

```
Design {
id
userId
model
colors
material
logo
createdAt
}
```

Free users:

* save up to 2 designs

Premium users:

* unlimited saves

---

# Order Summary Logic (Optional)

Order summary is for **algorithm demonstration only**.

Example structure:

```
Order {
designId
size
quantity
basePrice
discount
totalPrice
}
```

Example calculation:

```
totalPrice = (basePrice * quantity) - discount
```

---

# Subscription Feature Gating

Features should be restricted using conditional checks.

Free user limitations:

* 1 sneaker model
* limited colors
* 3 AI generations per day
* save 2 designs
* watermark preview

Premium features:

* all sneaker models
* unlimited colors
* unlimited AI generations
* HD export
* unlimited saves
* advanced presets

---

# Firebase / MongoDB Data Structure

Users

```
{
id
email
subscription
dailyAIGenerations
createdAt
}
```

Designs

```
{
id
userId
designState
createdAt
}
```

---

# Coding Rules

Gemini should follow these rules when generating code.

1. Prefer React functional components
2. Use modular architecture
3. Avoid large monolithic files
4. Separate UI and logic
5. Use descriptive variable names
6. Use reusable components
7. Avoid unnecessary dependencies

---

# UI/UX Principles

The interface should be:

* clean
* step-based
* intuitive
* visually organized

Sections:

1. Sneaker Setup
2. Color & Material
3. AI Logo Generator
4. 3D Preview
5. Save / Export

---

# AI Behavior Instructions

When Gemini generates code for this project it should:

* prioritize React best practices
* maintain component modularity
* ensure AI calls are isolated in services
* avoid breaking the design state flow
* keep the UI responsive

---

# Developer Context

This project is being built by **computer engineering students** as part of a **DATASTALGO course**.

The focus is on demonstrating:

* data handling
* conditional logic
* algorithm flow
* AI-assisted design

The system should remain **manageable for student-level development** while still demonstrating modern web technologies.

---

# Project Goal

The goal of Sneakr.lab is to create an **AI-powered sneaker customization platform** that combines creativity with algorithmic thinking and interactive visualization.
