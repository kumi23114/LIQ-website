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
    // 正確地解構所有查詢參數，並將 'path' 以外的參數全部放入 'rest' 變數中
    const { path = '/entries', ...rest } = request.query || {};

    // 安全限制：只允許讀取型 API 路徑
    const safePath = String(path).startsWith('/') ? path : `/${path}`;
    if (!['/entries', '/assets'].some(p => safePath.startsWith(p))) {
      return response.status(400).json({ error: '不被允許的 Contentful API 路徑' });
    }
    
    // 將所有額外參數重新組合為一個新的查詢字串
    const searchParams = new URLSearchParams(rest).toString();

    const base = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;
    // 構建最終的完整 URL，包含所有參數
    const url = `${base}${safePath}?${searchParams}`;

    const cf = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      method: 'GET',
    });

    if (!cf.ok) {
      const text = await cf.text();
      return response.status(cf.status).json({ error: 'Contentful 錯誤', details: text });
    }

    const data = await cf.json();
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json(data);
  } catch (error) {
    console.error('Contentful proxy error:', error);
    return response.status(500).json({ error: 'Proxy 伺服器錯誤' });
  }
}


