---
name: web-asset-monitor
description: Security-print register for web-asset expiry — oxblood ink, celadon security paper, guilloché seals.
colors:
  ink-oxblood: "#48101d"
  ink-700: "#5e1626"
  ink-500: "#7a2033"
  ink-ink: "#2a0b12"
  paper: "#e7ebe3"
  paper-2: "#dde3da"
  paper-3: "#d2d9cf"
  paper-line: "#b9c3b7"
  paper-ink-2: "#55564a"
  field: "#f2f4ee"
  placeholder: "#5e6256"
  on-ink: "#f3ead9"
  on-ink-2: "#d8b7a9"
  ink-line: "#6c2435"
  foil: "#b4893a"
  foil-hi: "#e4c57e"
  foil-deep: "#8a6523"
  seal-green: "#1f6b4f"
  status-valid: "#1f6b4f"
  status-soon: "#a66612"
  status-crit: "#a32a1c"
  status-expired: "#5c1a12"
  status-unknown: "#6a6a5c"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.05rem, 7vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.22em"
  data:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "0.88rem"
    fontWeight: 400
    fontFeature: "tabular-nums"
rounded:
  sheet: "3px"
  field: "2px"
  stamp: "2px"
  seal: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  maxw: "1120px"
components:
  button-foil:
    backgroundColor: "{colors.foil}"
    textColor: "#3a2607"
    rounded: "{rounded.sheet}"
    padding: "12px 22px"
  button-ink:
    backgroundColor: "{colors.ink-oxblood}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.sheet}"
    padding: "12px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-oxblood}"
    rounded: "{rounded.sheet}"
    padding: "12px 22px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink-ink}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-ink}"
    rounded: "{rounded.sheet}"
    padding: "18px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.status-crit}"
    rounded: "{rounded.stamp}"
    padding: "3px 9px"
---

# Design System: web-asset-monitor

## Overview

**Creative North Star: "The Register of Record"**

Every web asset — a domain, a hosting plan, a TLS certificate — is treated as an entry in an official register with a stamped validity period. The interface is a security-printed ledger: ceremony surfaces (masthead, landing hero, footer) are drenched in deep oxblood ink; the working surfaces (the register table, the lodgement forms) sit on a faintly engine-turned celadon security paper. Status is never a pill or a colored dot — it is a drawn wax-style **seal** plus an overprinted rubber **stamp**, the way a real certificate is marked valid or void.

The world deliberately refuses the two defaults this category reaches for: the dark SaaS dashboard (cards + blue accent) and the cream-paper certificate with a high-contrast serif. There is no blue anywhere; there is no cream; the display voice is a heavy grotesque, not a serif. Gravity comes from guilloché line-art, ruled intaglio keylines, gold foil, and monospaced record numerals — the materials of passports and banknotes rendered in saturated ink, not pastel parchment.

It is an administrative instrument that happens to be beautiful: dense and scannable where the user works, loud and singular where the user arrives.

**Key Characteristics:**
- Oxblood ink identity on celadon (never cream) security paper.
- Generative guilloché rosettes (hypotrochoid SVG) and drawn SVG validity seals.
- Status as seal + overprint stamp, color-coded by validity.
- Archivo grotesque display paired with Spline Sans Mono for all record data.
- Depth is printed (rules, keylines, one sheet shadow), not floated.

## Colors

A saturated security-document palette: one deep ink identity, one tinted paper ground, gold foil, and a validity spectrum.

### Primary
- **Oxblood Ink** (`#48101d`): the identity color. Drenches whole regions — masthead, landing hero, footer notice — and inks seals, stamps, and headings on paper. Owns ceremony.

### Secondary
- **Antique Gold Foil** (`#b4893a`, highlight `#e4c57e`, deep `#8a6523`): the metal. The primary action (a foil seal-button), masthead underline, serial numbers, and seal/monogram linework. Rare and earned.
- **Security Green** (`#1f6b4f`): validity — the lit "VALID" seal and stamp.

### Neutral
- **Celadon Security Paper** (`#e7ebe3`, recessed `#dde3da` / `#d2d9cf`): the working ground, carrying a faint engine-turned guilloché tint. Deliberately not cream.
- **Intaglio Hairline** (`#b9c3b7`): ruled column lines, keylines, and dotted field separators.
- **Register Ink** (`#2a0b12`): body text on paper. **Paper Secondary** (`#55564a`): tinted secondary text on paper. **Document Ivory** (`#f3ead9`) and its softer **`#d8b7a9`**: text on oxblood (ivory is a text color here, never a ground).

### Status (validity spectrum)
- **Valid** `#1f6b4f` · **Segera/Soon** `#a66612` (ochre) · **Kritis/Critical** `#a32a1c` (signal red) · **Lewat/Expired** `#5c1a12` (struck dark) · **N/A/Unknown** `#6a6a5c` (dashed).

### Named Rules
**The Oxblood-or-Paper Rule.** A surface is either drenched oxblood (ceremony) or celadon security paper (work). White and cream are never grounds.
**The Status-is-Stamped Rule.** Validity is shown as a drawn seal plus an overprinted stamp in its status color — never a filled pill, a solid badge, or a bare colored dot.
**The Rare-Foil Rule.** Gold foil marks the single most important action and the seals; scattering it dilutes the metal.

## Typography

**Display / Body / UI Font:** Archivo (with system-ui, sans-serif)
**Data / Label Font:** Spline Sans Mono (with ui-monospace, monospace)

**Character:** A heavy, slightly bureaucratic grotesque for voice and headlines, paired with a monospace reserved strictly for record data — dates, day-counts, serial numbers, and tracked legends. The pairing reads as "official form," not "tech startup." The serif a certificate would reflexively use is deliberately absent.

### Hierarchy
- **Display** (Archivo 900, `clamp(2.05rem, 7vw, 5.25rem)`, lh 0.98, ls -0.03em): the landing hero statement only.
- **Headline** (Archivo 800, `clamp(1.5rem, 3.6vw, 2.6rem)`, ls -0.025em): page titles ("Register pemeriksaan", "Daftarkan aset").
- **Title** (Archivo 800, ~1.12rem, ls -0.01em): sheet/panel titles ("Pemeriksaan tunggal").
- **Body** (Archivo 400, 1rem, lh 1.55): prose; measure capped ~64ch.
- **Label** (Spline Sans Mono 600, 0.72rem, ls 0.22em, UPPERCASE): legends, column headers, kickers-as-metadata ("FORM A", "SPESIMEN").
- **Data** (Spline Sans Mono, tabular-nums): all dates, day-counts, serials, stamps.

### Named Rules
**The Numerals-are-Mono Rule.** Every date, day-count, serial, and legend is Spline Sans Mono with `tabular-nums`. Archivo never sets record data; mono never sets prose.

## Layout

Single centered column, `max-width 1120px`, gutter `clamp(16px, 4vw, 40px)`. Ceremony sections (hero, footer) run full-bleed in oxblood with the content column inside. Work sections sit on paper in bordered "sheets" (`.doc`). The register is a 7-column CSS grid on desktop (`44px 48px minmax(170px,1.5fr) 1.05fr 1.05fr 1.2fr auto`) that **reflows to stacked register slips** at ≤760px (serial + seal + domain + stamp, with DOMAIN/SSL/REGISTRAR as labeled dotted rows). The lodgement forms stack vertically within a ~780px column. Breakpoints in use: 560px (hide hero line-break and low-priority specimen columns), 720px (hide masthead sublabel), 760px (register slip reflow), 860px (hero seal drops, single column). Rhythm: tight within a field group, generous between sheets; more space above a heading than below.

## Elevation & Depth

Depth is **printed, not floated**. The system conveys hierarchy through ruled intaglio keylines, a 5px inset inner border on every sheet, guilloché line-art, and the engine-turned paper tint — the vocabulary of security printing. Exactly one drop shadow exists.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 14px 34px -20px rgba(42,11,18,0.55)`): lifts a register sheet (`.doc`) a few millimetres off the paper ground. The foil button carries a smaller warm-cast version.

### Named Rules
**The Printed-Not-Floating Rule.** Separation comes from rules, keylines, and guilloché. Only a register sheet casts a shadow; stamps, seals, chips, and rows never float.

## Shapes

Near-square corners: sheets and buttons `3px`, fields and stamps `2px`. The only circle in the system is the validity **seal**. Borders are structural and visible (ruled columns, intaglio keylines), never a decorative colored side-stripe. Stamps carry a 2px box border and sit at a slight `-4deg` overprint rotation.

## Components

### Buttons
- **Shape:** near-square (`3px`).
- **Primary (foil):** vertical gold-foil gradient (`#e4c57e → #b4893a → #8a6523`), dark-brown text (`#3a2607`), `#8a6523` border, `12px 22px`. The landing "Mulai cek" and form submits.
- **Ink:** oxblood fill, ivory text — secondary confident action.
- **Ghost:** transparent, `#b9c3b7` border, oxblood text; on oxblood grounds it uses an ink-line border and ivory text.
- **Hover / Focus:** `translateY(-1px)` + deepened shadow; `:active` presses `+1px`. Focus-visible = 2px foil ring, 2px offset. Disabled: 0.45 opacity, no transform.

### Inputs / Fields
- **Style:** `#f2f4ee` field, `#b9c3b7` border with a 2px bottom edge (form-rule), `2px` radius. The bulk textarea is ruled with a repeating hairline (a lined form field). Placeholder `#5e6256` (≥4.5:1).
- **Focus:** border shifts to oxblood, background to white — no glow.

### Cards / Containers (register sheets)
- **Corner:** `3px`. **Background:** celadon paper. **Border:** `#b9c3b7` with a 5px inset keyline (`::before`). **Shadow:** the single Sheet-lift. **Padding:** 18px. Headed by a title + a mono legend and a microtext security rule.

### Navigation (masthead)
- Oxblood band, `2px` foil bottom border. Wordmark = a gold monogram seal + "web-asset-monitor" + a mono sublabel ("Register Masa Aktif · Edisi Kerja", hidden ≤720px). Links ivory, hover foil-highlight.

### Validity Seal (signature)
- A circular SVG: double guilloché ring + hypotrochoid rosette + a status-specific drawn mark (check / clock / warning-triangle / cross / dashed ring / question). Valid seals are **lit** (green drop-shadow glow); expired seals are **struck** with a diagonal bar. Sizes ~34–38px in tables, ~76–168px as hero/confirmation marks.

### Status Stamp (signature)
- Monospace uppercase label in a 2px status-colored box, optionally at a `-4deg` overprint with an inner keyline. Tones: VALID / SEGERA / KRITIS / LEWAT / N/A / DIPERIKSA.

## Do's and Don'ts

### Do:
- **Do** drench ceremony surfaces (masthead, hero, footer) in oxblood `#48101d` and keep work surfaces on celadon paper `#e7ebe3`.
- **Do** set every date, day-count, serial, and legend in Spline Sans Mono with `tabular-nums`.
- **Do** show validity as a drawn seal + an overprint stamp in the status color.
- **Do** draw every icon as inline SVG in one consistent stroke weight.
- **Do** convey depth with ruled keylines, the inset sheet border, and guilloché; keep the paper's engine-turned tint faint enough that text stays legible.

### Don't:
- **Don't** introduce white or cream as a ground, or any blue accent.
- **Don't** fall back to a generic SaaS card grid (icon + heading + text) or render status as a filled pill or colored dot.
- **Don't** reach for a serif to signal "certificate" — Archivo grotesque is the display voice; the certificate feeling comes from guilloché, seals, foil, and ruled columns.
- **Don't** float elements with drop shadows; only a register sheet lifts off the ground.
- **Don't** scatter gold foil — it marks the primary action and the seals only.
