"""Genera el logo de Jardín Secreto El Totoral como SVG con el texto en trazos."""
import math
import random
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

W, H = 600, 352


def text_path(font_file, text, size, x, baseline, anchor="middle", tracking=0.0):
    """Devuelve (d, ancho) del texto ya maquetado con HarfBuzz."""
    blob = hb.Blob.from_file_path(font_file)
    face = hb.Face(blob)
    font = hb.Font(face)
    upem = face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True, "calt": True})
    scale = size / upem
    track = tracking * upem
    total = sum(p.x_advance for p in buf.glyph_positions) + track * (len(buf.glyph_positions) - 1)
    width = total * scale
    start = x - width / 2 if anchor == "middle" else x
    tt = TTFont(font_file)
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    pen = SVGPathPen(gs)
    cx = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        ox = start + (cx + pos.x_offset) * scale
        oy = baseline - pos.y_offset * scale
        tp = TransformPen(pen, (scale, 0, 0, -scale, ox, oy))
        gs[name].draw(tp)
        cx += pos.x_advance + track
    return pen.getCommands(), width


def brush_path(x0, x1, y0, y1, seed=7):
    """Pincelada horizontal con bordes y extremos irregulares."""
    rnd = random.Random(seed)
    top, bottom = [], []
    n = 46
    for i in range(n + 1):
        t = i / n
        x = x0 + (x1 - x0) * t
        wobble = math.sin(t * math.pi * 3) * 1.6
        top.append((x, y0 + wobble + rnd.uniform(-1.4, 1.4) + 4 * (1 - math.sin(math.pi * t)) ** 3))
        bottom.append((x, y1 + wobble * 0.6 + rnd.uniform(-1.6, 1.6) - 5 * (1 - math.sin(math.pi * t)) ** 3))
    # extremos deshilachados
    def ragged(xe, direction):
        pts = []
        steps = 9
        for k in range(steps + 1):
            yy = y0 + (y1 - y0) * k / steps
            depth = rnd.uniform(4, 22) if k % 2 else rnd.uniform(0, 6)
            pts.append((xe + direction * depth, yy))
        return pts
    right = ragged(x1, 1)
    left = list(reversed(ragged(x0, -1)))
    pts = top + right + list(reversed(bottom)) + left
    d = "M" + " L".join(f"{px:.1f} {py:.1f}" for px, py in pts) + " Z"
    # vetas de cerdas
    streaks = []
    for k in range(7):
        yy = rnd.uniform(y0 + 6, y1 - 6)
        xs = rnd.uniform(x0 - 8, x0 + 20) if k % 2 else rnd.uniform(x1 - 70, x1 - 40)
        xe = xs + rnd.uniform(25, 55)
        streaks.append(f"M{xs:.1f} {yy:.1f} L{xe:.1f} {yy + rnd.uniform(-1, 1):.1f}")
    return d, streaks


def leaf(base, tip, width, bend):
    """Hoja simétrica de base a punta; bend curva el nervio."""
    (bx, by), (tx, ty) = base, tip
    mx, my = (bx + tx) / 2, (by + ty) / 2
    dx, dy = tx - bx, ty - by
    L = math.hypot(dx, dy)
    nx, ny = -dy / L, dx / L
    c1 = (mx + nx * width + dx * -0.05, my + ny * width + dy * -0.05)
    c2 = (mx - nx * width + dx * 0.05, my - ny * width + dy * 0.05)
    outline = (f"M{bx:.1f} {by:.1f} Q{c1[0]:.1f} {c1[1]:.1f} {tx:.1f} {ty:.1f} "
               f"Q{c2[0]:.1f} {c2[1]:.1f} {bx:.1f} {by:.1f} Z")
    vein = f"M{bx + dx * 0.12:.1f} {by + dy * 0.12:.1f} Q{mx + nx * bend:.1f} {my + ny * bend:.1f} {tx - dx * 0.08:.1f} {ty - dy * 0.08:.1f}"
    return outline, vein


def build(theme):
    dark = "#163d22" if theme == "color" else "#ffffff"
    ink = "#17241a" if theme == "color" else "#ffffff"
    leaf_c = "#3f9a2f"
    banner = "#3a8f30"

    jardin, jw = text_path("ttf/parisienne-400.ttf", "Jardín Secreto", 93, 303, 213)
    totoral, tw = text_path("ttf/satisfy-400.ttf", "El Totoral", 64, 306, 286)
    cabanas, cw = text_path("ttf/montserrat-700.ttf", "CABAÑAS", 29, 306, 340, tracking=1.0)
    banner_d, streaks = brush_path(92, 522, 232, 302)

    l1, v1 = leaf((420, 112), (482, 22), 40, -5)   # hoja grande
    l2, v2 = leaf((416, 104), (378, 46), 27, 4)    # hoja chica
    stem = "M428 138 Q416 124 418 104"

    win = []
    s, g = 19, 5
    cx, cy = 282, 96
    for i in (0, 1):
        for j in (0, 1):
            win.append(f'<rect x="{cx - s - g / 2 + i * (s + g):.1f}" y="{cy - s - g / 2 + j * (s + g):.1f}" width="{s}" height="{s}" rx="1.5"/>')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="logo-title">
  <title id="logo-title">Jardín Secreto · El Totoral · Cabañas</title>
  <g fill="none" stroke="{dark}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <path d="M160 116 L283 22 L432 141"/>
  </g>
  <g fill="{dark}">{"".join(win)}</g>
  <path d="{stem}" fill="none" stroke="{leaf_c}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="{l1}" fill="{leaf_c}"/>
  <path d="{l2}" fill="{leaf_c}"/>
  <g fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity=".9">
    <path d="{v1}"/><path d="{v2}"/>
  </g>
  <path d="{jardin}" fill="{dark}" stroke="{dark}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="{banner_d}" fill="{banner}"/>
  <g stroke="{banner}" stroke-width="2.2" stroke-linecap="round" opacity=".35">{"".join(f'<path d="{s_}"/>' for s_ in streaks)}</g>
  <path d="{totoral}" fill="#ffffff" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="{cabanas}" fill="{ink}"/>
</svg>
''', (jw, tw, cw)


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    for theme, name in (("color", "logo.svg"), ("light", "logo-light.svg")):
        svg, widths = build(theme)
        open(f"{out}/{name}", "w").write(svg)
        print(name, [round(w) for w in widths], len(svg) // 1024, "KB")
