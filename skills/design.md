# Design skill

Use this when changing layout, colour, type, or cards.

## Palette

Keep the set small.

- Paper `#f8f5ee`: homepage, About, and Books. These three must match.
- Ink for body type. “Work &” is `#1a1a1a`. “Interests” is `#c23b2e`.
- Link teal is the only green for links. Do not introduce a second green for
  the Work area.
- Section washes, also used by the matching category tile and inner page:
  - visualization `#e9eee2`
  - research `#f0e5d4`
  - creativity `#eee0d9`
  - community `#e0ece8`
  - courses `#e4d4be`
- No lilac. Courses are warm stone, not purple.
- Dashboard mats, when a mat is still needed, are one warm gray-green. The
  homepage visualization tiles no longer use a separate mat.

Inner-page washes live in `styles/pages.css`. Homepage bands and tiles live in
`styles/home.css`. If you change a section colour, change the tile and the
inner page together.

## Cards

- A visualization tile is one continuous card. The image is full width and
  larger than the title. Do not wrap the text in its own box.
- Do not desaturate the portrait.
- Inner-page cards are cream on the section wash, with a soft shadow. Header
  and main share the same left edge and width.
- Tile bounce runs once on hover. Leave it disabled for touch and
  `prefers-reduced-motion`.

## Type

Cormorant Garamond for headings, DM Sans for body, Caveat for short accents.
Do not hyphenate category labels with `overflow-wrap: anywhere`. German
“Datenvisualisierung” may use a manual soft hyphen only at `Daten-`.

## Check

After a visual change, screenshot the affected section at 1440px and at a
phone width. Confirm the new colour still matches its section, and that the
header has not drifted from the main column.
