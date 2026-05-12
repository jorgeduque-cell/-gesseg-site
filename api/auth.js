// Inicia el flujo OAuth con GitHub para Decap/Sveltia CMS
// Endpoint: GET /api/auth
export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    res.status(500).send(
      'OAUTH_CLIENT_ID no está configurado. Añadirlo en Vercel → Settings → Environment Variables.'
    );
    return;
  }

  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/callback`;

  // Estado aleatorio para protección CSRF
  const state = Math.random().toString(36).substring(2, 15);

  const githubUrl =
    'https://github.com/login/oauth/authorize?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo,user',
      state,
    }).toString();

  res.setHeader(
    'Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  res.redirect(302, githubUrl);
}
