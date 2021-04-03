# MORANKAU

TypeScript로 개발된 Discord 전용 챗봇입니다.
좋아하는 게임인 Mordhau의 디스코드 서버에서 랭크 시스템으로 사용하기 위해 제작했습니다.

서버장한테 부탁받고 진행한 프로젝트라 꽤 완성도 있게 끝냈습니다만,
만들어달래놓고 정작 쓰는 사람이 없어 3달도 못 갔습니다;


## 작동 방식

봇 구동 시 src/index.ts 파일이 우선으로 실행됩니다.  
해당 파일이 src/commands/ 안쪽의 파일을 자동으로 읽어와 명령어를 실시간으로 동기화합니다.

이 방법으로 src/commands/ 안쪽에 새 기능을 수정, 추가, 제거하더라도 봇을 재구동 할 필요가 없습니다.


## 기능별 설명/사용법

### json 파일
- 모든 유저 정보들은 json 파일에 정리되어 저장됩니다.
- 아래의 명령어 중 사용자의 데이터 조정과 관련된 명령어들은 기본적으로 데이터를 찾을 수 없을 때 알아서 초기값으로 데이터를 생성합니다.

### gapPoint.ts
- 사용법: `gap [@winner] [@loser]
- 입력받은 승자와 패자의 티어 차이를 알려줍니다.

### initUser.ts
- 사용법: `init ([@mentions...] | @everyone)
- 언급된 대상의 데이터를 모두 초기값으로 초기화합니다. 없을 시 추가합니다.

### pointDown.ts
- 사용법: `pointdown [@mention]
- 언급된 대상의 포인트를 낮춥니다.
- 테스트 전용 명령어이며, 관리자만 사용 가능합니다.

### pointUp.ts
- 사용법: `pointup [@mention]
- 언급된 대상의 포인트를 올립니다.
- 테스트 전용 명령어이며, 관리자만 사용 가능합니다.

### rank.ts
- 사용법: `rank
- 본인의 티어에 따라 해당 티어 역할을 부여합니다.
- role 다루는 방법이 어려워 보류해뒀는데 아무도 안써서 자연스레 미구현.

### stats.ts
- 사용법: `stats
- 명령어 사용자의 스탯을 보여줍니다.
- 점수, 랭크, 승리/패배 횟수, 승률 등을 Embed로 보여줍니다.

### userStats.ts
- 사용법: `userstats [@mention]
- 언급된 대상의 스탯을 보여줍니다.
- 점수, 랭크, 승리/패배 횟수, 승률 등을 Embed로 보여줍니다.
- 저장된 정보가 없을 경우에도 Embed로 알립니다.

### win.ts
- 사용법: `win [@winner] to [@loser]
- 언급된 대상의 대결 결과를 처리합니다.
- 승자의 점수를 올리고 패자의 점수를 내립니다. 즉 pointUp, pointDown을 동시에 해줍니다.
- 조정된 점수에 맞춰 티어를 조정합니다.
- 승리 및 패배 횟수를 증가시키고 동시에 이에 맞춰 승률을 조정합니다.
