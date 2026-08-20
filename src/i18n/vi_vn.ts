import type { MessageKey } from "./zh_cn";

export const viVn: Record<MessageKey, string> = {
  "brand.title": "Xưởng công thức Craftorithm",
  "brand.sub":
    "Tạo YAML công thức cho plugin ngay trên máy, không cần đăng nhập",

  "view.aria": "Khu làm việc",
  "skip.toWorkbench": "Chuyển tới bàn chế tạo",
  "view.recipe": "Công thức",
  "view.packs": "Nhóm vật phẩm",
  "view.triggers": "Bộ kích hoạt",

  "tabs.aria": "Tệp đang mở",
  "tabs.close": "Đóng {name}",
  "tabs.newRecipe": "Công thức mới",
  "tabs.newTrigger": "Tệp trigger mới",
  "tabs.saveAsNew": "Lưu thành thẻ mới",
  "tabs.newMenu": "Tùy chọn tạo mới khác",
  "tabs.importFiles": "Nhập tệp…",

  "start.title": "Bắt đầu",
  "start.note": "Tạo một công thức, hoặc nhập các tệp có sẵn để tiếp tục chỉnh sửa.",
  "start.newRecipe": "Công thức mới",
  "start.importFiles": "Nhập tệp",
  "start.importFolder": "Nhập thư mục",
  "start.hint": "Khi nhập thư mục sẽ tự nhận diện recipes, item_packs.yml và triggers.",

  "action.exportAll": "Xuất tất cả",
  "toast.exportedZip": "Đã xuất {count} tệp",
  "toast.exportEmpty": "Không có gì để xuất",
  "toast.savedAsNew": "Đã sao chép sang thẻ mới",
  "toast.importedCount": "Đã nhập {count} tệp",
  "toast.importSkipped": "Đã bỏ qua {count} tệp không nhận dạng được",
  "toast.tabClosed": "Đã đóng {name}",
  "toast.typeChangedLost": "Đổi loại đã bỏ {count} nguyên liệu — có thể hoàn tác",

  "history.undo": "Hoàn tác",
  "history.redo": "Làm lại",
  "history.undoOf": "Hoàn tác {action}",
  "history.action.changeType": "việc đổi loại công thức",
  "history.action.reset": "việc đặt lại công thức",
  "history.action.closeTab": "việc đóng tệp",
  "history.action.import": "việc ghi đè khi nhập",
  "history.action.packEdit": "thay đổi nhóm vật phẩm",

  "step.aria": "Các bước chỉnh sửa",
  "step.type": "Loại",
  "step.edit": "Chỉnh sửa",
  "step.export": "Xuất",

  "action.reset": "Đặt lại",
  "action.resetRecipe": "Đặt lại công thức",
  "action.importYaml": "Nhập YAML",
  "action.downloadYaml": "Tải xuống YAML",
  "action.copyClipboard": "Sao chép vào bộ nhớ tạm",
  "action.close": "Đóng",
  "action.remove": "Xóa",

  "locale.switch": "Ngôn ngữ giao diện",
  "theme.switch": "Giao diện",
  "theme.light": "Sáng",
  "theme.dark": "Tối",

  "catalog.offline":
    "Danh mục vật phẩm ngoại tuyến, đã dùng danh sách tích hợp",

  "footer.aria": "Giới thiệu và liên kết liên quan",
  "footer.credit":
    "Được tạo bởi 氿雾, trình biên tập công thức cho plugin Craftorithm",
  "footer.link.spigot": "SpigotMC",
  "footer.link.modrinth": "Modrinth",
  "footer.link.wiki": "Tài liệu",
  "footer.link.qq": "Nhóm QQ",
  "footer.link.discord": "Discord",

  "toast.copied": "Đã sao chép YAML vào bộ nhớ tạm",
  "toast.copyFailed": "Sao chép thất bại, vui lòng tự chọn nội dung xem trước",
  "toast.downloaded": "Đã tải xuống {name}",
  "toast.saved": "Đã lưu {name} vào vị trí đã chọn",

  "next.titleDownloaded": "Đã tải {name} — còn hai bước nữa",
  "next.titleSaved": "Đã lưu {name} — còn hai bước nữa",
  "next.step1": "Đặt tệp vào vị trí này trên máy chủ (tệp cùng tên sẽ bị ghi đè):",
  "next.step2": "Chạy lệnh này trong console máy chủ hoặc trong game:",
  "next.step3": "Thử chế tạo trong game. Nếu không có gì xảy ra, kiểm tra console xem có lỗi tải không.",
  "next.copyPath": "Sao chép đường dẫn",
  "next.copyCommand": "Sao chép lệnh",
  "next.pathCopied": "Đã sao chép đường dẫn",
  "next.commandCopied": "Đã sao chép lệnh",
  "next.done": "Đã hiểu",
  "toast.imported": "Đã nhập {name}",
  "toast.recipeReset": "Đã đặt lại thành công thức trống",
  "bench.station": "Bàn chế tạo: {name}",
  "bench.importWarnings": "Có {count} chỗ cần xác nhận khi nhập: {detail}",
  "bench.shapelessNote":
    "Công thức không theo thứ tự chỉ xét đủ nguyên liệu, vị trí đặt không ảnh hưởng đến kết quả.",
  "bench.inertNote":
    "Những ô không thể nhấn trên giao diện do người chơi sử dụng trong game, công thức không ghi vào các ô này.",
  "bench.guiAlt": "Giao diện {name}",
  "bench.resultOutside": "Thành phẩm (cùng ô với giao diện phía trên)",

  "typeNav.aria": "Loại công thức",

  "inspector.title": "Thành phẩm và kiểm tra",
  "inspector.resultUnset": "Chưa đặt thành phẩm",
  "inspector.resultHint": "Nhấn vào ô thành phẩm trên bàn chế tạo",
  "inspector.slotUnset": "Chưa đặt",
  "inspector.mustFix": "{count} chỗ buộc phải sửa",
  "inspector.stillTodo": "Còn {count} bước",
  "inspector.ready": "Công thức đã hoàn chỉnh, có thể xuất",
  "inspector.yamlTitle": "Xem trước YAML",
  "inspector.fixFirst": "Sửa các lỗi phía trên rồi mới tải xuống được.",

  "picker.aria": "Chọn nguyên liệu: {name}",
  "picker.title": "Chọn nguyên liệu · {name}",
  "picker.clearSlot": "Xóa trống ô",
  "picker.tabsAria": "Loại nguyên liệu",
  "picker.tab.item": "Vật phẩm",
  "picker.tab.tag": "Thẻ",
  "picker.tab.item_pack": "Nhóm vật phẩm",
  "picker.categoryAll": "Tất cả",
  "picker.search.item": "Tìm tên hoặc ID vật phẩm, ví dụ diamond",
  "picker.search.tag": "Tìm thẻ, ví dụ planks / logs",
  "picker.search.item_pack": "Tìm tên nhóm vật phẩm",
  "picker.custom.item": "ID vật phẩm tùy chỉnh",
  "picker.custom.tag": "Tên thẻ tùy chỉnh",
  "picker.custom.item_pack": "Tên nhóm vật phẩm tùy chỉnh",
  "picker.customPlaceholder.item": "minecraft:diamond hoặc oraxen:ruby",
  "picker.customPlaceholder.tag": "planks",
  "picker.customPlaceholder.item_pack": "hello_world",
  "picker.amount": "Số lượng",
  "picker.use": "Dùng",
  "picker.loadingItems": "Đang tải danh mục vật phẩm {version}…",
  "picker.loadingTags": "Đang tải thẻ nguyên liệu {version}…",
  "picker.noItem":
    "Không có kết quả khớp, bạn có thể tự điền ID vật phẩm bên dưới.",
  "picker.noTag":
    "Không có danh sách thẻ khả dụng, bạn có thể tự điền tên thẻ bên dưới, ví dụ planks.",
  "picker.noPack":
    "Chưa có nhóm vật phẩm nào. Hãy tạo mới ở thẻ «Nhóm vật phẩm», hoặc tự điền tên nhóm bên dưới.",
  "picker.showMore": "Hiển thị thêm (còn {count} mục)",
  "picker.packItemCount": "{count} vật phẩm",
  "picker.tagItemCount": "Có {count} vật phẩm trong tag này",
  "picker.packGlyph": "N",

  "slot.empty": "trống",
  "slot.item": "Vật phẩm",
  "slot.itemPack": "Nhóm vật phẩm",
  "choice.tag": "Thẻ {name}",
  "choice.itemPack": "Nhóm vật phẩm {name}",
  "badge.tag": "Thẻ",
  "badge.itemPack": "Nhóm vật phẩm",

  "packs.title": "Nhóm vật phẩm",
  "packs.note":
    "Gộp nhiều vật phẩm thành một nhóm, trong công thức tham chiếu bằng {code}, chỉ cần một vật phẩm bất kỳ là đủ nguyên liệu.",
  "packs.create": "Tạo nhóm vật phẩm",
  "packs.import": "Nhập item_packs.yml",
  "packs.empty":
    "Chưa có nhóm vật phẩm nào. Sau khi tạo mới, bạn có thể chọn nó ở ô nguyên liệu của công thức.",
  "packs.name": "Tên nhóm",
  "packs.removeGroup": "Xóa nhóm",
  "packs.removeItem": "Bỏ vật phẩm thứ {index}",
  "packs.addItem": "Thêm vật phẩm vào {name}",
  "packs.yamlEmpty": "# Chưa có nhóm vật phẩm",
  "packs.imported": "Đã nhập {count} nhóm vật phẩm",
  "packs.importedWithWarnings":
    "Đã nhập {count} nhóm vật phẩm, {warnings} chỗ cần lưu ý",

  "triggers.title": "Bộ kích hoạt",
  "triggers.note":
    "Thực thi hành động khi chế tạo hoặc khi có sự kiện khác. Đặt vào thư mục {code} của plugin là có hiệu lực.",
  "triggers.fileName": "Tên tệp",
  "triggers.exportAs": "Xuất thành {name}.yml",
  "triggers.create": "Tạo bộ kích hoạt",
  "triggers.import": "Nhập YAML bộ kích hoạt",
  "triggers.empty": "Chưa có bộ kích hoạt nào. Hãy tạo mới một cái để bắt đầu.",
  "triggers.yamlEmpty": "# Chưa có bộ kích hoạt",
  "triggers.imported": "Đã nhập {count} bộ kích hoạt",
  "triggers.importedWithWarnings":
    "Đã nhập {count} bộ kích hoạt, {warnings} chỗ cần lưu ý",
  "triggers.id": "ID bộ kích hoạt",
  "triggers.type": "Loại kích hoạt",
  "triggers.recipes": "Giới hạn công thức (recipes)",
  "triggers.recipesHint":
    "Để trống nghĩa là mọi công thức thuộc loại này đều kích hoạt. Hãy điền key công thức đầy đủ, ví dụ craftorithm:my_sword",
  "triggers.conditions": "Điều kiện kích hoạt (conditions)",
  "triggers.mode.and": "Thỏa mãn tất cả",
  "triggers.mode.script": "Khối kịch bản",
  "triggers.conditionsHint.and":
    'Mỗi dòng một điều kiện, tất cả đều đúng thì mới cho qua. Ví dụ papi("%player_level%") >= 10',
  "triggers.conditionsHint.script":
    "Viết theo từng dòng kịch bản, bạn phải tự return true / false.",
  "triggers.actions": "Hành động thực thi (actions)",
  "triggers.actionsHint":
    'Mỗi dòng một hành động, ví dụ tell("&aChế tạo thành công!") hoặc give_level(100)',
  "triggers.variables": "Biến khả dụng: {list}",

  // ---- Trình biên tập kịch bản ----
  "script.line": "Dòng {line}",
  "script.status.errors": "{count} lỗi cú pháp",
  "script.status.warnings": "{count} chỗ cần lưu ý",
  "script.hint.condition":
    "Tab để hoàn tất, Ctrl+Space để mở gợi ý. Điều kiện phải cho ra true / false.",
  "script.hint.action":
    "Tab để hoàn tất, Ctrl+Space để mở gợi ý. Mỗi dòng một hành động.",
  "script.undo": "Hoàn tác",
  "script.redo": "Làm lại",

  // Lỗi từ vựng
  "script.err.unterminatedString": "Chuỗi ký tự thiếu dấu ngoặc kép đóng",
  "script.err.unexpectedChar": "Ký tự không nhận dạng được",

  // Lỗi cấu trúc
  "script.err.unclosedParen": "Dấu ngoặc chưa được đóng",
  "script.err.unexpectedParen": "Dấu ngoặc đóng bị thừa",
  "script.err.missingEndif": "if thiếu endif tương ứng",
  "script.err.orphanEndif": "endif không có if tương ứng",
  "script.err.orphanBranch": "{keyword} không có if tương ứng",
  "script.err.expectedFunctionName": "Sau dấu hai chấm cần có tên hàm",
  "script.err.moduleCallNeedsParen":
    "Gọi mô-đun phải có dấu ngoặc; hãy viết {name}(...)",
  "script.err.expectedMethodCall":
    "Sau dấu chấm cần có lời gọi phương thức; hãy viết .{name}(...)",
  "script.err.expectedVarName": "Sau var cần có \"tên biến = giá trị\"",

  // Tên gọi và tham số
  "script.err.unknownFunction": "Hàm không xác định {name}",
  "script.err.unknownModule": "Mô-đun không xác định {name}",
  "script.err.argCount": "{name} cần {expected} tham số, thực tế có {actual}",
  "script.err.argType":
    "Tham số {param} của {name} cần {expected}, thực tế là {actual}",
  "script.err.ambiguousName":
    "{name} có ở nhiều mô-đun, nên viết thành {qualified}",
  "script.err.unknownVariable":
    "Biến {name} chưa được khai báo và cũng không nằm trong các biến khả dụng của bộ kích hoạt hiện tại",

  // Gợi ý ngữ nghĩa
  "script.err.assignUndeclared":
    "{name} chưa được khai báo bằng var; có thể cần viết var {name} = ...",
  "script.err.blockInAndMode":
    "Ở chế độ \"thỏa mãn tất cả\", mỗi dòng phải là một điều kiện độc lập nên không dùng được {name}; hãy chuyển sang \"khối script\" nếu cần phân nhánh hoặc biến",
  "script.err.queryInAction":
    "{name} chỉ lấy giá trị mà không tạo hiệu ứng, có thể cần bọc trong if",
  "script.err.notBoolean": "Dòng này không cho ra true / false",

  // Mô tả hàm, tên khóa là script.fn.<module>.<name>
  "script.fn.actions.command":
    "Thực thi lệnh với danh nghĩa người chơi. Nhiều tham số sẽ được nối lại",
  "script.fn.actions.console":
    "Thực thi lệnh với danh nghĩa bảng điều khiển. Nhiều tham số sẽ được nối lại",
  "script.fn.actions.tell":
    "Gửi tin nhắn trò chuyện cho người chơi. Nhiều tham số sẽ được nối lại",
  "script.fn.actions.actionbar":
    "Hiển thị tin nhắn phía trên thanh vật phẩm. Nhiều tham số sẽ được nối lại",
  "script.fn.actions.title": "Hiển thị tiêu đề lớn và tiêu đề phụ",
  "script.fn.actions.log":
    "Ghi vào bản ghi máy chủ. Nhiều tham số sẽ được nối lại",
  "script.fn.actions.take_level": "Trừ cấp độ của người chơi",
  "script.fn.actions.give_level": "Tăng cấp độ của người chơi",
  "script.fn.actions.give_exp": "Tăng điểm kinh nghiệm của người chơi",
  "script.fn.actions.close": "Đóng giao diện hiện tại",
  "script.fn.actions.back": "Trở về trình đơn cấp trên",
  "script.fn.actions.openmenu": "Mở trình đơn tùy chỉnh",
  "script.fn.actions.discover_recipe": "Mở khóa công thức",
  "script.fn.actions.undiscover_recipe": "Khóa công thức",
  "script.fn.actions.sound": "Phát âm thanh",
  "script.fn.actions.set_inv_item": "Đặt vật phẩm cho ô của giao diện hiện tại",
  "script.fn.conditions.perm": "Kiểm tra người chơi có quyền hay không",
  "script.fn.conditions.papi": "Lấy giá trị biến PlaceholderAPI",
  "script.fn.conditions.level": "Lấy cấp độ của người chơi",
  "script.fn.conditions.world":
    "Lấy tên thế giới, có tham số thì kiểm tra xem có trùng khớp không",
  "script.fn.conditions.gamemode":
    "Lấy chế độ chơi, có tham số thì kiểm tra xem có trùng khớp không",
  "script.fn.conditions.item":
    "Kiểm tra vật phẩm của sự kiện có đúng ID chỉ định hay không",
  "script.fn.conditions.biome":
    "Lấy quần xã sinh vật, có tham số thì kiểm tra xem có trùng khớp không",
  "script.fn.conditions.in_water":
    "Kiểm tra người chơi có đang ở trong nước hay không",
  "script.fn.conditions.in_rain":
    "Kiểm tra người chơi có đang ở trong mưa hay không",
  "script.fn.conditions.light_level": "Lấy mức độ ánh sáng của khối đang đứng",
  "script.fn.conditions.match_item_id": "Lấy ID có không gian tên của đối tượng vật phẩm",
  "script.fn.math.abs": "Giá trị tuyệt đối",
  "script.fn.math.min": "Lấy giá trị nhỏ hơn",
  "script.fn.math.max": "Lấy giá trị lớn hơn",
  "script.fn.math.round": "Làm tròn",
  "script.fn.math.floor": "Làm tròn xuống",
  "script.fn.math.ceil": "Làm tròn lên",
  "script.fn.math.sqrt": "Căn bậc hai",
  "script.fn.math.pow": "Phép lũy thừa",
  "script.fn.math.random":
    "Lấy số ngẫu nhiên. Không có tham số là 0~1, một tham số là giới hạn trên, hai tham số là min~max",
  "script.fn.math.random_int":
    "Lấy số nguyên ngẫu nhiên. Một tham số là giới hạn trên, hai tham số là min~max",
  "script.fn.math.int": "Chuyển thành số nguyên",
  "script.fn.math.float": "Chuyển thành số thực",
  "script.fn.vault.money": "Lấy số dư của người chơi (Vault)",
  "script.fn.vault.take_money": "Trừ số dư (Vault)",
  "script.fn.vault.give_money": "Tăng số dư (Vault)",
  "script.fn.vault_unlocked.money":
    "Lấy số dư của người chơi (VaultUnlocked). Bỏ trống loại tiền thì dùng loại mặc định",
  "script.fn.vault_unlocked.take_money":
    "Trừ số dư (VaultUnlocked). Bỏ trống loại tiền thì dùng loại mặc định",
  "script.fn.vault_unlocked.give_money":
    "Tăng số dư (VaultUnlocked). Bỏ trống loại tiền thì dùng loại mặc định",
  "script.fn.playerpoints.points": "Lấy điểm của người chơi",
  "script.fn.playerpoints.take_points": "Trừ điểm",
  "script.fn.playerpoints.give_points": "Tăng điểm",
  "script.fn.obj.get":
    "Đọc trường của đối tượng, thường viết x.get(\"tên trường\")",
  "script.fn.obj.set":
    "Ghi trường của đối tượng, thường viết x.set(\"tên trường\", giá trị)",
  "script.fn.obj.invoke":
    "Gọi phương thức của đối tượng, thường viết x.invoke(\"tên phương thức\", tham số...)",
  // delay không có không gian tên, chỉ có tên ngắn: khóa là script.fn.delay
  "script.fn.delay": "Tạm dừng số tick chỉ định rồi tiếp tục",
  // 关键字说明，键名为 script.kw.<keyword>
  "script.kw.if": "Chạy các câu lệnh bên dưới khi điều kiện đúng",
  "script.kw.elseif": "Kiểm tra điều kiện khác khi điều kiện trước không đúng",
  "script.kw.else": "Chạy khi không điều kiện nào phía trên đúng",
  "script.kw.endif": "Kết thúc khối if",
  "script.kw.return": "Kết thúc kịch bản và trả về giá trị",
  "script.kw.var": "Khai báo một biến, viết là var tên = giá trị",
  "script.kw.true": "Giá trị luận lý đúng",
  "script.kw.false": "Giá trị luận lý sai",
  // 模块说明，键名为 script.module.<module>
  "script.module.actions": "Các hành động tác động lên người chơi và thế giới",
  "script.module.conditions":
    "Các phép kiểm tra trạng thái người chơi và môi trường",
  "script.module.math": "Phép toán và số ngẫu nhiên",
  "script.module.vault": "Giao diện kinh tế (cần Vault)",
  "script.module.vault_unlocked":
    "Giao diện kinh tế đa tiền tệ (cần VaultUnlocked)",
  "script.module.playerpoints": "Giao diện điểm (cần PlayerPoints)",
  "script.module.obj":
    "Truy cập phản chiếu tới trường và phương thức của đối tượng",
  "script.complete.returns": "Trả về",
  "triggers.priority": "Độ ưu tiên (priority)",
  "triggers.priorityHint": "Số nhỏ hơn sẽ chạy trước",
  "triggers.cooldown": "Thời gian hồi (giây)",
  "triggers.cooldownHint": "0 nghĩa là không giới hạn",
  "triggers.enabled": "Đã bật",
  "triggers.disabled": "Đã tắt",
  "triggers.perPlayer": "Thời gian hồi riêng từng người",
  "triggers.shared": "Thời gian hồi dùng chung toàn máy chủ",

  "fields.section": "Thiết lập công thức",
  "fields.fileName": "Tên tệp công thức",
  "fields.exportAs": "Xuất thành {name}.yml",
  "fields.recipeId": "ID công thức (recipe_id)",
  "fields.recipeIdPlaceholder": "my_recipe",
  "fields.recipeIdHint": "Để trống thì plugin sẽ dùng tên tệp làm ID công thức",
  "fields.recipeIdRequiredHint":
    "Tên tệp không thể dùng làm ID công thức, buộc phải điền ở đây",
  "fields.group": "Phân nhóm công thức (group)",
  "fields.groupPlaceholder": "Để trống nghĩa là không phân nhóm",
  "fields.groupHint":
    "Các công thức cùng nhóm được hiển thị gộp lại trong sách công thức",
  "fields.exp": "Kinh nghiệm nhận được (exp)",
  "fields.time": "Thời gian nung chảy (time)",
  "fields.timeHint": "Đơn vị tick, 20 tick = 1 giây",
  "fields.costLevel": "Cấp độ yêu cầu (cost_level)",
  "fields.trimPattern": "Hoa văn trang trí (trim_pattern)",
  "fields.bookCategory": "Phân loại sách công thức",
  "fields.bookCategoryHint": "Cần máy chủ 1.19.3+",
  "fields.unspecified": "Không chỉ định",
  "fields.previewSection": "Thành phẩm giả (không bắt buộc)",
  "fields.previewSlot": "Thành phẩm giả",
  "fields.previewLabel": "Vật phẩm thành phẩm giả",
  "fields.previewHint":
    "Khi chế tạo, ô kết quả sẽ hiển thị vật phẩm này để che thành phẩm thật; người chơi lấy ra vẫn là thành phẩm thật. Để trống thì không ghi fake_result_preview.",
  "fields.copySection": "Quy tắc giữ lại thành phần (không bắt buộc)",
  "fields.copyHint":
    "Các thành phần được chọn sẽ được sao chép từ vật phẩm đầu vào sang thành phẩm, ghi vào copy_components_rules.",
  "fields.copySince": "{name} (cần {since})",
  "fields.removeRule": "Bỏ {name}",

  "category.crafting.building": "Khối xây dựng",
  "category.crafting.redstone": "Vật phẩm đá đỏ",
  "category.crafting.equipment": "Trang bị",
  "category.crafting.misc": "Khác",
  "category.cooking.food": "Thức ăn",
  "category.cooking.blocks": "Khối",
  "category.cooking.misc": "Khác",

  "copyRule.all": "Toàn bộ thành phần",
  "copyRule.enchantments": "Phù phép",
  "copyRule.attributes": "Thuộc tính",
  "copyRule.display_name": "Tên hiển thị",
  "copyRule.lore": "Lore",
  "copyRule.custom_model_data": "Dữ liệu mô hình",
  "copyRule.item_flag": "Cờ vật phẩm",
  "copyRule.unbreakable": "Không thể phá hủy",
  "copyRule.trim": "Hoa văn giáp",
  "copyRule.food": "Thức ăn",
  "copyRule.max_stack_size": "Giới hạn xếp chồng",
  "copyRule.rarity": "Độ hiếm",
  "copyRule.fire_resistance": "Kháng lửa",
  "copyRule.hide_tooltip": "Ẩn chú thích",
  "copyRule.item_name": "Tên vật phẩm",
  "copyRule.tool": "Công cụ",
  "copyRule.item_model": "Mô hình vật phẩm",
  "copyRule.custom_model_data_component": "Thành phần dữ liệu mô hình",

  "itemCategory.building": "Khối xây dựng",
  "itemCategory.ore": "Khoáng vật",
  "itemCategory.tool": "Công cụ",
  "itemCategory.combat": "Chiến đấu",
  "itemCategory.food": "Thức ăn",
  "itemCategory.redstone": "Đá đỏ",
  "itemCategory.brewing": "Pha chế",
  "itemCategory.misc": "Khác",

  "recipeGroup.crafting": "Chế tạo",
  "recipeGroup.smelting": "Nung chảy",
  "recipeGroup.smithing": "Rèn",
  "recipeGroup.processing": "Gia công",

  "recipeType.vanilla_shaped": "Công thức có thứ tự",
  "recipeType.vanilla_shaped.summary":
    "Đặt nguyên liệu theo hình dạng 3×3, vị trí quyết định có chế tạo được hay không.",
  "recipeType.vanilla_shapeless": "Công thức không thứ tự",
  "recipeType.vanilla_shapeless.summary":
    "Chỉ cần đủ nguyên liệu là chế tạo được, không giới hạn vị trí đặt.",
  "recipeType.vanilla_smelting_furnace": "Công thức lò nung",
  "recipeType.vanilla_smelting_furnace.summary":
    "Nung chảy một nguyên liệu trong lò nung, có thể đặt kinh nghiệm và thời gian.",
  "recipeType.vanilla_smelting_blast": "Công thức lò luyện kim",
  "recipeType.vanilla_smelting_blast.summary":
    "Nung chảy riêng cho lò luyện kim, thường dùng cho quặng và kim loại.",
  "recipeType.vanilla_smelting_smoker": "Công thức lò xông khói",
  "recipeType.vanilla_smelting_smoker.summary":
    "Nung chảy riêng cho lò xông khói, thường dùng cho thức ăn.",
  "recipeType.vanilla_smelting_campfire": "Công thức lửa trại",
  "recipeType.vanilla_smelting_campfire.summary":
    "Nung chảy bằng lửa trại, thường lâu hơn lò nung.",
  "recipeType.vanilla_smithing_transform": "Công thức rèn",
  "recipeType.vanilla_smithing_transform.summary":
    "Dùng khuôn mẫu và nguyên liệu bổ trợ để nâng cấp vật phẩm gốc thành vật phẩm mới.",
  "recipeType.vanilla_smithing_trim": "Công thức rèn hoa văn",
  "recipeType.vanilla_smithing_trim.summary":
    "Thêm hoa văn cho giáp, buộc phải chỉ định hoa văn trang trí.",
  "recipeType.vanilla_stonecutting": "Công thức cắt đá",
  "recipeType.vanilla_stonecutting.summary":
    "Cắt một nguyên liệu thành thành phẩm trong máy cắt đá.",
  "recipeType.vanilla_brewing": "Công thức pha chế",
  "recipeType.vanilla_brewing.summary":
    "Dùng nguyên liệu để biến đổi vật phẩm đầu vào bên dưới trong giá pha chế.",
  "recipeType.anvil": "Công thức đe",
  "recipeType.anvil.summary":
    "Gộp hai vật phẩm trên đe, có thể đặt cấp độ yêu cầu.",

  "station.crafting_table": "Bàn chế tạo",
  "station.furnace": "Lò nung",
  "station.blast_furnace": "Lò luyện kim",
  "station.smoker": "Lò xông khói",
  "station.campfire": "Lửa trại",
  "station.smithing_table": "Bàn rèn",
  "station.stonecutter": "Máy cắt đá",
  "station.brewing_stand": "Giá pha chế",
  "station.anvil": "Đe",

  "guiSlot.gridCell": "Ô lưới",
  "guiSlot.gridPosition": "Hàng {row} cột {col}",
  "guiSlot.shapelessIngredient": "Nguyên liệu {index}",
  "guiSlot.ingredient": "Nguyên liệu",
  "guiSlot.result": "Thành phẩm",
  "guiSlot.template": "Khuôn mẫu",
  "guiSlot.base": "Vật phẩm gốc",
  "guiSlot.addition": "Nguyên liệu bổ trợ",
  "guiSlot.anvilBase": "Vật phẩm bên trái",
  "guiSlot.anvilAddition": "Vật phẩm bên phải",
  "guiSlot.brewingInput": "Vật phẩm đầu vào",
  "guiSlot.brewingMiddle": "ô bình giữa",
  "guiSlot.inertFuel":
    "Ô nhiên liệu do người chơi tự đặt, công thức không liên quan",
  "guiSlot.inertBottle":
    "Ô bình hai bên và ô bình giữa dùng cùng một vật phẩm đầu vào",

  "triggerGroup.craft": "Liên quan đến chế tạo",
  "triggerGroup.player": "Sự kiện người chơi",
  "triggerGroup.entity": "Sự kiện thực thể",
  "triggerGroup.block": "Sự kiện khối",
  "triggerGroup.inventory": "Sự kiện vật chứa",

  "triggerType.crafting": "Chế tạo ở bàn chế tạo",
  "triggerType.smithing": "Rèn ở bàn rèn",
  "triggerType.anvil": "Gộp ở đe",
  "triggerType.player_join": "Người chơi vào",
  "triggerType.player_quit": "Người chơi thoát",
  "triggerType.player_death": "Người chơi chết",
  "triggerType.player_respawn": "Người chơi hồi sinh",
  "triggerType.player_interact": "Người chơi tương tác",
  "triggerType.player_advancement": "Đạt thành tựu",
  "triggerType.player_level_change": "Thay đổi cấp độ",
  "triggerType.player_exp_change": "Thay đổi kinh nghiệm",
  "triggerType.player_toggle_sneak": "Bật tắt đi rón rén",
  "triggerType.player_toggle_sprint": "Bật tắt chạy nhanh",
  "triggerType.player_item_consume": "Dùng vật phẩm",
  "triggerType.player_item_held": "Đổi vật phẩm đang cầm",
  "triggerType.player_item_damage": "Vật phẩm bị hao mòn",
  "triggerType.player_item_mend": "Vật phẩm được sửa",
  "triggerType.player_fish": "Câu cá",
  "triggerType.player_teleport": "Dịch chuyển",
  "triggerType.player_portal": "Đi qua cổng dịch chuyển",
  "triggerType.player_changed_world": "Đổi thế giới",
  "triggerType.player_drop_item": "Bỏ vật phẩm",
  "triggerType.player_pickup_item": "Lấy vật phẩm",
  "triggerType.player_game_mode_change": "Đổi chế độ chơi",
  "triggerType.player_recipe_discover": "Mở khóa công thức",
  "triggerType.player_command_preprocess": "Thực thi lệnh",
  "triggerType.player_move": "Người chơi di chuyển",
  "triggerType.player_bed_enter": "Lên giường",
  "triggerType.player_bed_leave": "Rời giường",
  "triggerType.player_swap_hand_items": "Đổi tay chính và tay phụ",
  "triggerType.player_edit_book": "Chỉnh sửa sách",
  "triggerType.player_statistic": "Thay đổi thống kê",
  "triggerType.player_bucket_fill": "Múc vào xô",
  "triggerType.player_bucket_empty": "Đổ xô",
  "triggerType.player_shear_entity": "Cắt lông",
  "triggerType.damage_entity": "Gây sát thương",
  "triggerType.kill_entity": "Tiêu diệt thực thể",
  "triggerType.entity_shoot_bow": "Bắn cung",
  "triggerType.entity_breed": "Động vật sinh sản",
  "triggerType.entity_tame": "Thuần hóa động vật",
  "triggerType.entity_potion_effect": "Thay đổi hiệu ứng thuốc",
  "triggerType.block_break": "Phá khối",
  "triggerType.block_place": "Đặt khối",
  "triggerType.inventory_click": "Nhấn vào vật chứa",
  "triggerType.inventory_open": "Mở vật chứa",
  "triggerType.inventory_close": "Đóng vật chứa",
  "triggerType.player_interact_entity": "Tương tác với thực thể",
  "triggerType.player_animation": "Hoạt ảnh người chơi",
  "triggerType.player_velocity": "Thay đổi tốc độ",
  "triggerType.async_player_chat": "Trò chuyện người chơi",
  "triggerType.player_take_campfire": "Lấy từ đống lửa",
  "triggerType.prepare_grindstone": "Chuẩn bị bàn mài",
  "triggerType.trade_select": "Chọn giao dịch",
  "triggerType.player_interact_at_entity": "Tương tác chính xác với thực thể",
  "triggerType.player_unleash_entity": "Tháo dây dắt",
  "triggerType.player_resource_pack_status": "Trạng thái gói tài nguyên",

  "issue.fileNameEmpty": "Tên tệp công thức không được để trống.",
  "issue.fileNameNeedsRecipeId":
    "Tên tệp có chứa ký tự không hợp lệ. Khi không có recipe_id, plugin sẽ dùng tên tệp làm ID công thức, và như vậy sẽ tải thất bại: hãy dùng chữ thường, chữ số, dấu gạch dưới, dấu gạch nối và dấu chấm, hoặc điền ID công thức bên dưới.",
  "issue.recipeIdPattern":
    "ID công thức chỉ được dùng chữ thường, chữ số, dấu gạch dưới, dấu gạch nối và dấu chấm.",
  "issue.resultMissing": "Chưa đặt thành phẩm (result).",
  "issue.resultMustBeItem":
    "Thành phẩm chỉ có thể là vật phẩm cụ thể, không thể là thẻ hay nhóm vật phẩm.",
  "issue.gridEmpty": "Lưới chế tạo cần có ít nhất một nguyên liệu.",
  "issue.gridTooManyKinds":
    "Số loại nguyên liệu khác nhau vượt quá 9, không thể tạo shape.",
  "issue.shapelessEmpty": "Công thức không thứ tự cần ít nhất một nguyên liệu.",
  "issue.shapelessTooMany":
    "Công thức không thứ tự chỉ nhận tối đa 9 nguyên liệu.",
  "issue.smeltingIngredient": "Chưa đặt nguyên liệu nung chảy (ingredient).",
  "issue.cookingTime": "Thời gian nung chảy phải lớn hơn 0 tick.",
  "issue.expNegative": "Kinh nghiệm không thể là số âm.",
  "issue.stonecuttingIngredient": "Chưa đặt nguyên liệu cắt đá (ingredient).",
  "issue.smithingBase": "Chưa đặt vật phẩm gốc (base).",
  "issue.smithingAddition": "Chưa đặt nguyên liệu bổ trợ (addition).",
  "issue.smithingTemplate":
    "Chưa đặt khuôn mẫu rèn (template), máy chủ 1.20+ thường cần nó.",
  "issue.trimPattern":
    "Công thức rèn hoa văn buộc phải chỉ định hoa văn trang trí (trim_pattern).",
  "issue.brewingInput": "Chưa đặt vật phẩm đầu vào của pha chế (input).",
  "issue.brewingIngredient": "Chưa đặt nguyên liệu pha chế (ingredient).",
  "issue.anvilBase": "Chưa đặt vật phẩm bên trái (base).",
  "issue.anvilAddition": "Chưa đặt vật phẩm bên phải (addition).",
  "issue.costLevelNegative": "Cấp độ yêu cầu không thể là số âm.",
  "issue.packUndefined":
    "Đã tham chiếu nhóm vật phẩm {name} chưa được định nghĩa, hãy tạo nó trong «Nhóm vật phẩm», hoặc xác nhận nó đã tồn tại trên máy chủ.",
  "issue.brewingTagInput":
    "Vật phẩm đầu vào của pha chế đang dùng thẻ, cách khớp theo thẻ của công thức pha chế phụ thuộc vào cách máy chủ triển khai, nên đổi sang vật phẩm cụ thể.",
  "issue.brewingTagIngredient":
    "Nguyên liệu pha chế đang dùng thẻ, cách khớp theo thẻ của công thức pha chế phụ thuộc vào cách máy chủ triển khai, nên đổi sang vật phẩm cụ thể.",
  "issue.packNameEmpty": "Có nhóm vật phẩm chưa được đặt tên.",
  "issue.packNameDuplicate":
    "Tên nhóm vật phẩm {name} bị trùng, cái phía sau sẽ ghi đè cái phía trước.",
  "issue.packNamePattern":
    "Tên nhóm vật phẩm {name} nên chỉ dùng chữ thường, chữ số, dấu gạch dưới và dấu gạch nối.",
  "issue.packItemsEmpty":
    "Nhóm vật phẩm {name} không có vật phẩm nào, plugin sẽ bỏ qua nó.",
  "issue.packNested":
    "Nhóm vật phẩm {name} không thể lồng thêm thẻ hay nhóm vật phẩm, chỉ được điền vật phẩm cụ thể.",
  "issue.triggerIdEmpty": "Có bộ kích hoạt chưa được đặt tên.",
  "issue.triggerIdDuplicate":
    "ID bộ kích hoạt {name} bị trùng, cái phía sau sẽ ghi đè cái phía trước.",
  "issue.triggerIdPattern":
    "ID bộ kích hoạt {name} nên chỉ dùng chữ thường, chữ số, dấu gạch dưới và dấu gạch nối.",
  "issue.triggerTypeMissing":
    "Bộ kích hoạt {name} chưa chọn loại, plugin sẽ bỏ qua nó.",
  "issue.triggerNoActions":
    "Bộ kích hoạt {name} không có hành động nào, khi kích hoạt sẽ không tạo ra hiệu ứng.",
  "issue.triggerCooldownNegative":
    "Thời gian hồi của bộ kích hoạt {name} không thể là số âm.",
  "issue.triggerConditionScript":
    "Dòng {line} trong điều kiện của bộ kích hoạt {name} có lỗi cú pháp; plugin sẽ không tải được.",
  "issue.triggerActionScript":
    "Dòng {line} trong hành động của bộ kích hoạt {name} có lỗi cú pháp; plugin sẽ không tải được.",

  "parse.yamlFailed": "Phân tích YAML thất bại: {detail}",
  "parse.notRecipe":
    "Tệp này không phải là một cấu hình công thức (cấp cao nhất phải là cặp khóa-giá trị).",
  "parse.typeMissing": "Thiếu trường type, không thể xác định loại công thức.",
  "parse.typeUnsupported": "Loại công thức chưa được hỗ trợ: {name}",
  "parse.resultMissing": "Không đọc được result, vui lòng đặt lại thành phẩm.",
  "parse.shapeMissing":
    "Không đọc được shape / ingredients hợp lệ, lưới vẫn để trống.",
  "parse.shapeCharUnmapped":
    "Ký tự {name} trong shape không có nguyên liệu tương ứng.",
  "parse.shapeTooManyRows": "shape vượt quá 3 hàng, chỉ nhập 3 hàng đầu.",
  "parse.ingredientsMissing":
    "Không đọc được ingredients, danh sách nguyên liệu vẫn để trống.",
  "parse.ingredientsTooMany": "Nguyên liệu vượt quá 9 mục, chỉ nhập 9 mục đầu.",
  "parse.amountClamped":
    "Một số số lượng đã được sửa: ô này không đọc số lượng, hoặc giá trị vượt giới hạn {max}.",
  "parse.cookingCategoryUnknown":
    "Phân loại sách công thức nung chảy không nhận dạng được: {name}",
  "parse.craftingCategoryUnknown":
    "Phân loại sách công thức chế tạo không nhận dạng được: {name}",
  "parse.notItemPacks":
    "Tệp này không phải là cấu hình nhóm vật phẩm (cấp cao nhất phải là ánh xạ từ tên nhóm sang danh sách).",
  "parse.packNotList":
    "Giá trị của nhóm vật phẩm {name} không phải là danh sách, đã bỏ qua.",
  "parse.packNoItems":
    "Nhóm vật phẩm {name} không có vật phẩm hợp lệ, đã bỏ qua.",
  "parse.notTriggers":
    "Tệp này không phải là cấu hình bộ kích hoạt (cấp cao nhất phải là ánh xạ từ ID bộ kích hoạt sang cấu hình).",
  "parse.triggerNotMap":
    "Nội dung của bộ kích hoạt {name} không phải là cặp khóa-giá trị, đã bỏ qua.",
  "parse.triggerTypeMissing": "Bộ kích hoạt {name} thiếu type, đã bỏ qua.",
};
