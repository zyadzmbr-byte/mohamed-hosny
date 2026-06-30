import re
import os

with open('admin.html', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = re.sub(r'<div class="form-group">\s*<label>الدولة</label>[\s\S]*?</select>\s*</div>', "", admin_content)
admin_content = re.sub(r'<option value="game">لعبة إلكترونية / ملف HTML</option>', "", admin_content)
admin_content = admin_content.replace('<button onclick="showSection(\'tab-teacher-reports\', this)">تقارير الحصص</button>', "")
admin_content = re.sub(r'<div onclick="showSection\(\'tab-teacher-reports\', this\)"[\s\S]*?تقارير الحصص المشروحة\s*</div>', "", admin_content)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(admin_content)

with open('explore.html', 'r', encoding='utf-8') as f:
    explore_content = f.read()

explore_content = re.sub(r'<div class="country-container">[\s\S]*?</div>\s*</div>\s*<a href="#" class="nav-icon-circle cart-icon"', '<a href="#" class="nav-icon-circle cart-icon"', explore_content)
explore_content = explore_content.replace('media__1782732982554.jpg', 'img_logo.jpg')
explore_content = explore_content.replace('حصون', 'منصة محمد حسني التعلمية')
explore_content = explore_content.replace('HUSOON', '')
explore_content = explore_content.replace("const cCode = localStorage.getItem('spedia_country') || 'EG';", "const cCode = 'EG';")

with open('explore.html', 'w', encoding='utf-8') as f:
    f.write(explore_content)

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = index_content.replace('media__1782732982554.jpg', 'img_logo.jpg')
index_content = re.sub(r'<div class="country-container"[\s\S]*?</div>\s*<!-- Cart -->', '<!-- Cart -->', index_content)
index_content = index_content.replace('حصون', 'منصة محمد حسني التعلمية')
index_content = index_content.replace('HUSOON', '')

body_match = re.search(r'(<!-- 1\. Hero Section -->[\s\S]*?)(</section>\s*<!-- Footer Nav Removed -->)', index_content)

if body_match:
    new_sections = """
    <!-- Hero Section -->
    <section class="section-padding" style="text-align:center; padding-top:40px;">
        <div style="max-width:900px; margin:0 auto 60px auto; overflow:hidden; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.1);">
            <img src="img_hero_man.jpg" alt="Hero Image" style="width:100%; display:block; object-fit:cover; max-height: 80vh;">
        </div>
    </section>

    <!-- Children in Playground -->
    <section class="section-padding" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:50px; max-width:1200px; margin:0 auto; padding-top:40px;">
        <div style="flex:1; min-width:300px; text-align:center;">
            <img src="img_playground.jpg" alt="Playground" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2));">
        </div>
        <div style="flex:1; min-width:300px; text-align:right;">
            <h1 style="font-size:55px; font-weight:900; color:#121e33;">دعم معنوي للطلاب</h1>
        </div>
    </section>

    <!-- Man & Teenager -->
    <section class="section-padding" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:50px; max-width:1200px; margin:0 auto; padding-top:40px; flex-direction:row-reverse;">
        <div style="flex:1; min-width:300px; text-align:center;">
            <img src="WhatsApp Image 2026-06-030 at 11.21.03 PM.jpeg" onerror="this.src='WhatsApp Image 2026-06-30 at 11.21.02 PM.jpeg';" alt="Excellence" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2));">
        </div>
        <div style="flex:1; min-width:300px; text-align:right;">
            <h1 style="font-size:55px; font-weight:900; color:#121e33;">تفوق استثنائي</h1>
        </div>
    </section>

    <!-- Children in Amusement Park -->
    <section class="section-padding" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:50px; max-width:1200px; margin:0 auto; padding-top:40px;">
        <div style="flex:1; min-width:300px; text-align:center;">
            <img src="img_park.jpg" alt="Park" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2));">
        </div>
        <div style="flex:1; min-width:300px; text-align:right;">
            <h1 style="font-size:55px; font-weight:900; color:#121e33;">رحلات ودعم نفسي للطلاب</h1>
        </div>
    </section>
    
    <!-- Chat -->
    <section class="section-padding" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:50px; max-width:1200px; margin:0 auto; padding-top:40px; flex-direction:row-reverse;">
        <div style="flex:1; min-width:300px; text-align:center;">
            <img src="img_chat.jpg" alt="Chat" style="max-width:100%; border-radius:30px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2)); max-height: 80vh;">
        </div>
        <div style="flex:1; min-width:300px; text-align:right;">
            <h1 style="font-size:55px; font-weight:900; color:#121e33;">افضل النتائج</h1>
        </div>
    </section>

    <!-- Students with Certificates -->
    <section class="section-padding" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:50px; max-width:1200px; margin:0 auto; padding-top:40px;">
        <div style="flex:1; min-width:300px; text-align:center;">
            <img src="WhatsApp Image 2026-067-30 at 11.21.02 PM.jpeg" onerror="this.src='WhatsApp Image 20268-06-30 at 11.21.03 PM.jpeg';" alt="Students" style="max-width:100%; border-radius:30px; width:450px; border:10px solid #fff; filter:drop-shadow(0 30px 40px rgba(18,184,197,0.2));">
        </div>
        <div style="flex:1; min-width:300px; text-align:right;">
            <h1 style="font-size:55px; font-weight:900; color:#121e33;">دعم الطلاب المتفوقين</h1>
        </div>
    </section>
"""
    index_content = index_content[:body_match.start()] + new_sections + index_content[body_match.end()-10:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)

print("Done")
