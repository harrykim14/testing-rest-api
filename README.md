### Nextjs + React-testing-library로 배우는 모던 리액트 소프트웨어 테스트 Section 2

[Udemy 강의 링크](https://www.udemy.com/course/nextjs-react-testing-library-react/)

일시: 2021-03-30 ~

- 이 섹션에서 배울 수 있는 것

  - django rest framework를 이용한 간단한 REST api 설계
  - Jest 및 Testing Library의 사용법

### ANACONDA Navigator를 이용한 가상환경 설정

- 새 환경을 아나콘다에서 생성하고 필요한 모듈을 설치한다

```
pip install Django==3.1
pip install django-cors-headers==3.4.0
pip install djangorestframework==3.11.1
pip install djangorestframework-simplejwt==4.6.0
pip install djoser==2.0.3
```

### **CORS(Cross Origin Resource Sharing)란?**

[참고 페이지](https://oen-blog.tistory.com/46)

- 도메인 또는 포트가 다른 서버의 자원을 요청하는 매커니즘

- CORS 문제는 다른 도메인의 서버로부터 요청이 들어왔을 때, 헤더에 접근을 허락하는 내용이 없으면 발생한다

- 예를 들어 클라이언트는 localhost:3000이고 외부 서버는 localhost:8000이면 포트가 달라서 CORS가 발생할 수 있다

- django-cors-headers는 response에 CORS 헤더를 추가해준다

### **jwt(JSON web token)란?**

[공식 페이지](https://jwt.io/introduction)

- JSON Web Token (JWT) 은 웹표준 (RFC 7519) 으로서 두 개체에서 JSON 객체를 사용하여 가볍고 자가수용적인 (self-contained) 방식으로 정보를 안전성 있게 전달해줌

- 회원 인증 및 정보 교류에 사용됨

- JWT는 .을 구분자로 3가지 문자열(헤더, 내용, 서명)로 구성되어 있다

#### 1. 헤더 (header)

- 헤더는 typ(타입)와 alg(해싱 알고리즘)으로 구성되어 있다

```
{
  "typ": "JWT",
  "alg": "HS256"
}
```

#### 2. 정보 (payload)

- 정보에는 토큰에 담을 정보가 들어 있다

- 등록된 클레임, 공개 클레임, 비공개 클레임으로 나뉜다

- 등록된 클레임은 선택적으로 사용할 수 있으며 이에 포함된 클레임 이름은 다음과 같다

  > **iss**: 토큰 발급자 (issuer)
  > 
  > **sub**: 토큰 제목 (subject)
  > 
  > **aud**: 토큰 대상자 (audience)
  > 
  > **exp**: 토큰의 만료시간 (expiraton), 시간은 NumericDate 형식으로 되어있어야 하며 (예: 1480849147370) 언제나 현재 시간보다 이후로 설정되어있어야합니다.
  > 
  > **nbf**: Not Before 를 의미하며, 토큰의 활성 날짜와 비슷한 개념입니다. 여기에도 NumericDate 형식으로 날짜를 지정하며, 이 날짜가 지나기 전까지는 토큰이 처리되지 않습니다.
  > 
  > **iat**: 토큰이 발급된 시간 (issued at), 이 값을 사용하여 토큰의 age 가 얼마나 되었는지 판단 할 수 있습니다.
  > 
  > **jti**: JWT의 고유 식별자로서, 주로 중복적인 처리를 방지하기 위하여 사용됩니다. 일회용 토큰에 사용하면 유용합니다.

- 공개 클레임은 URI형식으로 작성하며 비공개 클레임은 클라이언트와 서버 간 협의하에 사용되는 클레임으로 이름이 중복되어 충돌 할 수도 있다

#### 3. 서명 (signature)

- 헤더의 인코딩값과 정보의 인코딩값을 연결해 주어진 비밀키로 해쉬를 하여 생성

```
// 서명 생성 슈도 코드, 이 작업 이후에 hex에서 base64 인코딩을 한번 더 함
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### PyCharm을 사용해 REST API 구축

- 새 프로젝트를 생성하고 파이썬 인터프리터를 위에서 아나콘다 내비게이터로 생성한 환경으로 설정

```
django-admin startproject [project_name] .
django-admin startapp [app_name]
```

- 프로젝트 기본 세팅

```python
# project_name으로 설정한 폴더 내 setting.py 파일에 아래 내용을 추가
INSTALLED_APPS = [
    'rest_framework',
    'djoser',
    'api.apps.ApiConfig', # <- api 경로에 맞춰 작성할 것
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000" # <- 프론트에서 사용하는 주소를 적으면 된다 포트번호 주의!
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES':[
        'rest_framework.permissions.IsAuthenticated', # 인증된 유저만 API를 열람할 수 있도록 하기
    ],
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework_simplejwt.authentication.JWTAuthentication', # jwt를 사용하여 인증을 진행
    ]
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # 타임델타를 사용하여 jwt 토큰의 유효기간을 60분으로 설정
}

TIME_ZONE = 'Asia/Seoul'
```

- api의 모델 설정

```python
# api 폴더 내 models.py
from django.db import models
from django.contrib.auth.models import User # django에서 기본적으로 지원하는 User 모델

class Blog(models.Model):
    user = models.ForeignKey(                # RDBMS에서 주로 사용되는 foreign key와 동일
        User,                                # 첫번째 인자로 어떤 데이터와 연관될 것인지를 받고
        on_delete=models.CASCADE,            # 두번째 인자로 삭제될 때 어떻게 삭제될 것인지의 옵션을 받음
    )
    title = models.CharField(max_length=300) # 해당 데이터의 타입을 정의 (CharField의 길이 100)
    content = models.TextField()
    tags = models.ManyToManyField('Tag')     # 다대다관계로 기본 Foreign key와 동일하나 관련된 객체를 필드의 RelatedManager를 사용해 추가, 삭제, 생성할 수 있다
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

- 모델을 작성하였다면 해당 모델을 이전(migration)시켜준다

```
python manage.py makemigrations
python manage.py migrate
```

- API 내부에서 암호화를 설정한다

```python
# api 폴더 내에 serializers.py를 새로 작성
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True, 'required': True, 'min_length': 5}} # Meta Class write only 설정

     def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # django에서 지원하는 create_user 메소드를 사용하면 유저의 정보를 자동으로 해쉬화해준다
        return user
```

- 작성한 REST API에 접근하기 위한 URL도 작성한다

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('get-blogs', views.BlogReadOnlyView)

app_name = 'blog'

urlpatterns =[
    path('', include(router.urls)),
    path('', include('djoser.urls.jwt')),
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('delete-blog/<str:pk>/', views.DeleteBlogView.as_view(), name='delete-blog'),
]
```

- 해당 api를 프로젝트 쪽에서 접근하기 위해서는 project 쪽 url에 위에서 작성한 REST API의 URL을 포함시켜주어야 한다
- 또, admin 페이지에서 모델을 관리하려면 모델들을 등록시켜주어야 함

```python
# [project_name] 폴더 내 urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# [REST API] 폴더 내 admin.py
from django.contrib import admin
from . import models

admin.site.register(models.Tag)
admin.site.register(models.Blog)

```

- 마지막으로 superuser를 작성한다

```
This password is too common.
This password is entirely numeric.
// 라는 메세지가 뜨면 너무 간단한 비밀번호이므로 실제로 사용할 때엔 주의할 것
```
