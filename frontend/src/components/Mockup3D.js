/**
 * Sneakr.lab - DATASTALGO
 * 3D sneaker mockup with rotation and real-time design preview
 * Updated: Mesh-based coloring only
 */

import { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { getSneakerAsset } from '../data/sneakerModelAssets';
import { getDesignTexture, getDesignOverrides } from '../utils/designTextures';

/** Target size so every model fits the viewport the same way */
const NORMALIZED_SIZE = 2;

function applyLayerColorsToScene(scene, designId, layerColors) {
  console.log('🎨 === COLOR APPLICATION START ===');
  console.log('Layer Colors:', layerColors);
  
  const texture = getDesignTexture(designId, layerColors.accent);
  const overrides = getDesignOverrides(designId, layerColors.accent);
  
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    
    // Skip Object_2 mesh
    if (child.name && child.name.toLowerCase().includes('object_2')) {
      console.log(`⏭️ Skipping mesh: "${child.name}"`);
      return;
    }
    
    // Log mesh names for debugging
    console.log(`\n📦 Found mesh: "${child.name || 'unnamed'}"`);
    
    const meshName = (child.name || '').toLowerCase();
    let targetColor = null;
    let zoneName = '';
    
    // Map mesh names to color zones - ORDER MATTERS!
    // Check most specific patterns first based on Blender hierarchy
    
    // Stitching zone: FIRST - STICHES group meshes (Plane003-012 with underscores)
    if (meshName.includes('stitch') || 
        meshName.startsWith('plane003') || 
        meshName.startsWith('plane005') || 
        meshName.startsWith('plane006') || 
        meshName.startsWith('plane007') || 
        meshName.startsWith('plane008') || 
        meshName.startsWith('plane009') || 
        meshName.startsWith('plane010') || 
        meshName.startsWith('plane011') || 
        meshName.startsWith('plane012')) {
      targetColor = layerColors.stitching;
      zoneName = 'STITCHING';
    }
    // Trim zone: Check for _rim or trim BEFORE midsole (to catch Midsole_rim)
    else if (meshName.includes('_rim') || 
             meshName.includes('trim') || 
             meshName.includes('fine leather')) {
      targetColor = layerColors.midsoleRim;
      zoneName = 'TRIM';
    }
    // Swoosh zone: Nike Logo, Air Logo - check BEFORE Main (to catch Air_Logomain)
    else if (meshName.includes('logo') || 
             meshName.includes('nike') ||
             meshName.includes('air_') ||
             meshName.includes('swoosh')) {
      targetColor = layerColors.accent;
      zoneName = 'SWOOSH';
    }
    // Outsole zone: OUTSOLE, OUTSOLE2, Plane_Material.010_0 (specific)
    else if (meshName.includes('outsole') || 
        (meshName.includes('plane') && meshName.includes('material') && meshName.includes('010_0'))) {
      targetColor = layerColors.sole;
      zoneName = 'OUTSOLE';
    }
    // Midsole zone: Midsole, MID SOLE (but not _rim)
    else if ((meshName.includes('mid') && meshName.includes('sole')) || 
             (meshName.includes('midsole') && !meshName.includes('_rim'))) {
      targetColor = layerColors.midsole;
      zoneName = 'MIDSOLE';
    }
    // Heel zone: Heel
    else if (meshName.includes('heel')) {
      targetColor = layerColors.heel;
      zoneName = 'HEEL TAB';
    } 
    // Laces zone: Lace Main
    else if (meshName.includes('lace')) {
      targetColor = layerColors.laces;
      zoneName = 'LACES';
    } 
    // Main zone: Main, Inside Fabric, TOE BOX
    else if (meshName.includes('main') || 
             meshName.includes('inside fabric') || 
             meshName.includes('toe box') ||
             meshName.includes('quarter')) {
      targetColor = layerColors.upper;
      zoneName = 'MAIN';
    } 
    // Upper zone fallback
    else if (meshName.includes('upper')) {
      targetColor = layerColors.upper;
      zoneName = 'UPPER';
    } 
    // Final default: unnamed objects go to upper color
    else {
      targetColor = layerColors.upper;
      zoneName = 'UPPER (default)';
    }
    
    console.log(`  ✅ Zone: ${zoneName}`);
    console.log(`  🎨 Color: ${targetColor}`);
    
    if (targetColor) {
      const geometry = child.geometry;
      if (geometry.attributes.position) {
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        const color = new THREE.Color(targetColor);
        
        // Apply uniform color to all vertices
        for (let i = 0; i < positions.count; i++) {
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.color.needsUpdate = true;
      }
    }
    
    // Handle both single material and material arrays
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    
    materials.forEach((mat, idx) => {
      if (!mat || typeof mat.clone !== 'function') return;
      
      const cloned = mat.clone();
      
      // Enable vertex colors
      cloned.vertexColors = true;
      
      // Apply texture if applicable
      if (texture) {
        cloned.map = texture;
        cloned.map.wrapS = cloned.map.wrapT = THREE.RepeatWrapping;
        cloned.map.needsUpdate = true;
      } else {
        cloned.map = null;
      }
      
      if (overrides.roughness !== undefined) {
        cloned.roughness = overrides.roughness;
      } else {
        cloned.roughness = 0.6;
      }
      
      cloned.metalness = 0.1;
      cloned.needsUpdate = true;
      
      // Update the material
      if (Array.isArray(child.material)) {
        child.material[idx] = cloned;
        child.material = [...child.material];
      } else {
        child.material = cloned;
      }
      
      child.material.needsUpdate = true;
    });
  });
}

function ShoeModel({ asset, modelId, designId, layerColors, logoUrl, hasWatermark }) {
  const { scene } = useGLTF(asset.url);
  const groupRef = useRef(null);

  // Store original materials to always clone from fresh source
  const originalMaterials = useRef(new Map());

  const { clonedScene, scaleFactor } = useMemo(() => {
    const s = scene.clone();
    const bbox = new THREE.Box3().setFromObject(s);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);
    s.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = NORMALIZED_SIZE / maxDim;
    
    // Store original materials
    originalMaterials.current.clear();
    s.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        originalMaterials.current.set(child, child.material.clone());
      }
    });
    
    return { clonedScene: s, scaleFactor: scale };
  }, [scene]);

  useEffect(() => {
    // Reset materials to original before applying new colors
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMat = originalMaterials.current.get(child);
        if (originalMat) {
          child.material = originalMat.clone();
        }
      }
    });
    
    applyLayerColorsToScene(clonedScene, designId, layerColors);
  }, [clonedScene, designId, layerColors]);

  const rotX = asset.rotationX ?? 0;
  
  // Find the mesh to apply the decal to (usually the upper)
  let decalMesh = null;
  clonedScene.traverse((child) => {
    if (!decalMesh && child instanceof THREE.Mesh) {
      decalMesh = child;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[rotX, asset.rotationY, 0]}
      scale={1}
    >
      <group scale={scaleFactor}>
        <primitive object={clonedScene} />
        {logoUrl && decalMesh && (
          <LogoDecal mesh={decalMesh} logoUrl={logoUrl} scaleFactor={scaleFactor} />
        )}
      </group>
      {hasWatermark && (
        <mesh position={[0, 0.15 * scaleFactor, 0.25 * scaleFactor]}>
          <planeGeometry args={[0.4, 0.1]} />
          <meshBasicMaterial color="#fff" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
}

function LogoDecal({ mesh, logoUrl }) {
  const texture = useTexture(logoUrl);
  return (
    <Decal
      mesh={mesh}
      position={[0.3, 0.4, 0.2]} // Approximate position for side logo
      rotation={[0, 0, 0]}
      scale={[0.3, 0.3, 0.3]}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </Decal>
  );
}

function Scene({ modelId, designId, layerColors, logoUrl, showWatermark }) {
  const asset = getSneakerAsset(modelId);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#888" wireframe />
          </mesh>
        }
      >
        <ShoeModel
          asset={asset}
          modelId={modelId}
          designId={designId}
          layerColors={layerColors}
          logoUrl={logoUrl}
          hasWatermark={showWatermark}
        />
      </Suspense>
      <OrbitControls
        enablePan
        enableRotate
        enableZoom
        screenSpacePanning
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
      <Environment preset="studio" />
    </>
  );
}

export function Mockup3D({ onCaptureReady, minimal = false, embedded = false }) {
  const { design } = useDesign();
  const { canRemoveWatermark } = useSubscription();
  const showWatermark = false;
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Expose capture function via callback
  useEffect(() => {
    if (onCaptureReady && canvasRef.current) {
      const captureImage = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current.querySelector('canvas');
          if (canvas) {
            return canvas.toDataURL('image/png');
          }
        }
        return null;
      };
      onCaptureReady(captureImage);
    }
  }, [onCaptureReady]);

  const stage = (
    <>
      <div
        ref={(el) => {
          containerRef.current = el;
          canvasRef.current = el;
        }}
        className={`rounded overflow-hidden d-flex align-items-center justify-content-center mockup3d-stage ${minimal ? 'mockup3d-stage--minimal' : ''}`}
        style={{ height: minimal ? 500 : 320 }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      >
        <Canvas
          camera={{ position: [1.8, 1, 1.8], fov: 42 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <Suspense fallback={null} key={design.modelId}>
            <Scene
              modelId={design.modelId}
              designId={design.designId}
              layerColors={design.layerColors}
              logoUrl={design.logoUrl}
              showWatermark={showWatermark}
            />
          </Suspense>
        </Canvas>
      </div>

      {showWatermark && (
        <p className="text-muted small mt-2 mb-0">
          Watermark removed for premium users.
        </p>
      )}
    </>
  );

  if (embedded) {
    return stage;
  }

  return (
    <section className={`card shadow-sm mb-4 ${minimal ? 'customizer-panel-card customizer-panel-card--minimal' : ''}`}>
      <div className="card-body">
        {!minimal && (
          <>
            <h2 className="h5 mb-3">3D Preview</h2>
            <p className="text-muted small mb-3">
              Rotate the shoe to view your custom design from all angles. All layer colors update in real-time.
            </p>
          </>
        )}

        {stage}
      </div>
    </section>
  );
}


