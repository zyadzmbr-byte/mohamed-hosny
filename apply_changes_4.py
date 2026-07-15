import re
import os
import glob

# 1. Fix admin.html exam issue
admin_file = "c:/webs/مستر محمد حسني/admin.html"
with open(admin_file, "r", encoding="utf-8") as f:
    admin_content = f.read()

admin_content = admin_content.replace(
    "country: document.getElementById('ex-country').value,",
    "country: 'ALL',"
)

with open(admin_file, "w", encoding="utf-8") as f:
    f.write(admin_content)

# 2. Modify script.js for Primary stage removal
script_file = "c:/webs/مستر محمد حسني/script.js"
with open(script_file, "r", encoding="utf-8") as f:
    script_content = f.read()

script_content = re.sub(
    r"\{\s*title:\s*'(?:المرحلة الابتدائية|الابتدائية|التعليم الأساسي 1|الحلقة الأولى)',\s*grades:\s*\[.*?\]\s*\},?\s*",
    "",
    script_content,
    flags=re.DOTALL
)

with open(script_file, "w", encoding="utf-8") as f:
    f.write(script_content)

# 3. Add Tiktok and Youtube links to index.html
index_file = "c:/webs/مستر محمد حسني/index.html"
with open(index_file, "r", encoding="utf-8") as f:
    index_content = f.read()

old_wa = """<a href="https://wa.me/201234567890" target="_blank" title="تواصل الدعم"
        style="position:fixed; bottom:20px; right:20px; z-index:99999; background:linear-gradient(135deg, #25D366, #128C7E); color:#fff; width:65px; height:65px; border-radius:50%; box-shadow:0 10px 20px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:30px; transition:0.3s; text-decoration:none;">
        <i class="fab fa-whatsapp"></i>
    </a>"""

new_social = """<div style="position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px;">
        <a href="https://youtube.com/@mohamedhosny25?si=3vdYCsH-n3tm0U9l" target="_blank" title="يوتيوب"
            style="background:linear-gradient(135deg, #FF0000, #CC0000); color:#fff; width:65px; height:65px; border-radius:50%; box-shadow:0 10px 20px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:30px; transition:0.3s; text-decoration:none;">
            <i class="fab fa-youtube"></i>
        </a>
        <a href="https://www.tiktok.com/@mhosny8778" target="_blank" title="تيك توك"
            style="background:linear-gradient(135deg, #010101, #333333); color:#fff; width:65px; height:65px; border-radius:50%; box-shadow:0 10px 20px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:30px; transition:0.3s; text-decoration:none;">
            <i class="fab fa-tiktok"></i>
        </a>
        <a href="https://wa.me/201016612010" target="_blank" title="تواصل الدعم"
            style="background:linear-gradient(135deg, #25D366, #128C7E); color:#fff; width:65px; height:65px; border-radius:50%; box-shadow:0 10px 20px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:30px; transition:0.3s; text-decoration:none;">
            <i class="fab fa-whatsapp"></i>
        </a>
    </div>"""

index_content = index_content.replace(old_wa, new_social)

with open(index_file, "w", encoding="utf-8") as f:
    f.write(index_content)


# 4. Color replacements
colors_map = {
    "#12b8c5": "#FFC107",
    "#12B8C5": "#FFC107",
    "%2312b8c5": "%23FFC107",
    "18, 184, 197": "255, 193, 7",
    "18,184,197": "255,193,7",
    "#0e9ba6": "#FF9800",
    "#0E9BA6": "#FF9800",
    "#e8fbff": "#FFF8E1",
    "#E8FBFF": "#FFF8E1",
    "#ebfcfa": "#FFFDE7",
    "#EBFCFA": "#FFFDE7",
    "#f0fbfc": "#FFFDE7",
    "#F0FBFC": "#FFFDE7",
    "rgba(18, 184, 197, ": "rgba(255, 193, 7, "
}

files_to_check = glob.glob("c:/webs/مستر محمد حسني/*.html") + glob.glob("c:/webs/مستر محمد حسني/*.css") + glob.glob("c:/webs/مستر محمد حسني/*.js")

for filepath in files_to_check:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    for old_c, new_c in colors_map.items():
        content = content.replace(old_c, new_c)
        
    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("Done")
