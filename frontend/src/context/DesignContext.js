/**
 * Sneakr.lab - DATASTALGO
 * Design state: sneaker model, layer colors, design, logo
 */

import { createContext, useContext, useState, useCallback } from 'react';

const DEFAULT_LAYER_COLORS = {
  upper: '#FFFFFF',
  sole: '#FFFFFF',
  laces: '#FFFFFF',
  toe: '#FFFFFF',
  heel: '#FFFFFF',
  tongue: '#FFFFFF',
  swoosh: '#FFFFFF',
  accent: '#FFFFFF',
};

const DEFAULT_DESIGN = {
  modelId: 'classic-1',
  modelName: 'Classic Low',
  accentColor: '#FFFFFF',
  layerColors: DEFAULT_LAYER_COLORS,
  designId: 'plain',
  designName: 'Plain',
};

const DesignContext = createContext(null);

export function DesignProvider({ children }) {
  const [design, setDesignState] = useState(DEFAULT_DESIGN);

  const setModel = useCallback((modelId, modelName) => {
    setDesignState((d) => ({ ...d, modelId, modelName }));
  }, []);

  const setAccentColor = useCallback((accentColor) => {
    setDesignState((d) => ({ ...d, accentColor }));
  }, []);

  const setLayerColor = useCallback((part, color) => {
    setDesignState((d) => ({
      ...d,
      layerColors: { ...d.layerColors, [part]: color },
    }));
  }, []);

  const setDesign = useCallback((designId, designName) => {
    setDesignState((d) => ({ ...d, designId, designName }));
  }, []);

  const resetDesign = useCallback(() => {
    setDesignState(DEFAULT_DESIGN);
  }, []);

  const value = {
    design,
    setModel,
    setAccentColor,
    setLayerColor,
    setDesign,
    resetDesign,
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be used within DesignProvider');
  return ctx;
}
