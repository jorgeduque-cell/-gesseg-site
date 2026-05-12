// Recibe el callback de GitHub OAuth y devuelve el token al CMS via postMessage
// Endpoint: GET /api/callback?code=...&state=...
export default async function handler(req, res) {
  const { code, state } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return sendError(
      res,
      'OAUTH_CLIENT_ID o OAUTH_CLIENT_SECRET no están configurados en Vercel.'
    );
  }

  if (!code) {
    return sendError(res, 'No se recibió el código de autorización de GitHub.');
  }

  // Validar state contra la cookie
  const cookies = parseCookies(req.headers.cookie || '');
  if (state && cookies.oauth_state && state !== cookies.oauth_state) {
    return sendError(res, 'Estado de autorización inválido (posible CSRF).');
  }

  try {
    // Intercambiar el código por un access_token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'GESSEG-CMS',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error) {
      return sendError(res, `GitHub devolvió error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      return sendError(res, 'No se recibió access_token de GitHub.');
    }

    // Devolver el token al CMS via postMessage (formato Decap/Sveltia)
    const payload = JSON.stringify({
      token: data.access_token,
      provider: 'github',
    });

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Autenticación exitosa — GESSEG CMS</title>
<style>
  body { margin:0; font-family:system-ui; background:#0B1D3F; color:#F5F0E6; display:grid; place-items:center; min-height:100vh; text-align:center; padding:40px; }
  h1 { font-family:Georgia,serif; font-weight:350; font-size:28px; margin:0 0 12px; }
  p { color:rgba(245,240,230,.7); }
</style>
</head>
<body>
<div>
  <h1>✓ Autenticación exitosa</h1>
  <p>Cerrando ventana…</p>
</div>
<script>
(function() {
  function sendToken() {
    if (!window.opener) {
      document.body.innerHTML = '<div><h1>Error</h1><p>No se encontró ventana principal. Reinicia el panel.</p></div>';
      return;
    }
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:' + ${JSON.stringify(payload)},
        e.origin || '*'
      );
      window.removeEventListener('message', receiveMessage);
      setTimeout(function() { window.close(); }, 300);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  }
  sendToken();
})();
</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; Max-Age=0');
    res.status(200).send(html);
  } catch (err) {
    sendError(res, `Error al intercambiar código por token: ${err.message}`);
  }
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=');
    if (k) acc[k] = v;
    return acc;
  }, {});
}

function sendError(res, message) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Error de autenticación</title>
<style>body{margin:0;font-family:system-ui;background:#0B1D3F;color:#F5F0E6;display:grid;place-items:center;min-height:100vh;text-align:center;padding:40px}h1{font-family:Georgia,serif;font-weight:350;font-size:28px;margin:0 0 12px;color:#E7B94F}p{color:rgba(245,240,230,.7);max-width:50ch}</style>
</head>
<body><div><h1>Error de autenticación</h1><p>${message}</p><p><a href="/admin" style="color:#E7B94F">← Volver al panel</a></p></div></body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(400).send(html);
}
