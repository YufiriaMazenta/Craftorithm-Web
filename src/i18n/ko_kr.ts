import type { MessageKey } from "./zh_cn";

export const koKr: Record<MessageKey, string> = {
  "brand.title": "Craftorithm 조합법 작업실",
  "brand.sub": "로그인 없이 로컬에서 플러그인 조합법 YAML을 생성합니다",

  "view.aria": "작업 공간",
  "skip.toWorkbench": "작업대로 건너뛰기",
  "view.recipe": "조합법",
  "view.packs": "아이템 팩",
  "view.triggers": "트리거",

  "tabs.aria": "열린 파일",
  "tabs.close": "{name} 닫기",
  "tabs.newRecipe": "새 조합법",
  "tabs.newTrigger": "새 트리거 파일",
  "tabs.saveAsNew": "새 탭으로 저장",
  "tabs.newMenu": "기타 새로 만들기",
  "tabs.importFiles": "파일 가져오기…",

  "start.title": "시작하기",
  "start.note": "조합법을 새로 만들거나 기존 파일을 가져와서 계속 편집하세요.",
  "start.newRecipe": "새 조합법",
  "start.importFiles": "파일 가져오기",
  "start.importFolder": "폴더 가져오기",
  "start.hint": "폴더를 가져오면 recipes, item_packs.yml, triggers를 자동으로 인식합니다.",

  "action.exportAll": "전체 내보내기",
  "toast.exportedZip": "{count}개 파일을 내보냈습니다",
  "toast.exportEmpty": "내보낼 내용이 없습니다",
  "toast.savedAsNew": "새 탭으로 복사했습니다",
  "toast.importedCount": "{count}개 파일을 가져왔습니다",
  "toast.importSkipped": "인식할 수 없는 파일 {count}개를 건너뛰었습니다",
  "toast.tabClosed": "{name}을 닫았습니다",
  "toast.typeChangedLost": "종류를 바꾸면서 재료 {count}개가 사라졌습니다. 되돌릴 수 있습니다",

  "history.undo": "되돌리기",
  "history.redo": "다시 실행",
  "history.undoOf": "{action} 되돌리기",
  "history.action.changeType": "레시피 종류 변경",
  "history.action.reset": "레시피 초기화",
  "history.action.closeTab": "파일 닫기",
  "history.action.import": "가져오기 덮어쓰기",
  "history.action.packEdit": "아이템 팩 변경",

  "step.aria": "편집 단계",
  "step.type": "종류",
  "step.edit": "편집",
  "step.export": "내보내기",

  "action.reset": "초기화",
  "action.resetRecipe": "조합법 초기화",
  "action.importYaml": "YAML 가져오기",
  "action.downloadYaml": "YAML 다운로드",
  "action.copyClipboard": "클립보드에 복사",
  "action.close": "닫기",
  "action.remove": "삭제",

  "locale.switch": "인터페이스 언어",
  "theme.switch": "테마",
  "theme.light": "밝게",
  "theme.dark": "어둡게",

  "catalog.offline": "아이템 목록이 오프라인이라 내장 목록을 사용합니다",

  "footer.aria": "소개 및 관련 링크",
  "footer.credit": "氿雾 제작 · Craftorithm 플러그인용 조합법 편집기",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "문서",
  "footer.link.qq": "QQ 그룹",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML을 클립보드에 복사했습니다",
  "toast.copyFailed": "복사에 실패했습니다. 미리 보기 내용을 직접 선택하세요",
  "toast.downloaded": "{name} 다운로드 완료",
  "toast.saved": "{name}을(를) 선택한 위치에 저장했습니다",

  "next.titleDownloaded": "{name} 다운로드 완료 — 두 단계 남았습니다",
  "next.titleSaved": "{name} 저장 완료 — 두 단계 남았습니다",
  "next.step1": "서버의 이 위치에 파일을 넣으세요(같은 이름은 덮어쓰기):",
  "next.step2": "서버 콘솔이나 게임 안에서 실행하세요:",
  "next.step3": "게임에서 제작을 시도해 보세요. 적용되지 않으면 콘솔의 로드 오류를 확인하세요.",
  "next.copyPath": "경로 복사",
  "next.copyCommand": "명령어 복사",
  "next.pathCopied": "경로를 복사했습니다",
  "next.commandCopied": "명령어를 복사했습니다",
  "next.done": "확인",
  "toast.imported": "{name} 가져오기 완료",
  "toast.recipeReset": "빈 조합법으로 초기화했습니다",
  "bench.station": "작업 블록: {name}",
  "bench.importWarnings": "가져올 때 확인이 필요한 항목 {count}건: {detail}",
  "bench.shapelessNote":
    "무순서 조합법은 재료가 모두 있는지만 확인하며 놓는 위치는 판정에 영향을 주지 않습니다.",
  "bench.inertNote":
    "클릭할 수 없는 칸은 플레이어가 게임에서 사용하며, 조합법은 이 칸에 값을 쓰지 않습니다.",
  "bench.guiAlt": "{name} 화면",
  "bench.resultOutside": "결과물 (위 화면의 결과물 칸과 동일)",

  "typeNav.aria": "조합법 종류",

  "inspector.title": "결과 및 검증",
  "inspector.resultUnset": "결과물이 아직 설정되지 않았습니다",
  "inspector.resultHint": "작업 화면에서 결과 칸을 클릭하세요",
  "inspector.slotUnset": "설정 없음",
  "inspector.mustFix": "반드시 수정할 항목 {count}건",
  "inspector.stillTodo": "{count}개 항목이 남았습니다",
  "inspector.ready": "조합법 구성이 완전하여 내보낼 수 있습니다",
  "inspector.yamlTitle": "YAML 미리 보기",
  "inspector.fixFirst": "위의 오류를 수정하면 다운로드할 수 있습니다.",

  "picker.aria": "재료 선택: {name}",
  "picker.title": "재료 선택 · {name}",
  "picker.clearSlot": "칸 비우기",
  "picker.tabsAria": "재료 종류",
  "picker.tab.item": "아이템",
  "picker.tab.tag": "태그",
  "picker.tab.item_pack": "아이템 팩",
  "picker.categoryAll": "전체",
  "picker.search.item": "아이템 이름이나 ID로 검색, 예: diamond",
  "picker.search.tag": "태그 검색, 예: planks / logs",
  "picker.search.item_pack": "아이템 팩 이름 검색",
  "picker.custom.item": "사용자 지정 아이템 ID",
  "picker.custom.tag": "사용자 지정 태그 이름",
  "picker.custom.item_pack": "사용자 지정 아이템 팩 이름",
  "picker.customPlaceholder.item": "minecraft:diamond 또는 oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "개수",
  "picker.use": "사용",
  "picker.loadingItems": "{version} 아이템 목록을 불러오는 중…",
  "picker.loadingTags": "{version} 재료 태그를 불러오는 중…",
  "picker.noItem":
    "일치하는 항목이 없습니다. 아래에 아이템 ID를 직접 입력할 수 있습니다.",
  "picker.noTag":
    "사용할 수 있는 태그 목록이 없습니다. 아래에 태그 이름을 직접 입력하세요. 예: planks",
  "picker.noPack":
    "아직 정의된 아이템 팩이 없습니다. 「아이템 팩」 탭에서 새로 만들거나 아래에 이름을 직접 입력하세요.",
  "picker.showMore": "더 보기({count}건 남음)",
  "picker.packItemCount": "아이템 {count}개",
  "picker.tagItemCount": "이 태그에 아이템 {count}개",
  "picker.packGlyph": "팩",

  "slot.empty": "비어 있음",
  "slot.item": "아이템",
  "slot.itemPack": "아이템 팩",
  "choice.tag": "태그 {name}",
  "choice.itemPack": "아이템 팩 {name}",
  "badge.tag": "태그",
  "badge.itemPack": "아이템 팩",

  "packs.title": "아이템 팩",
  "packs.note":
    "여러 아이템을 하나의 팩으로 정의하고 조합법에서 {code}로 참조하면 그중 어느 것이든 재료를 충족합니다.",
  "packs.create": "아이템 팩 새로 만들기",
  "packs.import": "item_packs.yml 가져오기",
  "packs.empty":
    "아직 아이템 팩이 없습니다. 새로 만들면 조합법의 재료 칸에서 선택할 수 있습니다.",
  "packs.name": "팩 이름",
  "packs.removeGroup": "팩 삭제",
  "packs.removeItem": "{index}번째 아이템 제거",
  "packs.addItem": "{name}에 아이템 추가",
  "packs.yamlEmpty": "# 아직 아이템 팩이 없습니다",
  "packs.imported": "아이템 팩 {count}개를 가져왔습니다",
  "packs.importedWithWarnings":
    "아이템 팩 {count}개를 가져왔습니다. 안내 {warnings}건",

  "triggers.title": "트리거",
  "triggers.note":
    "제작이나 다른 이벤트가 발생할 때 동작을 실행합니다. 플러그인의 {code} 폴더에 넣으면 적용됩니다.",
  "triggers.fileName": "파일 이름",
  "triggers.exportAs": "{name}.yml로 내보냅니다",
  "triggers.create": "트리거 새로 만들기",
  "triggers.import": "트리거 YAML 가져오기",
  "triggers.empty": "아직 트리거가 없습니다. 새로 만들어 설정을 시작하세요.",
  "triggers.yamlEmpty": "# 아직 트리거가 없습니다",
  "triggers.imported": "트리거 {count}개를 가져왔습니다",
  "triggers.importedWithWarnings":
    "트리거 {count}개를 가져왔습니다. 안내 {warnings}건",
  "triggers.id": "트리거 ID",
  "triggers.type": "트리거 종류",
  "triggers.recipes": "조합법 한정(recipes)",
  "triggers.recipesHint":
    "비워 두면 이 종류의 모든 조합법에서 발동합니다. 전체 조합법 key를 입력하세요. 예: craftorithm:my_sword",
  "triggers.conditions": "발동 조건(conditions)",
  "triggers.mode.and": "모두 충족",
  "triggers.mode.script": "스크립트 블록",
  "triggers.conditionsHint.and":
    '한 줄에 조건 하나, 모두 성립해야 통과합니다. 예: papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "스크립트를 한 줄씩 작성하고 직접 return true / false 해야 합니다.",
  "triggers.actions": "실행 동작(actions)",
  "triggers.actionsHint":
    '한 줄에 동작 하나, 예: tell("&a제작 성공!") 또는 give_level(100)',
  "triggers.variables": "사용 가능한 변수: {list}",

  // ---- 스크립트 편집기 ----
  "script.line": "{line}번째 줄",
  "script.status.errors": "문법 오류 {count}건",
  "script.status.warnings": "안내 {count}건",
  "script.hint.condition":
    "Tab으로 자동 완성, Ctrl+Space로 후보를 엽니다. 조건은 true / false를 만들어야 합니다.",
  "script.hint.action":
    "Tab으로 자동 완성, Ctrl+Space로 후보를 엽니다. 한 줄에 동작 하나입니다.",
  "script.undo": "실행 취소",
  "script.redo": "다시 실행",

  // 어휘 오류
  "script.err.unterminatedString": "문자열에 닫는 큰따옴표가 없습니다",
  "script.err.unexpectedChar": "인식할 수 없는 문자입니다",

  // 구조 오류
  "script.err.unclosedParen": "괄호가 닫히지 않았습니다",
  "script.err.unexpectedParen": "불필요한 닫는 괄호입니다",
  "script.err.missingEndif": "if에 짝이 되는 endif가 없습니다",
  "script.err.orphanEndif": "endif에 대응하는 if가 없습니다",
  "script.err.orphanBranch": "{keyword}에 대응하는 if가 없습니다",
  "script.err.expectedFunctionName": "콜론 뒤에는 함수 이름이 필요합니다",
  "script.err.moduleCallNeedsParen":
    "모듈 호출에는 괄호가 필요합니다. {name}(...) 형태로 쓰세요",
  "script.err.expectedMethodCall":
    "점 뒤에는 메서드 호출이 필요합니다. .{name}(...) 형태로 쓰세요",
  "script.err.expectedVarName": "var 뒤에는 \"변수명 = 값\"이 필요합니다",

  // 이름과 인수
  "script.err.unknownFunction": "알 수 없는 함수 {name}",
  "script.err.unknownModule": "알 수 없는 모듈 {name}",
  "script.err.argCount":
    "{name}에는 인수 {expected}개가 필요하지만 실제로 {actual}개입니다",
  "script.err.argType":
    "{name}의 인수 {param}은 {expected}이 필요하지만 실제로 {actual}입니다",
  "script.err.ambiguousName":
    "{name}이 여러 모듈에 있습니다. {qualified} 형태로 쓰는 것을 권장합니다",
  "script.err.unknownVariable":
    "변수 {name}은 선언된 변수도 아니고 현재 트리거에서 사용할 수도 없습니다",

  // 의미 안내
  "script.err.assignUndeclared":
    "{name}은 var로 선언되지 않았습니다. var {name} = ... 형태가 필요할 수 있습니다",
  "script.err.blockInAndMode":
    "\"모두 충족\" 모드에서는 각 줄이 독립적인 조건이어야 하므로 {name}을 사용할 수 없습니다. 분기나 변수가 필요하면 \"스크립트 블록\"으로 전환하세요",
  "script.err.queryInAction":
    "{name}은 값만 가져오고 효과가 없으므로 if로 감싸야 할 수 있습니다",
  "script.err.notBoolean": "이 줄은 true / false를 만들지 않습니다",

  // 함수 설명, 키 이름은 script.fn.<module>.<name>
  "script.fn.actions.command":
    "플레이어 권한으로 명령어 실행. 인자를 여러 개 주면 순서대로 이어붙입니다",
  "script.fn.actions.console":
    "콘솔 권한으로 명령어 실행. 인자를 여러 개 주면 순서대로 이어붙입니다",
  "script.fn.actions.tell":
    "플레이어에게 채팅 메시지 전송. 인자를 여러 개 주면 순서대로 이어붙입니다",
  "script.fn.actions.actionbar":
    "인벤토리 위에 메시지 표시. 인자를 여러 개 주면 순서대로 이어붙입니다",
  "script.fn.actions.title": "큰 제목과 부제목 표시",
  "script.fn.actions.log":
    "서버 로그에 기록. 인자를 여러 개 주면 순서대로 이어붙입니다",
  "script.fn.actions.take_level": "플레이어 레벨 차감",
  "script.fn.actions.give_level": "플레이어 레벨 증가",
  "script.fn.actions.give_exp": "플레이어 경험치 증가",
  "script.fn.actions.close": "현재 화면 닫기",
  "script.fn.actions.back": "이전 메뉴로 돌아가기",
  "script.fn.actions.openmenu": "사용자 지정 메뉴 열기",
  "script.fn.actions.discover_recipe": "조합법 잠금 해제",
  "script.fn.actions.undiscover_recipe": "조합법 잠금",
  "script.fn.actions.sound": "효과음 재생",
  "script.fn.actions.set_inv_item": "현재 화면 칸의 아이템 설정",
  "script.fn.conditions.perm": "플레이어에게 권한이 있는지 확인",
  "script.fn.conditions.papi": "PlaceholderAPI 변수 값 가져오기",
  "script.fn.conditions.level": "플레이어 레벨 가져오기",
  "script.fn.conditions.world":
    "월드 이름 가져오기, 인수를 주면 일치 여부 확인",
  "script.fn.conditions.gamemode":
    "게임 모드 가져오기, 인수를 주면 일치 여부 확인",
  "script.fn.conditions.item": "이벤트 아이템이 지정한 ID인지 확인",
  "script.fn.conditions.biome": "생물군계 가져오기, 인수를 주면 일치 여부 확인",
  "script.fn.conditions.in_water": "플레이어가 물속에 있는지 확인",
  "script.fn.conditions.in_rain": "플레이어가 비를 맞고 있는지 확인",
  "script.fn.conditions.light_level": "있는 블록의 밝기 레벨 가져오기",
  "script.fn.conditions.match_item_id": "아이템 오브젝트의 네임스페이스 ID 가져오기",
  "script.fn.math.abs": "절댓값",
  "script.fn.math.min": "더 작은 값",
  "script.fn.math.max": "더 큰 값",
  "script.fn.math.round": "반올림",
  "script.fn.math.floor": "내림",
  "script.fn.math.ceil": "올림",
  "script.fn.math.sqrt": "제곱근",
  "script.fn.math.pow": "거듭제곱",
  "script.fn.math.random":
    "난수. 인자가 없으면 0~1, 하나면 그 값이 상한, 둘이면 min~max",
  "script.fn.math.random_int":
    "임의의 정수. 인자가 하나면 그 값이 상한, 둘이면 min~max",
  "script.fn.math.int": "정수로 변환",
  "script.fn.math.float": "실수로 변환",
  "script.fn.vault.money": "플레이어 잔액 가져오기(Vault)",
  "script.fn.vault.take_money": "잔액 차감(Vault)",
  "script.fn.vault.give_money": "잔액 증가(Vault)",
  "script.fn.vault_unlocked.money":
    "플레이어 잔액 가져오기(VaultUnlocked). 통화를 생략하면 기본 통화를 사용합니다",
  "script.fn.vault_unlocked.take_money":
    "잔액 차감(VaultUnlocked). 통화를 생략하면 기본 통화를 사용합니다",
  "script.fn.vault_unlocked.give_money":
    "잔액 증가(VaultUnlocked). 통화를 생략하면 기본 통화를 사용합니다",
  "script.fn.playerpoints.points": "플레이어 포인트 가져오기",
  "script.fn.playerpoints.take_points": "포인트 차감",
  "script.fn.playerpoints.give_points": "포인트 증가",
  "script.fn.obj.get": "객체 필드 읽기, 보통 x.get(\"필드명\") 형태로 씁니다",
  "script.fn.obj.set": "객체 필드 쓰기, 보통 x.set(\"필드명\", 값) 형태로 씁니다",
  "script.fn.obj.invoke":
    "객체 메서드 호출, 보통 x.invoke(\"메서드명\", 인수...) 형태로 씁니다",
  // delay 는 네임스페이스가 없어 짧은 이름만 쓰므로 키는 script.fn.delay
  "script.fn.delay": "지정한 tick 동안 멈춘 뒤 계속",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if": "조건이 성립하면 아래 문장을 실행",
  "script.kw.elseif": "이전 조건이 성립하지 않으면 다시 판단",
  "script.kw.else": "앞의 모든 조건이 성립하지 않을 때 실행",
  "script.kw.endif": "if 블록 종료",
  "script.kw.return": "스크립트를 끝내고 값을 반환",
  "script.kw.var": "변수를 선언, var 이름 = 값 형태로 씁니다",
  "script.kw.true": "불 참 값",
  "script.kw.false": "불 거짓 값",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "플레이어와 월드에 영향을 주는 동작",
  "script.module.conditions": "플레이어와 환경 상태를 읽는 판단",
  "script.module.math": "수학 연산과 난수",
  "script.module.vault": "경제 인터페이스(Vault 필요)",
  "script.module.vault_unlocked":
    "다중 통화 경제 인터페이스(VaultUnlocked 필요)",
  "script.module.playerpoints": "포인트 인터페이스(PlayerPoints 필요)",
  "script.module.obj": "객체 필드와 메서드에 대한 리플렉션 접근",
  "script.complete.returns": "반환",
  "triggers.priority": "우선순위(priority)",
  "triggers.priorityHint": "숫자가 작을수록 먼저 실행됩니다",
  "triggers.cooldown": "재사용 대기시간(초)",
  "triggers.cooldownHint": "0은 제한 없음을 뜻합니다",
  "triggers.enabled": "사용 중",
  "triggers.disabled": "사용 중지",
  "triggers.perPlayer": "플레이어별 개별 대기시간",
  "triggers.shared": "서버 전체 공용 대기시간",

  "fields.section": "조합법 설정",
  "fields.fileName": "조합법 파일 이름",
  "fields.exportAs": "{name}.yml로 내보냅니다",
  "fields.recipeId": "조합법 ID(recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "비워 두면 플러그인이 파일 이름을 조합법 ID로 사용합니다",
  "fields.recipeIdRequiredHint":
    "파일 이름을 조합법 ID로 쓸 수 없으므로 여기에 반드시 입력해야 합니다",
  "fields.group": "조합법 그룹(group)",
  "fields.groupPlaceholder": "비워 두면 그룹을 지정하지 않습니다",
  "fields.groupHint": "같은 그룹의 조합법은 조합법 책에서 합쳐서 표시됩니다",
  "fields.exp": "획득 경험치(exp)",
  "fields.time": "제련 소요 시간(time)",
  "fields.timeHint": "단위는 tick, 20 tick = 1초",
  "fields.costLevel": "필요 레벨(cost_level)",
  "fields.trimPattern": "장식 무늬(trim_pattern)",
  "fields.bookCategory": "조합법 책 분류",
  "fields.bookCategoryHint": "1.19.3+ 서버가 필요합니다",
  "fields.unspecified": "지정 없음",
  "fields.previewSection": "가짜 결과(선택)",
  "fields.previewSlot": "가짜 결과",
  "fields.previewLabel": "가짜 결과 아이템",
  "fields.previewHint":
    "제작할 때 결과 칸에 이 아이템을 표시해 실제 결과물을 숨깁니다. 플레이어가 가져가는 것은 여전히 실제 결과물입니다. 비워 두면 fake_result_preview를 쓰지 않습니다.",
  "fields.copySection": "구성 요소 유지 규칙(선택)",
  "fields.copyHint":
    "선택한 구성 요소는 입력 아이템에서 결과물로 복사되며 copy_components_rules에 기록됩니다.",
  "fields.copySince": "{name}({since} 필요)",
  "fields.removeRule": "{name} 제거",

  "category.crafting.building": "건축 블록",
  "category.crafting.redstone": "레드스톤 아이템",
  "category.crafting.equipment": "장비",
  "category.crafting.misc": "기타",
  "category.cooking.food": "음식",
  "category.cooking.blocks": "블록",
  "category.cooking.misc": "기타",

  "copyRule.all": "전체 구성 요소",
  "copyRule.enchantments": "마법부여",
  "copyRule.attributes": "속성",
  "copyRule.display_name": "표시 이름",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "모델 데이터",
  "copyRule.item_flag": "아이템 플래그",
  "copyRule.unbreakable": "파괴 불가",
  "copyRule.trim": "갑옷 장식",
  "copyRule.food": "음식",
  "copyRule.max_stack_size": "최대 겹침 수",
  "copyRule.rarity": "희귀도",
  "copyRule.fire_resistance": "화염 저항",
  "copyRule.hide_tooltip": "툴팁 숨기기",
  "copyRule.item_name": "아이템 이름",
  "copyRule.tool": "도구",
  "copyRule.item_model": "아이템 모델",
  "copyRule.custom_model_data_component": "모델 데이터 구성 요소",

  "itemCategory.building": "건축 블록",
  "itemCategory.ore": "광물",
  "itemCategory.tool": "도구",
  "itemCategory.combat": "전투",
  "itemCategory.food": "음식",
  "itemCategory.redstone": "레드스톤",
  "itemCategory.brewing": "양조",
  "itemCategory.misc": "기타",

  "recipeGroup.crafting": "제작",
  "recipeGroup.smelting": "제련",
  "recipeGroup.smithing": "대장 작업",
  "recipeGroup.processing": "가공",

  "recipeType.vanilla_shaped": "순서 있는 조합법",
  "recipeType.vanilla_shaped.summary":
    "3×3 모양에 맞춰 재료를 놓으며, 위치가 제작 가능 여부를 결정합니다.",
  "recipeType.vanilla_shapeless": "순서 없는 조합법",
  "recipeType.vanilla_shapeless.summary":
    "재료만 모두 있으면 제작되며 놓는 위치는 상관없습니다.",
  "recipeType.vanilla_smelting_furnace": "화로 조합법",
  "recipeType.vanilla_smelting_furnace.summary":
    "화로에서 재료 하나를 제련하며 경험치와 소요 시간을 설정할 수 있습니다.",
  "recipeType.vanilla_smelting_blast": "용광로 조합법",
  "recipeType.vanilla_smelting_blast.summary":
    "용광로 전용 제련으로, 보통 광석과 금속에 사용합니다.",
  "recipeType.vanilla_smelting_smoker": "훈연기 조합법",
  "recipeType.vanilla_smelting_smoker.summary":
    "훈연기 전용 제련으로, 보통 음식에 사용합니다.",
  "recipeType.vanilla_smelting_campfire": "모닥불 조합법",
  "recipeType.vanilla_smelting_campfire.summary":
    "모닥불 제련으로, 보통 화로보다 시간이 더 걸립니다.",
  "recipeType.vanilla_smithing_transform": "대장 작업 조합법",
  "recipeType.vanilla_smithing_transform.summary":
    "틀과 추가 재료로 기본 아이템을 새 아이템으로 업그레이드합니다.",
  "recipeType.vanilla_smithing_trim": "장식 대장 작업 조합법",
  "recipeType.vanilla_smithing_trim.summary":
    "갑옷에 장식을 추가하며 장식 무늬를 반드시 지정해야 합니다.",
  "recipeType.vanilla_stonecutting": "석재 절단 조합법",
  "recipeType.vanilla_stonecutting.summary":
    "석재 절단기에서 재료 하나를 결과물로 절단합니다.",
  "recipeType.vanilla_brewing": "양조 조합법",
  "recipeType.vanilla_brewing.summary":
    "양조대에서 재료로 아래쪽 입력 아이템을 변화시킵니다.",
  "recipeType.anvil": "모루 조합법",
  "recipeType.anvil.summary":
    "모루에서 두 아이템을 합치며 필요 레벨을 설정할 수 있습니다.",

  "station.crafting_table": "제작대",
  "station.furnace": "화로",
  "station.blast_furnace": "용광로",
  "station.smoker": "훈연기",
  "station.campfire": "모닥불",
  "station.smithing_table": "대장장이 작업대",
  "station.stonecutter": "석재 절단기",
  "station.brewing_stand": "양조대",
  "station.anvil": "모루",

  "guiSlot.gridCell": "격자 칸",
  "guiSlot.gridPosition": "{row}행 {col}열",
  "guiSlot.shapelessIngredient": "재료 {index}",
  "guiSlot.ingredient": "재료",
  "guiSlot.result": "결과물",
  "guiSlot.template": "틀",
  "guiSlot.base": "기본 아이템",
  "guiSlot.addition": "추가 재료",
  "guiSlot.anvilBase": "왼쪽 아이템",
  "guiSlot.anvilAddition": "오른쪽 아이템",
  "guiSlot.brewingInput": "입력 아이템",
  "guiSlot.brewingMiddle": "가운데 병 칸",
  "guiSlot.inertFuel": "연료 칸은 플레이어가 채우며 조합법과 무관합니다",
  "guiSlot.inertBottle":
    "좌우 병 칸은 가운데 병 칸과 같은 입력 아이템을 사용합니다",

  "triggerGroup.craft": "제작 관련",
  "triggerGroup.player": "플레이어 이벤트",
  "triggerGroup.entity": "엔티티 이벤트",
  "triggerGroup.block": "블록 이벤트",
  "triggerGroup.inventory": "인벤토리 이벤트",

  "triggerType.crafting": "제작대 제작",
  "triggerType.smithing": "대장장이 작업대 작업",
  "triggerType.anvil": "모루 합성",
  "triggerType.player_join": "플레이어 접속",
  "triggerType.player_quit": "플레이어 퇴장",
  "triggerType.player_death": "플레이어 사망",
  "triggerType.player_respawn": "플레이어 부활",
  "triggerType.player_interact": "플레이어 상호작용",
  "triggerType.player_advancement": "발전 과제 달성",
  "triggerType.player_level_change": "레벨 변화",
  "triggerType.player_exp_change": "경험치 변화",
  "triggerType.player_toggle_sneak": "웅크리기 전환",
  "triggerType.player_toggle_sprint": "달리기 전환",
  "triggerType.player_item_consume": "아이템 섭취",
  "triggerType.player_item_held": "손에 든 아이템 변경",
  "triggerType.player_item_damage": "아이템 내구도 손상",
  "triggerType.player_item_mend": "아이템 수리",
  "triggerType.player_fish": "낚시",
  "triggerType.player_teleport": "순간이동",
  "triggerType.player_portal": "포털 이용",
  "triggerType.player_changed_world": "월드 이동",
  "triggerType.player_drop_item": "아이템 버리기",
  "triggerType.player_pickup_item": "아이템 줍기",
  "triggerType.player_game_mode_change": "게임 모드 변경",
  "triggerType.player_recipe_discover": "조합법 잠금 해제",
  "triggerType.player_command_preprocess": "명령어 실행",
  "triggerType.player_move": "플레이어 이동",
  "triggerType.player_bed_enter": "침대에 눕기",
  "triggerType.player_bed_leave": "침대에서 일어나기",
  "triggerType.player_swap_hand_items": "주손과 보조손 교체",
  "triggerType.player_edit_book": "책 편집",
  "triggerType.player_statistic": "통계 변화",
  "triggerType.player_bucket_fill": "양동이 채우기",
  "triggerType.player_bucket_empty": "양동이 비우기",
  "triggerType.player_shear_entity": "양털 깎기",
  "triggerType.damage_entity": "피해 주기",
  "triggerType.kill_entity": "엔티티 처치",
  "triggerType.entity_shoot_bow": "활 쏘기",
  "triggerType.entity_breed": "동물 번식",
  "triggerType.entity_tame": "동물 길들이기",
  "triggerType.entity_potion_effect": "물약 효과 변화",
  "triggerType.block_break": "블록 파괴",
  "triggerType.block_place": "블록 설치",
  "triggerType.inventory_click": "인벤토리 클릭",
  "triggerType.inventory_open": "인벤토리 열기",
  "triggerType.inventory_close": "인벤토리 닫기",
  "triggerType.player_interact_entity": "엔티티와 상호작용",
  "triggerType.player_animation": "플레이어 애니메이션",
  "triggerType.player_velocity": "속도 변경",
  "triggerType.async_player_chat": "플레이어 채팅",
  "triggerType.player_take_campfire": "모닥불에서 가져오기",
  "triggerType.prepare_grindstone": "숫돌 준비",
  "triggerType.trade_select": "거래 선택",

  "issue.fileNameEmpty": "조합법 파일 이름은 비워 둘 수 없습니다.",
  "issue.fileNameNeedsRecipeId":
    "파일 이름에 사용할 수 없는 문자가 있습니다. recipe_id가 없으면 플러그인이 파일 이름을 조합법 ID로 사용하므로 불러오기에 실패합니다. 소문자, 숫자, 밑줄, 하이픈, 점만 쓰거나 아래에서 조합법 ID를 입력하세요.",
  "issue.recipeIdPattern":
    "조합법 ID에는 소문자, 숫자, 밑줄, 하이픈, 점만 사용할 수 있습니다.",
  "issue.resultMissing": "결과물(result)이 아직 설정되지 않았습니다.",
  "issue.resultMustBeItem":
    "결과물은 구체적인 아이템만 가능하며 태그나 아이템 팩은 쓸 수 없습니다.",
  "issue.gridEmpty": "제작 격자에 최소 하나의 재료를 놓아야 합니다.",
  "issue.gridTooManyKinds":
    "서로 다른 재료 종류가 9가지를 넘어 shape를 만들 수 없습니다.",
  "issue.shapelessEmpty": "순서 없는 조합법에는 재료가 최소 하나 필요합니다.",
  "issue.shapelessTooMany":
    "순서 없는 조합법은 재료를 최대 9개까지 쓸 수 있습니다.",
  "issue.smeltingIngredient":
    "제련 재료(ingredient)가 아직 설정되지 않았습니다.",
  "issue.cookingTime": "제련 소요 시간은 0 tick보다 커야 합니다.",
  "issue.expNegative": "경험치는 음수가 될 수 없습니다.",
  "issue.stonecuttingIngredient":
    "석재 절단 재료(ingredient)가 아직 설정되지 않았습니다.",
  "issue.smithingBase": "기본 아이템(base)이 아직 설정되지 않았습니다.",
  "issue.smithingAddition": "추가 재료(addition)가 아직 설정되지 않았습니다.",
  "issue.smithingTemplate":
    "대장 작업 틀(template)이 설정되지 않았습니다. 1.20+ 서버에서는 보통 필요합니다.",
  "issue.trimPattern":
    "장식 대장 작업에는 장식 무늬(trim_pattern)를 반드시 지정해야 합니다.",
  "issue.brewingInput": "양조 입력 아이템(input)이 아직 설정되지 않았습니다.",
  "issue.brewingIngredient":
    "양조 재료(ingredient)가 아직 설정되지 않았습니다.",
  "issue.anvilBase": "왼쪽 아이템(base)이 아직 설정되지 않았습니다.",
  "issue.anvilAddition": "오른쪽 아이템(addition)이 아직 설정되지 않았습니다.",
  "issue.costLevelNegative": "필요 레벨은 음수가 될 수 없습니다.",
  "issue.packUndefined":
    "정의되지 않은 아이템 팩 {name}을 참조합니다. 「아이템 팩」에서 만들거나 서버에 이미 있는지 확인하세요.",
  "issue.brewingTagInput":
    "양조 입력 아이템에 태그를 사용했습니다. 양조 조합법의 태그 일치 동작은 서버 구현에 따라 달라지므로 구체적인 아이템을 권장합니다.",
  "issue.brewingTagIngredient":
    "양조 재료에 태그를 사용했습니다. 양조 조합법의 태그 일치 동작은 서버 구현에 따라 달라지므로 구체적인 아이템을 권장합니다.",
  "issue.packNameEmpty": "이름이 없는 아이템 팩이 있습니다.",
  "issue.packNameDuplicate":
    "아이템 팩 이름 {name}이 중복됩니다. 뒤의 것이 앞의 것을 덮어씁니다.",
  "issue.packNamePattern":
    "아이템 팩 이름 {name}에는 소문자, 숫자, 밑줄, 하이픈만 사용하는 것을 권장합니다.",
  "issue.packItemsEmpty":
    "아이템 팩 {name}에 아이템이 없어 플러그인이 건너뜁니다.",
  "issue.packNested":
    "아이템 팩 {name} 안에는 태그나 다른 아이템 팩을 중첩할 수 없고 구체적인 아이템만 넣을 수 있습니다.",
  "issue.triggerIdEmpty": "이름이 없는 트리거가 있습니다.",
  "issue.triggerIdDuplicate":
    "트리거 ID {name}이 중복됩니다. 뒤의 것이 앞의 것을 덮어씁니다.",
  "issue.triggerIdPattern":
    "트리거 ID {name}에는 소문자, 숫자, 밑줄, 하이픈만 사용하는 것을 권장합니다.",
  "issue.triggerTypeMissing":
    "트리거 {name}에 종류가 선택되지 않아 플러그인이 건너뜁니다.",
  "issue.triggerNoActions":
    "트리거 {name}에 동작이 없어 발동해도 아무 효과가 없습니다.",
  "issue.triggerCooldownNegative":
    "트리거 {name}의 재사용 대기시간은 음수가 될 수 없습니다.",
  "issue.triggerConditionScript":
    "트리거 {name} 조건 {line}번째 줄에 문법 오류가 있어 플러그인이 불러오지 못합니다.",
  "issue.triggerActionScript":
    "트리거 {name} 동작 {line}번째 줄에 문법 오류가 있어 플러그인이 불러오지 못합니다.",

  "parse.yamlFailed": "YAML 해석에 실패했습니다: {detail}",
  "parse.notRecipe":
    "이 파일은 조합법 설정이 아닙니다(최상위가 키-값 쌍이어야 합니다).",
  "parse.typeMissing": "type 필드가 없어 조합법 종류를 판단할 수 없습니다.",
  "parse.typeUnsupported": "아직 지원하지 않는 조합법 종류: {name}",
  "parse.resultMissing": "result를 읽지 못했습니다. 결과물을 다시 설정하세요.",
  "parse.shapeMissing":
    "유효한 shape / ingredients를 읽지 못해 격자가 비어 있습니다.",
  "parse.shapeCharUnmapped": "shape의 문자 {name}에 대응하는 재료가 없습니다.",
  "parse.shapeTooManyRows": "shape가 3행을 넘어 앞의 3행만 가져왔습니다.",
  "parse.ingredientsMissing":
    "ingredients를 읽지 못해 재료 목록이 비어 있습니다.",
  "parse.ingredientsTooMany": "재료가 9개를 넘어 앞의 9개만 가져왔습니다.",
  "parse.amountClamped":
    "일부 개수를 수정했습니다: 해당 칸은 개수를 읽지 않거나 상한 {max}을 초과했습니다.",
  "parse.cookingCategoryUnknown": "인식할 수 없는 제련 조합법 책 분류: {name}",
  "parse.craftingCategoryUnknown": "인식할 수 없는 제작 조합법 책 분류: {name}",
  "parse.notItemPacks":
    "이 파일은 아이템 팩 설정이 아닙니다(최상위가 팩 이름과 목록의 대응이어야 합니다).",
  "parse.packNotList":
    "아이템 팩 {name}의 값이 목록이 아니어서 건너뛰었습니다.",
  "parse.packNoItems":
    "아이템 팩 {name}에 유효한 아이템이 없어 건너뛰었습니다.",
  "parse.notTriggers":
    "이 파일은 트리거 설정이 아닙니다(최상위가 트리거 ID와 설정의 대응이어야 합니다).",
  "parse.triggerNotMap":
    "트리거 {name}의 내용이 키-값 쌍이 아니어서 건너뛰었습니다.",
  "parse.triggerTypeMissing": "트리거 {name}에 type이 없어 건너뛰었습니다.",
};
