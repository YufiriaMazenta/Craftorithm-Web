import type { MessageKey } from "./zh_cn";

export const frFr: Record<MessageKey, string> = {
  "brand.title": "Atelier de recettes Craftorithm",
  "brand.sub": "Générez le YAML des recettes en local, sans inscription",

  "view.aria": "Espace de travail",
  "skip.toWorkbench": "Aller à l\u2019établi",
  "view.recipe": "Recette",
  "view.packs": "Groupes d'objets",
  "view.triggers": "Déclencheurs",

  "tabs.aria": "Fichiers ouverts",
  "tabs.close": "Fermer {name}",
  "tabs.newRecipe": "Nouvelle recette",
  "tabs.newTrigger": "Nouveau fichier de déclencheurs",
  "tabs.saveAsNew": "Enregistrer dans un nouvel onglet",
  "tabs.newMenu": "Autres options de création",
  "tabs.importFiles": "Importer des fichiers…",

  "start.title": "Commencer",
  "start.note": "Créez une recette ou importez des fichiers existants pour continuer.",
  "start.newRecipe": "Nouvelle recette",
  "start.importFiles": "Importer des fichiers",
  "start.importFolder": "Importer un dossier",
  "start.hint": "L'import d'un dossier détecte automatiquement recipes, item_packs.yml et triggers.",

  "action.exportAll": "Tout exporter",
  "toast.exportedZip": "{count} fichier(s) exporté(s)",
  "toast.exportEmpty": "Rien à exporter",
  "toast.savedAsNew": "Copié dans un nouvel onglet",
  "toast.importedCount": "{count} fichier(s) importé(s)",
  "toast.importSkipped": "{count} fichier(s) non reconnu(s) ignoré(s)",
  "toast.tabClosed": "{name} fermé",
  "toast.typeChangedLost": "Le changement de type a supprimé {count} ingrédients – annulation possible",

  "history.undo": "Annuler",
  "history.redo": "Rétablir",
  "history.undoOf": "Annuler {action}",
  "history.action.changeType": "le changement de type de recette",
  "history.action.reset": "la réinitialisation de la recette",
  "history.action.closeTab": "la fermeture du fichier",
  "history.action.import": "l'écrasement à l'import",
  "history.action.packEdit": "la modification du groupe d'objets",

  "step.aria": "Étapes d'édition",
  "step.type": "Type",
  "step.edit": "Édition",
  "step.export": "Export",

  "action.reset": "Réinitialiser",
  "action.resetRecipe": "Réinitialiser la recette",
  "action.importYaml": "Importer un YAML",
  "action.downloadYaml": "Télécharger le YAML",
  "action.copyClipboard": "Copier dans le presse-papiers",
  "action.close": "Fermer",
  "action.remove": "Supprimer",

  "locale.switch": "Langue",
  "theme.switch": "Apparence",
  "theme.light": "Clair",
  "theme.dark": "Sombre",

  "catalog.offline": "Catalogue d'objets hors ligne, liste intégrée utilisée",

  "footer.aria": "À propos et liens utiles",
  "footer.credit":
    "Réalisé par 氿雾, un éditeur de recettes pour le plugin Craftorithm",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Documentation",
  "footer.link.qq": "Groupe QQ",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML copié dans le presse-papiers",
  "toast.copyFailed": "Échec de la copie, sélectionnez l'aperçu manuellement",
  "toast.downloaded": "{name} téléchargé",
  "toast.saved": "{name} enregistré à l'emplacement choisi",

  "next.titleDownloaded": "{name} téléchargé – il reste deux étapes",
  "next.titleSaved": "{name} enregistré – il reste deux étapes",
  "next.step1": "Placez le fichier ici sur votre serveur (tout fichier de même nom est remplacé) :",
  "next.step2": "Exécutez ceci dans la console du serveur ou en jeu :",
  "next.step3": "Testez la recette en jeu. Si rien ne se passe, vérifiez les erreurs de chargement dans la console.",
  "next.copyPath": "Copier le chemin",
  "next.copyCommand": "Copier la commande",
  "next.pathCopied": "Chemin copié",
  "next.commandCopied": "Commande copiée",
  "next.done": "Compris",
  "toast.imported": "{name} importé",
  "toast.recipeReset": "Recette réinitialisée à vide",
  "bench.station": "Poste de travail : {name}",
  "bench.importWarnings":
    "{count} point(s) à vérifier après l'import : {detail}",
  "bench.shapelessNote":
    "Une recette sans ordre vérifie seulement la présence des ingrédients, la position n'a aucun effet.",
  "bench.inertNote":
    "Les emplacements non cliquables sont utilisés par les joueurs en jeu ; la recette n'y écrit rien.",
  "bench.guiAlt": "Interface {name}",
  "bench.resultOutside": "Résultat (la même case que dans l'interface ci-dessus)",

  "typeNav.aria": "Type de recette",

  "inspector.title": "Résultat et validation",
  "inspector.resultUnset": "Aucun résultat défini",
  "inspector.resultHint": "Cliquez sur l'emplacement de résultat de l'atelier",
  "inspector.slotUnset": "Non défini",
  "inspector.mustFix": "{count} point(s) à corriger",
  "inspector.stillTodo": "Encore {count} étape(s)",
  "inspector.ready": "La recette est complète et prête à être exportée",
  "inspector.yamlTitle": "Aperçu du YAML",
  "inspector.fixFirst":
    "Corrigez les erreurs ci-dessus pour activer le téléchargement.",

  "picker.aria": "Choisir un ingrédient : {name}",
  "picker.title": "Choisir un ingrédient · {name}",
  "picker.clearSlot": "Vider l'emplacement",
  "picker.tabsAria": "Type d'ingrédient",
  "picker.tab.item": "Objets",
  "picker.tab.tag": "Tags",
  "picker.tab.item_pack": "Groupes d'objets",
  "picker.categoryAll": "Tout",
  "picker.search.item": "Rechercher un nom ou un ID, par exemple diamond",
  "picker.search.tag": "Rechercher un tag, par exemple planks / logs",
  "picker.search.item_pack": "Rechercher un nom de groupe d'objets",
  "picker.custom.item": "ID d'objet personnalisé",
  "picker.custom.tag": "Nom de tag personnalisé",
  "picker.custom.item_pack": "Nom de groupe personnalisé",
  "picker.customPlaceholder.item": "minecraft:diamond ou oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Quantité",
  "picker.use": "Utiliser",
  "picker.loadingItems": "Chargement du catalogue d'objets {version}…",
  "picker.loadingTags": "Chargement des tags de matériaux {version}…",
  "picker.noItem":
    "Aucun résultat. Vous pouvez saisir un ID d'objet ci-dessous.",
  "picker.noTag":
    "Aucune liste de tags disponible. Saisissez un nom de tag ci-dessous, par exemple planks.",
  "picker.noPack":
    "Aucun groupe d'objets pour l'instant. Créez-en un dans l'onglet « Groupes d'objets », ou saisissez un nom ci-dessous.",
  "picker.showMore": "Afficher plus ({count} restant(s))",
  "picker.packItemCount": "{count} objet(s)",
  "picker.tagItemCount": "{count} objet(s) dans ce tag",
  "picker.packGlyph": "G",

  "slot.empty": "vide",
  "slot.item": "Objet",
  "slot.itemPack": "Groupe d'objets",
  "choice.tag": "Tag {name}",
  "choice.itemPack": "Groupe d'objets {name}",
  "badge.tag": "Tag",
  "badge.itemPack": "Groupe",

  "packs.title": "Groupes d'objets",
  "packs.note":
    "Regroupez plusieurs objets et référencez le groupe avec {code} ; n'importe lequel satisfait l'ingrédient.",
  "packs.create": "Nouveau groupe d'objets",
  "packs.import": "Importer item_packs.yml",
  "packs.empty":
    "Aucun groupe d'objets. Créez-en un pour pouvoir le choisir dans un emplacement d'ingrédient.",
  "packs.name": "Nom du groupe",
  "packs.removeGroup": "Supprimer le groupe",
  "packs.removeItem": "Retirer l'objet {index}",
  "packs.addItem": "Ajouter un objet à {name}",
  "packs.yamlEmpty": "# Aucun groupe d'objets",
  "packs.imported": "{count} groupe(s) d'objets importé(s)",
  "packs.importedWithWarnings":
    "{count} groupe(s) d'objets importé(s), {warnings} remarque(s)",

  "triggers.title": "Déclencheurs",
  "triggers.note":
    "Exécutez des actions lors d'une fabrication ou d'autres événements. Placez le fichier dans le dossier {code} du plugin.",
  "triggers.fileName": "Nom du fichier",
  "triggers.exportAs": "Exporté sous {name}.yml",
  "triggers.create": "Nouveau déclencheur",
  "triggers.import": "Importer un YAML de déclencheurs",
  "triggers.empty": "Aucun déclencheur. Créez-en un pour commencer.",
  "triggers.yamlEmpty": "# Aucun déclencheur",
  "triggers.imported": "{count} déclencheur(s) importé(s)",
  "triggers.importedWithWarnings":
    "{count} déclencheur(s) importé(s), {warnings} remarque(s)",
  "triggers.id": "ID du déclencheur",
  "triggers.type": "Type de déclencheur",
  "triggers.recipes": "Recettes ciblées (recipes)",
  "triggers.recipesHint":
    "Laissez vide pour cibler toutes les recettes de ce type. Indiquez la clé complète, par exemple craftorithm:my_sword",
  "triggers.conditions": "Conditions (conditions)",
  "triggers.mode.and": "Toutes requises",
  "triggers.mode.script": "Bloc de script",
  "triggers.conditionsHint.and":
    'Une condition par ligne, toutes doivent être vraies. Par exemple papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Écrivez le script ligne par ligne, avec vos propres return true / false.",
  "triggers.actions": "Actions (actions)",
  "triggers.actionsHint":
    'Une action par ligne, par exemple tell("&aFabrication réussie !") ou give_level(100)',
  "triggers.variables": "Variables disponibles : {list}",

  // ---- Éditeur de script ----
  "script.line": "Ligne {line}",
  "script.status.errors": "{count} erreur(s) de syntaxe",
  "script.status.warnings": "{count} remarque(s)",
  "script.hint.condition":
    "Tab complète, Ctrl+Space ouvre les suggestions. Une condition doit produire true / false.",
  "script.hint.action":
    "Tab complète, Ctrl+Space ouvre les suggestions. Une action par ligne.",
  "script.undo": "Annuler",
  "script.redo": "Rétablir",

  // Erreurs lexicales
  "script.err.unterminatedString": "Guillemet double de fermeture manquant",
  "script.err.unexpectedChar": "Caractère non reconnu",

  // Erreurs de structure
  "script.err.unclosedParen": "Parenthèse non fermée",
  "script.err.unexpectedParen": "Parenthèse fermante en trop",
  "script.err.missingEndif": "if sans endif correspondant",
  "script.err.orphanEndif": "endif sans if correspondant",
  "script.err.orphanBranch": "{keyword} sans if correspondant",
  "script.err.expectedFunctionName":
    "Un nom de fonction est attendu après les deux-points",
  "script.err.moduleCallNeedsParen":
    "Les appels de module exigent des parenthèses ; écrivez {name}(...)",
  "script.err.expectedMethodCall":
    "Un appel de méthode est attendu après le point ; écrivez .{name}(...)",
  "script.err.expectedVarName": "var doit être suivi de « nom = valeur »",

  // Noms et paramètres
  "script.err.unknownFunction": "Fonction inconnue {name}",
  "script.err.unknownModule": "Module inconnu {name}",
  "script.err.argCount":
    "{name} attend {expected} paramètre(s), {actual} fourni(s)",
  "script.err.argType":
    "Le paramètre {param} de {name} attend {expected}, mais reçoit {actual}",
  "script.err.ambiguousName":
    "{name} existe dans plusieurs modules, préférez {qualified}",
  "script.err.unknownVariable":
    "La variable {name} n'est ni déclarée ici ni fournie par ce déclencheur",

  // Remarques sémantiques
  "script.err.assignUndeclared":
    "{name} n'a pas été déclaré avec var ; il faut peut-être écrire var {name} = ...",
  "script.err.blockInAndMode":
    "En mode \"tout satisfaire\", chaque ligne doit être une condition autonome, donc {name} n'est pas autorisé ; passez au \"bloc de script\" pour les branchements ou les variables",
  "script.err.queryInAction":
    "{name} lit seulement une valeur, il faut peut-être l'englober dans un if",
  "script.err.notBoolean": "Cette ligne ne produit pas true / false",

  // Descriptions des fonctions, clé script.fn.<module>.<name>
  "script.fn.actions.command":
    "Exécuter une commande en tant que joueur. Plusieurs arguments sont concaténés",
  "script.fn.actions.console":
    "Exécuter une commande en tant que console. Plusieurs arguments sont concaténés",
  "script.fn.actions.tell":
    "Envoyer un message dans le chat du joueur. Plusieurs arguments sont concaténés",
  "script.fn.actions.actionbar":
    "Afficher un message au-dessus de la barre d'objets. Plusieurs arguments sont concaténés",
  "script.fn.actions.title": "Afficher un titre et un sous-titre",
  "script.fn.actions.log":
    "Écrire dans le journal du serveur. Plusieurs arguments sont concaténés",
  "script.fn.actions.take_level": "Retirer des niveaux au joueur",
  "script.fn.actions.give_level": "Donner des niveaux au joueur",
  "script.fn.actions.give_exp": "Donner des points d'expérience",
  "script.fn.actions.close": "Fermer l'interface actuelle",
  "script.fn.actions.back": "Revenir au menu précédent",
  "script.fn.actions.openmenu": "Ouvrir un menu personnalisé",
  "script.fn.actions.discover_recipe": "Débloquer une recette",
  "script.fn.actions.undiscover_recipe": "Verrouiller une recette",
  "script.fn.actions.sound": "Jouer un son",
  "script.fn.actions.set_inv_item":
    "Définir l'objet d'un emplacement de l'interface",
  "script.fn.conditions.perm": "Vérifier si le joueur a une permission",
  "script.fn.conditions.papi": "Lire une valeur PlaceholderAPI",
  "script.fn.conditions.level": "Lire le niveau du joueur",
  "script.fn.conditions.world":
    "Lire le nom du monde, ou le comparer si un paramètre est fourni",
  "script.fn.conditions.gamemode":
    "Lire le mode de jeu, ou le comparer si un paramètre est fourni",
  "script.fn.conditions.item":
    "Vérifier si l'objet de l'événement correspond à un ID",
  "script.fn.conditions.biome":
    "Lire le biome, ou le comparer si un paramètre est fourni",
  "script.fn.conditions.in_water": "Vérifier si le joueur est dans l'eau",
  "script.fn.conditions.in_rain": "Vérifier si le joueur est sous la pluie",
  "script.fn.conditions.light_level":
    "Lire le niveau de lumière du bloc occupé",
  "script.fn.math.abs": "Valeur absolue",
  "script.fn.math.min": "Plus petite valeur",
  "script.fn.math.max": "Plus grande valeur",
  "script.fn.math.round": "Arrondir au plus proche",
  "script.fn.math.floor": "Arrondir à l'inférieur",
  "script.fn.math.ceil": "Arrondir au supérieur",
  "script.fn.math.sqrt": "Racine carrée",
  "script.fn.math.pow": "Élever à une puissance",
  "script.fn.math.random":
    "Nombre aléatoire. Sans argument c'est 0~1, un argument est la borne supérieure, deux sont min~max",
  "script.fn.math.random_int":
    "Entier aléatoire. Un argument est la borne supérieure, deux sont min~max",
  "script.fn.math.int": "Convertir en entier",
  "script.fn.math.float": "Convertir en nombre à virgule",
  "script.fn.vault.money": "Lire le solde du joueur (Vault)",
  "script.fn.vault.take_money": "Retirer du solde (Vault)",
  "script.fn.vault.give_money": "Ajouter au solde (Vault)",
  "script.fn.vault_unlocked.money":
    "Lire le solde du joueur (VaultUnlocked). Sans devise, la devise par défaut est utilisée",
  "script.fn.vault_unlocked.take_money":
    "Retirer du solde (VaultUnlocked). Sans devise, la devise par défaut est utilisée",
  "script.fn.vault_unlocked.give_money":
    "Ajouter au solde (VaultUnlocked). Sans devise, la devise par défaut est utilisée",
  "script.fn.playerpoints.points": "Lire les points du joueur",
  "script.fn.playerpoints.take_points": "Retirer des points",
  "script.fn.playerpoints.give_points": "Ajouter des points",
  "script.fn.obj.get":
    "Lire un champ de l'objet, écrit habituellement x.get(\"champ\")",
  "script.fn.obj.set":
    "Écrire un champ de l'objet, écrit habituellement x.set(\"champ\", valeur)",
  "script.fn.obj.invoke":
    "Appeler une méthode de l'objet, écrit habituellement x.invoke(\"méthode\", args...)",
  // delay n'a pas d'espace de noms, seulement le nom court : clé script.fn.delay
  "script.fn.delay": "Attendre le nombre de ticks indiqué, puis continuer",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if":
    "Exécute les instructions suivantes si la condition est vraie",
  "script.kw.elseif": "Teste une autre condition si la précédente est fausse",
  "script.kw.else": "S'exécute si aucune condition précédente n'est vraie",
  "script.kw.endif": "Ferme le bloc if",
  "script.kw.return": "Termine le script et renvoie une valeur",
  "script.kw.var": "Déclare une variable, écrit var nom = valeur",
  "script.kw.true": "Valeur booléenne vraie",
  "script.kw.false": "Valeur booléenne fausse",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Actions qui agissent sur le joueur et le monde",
  "script.module.conditions":
    "Vérifications qui lisent l'état du joueur et de l'environnement",
  "script.module.math": "Opérations mathématiques et nombres aléatoires",
  "script.module.vault": "Interface économique (nécessite Vault)",
  "script.module.vault_unlocked":
    "Interface économique multidevise (nécessite VaultUnlocked)",
  "script.module.playerpoints": "Interface de points (nécessite PlayerPoints)",
  "script.module.obj":
    "Accès par réflexion aux champs et méthodes d'un objet",
  "script.complete.returns": "Renvoie",
  "triggers.priority": "Priorité (priority)",
  "triggers.priorityHint": "Les petits nombres passent en premier",
  "triggers.cooldown": "Temps de recharge (secondes)",
  "triggers.cooldownHint": "0 signifie aucune limite",
  "triggers.enabled": "Activé",
  "triggers.disabled": "Désactivé",
  "triggers.perPlayer": "Recharge par joueur",
  "triggers.shared": "Recharge partagée sur le serveur",

  "fields.section": "Paramètres de la recette",
  "fields.fileName": "Nom du fichier de recette",
  "fields.exportAs": "Exporté sous {name}.yml",
  "fields.recipeId": "ID de la recette (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "Laissez vide pour que le plugin utilise le nom du fichier comme ID de recette",
  "fields.recipeIdRequiredHint":
    "Le nom du fichier ne peut pas servir d'ID de recette, il faut le saisir ici",
  "fields.group": "Groupe de recettes (group)",
  "fields.groupPlaceholder": "Laissez vide pour aucun groupe",
  "fields.groupHint":
    "Les recettes d'un même groupe sont regroupées dans le livre de recettes",
  "fields.exp": "Expérience gagnée (exp)",
  "fields.time": "Durée de cuisson (time)",
  "fields.timeHint": "En ticks, 20 ticks = 1 seconde",
  "fields.costLevel": "Niveaux requis (cost_level)",
  "fields.trimPattern": "Motif d'ornement (trim_pattern)",
  "fields.bookCategory": "Catégorie du livre de recettes",
  "fields.bookCategoryHint": "Nécessite un serveur 1.19.3+",
  "fields.unspecified": "Non précisé",
  "fields.previewSection": "Faux résultat (facultatif)",
  "fields.previewSlot": "Faux résultat",
  "fields.previewLabel": "Objet du faux résultat",
  "fields.previewHint":
    "L'emplacement de résultat affiche cet objet pour masquer le vrai produit ; le joueur récupère quand même le résultat réel. Laissez vide pour ne pas écrire fake_result_preview.",
  "fields.copySection": "Règles de conservation des composants (facultatif)",
  "fields.copyHint":
    "Les composants sélectionnés sont copiés de l'objet d'entrée vers le résultat, via copy_components_rules.",
  "fields.copySince": "{name} (nécessite {since})",
  "fields.removeRule": "Retirer {name}",

  "category.crafting.building": "Blocs de construction",
  "category.crafting.redstone": "Objets en redstone",
  "category.crafting.equipment": "Équipement",
  "category.crafting.misc": "Divers",
  "category.cooking.food": "Nourriture",
  "category.cooking.blocks": "Blocs",
  "category.cooking.misc": "Divers",

  "copyRule.all": "Tous les composants",
  "copyRule.enchantments": "Enchantements",
  "copyRule.attributes": "Attributs",
  "copyRule.display_name": "Nom affiché",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Données de modèle",
  "copyRule.item_flag": "Marqueurs d'objet",
  "copyRule.unbreakable": "Indestructible",
  "copyRule.trim": "Ornement d'armure",
  "copyRule.food": "Nourriture",
  "copyRule.max_stack_size": "Taille de pile maximale",
  "copyRule.rarity": "Rareté",
  "copyRule.fire_resistance": "Résistance au feu",
  "copyRule.hide_tooltip": "Masquer l'infobulle",
  "copyRule.item_name": "Nom de l'objet",
  "copyRule.tool": "Outil",
  "copyRule.item_model": "Modèle d'objet",
  "copyRule.custom_model_data_component": "Composant de données de modèle",

  "itemCategory.building": "Construction",
  "itemCategory.ore": "Minerais",
  "itemCategory.tool": "Outils",
  "itemCategory.combat": "Combat",
  "itemCategory.food": "Nourriture",
  "itemCategory.redstone": "Redstone",
  "itemCategory.brewing": "Alchimie",
  "itemCategory.misc": "Divers",

  "recipeGroup.crafting": "Fabrication",
  "recipeGroup.smelting": "Cuisson",
  "recipeGroup.smithing": "Forge",
  "recipeGroup.processing": "Transformation",

  "recipeType.vanilla_shaped": "Recette ordonnée",
  "recipeType.vanilla_shaped.summary":
    "Disposez les ingrédients selon une forme 3×3 ; la position détermine la fabrication.",
  "recipeType.vanilla_shapeless": "Recette sans ordre",
  "recipeType.vanilla_shapeless.summary":
    "Se fabrique dès que tous les ingrédients sont présents, peu importe la position.",
  "recipeType.vanilla_smelting_furnace": "Recette de four",
  "recipeType.vanilla_smelting_furnace.summary":
    "Cuire un ingrédient dans un four, avec expérience et durée réglables.",
  "recipeType.vanilla_smelting_blast": "Recette de haut fourneau",
  "recipeType.vanilla_smelting_blast.summary":
    "Cuisson au haut fourneau, en général pour les minerais et les métaux.",
  "recipeType.vanilla_smelting_smoker": "Recette de fumoir",
  "recipeType.vanilla_smelting_smoker.summary":
    "Cuisson au fumoir, en général pour la nourriture.",
  "recipeType.vanilla_smelting_campfire": "Recette de feu de camp",
  "recipeType.vanilla_smelting_campfire.summary":
    "Cuisson au feu de camp, en général plus lente qu'au four.",
  "recipeType.vanilla_smithing_transform": "Recette de forge",
  "recipeType.vanilla_smithing_transform.summary":
    "Améliorer un objet de base en un nouvel objet avec un modèle et un matériau.",
  "recipeType.vanilla_smithing_trim": "Recette d'ornement",
  "recipeType.vanilla_smithing_trim.summary":
    "Ajouter un ornement à une armure ; le motif d'ornement est obligatoire.",
  "recipeType.vanilla_stonecutting": "Recette de taille de pierre",
  "recipeType.vanilla_stonecutting.summary":
    "Tailler un ingrédient en un résultat avec le tailleur de pierre.",
  "recipeType.vanilla_brewing": "Recette d'alchimie",
  "recipeType.vanilla_brewing.summary":
    "Utiliser un ingrédient pour transformer l'objet d'entrée dans un alambic.",
  "recipeType.anvil": "Recette d'enclume",
  "recipeType.anvil.summary":
    "Combiner deux objets sur une enclume, avec un coût en niveaux réglable.",

  "station.crafting_table": "Table de craft",
  "station.furnace": "Four",
  "station.blast_furnace": "Haut fourneau",
  "station.smoker": "Fumoir",
  "station.campfire": "Feu de camp",
  "station.smithing_table": "Table de forge",
  "station.stonecutter": "Tailleur de pierre",
  "station.brewing_stand": "Alambic",
  "station.anvil": "Enclume",

  "guiSlot.gridCell": "Case de la grille",
  "guiSlot.gridPosition": "ligne {row}, colonne {col}",
  "guiSlot.shapelessIngredient": "Ingrédient {index}",
  "guiSlot.ingredient": "Ingrédient",
  "guiSlot.result": "Résultat",
  "guiSlot.template": "Modèle",
  "guiSlot.base": "Objet de base",
  "guiSlot.addition": "Matériau additionnel",
  "guiSlot.anvilBase": "Objet de gauche",
  "guiSlot.anvilAddition": "Objet de droite",
  "guiSlot.brewingInput": "Objet d'entrée",
  "guiSlot.brewingMiddle": "flacon du milieu",
  "guiSlot.inertFuel":
    "L'emplacement de combustible est rempli par les joueurs ; la recette ne l'utilise pas",
  "guiSlot.inertBottle":
    "Les flacons latéraux et celui du milieu utilisent le même objet d'entrée",

  "triggerGroup.craft": "Fabrication",
  "triggerGroup.player": "Événements du joueur",
  "triggerGroup.entity": "Événements d'entité",
  "triggerGroup.block": "Événements de bloc",
  "triggerGroup.inventory": "Événements d'inventaire",

  "triggerType.crafting": "Fabrication à la table de craft",
  "triggerType.smithing": "Forge à la table de forge",
  "triggerType.anvil": "Combinaison à l'enclume",
  "triggerType.player_join": "Connexion du joueur",
  "triggerType.player_quit": "Déconnexion du joueur",
  "triggerType.player_death": "Mort du joueur",
  "triggerType.player_respawn": "Réapparition du joueur",
  "triggerType.player_interact": "Interaction du joueur",
  "triggerType.player_advancement": "Progrès obtenu",
  "triggerType.player_level_change": "Changement de niveau",
  "triggerType.player_exp_change": "Changement d'expérience",
  "triggerType.player_toggle_sneak": "Accroupissement",
  "triggerType.player_toggle_sprint": "Course",
  "triggerType.player_item_consume": "Consommation d'un objet",
  "triggerType.player_item_held": "Changement d'objet en main",
  "triggerType.player_item_damage": "Objet endommagé",
  "triggerType.player_item_mend": "Objet réparé",
  "triggerType.player_fish": "Pêche",
  "triggerType.player_teleport": "Téléportation",
  "triggerType.player_portal": "Passage d'un portail",
  "triggerType.player_changed_world": "Changement de monde",
  "triggerType.player_drop_item": "Objet jeté",
  "triggerType.player_pickup_item": "Objet ramassé",
  "triggerType.player_game_mode_change": "Changement de mode de jeu",
  "triggerType.player_recipe_discover": "Recette débloquée",
  "triggerType.player_command_preprocess": "Commande exécutée",
  "triggerType.player_move": "Déplacement du joueur",
  "triggerType.player_bed_enter": "Entrée dans un lit",
  "triggerType.player_bed_leave": "Sortie du lit",
  "triggerType.player_swap_hand_items": "Échange des mains",
  "triggerType.player_edit_book": "Édition d'un livre",
  "triggerType.player_statistic": "Changement de statistique",
  "triggerType.player_bucket_fill": "Remplissage d'un seau",
  "triggerType.player_bucket_empty": "Vidage d'un seau",
  "triggerType.player_shear_entity": "Tonte d'une entité",
  "triggerType.damage_entity": "Dégâts infligés",
  "triggerType.kill_entity": "Entité tuée",
  "triggerType.entity_shoot_bow": "Tir à l'arc",
  "triggerType.entity_breed": "Reproduction d'animaux",
  "triggerType.entity_tame": "Apprivoisement d'un animal",
  "triggerType.entity_potion_effect": "Changement d'effet de potion",
  "triggerType.block_break": "Bloc cassé",
  "triggerType.block_place": "Bloc placé",
  "triggerType.inventory_click": "Clic dans un inventaire",
  "triggerType.inventory_open": "Ouverture d'un inventaire",
  "triggerType.inventory_close": "Fermeture d'un inventaire",

  "issue.fileNameEmpty": "Le nom du fichier de recette ne peut pas être vide.",
  "issue.fileNameNeedsRecipeId":
    "Le nom du fichier contient des caractères interdits. Sans recipe_id, le plugin utilise le nom du fichier comme ID de recette et le chargement échouerait : utilisez des minuscules, des chiffres, des tirets bas, des traits d'union et des points, ou saisissez un ID de recette ci-dessous.",
  "issue.recipeIdPattern":
    "L'ID de recette n'accepte que des minuscules, des chiffres, des tirets bas, des traits d'union et des points.",
  "issue.resultMissing": "Aucun résultat défini (result).",
  "issue.resultMustBeItem":
    "Le résultat doit être un objet précis, pas un tag ni un groupe d'objets.",
  "issue.gridEmpty":
    "La grille de fabrication doit contenir au moins un ingrédient.",
  "issue.gridTooManyKinds":
    "Plus de 9 ingrédients différents, impossible de générer shape.",
  "issue.shapelessEmpty":
    "Une recette sans ordre exige au moins un ingrédient.",
  "issue.shapelessTooMany":
    "Une recette sans ordre accepte au maximum 9 ingrédients.",
  "issue.smeltingIngredient":
    "Aucun ingrédient de cuisson défini (ingredient).",
  "issue.cookingTime": "La durée de cuisson doit être supérieure à 0 tick.",
  "issue.expNegative": "L'expérience ne peut pas être négative.",
  "issue.stonecuttingIngredient":
    "Aucun ingrédient de taille défini (ingredient).",
  "issue.smithingBase": "Aucun objet de base défini (base).",
  "issue.smithingAddition": "Aucun matériau additionnel défini (addition).",
  "issue.smithingTemplate":
    "Aucun modèle de forge défini (template) ; les serveurs 1.20+ en ont généralement besoin.",
  "issue.trimPattern":
    "Une recette d'ornement doit préciser un motif d'ornement (trim_pattern).",
  "issue.brewingInput": "Aucun objet d'entrée d'alchimie défini (input).",
  "issue.brewingIngredient": "Aucun ingrédient d'alchimie défini (ingredient).",
  "issue.anvilBase": "Aucun objet de gauche défini (base).",
  "issue.anvilAddition": "Aucun objet de droite défini (addition).",
  "issue.costLevelNegative": "Le coût en niveaux ne peut pas être négatif.",
  "issue.packUndefined":
    "Référence au groupe d'objets non défini {name} : créez-le dans « Groupes d'objets », ou vérifiez qu'il existe sur le serveur.",
  "issue.brewingTagInput":
    "L'objet d'entrée d'alchimie utilise un tag ; la correspondance par tag en alchimie dépend de l'implémentation du serveur, un objet précis est plus sûr.",
  "issue.brewingTagIngredient":
    "L'ingrédient d'alchimie utilise un tag ; la correspondance par tag en alchimie dépend de l'implémentation du serveur, un objet précis est plus sûr.",
  "issue.packNameEmpty": "Il existe un groupe d'objets sans nom.",
  "issue.packNameDuplicate":
    "Le nom de groupe {name} est en doublon ; les suivants écrasent les précédents.",
  "issue.packNamePattern":
    "Le nom de groupe {name} devrait n'utiliser que des minuscules, des chiffres, des tirets bas et des traits d'union.",
  "issue.packItemsEmpty":
    "Le groupe d'objets {name} est vide, le plugin l'ignorera.",
  "issue.packNested":
    "Le groupe d'objets {name} ne peut pas contenir de tags ni d'autres groupes, seulement des objets précis.",
  "issue.triggerIdEmpty": "Il existe un déclencheur sans nom.",
  "issue.triggerIdDuplicate":
    "L'ID de déclencheur {name} est en doublon ; les suivants écrasent les précédents.",
  "issue.triggerIdPattern":
    "L'ID de déclencheur {name} devrait n'utiliser que des minuscules, des chiffres, des tirets bas et des traits d'union.",
  "issue.triggerTypeMissing":
    "Le déclencheur {name} n'a pas de type, le plugin l'ignorera.",
  "issue.triggerNoActions":
    "Le déclencheur {name} n'a aucune action et ne produira aucun effet.",
  "issue.triggerCooldownNegative":
    "Le temps de recharge du déclencheur {name} ne peut pas être négatif.",
  "issue.triggerConditionScript":
    "La ligne {line} des conditions du déclencheur {name} contient une erreur de syntaxe ; le plugin ne pourra pas la charger.",
  "issue.triggerActionScript":
    "La ligne {line} des actions du déclencheur {name} contient une erreur de syntaxe ; le plugin ne pourra pas la charger.",

  "parse.yamlFailed": "Échec de l'analyse du YAML : {detail}",
  "parse.notRecipe":
    "Ce fichier n'est pas une configuration de recette (le niveau supérieur doit être une paire clé-valeur).",
  "parse.typeMissing":
    "Champ type absent, impossible de déterminer le type de recette.",
  "parse.typeUnsupported": "Type de recette non pris en charge : {name}",
  "parse.resultMissing": "Aucun result lu, redéfinissez le résultat.",
  "parse.shapeMissing":
    "Aucun shape / ingredients valide lu, la grille reste vide.",
  "parse.shapeCharUnmapped":
    "Le caractère {name} de shape n'a aucun ingrédient associé.",
  "parse.shapeTooManyRows":
    "shape dépasse 3 lignes, seules les 3 premières sont importées.",
  "parse.ingredientsMissing":
    "Aucun ingredients lu, la liste des ingrédients reste vide.",
  "parse.ingredientsTooMany":
    "Plus de 9 ingrédients, seuls les 9 premiers sont importés.",
  "parse.amountClamped":
    "Certaines quantités ont été corrigées : cet emplacement ne lit pas les quantités, ou la valeur dépassait la limite {max}.",
  "parse.cookingCategoryUnknown":
    "Catégorie de livre de recettes de cuisson non reconnue : {name}",
  "parse.craftingCategoryUnknown":
    "Catégorie de livre de recettes de fabrication non reconnue : {name}",
  "parse.notItemPacks":
    "Ce fichier n'est pas une configuration de groupes d'objets (le niveau supérieur doit associer des noms à des listes).",
  "parse.packNotList":
    "La valeur du groupe d'objets {name} n'est pas une liste, il a été ignoré.",
  "parse.packNoItems":
    "Le groupe d'objets {name} n'a aucun objet valide, il a été ignoré.",
  "parse.notTriggers":
    "Ce fichier n'est pas une configuration de déclencheurs (le niveau supérieur doit associer des ID à des configurations).",
  "parse.triggerNotMap":
    "Le contenu du déclencheur {name} n'est pas une paire clé-valeur, il a été ignoré.",
  "parse.triggerTypeMissing":
    "Le déclencheur {name} n'a pas de type, il a été ignoré.",
};
