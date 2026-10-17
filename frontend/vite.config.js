import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' keeps asset URLs relative so the built app works when served from
// any sub-folder (e.g. XAMPP htdocs/.../frontend/dist) instead of only the domain root.
export default defineConfig({ plugins: [react()], base: './' });
