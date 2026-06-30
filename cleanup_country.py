import re

file_path = "c:/webs/مستر محمد حسني/admin.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"window\.updateGrades\((?:'.*?'|null),\s*('.*?'),\s*('.*?')\)", r"window.updateGrades(null, \1, \2)", content)
content = content.replace("اختر الدولة أولاً", "اختر المرحلة")
content = content.replace("اختر الدولة", "اختر المرحلة")
content = content.replace("<th>الدولة</th>", "")
content = content.replace("<th>الدولة/الطالب</th>", "<th>الفئة/الطالب</th>")

content = re.sub(r"<td>\$\{c\.country[^\}]*\}</td>", "", content)
content = content.replace("<td>${f.country || 'EG'}</td>", "")

content = re.sub(
    r"let targetText = ex\.studentCode \? `كود: \$\{ex\.studentCode\}` : \(ex\.country === 'ALL' \? 'كل الدول' : ex\.country\);",
    r"let targetText = ex.studentCode ? `كود: ${ex.studentCode}` : 'الكل';",
    content
)

content = re.sub(
    r"let targetText = l\.studentCode \? `كود: \$\{l\.studentCode\}` : \(l\.country === 'ALL' \? 'كل الدول' : l\.country\);",
    r"let targetText = l.studentCode ? `كود: ${l.studentCode}` : 'الكل';",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

with open("c:/webs/مستر محمد حسني/script.js", "r", encoding="utf-8") as f:
    s_content = f.read()

s_content = re.sub(r"&&\s*\(\!ex\.country\s*\|\|.*?===\s*cCode\)", "", s_content)

with open("c:/webs/مستر محمد حسني/script.js", "w", encoding="utf-8") as f:
    f.write(s_content)
