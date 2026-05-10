import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: '/index.html',
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        nosotros: 'nosotros.html',
        servicios: 'servicios.html',
        sectores: 'sectores.html',
        contacto: 'contacto.html',
        privacidad: 'politica-privacidad.html',
        tratamiento: 'tratamiento-datos.html',
        notFound: '404.html'
      }
    }
  }
});
