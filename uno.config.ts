import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      cdn: 'https://esm.sh/'
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code:400,500'
      }
    })
  ],
  theme: {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
      dark: '#1F2937'
    }
  }
});