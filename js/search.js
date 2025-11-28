/**
 * 클라이언트 사이드 검색 기능
 */
(function() {
  const searchInput = document.getElementById('search-input');
  
  if (!searchInput) return;

  let debounceTimer = null;

  // 검색 수행
  function performSearch(query) {
    // blogApp이 로드되지 않은 경우 대기
    if (!window.blogApp) {
      console.warn('blogApp이 아직 로드되지 않았습니다.');
      return;
    }

    const searchPosts = window.blogApp.getPosts();
    
    if (!query.trim()) {
      // 검색어가 없으면 전체 목록 표시
      window.blogApp.renderPosts(searchPosts);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    const filtered = searchPosts.filter(post => {
      // 제목 검색
      if (post.title && post.title.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 발췌문 검색
      if (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 태그 검색
      if (Array.isArray(post.tags)) {
        if (post.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          return true;
        }
      }
      
      // 카테고리 검색
      if (post.category && post.category.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 설명 검색
      if (post.description && post.description.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      return false;
    });

    // 태그 필터 해제
    window.blogApp.clearTagFilter();
    
    // 결과 렌더링
    window.blogApp.renderPosts(filtered);
  }

  // 디바운스된 검색
  function debouncedSearch(query) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 200);
  }

  // 이벤트 리스너
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Enter 키 처리 (폼 제출 방지)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);
      performSearch(searchInput.value);
    }
  });

  // Escape 키로 검색 초기화
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch('');
      searchInput.blur();
    }
  });

  // 전역 키보드 단축키: Ctrl/Cmd + K로 검색창 포커스
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
})();

