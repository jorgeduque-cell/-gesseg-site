# GESSEG Colombia S.A.S — Sitio Web

Sitio web corporativo de GESSEG Colombia, consultora especializada en Seguridad y Salud en el Trabajo (SST).

## Panel de administración

El cliente puede editar el contenido del sitio (textos, imágenes, datos de contacto) **sin necesidad de saber programar**.

### Cómo editar el sitio

1. Abrir `https://gesset.vercel.app/admin` (o `https://gesseg.com.co/admin` cuando el dominio esté conectado)
2. Click en **"Sign in with GitHub"** → autorizar la primera vez
3. En el panel, click en **"Página inicio"** dentro de "Contenido del sitio"
4. Edita lo que quieras: textos, imágenes (arrastra y suelta), bullets, FAQ, etc.
5. Click en **"Publish"** (arriba a la derecha) → los cambios aparecen en el sitio en ~30 segundos

### Qué se puede editar desde el panel

- **Portada (Hero)**: badge, título, descripción, foto principal
- **3 servicios destacados**: badge, título, descripción, 4 bullets, foto (cada uno)
- **Preguntas frecuentes**: pregunta + respuesta (sin límite de número)
- **Datos de contacto**: teléfono, WhatsApp, correo, ciudad, horario
- **Redes sociales**: Instagram y Facebook

### Qué NO se edita desde el panel (requiere código)

- Estructura de páginas / orden de secciones
- Colores y tipografía
- Precios de los planes (en HTML directo)
- Páginas legales (privacidad, tratamiento de datos)
- Logo de la empresa
- Página "Nosotros", "Servicios" detallados

Si necesitas cambiar alguno de estos, contacta al desarrollador.

---

## Para desarrolladores

### Stack
- **HTML5** estático con **Handlebars** para templating de contenido
- **Vite** como build tool
- **GitHub + Vercel** para deploy automático con cada push
- **Sveltia CMS** (`/admin`) para edición sin código

### Estructura
```
gesseg-site/
├── index.html          ← Página principal (hero, servicios, planes, FAQ, etc.)
├── nosotros.html       ← Quiénes somos
├── servicios.html      ← Detalle de servicios y metodología
├── contacto.html       ← Formulario + datos
├── 404.html            ← Página no encontrada
├── politica-privacidad.html
├── tratamiento-datos.html
├── content/
│   └── site.yml        ← TODO el contenido editable (lee Sveltia)
├── public/
│   ├── admin/          ← Panel CMS Sveltia
│   ├── logo*.png       ← Logos del cliente
│   ├── *.jpg           ← Fotos del sitio
│   └── ...
├── styles.css          ← Sistema de diseño
├── script.js           ← Form + interacciones
├── vite.config.js      ← Build config + handlebars + YAML loader
└── vercel.json         ← Headers + caching
```

### Local development
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Build de producción
```bash
npm run build
# → genera /dist
```

### Deploy
Automático en cada push a `main` (Vercel). Para forzar deploy manual:
```bash
vercel --prod
```

### Cambiar campos editables del CMS
Editar `public/admin/config.yml`. La estructura usa el formato de [Decap CMS](https://decapcms.org/docs/configuration-options/) (Sveltia es compatible).

### Identidad de marca
| Token | Valor |
|---|---|
| Navy (primario) | `#0B1D3F` |
| Dorado (acento) | `#D4A547` |
| Dorado brillante | `#E7B94F` |
| Cream / hueso (fondo) | `#F5F0E6` |
| Tipografía display | Fraunces (serif) |
| Tipografía body | Geist (sans) |
| Tipografía mono | Geist Mono |

### Datos de contacto (centralizados)
Todos los datos viven en `content/site.yml` bajo `contact:` y `social:`. El cliente los edita desde el CMS — no hay que tocar HTML.
