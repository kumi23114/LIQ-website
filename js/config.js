/**
 * LIQ Media - 環境配置管理
 * 用於管理 API 憑證和其他環境相關設定
 */

// ============================================================================
// 環境配置
// ============================================================================

const CONFIG = {
  // Contentful API 配置
  contentful: {
    SPACE_ID: process.env.CONTENTFUL_SPACE_ID || 'id4y90f1h82c',
    ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || 'vxnpypRajiFP97o7gEfMoavejunX98K8undinDWuVbY',
    ENVIRONMENT: 'master',
    CONTENT_TYPE: 'pageBlogPost'
  },
  
  // Formspree 配置
  formspree: {
    ENDPOINT: 'https://formspree.io/f/mdkdqdqp'
  },
  
  // Google Analytics 配置
  analytics: {
    GA_ID: 'G-4M94YE8ETT'
  },
  
  // LINE 配置
  line: {
    OFFICIAL_ACCOUNT_URL: 'https://lin.ee/0eBvgAV'
  },
  
  // 開發環境標誌
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // 除錯模式
  debug: process.env.NODE_ENV === 'development'
};

// ============================================================================
// 安全檢查函數
// ============================================================================

/**
 * 檢查 API 配置是否完整
 */
function validateConfig() {
  const warnings = [];
  
  if (CONFIG.contentful.SPACE_ID === 'YOUR_SPACE_ID_HERE') {
    warnings.push('Contentful Space ID 未設定');
  }
  
  if (CONFIG.contentful.ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
    warnings.push('Contentful Access Token 未設定');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️ 配置警告:', warnings.join(', '));
    return false;
  }
  
  return true;
}

/**
 * 安全的日誌輸出
 */
function safeLog(message, data = null) {
  if (CONFIG.debug) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}

/**
 * 安全的錯誤輸出
 */
function safeError(message, error = null) {
  if (CONFIG.debug) {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
}

// ============================================================================
// 導出配置
// ============================================================================

// 如果使用 ES6 模組系統
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, validateConfig, safeLog, safeError };
}

// 如果使用瀏覽器環境
if (typeof window !== 'undefined') {
  window.LIQ_CONFIG = CONFIG;
  window.validateConfig = validateConfig;
  window.safeLog = safeLog;
  window.safeError = safeError;
}
