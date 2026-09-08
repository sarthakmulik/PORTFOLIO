import os
import glob
from PIL import Image

src_dir = r"C:\Portfolio\Assets\main"
dest_dir = r"C:\Portfolio\public\assets\main"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

files = sorted(glob.glob(os.path.join(src_dir, "*.png")))

for i, file in enumerate(files):
    frame_index = i + 1
    filename = f"frame-{frame_index:04d}.webp"
    dest_path = os.path.join(dest_dir, filename)
    
    with Image.open(file) as img:
        img.save(dest_path, "WEBP", quality=85)
    print(f"Saved {filename}")

print("Optimization complete!")
