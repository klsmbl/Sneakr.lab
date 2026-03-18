/**
 * Sneakr.lab - DATASTALGO
 * Design state: sneaker model, layer colors, design, logo
 */

import { createContext, useContext, useState, useCallback } from 'react';

const DEFAULT_LAYER_COLORS = {
  upper: '#FFFFFF',
  sole: '#FFFFFF',
  midsole: '#FFFFFF',
  midsoleRim: '#FFFFFF',
  laces: '#FFFFFF',
  toe: '#FFFFFF',
  logo: '#FFFFFF',
  tongue: '#FFFFFF',
  swoosh: '#FFFFFF',
  accent: '#FFFFFF',
  stitching: '#FFFFFF',
  // Converse color zones
  LEATHER_MAIN: '#FFFFFF',
  EYELETS: '#FFFFFF',
  HEELCAP: '#FFFFFF',
  INSOLE: '#FFFFFF',
  LACES: '#FFFFFF',
  'MIDSOLE.001': '#FFFFFF',
  OUTERSOLE: '#FFFFFF',
  STITCHES: '#FFFFFF',
  TAGS: '#FFFFFF',
  TOETIP: '#FFFFFF',
  TONGUE: '#FFFFFF',
};

const DEFAULT_DESIGN = {
  modelId: 'airforce',
  modelName: 'AirForce 1',
  accentColor: '#FFFFFF',
  layerColors: DEFAULT_LAYER_COLORS,
  designId: 'plain',
  designName: 'Plain',
  logoUrl: null,
  logoPrompt: '',
};

const DesignContext = createContext(null);

export function DesignProvider({ children }) {
  const [design, setDesignState] = useState(() => {
    const storedModelId = localStorage.getItem('sneakr_selected_model');
    const storedModelName = localStorage.getItem('sneakr_selected_model_name');
    return {
      ...DEFAULT_DESIGN,
      modelId: storedModelId || DEFAULT_DESIGN.modelId,
      modelName: storedModelName || DEFAULT_DESIGN.modelName,
    };
  });

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

  const setLogo = useCallback((logoUrl, logoPrompt) => {
    setDesignState((d) => ({ ...d, logoUrl, logoPrompt }));
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
    setLogo,
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
