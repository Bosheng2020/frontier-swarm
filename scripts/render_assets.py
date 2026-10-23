#!/usr/bin/env python3
"""Render deterministic repository marketing assets.

Maintainer-only helper. Requires Pillow (`python -m pip install pillow`). It does
not participate in the Frontier Swarm runtime or installation path.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

INK = "#f4f7fb"
MUTED = "#9aa6b7"
BLUE = "#64a8ff"
CYAN = "#5ce1d2"
VIOLET = "#a78bfa"
GREEN = "#72e39d"
PANEL = "#111722"
BORDER = "#2a3547"


def font(size: int, *, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        ["/System/Library/Fonts/SFNSMono.ttf", "/System/Library/Fonts/Menlo.ttc"]
        if mono
        else (
            ["/System/Library/Fonts/SFNS.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"]
            if bold
            else ["/System/Library/Fonts/SFNS.ttf", "/System/Library/Fonts/Supplemental/Arial.ttf"]
        )
    )
    candidates += ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    raise RuntimeError("No compatible system font found")


def gradient(size: tuple[int, int], start: tuple[int, int, int], end: tuple[int, int, int]) -> Image.Image:
    width, height = size
    image = Image.new("RGB", size)
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            amount = (x / width + (height - y) / height) / 2
            pixels[x, y] = tuple(round(a + (b - a) * amount) for a, b in zip(start, end))
    return image


def glow(base: Image.Image, box: tuple[int, int, int, int], color: tuple[int, int, int, int]) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(box, fill=color)
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(85)))


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill: str, outline: str = BORDER, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def center_text(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], value: str, face: ImageFont.FreeTypeFont, fill: str) -> None:
    draw.text(((box[0] + box[2]) / 2, (box[1] + box[3]) / 2), value, font=face, fill=fill, anchor="mm")


def render_social_preview() -> None:
    image = gradient((1280, 640), (7, 10, 16), (15, 25, 43)).convert("RGBA")
    glow(image, (850, -110, 1400, 440), (92, 225, 210, 45))
    glow(image, (-180, 330, 390, 900), (167, 139, 250, 38))
    draw = ImageDraw.Draw(image)

    for x in range(0, 1281, 48):
        draw.line((x, 0, x, 640), fill="#1c2634", width=1)
    for y in range(0, 641, 48):
        draw.line((0, y, 1280, y), fill="#1c2634", width=1)

    rounded(draw, (68, 64, 258, 108), 22, "#152231", "#31506a")
    draw.text((86, 78), "FS / OPEN SOURCE", font=font(14, bold=True, mono=True), fill=CYAN)
    draw.text((65, 128), "Frontier Swarm", font=font(76, bold=True), fill=INK)
    draw.text((70, 228), "Typed handoffs. Durable execution. Independent review.", font=font(29), fill="#cbd5e1")

    stages = [
        ("1×", "PLAN", BLUE, 70, 210),
        ("3×", "SPECIALISTS", CYAN, 350, 255),
        ("2×", "REVIEWERS", VIOLET, 675, 220),
        ("1×", "SYNTHESIZER", GREEN, 965, 245),
    ]
    for index, (count, title, color, x, width) in enumerate(stages):
        box = (x, 343, x + width, 443)
        rounded(draw, box, 18, "#121a27", color, 2)
        draw.text((x + 18, 360), count, font=font(20, bold=True, mono=True), fill=color)
        draw.text((x + 18, 398), title, font=font(17, bold=True, mono=True), fill=INK)
        if index < len(stages) - 1:
            next_x = stages[index + 1][3]
            draw.line((x + width + 10, 393, next_x - 14, 393), fill="#526075", width=2)
            draw.polygon(((next_x - 14, 393), (next_x - 23, 387), (next_x - 23, 399)), fill="#526075")

    rounded(draw, (68, 525, 330, 571), 12, "#121a27")
    draw.text((84, 539), "VERCEL EVE · TYPESCRIPT", font=font(14, bold=True, mono=True), fill=BLUE)
    rounded(draw, (346, 525, 524, 571), 12, "#121a27")
    draw.text((363, 539), "APACHE-2.0", font=font(14, bold=True, mono=True), fill=GREEN)
    draw.text((1210, 540), "github.com/Bosheng2020/frontier-swarm", font=font(16, mono=True), fill=MUTED, anchor="ra")

    output = ASSETS / "social-preview.png"
    image.convert("RGB").save(output, format="PNG", optimize=True)


def stage_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], count: str, title: str, state: int, color: str) -> None:
    active, complete = state == 1, state == 2
    fill = PANEL if not active and not complete else ("#152333" if active else "#13231e")
    outline = color if active or complete else BORDER
    rounded(draw, box, 15, fill, outline, 3 if active else 2)
    draw.text((box[0] + 14, box[1] + 15), count, font=font(15, bold=True, mono=True), fill=color if active or complete else MUTED)
    draw.text((box[0] + 14, box[1] + 52), title, font=font(15, bold=True, mono=True), fill=INK if active or complete else MUTED)
    if complete:
        draw.text((box[2] - 18, box[1] + 17), "✓", font=font(17, bold=True), fill=color, anchor="ra")


def render_demo_frame(phase: int) -> Image.Image:
    image = Image.new("RGB", (1100, 680), "#05070b")
    draw = ImageDraw.Draw(image)
    rounded(draw, (24, 24, 1076, 656), 18, "#0b1018", "#273246", 2)
    draw.rounded_rectangle((24, 24, 1076, 75), radius=18, fill="#111824")
    draw.rectangle((24, 49, 1076, 75), fill="#111824")
    for index, color in enumerate(("#ff6b6b", "#ffcc66", GREEN)):
        draw.ellipse((46 + index * 22, 44, 58 + index * 22, 56), fill=color)
    center_text(draw, (160, 34, 940, 66), "frontier-swarm · offline walkthrough", font(14, mono=True), MUTED)

    draw.text((58, 96), "$ pnpm demo", font=font(19, bold=True, mono=True), fill=CYAN)
    draw.text((58, 130), "Authored execution fixture — no credentials, model calls, or benchmark claims", font=font(14, mono=True), fill=MUTED)

    states = [
        0 if phase < 1 else (1 if phase == 1 else 2),
        0 if phase < 2 else (1 if phase == 2 else 2),
        0 if phase < 3 else (1 if phase == 3 else 2),
        0 if phase < 4 else (1 if phase == 4 else 2),
    ]
    cards = [
        ((58, 197, 253, 289), "01", "PLAN", BLUE),
        ((318, 197, 523, 289), "03", "EXPLORE", CYAN),
        ((588, 197, 783, 289), "02", "REVIEW", VIOLET),
        ((848, 197, 1043, 289), "01", "SYNTHESIZE", GREEN),
    ]
    for index, (box, count, title, color) in enumerate(cards):
        stage_card(draw, box, count, title, states[index], color)
        if index < len(cards) - 1:
            draw.line((box[2] + 10, 243, cards[index + 1][0][0] - 10, 243), fill="#4b596f", width=2)

    if phase >= 2:
        for index, label in enumerate(("Analyst", "Researcher", "Builder")):
            color = CYAN if phase == 2 else GREEN
            box = (315 + index * 88, 309, 397 + index * 88, 337)
            rounded(draw, box, 8, "#101d20", color)
            center_text(draw, box, label, font(10, mono=True), color)
    if phase >= 3:
        for index, label in enumerate(("Critic", "Verifier")):
            color = VIOLET if phase == 3 else GREEN
            box = (590 + index * 96, 309, 676 + index * 96, 337)
            rounded(draw, box, 8, "#191525", color)
            center_text(draw, box, label, font(11, mono=True), color)

    logs = {
        0: ["ready: walking through one bounded orchestration trace"],
        1: ["[plan] objective, constraints, success criteria", "[contract] PlanSchema validated"],
        2: ["[explore] Analyst · Researcher · Builder", "[parallel] three typed specialist packets validated"],
        3: ["[review] Critic · Verifier", "[parallel] counterexamples and requirement checks retained"],
        4: ["[synthesize] reconcile evidence and disagreements", "[contract] FinalAnswerSchema validated"],
        5: [
            "[result] status=completed",
            "[states] completed · completed_with_degradation",
            "[fatal] Planner or Synthesizer failure throws",
        ],
    }[phase]
    rounded(draw, (58, 382, 1043, 548), 14, "#080d14", BORDER)
    for index, value in enumerate(logs):
        draw.text((82, 414 + index * 39), value, font=font(17, bold=index == 0, mono=True), fill=INK if index == 0 else MUTED)
    if phase == 5:
        rounded(draw, (760, 404, 1018, 440), 10, "#102219", GREEN)
        center_text(draw, (760, 404, 1018, 440), "✓ TRACE COMPLETE", font(14, bold=True, mono=True), GREEN)

    center_text(
        draw,
        (58, 593, 1043, 627),
        "OFFLINE DETERMINISTIC WALKTHROUGH · AUTHORED FIXTURE · NOT A BENCHMARK",
        font(13, bold=True, mono=True),
        "#738097",
    )
    return image


def render_demo_gif() -> None:
    frames = [render_demo_frame(phase) for phase in range(6)]
    frames[0].save(
        ASSETS / "frontier-swarm-demo.gif",
        format="GIF",
        save_all=True,
        append_images=frames[1:],
        duration=[1200, 1000, 1400, 1300, 1100, 2800],
        loop=0,
        optimize=True,
        disposal=2,
    )


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    render_social_preview()
    render_demo_gif()
    print("Rendered assets/social-preview.png (1280x640)")
    print("Rendered assets/frontier-swarm-demo.gif (1100x680, offline walkthrough)")


if __name__ == "__main__":
    main()
