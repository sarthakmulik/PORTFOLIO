import os
import glob
from PIL import Image

src_dir  = r"C:\Portfolio\Assets\about"
dest_dir = r"C:\Portfolio\public\assets\about"

os.makedirs(dest_dir, exist_ok=True)

files = sorted(glob.glob(os.path.join(src_dir, "*.png")))
total = len(files)
print(f"Found {total} PNG files")

for i, src_path in enumerate(files):
    frame_num = i + 1
    dest_name = f"frame-{frame_num:04d}.webp"
    dest_path = os.path.join(dest_dir, dest_name)

    with Image.open(src_path) as img:
        img.save(dest_path, "WEBP", quality=87, method=6)

    print(f"[{frame_num:>3}/{total}] {os.path.basename(src_path)} -> {dest_name}")

print("\nDone. All frames optimized.")
