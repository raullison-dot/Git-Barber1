import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Isso garante que process.env funcione, mas recomenda-se usar import.meta.env no Vite
    'process.env': process.env
  }
});