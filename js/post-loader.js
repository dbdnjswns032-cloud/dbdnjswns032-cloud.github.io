/**
 * 게시글 마크다운 로딩 및 Giscus 댓글 시스템
 */
(function() {
  const titleEl = document.getElementById('post-title');
  const dateEl = document.getElementById('post-date');
  const categoryEl = document.getElementById('post-category');
  const tagsEl = document.getElementById('post-tags');
  const contentEl = document.getElementById('post-content');
  const giscusContainer = document.getElementById('giscus-container');

  // URL에서 파일명 추출
  function getFileFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('file');
  }

  // Front Matter 파싱
  function parseFrontMatter(content) {
    // UTF-8 BOM 제거
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    
    if (!frontMatterMatch) {
      return { metadata: {}, content: content };
    }

    const frontMatter = frontMatterMatch[1];
    const postContent = frontMatterMatch[2];
    const metadata = {};

    // Front Matter 라인 파싱
    const lines = frontMatter.split(/\r?\n/);
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value.slice(1, -1).split(',').map(tag => 
              tag.trim().replace(/^['"]|['"]$/g, '')
            );
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata, content: postContent };
  }

  // HTML 이스케이프
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 마크다운 렌더링
  function renderMarkdown(content) {
    // marked 설정
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        highlight: function(code, lang) {
          // Prism.js로 하이라이팅
          if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
            try {
              return Prism.highlight(code, Prism.languages[lang], lang);
            } catch (e) {
              console.warn('Prism highlight error:', e);
            }
          }
          return code;
        }
      });

      return marked.parse(content);
    }
    
    // marked가 없으면 기본 텍스트로 표시
    return `<pre>${escapeHtml(content)}</pre>`;
  }

  // Giscus 댓글 로드
  function loadGiscus() {
    if (!giscusContainer) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'dbdnjswns032-cloud/dbdnjswns032-cloud.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // GitHub Discussions 설정 후 변경 필요
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // GitHub Discussions 설정 후 변경 필요
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    // 현재 테마에 맞게 Giscus 테마 설정
    const currentTheme = document.documentElement.getAttribute('data-theme');
    script.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : 'light');

    giscusContainer.appendChild(script);
  }

  // 게시글 로드
  async function loadPost() {
    const filename = getFileFromUrl();
    
    if (!filename) {
      showError('게시글 파일이 지정되지 않았습니다.');
      return;
    }

    try {
      const response = await fetch(`pages/${filename}`);
      
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      const rawContent = await response.text();
      const { metadata, content } = parseFrontMatter(rawContent);

      // 메타데이터 표시
      const title = metadata.title || filename.replace('.md', '');
      document.title = `${title} | dbdnjswns032-cloud`;
      titleEl.textContent = title;
      
      if (metadata.date) {
        dateEl.textContent = metadata.date;
      }
      
      if (metadata.category) {
        categoryEl.textContent = metadata.category;
        categoryEl.style.display = 'inline-block';
      } else {
        categoryEl.style.display = 'none';
      }

      // 태그 표시
      if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
        tagsEl.innerHTML = metadata.tags.map(tag => 
          `<span class="tag">${escapeHtml(tag)}</span>`
        ).join('');
      }

      // 마크다운 렌더링
      contentEl.innerHTML = renderMarkdown(content);

      // Prism.js로 코드 하이라이팅 재적용 (autoloader 사용 시)
      if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(contentEl);
      }

      // Giscus 로드
      loadGiscus();

    } catch (error) {
      console.error('게시글 로드 실패:', error);
      showError('게시글을 불러올 수 없습니다.');
    }
  }

  // 에러 표시
  function showError(message) {
    titleEl.textContent = '오류';
    contentEl.innerHTML = `
      <div class="no-posts" style="text-align: center; padding: 2rem;">
        <p>${escapeHtml(message)}</p>
        <p style="margin-top: 1rem;">
          <a href="index.html">← 목록으로 돌아가기</a>
        </p>
      </div>
    `;
  }

  // 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPost);
  } else {
    loadPost();
  }
})();

