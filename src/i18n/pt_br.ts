import type { MessageKey } from "./zh_cn";

export const ptBr: Record<MessageKey, string> = {
  "brand.title": "Craftorithm Estúdio de Receitas",
  "brand.sub": "Gere o YAML de receitas do plugin localmente, sem login",

  "view.aria": "Área de trabalho",
  "skip.toWorkbench": "Ir para a bancada",
  "view.recipe": "Receita",
  "view.packs": "Grupos de itens",
  "view.triggers": "Gatilhos",

  "tabs.aria": "Arquivos abertos",
  "tabs.close": "Fechar {name}",
  "tabs.newRecipe": "Nova receita",
  "tabs.newTrigger": "Novo arquivo de gatilhos",
  "tabs.saveAsNew": "Salvar como nova aba",
  "tabs.newMenu": "Mais opções de criação",
  "tabs.importFiles": "Importar arquivos…",

  "start.title": "Começar",
  "start.note": "Crie uma receita ou importe arquivos existentes para continuar editando.",
  "start.newRecipe": "Nova receita",
  "start.importFiles": "Importar arquivos",
  "start.importFolder": "Importar pasta",
  "start.hint": "Ao importar uma pasta, recipes, item_packs.yml e triggers são detectados automaticamente.",

  "action.exportAll": "Exportar tudo",
  "toast.exportedZip": "{count} arquivo(s) exportado(s)",
  "toast.exportEmpty": "Nada para exportar",
  "toast.savedAsNew": "Copiado para uma nova aba",
  "toast.importedCount": "{count} arquivo(s) importado(s)",
  "toast.importSkipped": "{count} arquivo(s) não reconhecido(s) ignorado(s)",
  "toast.tabClosed": "{name} fechado",
  "toast.typeChangedLost": "Mudar o tipo descartou {count} ingredientes — é possível desfazer",

  "history.undo": "Desfazer",
  "history.redo": "Refazer",
  "history.undoOf": "Desfazer {action}",
  "history.action.changeType": "a troca de tipo de receita",
  "history.action.reset": "a redefinição da receita",
  "history.action.closeTab": "o fechamento do arquivo",
  "history.action.import": "a sobrescrita na importação",
  "history.action.packEdit": "a alteração do grupo de itens",

  "step.aria": "Etapas de edição",
  "step.type": "Tipo",
  "step.edit": "Editar",
  "step.export": "Exportar",

  "action.reset": "Redefinir",
  "action.resetRecipe": "Redefinir receita",
  "action.importYaml": "Importar YAML",
  "action.downloadYaml": "Baixar YAML",
  "action.copyClipboard": "Copiar para a área de transferência",
  "action.close": "Fechar",
  "action.remove": "Remover",

  "locale.switch": "Idioma",
  "theme.switch": "Aparência",
  "theme.light": "Claro",
  "theme.dark": "Escuro",

  "catalog.offline": "Catálogo de itens offline, usando a lista interna",

  "footer.aria": "Sobre e links relacionados",
  "footer.credit":
    "Feito por 氿雾 · um editor de receitas para o plugin Craftorithm",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Documentação",
  "footer.link.qq": "Grupo QQ",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML copiado para a área de transferência",
  "toast.copyFailed":
    "Falha ao copiar, selecione a pré-visualização manualmente",
  "toast.downloaded": "{name} baixado",
  "toast.saved": "{name} salvo no local escolhido",

  "next.titleDownloaded": "{name} baixado — faltam dois passos",
  "next.titleSaved": "{name} salvo — faltam dois passos",
  "next.step1": "Coloque o arquivo aqui no seu servidor (arquivo de mesmo nome é sobrescrito):",
  "next.step2": "Execute isto no console do servidor ou dentro do jogo:",
  "next.step3": "Teste a receita no jogo. Se nada acontecer, veja no console se houve erro de carregamento.",
  "next.copyPath": "Copiar caminho",
  "next.copyCommand": "Copiar comando",
  "next.pathCopied": "Caminho copiado",
  "next.commandCopied": "Comando copiado",
  "next.done": "Entendi",
  "toast.imported": "{name} importado",
  "toast.recipeReset": "Redefinido para uma receita vazia",
  "bench.station": "Estação: {name}",
  "bench.importWarnings":
    "{count} ponto(s) precisam de conferência após a importação: {detail}",
  "bench.shapelessNote":
    "Receitas sem forma só verificam se todos os ingredientes estão presentes; a posição não importa.",
  "bench.inertNote":
    "Os espaços não clicáveis são usados pelos jogadores no jogo; a receita não escreve neles.",
  "bench.guiAlt": "Interface de {name}",
  "bench.resultOutside": "Resultado (a mesma casa da interface acima)",

  "typeNav.aria": "Tipo de receita",

  "inspector.title": "Resultado e verificações",
  "inspector.resultUnset": "Resultado ainda não definido",
  "inspector.resultHint": "Clique no espaço do resultado na bancada",
  "inspector.slotUnset": "Vazio",
  "inspector.mustFix": "{count} problema(s) a corrigir",
  "inspector.stillTodo": "Faltam {count} passo(s)",
  "inspector.ready": "A receita está completa e pronta para exportar",
  "inspector.yamlTitle": "Pré-visualização do YAML",
  "inspector.fixFirst": "Corrija os erros acima para liberar o download.",

  "picker.aria": "Escolher ingrediente: {name}",
  "picker.title": "Escolher ingrediente · {name}",
  "picker.clearSlot": "Limpar espaço",
  "picker.tabsAria": "Tipo de ingrediente",
  "picker.tab.item": "Itens",
  "picker.tab.tag": "Tags",
  "picker.tab.item_pack": "Grupos de itens",
  "picker.categoryAll": "Tudo",
  "picker.search.item": "Busque por nome ou ID, por exemplo diamond",
  "picker.search.tag": "Busque tags, por exemplo planks / logs",
  "picker.search.item_pack": "Busque nomes de grupos de itens",
  "picker.custom.item": "ID de item personalizado",
  "picker.custom.tag": "Nome de tag personalizado",
  "picker.custom.item_pack": "Nome de grupo personalizado",
  "picker.customPlaceholder.item": "minecraft:diamond ou oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Quantidade",
  "picker.use": "Usar",
  "picker.loadingItems": "Carregando o catálogo de itens do {version}…",
  "picker.loadingTags": "Carregando as tags de itens do {version}…",
  "picker.noItem": "Nenhum resultado. Você pode digitar um ID de item abaixo.",
  "picker.noTag":
    "Nenhuma lista de tags disponível. Você pode digitar um nome de tag abaixo, por exemplo planks.",
  "picker.noPack":
    "Ainda não há grupos de itens. Crie um na aba Grupos de itens ou digite um nome abaixo.",
  "picker.showMore": "Mostrar mais (faltam {count})",
  "picker.packItemCount": "{count} item(ns)",
  "picker.tagItemCount": "{count} item(ns) nesta tag",
  "picker.packGlyph": "G",

  "slot.empty": "vazio",
  "slot.item": "Item",
  "slot.itemPack": "Grupo de itens",
  "choice.tag": "Tag {name}",
  "choice.itemPack": "Grupo de itens {name}",
  "badge.tag": "Tag",
  "badge.itemPack": "Grupo de itens",

  "packs.title": "Grupos de itens",
  "packs.note":
    "Junte vários itens em um grupo e use {code} na receita; qualquer um deles satisfaz o ingrediente.",
  "packs.create": "Novo grupo de itens",
  "packs.import": "Importar item_packs.yml",
  "packs.empty":
    "Ainda não há grupos de itens. Depois de criar um, você pode escolhê-lo em qualquer espaço de ingrediente.",
  "packs.name": "Nome do grupo",
  "packs.removeGroup": "Excluir grupo",
  "packs.removeItem": "Remover o item {index}",
  "packs.addItem": "Adicionar item a {name}",
  "packs.yamlEmpty": "# Ainda não há grupos de itens",
  "packs.imported": "{count} grupo(s) de itens importado(s)",
  "packs.importedWithWarnings":
    "{count} grupo(s) de itens importado(s), {warnings} aviso(s)",

  "triggers.title": "Gatilhos",
  "triggers.note":
    "Execute ações quando ocorrer uma fabricação ou outro evento. Coloque o arquivo na pasta {code} do plugin.",
  "triggers.fileName": "Nome do arquivo",
  "triggers.exportAs": "Exportado como {name}.yml",
  "triggers.create": "Novo gatilho",
  "triggers.import": "Importar YAML de gatilhos",
  "triggers.empty": "Ainda não há gatilhos. Crie um para começar.",
  "triggers.yamlEmpty": "# Ainda não há gatilhos",
  "triggers.imported": "{count} gatilho(s) importado(s)",
  "triggers.importedWithWarnings":
    "{count} gatilho(s) importado(s), {warnings} aviso(s)",
  "triggers.id": "ID do gatilho",
  "triggers.type": "Tipo de gatilho",
  "triggers.recipes": "Filtro de receitas (recipes)",
  "triggers.recipesHint":
    "Deixe vazio para acionar em todas as receitas desse tipo. Use a key completa da receita, por exemplo craftorithm:my_sword",
  "triggers.conditions": "Condições (conditions)",
  "triggers.mode.and": "Todas devem passar",
  "triggers.mode.script": "Bloco de script",
  "triggers.conditionsHint.and":
    'Uma condição por linha, todas precisam valer. Por exemplo papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Escreva o script linha por linha e faça você mesmo o return true / false.",
  "triggers.actions": "Ações (actions)",
  "triggers.actionsHint":
    'Uma ação por linha, por exemplo tell("&aFabricado!") ou give_level(100)',
  "triggers.variables": "Variáveis disponíveis: {list}",

  // ---- Editor de scripts ----
  "script.line": "Linha {line}",
  "script.status.errors": "{count} erro(s) de sintaxe",
  "script.status.warnings": "{count} aviso(s)",
  "script.hint.condition":
    "Tab completa, Ctrl+Space abre as sugestões. As condições precisam resultar em true / false.",
  "script.hint.action":
    "Tab completa, Ctrl+Space abre as sugestões. Uma ação por linha.",
  "script.undo": "Desfazer",
  "script.redo": "Refazer",

  // Erros léxicos
  "script.err.unterminatedString":
    "A string está sem as aspas duplas de fechamento",
  "script.err.unexpectedChar": "Caractere não reconhecido",

  // Erros de estrutura
  "script.err.unclosedParen": "Parêntese não fechado",
  "script.err.unexpectedParen": "Parêntese de fechamento sem par",
  "script.err.missingEndif": "if está sem o endif correspondente",
  "script.err.orphanEndif": "endif não tem um if correspondente",
  "script.err.orphanBranch": "{keyword} não tem um if correspondente",
  "script.err.expectedFunctionName":
    "É necessário um nome de função depois dos dois-pontos",
  "script.err.moduleCallNeedsParen":
    "Chamadas de módulo exigem parênteses; escreva {name}(...)",
  "script.err.expectedMethodCall":
    "É necessária uma chamada de método depois do ponto; escreva .{name}(...)",
  "script.err.expectedVarName": "var precisa ser seguido de \"nome = valor\"",

  // Nomes e argumentos
  "script.err.unknownFunction": "Função desconhecida {name}",
  "script.err.unknownModule": "Módulo desconhecido {name}",
  "script.err.argCount":
    "{name} espera {expected} argumento(s), recebeu {actual}",
  "script.err.argType":
    "O parâmetro {param} de {name} espera {expected}, mas recebeu {actual}",
  "script.err.ambiguousName":
    "{name} existe em vários módulos, prefira {qualified}",
  "script.err.unknownVariable":
    "A variável {name} não foi declarada nem é fornecida por este gatilho",

  // Avisos semânticos
  "script.err.assignUndeclared":
    "{name} não foi declarado com var; talvez seja preciso var {name} = ...",
  "script.err.blockInAndMode":
    "No modo \"atender todas\" cada linha precisa ser uma condição independente, então {name} não é permitido; troque para \"bloco de script\" para usar ramificações ou variáveis",
  "script.err.queryInAction":
    "{name} apenas lê um valor, talvez precise estar dentro de um if",
  "script.err.notBoolean": "Esta linha não resulta em true / false",

  // Descrições das funções, chave no formato script.fn.<module>.<name>
  "script.fn.actions.command":
    "Executa um comando como o jogador. Vários argumentos são concatenados",
  "script.fn.actions.console":
    "Executa um comando como o console. Vários argumentos são concatenados",
  "script.fn.actions.tell":
    "Envia uma mensagem de bate-papo ao jogador. Vários argumentos são concatenados",
  "script.fn.actions.actionbar":
    "Mostra uma mensagem acima da barra de itens. Vários argumentos são concatenados",
  "script.fn.actions.title": "Mostra um título e um subtítulo",
  "script.fn.actions.log":
    "Escreve no log do servidor. Vários argumentos são concatenados",
  "script.fn.actions.take_level": "Remove níveis do jogador",
  "script.fn.actions.give_level": "Concede níveis ao jogador",
  "script.fn.actions.give_exp": "Concede pontos de experiência",
  "script.fn.actions.close": "Fecha a interface atual",
  "script.fn.actions.back": "Volta ao menu anterior",
  "script.fn.actions.openmenu": "Abre um menu personalizado",
  "script.fn.actions.discover_recipe": "Desbloqueia uma receita",
  "script.fn.actions.undiscover_recipe": "Bloqueia uma receita",
  "script.fn.actions.sound": "Toca um som",
  "script.fn.actions.set_inv_item":
    "Define o item de um espaço da interface aberta",
  "script.fn.conditions.perm": "Verifica se o jogador tem uma permissão",
  "script.fn.conditions.papi": "Lê um valor do PlaceholderAPI",
  "script.fn.conditions.level": "Lê o nível do jogador",
  "script.fn.conditions.world":
    "Lê o nome do mundo, ou compara quando recebe um argumento",
  "script.fn.conditions.gamemode":
    "Lê o modo de jogo, ou compara quando recebe um argumento",
  "script.fn.conditions.item":
    "Verifica se o item do evento corresponde a um ID",
  "script.fn.conditions.biome":
    "Lê o bioma, ou compara quando recebe um argumento",
  "script.fn.conditions.in_water": "Verifica se o jogador está na água",
  "script.fn.conditions.in_rain": "Verifica se o jogador está na chuva",
  "script.fn.conditions.light_level":
    "Lê o nível de luz do bloco onde o jogador está",
  "script.fn.conditions.match_item_id":
    "Obter o ID com namespace de um objeto item",
  "script.fn.math.abs": "Valor absoluto",
  "script.fn.math.min": "Menor de dois valores",
  "script.fn.math.max": "Maior de dois valores",
  "script.fn.math.round": "Arredonda para o mais próximo",
  "script.fn.math.floor": "Arredonda para baixo",
  "script.fn.math.ceil": "Arredonda para cima",
  "script.fn.math.sqrt": "Raiz quadrada",
  "script.fn.math.pow": "Eleva a uma potência",
  "script.fn.math.random":
    "Número aleatório. Sem argumento é 0~1, um argumento é o limite superior, dois são min~max",
  "script.fn.math.random_int":
    "Inteiro aleatório. Um argumento é o limite superior, dois são min~max",
  "script.fn.math.int": "Converte para inteiro",
  "script.fn.math.float": "Converte para número decimal",
  "script.fn.vault.money": "Lê o saldo do jogador (Vault)",
  "script.fn.vault.take_money": "Retira saldo (Vault)",
  "script.fn.vault.give_money": "Deposita saldo (Vault)",
  "script.fn.vault_unlocked.money":
    "Lê o saldo do jogador (VaultUnlocked). Sem moeda usa a moeda padrão",
  "script.fn.vault_unlocked.take_money":
    "Retira saldo (VaultUnlocked). Sem moeda usa a moeda padrão",
  "script.fn.vault_unlocked.give_money":
    "Deposita saldo (VaultUnlocked). Sem moeda usa a moeda padrão",
  "script.fn.playerpoints.points": "Lê os pontos do jogador",
  "script.fn.playerpoints.take_points": "Retira pontos",
  "script.fn.playerpoints.give_points": "Deposita pontos",
  "script.fn.obj.get":
    "Lê um campo do objeto, normalmente escrito x.get(\"campo\")",
  "script.fn.obj.set":
    "Escreve um campo do objeto, normalmente escrito x.set(\"campo\", valor)",
  "script.fn.obj.invoke":
    "Chama um método do objeto, normalmente escrito x.invoke(\"método\", args...)",
  // delay não tem namespace, só o nome curto: chave script.fn.delay
  "script.fn.delay": "Pausa pelos ticks indicados e continua",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if":
    "Executa as instruções seguintes quando a condição é verdadeira",
  "script.kw.elseif": "Testa outra condição quando a anterior é falsa",
  "script.kw.else": "Executa quando nenhuma condição anterior é verdadeira",
  "script.kw.endif": "Fecha o bloco if",
  "script.kw.return": "Encerra o script e devolve um valor",
  "script.kw.var": "Declara uma variável, escrito var nome = valor",
  "script.kw.true": "Valor booleano verdadeiro",
  "script.kw.false": "Valor booleano falso",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Ações que afetam o jogador e o mundo",
  "script.module.conditions":
    "Verificações que leem o estado do jogador e do ambiente",
  "script.module.math": "Operações matemáticas e números aleatórios",
  "script.module.vault": "Interface de economia (requer Vault)",
  "script.module.vault_unlocked":
    "Interface de economia multimoeda (requer VaultUnlocked)",
  "script.module.playerpoints": "Interface de pontos (requer PlayerPoints)",
  "script.module.obj":
    "Acesso reflexivo a campos e métodos de um objeto",
  "script.complete.returns": "Devolve",
  "triggers.priority": "Prioridade (priority)",
  "triggers.priorityHint": "Números menores são executados primeiro",
  "triggers.cooldown": "Tempo de recarga (segundos)",
  "triggers.cooldownHint": "0 significa sem limite",
  "triggers.enabled": "Ativado",
  "triggers.disabled": "Desativado",
  "triggers.perPlayer": "Recarga por jogador",
  "triggers.shared": "Recarga compartilhada no servidor",

  "fields.section": "Configurações da receita",
  "fields.fileName": "Nome do arquivo da receita",
  "fields.exportAs": "Exportado como {name}.yml",
  "fields.recipeId": "ID da receita (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "Deixe vazio para o plugin usar o nome do arquivo como ID da receita",
  "fields.recipeIdRequiredHint":
    "O nome do arquivo não pode servir como ID da receita, então precisa ser definido aqui",
  "fields.group": "Grupo da receita (group)",
  "fields.groupPlaceholder": "Deixe vazio para não agrupar",
  "fields.groupHint":
    "Receitas do mesmo grupo aparecem juntas no livro de receitas",
  "fields.exp": "Experiência (exp)",
  "fields.time": "Tempo de fundição (time)",
  "fields.timeHint": "Em ticks, 20 ticks = 1 segundo",
  "fields.costLevel": "Custo em níveis (cost_level)",
  "fields.trimPattern": "Padrão de ornamento (trim_pattern)",
  "fields.bookCategory": "Categoria do livro de receitas",
  "fields.bookCategoryHint": "Requer um servidor 1.19.3+",
  "fields.unspecified": "Não especificado",
  "fields.previewSection": "Resultado falso (opcional)",
  "fields.previewSlot": "Resultado falso",
  "fields.previewLabel": "Item de resultado falso",
  "fields.previewHint":
    "O espaço de resultado mostra este item para esconder o produto real; o jogador ainda retira o resultado verdadeiro. Deixe vazio para não escrever fake_result_preview.",
  "fields.copySection": "Regras de cópia de componentes (opcional)",
  "fields.copyHint":
    "Os componentes marcados são copiados do item de entrada para o resultado, escritos em copy_components_rules.",
  "fields.copySince": "{name} (requer {since})",
  "fields.removeRule": "Remover {name}",

  "category.crafting.building": "Blocos de construção",
  "category.crafting.redstone": "Redstone",
  "category.crafting.equipment": "Equipamentos",
  "category.crafting.misc": "Diversos",
  "category.cooking.food": "Comida",
  "category.cooking.blocks": "Blocos",
  "category.cooking.misc": "Diversos",

  "copyRule.all": "Todos os componentes",
  "copyRule.enchantments": "Encantamentos",
  "copyRule.attributes": "Atributos",
  "copyRule.display_name": "Nome exibido",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Dados de modelo",
  "copyRule.item_flag": "Marcadores de item",
  "copyRule.unbreakable": "Inquebrável",
  "copyRule.trim": "Ornamento de armadura",
  "copyRule.food": "Comida",
  "copyRule.max_stack_size": "Limite de empilhamento",
  "copyRule.rarity": "Raridade",
  "copyRule.fire_resistance": "Resistência ao fogo",
  "copyRule.hide_tooltip": "Ocultar dica",
  "copyRule.item_name": "Nome do item",
  "copyRule.tool": "Ferramenta",
  "copyRule.item_model": "Modelo do item",
  "copyRule.custom_model_data_component": "Componente de dados de modelo",

  "itemCategory.building": "Construção",
  "itemCategory.ore": "Minérios",
  "itemCategory.tool": "Ferramentas",
  "itemCategory.combat": "Combate",
  "itemCategory.food": "Comida",
  "itemCategory.redstone": "Redstone",
  "itemCategory.brewing": "Poções",
  "itemCategory.misc": "Diversos",

  "recipeGroup.crafting": "Fabricação",
  "recipeGroup.smelting": "Fundição",
  "recipeGroup.smithing": "Ferraria",
  "recipeGroup.processing": "Processamento",

  "recipeType.vanilla_shaped": "Receita com forma",
  "recipeType.vanilla_shaped.summary":
    "Posicione os ingredientes em um padrão 3×3; a posição decide se a receita funciona.",
  "recipeType.vanilla_shapeless": "Receita sem forma",
  "recipeType.vanilla_shapeless.summary":
    "Fabrica desde que todos os ingredientes estejam presentes, em qualquer posição.",
  "recipeType.vanilla_smelting_furnace": "Receita de fornalha",
  "recipeType.vanilla_smelting_furnace.summary":
    "Funde um único ingrediente na fornalha, com experiência e tempo ajustáveis.",
  "recipeType.vanilla_smelting_blast": "Receita de alto-forno",
  "recipeType.vanilla_smelting_blast.summary":
    "Fundição em alto-forno, normalmente para minérios e metais.",
  "recipeType.vanilla_smelting_smoker": "Receita de defumador",
  "recipeType.vanilla_smelting_smoker.summary":
    "Fundição em defumador, normalmente para comida.",
  "recipeType.vanilla_smelting_campfire": "Receita de fogueira",
  "recipeType.vanilla_smelting_campfire.summary":
    "Cozimento em fogueira, geralmente mais lento que a fornalha.",
  "recipeType.vanilla_smithing_transform": "Receita de ferraria",
  "recipeType.vanilla_smithing_transform.summary":
    "Aprimora um item base em um novo item usando molde e material adicional.",
  "recipeType.vanilla_smithing_trim": "Receita de ornamento de ferraria",
  "recipeType.vanilla_smithing_trim.summary":
    "Adiciona um ornamento à armadura; o padrão de ornamento é obrigatório.",
  "recipeType.vanilla_stonecutting": "Receita de cortador de pedra",
  "recipeType.vanilla_stonecutting.summary":
    "Corta um ingrediente no resultado usando o cortador de pedra.",
  "recipeType.vanilla_brewing": "Receita de poção",
  "recipeType.vanilla_brewing.summary":
    "Usa um ingrediente para transformar o item de entrada no suporte de poções.",
  "recipeType.anvil": "Receita de bigorna",
  "recipeType.anvil.summary":
    "Combina dois itens na bigorna, com custo em níveis ajustável.",

  "station.crafting_table": "Bancada de trabalho",
  "station.furnace": "Fornalha",
  "station.blast_furnace": "Alto-forno",
  "station.smoker": "Defumador",
  "station.campfire": "Fogueira",
  "station.smithing_table": "Bancada de ferraria",
  "station.stonecutter": "Cortador de pedra",
  "station.brewing_stand": "Suporte de poções",
  "station.anvil": "Bigorna",

  "guiSlot.gridCell": "Casa da grade",
  "guiSlot.gridPosition": "linha {row}, coluna {col}",
  "guiSlot.shapelessIngredient": "Ingrediente {index}",
  "guiSlot.ingredient": "Ingrediente",
  "guiSlot.result": "Resultado",
  "guiSlot.template": "Molde",
  "guiSlot.base": "Item base",
  "guiSlot.addition": "Material adicional",
  "guiSlot.anvilBase": "Item da esquerda",
  "guiSlot.anvilAddition": "Item da direita",
  "guiSlot.brewingInput": "Item de entrada",
  "guiSlot.brewingMiddle": "espaço central de frasco",
  "guiSlot.inertFuel":
    "O espaço de combustível é preenchido pelos jogadores; as receitas não o usam",
  "guiSlot.inertBottle":
    "Os frascos das laterais usam o mesmo item de entrada do central",

  "triggerGroup.craft": "Fabricação",
  "triggerGroup.player": "Eventos de jogador",
  "triggerGroup.entity": "Eventos de entidade",
  "triggerGroup.block": "Eventos de bloco",
  "triggerGroup.inventory": "Eventos de inventário",

  "triggerType.crafting": "Fabricação na bancada",
  "triggerType.smithing": "Fabricação na bancada de ferraria",
  "triggerType.anvil": "Combinação na bigorna",
  "triggerType.player_join": "Jogador entra",
  "triggerType.player_quit": "Jogador sai",
  "triggerType.player_death": "Morte do jogador",
  "triggerType.player_respawn": "Renascimento do jogador",
  "triggerType.player_interact": "Interação do jogador",
  "triggerType.player_advancement": "Conquista obtida",
  "triggerType.player_level_change": "Mudança de nível",
  "triggerType.player_exp_change": "Mudança de experiência",
  "triggerType.player_toggle_sneak": "Alternar agachar",
  "triggerType.player_toggle_sprint": "Alternar corrida",
  "triggerType.player_item_consume": "Consumir item",
  "triggerType.player_item_held": "Trocar item na mão",
  "triggerType.player_item_damage": "Item danificado",
  "triggerType.player_item_mend": "Item reparado",
  "triggerType.player_fish": "Pescaria",
  "triggerType.player_teleport": "Teletransporte",
  "triggerType.player_portal": "Usar portal",
  "triggerType.player_changed_world": "Trocar de mundo",
  "triggerType.player_drop_item": "Descartar item",
  "triggerType.player_pickup_item": "Coletar item",
  "triggerType.player_game_mode_change": "Mudança de modo de jogo",
  "triggerType.player_recipe_discover": "Receita desbloqueada",
  "triggerType.player_command_preprocess": "Executar comando",
  "triggerType.player_move": "Movimento do jogador",
  "triggerType.player_bed_enter": "Deitar na cama",
  "triggerType.player_bed_leave": "Sair da cama",
  "triggerType.player_swap_hand_items": "Trocar itens entre as mãos",
  "triggerType.player_edit_book": "Editar livro",
  "triggerType.player_statistic": "Mudança de estatística",
  "triggerType.player_bucket_fill": "Encher balde",
  "triggerType.player_bucket_empty": "Esvaziar balde",
  "triggerType.player_shear_entity": "Tosquiar entidade",
  "triggerType.damage_entity": "Causar dano",
  "triggerType.kill_entity": "Matar entidade",
  "triggerType.entity_shoot_bow": "Atirar com arco",
  "triggerType.entity_breed": "Reprodução de animais",
  "triggerType.entity_tame": "Domesticar animal",
  "triggerType.entity_potion_effect": "Mudança de efeito de poção",
  "triggerType.block_break": "Quebrar bloco",
  "triggerType.block_place": "Colocar bloco",
  "triggerType.inventory_click": "Clique no inventário",
  "triggerType.inventory_open": "Abrir inventário",
  "triggerType.inventory_close": "Fechar inventário",
  "triggerType.player_interact_entity": "Interagir com entidade",
  "triggerType.player_animation": "Animação do jogador",
  "triggerType.player_velocity": "Mudança de velocidade",
  "triggerType.async_player_chat": "Chat do jogador",
  "triggerType.player_take_campfire": "Pegar da fogueira",
  "triggerType.prepare_grindstone": "Preparar rebolo",
  "triggerType.trade_select": "Selecionar comércio",
  "triggerType.player_interact_at_entity": "Interação precisa com entidade",
  "triggerType.player_unleash_entity": "Soltar a corda",
  "triggerType.player_resource_pack_status": "Status do pacote de recursos",

  "issue.fileNameEmpty": "O nome do arquivo da receita não pode ficar vazio.",
  "issue.fileNameNeedsRecipeId":
    "O nome do arquivo contém caracteres inválidos. Sem recipe_id o plugin usa o nome do arquivo como ID da receita, e o carregamento falharia: use letras minúsculas, números, sublinhados, hifens e pontos, ou defina um ID de receita abaixo.",
  "issue.recipeIdPattern":
    "O ID da receita só pode usar letras minúsculas, números, sublinhados, hifens e pontos.",
  "issue.resultMissing": "O resultado (result) ainda não foi definido.",
  "issue.resultMustBeItem":
    "O resultado precisa ser um item concreto, não uma tag nem um grupo de itens.",
  "issue.gridEmpty":
    "A grade de fabricação precisa de pelo menos um ingrediente.",
  "issue.gridTooManyKinds":
    "Mais de 9 ingredientes distintos, não é possível gerar o shape.",
  "issue.shapelessEmpty":
    "Uma receita sem forma precisa de pelo menos um ingrediente.",
  "issue.shapelessTooMany":
    "Uma receita sem forma permite no máximo 9 ingredientes.",
  "issue.smeltingIngredient":
    "O ingrediente de fundição (ingredient) ainda não foi definido.",
  "issue.cookingTime": "O tempo de fundição precisa ser maior que 0 tick.",
  "issue.expNegative": "A experiência não pode ser negativa.",
  "issue.stonecuttingIngredient":
    "O ingrediente do cortador de pedra (ingredient) ainda não foi definido.",
  "issue.smithingBase": "O item base (base) ainda não foi definido.",
  "issue.smithingAddition":
    "O material adicional (addition) ainda não foi definido.",
  "issue.smithingTemplate":
    "O molde de ferraria (template) não foi definido; servidores 1.20+ normalmente exigem um.",
  "issue.trimPattern":
    "A receita de ornamento de ferraria exige um padrão de ornamento (trim_pattern).",
  "issue.brewingInput":
    "O item de entrada da poção (input) ainda não foi definido.",
  "issue.brewingIngredient":
    "O ingrediente da poção (ingredient) ainda não foi definido.",
  "issue.anvilBase": "O item da esquerda (base) ainda não foi definido.",
  "issue.anvilAddition": "O item da direita (addition) ainda não foi definido.",
  "issue.costLevelNegative": "O custo em níveis não pode ser negativo.",
  "issue.packUndefined":
    "Referencia o grupo de itens {name}, que não existe. Crie-o em Grupos de itens ou confirme que ele já existe no servidor.",
  "issue.brewingTagInput":
    "O item de entrada da poção usa uma tag. A correspondência por tag em poções depende da implementação do servidor; um item concreto é mais seguro.",
  "issue.brewingTagIngredient":
    "O ingrediente da poção usa uma tag. A correspondência por tag em poções depende da implementação do servidor; um item concreto é mais seguro.",
  "issue.packNameEmpty": "Existe um grupo de itens sem nome.",
  "issue.packNameDuplicate":
    "O nome de grupo {name} está duplicado; os últimos sobrescrevem os primeiros.",
  "issue.packNamePattern":
    "O nome de grupo {name} deveria usar apenas letras minúsculas, números, sublinhados e hifens.",
  "issue.packItemsEmpty":
    "O grupo de itens {name} não tem itens e será ignorado pelo plugin.",
  "issue.packNested":
    "O grupo de itens {name} não pode aninhar tags nem outros grupos; só itens concretos são permitidos.",
  "issue.triggerIdEmpty": "Existe um gatilho sem nome.",
  "issue.triggerIdDuplicate":
    "O ID de gatilho {name} está duplicado; os últimos sobrescrevem os primeiros.",
  "issue.triggerIdPattern":
    "O ID de gatilho {name} deveria usar apenas letras minúsculas, números, sublinhados e hifens.",
  "issue.triggerTypeMissing":
    "O gatilho {name} não tem tipo e será ignorado pelo plugin.",
  "issue.triggerNoActions":
    "O gatilho {name} não tem ações e não fará nada quando for acionado.",
  "issue.triggerCooldownNegative":
    "O tempo de recarga do gatilho {name} não pode ser negativo.",
  "issue.triggerConditionScript":
    "A linha {line} das condições do gatilho {name} tem um erro de sintaxe; o plugin não conseguirá carregá-la.",
  "issue.triggerActionScript":
    "A linha {line} das ações do gatilho {name} tem um erro de sintaxe; o plugin não conseguirá carregá-la.",

  "parse.yamlFailed": "Falha ao interpretar o YAML: {detail}",
  "parse.notRecipe":
    "Este arquivo não é uma configuração de receita (o nível superior precisa ser um mapeamento).",
  "parse.typeMissing":
    "Falta o campo type, não é possível identificar o tipo da receita.",
  "parse.typeUnsupported": "Tipo de receita não suportado: {name}",
  "parse.resultMissing":
    "Nenhum result foi lido, defina o resultado novamente.",
  "parse.shapeMissing":
    "Nenhum shape / ingredients válido foi lido, a grade continua vazia.",
  "parse.shapeCharUnmapped":
    "O caractere {name} do shape não tem ingrediente correspondente.",
  "parse.shapeTooManyRows":
    "O shape tem mais de 3 linhas, apenas as 3 primeiras foram importadas.",
  "parse.ingredientsMissing":
    "Nenhum ingredients foi lido, a lista continua vazia.",
  "parse.ingredientsTooMany":
    "Mais de 9 ingredientes, apenas os 9 primeiros foram importados.",
  "parse.amountClamped":
    "Algumas quantidades foram corrigidas: esse espaço não lê quantidades, ou o valor passou do limite {max}.",
  "parse.cookingCategoryUnknown":
    "Categoria de livro de receitas de fundição não reconhecida: {name}",
  "parse.craftingCategoryUnknown":
    "Categoria de livro de receitas de fabricação não reconhecida: {name}",
  "parse.notItemPacks":
    "Este arquivo não é uma configuração de grupos de itens (o nível superior precisa mapear nomes para listas).",
  "parse.packNotList":
    "O grupo de itens {name} não é uma lista e foi ignorado.",
  "parse.packNoItems":
    "O grupo de itens {name} não tem itens válidos e foi ignorado.",
  "parse.notTriggers":
    "Este arquivo não é uma configuração de gatilhos (o nível superior precisa mapear IDs de gatilho para configurações).",
  "parse.triggerNotMap": "O gatilho {name} não é um mapeamento e foi ignorado.",
  "parse.triggerTypeMissing": "O gatilho {name} está sem type e foi ignorado.",
};
