import re
import os

files_to_check = ['subjects.html', 'my-subscriptions.html', 'login.html', 'grade.html', 'dashboard.html', 'admin.html']

for file in files_to_check:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace image
        content = content.replace('media__1782732982554.jpg', 'img_logo.jpg')
        
        # Replace Text
        content = content.replace('منصة حصون', 'منصة محمد حسني التعلمية')
        content = content.replace('حصون', 'منصة محمد حسني التعلمية')
        content = content.replace('Husoon', 'Mohamed Hosny')
        content = content.replace('HUSOON', 'Mohamed Hosny')
        
        # Remove country container
        content = re.sub(r'<div class="country-container">[\s\S]*?</div>\s*</div>\s*<a href="#" class="nav-icon-circle cart-icon"', '<a href="#" class="nav-icon-circle cart-icon"', content)
        content = re.sub(r'<div class="country-container"[\s\S]*?</div>\s*<!-- Cart -->', '<!-- Cart -->', content)
        
        # Remove country select in login.html if exists
        content = re.sub(r'<div class="form-group">\s*<label>الدولة</label>[\s\S]*?</select>\s*</div>', '', content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done all replacements")
