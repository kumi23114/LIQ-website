/**
 * LYQD Media - 共用組件系統
 * 包含：Header、Mobile Navigation、Footer、Sticky CTA 等共用組件
 */

// ============================================================================
// 共用組件 HTML 模板
// ============================================================================

const COMPONENTS = {
  // Header 組件
  header: `
    <header class="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <a href="#top" class="group inline-flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div class="h-8 w-8 rounded-sm shadow-[0_0_30px_rgba(25,58,85,.35)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(25,58,85,.5)]" style="background:linear-gradient(135deg, rgba(25,58,85,1) 0%, rgba(13,29,43,1) 100%)"></div>
          <span class="font-semibold tracking-wide text-zinc-800 transition-colors duration-300 group-hover:text-[#193a55]">流芯視覺</span>
        </a>
        <nav class="hidden gap-8 md:flex">
          <a href="#showreel" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">精選作品集</span>
            <span class="nav-underline"></span>
          </a>
          <a href="#advantages" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">關於我們</span>
            <span class="nav-underline"></span>
          </a>
          <a href="#cases" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">AI應用項目</span>
            <span class="nav-underline"></span>
          </a>
          <a href="#process" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">服務流程</span>
            <span class="nav-underline"></span>
          </a>
          <a href="faq.html" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">常見問題</span>
            <span class="nav-underline"></span>
          </a>
          <a href="blog.html" class="nav-link text-sm text-zinc-600 hover:text-zinc-800 relative overflow-hidden transition-all duration-300">
            <span class="relative z-10">文章專欄</span>
            <span class="nav-underline"></span>
          </a>
        </nav>
        <a href="#contact" class="hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-flex hover:shadow-[0_0_30px_rgba(25,58,85,.5)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95" style="background-color:#193a55;color:white">預約諮詢</a>
      </div>
    </header>
  `,

  // Mobile Navigation 組件
  mobileNav: `
    <div class="md:hidden mobile-nav-container">
      <!-- Mobile Header with Burger Menu -->
      <div class="mobile-header">
        <div class="burger-container" onclick="toggleMobileMenu()">
          <div id="burger">
            <div class="bar topBar"></div>
            <div class="bar btmBar"></div>
          </div>
        </div>
        
        <div class="mobile-logo">
          <span class="font-semibold tracking-wide text-white">流芯視覺</span>
        </div>
        
        <div class="mobile-cta">
          <a href="#contact" class="mobile-cta-btn">諮詢</a>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" id="mobileMenuOverlay">
        <!-- Close button (X) -->
        <button class="mobile-menu-close" onclick="closeMobileMenu()" aria-label="關閉選單">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <ul class="mobile-menu">
          <li class="mobile-menu-item">
            <a href="#top" onclick="closeMobileMenu()">首頁</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#showreel" onclick="closeMobileMenu()">精選作品集</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#advantages" onclick="closeMobileMenu()">關於我們</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#cases" onclick="closeMobileMenu()">AI應用項目</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#process" onclick="closeMobileMenu()">服務流程</a>
          </li>
          <li class="mobile-menu-item">
            <a href="faq.html" onclick="closeMobileMenu()">常見問題</a>
          </li>
          <li class="mobile-menu-item">
            <a href="blog.html" onclick="closeMobileMenu()">文章專欄</a>
          </li>
        </ul>
      </div>
    </div>
  `,

  // Footer 組件
  footer: `
    <footer class="border-t border-black/5 py-10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-sm text-zinc-600 md:flex-row">
        <p>LYQD Media · 電影級 AI 製作</p>
        <div class="flex items-center gap-6">
          <a href="#showreel" class="hover:text-zinc-800">精選作品</a>
          <a href="#cases" class="hover:text-zinc-800">AI應用項目</a>
          <a href="#contact" class="hover:text-zinc-800">聯絡我們</a>
          <a href="blog.html" class="hover:text-zinc-800">文章專欄</a>
        </div>
      </div>
    </footer>
  `,

  // Sticky CTA 組件
  stickyCta: `
    <div class="sticky-cta">
      <!-- 取得報價按鈕 -->
      <button class="sticky-cta-button primary" onclick="openMiniContact()" title="取得報價">
        💰
        <span class="tooltip">取得報價</span>
      </button>
      
      <!-- LINE 官方帳號按鈕 -->
      <a href="https://lin.ee/0eBvgAV" target="_blank" class="sticky-cta-button secondary" title="LINE 官方帳號">
        💬
        <span class="tooltip">LINE 官方帳號</span>
      </a>
    </div>
  `,

  // Mini Contact Form Modal 組件
  miniContactModal: `
    <div id="miniContactModal" class="mini-contact-modal">
      <div class="mini-contact-content">
        <button class="mini-contact-close" onclick="closeMiniContact()">&times;</button>
        
        <div class="mini-contact-header">
          <h3>取得報價</h3>
          <p>留下資訊，我們將在 24 小時內回覆</p>
        </div>
        
        <form class="mini-contact-form" action="https://formspree.io/f/mdkdqdqp" method="POST" enctype="text/plain">
          <input type="text" name="Name" placeholder="您的姓名" required>
          <input type="email" name="Email" placeholder="您的 Email" required>
          <textarea name="Message" placeholder="簡述您的專案內容、時程與預算區間" required></textarea>
          
          <div class="mini-contact-actions">
            <button type="submit" class="submit-btn">送出</button>
            <button type="button" class="cancel-btn" onclick="closeMiniContact()">取消</button>
          </div>
        </form>
      </div>
    </div>
  `
};

// ============================================================================
// 組件載入與管理函數
// ============================================================================

/**
 * 載入指定組件到指定位置
 * @param {string} componentName - 組件名稱
 * @param {string} targetSelector - 目標選擇器
 * @param {string} position - 插入位置 ('beforebegin', 'afterbegin', 'beforeend', 'afterend')
 */
function loadComponent(componentName, targetSelector, position = 'beforeend') {
  const target = document.querySelector(targetSelector);
  if (!target) {
    console.warn(`Target element not found: ${targetSelector}`);
    return;
  }

  const component = COMPONENTS[componentName];
  if (!component) {
    console.warn(`Component not found: ${componentName}`);
    return;
  }

  target.insertAdjacentHTML(position, component);
}

/**
 * 載入頁面所需的共用組件
 * @param {Object} config - 組件配置
 */
function loadPageComponents(config = {}) {
  const {
    header = true,
    mobileNav = true,
    footer = true,
    stickyCta = true,
    miniContactModal = true
  } = config;

  // 載入 Header
  if (header) {
    loadComponent('header', 'body', 'afterbegin');
  }

  // 載入 Mobile Navigation
  if (mobileNav) {
    loadComponent('mobileNav', 'body', 'afterbegin');
  }

  // 載入 Footer
  if (footer) {
    loadComponent('footer', 'body', 'beforeend');
  }

  // 載入 Sticky CTA
  if (stickyCta) {
    loadComponent('stickyCta', 'body', 'beforeend');
  }

  // 載入 Mini Contact Modal
  if (miniContactModal) {
    loadComponent('miniContactModal', 'body', 'beforeend');
  }
}

/**
 * 更新組件中的連結（用於不同頁面）
 * @param {string} currentPage - 當前頁面名稱
 */
function updateComponentLinks(currentPage) {
  // 根據當前頁面更新導覽連結
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-item a');
  
  const linkUpdates = {
    'index': {
      '#showreel': '#showreel',
      '#advantages': '#advantages',
      '#cases': '#cases',
      '#process': '#process',
      '#contact': '#contact'
    },
    'faq': {
      '#showreel': 'index.html#showreel',
      '#advantages': 'index.html#advantages',
      '#cases': 'index.html#cases',
      '#process': 'index.html#process',
      '#contact': 'index.html#contact'
    },
    'blog': {
      '#showreel': 'index.html#showreel',
      '#advantages': 'index.html#advantages',
      '#cases': 'index.html#cases',
      '#process': 'index.html#process',
      '#contact': 'index.html#contact'
    },
    'article': {
      '#showreel': 'index.html#showreel',
      '#advantages': 'index.html#advantages',
      '#cases': 'index.html#cases',
      '#process': 'index.html#process',
      '#contact': 'index.html#contact'
    }
  };

  const updates = linkUpdates[currentPage] || linkUpdates['index'];
  
  // 更新桌面版導覽連結
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (updates[href]) {
      link.setAttribute('href', updates[href]);
    }
  });

  // 更新行動版導覽連結
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (updates[href]) {
      link.setAttribute('href', updates[href]);
    }
  });
}

// ============================================================================
// 自動初始化
// ============================================================================

// 等待 DOM 載入完成後自動載入組件
document.addEventListener('DOMContentLoaded', function() {
  // 根據當前頁面路徑決定載入哪些組件
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
  
  // 載入所有共用組件
  loadPageComponents({
    header: true,
    mobileNav: true,
    footer: true,
    stickyCta: true,
    miniContactModal: true
  });
  
  // 更新組件連結
  updateComponentLinks(currentPage);
});
