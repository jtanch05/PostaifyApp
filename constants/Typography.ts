/**
 * Typography system for Postify app
 * Font Family: Poppins
 * System: 8pt grid system
 */

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  
  // Type scale
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 12,
  },
  
  // Font weights
  fontWeight: {
    h1: '700',
    h2: '600',
    h3: '500',
    body: '400',
    caption: '400',
  },
  
  // Complete text styles
  styles: {
    h1: {
      fontSize: 32,
      fontFamily: 'Poppins_700Bold',
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Poppins_600SemiBold',
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Poppins_500Medium',
      fontWeight: '500' as const,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Poppins_400Regular',
      fontWeight: '400' as const,
    },
  },
} as const;

export type TypographyTheme = typeof Typography; 