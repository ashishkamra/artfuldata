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

## Research and notebook images

- The six non-featured homepage research cards share a 240px image area and
  a 152 × 208px image frame on desktop. Images use centered `object-fit: cover`.
  At widths up to 1000px the frame is 124 × 168px; up to 650px it is
  144 × 196px. Keep the two featured Arlington/CEG cards' separate layout.
- Akshara, Evolution of Values, ASER, LSE, Report Bee, and Kaggle must stay
  visually balanced. Do not restore full-bleed landscape images or the
  three-chart Kaggle strip. Kaggle uses `cyclistic-1.webp`.
- These homepage frames crop previews; the analysis page retains the fuller
  images. Inspect crops for missing subjects, chart labels, and image credits.
- On the analysis page, nutrition previews use the same landscape ratio
  (1400 / 778) and roughly the same size as Cyclistic previews. The four
  nutrition figures form two columns on desktop and one on mobile. Do not
  restore the full-width, very tall nutrition gallery. The food-guide preview
  currently shows its top portion; the full notebook stays linked.
- In mobile research sections, text comes before the preview so an anchor
  lands on a visible heading, not a tall cover image.

## Type

Cormorant Garamond for headings, DM Sans for body, Caveat for short accents.
Do not hyphenate category labels with `overflow-wrap: anywhere`. German
“Datenvisualisierung” may use a manual soft hyphen only at `Daten-`.

## Check

After a visual change, screenshot the affected section at 1440px and at a
phone width. Confirm the new colour still matches its section, and that the
header has not drifted from the main column.
Scroll each lazy-loaded image into view and wait for `complete` and
`naturalWidth > 0` before measuring or capturing it. A zero-size measurement
before loading is not evidence of the final layout. Compare the whole research
grid, not just an isolated tile.
