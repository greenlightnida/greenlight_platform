/**
 * Custom Hook: useTooltipPosition
 * Extracted from PlayerGrid.tsx for better organization
 */

import { useState, useCallback } from 'react';
import { TooltipPosition } from './types';

export const useTooltipPosition = () => {
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  
  const calculatePosition = useCallback((event: React.MouseEvent) => {
    const tooltipWidth = 256;
    const tooltipHeight = 200;
    const padding = 20;
    
    let x = event.clientX + 10;
    let y = event.clientY - 10;
    
    // Adjust horizontal position if tooltip would go off-screen
    if (x + tooltipWidth > window.innerWidth - padding) {
      x = event.clientX - tooltipWidth - 10;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    if (y - tooltipHeight < padding) {
      y = event.clientY + 10;
    }
    
    setPosition({ x, y });
  }, []);
  
  return { position, calculatePosition };
}; 