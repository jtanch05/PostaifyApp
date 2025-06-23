/**
 * Color palette for Postify app
 * Theme: Elegant Dark Mode First
 */

export const Colors = {
  // Background colors
  background: {
    primary: '#121212',
    surface: '#1E1E1E',
  },
  
  // Text colors
  text: {
    primary: '#EAEAEA',
    secondary: '#A0A0A0',
  },
  
  // Accent colors
  accent: {
    primary: '#FF7F50', // Coral
  },
  
  // System colors
  system: {
    success: '#4CAF50',
    error: '#F44336',
  },
} as const;

export type ColorTheme = typeof Colors; 