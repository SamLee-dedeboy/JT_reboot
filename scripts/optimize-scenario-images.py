"""Make web-sized WebP copies of the Future Scenarios photos.

The originals in public/images/scenarios/ are 3,000+ px camera exports of 1-3 MB each,
far more than a full-bleed panel needs. This writes a resized WebP of each into
public/images/scenarios/web/, which the public pages load instead. The originals stay
as the source of truth; rerun this after replacing one.

    python scripts/optimize-scenario-images.py
"""

from pathlib import Path

from PIL import Image

SOURCE = Path('public/images/scenarios')
TARGET = SOURCE / 'web'
# Wide enough for a full-bleed panel on a large, high-density screen.
MAX_WIDTH = 2400
QUALITY = 78

PHOTOS = [
    'cover.jpg',
    'business-as-usual.jpg',
    'outflow.jpg',
    'eco-machine-2.JPG',
    'new-green-watershed.jpg',
    'bolster-fortify-2.JPG',
    'calling-on-reserves.jpg',
    'a-tunnel.jpg',
]


def main() -> None:
    TARGET.mkdir(exist_ok=True)
    for name in PHOTOS:
        source = SOURCE / name
        target = TARGET / f'{source.stem.lower()}.webp'
        with Image.open(source) as image:
            image = image.convert('RGB')
            if image.width > MAX_WIDTH:
                height = round(image.height * MAX_WIDTH / image.width)
                image = image.resize((MAX_WIDTH, height), Image.LANCZOS)
            image.save(target, 'WEBP', quality=QUALITY, method=6)
        print(f'{name}: {source.stat().st_size // 1024} KB -> {target.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
