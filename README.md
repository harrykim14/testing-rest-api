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
  > **sub**: 토큰 제목 (subject)
  > **aud**: 토큰 대상자 (audience)
  > **exp**: 토큰의 만료시간 (expiraton), 시간은 NumericDate 형식으로 되어있어야 하며 (예: 1480849147370) 언제나 현재 시간보다 이후로 설정되어있어야합니다.
  > **nbf**: Not Before 를 의미하며, 토큰의 활성 날짜와 비슷한 개념입니다. 여기에도 NumericDate 형식으로 날짜를 지정하며, 이 날짜가 지나기 전까지는 토큰이 처리되지 않습니다.
  > **iat**: 토큰이 발급된 시간 (issued at), 이 값을 사용하여 토큰의 age 가 얼마나 되었는지 판단 할 수 있습니다.
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
