import type { MessageKey } from "./zh_cn";

export const deDe: Record<MessageKey, string> = {
  "brand.title": "Craftorithm Rezept-Werkstatt",
  "brand.sub": "Plugin-Rezept-YAML lokal erzeugen, ohne Anmeldung",

  "view.aria": "Arbeitsbereich",
  "skip.toWorkbench": "Zur Werkbank springen",
  "view.recipe": "Rezept",
  "view.packs": "Gegenstandsgruppen",
  "view.triggers": "Auslöser",

  "tabs.aria": "Geöffnete Dateien",
  "tabs.close": "{name} schließen",
  "tabs.newRecipe": "Neues Rezept",
  "tabs.newTrigger": "Neue Trigger-Datei",
  "tabs.saveAsNew": "Als neuen Tab speichern",
  "tabs.newMenu": "Weitere Optionen zum Anlegen",
  "tabs.importFiles": "Dateien importieren …",

  "start.title": "Loslegen",
  "start.note": "Erstelle ein Rezept oder importiere vorhandene Dateien, um weiterzuarbeiten.",
  "start.newRecipe": "Neues Rezept",
  "start.importFiles": "Dateien importieren",
  "start.importFolder": "Ordner importieren",
  "start.hint": "Beim Import eines Ordners werden recipes, item_packs.yml und triggers automatisch erkannt.",

  "action.exportAll": "Alles exportieren",
  "toast.exportedZip": "{count} Datei(en) exportiert",
  "toast.exportEmpty": "Nichts zu exportieren",
  "toast.savedAsNew": "In neuen Tab kopiert",
  "toast.importedCount": "{count} Datei(en) importiert",
  "toast.importSkipped": "{count} unbekannte Datei(en) übersprungen",
  "toast.tabClosed": "{name} geschlossen",
  "toast.typeChangedLost": "Der Typwechsel hat {count} Zutaten entfernt – rückgängig möglich",

  "history.undo": "Rückgängig",
  "history.redo": "Wiederholen",
  "history.undoOf": "{action} rückgängig machen",
  "history.action.changeType": "Rezepttyp-Wechsel",
  "history.action.reset": "Rezept-Reset",
  "history.action.closeTab": "Schließen der Datei",
  "history.action.import": "Überschreiben beim Import",
  "history.action.packEdit": "Item-Pack-Änderung",

  "step.aria": "Bearbeitungsschritte",
  "step.type": "Typ",
  "step.edit": "Bearbeiten",
  "step.export": "Exportieren",

  "action.reset": "Zurücksetzen",
  "action.resetRecipe": "Rezept zurücksetzen",
  "action.importYaml": "YAML importieren",
  "action.downloadYaml": "YAML herunterladen",
  "action.copyClipboard": "In die Zwischenablage kopieren",
  "action.close": "Schließen",
  "action.remove": "Entfernen",

  "locale.switch": "Sprache",
  "theme.switch": "Erscheinungsbild",
  "theme.light": "Hell",
  "theme.dark": "Dunkel",

  "catalog.offline":
    "Gegenstandsliste offline, integrierte Liste wird verwendet",

  "footer.aria": "Über und verwandte Links",
  "footer.credit":
    "Erstellt von 氿雾 · ein Rezept-Editor für das Craftorithm-Plugin",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Dokumentation",
  "footer.link.qq": "QQ-Gruppe",
  "footer.link.discord": "Discord",

  "toast.copied": "YAML in die Zwischenablage kopiert",
  "toast.copyFailed":
    "Kopieren fehlgeschlagen, bitte die Vorschau manuell markieren",
  "toast.downloaded": "{name} heruntergeladen",
  "toast.saved": "{name} am gewählten Ort gespeichert",

  "next.titleDownloaded": "{name} heruntergeladen – zwei Schritte fehlen noch",
  "next.titleSaved": "{name} gespeichert – zwei Schritte fehlen noch",
  "next.step1": "Lege die Datei auf dem Server hierhin (gleichnamige Datei wird überschrieben):",
  "next.step2": "Führe das in der Serverkonsole oder im Spiel aus:",
  "next.step3": "Probiere das Rezept im Spiel aus. Passiert nichts, prüfe die Konsole auf Ladefehler.",
  "next.copyPath": "Pfad kopieren",
  "next.copyCommand": "Befehl kopieren",
  "next.pathCopied": "Pfad kopiert",
  "next.commandCopied": "Befehl kopiert",
  "next.done": "Verstanden",
  "toast.imported": "{name} importiert",
  "toast.recipeReset": "Auf ein leeres Rezept zurückgesetzt",
  "bench.station": "Station: {name}",
  "bench.importWarnings": "{count} Stelle(n) nach dem Import prüfen: {detail}",
  "bench.shapelessNote":
    "Formlose Rezepte prüfen nur, ob alle Zutaten vorhanden sind; die Anordnung spielt keine Rolle.",
  "bench.inertNote":
    "Nicht anklickbare Plätze werden im Spiel von Spielern belegt; das Rezept schreibt sie nicht.",
  "bench.guiAlt": "{name}-Oberfläche",
  "bench.resultOutside": "Ergebnis (dasselbe Feld wie in der Oberfläche oben)",

  "typeNav.aria": "Rezepttyp",

  "inspector.title": "Ergebnis und Prüfung",
  "inspector.resultUnset": "Noch kein Ergebnis festgelegt",
  "inspector.resultHint": "Den Ergebnisplatz auf der Werkbank anklicken",
  "inspector.slotUnset": "Leer",
  "inspector.mustFix": "{count} Stelle(n) müssen behoben werden",
  "inspector.stillTodo": "Noch {count} Schritt(e) offen",
  "inspector.ready": "Rezept ist vollständig und kann exportiert werden",
  "inspector.yamlTitle": "YAML-Vorschau",
  "inspector.fixFirst": "Behebe die Fehler oben, um den Download freizugeben.",

  "picker.aria": "Zutat auswählen: {name}",
  "picker.title": "Zutat auswählen · {name}",
  "picker.clearSlot": "Platz leeren",
  "picker.tabsAria": "Zutatentyp",
  "picker.tab.item": "Gegenstände",
  "picker.tab.tag": "Tags",
  "picker.tab.item_pack": "Gegenstandsgruppen",
  "picker.categoryAll": "Alle",
  "picker.search.item": "Nach Name oder ID suchen, z. B. diamond",
  "picker.search.tag": "Tags suchen, z. B. planks / logs",
  "picker.search.item_pack": "Namen von Gegenstandsgruppen suchen",
  "picker.custom.item": "Eigene Gegenstands-ID",
  "picker.custom.tag": "Eigener Tag-Name",
  "picker.custom.item_pack": "Eigener Gruppenname",
  "picker.customPlaceholder.item": "minecraft:diamond oder oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Anzahl",
  "picker.use": "Verwenden",
  "picker.loadingItems": "Gegenstandsliste für {version} wird geladen…",
  "picker.loadingTags": "Gegenstands-Tags für {version} werden geladen…",
  "picker.noItem":
    "Keine Treffer. Du kannst unten eine Gegenstands-ID eintragen.",
  "picker.noTag":
    "Keine Tag-Liste verfügbar. Du kannst unten einen Tag-Namen eintragen, z. B. planks.",
  "picker.noPack":
    "Noch keine Gegenstandsgruppen. Erstelle eine im Tab „Gegenstandsgruppen“ oder trage unten einen Namen ein.",
  "picker.showMore": "Mehr anzeigen (noch {count})",
  "picker.packItemCount": "{count} Gegenstand/Gegenstände",
  "picker.tagItemCount": "{count} Gegenstand/Gegenstände in diesem Tag",
  "picker.packGlyph": "G",

  "slot.empty": "leer",
  "slot.item": "Gegenstand",
  "slot.itemPack": "Gegenstandsgruppe",
  "choice.tag": "Tag {name}",
  "choice.itemPack": "Gegenstandsgruppe {name}",
  "badge.tag": "Tag",
  "badge.itemPack": "Gegenstandsgruppe",

  "packs.title": "Gegenstandsgruppen",
  "packs.note":
    "Fasse mehrere Gegenstände zu einer Gruppe zusammen und verweise im Rezept mit {code} darauf; jeder davon erfüllt die Zutat.",
  "packs.create": "Neue Gegenstandsgruppe",
  "packs.import": "item_packs.yml importieren",
  "packs.empty":
    "Noch keine Gegenstandsgruppen. Erstelle eine, dann kannst du sie in jedem Zutatenplatz auswählen.",
  "packs.name": "Gruppenname",
  "packs.removeGroup": "Gruppe löschen",
  "packs.removeItem": "Gegenstand {index} entfernen",
  "packs.addItem": "Gegenstand zu {name} hinzufügen",
  "packs.yamlEmpty": "# Noch keine Gegenstandsgruppen",
  "packs.imported": "{count} Gegenstandsgruppe(n) importiert",
  "packs.importedWithWarnings":
    "{count} Gegenstandsgruppe(n) importiert, {warnings} Hinweis(e)",

  "triggers.title": "Auslöser",
  "triggers.note":
    "Aktionen ausführen, wenn Herstellung oder andere Ereignisse stattfinden. Lege die Datei in den Plugin-Ordner {code}.",
  "triggers.fileName": "Dateiname",
  "triggers.exportAs": "Export als {name}.yml",
  "triggers.create": "Neuer Auslöser",
  "triggers.import": "Auslöser-YAML importieren",
  "triggers.empty": "Noch keine Auslöser. Erstelle einen, um zu beginnen.",
  "triggers.yamlEmpty": "# Noch keine Auslöser",
  "triggers.imported": "{count} Auslöser importiert",
  "triggers.importedWithWarnings":
    "{count} Auslöser importiert, {warnings} Hinweis(e)",
  "triggers.id": "Auslöser-ID",
  "triggers.type": "Auslösertyp",
  "triggers.recipes": "Rezeptfilter (recipes)",
  "triggers.recipesHint":
    "Leer lassen, um alle Rezepte dieser Art zu erfassen. Vollständigen Rezept-Key angeben, z. B. craftorithm:my_sword",
  "triggers.conditions": "Bedingungen (conditions)",
  "triggers.mode.and": "Alle müssen zutreffen",
  "triggers.mode.script": "Skriptblock",
  "triggers.conditionsHint.and":
    'Eine Bedingung pro Zeile, alle müssen gelten. z. B. papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Das Skript Zeile für Zeile schreiben und selbst return true / false zurückgeben.",
  "triggers.actions": "Aktionen (actions)",
  "triggers.actionsHint":
    'Eine Aktion pro Zeile, z. B. tell("&aHergestellt!") oder give_level(100)',
  "triggers.variables": "Verfügbare Variablen: {list}",

  // ---- Skript-Editor ----
  "script.line": "Zeile {line}",
  "script.status.errors": "{count} Syntaxfehler",
  "script.status.warnings": "{count} Hinweis(e)",
  "script.hint.condition":
    "Tab vervollständigt, Ctrl+Space öffnet Vorschläge. Bedingungen müssen true / false ergeben.",
  "script.hint.action":
    "Tab vervollständigt, Ctrl+Space öffnet Vorschläge. Eine Aktion pro Zeile.",
  "script.undo": "Rückgängig",
  "script.redo": "Wiederholen",

  // Lexikalische Fehler
  "script.err.unterminatedString":
    "Der Zeichenkette fehlt das schließende Anführungszeichen",
  "script.err.unexpectedChar": "Unbekanntes Zeichen",

  // Strukturfehler
  "script.err.unclosedParen": "Klammer ist nicht geschlossen",
  "script.err.unexpectedParen": "Überzählige schließende Klammer",
  "script.err.missingEndif": "if fehlt das passende endif",
  "script.err.orphanEndif": "endif hat kein passendes if",
  "script.err.orphanBranch": "{keyword} hat kein passendes if",
  "script.err.expectedFunctionName":
    "Nach dem Doppelpunkt wird ein Funktionsname erwartet",
  "script.err.moduleCallNeedsParen":
    "Modulaufrufe brauchen Klammern; schreibe {name}(...)",
  "script.err.expectedMethodCall":
    "Nach dem Punkt wird ein Methodenaufruf erwartet; schreibe .{name}(...)",
  "script.err.expectedVarName": "Nach var wird \"Name = Wert\" erwartet",

  // Namen und Parameter
  "script.err.unknownFunction": "Unbekannte Funktion {name}",
  "script.err.unknownModule": "Unbekanntes Modul {name}",
  "script.err.argCount":
    "{name} erwartet {expected} Parameter, tatsächlich {actual}",
  "script.err.argType":
    "Parameter {param} von {name} erwartet {expected}, tatsächlich {actual}",
  "script.err.ambiguousName":
    "{name} kommt in mehreren Modulen vor, besser {qualified} schreiben",
  "script.err.unknownVariable":
    "Variable {name} ist weder deklariert noch wird sie von diesem Auslöser bereitgestellt",

  // Semantische Hinweise
  "script.err.assignUndeclared":
    "{name} wurde nicht mit var deklariert; vielleicht ist var {name} = ... gemeint",
  "script.err.blockInAndMode":
    "Im Modus \"Alle erfüllen\" muss jede Zeile eine eigenständige Bedingung sein, {name} ist daher nicht erlaubt; für Verzweigungen oder Variablen zu \"Skriptblock\" wechseln",
  "script.err.queryInAction":
    "{name} liest nur einen Wert, muss vielleicht in ein if",
  "script.err.notBoolean": "Diese Zeile ergibt kein true / false",

  // Funktionsbeschreibungen, Schlüsselname ist script.fn.<module>.<name>
  "script.fn.actions.command":
    "Befehl als Spieler ausführen. Mehrere Argumente werden aneinandergehängt",
  "script.fn.actions.console":
    "Befehl als Konsole ausführen. Mehrere Argumente werden aneinandergehängt",
  "script.fn.actions.tell":
    "Chatnachricht an den Spieler senden. Mehrere Argumente werden aneinandergehängt",
  "script.fn.actions.actionbar":
    "Nachricht über der Schnellzugriffsleiste anzeigen. Mehrere Argumente werden aneinandergehängt",
  "script.fn.actions.title": "Titel und Untertitel anzeigen",
  "script.fn.actions.log":
    "In das Server-Log schreiben. Mehrere Argumente werden aneinandergehängt",
  "script.fn.actions.take_level": "Spielerstufen abziehen",
  "script.fn.actions.give_level": "Spielerstufen geben",
  "script.fn.actions.give_exp": "Erfahrungspunkte geben",
  "script.fn.actions.close": "Aktuelle Oberfläche schließen",
  "script.fn.actions.back": "Zum übergeordneten Menü zurück",
  "script.fn.actions.openmenu": "Eigenes Menü öffnen",
  "script.fn.actions.discover_recipe": "Rezept freischalten",
  "script.fn.actions.undiscover_recipe": "Rezept sperren",
  "script.fn.actions.sound": "Ton abspielen",
  "script.fn.actions.set_inv_item": "Gegenstand im offenen Fenster setzen",
  "script.fn.conditions.perm": "Prüfen, ob der Spieler eine Berechtigung hat",
  "script.fn.conditions.papi": "PlaceholderAPI-Wert auslesen",
  "script.fn.conditions.level": "Spielerstufe auslesen",
  "script.fn.conditions.world":
    "Weltnamen auslesen oder mit einem Parameter vergleichen",
  "script.fn.conditions.gamemode":
    "Spielmodus auslesen oder mit einem Parameter vergleichen",
  "script.fn.conditions.item":
    "Prüfen, ob der Ereignisgegenstand einer ID entspricht",
  "script.fn.conditions.biome":
    "Biom auslesen oder mit einem Parameter vergleichen",
  "script.fn.conditions.in_water": "Prüfen, ob der Spieler im Wasser ist",
  "script.fn.conditions.in_rain": "Prüfen, ob der Spieler im Regen ist",
  "script.fn.conditions.light_level":
    "Lichtstärke am Block des Spielers auslesen",
  "script.fn.conditions.match_item_id":
    "Namespaced-ID eines Gegenstandsobjekts ermitteln",
  "script.fn.math.abs": "Absolutwert",
  "script.fn.math.min": "Kleinerer Wert",
  "script.fn.math.max": "Größerer Wert",
  "script.fn.math.round": "Kaufmännisch runden",
  "script.fn.math.floor": "Abrunden",
  "script.fn.math.ceil": "Aufrunden",
  "script.fn.math.sqrt": "Quadratwurzel",
  "script.fn.math.pow": "Potenzieren",
  "script.fn.math.random":
    "Zufallszahl. Ohne Argument 0~1, ein Argument ist die Obergrenze, zwei sind min~max",
  "script.fn.math.random_int":
    "Zufällige ganze Zahl. Ein Argument ist die Obergrenze, zwei sind min~max",
  "script.fn.math.int": "In ganze Zahl umwandeln",
  "script.fn.math.float": "In Gleitkommazahl umwandeln",
  "script.fn.vault.money": "Guthaben des Spielers auslesen (Vault)",
  "script.fn.vault.take_money": "Guthaben abziehen (Vault)",
  "script.fn.vault.give_money": "Guthaben gutschreiben (Vault)",
  "script.fn.vault_unlocked.money":
    "Guthaben des Spielers auslesen (VaultUnlocked). Ohne Währung wird die Standardwährung genutzt",
  "script.fn.vault_unlocked.take_money":
    "Guthaben abziehen (VaultUnlocked). Ohne Währung wird die Standardwährung genutzt",
  "script.fn.vault_unlocked.give_money":
    "Guthaben gutschreiben (VaultUnlocked). Ohne Währung wird die Standardwährung genutzt",
  "script.fn.playerpoints.points": "Spielerpunkte auslesen",
  "script.fn.playerpoints.take_points": "Punkte abziehen",
  "script.fn.playerpoints.give_points": "Punkte gutschreiben",
  "script.fn.obj.get":
    "Ein Objektfeld lesen, üblich als x.get(\"Feld\") geschrieben",
  "script.fn.obj.set":
    "Ein Objektfeld schreiben, üblich als x.set(\"Feld\", Wert) geschrieben",
  "script.fn.obj.invoke":
    "Eine Objektmethode aufrufen, üblich als x.invoke(\"Methode\", Args...) geschrieben",
  // delay hat keinen Namensraum, nur den Kurznamen: Schlüssel script.fn.delay
  "script.fn.delay": "Angegebene Ticks warten, dann fortfahren",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if":
    "Führt die folgenden Anweisungen aus, wenn die Bedingung zutrifft",
  "script.kw.elseif":
    "Prüft eine weitere Bedingung, wenn die vorige nicht zutrifft",
  "script.kw.else": "Läuft, wenn keine vorige Bedingung zutrifft",
  "script.kw.endif": "Schließt den if-Block",
  "script.kw.return": "Beendet das Skript und gibt einen Wert zurück",
  "script.kw.var": "Deklariert eine Variable, geschrieben als var Name = Wert",
  "script.kw.true": "Boolescher Wahrheitswert wahr",
  "script.kw.false": "Boolescher Wahrheitswert falsch",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Aktionen, die auf Spieler und Welt wirken",
  "script.module.conditions":
    "Prüfungen, die Spieler- und Umgebungszustand lesen",
  "script.module.math": "Rechenoperationen und Zufallszahlen",
  "script.module.vault": "Wirtschaftsschnittstelle (benötigt Vault)",
  "script.module.vault_unlocked":
    "Wirtschaftsschnittstelle für mehrere Währungen (benötigt VaultUnlocked)",
  "script.module.playerpoints": "Punkte-Schnittstelle (benötigt PlayerPoints)",
  "script.module.obj":
    "Reflexiver Zugriff auf Felder und Methoden eines Objekts",
  "script.complete.returns": "Gibt zurück",
  "triggers.priority": "Priorität (priority)",
  "triggers.priorityHint": "Kleinere Zahlen laufen zuerst",
  "triggers.cooldown": "Abklingzeit (Sekunden)",
  "triggers.cooldownHint": "0 bedeutet keine Begrenzung",
  "triggers.enabled": "Aktiviert",
  "triggers.disabled": "Deaktiviert",
  "triggers.perPlayer": "Abklingzeit pro Spieler",
  "triggers.shared": "Serverweite Abklingzeit",

  "fields.section": "Rezepteinstellungen",
  "fields.fileName": "Rezept-Dateiname",
  "fields.exportAs": "Export als {name}.yml",
  "fields.recipeId": "Rezept-ID (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint":
    "Leer lassen, damit das Plugin den Dateinamen als Rezept-ID verwendet",
  "fields.recipeIdRequiredHint":
    "Der Dateiname kann nicht als Rezept-ID dienen, deshalb muss sie hier gesetzt werden",
  "fields.group": "Rezeptgruppe (group)",
  "fields.groupPlaceholder": "Leer lassen für keine Gruppe",
  "fields.groupHint":
    "Rezepte derselben Gruppe werden im Rezeptbuch zusammengefasst",
  "fields.exp": "Erfahrung (exp)",
  "fields.time": "Schmelzdauer (time)",
  "fields.timeHint": "In Ticks, 20 Ticks = 1 Sekunde",
  "fields.costLevel": "Benötigte Stufen (cost_level)",
  "fields.trimPattern": "Verzierungsmuster (trim_pattern)",
  "fields.bookCategory": "Rezeptbuch-Kategorie",
  "fields.bookCategoryHint": "Benötigt einen Server ab 1.19.3",
  "fields.unspecified": "Nicht angegeben",
  "fields.previewSection": "Falsches Ergebnis (optional)",
  "fields.previewSlot": "Falsches Ergebnis",
  "fields.previewLabel": "Gegenstand als falsches Ergebnis",
  "fields.previewHint":
    "Der Ergebnisplatz zeigt diesen Gegenstand, um das echte Produkt zu verbergen; Spieler erhalten weiterhin das echte Ergebnis. Leer lassen, um fake_result_preview auszulassen.",
  "fields.copySection": "Regeln zum Kopieren von Komponenten (optional)",
  "fields.copyHint":
    "Ausgewählte Komponenten werden vom Eingabegegenstand auf das Ergebnis kopiert und als copy_components_rules geschrieben.",
  "fields.copySince": "{name} (benötigt {since})",
  "fields.removeRule": "{name} entfernen",

  "category.crafting.building": "Baublöcke",
  "category.crafting.redstone": "Redstone-Gegenstände",
  "category.crafting.equipment": "Ausrüstung",
  "category.crafting.misc": "Sonstiges",
  "category.cooking.food": "Nahrung",
  "category.cooking.blocks": "Blöcke",
  "category.cooking.misc": "Sonstiges",

  "copyRule.all": "Alle Komponenten",
  "copyRule.enchantments": "Verzauberungen",
  "copyRule.attributes": "Attribute",
  "copyRule.display_name": "Anzeigename",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Modelldaten",
  "copyRule.item_flag": "Gegenstandsmarkierungen",
  "copyRule.unbreakable": "Unzerstörbar",
  "copyRule.trim": "Rüstungsverzierung",
  "copyRule.food": "Nahrung",
  "copyRule.max_stack_size": "Maximale Stapelgröße",
  "copyRule.rarity": "Seltenheit",
  "copyRule.fire_resistance": "Feuerresistenz",
  "copyRule.hide_tooltip": "Tooltip verbergen",
  "copyRule.item_name": "Gegenstandsname",
  "copyRule.tool": "Werkzeug",
  "copyRule.item_model": "Gegenstandsmodell",
  "copyRule.custom_model_data_component": "Modelldaten-Komponente",

  "itemCategory.building": "Baublöcke",
  "itemCategory.ore": "Erze",
  "itemCategory.tool": "Werkzeuge",
  "itemCategory.combat": "Kampf",
  "itemCategory.food": "Nahrung",
  "itemCategory.redstone": "Redstone",
  "itemCategory.brewing": "Brauen",
  "itemCategory.misc": "Sonstiges",

  "recipeGroup.crafting": "Herstellung",
  "recipeGroup.smelting": "Schmelzen",
  "recipeGroup.smithing": "Schmieden",
  "recipeGroup.processing": "Verarbeitung",

  "recipeType.vanilla_shaped": "Geformtes Rezept",
  "recipeType.vanilla_shaped.summary":
    "Zutaten in einem 3×3-Muster anordnen; die Position entscheidet, ob es gelingt.",
  "recipeType.vanilla_shapeless": "Formloses Rezept",
  "recipeType.vanilla_shapeless.summary":
    "Gelingt, solange alle Zutaten vorhanden sind, unabhängig von der Position.",
  "recipeType.vanilla_smelting_furnace": "Ofen-Rezept",
  "recipeType.vanilla_smelting_furnace.summary":
    "Eine Zutat im Ofen schmelzen, mit einstellbarer Erfahrung und Dauer.",
  "recipeType.vanilla_smelting_blast": "Schmelzofen-Rezept",
  "recipeType.vanilla_smelting_blast.summary":
    "Schmelzen im Schmelzofen, meist für Erze und Metalle.",
  "recipeType.vanilla_smelting_smoker": "Räucherofen-Rezept",
  "recipeType.vanilla_smelting_smoker.summary":
    "Schmelzen im Räucherofen, meist für Nahrung.",
  "recipeType.vanilla_smelting_campfire": "Lagerfeuer-Rezept",
  "recipeType.vanilla_smelting_campfire.summary":
    "Garen am Lagerfeuer, meist langsamer als im Ofen.",
  "recipeType.vanilla_smithing_transform": "Schmiede-Rezept",
  "recipeType.vanilla_smithing_transform.summary":
    "Einen Grundgegenstand mit Vorlage und Zusatz zu einem neuen aufwerten.",
  "recipeType.vanilla_smithing_trim": "Verzierungs-Rezept",
  "recipeType.vanilla_smithing_trim.summary":
    "Rüstung verzieren; das Verzierungsmuster ist erforderlich.",
  "recipeType.vanilla_stonecutting": "Steinsäge-Rezept",
  "recipeType.vanilla_stonecutting.summary":
    "Eine Zutat an der Steinsäge zum Ergebnis zuschneiden.",
  "recipeType.vanilla_brewing": "Brau-Rezept",
  "recipeType.vanilla_brewing.summary":
    "Mit einer Zutat den Eingabegegenstand im Braustand verändern.",
  "recipeType.anvil": "Amboss-Rezept",
  "recipeType.anvil.summary":
    "Zwei Gegenstände am Amboss zusammenfügen, mit einstellbaren Stufenkosten.",

  "station.crafting_table": "Werkbank",
  "station.furnace": "Ofen",
  "station.blast_furnace": "Schmelzofen",
  "station.smoker": "Räucherofen",
  "station.campfire": "Lagerfeuer",
  "station.smithing_table": "Schmiedetisch",
  "station.stonecutter": "Steinsäge",
  "station.brewing_stand": "Braustand",
  "station.anvil": "Amboss",

  "guiSlot.gridCell": "Gitterfeld",
  "guiSlot.gridPosition": "Zeile {row}, Spalte {col}",
  "guiSlot.shapelessIngredient": "Zutat {index}",
  "guiSlot.ingredient": "Zutat",
  "guiSlot.result": "Ergebnis",
  "guiSlot.template": "Vorlage",
  "guiSlot.base": "Grundgegenstand",
  "guiSlot.addition": "Zusatz",
  "guiSlot.anvilBase": "Linker Gegenstand",
  "guiSlot.anvilAddition": "Rechter Gegenstand",
  "guiSlot.brewingInput": "Eingabegegenstand",
  "guiSlot.brewingMiddle": "mittlerer Flaschenplatz",
  "guiSlot.inertFuel":
    "Der Brennstoffplatz wird von Spielern gefüllt; Rezepte nutzen ihn nicht",
  "guiSlot.inertBottle":
    "Die äußeren Flaschenplätze nutzen denselben Eingabegegenstand wie der mittlere",

  "triggerGroup.craft": "Herstellung",
  "triggerGroup.player": "Spielerereignisse",
  "triggerGroup.entity": "Wesen-Ereignisse",
  "triggerGroup.block": "Block-Ereignisse",
  "triggerGroup.inventory": "Inventar-Ereignisse",

  "triggerType.crafting": "Herstellen an der Werkbank",
  "triggerType.smithing": "Schmieden am Schmiedetisch",
  "triggerType.anvil": "Zusammenfügen am Amboss",
  "triggerType.player_join": "Spieler betritt",
  "triggerType.player_quit": "Spieler verlässt",
  "triggerType.player_death": "Spieler stirbt",
  "triggerType.player_respawn": "Spieler erscheint neu",
  "triggerType.player_interact": "Spieler interagiert",
  "triggerType.player_advancement": "Fortschritt erreicht",
  "triggerType.player_level_change": "Stufenänderung",
  "triggerType.player_exp_change": "Erfahrungsänderung",
  "triggerType.player_toggle_sneak": "Schleichen umschalten",
  "triggerType.player_toggle_sprint": "Sprinten umschalten",
  "triggerType.player_item_consume": "Gegenstand verbrauchen",
  "triggerType.player_item_held": "Gehaltenen Gegenstand wechseln",
  "triggerType.player_item_damage": "Gegenstand beschädigt",
  "triggerType.player_item_mend": "Gegenstand repariert",
  "triggerType.player_fish": "Angeln",
  "triggerType.player_teleport": "Teleportieren",
  "triggerType.player_portal": "Portal benutzen",
  "triggerType.player_changed_world": "Welt wechseln",
  "triggerType.player_drop_item": "Gegenstand wegwerfen",
  "triggerType.player_pickup_item": "Gegenstand aufheben",
  "triggerType.player_game_mode_change": "Spielmodus wechseln",
  "triggerType.player_recipe_discover": "Rezept freigeschaltet",
  "triggerType.player_command_preprocess": "Befehl ausführen",
  "triggerType.player_move": "Spieler bewegt sich",
  "triggerType.player_bed_enter": "Ins Bett gehen",
  "triggerType.player_bed_leave": "Bett verlassen",
  "triggerType.player_swap_hand_items": "Hände tauschen",
  "triggerType.player_edit_book": "Buch bearbeiten",
  "triggerType.player_statistic": "Statistikänderung",
  "triggerType.player_bucket_fill": "Eimer füllen",
  "triggerType.player_bucket_empty": "Eimer entleeren",
  "triggerType.player_shear_entity": "Wesen scheren",
  "triggerType.damage_entity": "Schaden verursachen",
  "triggerType.kill_entity": "Wesen töten",
  "triggerType.entity_shoot_bow": "Bogen abschießen",
  "triggerType.entity_breed": "Tiere züchten",
  "triggerType.entity_tame": "Tier zähmen",
  "triggerType.entity_potion_effect": "Trankeffekt ändert sich",
  "triggerType.block_break": "Block abbauen",
  "triggerType.block_place": "Block platzieren",
  "triggerType.inventory_click": "Inventar anklicken",
  "triggerType.inventory_open": "Inventar öffnen",
  "triggerType.inventory_close": "Inventar schließen",
  "triggerType.player_interact_entity": "Interaktion mit Entität",
  "triggerType.player_animation": "Spieler-Animation",
  "triggerType.player_velocity": "Geschwindigkeitsänderung",
  "triggerType.async_player_chat": "Spieler-Chat",
  "triggerType.player_take_campfire": "Lagerfeuer entnehmen",
  "triggerType.prepare_grindstone": "Schleifstein vorbereiten",
  "triggerType.trade_select": "Handel auswählen",

  "issue.fileNameEmpty": "Der Rezept-Dateiname darf nicht leer sein.",
  "issue.fileNameNeedsRecipeId":
    "Der Dateiname enthält ungültige Zeichen. Ohne recipe_id verwendet das Plugin den Dateinamen als Rezept-ID, das Laden würde also fehlschlagen: Verwende Kleinbuchstaben, Ziffern, Unterstriche, Bindestriche und Punkte, oder setze unten eine Rezept-ID.",
  "issue.recipeIdPattern":
    "Die Rezept-ID darf nur Kleinbuchstaben, Ziffern, Unterstriche, Bindestriche und Punkte enthalten.",
  "issue.resultMissing": "Noch kein Ergebnis (result) festgelegt.",
  "issue.resultMustBeItem":
    "Das Ergebnis muss ein konkreter Gegenstand sein, kein Tag und keine Gegenstandsgruppe.",
  "issue.gridEmpty": "Das Herstellungsraster braucht mindestens eine Zutat.",
  "issue.gridTooManyKinds":
    "Mehr als 9 verschiedene Zutaten, es kann kein shape erzeugt werden.",
  "issue.shapelessEmpty": "Ein formloses Rezept braucht mindestens eine Zutat.",
  "issue.shapelessTooMany": "Ein formloses Rezept erlaubt höchstens 9 Zutaten.",
  "issue.smeltingIngredient":
    "Noch keine Schmelzzutat (ingredient) festgelegt.",
  "issue.cookingTime": "Die Schmelzdauer muss größer als 0 Ticks sein.",
  "issue.expNegative": "Erfahrung darf nicht negativ sein.",
  "issue.stonecuttingIngredient":
    "Noch keine Zutat für die Steinsäge (ingredient) festgelegt.",
  "issue.smithingBase": "Noch kein Grundgegenstand (base) festgelegt.",
  "issue.smithingAddition": "Noch kein Zusatz (addition) festgelegt.",
  "issue.smithingTemplate":
    "Keine Schmiedevorlage (template) gesetzt; Server ab 1.20 benötigen sie meist.",
  "issue.trimPattern":
    "Ein Verzierungs-Rezept benötigt ein Verzierungsmuster (trim_pattern).",
  "issue.brewingInput": "Noch kein Brau-Eingabegegenstand (input) festgelegt.",
  "issue.brewingIngredient": "Noch keine Brauzutat (ingredient) festgelegt.",
  "issue.anvilBase": "Noch kein linker Gegenstand (base) festgelegt.",
  "issue.anvilAddition": "Noch kein rechter Gegenstand (addition) festgelegt.",
  "issue.costLevelNegative": "Die benötigten Stufen dürfen nicht negativ sein.",
  "issue.packUndefined":
    "Verweist auf die undefinierte Gegenstandsgruppe {name}. Erstelle sie unter „Gegenstandsgruppen“ oder stelle sicher, dass sie auf dem Server existiert.",
  "issue.brewingTagInput":
    "Der Brau-Eingabegegenstand nutzt ein Tag. Tag-Vergleiche beim Brauen hängen von der Server-Implementierung ab; ein konkreter Gegenstand ist sicherer.",
  "issue.brewingTagIngredient":
    "Die Brauzutat nutzt ein Tag. Tag-Vergleiche beim Brauen hängen von der Server-Implementierung ab; ein konkreter Gegenstand ist sicherer.",
  "issue.packNameEmpty": "Es gibt eine unbenannte Gegenstandsgruppe.",
  "issue.packNameDuplicate":
    "Der Gruppenname {name} kommt doppelt vor; spätere überschreiben frühere.",
  "issue.packNamePattern":
    "Der Gruppenname {name} sollte nur Kleinbuchstaben, Ziffern, Unterstriche und Bindestriche enthalten.",
  "issue.packItemsEmpty":
    "Die Gegenstandsgruppe {name} hat keine Gegenstände und wird vom Plugin übersprungen.",
  "issue.packNested":
    "Die Gegenstandsgruppe {name} darf keine Tags oder weitere Gruppen enthalten; nur konkrete Gegenstände sind erlaubt.",
  "issue.triggerIdEmpty": "Es gibt einen unbenannten Auslöser.",
  "issue.triggerIdDuplicate":
    "Die Auslöser-ID {name} kommt doppelt vor; spätere überschreiben frühere.",
  "issue.triggerIdPattern":
    "Die Auslöser-ID {name} sollte nur Kleinbuchstaben, Ziffern, Unterstriche und Bindestriche enthalten.",
  "issue.triggerTypeMissing":
    "Der Auslöser {name} hat keinen Typ und wird vom Plugin übersprungen.",
  "issue.triggerNoActions":
    "Der Auslöser {name} hat keine Aktionen und bewirkt beim Auslösen nichts.",
  "issue.triggerCooldownNegative":
    "Die Abklingzeit des Auslösers {name} darf nicht negativ sein.",
  "issue.triggerConditionScript":
    "Zeile {line} der Bedingungen von Auslöser {name} enthält einen Syntaxfehler; das Plugin kann sie nicht laden.",
  "issue.triggerActionScript":
    "Zeile {line} der Aktionen von Auslöser {name} enthält einen Syntaxfehler; das Plugin kann sie nicht laden.",

  "parse.yamlFailed": "YAML konnte nicht gelesen werden: {detail}",
  "parse.notRecipe":
    "Diese Datei ist keine Rezeptkonfiguration (die oberste Ebene muss eine Zuordnung sein).",
  "parse.typeMissing":
    "Das Feld type fehlt, der Rezepttyp lässt sich nicht bestimmen.",
  "parse.typeUnsupported": "Nicht unterstützter Rezepttyp: {name}",
  "parse.resultMissing":
    "Kein result gelesen, bitte das Ergebnis neu festlegen.",
  "parse.shapeMissing":
    "Kein gültiges shape / ingredients gelesen, das Raster bleibt leer.",
  "parse.shapeCharUnmapped":
    "Das Zeichen {name} in shape hat keine zugehörige Zutat.",
  "parse.shapeTooManyRows":
    "shape hat mehr als 3 Zeilen, nur die ersten 3 wurden importiert.",
  "parse.ingredientsMissing":
    "Kein ingredients gelesen, die Liste bleibt leer.",
  "parse.ingredientsTooMany":
    "Mehr als 9 Zutaten, nur die ersten 9 wurden importiert.",
  "parse.amountClamped":
    "Einige Mengen wurden korrigiert: Dieser Slot liest keine Mengen, oder der Wert überschritt das Limit {max}.",
  "parse.cookingCategoryUnknown":
    "Unbekannte Rezeptbuch-Kategorie für das Schmelzen: {name}",
  "parse.craftingCategoryUnknown":
    "Unbekannte Rezeptbuch-Kategorie für die Herstellung: {name}",
  "parse.notItemPacks":
    "Diese Datei ist keine Konfiguration für Gegenstandsgruppen (die oberste Ebene muss Namen auf Listen abbilden).",
  "parse.packNotList":
    "Die Gegenstandsgruppe {name} ist keine Liste und wurde übersprungen.",
  "parse.packNoItems":
    "Die Gegenstandsgruppe {name} hat keine gültigen Gegenstände und wurde übersprungen.",
  "parse.notTriggers":
    "Diese Datei ist keine Auslöser-Konfiguration (die oberste Ebene muss Auslöser-IDs auf Konfigurationen abbilden).",
  "parse.triggerNotMap":
    "Der Auslöser {name} ist keine Zuordnung und wurde übersprungen.",
  "parse.triggerTypeMissing":
    "Beim Auslöser {name} fehlt type, er wurde übersprungen.",
};
