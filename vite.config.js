import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

const loadContent = () =>
  yaml.load(readFileSync(resolve(__dirname, 'content/site.yml'), 'utf-8'));

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: '/index.html',
    host: true
  },
  plugins: [
    handlebars({
      context: loadContent(),
      reloadOnPartialChange: true
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        nosotros: 'nosotros.html',
        servicios: 'servicios.html',
        contacto: 'contacto.html',
        privacidad: 'politica-privacidad.html',
        tratamiento: 'tratamiento-datos.html',
        notFound: '404.html'
      }
    }
  }
});
