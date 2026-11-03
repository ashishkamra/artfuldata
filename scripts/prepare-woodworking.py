"""Prepare the visually curated Dropbox photos (requires Pillow).

Run from the repository root: python scripts/prepare-woodworking.py
Originals stay in incoming/photos/woodworking-dropbox; only selected WebPs ship.
The first photograph of each project is its cover. Do not select by filename date:
the order below is an editorial selection of finished views, process, and details.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "incoming/photos/woodworking-dropbox"
OUTPUT = ROOT / "public/images/woodworking"
CAPTIONS = {
    "finished": {"en": "Finished view", "de": "Fertige Arbeit"},
    "sketch": {"en": "Design sketch", "de": "Entwurfsskizze"},
    "workshop": {"en": "In the workshop", "de": "In der Werkstatt"},
    "assembly": {"en": "Assembly", "de": "Zusammenbau"},
    "detail": {"en": "Detail", "de": "Detail"},
    "open": {"en": "Open view", "de": "Geöffnete Ansicht"},
    "alternate": {"en": "Another angle", "de": "Weitere Ansicht"},
    "materials": {"en": "Materials and parts", "de": "Materialien und Einzelteile"},
}

# Preserve the source folder names, including their original spelling.
PROJECTS = [
    ("Entryway Chest of Drawers", "entryway-chest-of-drawers", "Entryway Chest of Drawers", "Flurkommode", [
        ("20240521_133300.jpg", "finished"), ("20231011_113214.jpg", "sketch"),
        ("20231021_171751.jpg", "assembly"), ("20231106_174248.jpg", "workshop"),
        ("20240521_133509.jpg", "open"), ("20240521_133618.jpg", "detail"),
    ]),
    ("Shoe cabinet with trifold door", "shoe-cabinet-with-trifold-door", "Shoe Cabinet with Tri-fold Door", "Schuhschrank mit dreifach faltbarer Tür", [
        ("2024-11-28 17.18.15.jpg", "finished"), ("20240827_132057.jpg", "sketch"),
        ("20241024_142802.jpg", "assembly"), ("20241107_180827.jpg", "workshop"),
        ("2026-10-31 12.12.17.jpg", "open"), ("20241118_194116.jpg", "detail"),
    ]),
    ("Bookshelf_1", "bookshelf-1", "Bookshelf 1", "Bücherregal 1", [
        ("2023-09-28 09.08.28.jpg", "finished"), ("20220809_100235.jpg", "sketch"),
        ("20220806_095310.jpg", "workshop"), ("20220830_121808.jpg", "assembly"),
        ("20220909_123714.jpg", "detail"),
    ]),
    ("Bedroom Closet", "bedroom-closet", "Bedroom Closet", "Schlafzimmerschrank", [
        ("PXL_20260614_164633526.MP.jpg", "finished"), ("20181114_191348.jpg", "assembly"),
        ("20181123_212151.jpg", "materials"), ("20190417_192906.jpg", "workshop"),
        ("PXL_20260614_164556524.jpg", "open"),
    ]),
    ("Bookshelf_2", "bookshelf-2", "Bookshelf 2", "Bücherregal 2", [
        ("20230201_155550.jpg", "finished"), ("20221019_172601.jpg", "workshop"),
        ("20221115_095515.jpg", "assembly"), ("20221110_121052.jpg", "detail"),
        ("20221115_112903.jpg", "alternate"),
    ]),
    ("Chess Board with Storage", "chess-board-with-storage", "Chess Board with Storage", "Schachbrett mit Stauraum", [
        ("20231202_212918.jpg", "finished"), ("20231017_180354.jpg", "assembly"),
        ("20231119_213220.jpg", "workshop"), ("20231120_103522.jpg", "open"),
    ]),
    ("Entryway Chest with Tiles", "entryway-chest-with-tiles", "Entryway Chest with Tiles", "Flurkommode mit Fliesen", [
        ("20240521_133234.jpg", "finished"), ("20231018_110658.jpg", "workshop"),
        ("20231016_170002.jpg", "assembly"), ("20231107_172914.jpg", "detail"),
        ("20240521_133618.jpg", "open"),
    ]),
    ("Folding Tiled Shelf", "folding-tiled-shelf", "Folding Tiled Shelf", "Klappregal mit Fliesen", [
        ("20240730_082127.jpg", "finished"), ("20230925_182851.jpg", "materials"),
        ("20230928_112949.jpg", "assembly"), ("20240501_201656.jpg", "detail"),
        ("20240730_082832.jpg", "alternate"),
    ]),
    ("Garden Bench", "garden-bench", "Garden Bench", "Gartenbank", [
        ("2018-06-29 15.01.42.jpg", "finished"), ("20180614_135342.jpg", "materials"),
        ("20180614_135353.jpg", "assembly"), ("20180621_170844 - Copy.jpg", "workshop"),
    ]),
    ("Gorwth scale_John", "growth-scale-john", "Growth Scale — John", "Messlatte — John", [
        ("20190628_191953.jpg", "finished"), ("2019-04-26 17.37.16.jpg", "materials"),
        ("2019-05-08 21.41.35.jpg", "assembly"), ("2019-05-20 17.39.26.jpg", "workshop"),
        ("20190628_192138.jpg", "detail"),
    ]),
    ("Hardware Organiser", "hardware-organiser", "Hardware Organiser", "Werkzeug-Organizer", [
        ("20230806_154447.jpg", "finished"), ("20230723_164029.jpg", "assembly"),
        ("20230726_225959.jpg", "workshop"), ("20230806_154430.jpg", "open"),
    ]),
    ("Hex Holder Set of 3", "hex-holder-set-of-3", "Hex Holder Set of 3", "Drei sechseckige Behälter", [
        ("20221115_122308.jpg", "finished"), ("20221108_141327.jpg", "assembly"),
        ("20221109_152736.jpg", "workshop"), ("20221114_124055.jpg", "detail"),
        ("20221115_122310.jpg", "open"),
    ]),
    ("Hex Keyring Organiser", "hex-keyring-organiser", "Hex Keyring Organiser", "Sechseckiges Schlüsselbrett", [
        ("59974.jpg", "finished"), ("20221115_164205.jpg", "assembly"),
    ]),
    ("Hex Modular Shelves", "hex-modular-shelves", "Hex Modular Shelves", "Modulare Sechseckregale", [
        ("2026-10-31 11.33.47.jpg", "finished"), ("20221102_172726.jpg", "assembly"),
        ("20230714_175235.jpg", "workshop"), ("20230924_000025.jpg", "detail"),
        ("20240401_143604.jpg", "alternate"), ("20231210_195724.jpg", "finished"),
    ]),
    ("IKEA Plastic Chair_Repurpose with old Wood", "repurposed-ikea-chair", "IKEA Chair with Reused Wood", "IKEA-Stuhl mit wiederverwendetem Holz", [
        ("2021-09-14 12.19.20.jpg", "finished"), ("2021-08-23 10.43.22.jpg", "materials"),
        ("2021-08-23 11.53.41.jpg", "assembly"), ("2021-09-14 12.19.10.jpg", "alternate"),
    ]),
    ("Kitchen Pull out Organisers", "kitchen-pull-out-organisers", "Kitchen Pull-out Organisers", "Ausziehbare Küchen-Organizer", [
        ("20230825_153830.jpg", "finished"), ("20230727_220554.jpg", "sketch"),
        ("20230803_181419.jpg", "assembly"), ("2023-08-08 13.26.01.jpg", "workshop"),
        ("2023-08-25 13.06.40.jpg", "detail"), ("20230825_153657.jpg", "alternate"),
    ]),
    ("Little Reading Light Stand", "reading-light-stand", "Little Reading Light Stand", "Kleine Leselampenhalterung", [
        ("2019-07-17 22.10.09.jpg", "finished"), ("2019-07-14 11.23.51.jpg", "detail"),
        ("2019-07-17 22.08.25.jpg", "alternate"),
    ]),
    ("Multiway Plant Stand_Red", "multiway-plant-stand-red", "Multiway Plant Stand — Red", "Vielseitiger Pflanzenständer — Rot", [
        ("20210706_122833.jpg", "finished"), ("20210618_195151.jpg", "assembly"),
        ("20210618_195259.jpg", "detail"), ("20210622_115632.jpg", "alternate"),
    ]),
    ("Multiway Plant stand_Yellow", "multiway-plant-stand-yellow", "Multiway Plant Stand — Yellow", "Vielseitiger Pflanzenständer — Gelb", [
        ("20221115_182353.jpg", "finished"), ("20221028_134714.jpg", "detail"),
        ("20221031_131424.jpg", "assembly"), ("20221115_111744.jpg", "alternate"),
    ]),
    ("Patio Table", "patio-table", "Patio Table", "Terrassentisch", [
        ("20180624_090722.jpg", "finished"), ("2018-06-07 10.30.33.jpg", "workshop"),
        ("2018-06-24 09.07.11-1.jpg", "detail"),
    ]),
    ("Small Bottle Organiser", "small-bottle-organiser", "Small Bottle Organiser", "Organizer für kleine Flaschen", [
        ("2026-06-14 12.43.21.jpg", "finished"), ("20240809_145322.jpg", "assembly"),
        ("2024-09-18 11.26.34.jpg", "materials"), ("20241120_193302.jpg", "detail"),
        ("2026-06-14 12.43.32.jpg", "open"), ("2026-06-14 12.43.50.jpg", "open"),
    ]),
    ("Sonoma Table_2", "sonoma-table-2", "Sonoma Table 2", "Sonoma-Tisch 2", [
        ("20230921_114039.jpg", "finished"), ("20230718_153702.jpg", "detail"),
        ("20230729_193851.jpg", "workshop"), ("20230921_113614.jpg", "alternate"),
        ("20230921_114029.jpg", "open"),
    ]),
    ("Sonoma Table_Circular Saw_WWProject", "sonoma-table-circular-saw", "Sonoma Table — Circular Saw Project", "Sonoma-Tisch — Kreissägenprojekt", [
        ("2021-09-16 10.45.33.jpg", "finished"), ("20210728_193807.jpg", "materials"),
        ("20210809_164557.jpg", "assembly"), ("20210825_175016.jpg", "workshop"),
        ("2021-09-16 10.46.49.jpg", "open"),
    ]),
    ("Wall Cabinet", "wall-cabinet", "Wall Cabinet", "Wandschrank", [
        ("20221114_224841.jpg", "finished"), ("20220921_141808.jpg", "materials"),
        ("20221007_145025.jpg", "assembly"), ("20221011_114233.jpg", "workshop"),
        ("20221114_164616.jpg", "open"),
    ]),
]


def main():
    # Validate the complete selection before generating anything.
    for folder, _, _, _, photos in PROJECTS:
        for filename, caption in photos:
            if not (SOURCE / folder / filename).is_file():
                raise FileNotFoundError(SOURCE / folder / filename)
            assert caption in CAPTIONS
    data = []
    for folder, slug, en, de, selection in PROJECTS:
        target = OUTPUT / slug
        target.mkdir(parents=True, exist_ok=True)
        photos = []
        for index, (filename, caption) in enumerate(selection, 1):
            with Image.open(SOURCE / folder / filename) as original:
                image = ImageOps.exif_transpose(original).convert("RGB")
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                name = f"{index:02d}.webp"
                image.save(target / name, "WEBP", quality=83, method=6)
                width, height = image.size
                image.thumbnail((720, 720), Image.Resampling.LANCZOS)
                image.save(target / f"{index:02d}-thumb.webp", "WEBP", quality=80, method=6)
                photos.append({
                    "image": f"woodworking/{slug}/{name}",
                    "thumbnail": f"woodworking/{slug}/{index:02d}-thumb.webp",
                    "width": width, "height": height,
                    "thumbnailWidth": image.width, "thumbnailHeight": image.height,
                    "original": filename, "caption": CAPTIONS[caption],
                })
        data.append({"slug": slug, "title": {"en": en, "de": de}, "sourceFolder": folder, "photos": photos})
    manifest = ROOT / "src/artfuldata/content/woodworking.json"
    manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {sum(len(p['photos']) for p in data)} selected photos across {len(data)} projects.")


if __name__ == "__main__":
    main()
