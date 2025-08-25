/**
 * LIQ Media - 共用 JavaScript 功能
 * 包含：漢堡選單、Sticky CTA、Mini Contact Modal 等共用功能
 */

// ============================================================================
// MOBILE BURGER MENU FUNCTIONS
// ============================================================================

/**
 * 切換行動版選單的開關狀態
 */
function toggleMobileMenu() {
  const header = document.querySelector('.mobile-header');
  const overlay = document.getElementById('mobileMenuOverlay');
  const body = document.body;
  
  if (header.classList.contains('menu-opened')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * 開啟行動版選單
 */
function openMobileMenu() {
  const header = document.querySelector('.mobile-header');
  const overlay = document.getElementById('mobileMenuOverlay');
  const body = document.body;
  
  header.classList.add('menu-opened');
  overlay.classList.add('active');
  body.style.overflow = 'hidden';
  
  // 添加選單項目的進入動畫
  setTimeout(() => {
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    menuItems.forEach((item, index) => {
      item.style.transitionDelay = `${0.07 * (index + 1) + 0.2}s`;
    });
  }, 100);
}

/**
 * 關閉行動版選單
 */
function closeMobileMenu() {
  const header = document.querySelector('.mobile-header');
  const overlay = document.getElementById('mobileMenuOverlay');
  const body = document.body;
  
  header.classList.remove('menu-opened');
  overlay.classList.remove('active');
  body.style.overflow = 'auto';
  
  // 重置選單項目動畫
  const menuItems = document.querySelectorAll('.mobile-menu-item');
  menuItems.forEach((item, index) => {
    item.style.transitionDelay = `${0.56 - (index * 0.07)}s`;
  });
}

// ============================================================================
// MINI CONTACT FORM FUNCTIONS
// ============================================================================

/**
 * 開啟迷你聯絡表單彈窗
 */
function openMiniContact() {
  const modal = document.getElementById('miniContactModal');
  if (!modal) return;
  
  modal.style.display = 'block';
  
  // 鎖定頁面滾動
  document.body.style.overflow = 'hidden';
  
  // 聚焦到第一個輸入欄位
  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
}

/**
 * 關閉迷你聯絡表單彈窗
 */
function closeMiniContact() {
  const modal = document.getElementById('miniContactModal');
  if (!modal) return;
  
  modal.style.display = 'none';
  
  // 恢復頁面滾動
  document.body.style.overflow = 'auto';
  
  // 重置表單
  const form = modal.querySelector('form');
  if (form) form.reset();
}

// ============================================================================
// MODAL FUNCTIONS (for index.html video modals)
// ============================================================================

/**
 * 開啟指定的模態框
 * @param {string} modalId - 要開啟的模態框 ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.style.display = "block";
  
  // 觸發模糊效果
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // 鎖定頁面滾動
  document.body.style.overflow = 'hidden';
}

/**
 * 處理影片模態框的載入
 * @param {string} modalId - 模態框的 ID
 * @param {HTMLIFrameElement} iframe - iframe 元素
 */
function handleModalVideoLoad(modalId, iframe) {
  const modal = document.getElementById(modalId);
  const skeleton = document.getElementById(`${modalId}-skeleton`);
  
  if (modal && skeleton) {
    // 添加載入完成的樣式類別
    iframe.classList.add('loaded');
    
    // 隱藏載入骨架
    setTimeout(() => {
      skeleton.style.opacity = '0';
      setTimeout(() => skeleton.style.display = 'none', 500);
    }, 300);
    
    // 記錄載入統計
    if (window.videoLoadStats) {
      window.videoLoadStats.showreelLoaded++;
      console.log(`影片載入完成: ${modalId}, 已載入: ${window.videoLoadStats.showreelLoaded}/${window.videoLoadStats.totalShowreel}`);
    }
  }
}

/**
 * 關閉指定的模態框
 * @param {string} modalId - 要關閉的模態框 ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // 觸發模糊消失效果
  modal.classList.remove('show');
  
  // 隱藏模態框
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
  
  // 恢復頁面滾動
  document.body.style.overflow = 'auto';
  
  // 重置 iframe 和骨架狀態
  const iframe = modal.querySelector('.modal-iframe');
  const skeleton = modal.querySelector('.modal-skeleton');
  
  if (iframe) {
    iframe.classList.remove('loaded');
    iframe.style.display = 'none';
  }
  if (skeleton) {
    skeleton.style.display = 'block';
    skeleton.style.opacity = '1';
  }
}

// ============================================================================
// NEWSLETTER SUBSCRIPTION HANDLER
// ============================================================================

/**
 * 處理電子報訂閱表單提交
 * @param {Event} event - 表單提交事件
 */
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.email.value;
  
  // 簡單驗證
  if (!email || !email.includes('@')) {
    alert('請輸入有效的 Email 地址');
    return;
  }
  
  // 這裡通常會發送 email 到伺服器
  // 目前只顯示成功訊息
  alert('感謝您的訂閱！我們會定期發送最新文章給您。');
  event.target.reset();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// 當 DOM 載入完成後設置事件監聽器
document.addEventListener('DOMContentLoaded', function() {
  
  // 點擊外部關閉行動版選單
  document.addEventListener('click', function(event) {
    const overlay = document.getElementById('mobileMenuOverlay');
    const header = document.querySelector('.mobile-header');
    
    if (overlay && overlay.classList.contains('active') && 
        !overlay.contains(event.target) && 
        !header.contains(event.target)) {
      closeMobileMenu();
    }
  });

  // ESC 鍵關閉行動版選單
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // 點擊外部關閉迷你聯絡表單彈窗
  document.addEventListener('click', function(event) {
    const modal = document.getElementById('miniContactModal');
    if (modal && event.target === modal) {
      closeMiniContact();
    }
  });

  // ESC 鍵關閉迷你聯絡表單彈窗
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMiniContact();
    }
  });

  // 設置迷你聯絡表單提交處理
  const miniContactForm = document.querySelector('.mini-contact-form');
  if (miniContactForm) {
    miniContactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 獲取表單資料
      const formData = new FormData(this);
      const name = formData.get('Name');
      const email = formData.get('Email');
      const message = formData.get('Message');
      
      // 驗證
      if (!name || !email || !message) {
        alert('請填寫所有必填欄位');
        return;
      }
      
      // 顯示載入狀態
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '送出中...';
      submitBtn.disabled = true;
      
      // 使用 Formspree 提交表單
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          alert('感謝您的訊息！我們將在 24 小時內回覆。');
          closeMiniContact();
        } else {
          throw new Error('提交失敗');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('提交失敗，請稍後再試或直接聯絡我們。');
      })
      .finally(() => {
        // 恢復按鈕狀態
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // 點擊 ESC 鍵關閉影片模態框
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // 關閉所有開啟的模態框
      const openModals = document.querySelectorAll('.modal[style*="block"]');
      openModals.forEach(modal => {
        const modalId = modal.id;
        closeModal(modalId);
      });
    }
  });

  // 點擊外部關閉影片模態框
  document.addEventListener('click', function(event) {
    const openModals = document.querySelectorAll('.modal[style*="block"]');
    openModals.forEach(modal => {
      if (event.target === modal) {
        const modalId = modal.id;
        closeModal(modalId);
      }
    });
  });
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * 平滑滾動到指定元素
 * @param {string} targetId - 目標元素的 ID
 */
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * 檢查元素是否在視窗中可見
 * @param {Element} element - 要檢查的元素
 * @returns {boolean} 是否可見
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 防抖函數
 * @param {Function} func - 要防抖的函數
 * @param {number} wait - 等待時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ============================================================================

// 如果使用 ES6 模組系統，可以取消註解以下程式碼
/*
export {
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  openMiniContact,
  closeMiniContact,
  handleModalVideoLoad,
  closeModal,
  handleNewsletter,
  smoothScrollTo,
  isElementInViewport,
  debounce
};
*/
