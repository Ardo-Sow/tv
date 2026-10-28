// Proxy Vercel : récupère un flux vidéo côté serveur et ajoute les en-têtes CORS.
export default async function handler(req, res) {
  const target = req.query.url;
  if (!/^https?:\/\//i.test(target || '')) return res.status(400).send('URL invalide');
  try {
    const r = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      redirect: 'follow'
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/octet-stream');
    res.status(r.status).send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.status(502).send('Flux inaccessible');
  }
}
