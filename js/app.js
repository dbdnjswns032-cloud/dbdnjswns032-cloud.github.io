/**
 * 메인 페이지 게시글 목록 및 태그 필터링
 */
(function() {
  let allPosts = [];
  let allTags = new Set();
  let activeTag = null;

  const postsContainer = document.getElementById('posts-container');
  const tagsContainer = document.getElementById('tags-container');

  // posts.json 로드
  async function loadPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('posts.json을 찾을 수 없습니다.');
      }
      allPosts = await response.json();
      
      // 태그 수집
      allPosts.forEach(post => {
        if (Array.isArray(post.tags)) {
          post.tags.forEach(tag => allTags.add(tag));
        }
      });

      renderTags();
      renderPosts(allPosts);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      postsContainer.innerHTML = `
        <div class="no-posts">
          <p>게시글을 불러올 수 없습니다.</p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">pages/ 폴더에 마크다운 파일을 추가하고 배포해주세요.</p>
        </div>
      `;
    }
  }

  // 태그 렌더링
  function renderTags() {
    if (allTags.size === 0) {
      document.getElementById('tags-section').style.display = 'none';
      return;
    }

    const sortedTags = Array.from(allTags).sort();
    
    tagsContainer.innerHTML = sortedTags.map(tag => `
      <span class="tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>
    `).join('');

    // 태그 클릭 이벤트
    tagsContainer.querySelectorAll('.tag').forEach(tagEl => {
      tagEl.addEventListener('click', () => {
        const tag = tagEl.dataset.tag;
        
        if (activeTag === tag) {
          // 같은 태그 클릭 시 필터 해제
          activeTag = null;
          tagEl.classList.remove('active');
          renderPosts(allPosts);
        } else {
          // 다른 태그 클릭 시 필터 적용
          activeTag = tag;
          tagsContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          tagEl.classList.add('active');
          
          const filtered = allPosts.filter(post => 
            Array.isArray(post.tags) && post.tags.includes(tag)
          );
          renderPosts(filtered);
        }

        // 검색 입력 초기화
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.value = '';
        }
      });
    });
  }

  // 게시글 목록 렌더링
  function renderPosts(posts) {
    if (posts.length === 0) {
      postsContainer.innerHTML = `
        <div class="no-posts">
          <p>게시글이 없습니다.</p>
        </div>
      `;
      return;
    }

    postsContainer.innerHTML = posts.map(post => `
      <article class="post-card">
        <h2 class="post-card-title">
          <a href="post.html?file=${encodeURIComponent(post.file)}">${escapeHtml(post.title)}</a>
        </h2>
        <div class="post-card-meta">
          <time>${escapeHtml(post.date)}</time>
          ${post.category ? `<span>${escapeHtml(post.category)}</span>` : ''}
        </div>
        ${post.excerpt ? `<p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
        ${post.tags && post.tags.length > 0 ? `
          <div class="post-card-tags">
            ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  // HTML 이스케이프
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 전역으로 내보내기 (검색에서 사용)
  window.blogApp = {
    getPosts: () => allPosts,
    renderPosts: renderPosts,
    getActiveTag: () => activeTag,
    clearTagFilter: () => {
      activeTag = null;
      tagsContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    }
  };

  // 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPosts);
  } else {
    loadPosts();
  }
})();

