# 3D Sneaker Models

This folder contains 3D models (.glb/.gltf files) for the sneaker customizer.

## Default Models

The app comes with two default models that load from external URLs:
- **Classic Low** (MaterialsVariantsShoe.glb) - Loaded from Khronos glTF samples
- **Runner Pro** (shoe.gltf) - Loaded from ui-code-tv GitHub

## Adding Custom Models

To add your own sneaker 3D models:

1. **Find Models**: Search on [Sketchfab](https://sketchfab.com/) for "sneaker downloadable" or "shoe" with filters:
   - File format: glTF (.glb or .gltf)
   - License: Creative Commons or free to use

2. **Download Recommended Models**:
   - [New Balance 574 Classic](https://sketchfab.com/3d-models/used-new-balance-574-classic-free-f0aad4f64925479da3f607b186314eef)
   - [Sport Sneakers](https://sketchfab.com/3d-models/sport-sneakers-6e5bb23816294d4a994e44d03e6a2c1a)
   - [Simple Slip-On Shoes](https://sketchfab.com/3d-models/simple-slip-on-shoes-downloadable)

3. **Place Files**: Save downloaded .glb or .gltf files in this folder:
   ```
   public/models/
   ├── new-balance-574.glb
   ├── sport-sneakers.glb
   └── slip_ons.gltf
   ```

4. **Models Are Already Configured**: The app is already set up to use these models in `src/data/sneakerModelAssets.js`

## Model Requirements

- Format: .glb (single file) or .gltf (with textures)
- Size: Keep under 10MB for good performance
- For best results, use models that support material customization

## Notes

- Some premium models are configured but won't work until you download the files
- Free users can only select "Classic Low" and "New Balance 574"
- Premium users can access all models
