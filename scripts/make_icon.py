import os
from PIL import Image, ImageDraw

RES = r"F:\Data Engineering\Simple EMI calculator\android\app\src\main\res"

BG = (0, 137, 123, 255)        # teal 600 background
BODY = (255, 255, 255, 255)    # white calculator body
DISPLAY = (0, 77, 64, 255)     # dark teal display
BTN = (0, 137, 123, 255)       # teal buttons


def rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)


def draw_calculator(img, scale):
    # draw in 108x108 logical space scaled to img size
    d = ImageDraw.Draw(img)

    # body (rounded rect) centered, within safe zone
    body = (27 * scale, 21 * scale, 81 * scale, 87 * scale)
    rounded(d, body, 9 * scale, BODY)

    # display
    disp = (33 * scale, 27 * scale, 75 * scale, 43 * scale)
    rounded(d, disp, 4 * scale, DISPLAY)

    # button grid: 3 cols x 4 rows
    x0, x1 = 33 * scale, 75 * scale
    y0, y1 = 49 * scale, 81 * scale
    cols, rows = 3, 4
    cw = (x1 - x0) / cols
    rh = (y1 - y0) / rows
    bw, bh = cw * 0.62, rh * 0.62
    for r in range(rows):
        for c in range(cols):
            cx = x0 + cw * (c + 0.5)
            cy = y0 + rh * (r + 0.5)
            bx = (cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2)
            rounded(d, bx, 3 * scale, BTN)


def new_canvas(size):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))


def render_foreground(size):
    scale = size / 108.0
    img = new_canvas(size)
    draw_calculator(img, scale)
    return img


def render_full(size):
    scale = size / 108.0
    img = Image.new("RGBA", (size, size), BG)
    draw_calculator(img, scale)
    return img


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")
    print("wrote", path)


# legacy launcher (48dp) and foreground (108dp) densities
densities = {
    "mdpi": 1.0,
    "hdpi": 1.5,
    "xhdpi": 2.0,
    "xxhdpi": 3.0,
    "xxxhdpi": 4.0,
}

for name, f in densities.items():
    # full legacy icons
    full = render_full(int(48 * f))
    save(full, os.path.join(RES, f"mipmap-{name}", "ic_launcher.png"))
    # round legacy: circular mask
    round_icon = render_full(int(48 * f))
    mask = new_canvas(int(48 * f))
    ImageDraw.Draw(mask).ellipse([0, 0, int(48 * f), int(48 * f)], fill=(255, 255, 255, 255))
    round_icon.putalpha(mask.split()[3])
    save(round_icon, os.path.join(RES, f"mipmap-{name}", "ic_launcher_round.png"))
    # adaptive foreground (108dp)
    fg = render_foreground(int(108 * f))
    save(fg, os.path.join(RES, f"mipmap-{name}", "ic_launcher_foreground.png"))

# PWA favicon (256x256) and og-image
save(render_full(256), os.path.join(r"F:\Data Engineering\Simple EMI calculator", "favicon.png"))

print("done")
