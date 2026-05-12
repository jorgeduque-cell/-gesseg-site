import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Convierte sintaxis simple markdown inline en HTML.
// Esto permite que el cliente solo escriba *palabra* o **palabra** en el panel
// CMS sin tener que tocar HTML como <em> o <strong>.
//   **texto** → <strong>texto</strong>
//   *texto*   → <em>texto</em>
function markdownInline(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
}

// Aplica markdownInline recursivamente sobre strings dentro de un objeto/array.
function transformContent(value) {
  if (typeof value === 'string') return markdownInline(value);
  if (Array.isArray(value)) return value.map(transformContent);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = transformContent(value[k]);
    return out;
  }
  return value;
}

const loadContent = () => {
  const raw = yaml.load(readFileSync(resolve(__dirname, 'content/site.yml'), 'utf-8'));
  return transformContent(raw);
};

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
