---
title: '블로그에 오신 것을 환영합니다'
date: 2025-01-26
tags: ['블로그', 'GitHub Pages', 'Markdown']
category: '공지사항'
description: '첫 번째 게시글입니다. 블로그 사용법과 마크다운 문법을 소개합니다.'
---

# 블로그에 오신 것을 환영합니다! 🎉

이것은 GitHub Pages로 구축된 정적 블로그의 첫 번째 게시글입니다.

## 마크다운 문법 예시

마크다운으로 다양한 형태의 콘텐츠를 작성할 수 있습니다.

### 텍스트 스타일링

- **굵은 텍스트**는 이렇게 작성합니다
- *기울임 텍스트*도 가능합니다
- ~~취소선~~도 지원됩니다

### 코드 블록

JavaScript 코드 예시:

```javascript
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
}

greet('방문자');
```

Python 코드도 물론 가능합니다:

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
```

### 인라인 코드

함수를 호출할 때는 `functionName()`처럼 인라인 코드를 사용합니다.

### 인용문

> 훌륭한 프로그래머는 내일 할 일을 오늘 미루는 것이 아니라,
> 오늘 할 일을 내일로 자동화하는 사람이다.

### 목록

순서 없는 목록:
- 항목 1
- 항목 2
  - 중첩 항목 2-1
  - 중첩 항목 2-2
- 항목 3

순서 있는 목록:
1. 첫 번째
2. 두 번째
3. 세 번째

### 링크

- [GitHub](https://github.com)
- [이 블로그 저장소](https://github.com/dbdnjswns032-cloud/dbdnjswns032-cloud.github.io)

### 표

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 | 게시글 작성 | ✅ 완료 |
| 다크모드 | 테마 전환 | ✅ 완료 |
| 검색 | 게시글 검색 | ✅ 완료 |
| 댓글 | Giscus 댓글 | ✅ 완료 |

---

## 새 게시글 작성 방법

1. `pages/` 폴더에 새로운 `.md` 파일을 생성합니다
2. 파일 상단에 Front Matter를 작성합니다:

```markdown
---
title: '게시글 제목'
date: 2025-01-26
tags: ['태그1', '태그2']
category: '카테고리명'
description: '게시글 설명'
---
```

3. Front Matter 아래에 마크다운으로 내용을 작성합니다
4. Git으로 커밋하고 푸시하면 자동으로 배포됩니다!

즐거운 블로깅 되세요! 😊

