import shutil
import os
import re

# 1. نسخ الصور من المجلد المؤقت إلى مجلد الويب الخاص بك
src_dir = r"C:\Users\Support\.gemini\antigravity\brain\3f9a66e9-1428-4424-b41a-3945575f7a17"
dest_dir = r"c:\webs\مستر محمد حسني"

img1_src = "media__1782855291628.jpg"
img1_dest = "img_excellence_final.jpg"  # صورة الرجل والشاب

img2_src = "media__1782855402658.jpg" 
img2_dest = "img_students_final.jpg"    # صورة الطلاب مع الشهادات

try:
    shutil.copy2(os.path.join(src_dir, img1_src), os.path.join(dest_dir, img1_dest))
    print(f"تم بنجاح نسخ {img1_dest}")
except Exception as e:
    print("خطأ في نسخ الصورة الأولى:", e)

try:
    shutil.copy2(os.path.join(src_dir, img2_src), os.path.join(dest_dir, img2_dest))
    print(f"تم بنجاح نسخ {img2_dest}")
except Exception as e:
    print("خطأ في نسخ الصورة الثانية:", e)

# 2. تعديل ملف index.html لتفعيل هذه الصور
html_path = os.path.join(dest_dir, 'index.html')
if os.path.exists(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # تغيير صورة تفوق استثنائي
    content = re.sub(
        r'<img src="[^"]*" alt="Excellence"[^>]*>', 
        f'<img src="{img1_dest}" alt="Excellence" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(255,193,7,0.3)); transition:0.3s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">', 
        content
    )
    
    # تغيير صورة الطلاب المتفوقين
    content = re.sub(
        r'<img src="[^"]*" alt="Students"[^>]*>', 
        f'<img src="{img2_dest}" alt="Students" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2)); transition:0.3s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">', 
        content
    )

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("تم تحديث الكود في index.html بنجاح ليقرأ الصور الجديدة!")
else:
    print("لم يتم العثور على ملف index.html")
