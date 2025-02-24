## 📅 개발 기간
- 2025-01-20 ~ 2025-02-22


## 📜프로젝트 개요
- 캘린더와 지도를 활용해 예약 가능한 날짜를 설정하고, 체험 상품을 예약하는 플랫폼입니다.

## ✨ 주요 기능
- 🌍 간편 로그인(kakao)
- 📝 일정 추가, 수정, 삭제 기능
- 💾 체험 예약 및 후기 등록
- 📅 주간 및 월간 일정 조회 

## 🔧기술 스택
![image](https://github.com/user-attachments/assets/722284fd-85a5-4542-8b38-6bb9380d53a0)

## 컨벤션
<details>
  <summary>
    Naming Conventions
  </summary>

  
## 디렉토리 & 파일명

> 케밥 케이스(KebabCase) 
**`ex) auth , main. 여러단어시) user-profile`**
> 

## 컴포넌트

> 파스칼 케이스(PascalCase) 
**`ex) ItemComponent`**
> 

## 변수명

> 카멜 케이스(camelCase) 
**`ex) itemData`**
> 

## 커스텀훅

> use + 파스칼 케이스(PascalCase)
**`ex) useItemData.tsx`**
> 

## 이미지 & 아이콘

> img, ic + 스네이크 케이스(snake_case)
**`ex) img_item.svg  ic_item.svg`**
> 

## id

> 파스칼 케이스(PascalCase)
**`ex) Button  ButtonPrimary`**  
</details>


## 👨‍👩‍👧‍👦 R&R

| 팀원  | 담당 역 |
| ------------- | ------------- |
| 김진희  | 메인 페이지 |
| 김태완  | 예약 내역, 예약 현황 |
| 이주훈  | 로그인, 회원 가입, 내정보 |
| 오명섭  | 체험 상세 |
| 윤예지  | 내 체험 관리, 알림 내역 |

## 페이지별 작업 후기
<details>
  <summary>
    메인 페이지
  </summary>

# 1. 발생, 해결한 이슈들
- api 연동하는 부분이 어려워서 팀원분들 도움을 받음
- swiper 전체 박스 width 설정을 안하면 width가 무한대로 늘어나는 현상이 있었음 → width값 꼭 설정할 것

# 2. 잘 구현한 점(추가기능)
- 메인 페이지에서 swiper 라이브러리를 적절히 활용, 배너 이미지가 자동으로 바뀜
- 검색시 검색결과가 나오는 부분을 컴포넌트화, 통으로 바뀌게끔 구현
- 다크모드 색상은 최대한 일관되게 구현
</details>

<details>
  <summary>
    로그인
  </summary>
  
# 1. 발생, 해결한 이슈들

1. 간편로그인
    1. 로그인이 불가능시 403 or 404 오류가 발생했는데, 가이드 문서에는 로그인에서 404 오류 발생시 회원가입을 진행하라는 말이 있었음. 실제로 개발하고 오류를 직면하며, 새로운 403이라는 오류가 생겨 예외조건으로 수정
    2. 처음 구현시 로그인이 안되면 회원가입 진행하게 코드를 구현했지만, 인가 코드가 한번 사용되고 다시 사용이 불가능하여 로그인 페이지와 회원가입 페이지에서 분리하여 각각의 기능을 수행하게 변경하여 구현성공
2. Navbar 프로필 관리
    1. 프로필관리
        1. Zustand 상태 관리 덕분에 **전역 상태가 업데이트되면 UI도 자동으로 변경**됨
        2. SessionStorage를 이용해 User의 정보를 가져옴
        3. set() 호출시 Zustand가 React의 리렌더링을 트리거하여 **UI가 새로고침 없이 변경됨**
            1. **프로필 변경**
            2. `updateNickname()` 또는 `updateProfileImageUrl()`이 호출됨
            3. `useAuthStore`의 `user` 상태가 업데이트됨
            4. Zustand를 사용하고 있는 `Navbar` 컴포넌트가 변경된 `user` 정보를 반영하여 리렌더링됨

# 2. 잘 구현한 점(추가기능)

1. 로그인페이지에서 이메일 저장
    1. useState를 활용해 이메일 저장 상태 관리
    2. LocalStorage를 활용해 이메일 저장 기능
    3. 사용자가 체크박스를 클릭하면 `setSaveEmail((prev) => !prev)`를 호출하여 상태를 변경.
    4. 사용자가 체크박스를 활성화(`saveEmail === true`)하면, 로그인 성공 시 이메일을 `localStorage`에 저장.
  
</details>

<details>
  <summary>
    체험 상세
  </summary>

# 1. 발생, 해결한 이슈들

체험 예약 캘린더 컴포넌트 내 상태 관리 중 마운트 시기에 따른 초기화 현상이 발생하여

전역으로 상태 관리하도록 수정

동일한 문제가 발생하여 분석 후 pagenation에서는 컴포넌트 내 상태 관리하도록 수정함.

# 2. 잘 구현한 점(추가기능)

Image에 priority 를 사용해 메인 이미지 즉시 로드하여 LCP(Largest Contentful Paint) 개선
![스크린샷 2025-02-14 193313](https://github.com/user-attachments/assets/bb554695-0b57-4f10-9482-c8176400963d)
![스크린샷 2025-02-14 193452](https://github.com/user-attachments/assets/846b56e1-2003-4a25-ae2f-b5fbe698049c)



예약 불가와 예약 가능 구분하여 사용자 편의성을 높힘

리뷰 데이터 없을 경우 처리

</details>

<details>
  <summary>
    체험 관리
  </summary>

# 1. 발생, 해결한 이슈들

1. react hook form으로 새로운 행 등록시 기존행 값 초기화현상
    
    시간변경, 날짜변경시 값을 업데이트하면 상태변경이 비동기적으로 이루어져서 폼값이 제대로 동기화가 안되었다. useFieldArray 함수를 사용해서 배열형태의 업데이트로 값을 업데이트해주었다.
    
2. 체험등록시 수작업이 많이 필요한 시간등록 현상
    
    주간자동생성 기능을 추가해 1~5주 정도 일정을 자동생성하게 추가하였다.
    

# 2. 잘 구현한 점(추가기능)

1. 무한스크롤시 쿼리키, 스크롤, fetching 등 공통적인 요소를 컴포넌트로 구현하였다.
    
    함수 fetching 과 커스텀 css 를 해주어 원하는 블럭 요소안에 무한스크롤 기능을 제공하였다.
    
- react hook form 사용한 input 컴포넌트제공

많은 state를 사용하지않고 react hook form 과 custom input 컴포넌트를 만들어서 state관리, 정규식관리

에러메시지관리를 한번에 제공하였다.

</details>

<details>
  <summary>
    예약내역
  </summary>

# 1. 발생, 해결한 이슈들

   가. 사이드 네비게이션

- 기존: 선택한 메뉴에 따른 컴포넌트 렌더링 방식 활용
- 이 방식은 최초 상위 컴포넌트 렌더링 시 import해서 불러온 하위 컴포넌트들을 모두 로드할때까지 시간이 소요되기에 렌더링 성능이 저하된다고 판단

# 2. 잘 구현한 점(추가기능)

   가. 사이드 네비게이션 - 병렬 라우팅(parallel routes) 적용

- 병렬 라우팅: 동시에 또는 조건에 따라 동일한 레이아웃에서 하나 이상의 페이지를 렌더링 할 수 있게 해준다.
    ![스크린샷 2025-02-19 142429](https://github.com/user-attachments/assets/e5bb07d9-8710-47b4-bf16-976c16866d48)
    
- 장점
    - 페이지 로딩 속도 향상
        - 각 라우트를 독립적으로 로드할 수 있어 빠르게 보이는 부분부터 렌더링 가능
    - UX 개선
        - 빠르게 보이기 때문에 사용자에게 빈 화면을 보여주는 시간이 적다
    - 비동기 작업에 최적화
        - 기존 방식대로일 경우 자식 컴포넌트에서 api 요청이 늦어진다면 관련된 컴포넌트도 영향을 받지만, 병렬 라우팅은 영향을 받지 않는다.
- 사용하는 경우
    - 대시보디 및 관리자 패널: 여러 개의 동시 렌더링 페이지 구현
    - 커뮤티니, 뉴스 피드: 다양한 종류의 콘텐츠를 병렬로 렌더링
    - 상점 카테고리 및 제품 목록 등등등
- 적용 후 개선사항
    - 각 페이지, 내부 모달에 경로를 부여함으로써 뒤로가기 버튼 클릭시 마이페이지에 머무를 수 있음
    - 페이지 성능 테스트 시 미약하지만 유의미한 결과 도출
        - FCP(사용자가 볼 수 있는 첫 번재 요소를 렌더링 하는데 걸린 시간)
        - 그외 start render, page weight에서 일정 수준 감소 확인
- <병렬 라우팅 적용 전>
![스크린샷 2025-02-14 112806](https://github.com/user-attachments/assets/464d55d8-0b32-458d-8514-8f1b9df87c26)

- <병렬 라우팅 적용 후>
![스크린샷 2025-02-14 112734](https://github.com/user-attachments/assets/3ed28a11-1729-477f-9b17-de6ff6e6e1bb)

  </details>

  
## 라이브러리 사용 & 느낌점
<details>
  <summary>
    사용 라이브러리
  </summary>
  - swiper
  - next-themes
  - lucide-react
  - react-hook-form
  - kakao map
  - antd
</details>
<details>
  <summary>
    느낀점
  </summary>

react-hook-form

react 상태를 이용하지않고 폼의 입력값을 dom의 기본상태로이용하는 원리라 불필요한 렌더링을 막는다.

정규식기반의 유효성검사 및 결과를 error 객체에 저장하여 손쉽게 에러제어가가능하다.

내장되어있는 useFieldArray 훅을사용하면 폼 안에서 **동적으로 변화하는 필드 리스트**를 손쉽게 관리할 수 있다.

swiper

- 불필요한 기능이 없어서 오히려 가벼운 느낌.
- 반응형에 최적화 되어있어서 구현하기 까다롭지 않았고, swiper/react 처럼 우리가 사용하는 프레임워크와 호환성이 좋았다.
- 내장되어 있는 기능들(네비게이션 등)에 대해서 내가 원하는대로 커스텀하기 쉽지않았다.

lucide-react

- Feather Icons를 기반으로 한 아이콘 라이브러리로 크기가 가볍고 성능이 뛰어남.
- 사용법이 직관적이며 Tailwind와 조합이 용이

```jsx
<Loader2 className="animate-spin" />
```

- Next 및 React와 호환성이 좋음 → 필요한 아이콘만 가져오면 됨.

```jsx
import { Loader2 } from 'lucide-react'
```

- 하지만 개수가 한정적이고, 추가적인 설정과 use client 선언하지 않으면 SSR에서 아이콘이 깨지는 이슈가 있음.
- 결론적으로 간단한 구현과 성능 최적화면에서는 좋은 선택지 같음.

kakao map

위치 지정 및 map 내에서 다양한 기능을 사용할 수 있었습니다.

국내 주소는 가능하지만 해외 주소는 사용 불가한 점이 아쉬웠습니다.

antd

다양한 컴포넌트들이 많고 커스텀 범위가 다른 라이브러리 보다 많이 좋았습니다.

다만 최신 버전에는 호환성 문제가 있어 한단계 낮춰 사용 권장이 조금 아쉬웠습니다.
</details>

## 시연 영상
https://github.com/user-attachments/assets/9236f1b7-a430-4755-ac9c-da947b960570


## 🚀 빠른 시작
```bash
git clone https://github.com/codeit-part4-6/GlobalNomad.git
cd GlobalNomad
npm install
npm run dev
