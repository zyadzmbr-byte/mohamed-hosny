import shutil
import os

src_dir = r"C:\Users\Support\.gemini\antigravity\brain\3f9a66e9-1428-4424-b41a-3945575f7a17"
dest_dir = r"c:\webs\مستر محمد حسني"

img1 = "media__1782855291628.jpg"
img2 = "media__1782855402658.jpg"

print("Copying images...")
try:
    shutil.copy2(os.path.join(src_dir, img1), os.path.join(dest_dir, img1))
    print(f"Copied {img1}")
except Exception as e:
    print(e)
    
try:
    shutil.copy2(os.path.join(src_dir, img2), os.path.join(dest_dir, img2))
    print(f"Copied {img2}")
except Exception as e:
    print(e)

print("Done! The images should now load correctly in your web page.")
