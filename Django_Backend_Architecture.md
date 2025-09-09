# Django 백엔드 아키텍처 문서

## 📋 개요
이 프로젝트는 Django REST Framework를 사용한 백엔드 API 서버입니다. Spring Boot와는 다른 Django의 MVT(Model-View-Template) 패턴을 기반으로 구성되어 있습니다.

## 🏗️ 전체 아키텍처

```
backend/
├── manage.py                    # Django 프로젝트 관리 스크립트
├── requirements.txt             # Python 의존성 패키지 목록
├── db.sqlite3                   # SQLite 데이터베이스 파일
├── chart_backend/               # 프로젝트 설정 디렉토리 (Django 프로젝트 루트)
│   ├── __init__.py
│   ├── settings.py              # 프로젝트 설정 파일
│   ├── urls.py                  # 메인 URL 라우팅 설정
│   └── wsgi.py                  # WSGI 배포 설정
├── community/                   # 커뮤니티 앱 (게시판 기능)
│   ├── models.py                # 데이터 모델 정의
│   ├── views.py                 # API 뷰 로직
│   ├── serializers.py           # 데이터 직렬화/역직렬화
│   ├── urls.py                  # 앱별 URL 라우팅
│   └── admin.py                 # Django 관리자 페이지 설정
├── ai/                          # AI/요약 서비스 모듈
│   └── services.py              # 텍스트 요약 등 AI 유틸 함수
└── stocks/                      # 주식 데이터 앱
    ├── services.py              # 외부 API 호출 서비스
    └── urls.py                  # 앱별 URL 라우팅
```

## 🔧 핵심 파일 분석

### 1. manage.py
**역할**: Django 프로젝트의 진입점이자 관리 스크립트
**Spring Boot 비교**: `Application.java`의 `main` 메서드와 유사

```python
# 주요 기능:
# - Django 서버 실행: python manage.py runserver
# - 데이터베이스 마이그레이션: python manage.py migrate
# - 관리자 계정 생성: python manage.py createsuperuser
# - 앱 생성: python manage.py startapp <app_name>
```

### 2. chart_backend/settings.py
**역할**: 프로젝트의 모든 설정을 관리하는 중앙 설정 파일
**Spring Boot 비교**: `application.properties` 또는 `application.yml`과 유사

#### 주요 설정 항목:
- **SECRET_KEY**: 보안을 위한 비밀 키
- **DEBUG**: 개발/프로덕션 모드 설정
- **ALLOWED_HOSTS**: 허용된 호스트 목록
- **INSTALLED_APPS**: 설치된 앱 목록 (Spring의 @ComponentScan과 유사)
- **MIDDLEWARE**: 요청/응답 처리 미들웨어 (Spring의 Filter와 유사)
- **DATABASES**: 데이터베이스 설정
- **REST_FRAMEWORK**: DRF(Django REST Framework) 설정
  - DEFAULT_RENDERER_CLASSES: JSON 전용
  - DEFAULT_PARSER_CLASSES: JSON 전용
- **국제화/타임존**: LANGUAGE_CODE=`ko-kr`, TIME_ZONE=`Asia/Seoul`, USE_TZ=True
- **정적 파일**: STATIC_URL=`static/`, STATIC_ROOT=`staticfiles`
- **WSGI**: `chart_backend.wsgi.application` (gunicorn 등 배포에 사용)

### 3. chart_backend/urls.py
**역할**: 프로젝트의 메인 URL 라우팅 설정
**Spring Boot 비교**: `@RequestMapping` 또는 `@RestController`의 클래스 레벨 매핑

```python
urlpatterns = [
    path("admin/", admin.site.urls),           # Django 관리자 페이지
    path("api/community/", include("community.urls")),  # 커뮤니티 앱 URL 포함
    path("api/stocks/", include("stocks.urls")),        # 주식 앱 URL 포함
]
```

### 현재 라우팅 구성 (정리 반영)
- 루트 `chart_backend/urls.py`에서 모든 상위 경로를 일원화합니다.
  - `admin/`, `api/auth/`, `api/community/`, `api/stocks/`, `api/analysis/`
- `community/urls.py`는 DRF 라우터 경로만 포함합니다.

적용 사항:
- 루트에 `path("api/auth/", include("rest_framework.urls"))` 추가 완료
- `community/urls.py`는 라우터만 노출 (중복 경로 제거 상태 확인됨)

## 📱 앱(App) 구조 분석

Django에서 앱은 특정 기능을 담당하는 독립적인 모듈입니다. Spring Boot의 패키지 구조와 유사하지만, Django는 더 명확한 관심사 분리를 제공합니다.

### 1. Community 앱 (게시판 기능)

#### models.py - 데이터 모델
**Spring Boot 비교**: JPA Entity 클래스와 유사

```python
class Post(models.Model):
    title = models.CharField(max_length=200)      # 제목
    content = models.TextField()                  # 내용
    author = models.ForeignKey(User, ...)         # 작성자 (외래키)
    created_at = models.DateTimeField(auto_now_add=True)  # 생성일시
    updated_at = models.DateTimeField(auto_now=True)      # 수정일시

class Comment(models.Model):
    post = models.ForeignKey(Post, ...)           # 게시글 (외래키)
    content = models.TextField()                  # 댓글 내용
    author = models.ForeignKey(User, ...)         # 작성자
    # ... 시간 필드들
```

#### serializers.py - 데이터 직렬화
**Spring Boot 비교**: DTO(Data Transfer Object) 클래스와 유사

```python
class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ["id", "title", "content", "author", "author_username", ...]
```

#### views.py - API 뷰 로직
**Spring Boot 비교**: `@RestController`와 `@Service`의 조합

```python
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
```

**ViewSet의 장점**:
- CRUD 작업을 자동으로 제공 (Create, Read, Update, Delete)
- Spring Boot의 `@RestController` + `@Service` 조합보다 간결

#### urls.py - 앱별 URL 라우팅
**Spring Boot 비교**: `@RequestMapping`과 유사

```python
router = DefaultRouter()
router.register(r"posts", PostViewSet)      # /api/community/posts/
router.register(r"comments", CommentViewSet) # /api/community/comments/
```

### 2. Stocks 앱 (주식 데이터)

#### services.py - 비즈니스 로직
**Spring Boot 비교**: `@Service` 클래스와 유사

```python
def fetch_price_history(symbol: str) -> Dict[str, Any]:
    # 외부 API 호출 로직
    url = f"{BASE_STOCK_API}/prices/{symbol}"
    response = requests.get(url, timeout=10)
    return response.json()
```

#### urls.py - 엔드포인트
- `GET /api/stocks/prices/<symbol>/` → 가격 히스토리 JSON 반환

#### 환경 변수 (stocks/services.py)
- `STOCK_API_KEY`: 써드파티 API 키 (예: Alpha Vantage)
- `STOCK_API_BASE`: 써드파티 API 베이스 URL (기본: `https://www.alphavantage.co`)
- `BASE_STOCK_API`: 내부/프록시 주식 API 베이스 (기본: `https://example-stock-api.local`)

네트워크 타임아웃: 10초

## 🔄 Django vs Spring Boot 비교

| 개념 | Django | Spring Boot |
|------|--------|-------------|
| **프로젝트 구조** | 프로젝트 + 앱들 | 단일 애플리케이션 + 패키지들 |
| **설정 관리** | settings.py | application.properties/yml |
| **데이터 모델** | models.py (ORM) | Entity 클래스 (JPA) |
| **API 컨트롤러** | views.py + ViewSet | @RestController |
| **데이터 변환** | serializers.py | DTO 클래스 |
| **URL 라우팅** | urls.py | @RequestMapping |
| **의존성 주입** | 자동 (ViewSet) | @Autowired |
| **데이터베이스** | ORM (Django ORM) | JPA/Hibernate |

## 🚀 Django의 주요 특징

### 1. MVT 패턴
- **Model**: 데이터 모델 (Entity)
- **View**: 비즈니스 로직 (Controller + Service)
- **Template**: 프론트엔드 (이 프로젝트에서는 React 사용)

### 2. 앱 기반 구조
- 각 앱은 독립적인 기능을 담당
- 재사용 가능한 모듈
- 명확한 관심사 분리

### 3. 자동 관리 기능
- 자동 마이그레이션 (데이터베이스 스키마 변경)
- 자동 관리자 페이지 생성
- 자동 API 문서 생성 (DRF)

### 4. 보안 기능
- CSRF 보호
- SQL 인젝션 방지 (ORM)
- XSS 보호
- 권한 관리 시스템

## 📊 API 엔드포인트

### Community API
- (표준) `GET /api/community/posts/` - 게시글 목록 조회
- (표준) `POST /api/community/posts/` - 게시글 생성
- (표준) `GET /api/community/posts/{id}/` - 특정 게시글 조회
- (표준) `PUT /api/community/posts/{id}/` - 게시글 수정
- (표준) `DELETE /api/community/posts/{id}/` - 게시글 삭제
- (표준) `GET /api/community/comments/` - 댓글 목록 조회
- (표준) `POST /api/community/comments/` - 댓글 생성
- (중복) `/api/community/api/...` 경로도 열려 있음 — 정리 권장
- (인증) `/api/community/api/auth/` - DRF 기본 로그인/로그아웃 뷰

### Stocks API
- `GET /api/stocks/prices/{symbol}/` - 주식 가격 히스토리 조회

### AI 서비스
- `ai/services.py`의 `summarize_post(content: str)`는 본문 앞 120자 요약을 반환 (간단한 유틸 수준)

## 🔧 개발 환경 설정

### 1. 가상환경 생성 및 활성화
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate     # Windows
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 데이터베이스 마이그레이션
```bash
python manage.py migrate
```

### 4. 서버 실행
```bash
python manage.py runserver
```

## 📝 추가 학습 포인트

1. **Django ORM**: Spring Data JPA와 유사하지만 더 직관적
2. **ViewSet**: Spring의 Controller + Service를 하나로 통합
3. **Serializer**: Spring의 DTO + Validation을 통합
4. **Permission**: Spring Security와 유사한 권한 관리
5. **Middleware**: Spring의 Filter와 유사한 요청/응답 처리

## 🔐 권한/인증 구성 요약
- 전역 DRF 설정: JSON 전용 렌더러/파서
- `community.views.IsAuthorOrReadOnly`: 객체 단위에서 작성자만 수정/삭제 허용
- ViewSet 권한: `IsAuthenticatedOrReadOnly` + `IsAuthorOrReadOnly`
- DRF 기본 인증 뷰: 루트 `/api/auth/`에서 제공 (로그인/로그아웃)

이 구조를 이해하시면 Django의 강력한 기능들을 활용하여 효율적인 백엔드 개발이 가능합니다!
