import type { MessageKey } from "./zh_cn";

export const enUs: Record<MessageKey, string> = {
  "brand.title": "Craftorithm Recipe Studio",
  "brand.sub": "Generate plugin recipe YAML locally, no sign-in",

  "view.aria": "Workspace",
  "skip.toWorkbench": "Skip to workbench",
  "view.recipe": "Recipe",
  "view.packs": "Item packs",
  "view.triggers": "Triggers",

  "tabs.aria": "Open files",
  "tabs.close": "Close {name}",
  "tabs.newRecipe": "New recipe",
  "tabs.newTrigger": "New trigger file",
  "tabs.saveAsNew": "Save as new tab",
  "tabs.newMenu": "More new-file options",
  "tabs.importFiles": "Import files…",

  "start.title": "Get started",
  "start.note": "Create a recipe, or import existing files to keep editing.",
  "start.newRecipe": "New recipe",
  "start.importFiles": "Import files",
  "start.importFolder": "Import folder",
  "start.hint": "Importing a folder detects recipes, item_packs.yml and triggers automatically.",

  "action.exportAll": "Export all",
  "toast.exportedZip": "Exported {count} file(s)",
  "toast.exportEmpty": "Nothing to export",
  "toast.savedAsNew": "Copied to a new tab",
  "toast.importedCount": "Imported {count} file(s)",
  "toast.importSkipped": "Skipped {count} unrecognized file(s)",
  "toast.tabClosed": "Closed {name}",
  "toast.typeChangedLost": "Changing type dropped {count} ingredients — you can undo",

  "history.undo": "Undo",
  "history.redo": "Redo",
  "history.undoOf": "Undo {action}",
  "history.action.changeType": "recipe type change",
  "history.action.reset": "recipe reset",
  "history.action.closeTab": "closing the file",
  "history.action.import": "import overwrite",
  "history.action.packEdit": "item pack change",

  "step.aria": "Editing steps",
  "step.type": "Type",
  "step.edit": "Edit",
  "step.export": "Export",

  "action.reset": "Reset",
  "action.resetRecipe": "Reset recipe",
  "action.importYaml": "Import YAML",
  "action.downloadYaml": "Download YAML",
  "action.copyClipboard": "Copy to clipboard",
  "action.close": "Close",
  "action.remove": "Remove",

  "locale.switch": "Language",
  "theme.switch": "Appearance",
  "theme.light": "Light",
  "theme.dark": "Dark",

  "catalog.offline": "Item catalog offline, using the built-in list",

  "footer.aria": "About and related links",
  "footer.credit": "Made by 氿雾 · a recipe editor for the Craftorithm plugin",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Docs",
  "footer.link.qq": "QQ group",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML copied to clipboard",
  "toast.copyFailed": "Copy failed, please select the preview manually",
  "toast.downloaded": "Downloaded {name}",
  "toast.saved": "Saved {name} to the chosen location",

  "next.titleDownloaded": "Downloaded {name} — two steps left",
  "next.titleSaved": "Saved {name} — two steps left",
  "next.step1": "Put the file here on your server (overwrite any file with the same name):",
  "next.step2": "Run this in the server console or in-game:",
  "next.step3": "Try the recipe in-game. If nothing happens, check the console for load errors.",
  "next.copyPath": "Copy path",
  "next.copyCommand": "Copy command",
  "next.pathCopied": "Path copied",
  "next.commandCopied": "Command copied",
  "next.done": "Got it",
  "toast.imported": "Imported {name}",
  "toast.recipeReset": "Reset to a blank recipe",
  "bench.station": "Station: {name}",
  "bench.importWarnings": "{count} item(s) need review after import: {detail}",
  "bench.shapelessNote":
    "Shapeless recipes only check that every ingredient is present; placement does not matter.",
  "bench.inertNote":
    "Non-clickable slots are used by players in game; the recipe does not write to them.",
  "bench.guiAlt": "{name} interface",
  "bench.resultOutside": "Result (same slot as in the interface above)",

  "typeNav.aria": "Recipe type",

  "inspector.title": "Result and checks",
  "inspector.resultUnset": "No result set yet",
  "inspector.resultHint": "Click the result slot on the bench",
  "inspector.slotUnset": "Empty",
  "inspector.mustFix": "{count} issue(s) must be fixed",
  "inspector.stillTodo": "{count} step(s) left to complete",
  "inspector.ready": "Recipe is complete and ready to export",
  "inspector.yamlTitle": "YAML preview",
  "inspector.fixFirst": "Fix the errors above to enable downloading.",

  "picker.aria": "Choose ingredient: {name}",
  "picker.title": "Choose ingredient · {name}",
  "picker.clearSlot": "Clear slot",
  "picker.tabsAria": "Ingredient type",
  "picker.tab.item": "Items",
  "picker.tab.tag": "Tags",
  "picker.tab.item_pack": "Item packs",
  "picker.categoryAll": "All",
  "picker.search.item": "Search by name or ID, e.g. diamond",
  "picker.search.tag": "Search tags, e.g. planks / logs",
  "picker.search.item_pack": "Search item pack names",
  "picker.custom.item": "Custom item ID",
  "picker.custom.tag": "Custom tag name",
  "picker.custom.item_pack": "Custom item pack name",
  "picker.customPlaceholder.item": "minecraft:diamond or oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Amount",
  "picker.use": "Use",
  "picker.loadingItems": "Loading the {version} item catalog…",
  "picker.loadingTags": "Loading the {version} item tags…",
  "picker.noItem": "No matches. You can type an item ID below.",
  "picker.noTag":
    "No tag list available. You can type a tag name below, e.g. planks.",
  "picker.noPack":
    "No item packs yet. Create one in the Item packs tab, or type a name below.",
  "picker.showMore": "Show more ({count} left)",
  "picker.packItemCount": "{count} item(s)",
  "picker.tagItemCount": "{count} item(s) in this tag",
  "picker.packGlyph": "P",

  "slot.empty": "empty",
  "slot.item": "Item",
  "slot.itemPack": "Item pack",
  "choice.tag": "Tag {name}",
  "choice.itemPack": "Item pack {name}",
  "badge.tag": "Tag",
  "badge.itemPack": "Item pack",

  "packs.title": "Item packs",
  "packs.note":
    "Group several items together and reference them with {code}; any one of them satisfies the ingredient.",
  "packs.create": "New item pack",
  "packs.import": "Import item_packs.yml",
  "packs.empty":
    "No item packs yet. Create one and you can pick it in any ingredient slot.",
  "packs.name": "Pack name",
  "packs.removeGroup": "Delete pack",
  "packs.removeItem": "Remove item {index}",
  "packs.addItem": "Add an item to {name}",
  "packs.yamlEmpty": "# No item packs yet",
  "packs.imported": "Imported {count} item pack(s)",
  "packs.importedWithWarnings":
    "Imported {count} item pack(s), {warnings} note(s)",

  "triggers.title": "Triggers",
  "triggers.note":
    "Run actions when crafting or other events happen. Drop the file into the plugin {code} folder.",
  "triggers.fileName": "File name",
  "triggers.exportAs": "Exports as {name}.yml",
  "triggers.create": "New trigger",
  "triggers.import": "Import trigger YAML",
  "triggers.empty": "No triggers yet. Create one to start.",
  "triggers.yamlEmpty": "# No triggers yet",
  "triggers.imported": "Imported {count} trigger(s)",
  "triggers.importedWithWarnings":
    "Imported {count} trigger(s), {warnings} note(s)",
  "triggers.id": "Trigger ID",
  "triggers.type": "Trigger type",
  "triggers.recipes": "Recipe filter (recipes)",
  "triggers.recipesHint":
    "Leave empty to match every recipe of this kind. Use the full recipe key, e.g. craftorithm:my_sword",
  "triggers.conditions": "Conditions",
  "triggers.mode.and": "All must pass",
  "triggers.mode.script": "Script block",
  "triggers.conditionsHint.and":
    'One condition per line, all must hold. e.g. papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Write the script line by line and return true / false yourself.",
  "triggers.actions": "Actions",
  "triggers.actionsHint":
    'One action per line, e.g. tell("&aCrafted!") or give_level(100)',
  "triggers.variables": "Available variables: {list}",

  // ---- Script editor ----
  "script.line": "Line {line}",
  "script.status.errors": "{count} syntax error(s)",
  "script.status.warnings": "{count} hint(s)",
  "script.hint.condition":
    "Tab completes, Ctrl+Space opens suggestions. Conditions must yield true / false.",
  "script.hint.action":
    "Tab completes, Ctrl+Space opens suggestions. One action per line.",
  "script.undo": "Undo",
  "script.redo": "Redo",

  "script.err.unterminatedString": "String is missing its closing quote",
  "script.err.unexpectedChar": "Unrecognized character",

  "script.err.unclosedParen": "Unclosed parenthesis",
  "script.err.unexpectedParen": "Unmatched closing parenthesis",
  "script.err.missingEndif": "if is missing its matching endif",
  "script.err.orphanEndif": "endif has no matching if",
  "script.err.orphanBranch": "{keyword} has no matching if",
  "script.err.expectedFunctionName":
    "A function name is required after the colon",
  "script.err.moduleCallNeedsParen":
    "Module calls need parentheses; write {name}(...)",
  "script.err.expectedMethodCall":
    "A method call is required after the dot; write .{name}(...)",
  "script.err.expectedVarName": "var must be followed by \"name = value\"",

  "script.err.unknownFunction": "Unknown function {name}",
  "script.err.unknownModule": "Unknown module {name}",
  "script.err.argCount": "{name} expects {expected} argument(s), got {actual}",
  "script.err.argType":
    "Parameter {param} of {name} expects {expected}, got {actual}",
  "script.err.ambiguousName":
    "{name} exists in several modules, prefer {qualified}",
  "script.err.unknownVariable":
    "Variable {name} is neither declared here nor provided by this trigger",

  "script.err.assignUndeclared":
    "{name} was never declared with var; you may need var {name} = ...",
  "script.err.blockInAndMode":
    "In \"match all\" mode every line must be a standalone condition, so {name} is not allowed; switch to \"script block\" for branching or variables",
  "script.err.queryInAction":
    "{name} only reads a value, it may need to be inside an if",
  "script.err.notBoolean": "This line does not yield true / false",

  "script.fn.actions.command":
    "Run a command as the player. Several arguments are joined together",
  "script.fn.actions.console":
    "Run a command as the console. Several arguments are joined together",
  "script.fn.actions.tell":
    "Send a chat message to the player. Several arguments are joined together",
  "script.fn.actions.actionbar":
    "Show a message above the hotbar. Several arguments are joined together",
  "script.fn.actions.title": "Show a title and subtitle",
  "script.fn.actions.log":
    "Write to the server log. Several arguments are joined together",
  "script.fn.actions.take_level": "Remove player levels",
  "script.fn.actions.give_level": "Grant player levels",
  "script.fn.actions.give_exp": "Grant experience points",
  "script.fn.actions.close": "Close the current screen",
  "script.fn.actions.back": "Return to the parent menu",
  "script.fn.actions.openmenu": "Open a custom menu",
  "script.fn.actions.discover_recipe": "Unlock a recipe",
  "script.fn.actions.undiscover_recipe": "Lock a recipe",
  "script.fn.actions.sound": "Play a sound",
  "script.fn.actions.set_inv_item": "Set an item in the open screen",
  "script.fn.conditions.perm": "Check whether the player has a permission",
  "script.fn.conditions.papi": "Read a PlaceholderAPI value",
  "script.fn.conditions.level": "Read the player level",
  "script.fn.conditions.world":
    "Read the world name, or compare it when given an argument",
  "script.fn.conditions.gamemode":
    "Read the game mode, or compare it when given an argument",
  "script.fn.conditions.item": "Check whether the event item matches an ID",
  "script.fn.conditions.biome":
    "Read the biome, or compare it when given an argument",
  "script.fn.conditions.in_water": "Check whether the player is in water",
  "script.fn.conditions.in_rain": "Check whether the player is in rain",
  "script.fn.conditions.light_level":
    "Read the light level at the player block",
  "script.fn.conditions.match_item_id":
    "Get the namespaced ID of an item object",
  "script.fn.math.abs": "Absolute value",
  "script.fn.math.min": "Smaller of two values",
  "script.fn.math.max": "Larger of two values",
  "script.fn.math.round": "Round to nearest",
  "script.fn.math.floor": "Round down",
  "script.fn.math.ceil": "Round up",
  "script.fn.math.sqrt": "Square root",
  "script.fn.math.pow": "Raise to a power",
  "script.fn.math.random":
    "Random number. No argument gives 0~1, one argument is the upper bound, two are min~max",
  "script.fn.math.random_int":
    "Random integer. One argument is the upper bound, two are min~max",
  "script.fn.math.int": "Convert to integer",
  "script.fn.math.float": "Convert to float",
  "script.fn.vault.money": "Read the player balance (Vault)",
  "script.fn.vault.take_money": "Withdraw balance (Vault)",
  "script.fn.vault.give_money": "Deposit balance (Vault)",
  "script.fn.vault_unlocked.money":
    "Read the player balance (VaultUnlocked). Omit the currency to use the default one",
  "script.fn.vault_unlocked.take_money":
    "Withdraw balance (VaultUnlocked). Omit the currency to use the default one",
  "script.fn.vault_unlocked.give_money":
    "Deposit balance (VaultUnlocked). Omit the currency to use the default one",
  "script.fn.playerpoints.points": "Read player points",
  "script.fn.playerpoints.take_points": "Withdraw points",
  "script.fn.playerpoints.give_points": "Deposit points",
  "script.fn.obj.get": "Read an object field, usually written x.get(\"field\")",
  "script.fn.obj.set":
    "Write an object field, usually written x.set(\"field\", value)",
  "script.fn.obj.invoke":
    "Call an object method, usually written x.invoke(\"method\", args...)",
  // delay 没有命名空间，只能写短名，键名因此是 script.fn.delay
  "script.fn.delay": "Pause for the given ticks, then continue",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if": "Run the following statements when the condition holds",
  "script.kw.elseif": "Test another condition when the previous one fails",
  "script.kw.else": "Run when no earlier condition holds",
  "script.kw.endif": "Close the if block",
  "script.kw.return": "End the script and return a value",
  "script.kw.var": "Declare a variable, written var name = value",
  "script.kw.true": "Boolean true value",
  "script.kw.false": "Boolean false value",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Actions that affect the player and the world",
  "script.module.conditions": "Checks that read player and environment state",
  "script.module.math": "Math operations and random numbers",
  "script.module.vault": "Economy interface (requires Vault)",
  "script.module.vault_unlocked":
    "Multi-currency economy interface (requires VaultUnlocked)",
  "script.module.playerpoints": "Points interface (requires PlayerPoints)",
  "script.module.obj": "Reflective access to object fields and methods",
  "script.complete.returns": "Returns",
  "triggers.priority": "Priority",
  "triggers.priorityHint": "Lower numbers run first",
  "triggers.cooldown": "Cooldown (seconds)",
  "triggers.cooldownHint": "0 means no limit",
  "triggers.enabled": "Enabled",
  "triggers.disabled": "Disabled",
  "triggers.perPlayer": "Per-player cooldown",
  "triggers.shared": "Server-wide cooldown",

  "fields.section": "Recipe settings",
  "fields.fileName": "Recipe file name",
  "fields.exportAs": "Exports as {name}.yml",
  "fields.recipeId": "Recipe ID (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "Leave empty to let the plugin use the file name as the recipe ID",
  "fields.recipeIdRequiredHint":
    "The file name cannot serve as the recipe ID, so it must be set here",
  "fields.group": "Recipe group",
  "fields.groupPlaceholder": "Leave empty for no group",
  "fields.groupHint": "Recipes in the same group are merged in the recipe book",
  "fields.exp": "Experience (exp)",
  "fields.time": "Cooking time (time)",
  "fields.timeHint": "In ticks, 20 ticks = 1 second",
  "fields.costLevel": "Level cost (cost_level)",
  "fields.trimPattern": "Trim pattern (trim_pattern)",
  "fields.bookCategory": "Recipe book category",
  "fields.bookCategoryHint": "Requires a 1.19.3+ server",
  "fields.unspecified": "Unspecified",
  "fields.previewSection": "Fake result (optional)",
  "fields.previewSlot": "Fake result",
  "fields.previewLabel": "Fake result item",
  "fields.previewHint":
    "The crafting result slot shows this item to hide the real output; players still take the actual result. Leave empty to omit fake_result_preview.",
  "fields.copySection": "Component copy rules (optional)",
  "fields.copyHint":
    "Selected components are copied from the input item to the result, written as copy_components_rules.",
  "fields.copySince": "{name} (requires {since})",
  "fields.removeRule": "Remove {name}",

  "category.crafting.building": "Building blocks",
  "category.crafting.redstone": "Redstone",
  "category.crafting.equipment": "Equipment",
  "category.crafting.misc": "Misc",
  "category.cooking.food": "Food",
  "category.cooking.blocks": "Blocks",
  "category.cooking.misc": "Misc",

  "copyRule.all": "All components",
  "copyRule.enchantments": "Enchantments",
  "copyRule.attributes": "Attributes",
  "copyRule.display_name": "Display name",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Custom model data",
  "copyRule.item_flag": "Item flags",
  "copyRule.unbreakable": "Unbreakable",
  "copyRule.trim": "Armor trim",
  "copyRule.food": "Food",
  "copyRule.max_stack_size": "Max stack size",
  "copyRule.rarity": "Rarity",
  "copyRule.fire_resistance": "Fire resistance",
  "copyRule.hide_tooltip": "Hide tooltip",
  "copyRule.item_name": "Item name",
  "copyRule.tool": "Tool",
  "copyRule.item_model": "Item model",
  "copyRule.custom_model_data_component": "Model data component",

  "itemCategory.building": "Building",
  "itemCategory.ore": "Ores",
  "itemCategory.tool": "Tools",
  "itemCategory.combat": "Combat",
  "itemCategory.food": "Food",
  "itemCategory.redstone": "Redstone",
  "itemCategory.brewing": "Brewing",
  "itemCategory.misc": "Misc",

  "recipeGroup.crafting": "Crafting",
  "recipeGroup.smelting": "Smelting",
  "recipeGroup.smithing": "Smithing",
  "recipeGroup.processing": "Processing",

  "recipeType.vanilla_shaped": "Shaped recipe",
  "recipeType.vanilla_shaped.summary":
    "Place ingredients in a 3×3 pattern; position decides whether it crafts.",
  "recipeType.vanilla_shapeless": "Shapeless recipe",
  "recipeType.vanilla_shapeless.summary":
    "Crafts as long as every ingredient is present, in any position.",
  "recipeType.vanilla_smelting_furnace": "Furnace recipe",
  "recipeType.vanilla_smelting_furnace.summary":
    "Smelt one ingredient in a furnace, with configurable exp and time.",
  "recipeType.vanilla_smelting_blast": "Blast furnace recipe",
  "recipeType.vanilla_smelting_blast.summary":
    "Blast furnace smelting, usually for ores and metals.",
  "recipeType.vanilla_smelting_smoker": "Smoker recipe",
  "recipeType.vanilla_smelting_smoker.summary":
    "Smoker smelting, usually for food.",
  "recipeType.vanilla_smelting_campfire": "Campfire recipe",
  "recipeType.vanilla_smelting_campfire.summary":
    "Campfire cooking, usually slower than a furnace.",
  "recipeType.vanilla_smithing_transform": "Smithing recipe",
  "recipeType.vanilla_smithing_transform.summary":
    "Upgrade a base item into a new one with a template and addition.",
  "recipeType.vanilla_smithing_trim": "Smithing trim recipe",
  "recipeType.vanilla_smithing_trim.summary":
    "Add a trim to armor; the trim pattern is required.",
  "recipeType.vanilla_stonecutting": "Stonecutting recipe",
  "recipeType.vanilla_stonecutting.summary":
    "Cut one ingredient into the result on a stonecutter.",
  "recipeType.vanilla_brewing": "Brewing recipe",
  "recipeType.vanilla_brewing.summary":
    "Use an ingredient to transform the input item in a brewing stand.",
  "recipeType.anvil": "Anvil recipe",
  "recipeType.anvil.summary":
    "Combine two items on an anvil, with a configurable level cost.",

  "station.crafting_table": "Crafting Table",
  "station.furnace": "Furnace",
  "station.blast_furnace": "Blast Furnace",
  "station.smoker": "Smoker",
  "station.campfire": "Campfire",
  "station.smithing_table": "Smithing Table",
  "station.stonecutter": "Stonecutter",
  "station.brewing_stand": "Brewing Stand",
  "station.anvil": "Anvil",

  "guiSlot.gridCell": "Grid slot",
  "guiSlot.gridPosition": "row {row}, column {col}",
  "guiSlot.shapelessIngredient": "Ingredient {index}",
  "guiSlot.ingredient": "Ingredient",
  "guiSlot.result": "Result",
  "guiSlot.template": "Template",
  "guiSlot.base": "Base item",
  "guiSlot.addition": "Addition",
  "guiSlot.anvilBase": "Left item",
  "guiSlot.anvilAddition": "Right item",
  "guiSlot.brewingInput": "Input item",
  "guiSlot.brewingMiddle": "middle bottle slot",
  "guiSlot.inertFuel":
    "The fuel slot is filled by players; recipes do not use it",
  "guiSlot.inertBottle":
    "Side bottle slots share the same input item as the middle one",

  "triggerGroup.craft": "Crafting",
  "triggerGroup.player": "Player events",
  "triggerGroup.entity": "Entity events",
  "triggerGroup.block": "Block events",
  "triggerGroup.inventory": "Inventory events",

  "triggerType.crafting": "Crafting table craft",
  "triggerType.smithing": "Smithing table craft",
  "triggerType.anvil": "Anvil combine",
  "triggerType.player_join": "Player join",
  "triggerType.player_quit": "Player quit",
  "triggerType.player_death": "Player death",
  "triggerType.player_respawn": "Player respawn",
  "triggerType.player_interact": "Player interact",
  "triggerType.player_advancement": "Advancement earned",
  "triggerType.player_level_change": "Level change",
  "triggerType.player_exp_change": "Experience change",
  "triggerType.player_toggle_sneak": "Toggle sneak",
  "triggerType.player_toggle_sprint": "Toggle sprint",
  "triggerType.player_item_consume": "Consume item",
  "triggerType.player_item_held": "Change held item",
  "triggerType.player_item_damage": "Item damaged",
  "triggerType.player_item_mend": "Item mended",
  "triggerType.player_fish": "Fishing",
  "triggerType.player_teleport": "Teleport",
  "triggerType.player_portal": "Use portal",
  "triggerType.player_changed_world": "Change world",
  "triggerType.player_drop_item": "Drop item",
  "triggerType.player_pickup_item": "Pick up item",
  "triggerType.player_game_mode_change": "Game mode change",
  "triggerType.player_recipe_discover": "Recipe unlocked",
  "triggerType.player_command_preprocess": "Run command",
  "triggerType.player_move": "Player move",
  "triggerType.player_bed_enter": "Enter bed",
  "triggerType.player_bed_leave": "Leave bed",
  "triggerType.player_swap_hand_items": "Swap hands",
  "triggerType.player_edit_book": "Edit book",
  "triggerType.player_statistic": "Statistic change",
  "triggerType.player_bucket_fill": "Fill bucket",
  "triggerType.player_bucket_empty": "Empty bucket",
  "triggerType.player_shear_entity": "Shear entity",
  "triggerType.damage_entity": "Deal damage",
  "triggerType.kill_entity": "Kill entity",
  "triggerType.entity_shoot_bow": "Shoot bow",
  "triggerType.entity_breed": "Animal breed",
  "triggerType.entity_tame": "Tame animal",
  "triggerType.entity_potion_effect": "Potion effect change",
  "triggerType.block_break": "Break block",
  "triggerType.block_place": "Place block",
  "triggerType.inventory_click": "Inventory click",
  "triggerType.inventory_open": "Inventory open",
  "triggerType.inventory_close": "Inventory close",
  "triggerType.player_interact_entity": "Interact with entity",
  "triggerType.player_animation": "Player animation",
  "triggerType.player_velocity": "Velocity change",
  "triggerType.async_player_chat": "Player chat",
  "triggerType.player_take_campfire": "Take from campfire",
  "triggerType.prepare_grindstone": "Prepare Grindstone",
  "triggerType.trade_select": "Trade Select",

  "issue.fileNameEmpty": "The recipe file name cannot be empty.",
  "issue.fileNameNeedsRecipeId":
    "The file name contains illegal characters. Without recipe_id the plugin uses the file name as the recipe ID, so loading would fail: use lowercase letters, digits, underscores, hyphens and dots, or set a recipe ID below.",
  "issue.recipeIdPattern":
    "The recipe ID may only use lowercase letters, digits, underscores, hyphens and dots.",
  "issue.resultMissing": "No result set yet.",
  "issue.resultMustBeItem":
    "The result must be a concrete item, not a tag or item pack.",
  "issue.gridEmpty": "The crafting grid needs at least one ingredient.",
  "issue.gridTooManyKinds":
    "More than 9 distinct ingredients, a shape cannot be generated.",
  "issue.shapelessEmpty": "A shapeless recipe needs at least one ingredient.",
  "issue.shapelessTooMany": "A shapeless recipe allows at most 9 ingredients.",
  "issue.smeltingIngredient": "No smelting ingredient set yet.",
  "issue.cookingTime": "Cooking time must be greater than 0 ticks.",
  "issue.expNegative": "Experience cannot be negative.",
  "issue.stonecuttingIngredient": "No stonecutting ingredient set yet.",
  "issue.smithingBase": "No base item set yet.",
  "issue.smithingAddition": "No addition set yet.",
  "issue.smithingTemplate":
    "No smithing template set; 1.20+ servers usually require one.",
  "issue.trimPattern": "A smithing trim recipe requires a trim pattern.",
  "issue.brewingInput": "No brewing input item set yet.",
  "issue.brewingIngredient": "No brewing ingredient set yet.",
  "issue.anvilBase": "No left item set yet.",
  "issue.anvilAddition": "No right item set yet.",
  "issue.costLevelNegative": "The level cost cannot be negative.",
  "issue.packUndefined":
    "References the undefined item pack {name}. Create it under Item packs, or make sure it exists on the server.",
  "issue.brewingTagInput":
    "The brewing input uses a tag. Tag matching in brewing depends on the server implementation; a concrete item is safer.",
  "issue.brewingTagIngredient":
    "The brewing ingredient uses a tag. Tag matching in brewing depends on the server implementation; a concrete item is safer.",
  "issue.packNameEmpty": "There is an unnamed item pack.",
  "issue.packNameDuplicate":
    "Item pack name {name} is duplicated; later ones override earlier ones.",
  "issue.packNamePattern":
    "Item pack name {name} should use only lowercase letters, digits, underscores and hyphens.",
  "issue.packItemsEmpty":
    "Item pack {name} has no items and will be skipped by the plugin.",
  "issue.packNested":
    "Item pack {name} cannot nest tags or other packs; only concrete items are allowed.",
  "issue.triggerIdEmpty": "There is an unnamed trigger.",
  "issue.triggerIdDuplicate":
    "Trigger ID {name} is duplicated; later ones override earlier ones.",
  "issue.triggerIdPattern":
    "Trigger ID {name} should use only lowercase letters, digits, underscores and hyphens.",
  "issue.triggerTypeMissing":
    "Trigger {name} has no type and will be skipped by the plugin.",
  "issue.triggerNoActions":
    "Trigger {name} has no actions and will do nothing when fired.",
  "issue.triggerCooldownNegative":
    "The cooldown of trigger {name} cannot be negative.",
  "issue.triggerConditionScript":
    "Line {line} of trigger {name} conditions has a syntax error; the plugin will fail to load it.",
  "issue.triggerActionScript":
    "Line {line} of trigger {name} actions has a syntax error; the plugin will fail to load it.",

  "parse.yamlFailed": "YAML parsing failed: {detail}",
  "parse.notRecipe":
    "This file is not a recipe config (the top level must be a mapping).",
  "parse.typeMissing": "Missing the type field, cannot tell the recipe type.",
  "parse.typeUnsupported": "Unsupported recipe type: {name}",
  "parse.resultMissing": "No result was read, please set the result again.",
  "parse.shapeMissing":
    "No valid shape / ingredients were read, the grid stays empty.",
  "parse.shapeCharUnmapped":
    "The character {name} in shape has no matching ingredient.",
  "parse.shapeTooManyRows":
    "shape has more than 3 rows, only the first 3 were imported.",
  "parse.ingredientsMissing": "No ingredients were read, the list stays empty.",
  "parse.ingredientsTooMany":
    "More than 9 ingredients, only the first 9 were imported.",
  "parse.amountClamped":
    "Some amounts were corrected: that slot ignores amounts, or the value exceeded the {max} limit.",
  "parse.cookingCategoryUnknown":
    "Unrecognized cooking recipe book category: {name}",
  "parse.craftingCategoryUnknown":
    "Unrecognized crafting recipe book category: {name}",
  "parse.notItemPacks":
    "This file is not an item pack config (the top level must map names to lists).",
  "parse.packNotList": "Item pack {name} is not a list and was skipped.",
  "parse.packNoItems": "Item pack {name} has no valid items and was skipped.",
  "parse.notTriggers":
    "This file is not a trigger config (the top level must map trigger IDs to configs).",
  "parse.triggerNotMap": "Trigger {name} is not a mapping and was skipped.",
  "parse.triggerTypeMissing": "Trigger {name} is missing type and was skipped.",
};
