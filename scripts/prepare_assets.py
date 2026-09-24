from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
IMAGES = PUBLIC / "images"


def save_webp(source: str, destination: str, quality: int = 88) -> None:
    image = Image.open(IMAGES / source).convert("RGB")
    image.save(IMAGES / destination, "WEBP", quality=quality, method=6)


def save_icons() -> None:
    logo = Image.open(IMAGES / "logo.png").convert("RGBA")
    for size, filename in (
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (180, "apple-touch-icon.png"),
        (192, "android-chrome-192x192.png"),
        (512, "android-chrome-512x512.png"),
    ):
        logo.resize((size, size), Image.Resampling.LANCZOS).save(PUBLIC / filename, "PNG")
    logo.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    save_webp("hero-source.jpg", "hero.webp")
    save_webp("bosses-source.png", "bosses.webp")
    save_webp("game-overview.png", "gelum.webp")
    save_icons()
