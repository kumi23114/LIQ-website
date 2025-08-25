/**
 * LYQD Media - 首頁專用 JavaScript 功能
 * 包含：Showreel 影片懶載入、Hero 影片載入、輪播指示器、桌面版導覽列效果等
 */

// ============================================================================
// 開場動畫控制 - 使用 sessionStorage 確保每次瀏覽只播放一次
// ============================================================================

// 檢查是否已經播放過開場動畫
function shouldPlayIntroAnimation() {
  return !sessionStorage.getItem('introAnimationPlayed');
}

// 標記開場動畫已播放
function markIntroAnimationAsPlayed() {
  sessionStorage.setItem('introAnimationPlayed', 'true');
}

// 開場動畫主函數
function playIntroAnimation() {
  // 禁用滾動功能
  function disableScroll() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = scrollBarWidth + 'px';
    }
    window.scrollTo(0, 0);
  }
  
  // 啟用滾動功能
  function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.scrollBehavior = '';
  }
  
  // 立即禁用滾動
  disableScroll();
  
  // 創建 GSAP Timeline
  const tl = gsap.timeline();
  
  // 設置初始狀態（避免 layout thrash，先一次性 set）
  gsap.set([
    '.sb-logo img',
    '.js-border-top',
    '.js-border-left',
    '.js-border-right'
  ], { force3D: true });
  gsap.set('.sb-logo img', { opacity: 0, scale: 0.5 });
  gsap.set('.js-border-top', { scaleX: 0, transformOrigin: 'left' });
  gsap.set('.js-border-left', { scaleY: 0, transformOrigin: 'top' });
  gsap.set('.js-border-right', { scaleY: 0, transformOrigin: 'top' });
  
  // Logo 淡入動畫
  tl.to('.sb-logo img', { 
    opacity: 1, 
    scale: 1, 
    duration: 1.2, 
    ease: 'power2.out' 
  })
  
  // 邊框動畫 - 提前1秒開始，與Logo動畫重疊
  .to('.js-border-top', { 
    scaleX: 1, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.9')
  .to('.js-border-left', { 
    scaleY: 1, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.5')
  .to('.js-border-right', { 
    scaleY: 1, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.35')
  
  // 畫面揭露和主體顯示（確保 intro 全屏覆蓋，header 不需延遲）
  .to('.site-intro', { 
    yPercent: -100, 
    duration: 0.7, 
    ease: 'power2.inOut'
  })
  .to('#main-content', { 
    opacity: 1, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.45')
  
  // 清理舞台並重新啟用滾動
  .set('.site-intro', { display: 'none' })
  .call(() => {
    enableScroll();
    markIntroAnimationAsPlayed();
    // 無需廣播，CTA 由 overlay 覆蓋即可
  });
}

// 初始化開場動畫
function initIntroAnimation() {
  if (shouldPlayIntroAnimation()) {
    // 如果還沒播放過，執行開場動畫
    playIntroAnimation();
  } else {
    // 如果已經播放過，直接顯示主內容並隱藏開場動畫
    gsap.set('#main-content', { opacity: 1 });
    gsap.set('.site-intro', { display: 'none' });
  }
}

// 等待 DOM 載入完成後初始化開場動畫
document.addEventListener('DOMContentLoaded', function() {
  initIntroAnimation();
});

// ============================================================================
// VIDEO OPTIMIZATION VARIABLES
// ============================================================================

let showreelObserver = null;
let videoLoadStats = {
  showreelLoaded: 0,
  totalShowreel: 6
};

// 效能監控
const startTime = performance.now();

// ============================================================================
// HERO VIDEO LOADING HANDLER
// ============================================================================

/**
 * Hero 影片載入處理器（含模糊效果）
 * @param {HTMLIFrameElement} iframe - Hero 影片的 iframe 元素
 */
function handleHeroVideoLoad(iframe) {
  const skeleton = document.getElementById('hero-skeleton');
  const fallback = document.getElementById('video-fallback');
  
  // 移除載入樣式類別並添加載入完成樣式類別
  iframe.classList.remove('loading');
  iframe.classList.add('loaded');
  
  // 顯示 iframe 並平滑過渡
  setTimeout(() => {
    iframe.style.visibility = 'visible';
    
    // 隱藏骨架載入器
    setTimeout(() => {
      if (skeleton) {
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.style.display = 'none', 500);
      }
    }, 500);
    
    // 隱藏備用背景
    setTimeout(() => {
      if (fallback) {
        fallback.classList.add('video-fallback-fade');
      }
    }, 1000);
  }, 1000);
}

// ============================================================================
// SHOWREEL VIDEO LAZY LOADING
// ============================================================================

/**
 * 追蹤影片載入效能
 * @param {string} videoType - 影片類型
 * @param {number} loadTime - 載入時間（毫秒）
 */
function trackVideoLoad(videoType, loadTime) {
  console.log(`${videoType} 載入完成，耗時 ${loadTime.toFixed(2)}ms`);
  
  // 如果可用，發送效能資料到分析工具
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_load_performance', {
      video_type: videoType,
      load_time: loadTime,
      page_load_time: performance.now() - startTime
    });
  }
}

/**
 * 初始化 Showreel 影片的 IntersectionObserver（含自動播放）
 */
function initShowreelObserver() {
  if (showreelObserver) return;
  
  showreelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        
        if (iframe && !iframe.src && iframe.dataset.src) {
          // 當進入視窗時載入影片
          const loadStartTime = performance.now();
          
          // 設定 src 以觸發載入（自動播放將生效）
          iframe.src = iframe.dataset.src;
          
          // 載入完成後顯示 iframe
          iframe.onload = function() {
            const loadTime = performance.now() - loadStartTime;
            trackVideoLoad('showreel', loadTime);
            
            // 隱藏骨架並顯示 iframe
            const skeleton = iframe.parentElement.querySelector('.showreel-skeleton');
            if (skeleton) {
              skeleton.style.opacity = '0';
              setTimeout(() => skeleton.style.display = 'none', 300);
            }
            
            // 平滑過渡顯示 iframe
            setTimeout(() => {
              iframe.classList.add('loaded');
              iframe.style.opacity = '1';
            }, 100);
            
            // 更新載入統計
            videoLoadStats.showreelLoaded++;
            
            // 記錄進度
            console.log(`Showreel 進度: ${videoLoadStats.showreelLoaded}/${videoLoadStats.totalShowreel} 個影片已載入`);
          };
        }
      }
    });
  }, {
    rootMargin: '100px', // 在進入視窗前 100px 開始載入，確保自動播放流暢
    threshold: 0.1
  });
  
  // 觀察所有 showreel 影片容器
  document.querySelectorAll('.showreel-video').forEach(iframe => {
    showreelObserver.observe(iframe);
  });
}

// ============================================================================
// CAROUSEL INDICATORS FUNCTIONALITY
// ============================================================================

/**
 * 初始化輪播指示器功能
 */
function initCarouselIndicators() {
  const showreelScroll = document.querySelector('.showreel-scroll');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const videoItems = document.querySelectorAll('.showreel-scroll figure');
  
  if (!showreelScroll || indicators.length === 0) return;
  
  // 為指示器添加點擊功能
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      scrollToVideo(index);
      updateActiveIndicator(index);
    });
    
    // 添加鍵盤支援
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToVideo(index);
        updateActiveIndicator(index);
      }
    });
    
    // 使指示器可聚焦且具可訪問性
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('aria-label', `跳轉到作品 ${index + 1}`);
    indicator.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
  });
  
  // 滾動時更新指示器（使用節流以提升效能）
  let scrollTimeout;
  showreelScroll.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      updateIndicatorsOnScroll();
    }, 16); // ~60fps
  });
  
  // 滾動到指定影片的函式
  function scrollToVideo(index) {
    const targetVideo = videoItems[index];
    if (targetVideo) {
      const scrollLeft = targetVideo.offsetLeft - (showreelScroll.offsetWidth / 2) + (targetVideo.offsetWidth / 2);
      showreelScroll.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }
  
  // 更新活動指示器的函式
  function updateActiveIndicator(activeIndex) {
    indicators.forEach((indicator, index) => {
      if (index === activeIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-pressed', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-pressed', 'false');
      }
    });
  }
  
  // 根據滾動位置更新指示器的函式
  function updateIndicatorsOnScroll() {
    const scrollLeft = showreelScroll.scrollLeft;
    const containerWidth = showreelScroll.clientWidth;
    
    // 找出在視窗中最可見的影片
    let mostVisibleIndex = 0;
    let maxVisibility = 0;
    
    videoItems.forEach((video, index) => {
      const videoLeft = video.offsetLeft;
      const videoRight = videoLeft + video.offsetWidth;
      const viewportLeft = scrollLeft;
      const viewportRight = scrollLeft + containerWidth;
      
      // 計算影片的可見程度
      const visibleLeft = Math.max(videoLeft, viewportLeft);
      const visibleRight = Math.min(videoRight, viewportRight);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      
      // 計算可見度百分比
      const visibility = visibleWidth / video.offsetWidth;
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = index;
      }
    });
    
    // 更新活動指示器
    updateActiveIndicator(mostVisibleIndex);
    
    // 除錯資訊（生產環境可移除）
    console.log(`滾動: ${scrollLeft}px, 最可見: 影片 ${mostVisibleIndex + 1}, 可見度: ${(maxVisibility * 100).toFixed(1)}%`);
  }
  
  // 初始化第一個指示器為活動狀態
  updateActiveIndicator(0);
}

// ============================================================================
// NAVIGATION EFFECTS AND SCROLL HANDLING
// ============================================================================

/**
 * 初始化導覽列效果和滾動處理
 */
function initNavigationEffects() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // 標題滾動效果
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 根據滾動位置更新活動導覽
    updateActiveNavigation();
  });

  // 更新活動導覽狀態
  function updateActiveNavigation() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // 移除所有連結的活動樣式類別
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // 為當前區段連結添加活動樣式類別
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  // 導覽連結的平滑滾動
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // 只處理內部連結
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 添加懸停音效（可選）
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      // 添加微妙的懸停效果
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      // 重置變形
      this.style.transform = 'translateY(0)';
    });
  });

  // 行動版導覽改進
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      // 添加點擊回饋
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// ============================================================================
// MOBILE NAVIGATION IMPROVEMENTS
// ============================================================================

/**
 * 行動版導覽漸層控制
 */
function initMobileNavigationGradient() {
  const mobileNav = document.querySelector('.mobile-nav-container');
  const mobileNavScroll = document.querySelector('.mobile-nav-scroll');
  
  if (mobileNav && mobileNavScroll) {
    // 檢查內容是否可滾動
    function checkScrollable() {
      if (mobileNavScroll.scrollWidth > mobileNavScroll.clientWidth) {
        mobileNav.classList.add('show-gradient');
      } else {
        mobileNav.classList.remove('show-gradient');
      }
    }
    
    // 初始檢查
    checkScrollable();
    
    // 滾動時檢查
    mobileNavScroll.addEventListener('scroll', function() {
      const isAtEnd = mobileNavScroll.scrollLeft + mobileNavScroll.clientWidth >= mobileNavScroll.scrollWidth;
      if (isAtEnd) {
        mobileNav.classList.remove('show-gradient');
      } else {
        mobileNav.classList.add('show-gradient');
      }
    });
    
    // 視窗大小改變時檢查
    window.addEventListener('resize', checkScrollable);
  }
}

/**
 * 行動版選單連結的平滑滾動
 */
function initMobileMenuSmoothScroll() {
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-item a');
  
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // 只處理內部連結
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ============================================================================
// PAGE INITIALIZATION
// ============================================================================

/**
 * 初始化頁面優化
 */
function initPageOptimizations() {
  // 初始化 showreel observer 進行懶載入
  initShowreelObserver();
  
  // 效能報告
  setTimeout(() => {
    const totalLoadTime = performance.now() - startTime;
    console.log(`🎬 影片優化報告:`);
    console.log(`📊 頁面載入時間: ${totalLoadTime.toFixed(2)}ms`);
    console.log(`🎥 Hero 影片: 預載入以立即顯示`);
    console.log(`📺 Showreel 影片: ${videoLoadStats.showreelLoaded}/${videoLoadStats.totalShowreel} 已載入`);
    console.log(`💡 提示: 影片按需載入但保持自動播放功能`);
    
    // 如果分析工具可用，發送頁面載入效能資料
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_load_performance', {
        page_load_time: totalLoadTime,
        hero_video_preloaded: true,
        showreel_videos_loaded: videoLoadStats.showreelLoaded
      });
    }
  }, 2000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// 當 DOM 載入完成後設置事件監聽器
document.addEventListener('DOMContentLoaded', function() {
  // 初始化行動版導覽漸層控制
  initMobileNavigationGradient();
  
  // 初始化行動版選單平滑滾動
  initMobileMenuSmoothScroll();
  
  // 初始化輪播指示器
  initCarouselIndicators();
  
  // 初始化導覽列效果
  initNavigationEffects();
});

// 當頁面載入完成後初始化頁面優化
window.addEventListener('load', function() {
  initPageOptimizations();
});

// ============================================================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ============================================================================

// 如果使用 ES6 模組系統，可以取消註解以下程式碼
/*
export {
  handleHeroVideoLoad,
  initShowreelObserver,
  initCarouselIndicators,
  initNavigationEffects,
  initMobileNavigationGradient,
  initMobileMenuSmoothScroll,
  initPageOptimizations
};
*/
