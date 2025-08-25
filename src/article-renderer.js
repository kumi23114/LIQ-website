import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

// 將 Contentful 渲染器掛到全域，供 article.html 既有邏輯使用
window.documentToHtmlString = documentToHtmlString;
console.log('✅ Contentful documentToHtmlString 已透過 Vite 掛載至 window');


