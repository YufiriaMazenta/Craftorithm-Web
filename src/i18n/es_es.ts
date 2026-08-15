import type { MessageKey } from "./zh_cn";

export const esEs: Record<MessageKey, string> = {
  "brand.title": "Taller de recetas Craftorithm",
  "brand.sub":
    "Generación local del YAML de recetas del plugin, sin iniciar sesión",

  "view.aria": "Espacio de trabajo",
  "skip.toWorkbench": "Saltar a la mesa de trabajo",
  "view.recipe": "Receta",
  "view.packs": "Grupos de objetos",
  "view.triggers": "Disparadores",

  "tabs.aria": "Archivos abiertos",
  "tabs.close": "Cerrar {name}",
  "tabs.newRecipe": "Nueva receta",
  "tabs.newTrigger": "Nuevo archivo de activadores",
  "tabs.saveAsNew": "Guardar como pestaña nueva",
  "tabs.newMenu": "Más opciones para crear",
  "tabs.importFiles": "Importar archivos…",

  "start.title": "Empezar",
  "start.note": "Crea una receta o importa archivos existentes para seguir editando.",
  "start.newRecipe": "Nueva receta",
  "start.importFiles": "Importar archivos",
  "start.importFolder": "Importar carpeta",
  "start.hint": "Al importar una carpeta se detectan recipes, item_packs.yml y triggers automáticamente.",

  "action.exportAll": "Exportar todo",
  "toast.exportedZip": "Se exportaron {count} archivo(s)",
  "toast.exportEmpty": "No hay nada que exportar",
  "toast.savedAsNew": "Copiado a una pestaña nueva",
  "toast.importedCount": "Se importaron {count} archivo(s)",
  "toast.importSkipped": "Se omitieron {count} archivo(s) no reconocidos",
  "toast.tabClosed": "Se cerró {name}",
  "toast.typeChangedLost": "Cambiar el tipo descartó {count} ingredientes; puedes deshacerlo",

  "history.undo": "Deshacer",
  "history.redo": "Rehacer",
  "history.undoOf": "Deshacer {action}",
  "history.action.changeType": "el cambio de tipo de receta",
  "history.action.reset": "el reinicio de la receta",
  "history.action.closeTab": "el cierre del archivo",
  "history.action.import": "la sobrescritura al importar",
  "history.action.packEdit": "el cambio del grupo de objetos",

  "step.aria": "Pasos de edición",
  "step.type": "Tipo",
  "step.edit": "Editar",
  "step.export": "Exportar",

  "action.reset": "Restablecer",
  "action.resetRecipe": "Restablecer receta",
  "action.importYaml": "Importar YAML",
  "action.downloadYaml": "Descargar YAML",
  "action.copyClipboard": "Copiar al portapapeles",
  "action.close": "Cerrar",
  "action.remove": "Eliminar",

  "locale.switch": "Idioma",
  "theme.switch": "Apariencia",
  "theme.light": "Claro",
  "theme.dark": "Oscuro",

  "catalog.offline":
    "Catálogo de objetos sin conexión, se usa la lista integrada",

  "footer.aria": "Acerca de y enlaces relacionados",
  "footer.credit":
    "Creado por 氿雾 · un editor de recetas para el plugin Craftorithm",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Documentación",
  "footer.link.qq": "Grupo de QQ",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML copiado al portapapeles",
  "toast.copyFailed":
    "No se pudo copiar; seleccionar la vista previa manualmente",
  "toast.downloaded": "Se ha descargado {name}",
  "toast.saved": "Se ha guardado {name} en la ubicación elegida",

  "next.titleDownloaded": "Se descargó {name}: faltan dos pasos",
  "next.titleSaved": "Se guardó {name}: faltan dos pasos",
  "next.step1": "Coloca el archivo aquí en tu servidor (sobrescribe el archivo con el mismo nombre):",
  "next.step2": "Ejecuta esto en la consola del servidor o dentro del juego:",
  "next.step3": "Prueba la receta en el juego. Si no pasa nada, revisa la consola por errores de carga.",
  "next.copyPath": "Copiar ruta",
  "next.copyCommand": "Copiar comando",
  "next.pathCopied": "Ruta copiada",
  "next.commandCopied": "Comando copiado",
  "next.done": "Entendido",
  "toast.imported": "Se ha importado {name}",
  "toast.recipeReset": "Se ha restablecido a una receta vacía",
  "bench.station": "Estación: {name}",
  "bench.importWarnings":
    "Hay {count} punto(s) por revisar tras la importación: {detail}",
  "bench.shapelessNote":
    "Las recetas sin forma solo comprueban que estén todos los ingredientes; la posición no influye.",
  "bench.inertNote":
    "Las casillas no pulsables las usa el jugador dentro del juego; la receta no escribe en ellas.",
  "bench.guiAlt": "Interfaz de {name}",
  "bench.resultOutside": "Resultado (la misma casilla que en la interfaz de arriba)",

  "typeNav.aria": "Tipo de receta",

  "inspector.title": "Resultado y validación",
  "inspector.resultUnset": "Aún no hay resultado",
  "inspector.resultHint": "Pulsar la casilla de resultado en la estación",
  "inspector.slotUnset": "Sin definir",
  "inspector.mustFix": "{count} punto(s) por corregir",
  "inspector.stillTodo": "Faltan {count} paso(s)",
  "inspector.ready": "La receta está completa y se puede exportar",
  "inspector.yamlTitle": "Vista previa del YAML",
  "inspector.fixFirst": "Corregir los errores de arriba para poder descargar.",

  "picker.aria": "Elegir ingrediente: {name}",
  "picker.title": "Elegir ingrediente · {name}",
  "picker.clearSlot": "Vaciar casilla",
  "picker.tabsAria": "Tipo de ingrediente",
  "picker.tab.item": "Objetos",
  "picker.tab.tag": "Etiquetas",
  "picker.tab.item_pack": "Grupos",
  "picker.categoryAll": "Todo",
  "picker.search.item": "Buscar por nombre o ID, p. ej. diamond",
  "picker.search.tag": "Buscar etiquetas, p. ej. planks / logs",
  "picker.search.item_pack": "Buscar nombres de grupos",
  "picker.custom.item": "ID de objeto personalizado",
  "picker.custom.tag": "Nombre de etiqueta personalizado",
  "picker.custom.item_pack": "Nombre de grupo personalizado",
  "picker.customPlaceholder.item": "minecraft:diamond u oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Cantidad",
  "picker.use": "Usar",
  "picker.loadingItems": "Cargando el catálogo de objetos de {version}…",
  "picker.loadingTags": "Cargando las etiquetas de objetos de {version}…",
  "picker.noItem":
    "Sin coincidencias. Se puede escribir un ID de objeto abajo.",
  "picker.noTag":
    "No hay lista de etiquetas disponible. Se puede escribir un nombre abajo, p. ej. planks.",
  "picker.noPack":
    "Aún no hay grupos de objetos. Crear uno en la pestaña Grupos, o escribir un nombre abajo.",
  "picker.showMore": "Mostrar más (quedan {count})",
  "picker.packItemCount": "{count} objeto(s)",
  "picker.tagItemCount": "{count} objeto(s) en esta etiqueta",
  "picker.packGlyph": "G",

  "slot.empty": "vacío",
  "slot.item": "Objeto",
  "slot.itemPack": "Grupo de objetos",
  "choice.tag": "Etiqueta {name}",
  "choice.itemPack": "Grupo de objetos {name}",
  "badge.tag": "Etiqueta",
  "badge.itemPack": "Grupo",

  "packs.title": "Grupos de objetos",
  "packs.note":
    "Varios objetos definidos como un grupo al que la receta hace referencia con {code}; cualquiera de ellos cumple el ingrediente.",
  "packs.create": "Nuevo grupo",
  "packs.import": "Importar item_packs.yml",
  "packs.empty":
    "Aún no hay grupos. Al crear uno se podrá elegir en cualquier casilla de ingrediente.",
  "packs.name": "Nombre del grupo",
  "packs.removeGroup": "Eliminar grupo",
  "packs.removeItem": "Quitar el objeto {index}",
  "packs.addItem": "Añadir un objeto a {name}",
  "packs.yamlEmpty": "# Aún no hay grupos de objetos",
  "packs.imported": "{count} grupo(s) de objetos importado(s)",
  "packs.importedWithWarnings":
    "{count} grupo(s) importado(s), {warnings} aviso(s)",

  "triggers.title": "Disparadores",
  "triggers.note":
    "Ejecutan acciones al fabricar o en otros eventos. Basta con colocar el archivo en la carpeta {code} del plugin.",
  "triggers.fileName": "Nombre del archivo",
  "triggers.exportAs": "Se exporta como {name}.yml",
  "triggers.create": "Nuevo disparador",
  "triggers.import": "Importar YAML de disparadores",
  "triggers.empty": "Aún no hay disparadores. Crear uno para empezar.",
  "triggers.yamlEmpty": "# Aún no hay disparadores",
  "triggers.imported": "{count} disparador(es) importado(s)",
  "triggers.importedWithWarnings":
    "{count} disparador(es) importado(s), {warnings} aviso(s)",
  "triggers.id": "ID del disparador",
  "triggers.type": "Tipo de disparador",
  "triggers.recipes": "Recetas limitadas (recipes)",
  "triggers.recipesHint":
    "Dejar vacío para todas las recetas de este tipo. Usar la clave completa, p. ej. craftorithm:my_sword",
  "triggers.conditions": "Condiciones (conditions)",
  "triggers.mode.and": "Todas deben cumplirse",
  "triggers.mode.script": "Bloque de script",
  "triggers.conditionsHint.and":
    'Una condición por línea, todas deben cumplirse. P. ej. papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Escribir el script línea a línea; hay que hacer return true / false.",
  "triggers.actions": "Acciones (actions)",
  "triggers.actionsHint":
    'Una acción por línea, p. ej. tell("&a¡Fabricado!") o give_level(100)',
  "triggers.variables": "Variables disponibles: {list}",

  // ---- Editor de scripts ----
  "script.line": "Línea {line}",
  "script.status.errors": "{count} error(es) de sintaxis",
  "script.status.warnings": "{count} aviso(s)",
  "script.hint.condition":
    "Tab completa, Ctrl+Space abre sugerencias. Las condiciones deben dar true / false.",
  "script.hint.action":
    "Tab completa, Ctrl+Space abre sugerencias. Una acción por línea.",
  "script.undo": "Deshacer",
  "script.redo": "Rehacer",

  // Errores léxicos
  "script.err.unterminatedString":
    "La cadena no tiene comillas dobles de cierre",
  "script.err.unexpectedChar": "Carácter no reconocido",

  // Errores de estructura
  "script.err.unclosedParen": "Paréntesis sin cerrar",
  "script.err.unexpectedParen": "Paréntesis de cierre de más",
  "script.err.missingEndif": "if no tiene su endif correspondiente",
  "script.err.orphanEndif": "endif no tiene un if correspondiente",
  "script.err.orphanBranch": "{keyword} no tiene un if correspondiente",
  "script.err.expectedFunctionName":
    "Después de los dos puntos hace falta un nombre de función",
  "script.err.moduleCallNeedsParen":
    "Las llamadas a módulos necesitan paréntesis; escribe {name}(...)",
  "script.err.expectedMethodCall":
    "Después del punto hace falta una llamada a método; escribe .{name}(...)",
  "script.err.expectedVarName":
    "Después de var hace falta \"nombre = valor\"",

  // Nombres y parámetros
  "script.err.unknownFunction": "Función desconocida {name}",
  "script.err.unknownModule": "Módulo desconocido {name}",
  "script.err.argCount":
    "{name} necesita {expected} parámetro(s), pero recibe {actual}",
  "script.err.argType":
    "El parámetro {param} de {name} necesita {expected}, pero recibe {actual}",
  "script.err.ambiguousName":
    "{name} existe en varios módulos; se recomienda escribir {qualified}",
  "script.err.unknownVariable":
    "La variable {name} no está declarada ni está entre las disponibles de este disparador",

  // Avisos semánticos
  "script.err.assignUndeclared":
    "{name} no se declaró con var; quizá necesites var {name} = ...",
  "script.err.blockInAndMode":
    "En el modo \"cumplir todas\" cada línea debe ser una condición independiente, así que {name} no está permitido; cambia a \"bloque de script\" para usar ramificaciones o variables",
  "script.err.queryInAction":
    "{name} solo obtiene un valor sin producir efecto; quizá deba ir dentro de un if",
  "script.err.notBoolean": "Esta línea no produce true / false",

  // Descripciones de funciones, la clave es script.fn.<module>.<name>
  "script.fn.actions.command":
    "Ejecutar un comando como el jugador. Varios argumentos se concatenan",
  "script.fn.actions.console":
    "Ejecutar un comando como la consola. Varios argumentos se concatenan",
  "script.fn.actions.tell":
    "Enviar un mensaje de chat al jugador. Varios argumentos se concatenan",
  "script.fn.actions.actionbar":
    "Mostrar un mensaje sobre el inventario rápido. Varios argumentos se concatenan",
  "script.fn.actions.title": "Mostrar un título y un subtítulo",
  "script.fn.actions.log":
    "Escribir en el registro del servidor. Varios argumentos se concatenan",
  "script.fn.actions.take_level": "Quitar niveles al jugador",
  "script.fn.actions.give_level": "Dar niveles al jugador",
  "script.fn.actions.give_exp": "Dar puntos de experiencia",
  "script.fn.actions.close": "Cerrar la interfaz actual",
  "script.fn.actions.back": "Volver al menú anterior",
  "script.fn.actions.openmenu": "Abrir un menú personalizado",
  "script.fn.actions.discover_recipe": "Desbloquear una receta",
  "script.fn.actions.undiscover_recipe": "Bloquear una receta",
  "script.fn.actions.sound": "Reproducir un sonido",
  "script.fn.actions.set_inv_item":
    "Definir el objeto de una casilla de la interfaz abierta",
  "script.fn.conditions.perm": "Comprobar si el jugador tiene un permiso",
  "script.fn.conditions.papi": "Leer un valor de PlaceholderAPI",
  "script.fn.conditions.level": "Leer el nivel del jugador",
  "script.fn.conditions.world":
    "Leer el nombre del mundo, o compararlo si se pasa un parámetro",
  "script.fn.conditions.gamemode":
    "Leer el modo de juego, o compararlo si se pasa un parámetro",
  "script.fn.conditions.item":
    "Comprobar si el objeto del evento coincide con un ID",
  "script.fn.conditions.biome":
    "Leer el bioma, o compararlo si se pasa un parámetro",
  "script.fn.conditions.in_water": "Comprobar si el jugador está en el agua",
  "script.fn.conditions.in_rain": "Comprobar si el jugador está bajo la lluvia",
  "script.fn.conditions.light_level":
    "Leer el nivel de luz del bloque donde está",
  "script.fn.conditions.match_item_id":
    "Obtener el ID con espacio de nombres del objeto ítem",
  "script.fn.math.abs": "Valor absoluto",
  "script.fn.math.min": "El menor de dos valores",
  "script.fn.math.max": "El mayor de dos valores",
  "script.fn.math.round": "Redondear al más cercano",
  "script.fn.math.floor": "Redondear hacia abajo",
  "script.fn.math.ceil": "Redondear hacia arriba",
  "script.fn.math.sqrt": "Raíz cuadrada",
  "script.fn.math.pow": "Elevar a una potencia",
  "script.fn.math.random":
    "Número aleatorio. Sin argumentos da 0~1, un argumento es el límite superior, dos son min~max",
  "script.fn.math.random_int":
    "Entero aleatorio. Un argumento es el límite superior, dos son min~max",
  "script.fn.math.int": "Convertir a entero",
  "script.fn.math.float": "Convertir a número decimal",
  "script.fn.vault.money": "Leer el saldo del jugador (Vault)",
  "script.fn.vault.take_money": "Descontar saldo (Vault)",
  "script.fn.vault.give_money": "Añadir saldo (Vault)",
  "script.fn.vault_unlocked.money":
    "Leer el saldo del jugador (VaultUnlocked). Sin moneda se usa la predeterminada",
  "script.fn.vault_unlocked.take_money":
    "Descontar saldo (VaultUnlocked). Sin moneda se usa la predeterminada",
  "script.fn.vault_unlocked.give_money":
    "Añadir saldo (VaultUnlocked). Sin moneda se usa la predeterminada",
  "script.fn.playerpoints.points": "Leer los puntos del jugador",
  "script.fn.playerpoints.take_points": "Descontar puntos",
  "script.fn.playerpoints.give_points": "Añadir puntos",
  "script.fn.obj.get":
    "Leer un campo del objeto, se escribe normalmente x.get(\"campo\")",
  "script.fn.obj.set":
    "Escribir un campo del objeto, se escribe normalmente x.set(\"campo\", valor)",
  "script.fn.obj.invoke":
    "Llamar a un método del objeto, se escribe normalmente x.invoke(\"método\", args...)",
  // delay no tiene espacio de nombres, solo nombre corto: clave script.fn.delay
  "script.fn.delay": "Pausar los ticks indicados y continuar",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if":
    "Ejecuta las siguientes instrucciones si la condición se cumple",
  "script.kw.elseif": "Comprueba otra condición si la anterior no se cumple",
  "script.kw.else": "Se ejecuta si ninguna condición anterior se cumple",
  "script.kw.endif": "Cierra el bloque if",
  "script.kw.return": "Termina el script y devuelve un valor",
  "script.kw.var": "Declara una variable, se escribe var nombre = valor",
  "script.kw.true": "Valor booleano verdadero",
  "script.kw.false": "Valor booleano falso",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Acciones que afectan al jugador y al mundo",
  "script.module.conditions":
    "Comprobaciones que leen el estado del jugador y del entorno",
  "script.module.math": "Operaciones matemáticas y números aleatorios",
  "script.module.vault": "Interfaz de economía (requiere Vault)",
  "script.module.vault_unlocked":
    "Interfaz de economía multidivisa (requiere VaultUnlocked)",
  "script.module.playerpoints": "Interfaz de puntos (requiere PlayerPoints)",
  "script.module.obj":
    "Acceso reflexivo a los campos y métodos de un objeto",
  "script.complete.returns": "Devuelve",
  "triggers.priority": "Prioridad (priority)",
  "triggers.priorityHint": "Los números menores se ejecutan antes",
  "triggers.cooldown": "Enfriamiento (segundos)",
  "triggers.cooldownHint": "0 significa sin límite",
  "triggers.enabled": "Activado",
  "triggers.disabled": "Desactivado",
  "triggers.perPlayer": "Enfriamiento por jugador",
  "triggers.shared": "Enfriamiento común del servidor",

  "fields.section": "Ajustes de la receta",
  "fields.fileName": "Nombre del archivo de receta",
  "fields.exportAs": "Se exporta como {name}.yml",
  "fields.recipeId": "ID de la receta (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "Si se deja vacío, el plugin usa el nombre del archivo como ID de la receta",
  "fields.recipeIdRequiredHint":
    "El nombre del archivo no puede servir como ID de la receta, hay que indicarlo aquí",
  "fields.group": "Grupo de la receta (group)",
  "fields.groupPlaceholder": "Vacío significa sin grupo",
  "fields.groupHint":
    "Las recetas del mismo grupo se muestran juntas en el libro de recetas",
  "fields.exp": "Experiencia obtenida (exp)",
  "fields.time": "Tiempo de fundición (time)",
  "fields.timeHint": "En ticks, 20 ticks = 1 segundo",
  "fields.costLevel": "Nivel necesario (cost_level)",
  "fields.trimPattern": "Patrón de adorno (trim_pattern)",
  "fields.bookCategory": "Categoría del libro de recetas",
  "fields.bookCategoryHint": "Requiere un servidor 1.19.3+",
  "fields.unspecified": "Sin especificar",
  "fields.previewSection": "Resultado falso (opcional)",
  "fields.previewSlot": "Resultado falso",
  "fields.previewLabel": "Objeto del resultado falso",
  "fields.previewHint":
    "La casilla de resultado muestra este objeto para ocultar el producto real; el jugador sigue recibiendo el resultado auténtico. Si se deja vacío, no se escribe fake_result_preview.",
  "fields.copySection": "Reglas de copia de componentes (opcional)",
  "fields.copyHint":
    "Los componentes marcados se copian del objeto de entrada al resultado, en copy_components_rules.",
  "fields.copySince": "{name} (requiere {since})",
  "fields.removeRule": "Quitar {name}",

  "category.crafting.building": "Bloques de construcción",
  "category.crafting.redstone": "Objetos de redstone",
  "category.crafting.equipment": "Equipamiento",
  "category.crafting.misc": "Varios",
  "category.cooking.food": "Comida",
  "category.cooking.blocks": "Bloques",
  "category.cooking.misc": "Varios",

  "copyRule.all": "Todos los componentes",
  "copyRule.enchantments": "Encantamientos",
  "copyRule.attributes": "Atributos",
  "copyRule.display_name": "Nombre visible",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Datos de modelo",
  "copyRule.item_flag": "Marcas del objeto",
  "copyRule.unbreakable": "Irrompible",
  "copyRule.trim": "Adorno de armadura",
  "copyRule.food": "Comida",
  "copyRule.max_stack_size": "Tamaño máximo de pila",
  "copyRule.rarity": "Rareza",
  "copyRule.fire_resistance": "Resistencia al fuego",
  "copyRule.hide_tooltip": "Ocultar información",
  "copyRule.item_name": "Nombre del objeto",
  "copyRule.tool": "Herramienta",
  "copyRule.item_model": "Modelo del objeto",
  "copyRule.custom_model_data_component": "Componente de datos de modelo",

  "itemCategory.building": "Construcción",
  "itemCategory.ore": "Minerales",
  "itemCategory.tool": "Herramientas",
  "itemCategory.combat": "Combate",
  "itemCategory.food": "Comida",
  "itemCategory.redstone": "Redstone",
  "itemCategory.brewing": "Alquimia",
  "itemCategory.misc": "Varios",

  "recipeGroup.crafting": "Fabricación",
  "recipeGroup.smelting": "Fundición",
  "recipeGroup.smithing": "Herrería",
  "recipeGroup.processing": "Procesado",

  "recipeType.vanilla_shaped": "Receta con forma",
  "recipeType.vanilla_shaped.summary":
    "Los ingredientes se colocan en un patrón de 3×3; la posición decide si se fabrica.",
  "recipeType.vanilla_shapeless": "Receta sin forma",
  "recipeType.vanilla_shapeless.summary":
    "Se fabrica con todos los ingredientes presentes, en cualquier posición.",
  "recipeType.vanilla_smelting_furnace": "Receta de horno",
  "recipeType.vanilla_smelting_furnace.summary":
    "Funde un ingrediente en el horno, con experiencia y tiempo configurables.",
  "recipeType.vanilla_smelting_blast": "Receta de alto horno",
  "recipeType.vanilla_smelting_blast.summary":
    "Fundición en alto horno, normalmente para minerales y metales.",
  "recipeType.vanilla_smelting_smoker": "Receta de ahumador",
  "recipeType.vanilla_smelting_smoker.summary":
    "Cocción en el ahumador, normalmente para comida.",
  "recipeType.vanilla_smelting_campfire": "Receta de hoguera",
  "recipeType.vanilla_smelting_campfire.summary":
    "Cocción en hoguera, normalmente más lenta que el horno.",
  "recipeType.vanilla_smithing_transform": "Receta de herrería",
  "recipeType.vanilla_smithing_transform.summary":
    "Mejora un objeto base a otro nuevo con una plantilla y un material añadido.",
  "recipeType.vanilla_smithing_trim": "Receta de adorno",
  "recipeType.vanilla_smithing_trim.summary":
    "Añade un adorno a la armadura; el patrón de adorno es obligatorio.",
  "recipeType.vanilla_stonecutting": "Receta de cortapiedras",
  "recipeType.vanilla_stonecutting.summary":
    "Corta un ingrediente para obtener el resultado en el cortapiedras.",
  "recipeType.vanilla_brewing": "Receta de alquimia",
  "recipeType.vanilla_brewing.summary":
    "Usa un ingrediente para transformar el objeto de entrada en el soporte para pociones.",
  "recipeType.anvil": "Receta de yunque",
  "recipeType.anvil.summary":
    "Combina dos objetos en el yunque, con nivel necesario configurable.",

  "station.crafting_table": "Mesa de trabajo",
  "station.furnace": "Horno",
  "station.blast_furnace": "Alto horno",
  "station.smoker": "Ahumador",
  "station.campfire": "Hoguera",
  "station.smithing_table": "Mesa de herrería",
  "station.stonecutter": "Cortapiedras",
  "station.brewing_stand": "Soporte para pociones",
  "station.anvil": "Yunque",

  "guiSlot.gridCell": "Casilla de la cuadrícula",
  "guiSlot.gridPosition": "fila {row}, columna {col}",
  "guiSlot.shapelessIngredient": "Ingrediente {index}",
  "guiSlot.ingredient": "Ingrediente",
  "guiSlot.result": "Resultado",
  "guiSlot.template": "Plantilla",
  "guiSlot.base": "Objeto base",
  "guiSlot.addition": "Material añadido",
  "guiSlot.anvilBase": "Objeto izquierdo",
  "guiSlot.anvilAddition": "Objeto derecho",
  "guiSlot.brewingInput": "Objeto de entrada",
  "guiSlot.brewingMiddle": "casilla central de botella",
  "guiSlot.inertFuel":
    "La casilla de combustible la llena el jugador; la receta no la usa",
  "guiSlot.inertBottle":
    "Las botellas de los lados usan el mismo objeto de entrada que la central",

  "triggerGroup.craft": "Fabricación",
  "triggerGroup.player": "Eventos de jugador",
  "triggerGroup.entity": "Eventos de entidad",
  "triggerGroup.block": "Eventos de bloque",
  "triggerGroup.inventory": "Eventos de inventario",

  "triggerType.crafting": "Fabricar en mesa de trabajo",
  "triggerType.smithing": "Forjar en mesa de herrería",
  "triggerType.anvil": "Combinar en yunque",
  "triggerType.player_join": "Entrada del jugador",
  "triggerType.player_quit": "Salida del jugador",
  "triggerType.player_death": "Muerte del jugador",
  "triggerType.player_respawn": "Reaparición del jugador",
  "triggerType.player_interact": "Interacción del jugador",
  "triggerType.player_advancement": "Progreso obtenido",
  "triggerType.player_level_change": "Cambio de nivel",
  "triggerType.player_exp_change": "Cambio de experiencia",
  "triggerType.player_toggle_sneak": "Agacharse",
  "triggerType.player_toggle_sprint": "Esprintar",
  "triggerType.player_item_consume": "Consumir objeto",
  "triggerType.player_item_held": "Cambiar objeto en mano",
  "triggerType.player_item_damage": "Objeto dañado",
  "triggerType.player_item_mend": "Objeto reparado",
  "triggerType.player_fish": "Pescar",
  "triggerType.player_teleport": "Teletransporte",
  "triggerType.player_portal": "Usar portal",
  "triggerType.player_changed_world": "Cambiar de mundo",
  "triggerType.player_drop_item": "Tirar objeto",
  "triggerType.player_pickup_item": "Recoger objeto",
  "triggerType.player_game_mode_change": "Cambio de modo de juego",
  "triggerType.player_recipe_discover": "Receta desbloqueada",
  "triggerType.player_command_preprocess": "Ejecutar comando",
  "triggerType.player_move": "Movimiento del jugador",
  "triggerType.player_bed_enter": "Meterse en la cama",
  "triggerType.player_bed_leave": "Salir de la cama",
  "triggerType.player_swap_hand_items": "Intercambiar manos",
  "triggerType.player_edit_book": "Editar libro",
  "triggerType.player_statistic": "Cambio de estadística",
  "triggerType.player_bucket_fill": "Llenar cubo",
  "triggerType.player_bucket_empty": "Vaciar cubo",
  "triggerType.player_shear_entity": "Esquilar entidad",
  "triggerType.damage_entity": "Causar daño",
  "triggerType.kill_entity": "Matar entidad",
  "triggerType.entity_shoot_bow": "Disparar con arco",
  "triggerType.entity_breed": "Criar animales",
  "triggerType.entity_tame": "Domar animal",
  "triggerType.entity_potion_effect": "Cambio de efecto de poción",
  "triggerType.block_break": "Romper bloque",
  "triggerType.block_place": "Colocar bloque",
  "triggerType.inventory_click": "Clic en inventario",
  "triggerType.inventory_open": "Abrir inventario",
  "triggerType.inventory_close": "Cerrar inventario",
  "triggerType.player_interact_entity": "Interactuar con entidad",
  "triggerType.player_animation": "Animación de jugador",
  "triggerType.player_velocity": "Cambio de velocidad",
  "triggerType.async_player_chat": "Chat del jugador",
  "triggerType.player_take_campfire": "Tomar de la hoguera",
  "triggerType.prepare_grindstone": "Preparar muela",
  "triggerType.trade_select": "Seleccionar comercio",

  "issue.fileNameEmpty":
    "El nombre del archivo de receta no puede estar vacío.",
  "issue.fileNameNeedsRecipeId":
    "El nombre del archivo contiene caracteres no válidos. Sin recipe_id el plugin usa el nombre del archivo como ID de la receta, así que la carga fallaría: usar letras minúsculas, dígitos, guiones bajos, guiones y puntos, o indicar un ID de receta abajo.",
  "issue.recipeIdPattern":
    "El ID de la receta solo admite letras minúsculas, dígitos, guiones bajos, guiones y puntos.",
  "issue.resultMissing": "Aún no se ha definido el resultado (result).",
  "issue.resultMustBeItem":
    "El resultado solo puede ser un objeto concreto, no una etiqueta ni un grupo de objetos.",
  "issue.gridEmpty":
    "La cuadrícula de fabricación necesita al menos un ingrediente.",
  "issue.gridTooManyKinds":
    "Hay más de 9 ingredientes distintos, no se puede generar shape.",
  "issue.shapelessEmpty":
    "Una receta sin forma necesita al menos un ingrediente.",
  "issue.shapelessTooMany":
    "Una receta sin forma admite como máximo 9 ingredientes.",
  "issue.smeltingIngredient":
    "Aún no se ha definido el ingrediente de fundición (ingredient).",
  "issue.cookingTime": "El tiempo de fundición debe ser mayor que 0 ticks.",
  "issue.expNegative": "La experiencia no puede ser negativa.",
  "issue.stonecuttingIngredient":
    "Aún no se ha definido el ingrediente del cortapiedras (ingredient).",
  "issue.smithingBase": "Aún no se ha definido el objeto base (base).",
  "issue.smithingAddition":
    "Aún no se ha definido el material añadido (addition).",
  "issue.smithingTemplate":
    "No se ha definido la plantilla de herrería (template); los servidores 1.20+ suelen necesitarla.",
  "issue.trimPattern":
    "La receta de adorno debe indicar el patrón de adorno (trim_pattern).",
  "issue.brewingInput":
    "Aún no se ha definido el objeto de entrada de alquimia (input).",
  "issue.brewingIngredient":
    "Aún no se ha definido el ingrediente de alquimia (ingredient).",
  "issue.anvilBase": "Aún no se ha definido el objeto izquierdo (base).",
  "issue.anvilAddition": "Aún no se ha definido el objeto derecho (addition).",
  "issue.costLevelNegative": "El nivel necesario no puede ser negativo.",
  "issue.packUndefined":
    "Se hace referencia al grupo de objetos {name}, que no está definido. Crearlo en «Grupos de objetos» o comprobar que existe en el servidor.",
  "issue.brewingTagInput":
    "El objeto de entrada de alquimia usa una etiqueta. La coincidencia por etiqueta en alquimia depende del servidor; es más seguro un objeto concreto.",
  "issue.brewingTagIngredient":
    "El ingrediente de alquimia usa una etiqueta. La coincidencia por etiqueta en alquimia depende del servidor; es más seguro un objeto concreto.",
  "issue.packNameEmpty": "Hay un grupo de objetos sin nombre.",
  "issue.packNameDuplicate":
    "El nombre de grupo {name} está repetido; los últimos sobrescriben a los anteriores.",
  "issue.packNamePattern":
    "Para el nombre de grupo {name} se recomiendan solo letras minúsculas, dígitos, guiones bajos y guiones.",
  "issue.packItemsEmpty":
    "El grupo de objetos {name} no tiene objetos y el plugin lo omitirá.",
  "issue.packNested":
    "El grupo de objetos {name} no admite etiquetas ni otros grupos anidados, solo objetos concretos.",
  "issue.triggerIdEmpty": "Hay un disparador sin nombre.",
  "issue.triggerIdDuplicate":
    "El ID de disparador {name} está repetido; los últimos sobrescriben a los anteriores.",
  "issue.triggerIdPattern":
    "Para el ID de disparador {name} se recomiendan solo letras minúsculas, dígitos, guiones bajos y guiones.",
  "issue.triggerTypeMissing":
    "El disparador {name} no tiene tipo y el plugin lo omitirá.",
  "issue.triggerNoActions":
    "El disparador {name} no tiene acciones y no hará nada al activarse.",
  "issue.triggerCooldownNegative":
    "El enfriamiento del disparador {name} no puede ser negativo.",
  "issue.triggerConditionScript":
    "La línea {line} de las condiciones del disparador {name} tiene un error de sintaxis; el plugin no podrá cargarla.",
  "issue.triggerActionScript":
    "La línea {line} de las acciones del disparador {name} tiene un error de sintaxis; el plugin no podrá cargarla.",

  "parse.yamlFailed": "Error al analizar el YAML: {detail}",
  "parse.notRecipe":
    "Este archivo no es una configuración de receta (el nivel superior debe ser un mapa).",
  "parse.typeMissing":
    "Falta el campo type, no se puede determinar el tipo de receta.",
  "parse.typeUnsupported": "Tipo de receta no admitido: {name}",
  "parse.resultMissing":
    "No se ha leído result, hay que definir el resultado de nuevo.",
  "parse.shapeMissing":
    "No se han leído shape / ingredients válidos, la cuadrícula queda vacía.",
  "parse.shapeCharUnmapped":
    "El carácter {name} de shape no tiene ingrediente asociado.",
  "parse.shapeTooManyRows":
    "shape tiene más de 3 filas, solo se importan las 3 primeras.",
  "parse.ingredientsMissing":
    "No se han leído ingredients, la lista de ingredientes queda vacía.",
  "parse.ingredientsTooMany":
    "Hay más de 9 ingredientes, solo se importan los 9 primeros.",
  "parse.amountClamped":
    "Se corrigieron algunas cantidades: esa casilla no lee cantidades, o el valor superaba el límite {max}.",
  "parse.cookingCategoryUnknown":
    "Categoría del libro de recetas de fundición no reconocida: {name}",
  "parse.craftingCategoryUnknown":
    "Categoría del libro de recetas de fabricación no reconocida: {name}",
  "parse.notItemPacks":
    "Este archivo no es una configuración de grupos de objetos (el nivel superior debe asociar nombres a listas).",
  "parse.packNotList":
    "El valor del grupo de objetos {name} no es una lista, se ha omitido.",
  "parse.packNoItems":
    "El grupo de objetos {name} no tiene objetos válidos, se ha omitido.",
  "parse.notTriggers":
    "Este archivo no es una configuración de disparadores (el nivel superior debe asociar IDs a configuraciones).",
  "parse.triggerNotMap":
    "El contenido del disparador {name} no es un mapa, se ha omitido.",
  "parse.triggerTypeMissing":
    "Al disparador {name} le falta type, se ha omitido.",
};
