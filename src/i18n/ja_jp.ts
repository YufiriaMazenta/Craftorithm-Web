import type { MessageKey } from "./zh_cn";

export const jaJp: Record<MessageKey, string> = {
  "brand.title": "Craftorithm レシピワークベンチ",
  "brand.sub": "ログイン不要、ローカルでプラグインのレシピ YAML を生成",

  "view.aria": "ワークスペース",
  "skip.toWorkbench": "作業台へスキップ",
  "view.recipe": "レシピ",
  "view.packs": "アイテムパック",
  "view.triggers": "トリガー",

  "tabs.aria": "開いているファイル",
  "tabs.close": "{name} を閉じる",
  "tabs.newRecipe": "レシピを新規作成",
  "tabs.newTrigger": "トリガーファイルを新規作成",
  "tabs.saveAsNew": "新しいタブとして保存",
  "tabs.newMenu": "その他の新規作成",
  "tabs.importFiles": "ファイルを読み込む…",

  "start.title": "はじめる",
  "start.note": "レシピを新規作成するか、既存のファイルを読み込んで編集を続けます。",
  "start.newRecipe": "レシピを新規作成",
  "start.importFiles": "ファイルを読み込む",
  "start.importFolder": "フォルダを読み込む",
  "start.hint": "フォルダを読み込むと recipes、item_packs.yml、triggers を自動で判別します。",

  "action.exportAll": "すべて書き出す",
  "toast.exportedZip": "{count} 個のファイルを書き出しました",
  "toast.exportEmpty": "書き出せる内容がありません",
  "toast.savedAsNew": "新しいタブに複製しました",
  "toast.importedCount": "{count} 個のファイルを読み込みました",
  "toast.importSkipped": "判別できないファイル {count} 個をスキップしました",
  "toast.tabClosed": "{name} を閉じました",
  "toast.typeChangedLost": "種類の変更で材料 {count} 個が失われました（元に戻せます）",

  "history.undo": "元に戻す",
  "history.redo": "やり直し",
  "history.undoOf": "{action}を元に戻す",
  "history.action.changeType": "レシピ種類の変更",
  "history.action.reset": "レシピのリセット",
  "history.action.closeTab": "ファイルを閉じる操作",
  "history.action.import": "インポートによる上書き",
  "history.action.packEdit": "アイテムパックの変更",

  "step.aria": "編集ステップ",
  "step.type": "種類",
  "step.edit": "編集",
  "step.export": "エクスポート",

  "action.reset": "リセット",
  "action.resetRecipe": "レシピをリセット",
  "action.importYaml": "YAML をインポート",
  "action.downloadYaml": "YAML をダウンロード",
  "action.copyClipboard": "クリップボードにコピー",
  "action.close": "閉じる",
  "action.remove": "削除",

  "locale.switch": "表示言語",
  "theme.switch": "外観",
  "theme.light": "ライト",
  "theme.dark": "ダーク",

  "catalog.offline":
    "アイテム一覧がオフラインのため、内蔵の一覧を使用しています",

  "footer.aria": "概要と関連リンク",
  "footer.credit": "氿雾 制作 · Craftorithm プラグイン向けのレシピエディター",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "ドキュメント",
  "footer.link.qq": "QQ グループ",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML をクリップボードにコピーしました",
  "toast.copyFailed":
    "コピーに失敗しました。プレビュー内容を手動で選択してください",
  "toast.downloaded": "{name} をダウンロードしました",
  "toast.saved": "{name} を選択した場所に保存しました",

  "next.titleDownloaded": "{name} をダウンロードしました。あと 2 ステップです",
  "next.titleSaved": "{name} を保存しました。あと 2 ステップです",
  "next.step1": "サーバーのこの場所にファイルを置きます（同名ファイルは上書き）：",
  "next.step2": "サーバーコンソールまたはゲーム内で実行します：",
  "next.step3": "ゲーム内でクラフトを試します。反映されない場合はコンソールの読み込みエラーを確認してください。",
  "next.copyPath": "パスをコピー",
  "next.copyCommand": "コマンドをコピー",
  "next.pathCopied": "パスをコピーしました",
  "next.commandCopied": "コマンドをコピーしました",
  "next.done": "閉じる",
  "toast.imported": "{name} をインポートしました",
  "toast.recipeReset": "空のレシピにリセットしました",
  "bench.station": "ワークステーション：{name}",
  "bench.importWarnings":
    "インポート時に {count} 件の確認事項があります：{detail}",
  "bench.shapelessNote":
    "不定形レシピは素材が揃っているかだけを判定し、配置位置は影響しません。",
  "bench.inertNote":
    "クリックできないスロットはゲーム内でプレイヤーが使用します。レシピはこれらのスロットに書き込みません。",
  "bench.guiAlt": "{name}の画面",
  "bench.resultOutside": "完成品（上の画面の完成品スロットと同じ）",

  "typeNav.aria": "レシピの種類",

  "inspector.title": "結果と検証",
  "inspector.resultUnset": "完成品が未設定です",
  "inspector.resultHint": "ワークベンチで完成品スロットをクリックしてください",
  "inspector.slotUnset": "未設定",
  "inspector.mustFix": "{count} 件の修正が必要です",
  "inspector.stillTodo": "あと {count} 項目",
  "inspector.ready": "レシピの構成は完全です。エクスポートできます",
  "inspector.yamlTitle": "YAML プレビュー",
  "inspector.fixFirst": "上記のエラーを修正するとダウンロードできます。",

  "picker.aria": "素材を選択：{name}",
  "picker.title": "素材を選択 · {name}",
  "picker.clearSlot": "スロットを空にする",
  "picker.tabsAria": "素材の種類",
  "picker.tab.item": "アイテム",
  "picker.tab.tag": "タグ",
  "picker.tab.item_pack": "アイテムパック",
  "picker.categoryAll": "すべて",
  "picker.search.item": "アイテム名または ID で検索（例：diamond）",
  "picker.search.tag": "タグを検索（例：planks / logs）",
  "picker.search.item_pack": "アイテムパック名を検索",
  "picker.custom.item": "カスタムアイテム ID",
  "picker.custom.tag": "カスタムタグ名",
  "picker.custom.item_pack": "カスタムアイテムパック名",
  "picker.customPlaceholder.item": "minecraft:diamond または oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "個数",
  "picker.use": "使用",
  "picker.loadingItems": "{version} のアイテム一覧を読み込んでいます…",
  "picker.loadingTags": "{version} の素材タグを読み込んでいます…",
  "picker.noItem":
    "一致する項目がありません。下欄にアイテム ID を直接入力できます。",
  "picker.noTag":
    "利用できるタグ一覧がありません。下欄にタグ名を直接入力できます（例：planks）。",
  "picker.noPack":
    "アイテムパックがまだ定義されていません。「アイテムパック」タブで新規作成するか、下欄にパック名を直接入力してください。",
  "picker.showMore": "さらに表示（残り {count} 件）",
  "picker.packItemCount": "アイテム {count} 個",
  "picker.tagItemCount": "このタグにアイテム {count} 個",
  "picker.packGlyph": "パ",

  "slot.empty": "空",
  "slot.item": "アイテム",
  "slot.itemPack": "アイテムパック",
  "choice.tag": "タグ {name}",
  "choice.itemPack": "アイテムパック {name}",
  "badge.tag": "タグ",
  "badge.itemPack": "アイテムパック",

  "packs.title": "アイテムパック",
  "packs.note":
    "複数のアイテムを 1 つのパックとして定義し、レシピでは {code} で参照します。どれか 1 つで素材条件を満たせます。",
  "packs.create": "アイテムパックを新規作成",
  "packs.import": "item_packs.yml をインポート",
  "packs.empty":
    "アイテムパックがまだありません。作成すると、レシピの素材スロットで選択できます。",
  "packs.name": "パック名",
  "packs.removeGroup": "パックを削除",
  "packs.removeItem": "{index} 番目のアイテムを削除",
  "packs.addItem": "{name} にアイテムを追加",
  "packs.yamlEmpty": "# アイテムパックがまだありません",
  "packs.imported": "アイテムパック {count} 個をインポートしました",
  "packs.importedWithWarnings":
    "アイテムパック {count} 個をインポートしました。{warnings} 件の注意事項があります",

  "triggers.title": "トリガー",
  "triggers.note":
    "クラフトなどのイベント発生時に動作を実行します。プラグインの {code} ディレクトリに置くと有効になります。",
  "triggers.fileName": "ファイル名",
  "triggers.exportAs": "{name}.yml としてエクスポート",
  "triggers.create": "トリガーを新規作成",
  "triggers.import": "トリガー YAML をインポート",
  "triggers.empty":
    "トリガーがまだありません。新規作成して設定を始めてください。",
  "triggers.yamlEmpty": "# トリガーがまだありません",
  "triggers.imported": "トリガー {count} 個をインポートしました",
  "triggers.importedWithWarnings":
    "トリガー {count} 個をインポートしました。{warnings} 件の注意事項があります",
  "triggers.id": "トリガー ID",
  "triggers.type": "トリガーの種類",
  "triggers.recipes": "対象レシピ（recipes）",
  "triggers.recipesHint":
    "空欄の場合、この種類のすべてのレシピで発動します。完全なレシピキーを入力してください（例：craftorithm:my_sword）",
  "triggers.conditions": "発動条件（conditions）",
  "triggers.mode.and": "すべて満たす",
  "triggers.mode.script": "スクリプトブロック",
  "triggers.conditionsHint.and":
    '1 行に 1 条件。すべて成立した場合のみ通過します。例：papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "スクリプトとして 1 行ずつ記述し、自分で return true / false を返す必要があります。",
  "triggers.actions": "実行する動作（actions）",
  "triggers.actionsHint":
    '1 行に 1 動作。例：tell("&aクラフト成功！") または give_level(100)',
  "triggers.variables": "利用できる変数：{list}",

  // ---- スクリプトエディター ----
  "script.line": "{line} 行目",
  "script.status.errors": "構文エラー {count} 件",
  "script.status.warnings": "注意 {count} 件",
  "script.hint.condition":
    "Tab で補完、Ctrl+Space で候補を表示します。条件は true / false を返す必要があります。",
  "script.hint.action":
    "Tab で補完、Ctrl+Space で候補を表示します。1 行に 1 動作です。",
  "script.undo": "元に戻す",
  "script.redo": "やり直す",

  // 字句エラー
  "script.err.unterminatedString": "文字列の閉じ二重引用符がありません",
  "script.err.unexpectedChar": "認識できない文字です",

  // 構造エラー
  "script.err.unclosedParen": "括弧が閉じられていません",
  "script.err.unexpectedParen": "余分な閉じ括弧です",
  "script.err.missingEndif": "if に対応する endif がありません",
  "script.err.orphanEndif": "endif に対応する if がありません",
  "script.err.orphanBranch": "{keyword} に対応する if がありません",
  "script.err.expectedFunctionName": "コロンの後には関数名が必要です",
  "script.err.moduleCallNeedsParen":
    "モジュール呼び出しには括弧が必要です。{name}(...) と書いてください",
  "script.err.expectedMethodCall":
    "ドットの後にはメソッド呼び出しが必要です。.{name}(...) と書いてください",
  "script.err.expectedVarName": "var の後には「変数名 = 値」が必要です",

  // 名称と引数
  "script.err.unknownFunction": "不明な関数 {name}",
  "script.err.unknownModule": "不明なモジュール {name}",
  "script.err.argCount":
    "{name} は引数 {expected} 個が必要ですが、実際は {actual} 個です",
  "script.err.argType":
    "{name} の引数 {param} は {expected} が必要ですが、実際は {actual} です",
  "script.err.ambiguousName":
    "{name} は複数のモジュールに存在します。{qualified} と書くことを推奨します",
  "script.err.unknownVariable":
    "変数 {name} は宣言されておらず、現在のトリガーで利用できる変数でもありません",

  // 意味的な注意
  "script.err.assignUndeclared":
    "{name} は var で宣言されていません。var {name} = ... と書く必要があるかもしれません",
  "script.err.blockInAndMode":
    "「すべて満たす」モードでは各行が独立した条件でなければならないため {name} は使えません。分岐や変数が必要な場合は「スクリプトブロック」に切り替えてください",
  "script.err.queryInAction":
    "{name} は値を取得するだけで効果がありません。if で囲む必要があるかもしれません",
  "script.err.notBoolean": "この行は true / false を返しません",

  // 関数の説明。キー名は script.fn.<module>.<name>
  "script.fn.actions.command":
    "プレイヤーとしてコマンドを実行。複数の引数は順に連結されます",
  "script.fn.actions.console":
    "コンソールとしてコマンドを実行。複数の引数は順に連結されます",
  "script.fn.actions.tell":
    "プレイヤーにチャットメッセージを送信。複数の引数は順に連結されます",
  "script.fn.actions.actionbar":
    "ホットバーの上にメッセージを表示。複数の引数は順に連結されます",
  "script.fn.actions.title": "タイトルとサブタイトルを表示",
  "script.fn.actions.log":
    "サーバーログに書き込み。複数の引数は順に連結されます",
  "script.fn.actions.take_level": "プレイヤーのレベルを減らす",
  "script.fn.actions.give_level": "プレイヤーのレベルを増やす",
  "script.fn.actions.give_exp": "プレイヤーの経験値を増やす",
  "script.fn.actions.close": "現在の画面を閉じる",
  "script.fn.actions.back": "一つ上のメニューに戻る",
  "script.fn.actions.openmenu": "カスタムメニューを開く",
  "script.fn.actions.discover_recipe": "レシピを解除する",
  "script.fn.actions.undiscover_recipe": "レシピをロックする",
  "script.fn.actions.sound": "効果音を再生",
  "script.fn.actions.set_inv_item": "現在の画面のスロットのアイテムを設定",
  "script.fn.conditions.perm": "プレイヤーが権限を持つか判定",
  "script.fn.conditions.papi": "PlaceholderAPI の変数値を取得",
  "script.fn.conditions.level": "プレイヤーのレベルを取得",
  "script.fn.conditions.world":
    "ワールド名を取得。引数を指定すると一致するか判定",
  "script.fn.conditions.gamemode":
    "ゲームモードを取得。引数を指定すると一致するか判定",
  "script.fn.conditions.item": "イベントのアイテムが指定 ID か判定",
  "script.fn.conditions.biome":
    "バイオームを取得。引数を指定すると一致するか判定",
  "script.fn.conditions.in_water": "プレイヤーが水中にいるか判定",
  "script.fn.conditions.in_rain": "プレイヤーが雨に当たっているか判定",
  "script.fn.conditions.light_level":
    "プレイヤーがいるブロックの明るさレベルを取得",
  "script.fn.math.abs": "絶対値",
  "script.fn.math.min": "小さい方の値",
  "script.fn.math.max": "大きい方の値",
  "script.fn.math.round": "四捨五入",
  "script.fn.math.floor": "切り捨て",
  "script.fn.math.ceil": "切り上げ",
  "script.fn.math.sqrt": "平方根",
  "script.fn.math.pow": "べき乗",
  "script.fn.math.random":
    "乱数を取得。引数なしは 0～1、引数 1 個はその値が上限、2 個で min～max",
  "script.fn.math.random_int":
    "ランダムな整数を取得。引数 1 個はその値が上限、2 個で min～max",
  "script.fn.math.int": "整数に変換",
  "script.fn.math.float": "浮動小数点数に変換",
  "script.fn.vault.money": "プレイヤーの残高を取得（Vault）",
  "script.fn.vault.take_money": "残高を減らす（Vault）",
  "script.fn.vault.give_money": "残高を増やす（Vault）",
  "script.fn.vault_unlocked.money":
    "プレイヤーの残高を取得（VaultUnlocked）。通貨を省略すると既定の通貨を使用",
  "script.fn.vault_unlocked.take_money":
    "残高を減らす（VaultUnlocked）。通貨を省略すると既定の通貨を使用",
  "script.fn.vault_unlocked.give_money":
    "残高を増やす（VaultUnlocked）。通貨を省略すると既定の通貨を使用",
  "script.fn.playerpoints.points": "プレイヤーのポイントを取得",
  "script.fn.playerpoints.take_points": "ポイントを減らす",
  "script.fn.playerpoints.give_points": "ポイントを増やす",
  "script.fn.obj.get":
    "オブジェクトのフィールドを読み取る。通常 x.get(\"フィールド名\") と書く",
  "script.fn.obj.set":
    "オブジェクトのフィールドに書き込む。通常 x.set(\"フィールド名\", 値) と書く",
  "script.fn.obj.invoke":
    "オブジェクトのメソッドを呼び出す。通常 x.invoke(\"メソッド名\", 引数...) と書く",
  // delay には名前空間がなく短縮名のみ。キー名は script.fn.delay
  "script.fn.delay": "指定した tick だけ待機してから続行",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if": "条件が成立したとき以下の文を実行",
  "script.kw.elseif": "直前の条件が不成立のとき別の条件を判定",
  "script.kw.else": "前のどの条件も成立しないとき実行",
  "script.kw.endif": "if ブロックを閉じる",
  "script.kw.return": "スクリプトを終了して値を返す",
  "script.kw.var": "変数を宣言する。var 名前 = 値 と書く",
  "script.kw.true": "真偽値の true",
  "script.kw.false": "真偽値の false",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "プレイヤーとワールドに作用する動作",
  "script.module.conditions": "プレイヤーと環境の状態を読む判定",
  "script.module.math": "数学演算と乱数",
  "script.module.vault": "経済インターフェース（Vault が必要）",
  "script.module.vault_unlocked":
    "複数通貨の経済インターフェース（VaultUnlocked が必要）",
  "script.module.playerpoints":
    "ポイントインターフェース（PlayerPoints が必要）",
  "script.module.obj": "オブジェクトのフィールドとメソッドへのリフレクションアクセス",
  "script.complete.returns": "戻り値",
  "triggers.priority": "優先度（priority）",
  "triggers.priorityHint": "数値が小さいものから実行されます",
  "triggers.cooldown": "クールダウン（秒）",
  "triggers.cooldownHint": "0 は制限なし",
  "triggers.enabled": "有効",
  "triggers.disabled": "無効",
  "triggers.perPlayer": "プレイヤーごとのクールダウン",
  "triggers.shared": "サーバー全体で共有するクールダウン",

  "fields.section": "レシピ設定",
  "fields.fileName": "レシピのファイル名",
  "fields.exportAs": "{name}.yml としてエクスポート",
  "fields.recipeId": "レシピ ID（recipe_id）",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "空欄の場合、プラグインがファイル名をレシピ ID として使用します",
  "fields.recipeIdRequiredHint":
    "ファイル名をレシピ ID として使用できないため、ここに入力する必要があります",
  "fields.group": "レシピグループ（group）",
  "fields.groupPlaceholder": "空欄の場合はグループ化しません",
  "fields.groupHint":
    "同じグループのレシピはレシピブックでまとめて表示されます",
  "fields.exp": "獲得経験値（exp）",
  "fields.time": "精錬時間（time）",
  "fields.timeHint": "単位は tick、20 tick = 1 秒",
  "fields.costLevel": "必要レベル（cost_level）",
  "fields.trimPattern": "装飾の模様（trim_pattern）",
  "fields.bookCategory": "レシピブックの分類",
  "fields.bookCategoryHint": "1.19.3+ のサーバーが必要です",
  "fields.unspecified": "指定しない",
  "fields.previewSection": "偽の結果（任意）",
  "fields.previewSlot": "偽の結果",
  "fields.previewLabel": "偽の結果アイテム",
  "fields.previewHint":
    "クラフト時に結果スロットにこのアイテムを表示し、本当の完成品を隠します。プレイヤーが取り出すのは実際の完成品です。空欄の場合は fake_result_preview を書き込みません。",
  "fields.copySection": "コンポーネント引き継ぎルール（任意）",
  "fields.copyHint":
    "選択したコンポーネントは入力アイテムから完成品にコピーされ、copy_components_rules に書き込まれます。",
  "fields.copySince": "{name}（{since} が必要）",
  "fields.removeRule": "{name} を削除",

  "category.crafting.building": "建築ブロック",
  "category.crafting.redstone": "レッドストーン",
  "category.crafting.equipment": "装備",
  "category.crafting.misc": "その他",
  "category.cooking.food": "食料",
  "category.cooking.blocks": "ブロック",
  "category.cooking.misc": "その他",

  "copyRule.all": "すべてのコンポーネント",
  "copyRule.enchantments": "エンチャント",
  "copyRule.attributes": "属性",
  "copyRule.display_name": "表示名",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "モデルデータ",
  "copyRule.item_flag": "アイテムフラグ",
  "copyRule.unbreakable": "不破壊",
  "copyRule.trim": "防具の装飾",
  "copyRule.food": "食料",
  "copyRule.max_stack_size": "スタック上限",
  "copyRule.rarity": "レア度",
  "copyRule.fire_resistance": "耐火",
  "copyRule.hide_tooltip": "ツールチップを隠す",
  "copyRule.item_name": "アイテム名",
  "copyRule.tool": "ツール",
  "copyRule.item_model": "アイテムモデル",
  "copyRule.custom_model_data_component": "モデルデータコンポーネント",

  "itemCategory.building": "建築ブロック",
  "itemCategory.ore": "鉱石",
  "itemCategory.tool": "ツール",
  "itemCategory.combat": "戦闘",
  "itemCategory.food": "食料",
  "itemCategory.redstone": "レッドストーン",
  "itemCategory.brewing": "醸造",
  "itemCategory.misc": "その他",

  "recipeGroup.crafting": "クラフト",
  "recipeGroup.smelting": "精錬",
  "recipeGroup.smithing": "鍛冶",
  "recipeGroup.processing": "加工",

  "recipeType.vanilla_shaped": "定形レシピ",
  "recipeType.vanilla_shaped.summary":
    "3×3 の形に沿って素材を配置します。位置によってクラフトできるかが決まります。",
  "recipeType.vanilla_shapeless": "不定形レシピ",
  "recipeType.vanilla_shapeless.summary":
    "素材が揃っていればクラフトでき、配置位置は問いません。",
  "recipeType.vanilla_smelting_furnace": "かまどのレシピ",
  "recipeType.vanilla_smelting_furnace.summary":
    "かまどで 1 つの素材を精錬します。経験値と時間を設定できます。",
  "recipeType.vanilla_smelting_blast": "溶鉱炉のレシピ",
  "recipeType.vanilla_smelting_blast.summary":
    "溶鉱炉専用の精錬で、主に鉱石や金属に使います。",
  "recipeType.vanilla_smelting_smoker": "燻製器のレシピ",
  "recipeType.vanilla_smelting_smoker.summary":
    "燻製器専用の精錬で、主に食料に使います。",
  "recipeType.vanilla_smelting_campfire": "焚き火のレシピ",
  "recipeType.vanilla_smelting_campfire.summary":
    "焚き火での調理で、通常はかまどより時間がかかります。",
  "recipeType.vanilla_smithing_transform": "鍛冶レシピ",
  "recipeType.vanilla_smithing_transform.summary":
    "テンプレートと追加素材で、ベースアイテムを新しいアイテムに強化します。",
  "recipeType.vanilla_smithing_trim": "装飾の鍛冶レシピ",
  "recipeType.vanilla_smithing_trim.summary":
    "防具に装飾を追加します。装飾の模様の指定が必須です。",
  "recipeType.vanilla_stonecutting": "石切りのレシピ",
  "recipeType.vanilla_stonecutting.summary":
    "石切台で 1 つの素材を完成品に切り出します。",
  "recipeType.vanilla_brewing": "醸造レシピ",
  "recipeType.vanilla_brewing.summary":
    "醸造台で素材を使い、下段の入力アイテムを変化させます。",
  "recipeType.anvil": "金床のレシピ",
  "recipeType.anvil.summary":
    "金床で 2 つのアイテムを合成します。必要レベルを設定できます。",

  "station.crafting_table": "作業台",
  "station.furnace": "かまど",
  "station.blast_furnace": "溶鉱炉",
  "station.smoker": "燻製器",
  "station.campfire": "焚き火",
  "station.smithing_table": "鍛冶台",
  "station.stonecutter": "石切台",
  "station.brewing_stand": "醸造台",
  "station.anvil": "金床",

  "guiSlot.gridCell": "グリッドスロット",
  "guiSlot.gridPosition": "{row} 行 {col} 列目",
  "guiSlot.shapelessIngredient": "素材 {index}",
  "guiSlot.ingredient": "素材",
  "guiSlot.result": "完成品",
  "guiSlot.template": "テンプレート",
  "guiSlot.base": "ベースアイテム",
  "guiSlot.addition": "追加素材",
  "guiSlot.anvilBase": "左側のアイテム",
  "guiSlot.anvilAddition": "右側のアイテム",
  "guiSlot.brewingInput": "入力アイテム",
  "guiSlot.brewingMiddle": "中央のボトルスロット",
  "guiSlot.inertFuel":
    "燃料スロットはプレイヤーが入れるもので、レシピでは扱いません",
  "guiSlot.inertBottle":
    "左右のボトルスロットは中央のボトルスロットと同じ入力アイテムを使用します",

  "triggerGroup.craft": "クラフト関連",
  "triggerGroup.player": "プレイヤーイベント",
  "triggerGroup.entity": "エンティティイベント",
  "triggerGroup.block": "ブロックイベント",
  "triggerGroup.inventory": "インベントリイベント",

  "triggerType.crafting": "作業台でクラフト",
  "triggerType.smithing": "鍛冶台で鍛冶",
  "triggerType.anvil": "金床で合成",
  "triggerType.player_join": "プレイヤー参加",
  "triggerType.player_quit": "プレイヤー退出",
  "triggerType.player_death": "プレイヤー死亡",
  "triggerType.player_respawn": "プレイヤーリスポーン",
  "triggerType.player_interact": "プレイヤーの操作",
  "triggerType.player_advancement": "進捗の達成",
  "triggerType.player_level_change": "レベル変化",
  "triggerType.player_exp_change": "経験値変化",
  "triggerType.player_toggle_sneak": "スニーク切り替え",
  "triggerType.player_toggle_sprint": "ダッシュ切り替え",
  "triggerType.player_item_consume": "アイテムの飲食",
  "triggerType.player_item_held": "手持ちアイテムの切り替え",
  "triggerType.player_item_damage": "アイテムの損傷",
  "triggerType.player_item_mend": "アイテムの修繕",
  "triggerType.player_fish": "釣り",
  "triggerType.player_teleport": "テレポート",
  "triggerType.player_portal": "ポータルの通過",
  "triggerType.player_changed_world": "ワールドの切り替え",
  "triggerType.player_drop_item": "アイテムを捨てる",
  "triggerType.player_pickup_item": "アイテムを拾う",
  "triggerType.player_game_mode_change": "ゲームモードの切り替え",
  "triggerType.player_recipe_discover": "レシピの解除",
  "triggerType.player_command_preprocess": "コマンドの実行",
  "triggerType.player_move": "プレイヤーの移動",
  "triggerType.player_bed_enter": "ベッドに入る",
  "triggerType.player_bed_leave": "ベッドから出る",
  "triggerType.player_swap_hand_items": "メインハンドとオフハンドの入れ替え",
  "triggerType.player_edit_book": "本の編集",
  "triggerType.player_statistic": "統計の変化",
  "triggerType.player_bucket_fill": "バケツに入れる",
  "triggerType.player_bucket_empty": "バケツから出す",
  "triggerType.player_shear_entity": "ハサミで刈る",
  "triggerType.damage_entity": "ダメージを与える",
  "triggerType.kill_entity": "エンティティの討伐",
  "triggerType.entity_shoot_bow": "弓を射る",
  "triggerType.entity_breed": "動物の繁殖",
  "triggerType.entity_tame": "動物を懐かせる",
  "triggerType.entity_potion_effect": "ポーション効果の変化",
  "triggerType.block_break": "ブロックの破壊",
  "triggerType.block_place": "ブロックの設置",
  "triggerType.inventory_click": "インベントリのクリック",
  "triggerType.inventory_open": "インベントリを開く",
  "triggerType.inventory_close": "インベントリを閉じる",

  "issue.fileNameEmpty": "レシピのファイル名は空にできません。",
  "issue.fileNameNeedsRecipeId":
    "ファイル名に使用できない文字が含まれています。recipe_id がない場合、プラグインはファイル名をレシピ ID として使うため読み込みに失敗します：小文字英字、数字、アンダースコア、ハイフン、ドットを使うか、下欄にレシピ ID を入力してください。",
  "issue.recipeIdPattern":
    "レシピ ID には小文字英字、数字、アンダースコア、ハイフン、ドットのみ使用できます。",
  "issue.resultMissing": "完成品（result）が未設定です。",
  "issue.resultMustBeItem":
    "完成品は具体的なアイテムのみで、タグやアイテムパックは指定できません。",
  "issue.gridEmpty": "クラフトグリッドには少なくとも 1 つの素材が必要です。",
  "issue.gridTooManyKinds":
    "素材の種類が 9 種を超えているため、shape を生成できません。",
  "issue.shapelessEmpty": "不定形レシピには少なくとも 1 つの素材が必要です。",
  "issue.shapelessTooMany": "不定形レシピの素材は最大 9 個です。",
  "issue.smeltingIngredient": "精錬する素材（ingredient）が未設定です。",
  "issue.cookingTime": "精錬時間は 0 tick より大きくする必要があります。",
  "issue.expNegative": "経験値に負の値は指定できません。",
  "issue.stonecuttingIngredient": "石切りの素材（ingredient）が未設定です。",
  "issue.smithingBase": "ベースアイテム（base）が未設定です。",
  "issue.smithingAddition": "追加素材（addition）が未設定です。",
  "issue.smithingTemplate":
    "鍛冶テンプレート（template）が未設定です。1.20+ のサーバーでは通常必要です。",
  "issue.trimPattern":
    "装飾の鍛冶では装飾の模様（trim_pattern）の指定が必須です。",
  "issue.brewingInput": "醸造の入力アイテム（input）が未設定です。",
  "issue.brewingIngredient": "醸造の素材（ingredient）が未設定です。",
  "issue.anvilBase": "左側のアイテム（base）が未設定です。",
  "issue.anvilAddition": "右側のアイテム（addition）が未設定です。",
  "issue.costLevelNegative": "必要レベルに負の値は指定できません。",
  "issue.packUndefined":
    "未定義のアイテムパック {name} を参照しています。「アイテムパック」で作成するか、サーバー上に存在することを確認してください。",
  "issue.brewingTagInput":
    "醸造の入力アイテムにタグを使用しています。醸造レシピでのタグ一致の挙動はサーバー実装に依存するため、具体的なアイテムの使用を推奨します。",
  "issue.brewingTagIngredient":
    "醸造の素材にタグを使用しています。醸造レシピでのタグ一致の挙動はサーバー実装に依存するため、具体的なアイテムの使用を推奨します。",
  "issue.packNameEmpty": "名前が設定されていないアイテムパックがあります。",
  "issue.packNameDuplicate":
    "アイテムパック名 {name} が重複しています。後のものが前のものを上書きします。",
  "issue.packNamePattern":
    "アイテムパック名 {name} には小文字英字、数字、アンダースコア、ハイフンのみの使用を推奨します。",
  "issue.packItemsEmpty":
    "アイテムパック {name} にアイテムがないため、プラグインはスキップします。",
  "issue.packNested":
    "アイテムパック {name} にタグや他のアイテムパックをネストできません。具体的なアイテムのみ指定できます。",
  "issue.triggerIdEmpty": "名前が設定されていないトリガーがあります。",
  "issue.triggerIdDuplicate":
    "トリガー ID {name} が重複しています。後のものが前のものを上書きします。",
  "issue.triggerIdPattern":
    "トリガー ID {name} には小文字英字、数字、アンダースコア、ハイフンのみの使用を推奨します。",
  "issue.triggerTypeMissing":
    "トリガー {name} は種類が選択されていないため、プラグインはスキップします。",
  "issue.triggerNoActions":
    "トリガー {name} には動作がないため、発動しても効果がありません。",
  "issue.triggerCooldownNegative":
    "トリガー {name} のクールダウンに負の値は指定できません。",
  "issue.triggerConditionScript":
    "トリガー {name} の条件 {line} 行目に構文エラーがあります。プラグインの読み込みに失敗します。",
  "issue.triggerActionScript":
    "トリガー {name} のアクション {line} 行目に構文エラーがあります。プラグインの読み込みに失敗します。",

  "parse.yamlFailed": "YAML の解析に失敗しました：{detail}",
  "parse.notRecipe":
    "このファイルはレシピ設定ではありません（最上位はキーと値の対応が必要です）。",
  "parse.typeMissing":
    "type フィールドがないため、レシピの種類を判定できません。",
  "parse.typeUnsupported": "未対応のレシピの種類：{name}",
  "parse.resultMissing":
    "result を読み取れませんでした。完成品を再設定してください。",
  "parse.shapeMissing":
    "有効な shape / ingredients を読み取れなかったため、グリッドは空のままです。",
  "parse.shapeCharUnmapped":
    "shape 内の文字 {name} に対応する素材がありません。",
  "parse.shapeTooManyRows":
    "shape が 3 行を超えているため、先頭 3 行のみインポートしました。",
  "parse.ingredientsMissing":
    "ingredients を読み取れなかったため、素材リストは空のままです。",
  "parse.ingredientsTooMany":
    "素材が 9 個を超えているため、先頭 9 個のみインポートしました。",
  "parse.amountClamped":
    "一部の個数を修正しました：このスロットは個数を読み取らない、または上限 {max} を超えていました。",
  "parse.cookingCategoryUnknown": "認識できない精錬レシピブックの分類：{name}",
  "parse.craftingCategoryUnknown":
    "認識できないクラフトレシピブックの分類：{name}",
  "parse.notItemPacks":
    "このファイルはアイテムパック設定ではありません（最上位はパック名からリストへの対応が必要です）。",
  "parse.packNotList":
    "アイテムパック {name} の値がリストではないため、スキップしました。",
  "parse.packNoItems":
    "アイテムパック {name} に有効なアイテムがないため、スキップしました。",
  "parse.notTriggers":
    "このファイルはトリガー設定ではありません（最上位はトリガー ID から設定への対応が必要です）。",
  "parse.triggerNotMap":
    "トリガー {name} の内容がキーと値の対応ではないため、スキップしました。",
  "parse.triggerTypeMissing":
    "トリガー {name} に type がないため、スキップしました。",
};
