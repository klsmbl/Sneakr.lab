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

function getNodePathNames(node) {
  const names = [];
  let current = node;
  while (current) {
    if (current.name) names.push(current.name.toLowerCase());
    current = current.parent;
  }
  return names;
}

function normalizeGroupName(name) {
  return (name || '').toLowerCase().replace(/[\s._-]+/g, '');
}

function getJordanTopGroupFromPath(node) {
  const pathNorm = getNodePathNames(node).map(normalizeGroupName);
  const knownTopGroups = new Set([
    'accent',
    'accent2',
    'backtop',
    'backtop001',
    'logo',
    'logo001',
    'midsole',
    'midsole001',
    'outsole',
    'shoelace',
    'shoelace001',
    'stiching',
    'stitching',
    'trim',
    'upper',
  ]);

  for (const name of pathNorm) {
    if (knownTopGroups.has(name)) {
      return name;
    }
  }

  return '';
}

function getMeshZoneMapping(node, modelId) {
  const meshName = (node?.name || '').toLowerCase();

  /**
   * Jordan 1 mapping uses exact top-level groups under RootNode:
   * Accent, Accent2, Back Top.001, Logo.001, Outsole, Shoelace.001,
   * Stiching, Trim, Upper
   */
  if (modelId === 'jordan1') {
    const pathNorm = getNodePathNames(node).map(normalizeGroupName);
    const fullPath = pathNorm.join(' -> ');

    // Resolve by nearest ancestor group from mesh up to root.
    for (const group of pathNorm) {
      if (group.startsWith('trim')) {
        console.log(`✅ TRIM: ${meshName} (path: ${fullPath})`);
        return { color: 'midsoleRim', zoneName: 'TRIM' };
      }
      if (group.startsWith('stiching') || group.startsWith('stitching')) {
        console.log(`✅ STITCHING: ${meshName} (path: ${fullPath})`);
        return { color: 'stitching', zoneName: 'STITCHING' };
      }
      if (group.startsWith('shoelace')) {
        console.log(`✅ LACES: ${meshName} (path: ${fullPath})`);
        return { color: 'laces', zoneName: 'LACES' };
      }
      if (group.startsWith('logo')) {
        console.log(`✅ LOGO: ${meshName} (path: ${fullPath})`);
        return { color: 'logo', zoneName: 'LOGO' };
      }
      if (group.startsWith('accent2') || group.startsWith('accent')) {
        console.log(`✅ ACCENT: ${meshName} (path: ${fullPath})`);
        return { color: 'accent', zoneName: 'ACCENT' };
      }
      if (group.startsWith('outsole')) {
        console.log(`✅ OUTSOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'sole', zoneName: 'SOLE' };
      }
      if (group.startsWith('midsole')) {
        console.log(`✅ MIDSOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'midsole', zoneName: 'MIDSOLE' };
      }
      if (group.startsWith('backtop') || group.startsWith('upper')) {
        if (meshName.includes('main') && meshName.includes('sole')) {
          console.log(`✅ MIDSOLE (via name): ${meshName} (path: ${fullPath})`);
          return { color: 'midsole', zoneName: 'MIDSOLE' };
        }
        console.log(`✅ UPPER (hierarchy): ${meshName} (path: ${fullPath})`);
        return { color: 'upper', zoneName: 'UPPER' };
      }
    }

    // Name fallbacks only when hierarchy groups are unavailable.
    const meshNameNoSuffix = meshName.replace(/_[a-z0-9]+$/, ''); // Remove trailing _E_0, _001, etc.
    const meshNameNormalized = meshNameNoSuffix.replace(/[\s._-]+/g, ''); // Remove all separators
    
    // Outsole-specific meshes FIRST (circle, tubes are ONLY in outsole)
    if (meshName.includes('circle') || meshName.includes('tube')) {
      console.log(`✅ OUTSOLE (fallback - circle/tube): ${meshName} (path: ${fullPath})`);
      return { color: 'sole', zoneName: 'SOLE' };
    }
    
    if (meshNameNormalized.includes('undersoleplate')) {
      console.log(`✅ OUTSOLE (fallback - undersoleplate): ${meshName} (path: ${fullPath})`);
      return { color: 'sole', zoneName: 'SOLE' };
    }
    
    // Midsole fallback only for very specific names
    if (meshName.includes('main') && meshName.includes('sole')) {
      console.log(`✅ MIDSOLE (fallback - main sole): ${meshName} (path: ${fullPath})`);
      return { color: 'midsole', zoneName: 'MIDSOLE' };
    }
    if (meshName.includes('seam')) {
      console.log(`✅ STITCHING (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'stitching', zoneName: 'STITCHING' };
    }
    if (meshName.includes('shoelace') || meshName.includes('lace')) {
      console.log(`✅ LACES (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'laces', zoneName: 'LACES' };
    }
    if (meshName.includes('logo') || meshName.includes('nike')) {
      console.log(`✅ LOGO (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'logo', zoneName: 'LOGO' };
    }
    if (meshName.includes('label') || meshName.includes('insert')) {
      console.log(`✅ ACCENT (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'accent', zoneName: 'ACCENT' };
    }
    if (meshName.includes('trim')) {
      console.log(`✅ TRIM (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'midsoleRim', zoneName: 'TRIM' };
    }

    console.log(`⚠️ UPPER (default): ${meshName} (path: ${fullPath})`);
    return { color: 'upper', zoneName: 'UPPER' };
  }
  
  /**
   * Nike Air Zoom Alphafly Mapping
   */
  if (modelId === 'nike-alphafly') {
    const pathNorm = getNodePathNames(node).map(normalizeGroupName);
    const fullPath = pathNorm.join(' -> ');

    for (const group of pathNorm) {
      if (group.startsWith('logo')) {
        console.log(`✅ LOGO: ${meshName} (path: ${fullPath})`);
        return { color: 'accent', zoneName: 'LOGO' };
      }
      if (group.startsWith('laces')) {
        console.log(`✅ LACES: ${meshName} (path: ${fullPath})`);
        return { color: 'laces', zoneName: 'LACES' };
      }
      if (group.startsWith('accent')) {
        console.log(`✅ ACCENT: ${meshName} (path: ${fullPath})`);
        return { color: 'midsoleRim', zoneName: 'ACCENT' };
      }
      if (group.startsWith('outsole')) {
        console.log(`✅ SOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'sole', zoneName: 'SOLE' };
      }
      if (group.startsWith('sole')) {
        console.log(`✅ SOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'sole', zoneName: 'SOLE' };
      }
      if (group.startsWith('tongue')) {
        console.log(`✅ TONGUE: ${meshName} (path: ${fullPath})`);
        return { color: 'stitching', zoneName: 'TONGUE' };
      }
      if (group.includes('main') || group.includes('upper')) {
        console.log(`✅ UPPER: ${meshName} (path: ${fullPath})`);
        return { color: 'upper', zoneName: 'UPPER' };
      }
    }

    // Fallback name matching
    if (meshName.includes('logo') || meshName.includes('nike')) {
      console.log(`✅ LOGO (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'accent', zoneName: 'LOGO' };
    }
    if (meshName.includes('lace')) {
      console.log(`✅ LACES (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'laces', zoneName: 'LACES' };
    }
    if (meshName.includes('tongue')) {
      console.log(`✅ TONGUE (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'stitching', zoneName: 'TONGUE' };
    }

    console.log(`⚠️ UPPER (default): ${meshName} (path: ${fullPath})`);
    return { color: 'upper', zoneName: 'UPPER' };
  }

  /**
   * Converse Chuck Taylor Mapping
   */
  if (modelId === 'converse-chuck') {
    const pathNorm = getNodePathNames(node).map(normalizeGroupName);
    const fullPath = pathNorm.join(' -> ');

    for (const group of pathNorm) {
      if (group.includes('leathermain')) {
        console.log(`✅ LEATHER_MAIN: ${meshName} (path: ${fullPath})`);
        return { color: 'LEATHER_MAIN', zoneName: 'LEATHER_MAIN' };
      }
      if (group.includes('eyelets')) {
        console.log(`✅ EYELETS: ${meshName} (path: ${fullPath})`);
        return { color: 'EYELETS', zoneName: 'EYELETS' };
      }
      if (group.includes('heelcap')) {
        console.log(`✅ HEELCAP: ${meshName} (path: ${fullPath})`);
        return { color: 'HEELCAP', zoneName: 'HEELCAP' };
      }
      if (group.includes('insole')) {
        console.log(`✅ INSOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'INSOLE', zoneName: 'INSOLE' };
      }
      if (group.includes('laces')) {
        console.log(`✅ LACES: ${meshName} (path: ${fullPath})`);
        return { color: 'LACES', zoneName: 'LACES' };
      }
      if (group.includes('midsole')) {
        console.log(`✅ MIDSOLE.001: ${meshName} (path: ${fullPath})`);
        return { color: 'MIDSOLE.001', zoneName: 'MIDSOLE.001' };
      }
      if (group.includes('outersole')) {
        console.log(`✅ OUTERSOLE: ${meshName} (path: ${fullPath})`);
        return { color: 'OUTERSOLE', zoneName: 'OUTERSOLE' };
      }
      if (group.includes('stitches') || group.includes('stitching')) {
        console.log(`✅ STITCHES: ${meshName} (path: ${fullPath})`);
        return { color: 'STITCHES', zoneName: 'STITCHES' };
      }
      if (group.includes('tags')) {
        console.log(`✅ TAGS: ${meshName} (path: ${fullPath})`);
        return { color: 'TAGS', zoneName: 'TAGS' };
      }
      if (group.includes('toetip')) {
        console.log(`✅ TOETIP: ${meshName} (path: ${fullPath})`);
        return { color: 'TOETIP', zoneName: 'TOETIP' };
      }
      if (group.includes('tongue')) {
        console.log(`✅ TONGUE: ${meshName} (path: ${fullPath})`);
        return { color: 'TONGUE', zoneName: 'TONGUE' };
      }
    }

    // Fallback name matching for converse
    if (meshName.includes('leathermain')) {
      console.log(`✅ LEATHER_MAIN (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'LEATHER_MAIN', zoneName: 'LEATHER_MAIN' };
    }
    if (meshName.includes('eyelet')) {
      console.log(`✅ EYELETS (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'EYELETS', zoneName: 'EYELETS' };
    }
    if (meshName.includes('heel')) {
      console.log(`✅ HEELCAP (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'HEELCAP', zoneName: 'HEELCAP' };
    }
    if (meshName.includes('insole')) {
      console.log(`✅ INSOLE (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'INSOLE', zoneName: 'INSOLE' };
    }
    if (meshName.includes('lace')) {
      console.log(`✅ LACES (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'LACES', zoneName: 'LACES' };
    }
    if (meshName.includes('midsole')) {
      console.log(`✅ MIDSOLE.001 (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'MIDSOLE.001', zoneName: 'MIDSOLE.001' };
    }
    if (meshName.includes('sole')) {
      console.log(`✅ OUTERSOLE (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'OUTERSOLE', zoneName: 'OUTERSOLE' };
    }
    if (meshName.includes('stitch')) {
      console.log(`✅ STITCHES (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'STITCHES', zoneName: 'STITCHES' };
    }
    if (meshName.includes('tag')) {
      console.log(`✅ TAGS (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'TAGS', zoneName: 'TAGS' };
    }
    if (meshName.includes('toe')) {
      console.log(`✅ TOETIP (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'TOETIP', zoneName: 'TOETIP' };
    }
    if (meshName.includes('tongue')) {
      console.log(`✅ TONGUE (fallback): ${meshName} (path: ${fullPath})`);
      return { color: 'TONGUE', zoneName: 'TONGUE' };
    }

    console.log(`⚠️ LEATHER_MAIN (default): ${meshName} (path: ${fullPath})`);
    return { color: 'LEATHER_MAIN', zoneName: 'LEATHER_MAIN (default)' };
  }
  
  /**
   * Air Force / Standard Model Mapping
   */
  // Stitching zone
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
    return { color: 'stitching', zoneName: 'STITCHING' };
  }
  // Trim zone
  if (meshName.includes('_rim') || 
      meshName.includes('trim') || 
      meshName.includes('fine leather')) {
    return { color: 'midsoleRim', zoneName: 'TRIM' };
  }
  // Swoosh / Logo
  if (meshName.includes('logo') || 
      meshName.includes('nike') ||
      meshName.includes('air_') ||
      meshName.includes('swoosh')) {
    return { color: 'accent', zoneName: 'SWOOSH' };
  }
  // Outsole
  if (meshName.includes('outsole') || 
      (meshName.includes('plane') && meshName.includes('material') && meshName.includes('010_0'))) {
    return { color: 'sole', zoneName: 'OUTSOLE' };
  }
  // Midsole
  if ((meshName.includes('mid') && meshName.includes('sole')) || 
      (meshName.includes('midsole') && !meshName.includes('_rim'))) {
    return { color: 'midsole', zoneName: 'MIDSOLE' };
  }
  // Heel
  if (meshName.includes('heel')) {
    return { color: 'heel', zoneName: 'HEEL TAB' };
  }
  // Laces
  if (meshName.includes('lace')) {
    return { color: 'laces', zoneName: 'LACES' };
  }
  // Main / Upper
  if (meshName.includes('main') || 
      meshName.includes('inside fabric') || 
      meshName.includes('toe box') ||
      meshName.includes('quarter') ||
      meshName.includes('upper')) {
    return { color: 'upper', zoneName: 'UPPER' };
  }
  
  // Default
  return { color: 'upper', zoneName: 'UPPER (default)' };
}

function applyLayerColorsToScene(scene, designId, layerColors, modelId = 'airforce') {
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
    
    const mapping = getMeshZoneMapping(child, modelId);
    const targetColor = layerColors[mapping.color];
    const zoneName = mapping.zoneName;
    
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
    
    // Store original materials and de-share geometry so zone colors don't bleed
    // across meshes that reuse the same underlying BufferGeometry.
    originalMaterials.current.clear();
    s.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry = child.geometry.clone();
        }
        if (child.material) {
          originalMaterials.current.set(child, child.material.clone());
        }
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
    
    applyLayerColorsToScene(clonedScene, designId, layerColors, modelId);
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


