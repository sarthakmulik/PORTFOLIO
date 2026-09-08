import os
import glob
from PIL import Image

src_dir  = r"C:\Portfolio\Assets\main"
dest_dir = r"C:\Portfolio\public\assets\main"

os.makedirs(dest_dir, exist_ok=True)

# 1. Clean existing optimized files (the old 52 frames)
old_files = glob.glob(os.path.join(dest_dir, "*.webp"))
for f in old_files:
    try:
        os.remove(f)
    except Exception as e:
        print(f"Error removing {f}: {e}")
print(f"Cleaned {len(old_files)} old frames from {dest_dir}")

# 2. Find and sort new source files
files = sorted(glob.glob(os.path.join(src_dir, "*.png")))
total = len(files)
print(f"Found {total} PNG files in {src_dir}")

# 3. Optimize to WebP
for i, src_path in enumerate(files):
    frame_num = i + 1
    dest_name = f"frame-{frame_num:04d}.webp"
    dest_path = os.path.join(dest_dir, dest_name)

    with Image.open(src_path) as img:
        img.save(dest_path, "WEBP", quality=87, method=6)

    print(f"[{frame_num:>3}/{total}] {os.path.basename(src_path)} -> {dest_name}")

print("\nDone. All 152 Hero frames optimized.")
