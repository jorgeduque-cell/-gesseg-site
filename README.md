# GESSEG Colombia S.A.S — Sitio Web

Sitio multi-página estático para GESSEG Colombia S.A.S, especializado en Seguridad y Salud en el Trabajo (SST).

## Estructura

```
gesseg-site/
├── index.html        ← Inicio
├── nosotros.html     ← Quiénes somos / valores / equipo / marco normativo
├── servicios.html    ← Catálogo de servicios + metodología
├── sectores.html     ← Industrias atendidas + clasificación de riesgo
├── contacto.html     ← Formulario + datos de contacto + FAQ
├── styles.css        ← Sistema de diseño completo (compartido)
├── script.js         ← Menú móvil + animaciones + counters
└── README.md
```

## Stack

- HTML5 + CSS moderno (variables, grid, container queries no necesarios)
- JS vanilla (sin frameworks ni build steps)
- Tipografía Google Fonts: **Fraunces** (display) + **Geist** (body)
- Sin dependencias, sin build, listo para subir tal cual a cualquier hosting

## Cómo verlo localmente

Abrir `index.html` directamente en el navegador, o servirlo:

```bash
cd gesseg-site
python3 -m http.server 8000
# Abrir http://localhost:8000
```

## Para publicar

Cualquier hosting estático sirve: **Netlify**, **Vercel**, **Cloudflare Pages**, **GitHub Pages**, o un hosting tradicional vía FTP. Solo subir los archivos de la carpeta tal cual.

## Personalizar

### 1. Datos de contacto
Buscar y reemplazar en todos los `.html`:
- `+57 310 770 2418` → teléfono real
- `contacto@gesseg.com.co` → correo real
- `Bogotá D.C., Colombia` → dirección real
- `Calle [pendiente]` → dirección física en `contacto.html`

### 2. Logo
El logo actual es solo tipografía (la "G" en cuadro azul). Para usar el logo real:
- Reemplazar el bloque `<span class="brand-mark">G</span>` por `<img src="logo.svg" alt="GESSEG" style="width:42px; height:42px;">`
- Subir el archivo `logo.svg` o `logo.png` a la carpeta del sitio

### 3. Estadísticas (home)
En `index.html`, sección `.stats`, ajustar los valores de `data-count` con cifras reales de la empresa:
```html
<span class="stat-num"><span data-count="120">0</span><sup>+</sup></span>
```

### 4. Formulario de contacto
El formulario está conectado solo al frontend (simula el envío). Para que envíe de verdad, tres opciones según el caso:

- **Formspree** (más simple): cambiar `<form id="contact-form">` por `<form id="contact-form" action="https://formspree.io/f/TU_ID" method="POST">` y eliminar el `e.preventDefault()` en `script.js`.
- **Backend propio**: si Jorge usa ControlIA o tiene un endpoint Node.js, conectar el `fetch()` en `script.js`.
- **WhatsApp directo**: cambiar el botón por un link `https://wa.me/573107702418?text=...` que arme el mensaje desde los campos.

### 5. Colores
Editar las variables CSS en la cabecera de `styles.css`:
```css
:root {
  --bg:     #F5F0E6;   /* fondo crema */
  --navy:   #0B1D3F;   /* azul marino del logo */
  --accent: #B8542A;   /* terracota (acento) */
  ...
}
```

### 6. Política de tratamiento de datos
Los enlaces en el footer (`Política de privacidad` y `Tratamiento de datos`) apuntan a `#`. Crear esas páginas o enlazarlas a un PDF externo según corresponda (Ley 1581 de 2012 lo exige si se recolectan datos vía formulario).

## Notas técnicas

- **SEO básico** ya incluido: `<title>`, `<meta description>`, `lang="es-CO"`, estructura semántica con `<header>`, `<section>`, `<article>`, `<footer>`.
- **Accesibilidad**: contrastes AA, focus visible, labels asociados a inputs, alt en íconos decorativos como `aria-hidden`.
- **Performance**: cero dependencias JS, fonts cargadas con `display=swap`, imágenes inline en SVG.
- **Responsive**: probado conceptualmente para mobile/tablet/desktop. Breakpoints en 600px / 700px / 800px / 900px / 1100px.

## Contenido — Marco normativo referenciado

El contenido cita las normas vigentes del Sistema General de Riesgos Laborales en Colombia:
- Decreto 1072 de 2015 (Decreto Único Reglamentario del Sector Trabajo)
- Resolución 0312 de 2019 (Estándares mínimos del SG-SST)
- Resolución 1401 de 2007 (Investigación de incidentes y accidentes)
- Resolución 2400 de 1979 (Estatuto de seguridad industrial)
- Ley 1562 de 2012 (Sistema General de Riesgos Laborales)
- Resolución 4272 de 2021 (Trabajo seguro en alturas)
- Resolución 2646 de 2008 (Riesgo psicosocial)
- GTC 45 (Identificación de peligros)

Si el equipo legal de GESSEG considera que algún texto requiere matización o referencia adicional, los textos están claramente delimitados en cada `.html` y son fáciles de editar.
