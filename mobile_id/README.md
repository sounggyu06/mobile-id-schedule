# 모바일신분증 · 내 일정 관리 PoC [ 공모전 전용입니다 ]

## 실행

`index.html`을 열면 실행됩니다. 설치할 프로그램이 없습니다.

- 기존 화면을 아래로 내리면 ‘내 일정 관리’ 항목이 나옵니다.
- 화면 아래 ‘내 일정 관리’ 버튼으로 신청목록에 바로 들어갈 수도 있습니다.
- 일정을 누르면 신분증 사용 가능 여부와 준비물이 나옵니다.
- ‘문자 수신’을 누르면 잠금화면으로 이동하고 잠시 후 문자가 도착합니다.
- 알림을 누르면 문자 대화가 열립니다. 문자 안의 링크를 누르면 해당 일정으로 이동합니다.

## 기관 연계 시연

호스팅 후 같은 브라우저의 다른 탭에서 `institution.html`을 엽니다. 연계 동의를 선택하고 예약하면 모바일 화면의 일정에 자동 반영됩니다. 예약을 취소하면 취소 상태도 반영됩니다.

예: 메인 주소가 `https://sounggyu06.github.io/mobile-id-schedule/`이면 기관 화면은 `https://sounggyu06.github.io/mobile-id-schedule/institution.html`입니다. 게시 후에 사용할 주소 예시입니다.

직접 파일을 여는 경우 브라우저마다 파일 간 저장소 공유가 달라 기관 창 연계는 호스팅 주소에서 확인하는 것을 권장합니다.

## 시연 범위

사용자가 제공한 원본 화면 이미지를 표시하고 ‘내 일정 관리’를 추가한 제안 시연입니다. 기존 신분증 카드의 발급·조회 기능은 연결하지 않았습니다.

인물·기관·예약·신분증 인정 기준은 가상의 예시입니다. 실제 기관이나 공식 모바일신분증 시스템에 연결하지 않습니다. 잠금화면과 문자는 웹 화면 안의 시연이며 실제 SMS·푸시를 발송하지 않습니다. ‘문자 수신’ 버튼으로 방문 전 알림 상황을 재현합니다. 자동 예약 수집·예약 시각에 맞춘 실제 발송은 구현하지 않았습니다.

예약·체크·읽음 상태는 해당 브라우저의 저장소에만 저장합니다. 다른 기기나 다른 브라우저와 공유하지 않습니다. 처음 상태로 돌아가려면 해당 사이트 데이터를 삭제하거나 새로운 비공개 창에서 엽니다.

## GitHub Pages 게시

1. GitHub에서 `mobile-id-schedule`이라는 **Public** 저장소를 만듭니다. ‘Add a README file’을 선택하면 업로드 메뉴를 쉽게 찾을 수 있습니다.
2. 저장소의 **Add file → Upload files**에서 이 폴더 안의 파일들을 올립니다. ZIP이나 상위 폴더를 올리지 않습니다. 저장소 첫 화면에 `index.html`이 바로 보여야 합니다.
3. **Commit changes**로 저장합니다.
4. **Settings → Pages**에서 Source를 **Deploy from a branch**, Branch를 **main**, 폴더를 **/(root)**로 선택하고 **Save**를 누릅니다.
5. 게시가 완료되면 Pages 화면에 표시되는 **Visit site**로 접속합니다. 반영에는 최대 10분 정도 걸릴 수 있습니다.

수정할 때는 같은 이름의 파일을 다시 업로드하고 Commit changes를 누릅니다. 공개 저장소이므로 실제 개인정보는 넣지 마세요.

공식 안내: [Pages 사이트 만들기](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [게시할 브랜치 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
