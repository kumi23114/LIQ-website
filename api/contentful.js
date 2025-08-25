// /api/contentful.js
// Proxy endpoint to call Contentful using server-side environment variables on Vercel

export default async function handler(request, response) {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
  const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  if (!SPACE_ID || !ACCESS_TOKEN) {
    return response.status(500).json({ error: 'Contentful 憑證未設定 (SPACE_ID/ACCESS_TOKEN)' });
  }

  try {
    const { path = '/entries', search = '' } = request.query || {};

    // 安全限制：只允許讀取型 API 路徑
    const safePath = String(path).startsWith('/') ? path : `/${path}`;
    if (!['/entries', '/assets'].some(p => safePath.startsWith(p))) {
      return response.status(400).json({ error: '不被允許的 Contentful API 路徑' });
    }

    const base = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;
    const url = `${base}${safePath}${search ? (search.startsWith('?') ? search : `?${search}`) : ''}`;

    const cf = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      // 只允許 GET，避免被濫用為修改 API
      method: 'GET',
    });

    if (!cf.ok) {
      const text = await cf.text();
      return response.status(cf.status).json({ error: 'Contentful 錯誤', details: text });
    }

    const data = await cf.json();
    // 可選：加入簡單快取標頭
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json(data);
  } catch (error) {
    console.error('Contentful proxy error:', error);
    return response.status(500).json({ error: 'Proxy 伺服器錯誤' });
  }
}


