import type { MessageKey } from "./zh_cn";

export const ruRu: Record<MessageKey, string> = {
  "brand.title": "Мастерская рецептов Craftorithm",
  "brand.sub": "Генерация YAML рецептов локально, без входа в аккаунт",

  "view.aria": "Рабочая область",
  "skip.toWorkbench": "Перейти к верстаку",
  "view.recipe": "Рецепт",
  "view.packs": "Наборы предметов",
  "view.triggers": "Триггеры",

  "tabs.aria": "Открытые файлы",
  "tabs.close": "Закрыть {name}",
  "tabs.newRecipe": "Новый рецепт",
  "tabs.newTrigger": "Новый файл триггеров",
  "tabs.saveAsNew": "Сохранить в новую вкладку",
  "tabs.newMenu": "Другие способы создания",
  "tabs.importFiles": "Импорт файлов…",

  "start.title": "Начало",
  "start.note": "Создайте рецепт или импортируйте существующие файлы, чтобы продолжить.",
  "start.newRecipe": "Новый рецепт",
  "start.importFiles": "Импорт файлов",
  "start.importFolder": "Импорт папки",
  "start.hint": "При импорте папки recipes, item_packs.yml и triggers определяются автоматически.",

  "action.exportAll": "Экспортировать всё",
  "toast.exportedZip": "Экспортировано файлов: {count}",
  "toast.exportEmpty": "Нечего экспортировать",
  "toast.savedAsNew": "Скопировано в новую вкладку",
  "toast.importedCount": "Импортировано файлов: {count}",
  "toast.importSkipped": "Пропущено нераспознанных файлов: {count}",
  "toast.tabClosed": "{name} закрыт",
  "toast.typeChangedLost": "Смена типа удалила {count} ингредиентов — можно отменить",

  "history.undo": "Отменить",
  "history.redo": "Повторить",
  "history.undoOf": "Отменить: {action}",
  "history.action.changeType": "смена типа рецепта",
  "history.action.reset": "сброс рецепта",
  "history.action.closeTab": "закрытие файла",
  "history.action.import": "перезапись при импорте",
  "history.action.packEdit": "изменение набора предметов",

  "step.aria": "Шаги редактирования",
  "step.type": "Тип",
  "step.edit": "Редактирование",
  "step.export": "Экспорт",

  "action.reset": "Сброс",
  "action.resetRecipe": "Сбросить рецепт",
  "action.importYaml": "Импорт YAML",
  "action.downloadYaml": "Скачать YAML",
  "action.copyClipboard": "Копировать в буфер обмена",
  "action.close": "Закрыть",
  "action.remove": "Удалить",

  "locale.switch": "Язык интерфейса",
  "theme.switch": "Оформление",
  "theme.light": "Светлое",
  "theme.dark": "Тёмное",

  "catalog.offline":
    "Список предметов недоступен, используется встроенный список",

  "footer.aria": "О проекте и связанные ссылки",
  "footer.credit": "Сделано 氿雾 · редактор рецептов для плагина Craftorithm",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Документация",
  "footer.link.qq": "Группа QQ",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML скопирован в буфер обмена",
  "toast.copyFailed": "Не удалось скопировать, выделите предпросмотр вручную",
  "toast.downloaded": "Скачано: {name}",
  "toast.saved": "{name} сохранён в выбранное место",

  "next.titleDownloaded": "{name} загружен — осталось два шага",
  "next.titleSaved": "{name} сохранён — осталось два шага",
  "next.step1": "Поместите файл сюда на сервере (файл с тем же именем перезаписывается):",
  "next.step2": "Выполните в консоли сервера или в игре:",
  "next.step3": "Попробуйте создать предмет в игре. Если ничего не изменилось, проверьте консоль на ошибки загрузки.",
  "next.copyPath": "Копировать путь",
  "next.copyCommand": "Копировать команду",
  "next.pathCopied": "Путь скопирован",
  "next.commandCopied": "Команда скопирована",
  "next.done": "Понятно",
  "toast.imported": "Импортировано: {name}",
  "toast.recipeReset": "Сброшено до пустого рецепта",
  "bench.station": "Рабочая станция: {name}",
  "bench.importWarnings":
    "При импорте требуется проверить {count} мест: {detail}",
  "bench.shapelessNote":
    "Бесформенный рецепт проверяет только наличие всех ингредиентов, расположение не важно.",
  "bench.inertNote":
    "Некликабельные слоты игрок использует в игре, рецепт в них ничего не записывает.",
  "bench.guiAlt": "Интерфейс: {name}",
  "bench.resultOutside": "Результат (та же ячейка, что в интерфейсе выше)",

  "typeNav.aria": "Тип рецепта",

  "inspector.title": "Результат и проверка",
  "inspector.resultUnset": "Результат ещё не задан",
  "inspector.resultHint": "Нажмите слот результата на верстаке",
  "inspector.slotUnset": "Не задано",
  "inspector.mustFix": "Нужно исправить: {count}",
  "inspector.stillTodo": "Осталось шагов: {count}",
  "inspector.ready": "Рецепт полный, можно экспортировать",
  "inspector.yamlTitle": "Предпросмотр YAML",
  "inspector.fixFirst": "Исправьте ошибки выше, чтобы скачать файл.",

  "picker.aria": "Выбор ингредиента: {name}",
  "picker.title": "Выбор ингредиента · {name}",
  "picker.clearSlot": "Очистить слот",
  "picker.tabsAria": "Тип ингредиента",
  "picker.tab.item": "Предметы",
  "picker.tab.tag": "Теги",
  "picker.tab.item_pack": "Наборы",
  "picker.categoryAll": "Все",
  "picker.search.item": "Поиск по названию или ID, например diamond",
  "picker.search.tag": "Поиск тегов, например planks / logs",
  "picker.search.item_pack": "Поиск по имени набора предметов",
  "picker.custom.item": "Свой ID предмета",
  "picker.custom.tag": "Своё имя тега",
  "picker.custom.item_pack": "Своё имя набора предметов",
  "picker.customPlaceholder.item": "minecraft:diamond или oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Количество",
  "picker.use": "Применить",
  "picker.loadingItems": "Загрузка списка предметов {version}…",
  "picker.loadingTags": "Загрузка тегов материалов {version}…",
  "picker.noItem": "Совпадений нет. Можно ввести ID предмета ниже.",
  "picker.noTag":
    "Список тегов недоступен. Можно ввести имя тега ниже, например planks.",
  "picker.noPack":
    "Наборов предметов пока нет. Создайте набор на вкладке «Наборы предметов» или введите имя ниже.",
  "picker.showMore": "Показать ещё (осталось {count})",
  "picker.packItemCount": "Предметов: {count}",
  "picker.tagItemCount": "Предметов в этом теге: {count}",
  "picker.packGlyph": "Н",

  "slot.empty": "пусто",
  "slot.item": "Предмет",
  "slot.itemPack": "Набор предметов",
  "choice.tag": "Тег {name}",
  "choice.itemPack": "Набор предметов {name}",
  "badge.tag": "Тег",
  "badge.itemPack": "Набор",

  "packs.title": "Наборы предметов",
  "packs.note":
    "Объедините несколько предметов в набор и указывайте его в рецепте через {code}: подойдёт любой из них.",
  "packs.create": "Новый набор предметов",
  "packs.import": "Импорт item_packs.yml",
  "packs.empty":
    "Наборов предметов пока нет. Создайте набор, и его можно будет выбрать в любом слоте ингредиента.",
  "packs.name": "Имя набора",
  "packs.removeGroup": "Удалить набор",
  "packs.removeItem": "Удалить предмет {index}",
  "packs.addItem": "Добавить предмет в {name}",
  "packs.yamlEmpty": "# Наборов предметов пока нет",
  "packs.imported": "Импортировано наборов предметов: {count}",
  "packs.importedWithWarnings":
    "Импортировано наборов предметов: {count}, замечаний: {warnings}",

  "triggers.title": "Триггеры",
  "triggers.note":
    "Выполняйте действия при изготовлении и других событиях. Положите файл в каталог плагина {code}.",
  "triggers.fileName": "Имя файла",
  "triggers.exportAs": "Экспорт как {name}.yml",
  "triggers.create": "Новый триггер",
  "triggers.import": "Импорт YAML триггеров",
  "triggers.empty": "Триггеров пока нет. Создайте первый, чтобы начать.",
  "triggers.yamlEmpty": "# Триггеров пока нет",
  "triggers.imported": "Импортировано триггеров: {count}",
  "triggers.importedWithWarnings":
    "Импортировано триггеров: {count}, замечаний: {warnings}",
  "triggers.id": "ID триггера",
  "triggers.type": "Тип триггера",
  "triggers.recipes": "Ограничение по рецептам (recipes)",
  "triggers.recipesHint":
    "Пусто — срабатывают все рецепты этого типа. Указывайте полный ключ рецепта, например craftorithm:my_sword",
  "triggers.conditions": "Условия (conditions)",
  "triggers.mode.and": "Все условия выполнены",
  "triggers.mode.script": "Блок скрипта",
  "triggers.conditionsHint.and":
    'По одному условию в строке, все должны выполняться. Например papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Пишите скрипт построчно, нужно самому вернуть return true / false.",
  "triggers.actions": "Действия (actions)",
  "triggers.actionsHint":
    'По одному действию в строке, например tell("&aИзготовлено!") или give_level(100)',
  "triggers.variables": "Доступные переменные: {list}",

  // ---- Редактор скриптов ----
  "script.line": "Строка {line}",
  "script.status.errors": "Синтаксических ошибок: {count}",
  "script.status.warnings": "Замечаний: {count}",
  "script.hint.condition":
    "Tab — автодополнение, Ctrl+Space — список подсказок. Условие должно давать true / false.",
  "script.hint.action":
    "Tab — автодополнение, Ctrl+Space — список подсказок. По одному действию в строке.",
  "script.undo": "Отменить",
  "script.redo": "Повторить",

  // Лексические ошибки
  "script.err.unterminatedString": "В строке нет закрывающей двойной кавычки",
  "script.err.unexpectedChar": "Нераспознанный символ",

  // Ошибки структуры
  "script.err.unclosedParen": "Скобка не закрыта",
  "script.err.unexpectedParen": "Лишняя закрывающая скобка",
  "script.err.missingEndif": "у if нет парного endif",
  "script.err.orphanEndif": "у endif нет соответствующего if",
  "script.err.orphanBranch": "у {keyword} нет соответствующего if",
  "script.err.expectedFunctionName": "После двоеточия нужно имя функции",
  "script.err.moduleCallNeedsParen":
    "Вызов модуля требует скобок; пишите {name}(...)",
  "script.err.expectedMethodCall":
    "После точки нужен вызов метода; пишите .{name}(...)",
  "script.err.expectedVarName": "После var нужно «имя = значение»",

  // Имена и аргументы
  "script.err.unknownFunction": "Неизвестная функция {name}",
  "script.err.unknownModule": "Неизвестный модуль {name}",
  "script.err.argCount":
    "{name} требует аргументов: {expected}, передано: {actual}",
  "script.err.argType":
    "Параметр {param} функции {name} требует {expected}, передано {actual}",
  "script.err.ambiguousName":
    "{name} есть в нескольких модулях, лучше написать {qualified}",
  "script.err.unknownVariable":
    "Переменная {name} не объявлена и не предоставляется этим триггером",

  // Смысловые замечания
  "script.err.assignUndeclared":
    "{name} не объявлена через var; возможно, нужно var {name} = ...",
  "script.err.blockInAndMode":
    "В режиме «все условия» каждая строка должна быть самостоятельным условием, поэтому {name} использовать нельзя; для ветвлений и переменных переключитесь на «блок скрипта»",
  "script.err.queryInAction":
    "{name} только читает значение, возможно, нужно обернуть в if",
  "script.err.notBoolean": "Эта строка не даёт true / false",

  // Описания функций, ключ вида script.fn.<module>.<name>
  "script.fn.actions.command":
    "Выполнить команду от имени игрока. Несколько аргументов склеиваются подряд",
  "script.fn.actions.console":
    "Выполнить команду от имени консоли. Несколько аргументов склеиваются подряд",
  "script.fn.actions.tell":
    "Отправить игроку сообщение в чат. Несколько аргументов склеиваются подряд",
  "script.fn.actions.actionbar":
    "Показать сообщение над инвентарём. Несколько аргументов склеиваются подряд",
  "script.fn.actions.title": "Показать заголовок и подзаголовок",
  "script.fn.actions.log":
    "Записать в журнал сервера. Несколько аргументов склеиваются подряд",
  "script.fn.actions.take_level": "Снять уровни у игрока",
  "script.fn.actions.give_level": "Выдать уровни игроку",
  "script.fn.actions.give_exp": "Выдать игроку опыт",
  "script.fn.actions.close": "Закрыть текущий экран",
  "script.fn.actions.back": "Вернуться в предыдущее меню",
  "script.fn.actions.openmenu": "Открыть своё меню",
  "script.fn.actions.discover_recipe": "Разблокировать рецепт",
  "script.fn.actions.undiscover_recipe": "Заблокировать рецепт",
  "script.fn.actions.sound": "Проиграть звук",
  "script.fn.actions.set_inv_item": "Задать предмет в слоте открытого экрана",
  "script.fn.conditions.perm": "Проверить, есть ли у игрока право",
  "script.fn.conditions.papi": "Получить значение переменной PlaceholderAPI",
  "script.fn.conditions.level": "Получить уровень игрока",
  "script.fn.conditions.world":
    "Получить имя мира, с аргументом — сравнить его",
  "script.fn.conditions.gamemode":
    "Получить игровой режим, с аргументом — сравнить его",
  "script.fn.conditions.item": "Проверить, совпадает ли предмет события с ID",
  "script.fn.conditions.biome": "Получить биом, с аргументом — сравнить его",
  "script.fn.conditions.in_water": "Проверить, находится ли игрок в воде",
  "script.fn.conditions.in_rain": "Проверить, находится ли игрок под дождём",
  "script.fn.conditions.light_level":
    "Получить уровень освещения на блоке игрока",
  "script.fn.conditions.match_item_id":
    "Получить ID предмета с пространством имён",
  "script.fn.math.abs": "Абсолютное значение",
  "script.fn.math.min": "Меньшее из значений",
  "script.fn.math.max": "Большее из значений",
  "script.fn.math.round": "Округление до ближайшего",
  "script.fn.math.floor": "Округление вниз",
  "script.fn.math.ceil": "Округление вверх",
  "script.fn.math.sqrt": "Квадратный корень",
  "script.fn.math.pow": "Возведение в степень",
  "script.fn.math.random":
    "Случайное число. Без аргументов это 0~1, один аргумент — верхняя граница, два — min~max",
  "script.fn.math.random_int":
    "Случайное целое. Один аргумент — верхняя граница, два — min~max",
  "script.fn.math.int": "Преобразовать в целое число",
  "script.fn.math.float": "Преобразовать в число с плавающей точкой",
  "script.fn.vault.money": "Получить баланс игрока (Vault)",
  "script.fn.vault.take_money": "Списать с баланса (Vault)",
  "script.fn.vault.give_money": "Начислить на баланс (Vault)",
  "script.fn.vault_unlocked.money":
    "Получить баланс игрока (VaultUnlocked). Без валюты используется валюта по умолчанию",
  "script.fn.vault_unlocked.take_money":
    "Списать с баланса (VaultUnlocked). Без валюты используется валюта по умолчанию",
  "script.fn.vault_unlocked.give_money":
    "Начислить на баланс (VaultUnlocked). Без валюты используется валюта по умолчанию",
  "script.fn.playerpoints.points": "Получить очки игрока",
  "script.fn.playerpoints.take_points": "Списать очки",
  "script.fn.playerpoints.give_points": "Начислить очки",
  "script.fn.obj.get":
    "Прочитать поле объекта, обычно пишут x.get(\"поле\")",
  "script.fn.obj.set":
    "Записать поле объекта, обычно пишут x.set(\"поле\", значение)",
  "script.fn.obj.invoke":
    "Вызвать метод объекта, обычно пишут x.invoke(\"метод\", аргументы...)",
  // У delay нет пространства имён, только короткое имя, ключ script.fn.delay
  "script.fn.delay": "Подождать указанное число тиков и продолжить",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if": "Выполняет следующие инструкции, если условие верно",
  "script.kw.elseif": "Проверяет другое условие, если предыдущее не выполнено",
  "script.kw.else": "Выполняется, если ни одно условие выше не верно",
  "script.kw.endif": "Закрывает блок if",
  "script.kw.return": "Завершает скрипт и возвращает значение",
  "script.kw.var": "Объявляет переменную, пишется var имя = значение",
  "script.kw.true": "Логическое значение «истина»",
  "script.kw.false": "Логическое значение «ложь»",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Действия, влияющие на игрока и мир",
  "script.module.conditions": "Проверки состояния игрока и окружения",
  "script.module.math": "Математические операции и случайные числа",
  "script.module.vault": "Экономический интерфейс (требуется Vault)",
  "script.module.vault_unlocked":
    "Мультивалютный экономический интерфейс (требуется VaultUnlocked)",
  "script.module.playerpoints": "Интерфейс очков (требуется PlayerPoints)",
  "script.module.obj": "Рефлексивный доступ к полям и методам объекта",
  "script.complete.returns": "Возвращает",
  "triggers.priority": "Приоритет (priority)",
  "triggers.priorityHint": "Чем меньше число, тем раньше выполняется",
  "triggers.cooldown": "Перезарядка (секунды)",
  "triggers.cooldownHint": "0 — без ограничения",
  "triggers.enabled": "Включён",
  "triggers.disabled": "Отключён",
  "triggers.perPlayer": "Перезарядка для каждого игрока",
  "triggers.shared": "Общая перезарядка на сервере",

  "fields.section": "Настройки рецепта",
  "fields.fileName": "Имя файла рецепта",
  "fields.exportAs": "Экспорт как {name}.yml",
  "fields.recipeId": "ID рецепта (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint": "Если пусто, плагин возьмёт имя файла как ID рецепта",
  "fields.recipeIdRequiredHint":
    "Имя файла не подходит как ID рецепта, укажите его здесь",
  "fields.group": "Группа рецептов (group)",
  "fields.groupPlaceholder": "Пусто — без группы",
  "fields.groupHint": "Рецепты одной группы объединяются в книге рецептов",
  "fields.exp": "Получаемый опыт (exp)",
  "fields.time": "Время переплавки (time)",
  "fields.timeHint": "В тиках, 20 тиков = 1 секунда",
  "fields.costLevel": "Нужные уровни (cost_level)",
  "fields.trimPattern": "Узор отделки (trim_pattern)",
  "fields.bookCategory": "Категория в книге рецептов",
  "fields.bookCategoryHint": "Требуется сервер 1.19.3+",
  "fields.unspecified": "Не указано",
  "fields.previewSection": "Ложный результат (необязательно)",
  "fields.previewSlot": "Ложный результат",
  "fields.previewLabel": "Предмет ложного результата",
  "fields.previewHint":
    "При изготовлении в слоте результата показывается этот предмет, чтобы скрыть настоящий; игрок всё равно забирает настоящий результат. Если пусто, fake_result_preview не записывается.",
  "fields.copySection": "Правила переноса компонентов (необязательно)",
  "fields.copyHint":
    "Выбранные компоненты копируются из входного предмета в результат и пишутся в copy_components_rules.",
  "fields.copySince": "{name} (требуется {since})",
  "fields.removeRule": "Удалить {name}",

  "category.crafting.building": "Строительные блоки",
  "category.crafting.redstone": "Предметы из редстоуна",
  "category.crafting.equipment": "Снаряжение",
  "category.crafting.misc": "Разное",
  "category.cooking.food": "Еда",
  "category.cooking.blocks": "Блоки",
  "category.cooking.misc": "Разное",

  "copyRule.all": "Все компоненты",
  "copyRule.enchantments": "Чары",
  "copyRule.attributes": "Атрибуты",
  "copyRule.display_name": "Отображаемое имя",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Данные модели",
  "copyRule.item_flag": "Метки предмета",
  "copyRule.unbreakable": "Неразрушимость",
  "copyRule.trim": "Отделка брони",
  "copyRule.food": "Еда",
  "copyRule.max_stack_size": "Размер стака",
  "copyRule.rarity": "Редкость",
  "copyRule.fire_resistance": "Огнестойкость",
  "copyRule.hide_tooltip": "Скрыть подсказку",
  "copyRule.item_name": "Название предмета",
  "copyRule.tool": "Инструмент",
  "copyRule.item_model": "Модель предмета",
  "copyRule.custom_model_data_component": "Компонент данных модели",

  "itemCategory.building": "Строительство",
  "itemCategory.ore": "Руды",
  "itemCategory.tool": "Инструменты",
  "itemCategory.combat": "Бой",
  "itemCategory.food": "Еда",
  "itemCategory.redstone": "Редстоун",
  "itemCategory.brewing": "Варка",
  "itemCategory.misc": "Разное",

  "recipeGroup.crafting": "Изготовление",
  "recipeGroup.smelting": "Переплавка",
  "recipeGroup.smithing": "Кузнечное дело",
  "recipeGroup.processing": "Обработка",

  "recipeType.vanilla_shaped": "Рецепт по форме",
  "recipeType.vanilla_shaped.summary":
    "Ингредиенты расставляются по форме 3×3, положение определяет результат.",
  "recipeType.vanilla_shapeless": "Бесформенный рецепт",
  "recipeType.vanilla_shapeless.summary":
    "Достаточно всех ингредиентов, расположение не важно.",
  "recipeType.vanilla_smelting_furnace": "Рецепт печи",
  "recipeType.vanilla_smelting_furnace.summary":
    "Переплавка одного ингредиента в печи, с настройкой опыта и времени.",
  "recipeType.vanilla_smelting_blast": "Рецепт плавильни",
  "recipeType.vanilla_smelting_blast.summary":
    "Переплавка в плавильне, обычно для руд и металлов.",
  "recipeType.vanilla_smelting_smoker": "Рецепт коптильни",
  "recipeType.vanilla_smelting_smoker.summary":
    "Обжиг в коптильне, обычно для еды.",
  "recipeType.vanilla_smelting_campfire": "Рецепт костра",
  "recipeType.vanilla_smelting_campfire.summary":
    "Готовка на костре, обычно дольше, чем в печи.",
  "recipeType.vanilla_smithing_transform": "Кузнечный рецепт",
  "recipeType.vanilla_smithing_transform.summary":
    "Шаблон и добавочный материал превращают базовый предмет в новый.",
  "recipeType.vanilla_smithing_trim": "Рецепт отделки брони",
  "recipeType.vanilla_smithing_trim.summary":
    "Добавляет отделку броне, узор отделки обязателен.",
  "recipeType.vanilla_stonecutting": "Рецепт камнереза",
  "recipeType.vanilla_stonecutting.summary":
    "Один ингредиент разрезается в камнерезе в готовый предмет.",
  "recipeType.vanilla_brewing": "Рецепт варки",
  "recipeType.vanilla_brewing.summary":
    "Ингредиент в варочной стойке изменяет входной предмет снизу.",
  "recipeType.anvil": "Рецепт наковальни",
  "recipeType.anvil.summary":
    "Два предмета объединяются на наковальне, нужные уровни настраиваются.",

  "station.crafting_table": "Верстак",
  "station.furnace": "Печь",
  "station.blast_furnace": "Плавильня",
  "station.smoker": "Коптильня",
  "station.campfire": "Костёр",
  "station.smithing_table": "Кузнечный стол",
  "station.stonecutter": "Камнерез",
  "station.brewing_stand": "Варочная стойка",
  "station.anvil": "Наковальня",

  "guiSlot.gridCell": "Ячейка сетки",
  "guiSlot.gridPosition": "строка {row}, столбец {col}",
  "guiSlot.shapelessIngredient": "Ингредиент {index}",
  "guiSlot.ingredient": "Ингредиент",
  "guiSlot.result": "Результат",
  "guiSlot.template": "Шаблон",
  "guiSlot.base": "Базовый предмет",
  "guiSlot.addition": "Добавочный материал",
  "guiSlot.anvilBase": "Левый предмет",
  "guiSlot.anvilAddition": "Правый предмет",
  "guiSlot.brewingInput": "Входной предмет",
  "guiSlot.brewingMiddle": "средний слот для бутылки",
  "guiSlot.inertFuel": "Слот топлива заполняет игрок, рецепт его не использует",
  "guiSlot.inertBottle":
    "Боковые слоты для бутылок используют тот же входной предмет, что и средний",

  "triggerGroup.craft": "Изготовление",
  "triggerGroup.player": "События игрока",
  "triggerGroup.entity": "События существ",
  "triggerGroup.block": "События блоков",
  "triggerGroup.inventory": "События инвентаря",

  "triggerType.crafting": "Изготовление на верстаке",
  "triggerType.smithing": "Ковка на кузнечном столе",
  "triggerType.anvil": "Объединение на наковальне",
  "triggerType.player_join": "Вход игрока",
  "triggerType.player_quit": "Выход игрока",
  "triggerType.player_death": "Смерть игрока",
  "triggerType.player_respawn": "Возрождение игрока",
  "triggerType.player_interact": "Взаимодействие игрока",
  "triggerType.player_advancement": "Получение достижения",
  "triggerType.player_level_change": "Изменение уровня",
  "triggerType.player_exp_change": "Изменение опыта",
  "triggerType.player_toggle_sneak": "Переключение подкрадывания",
  "triggerType.player_toggle_sprint": "Переключение бега",
  "triggerType.player_item_consume": "Употребление предмета",
  "triggerType.player_item_held": "Смена предмета в руке",
  "triggerType.player_item_damage": "Повреждение предмета",
  "triggerType.player_item_mend": "Починка предмета",
  "triggerType.player_fish": "Рыбалка",
  "triggerType.player_teleport": "Телепортация",
  "triggerType.player_portal": "Проход через портал",
  "triggerType.player_changed_world": "Смена мира",
  "triggerType.player_drop_item": "Выбрасывание предмета",
  "triggerType.player_pickup_item": "Подбор предмета",
  "triggerType.player_game_mode_change": "Смена игрового режима",
  "triggerType.player_recipe_discover": "Разблокировка рецепта",
  "triggerType.player_command_preprocess": "Выполнение команды",
  "triggerType.player_move": "Перемещение игрока",
  "triggerType.player_bed_enter": "Игрок лёг в кровать",
  "triggerType.player_bed_leave": "Игрок встал с кровати",
  "triggerType.player_swap_hand_items": "Обмен предметами между руками",
  "triggerType.player_edit_book": "Редактирование книги",
  "triggerType.player_statistic": "Изменение статистики",
  "triggerType.player_bucket_fill": "Наполнение ведра",
  "triggerType.player_bucket_empty": "Опустошение ведра",
  "triggerType.player_shear_entity": "Стрижка существа",
  "triggerType.damage_entity": "Нанесение урона",
  "triggerType.kill_entity": "Убийство существа",
  "triggerType.entity_shoot_bow": "Выстрел из лука",
  "triggerType.entity_breed": "Размножение животных",
  "triggerType.entity_tame": "Приручение животного",
  "triggerType.entity_potion_effect": "Изменение эффекта зелья",
  "triggerType.block_break": "Разрушение блока",
  "triggerType.block_place": "Установка блока",
  "triggerType.inventory_click": "Клик в инвентаре",
  "triggerType.inventory_open": "Открытие инвентаря",
  "triggerType.inventory_close": "Закрытие инвентаря",
  "triggerType.player_interact_entity": "Взаимодействие с существом",
  "triggerType.player_animation": "Анимация игрока",
  "triggerType.player_velocity": "Изменение скорости",
  "triggerType.async_player_chat": "Чат игрока",
  "triggerType.player_take_campfire": "Взять из костра",
  "triggerType.prepare_grindstone": "Подготовка точила",
  "triggerType.trade_select": "Выбор торговли",

  "issue.fileNameEmpty": "Имя файла рецепта не может быть пустым.",
  "issue.fileNameNeedsRecipeId":
    "Имя файла содержит недопустимые символы. Без recipe_id плагин берёт имя файла как ID рецепта, и загрузка не удастся: используйте строчные латинские буквы, цифры, подчёркивания, дефисы и точки либо укажите ID рецепта ниже.",
  "issue.recipeIdPattern":
    "В ID рецепта можно использовать только строчные латинские буквы, цифры, подчёркивания, дефисы и точки.",
  "issue.resultMissing": "Результат (result) ещё не задан.",
  "issue.resultMustBeItem":
    "Результатом может быть только конкретный предмет, но не тег и не набор предметов.",
  "issue.gridEmpty": "В сетке изготовления нужен хотя бы один ингредиент.",
  "issue.gridTooManyKinds":
    "Разных ингредиентов больше 9, форму shape создать нельзя.",
  "issue.shapelessEmpty":
    "Бесформенному рецепту нужен хотя бы один ингредиент.",
  "issue.shapelessTooMany": "В бесформенном рецепте не более 9 ингредиентов.",
  "issue.smeltingIngredient":
    "Ингредиент переплавки (ingredient) ещё не задан.",
  "issue.cookingTime": "Время переплавки должно быть больше 0 тиков.",
  "issue.expNegative": "Опыт не может быть отрицательным.",
  "issue.stonecuttingIngredient":
    "Ингредиент для камнереза (ingredient) ещё не задан.",
  "issue.smithingBase": "Базовый предмет (base) ещё не задан.",
  "issue.smithingAddition": "Добавочный материал (addition) ещё не задан.",
  "issue.smithingTemplate":
    "Кузнечный шаблон (template) не задан, серверам 1.20+ он обычно нужен.",
  "issue.trimPattern":
    "Для рецепта отделки нужно указать узор отделки (trim_pattern).",
  "issue.brewingInput": "Входной предмет для варки (input) ещё не задан.",
  "issue.brewingIngredient": "Ингредиент варки (ingredient) ещё не задан.",
  "issue.anvilBase": "Левый предмет (base) ещё не задан.",
  "issue.anvilAddition": "Правый предмет (addition) ещё не задан.",
  "issue.costLevelNegative": "Нужные уровни не могут быть отрицательными.",
  "issue.packUndefined":
    "Используется неопределённый набор предметов {name}. Создайте его в разделе «Наборы предметов» или убедитесь, что он есть на сервере.",
  "issue.brewingTagInput":
    "Для входного предмета варки использован тег. Совпадение по тегам в варке зависит от реализации сервера, надёжнее указать конкретный предмет.",
  "issue.brewingTagIngredient":
    "Для ингредиента варки использован тег. Совпадение по тегам в варке зависит от реализации сервера, надёжнее указать конкретный предмет.",
  "issue.packNameEmpty": "Есть набор предметов без имени.",
  "issue.packNameDuplicate":
    "Имя набора предметов {name} повторяется, последующие переопределят предыдущие.",
  "issue.packNamePattern":
    "В имени набора предметов {name} лучше использовать только строчные латинские буквы, цифры, подчёркивания и дефисы.",
  "issue.packItemsEmpty":
    "В наборе предметов {name} нет предметов, плагин его пропустит.",
  "issue.packNested":
    "В наборе предметов {name} нельзя вкладывать теги или другие наборы, только конкретные предметы.",
  "issue.triggerIdEmpty": "Есть триггер без имени.",
  "issue.triggerIdDuplicate":
    "ID триггера {name} повторяется, последующие переопределят предыдущие.",
  "issue.triggerIdPattern":
    "В ID триггера {name} лучше использовать только строчные латинские буквы, цифры, подчёркивания и дефисы.",
  "issue.triggerTypeMissing":
    "У триггера {name} не выбран тип, плагин его пропустит.",
  "issue.triggerNoActions":
    "У триггера {name} нет действий, после срабатывания ничего не произойдёт.",
  "issue.triggerCooldownNegative":
    "Перезарядка триггера {name} не может быть отрицательной.",
  "issue.triggerConditionScript":
    "В строке {line} условий триггера {name} синтаксическая ошибка — плагин не сможет их загрузить.",
  "issue.triggerActionScript":
    "В строке {line} действий триггера {name} синтаксическая ошибка — плагин не сможет их загрузить.",

  "parse.yamlFailed": "Не удалось разобрать YAML: {detail}",
  "parse.notRecipe":
    "Этот файл не является конфигурацией рецепта (на верхнем уровне нужны пары ключ-значение).",
  "parse.typeMissing": "Нет поля type, тип рецепта определить нельзя.",
  "parse.typeUnsupported": "Пока не поддерживаемый тип рецепта: {name}",
  "parse.resultMissing": "Поле result не прочитано, задайте результат заново.",
  "parse.shapeMissing":
    "Корректные shape / ingredients не прочитаны, сетка осталась пустой.",
  "parse.shapeCharUnmapped":
    "Символу {name} в shape не соответствует ни один ингредиент.",
  "parse.shapeTooManyRows":
    "В shape больше 3 строк, импортированы только первые 3.",
  "parse.ingredientsMissing":
    "Поле ingredients не прочитано, список ингредиентов остался пустым.",
  "parse.ingredientsTooMany":
    "Ингредиентов больше 9, импортированы только первые 9.",
  "parse.amountClamped":
    "Некоторые количества исправлены: этот слот не читает количество, либо значение превышало предел {max}.",
  "parse.cookingCategoryUnknown":
    "Нераспознанная категория книги рецептов для переплавки: {name}",
  "parse.craftingCategoryUnknown":
    "Нераспознанная категория книги рецептов для изготовления: {name}",
  "parse.notItemPacks":
    "Этот файл не является конфигурацией наборов предметов (на верхнем уровне нужно сопоставление имён со списками).",
  "parse.packNotList":
    "Значение набора предметов {name} не является списком, он пропущен.",
  "parse.packNoItems":
    "В наборе предметов {name} нет корректных предметов, он пропущен.",
  "parse.notTriggers":
    "Этот файл не является конфигурацией триггеров (на верхнем уровне нужно сопоставление ID триггеров с настройками).",
  "parse.triggerNotMap":
    "Содержимое триггера {name} не является парами ключ-значение, он пропущен.",
  "parse.triggerTypeMissing": "У триггера {name} нет type, он пропущен.",
};
