/**
 * 다크/라이트 모드 테마 토글
 */
(function() {
  const STORAGE_KEY = 'blog-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  // 저장된 테마 또는 시스템 설정 가져오기
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    // 시스템 다크모드 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  // 테마 적용
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Giscus 테마 업데이트 (있는 경우)
    updateGiscusTheme(theme);
  }

  // Giscus 댓글 시스템 테마 업데이트
  function updateGiscusTheme(theme) {
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
      const giscusTheme = theme === DARK ? 'dark' : 'light';
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  }

  // 테마 토글
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;
    setTheme(next);
  }

  // 초기화
  function init() {
    // 초기 테마 설정
    const theme = getPreferredTheme();
    setTheme(theme);

    // 토글 버튼 이벤트 리스너
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 사용자가 직접 테마를 선택하지 않은 경우에만 시스템 설정 따르기
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역 함수로 내보내기 (다른 스크립트에서 사용 가능)
  window.blogTheme = {
    toggle: toggleTheme,
    set: setTheme,
    get: () => document.documentElement.getAttribute('data-theme')
  };
})();

