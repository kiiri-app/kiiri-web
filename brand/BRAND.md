# Kiiri brand guide

## The idea

**Kiiri is a little cat that lives on your desktop.** It keeps you company, notices what's going on, and helps when you ask. It's a character first and an AI tool second.

- **Positioning:** the AI companion you *bond with*, not another chat window. Screen-aware AI buddies sell productivity; classic desktop pets sell cuteness. Kiiri is both, and also works with your coding agents.
- **Promise:** "Give your desktop a little company."
- **Proof points:** open source (MIT) · works with Claude Code, Cursor, Codex and any MCP client · sees your screen only when asked · runs fully local with Ollama · macOS, Windows, Linux.

## Name

- Written **Kiiri**: capital K, two i's. Pronounced *kee-ree*.
- *Kiri* (霧) means mist and (桐) is the paulownia tree. The leaf on the cat's head is a paulownia leaf.
- The double **ii** is the cat's face: two pill-shaped eyes with *maro* dot eyebrows. This is the core brand idea, so protect it.
- Domain: `kiiri.app` · GitHub: `kiiri-app` · Handles: `@kiiriapp` (reserve on X, Instagram, TikTok, YouTube, Threads, Bluesky).

## Personality and voice

| Kiiri is | Kiiri is not |
|---|---|
| Warm, a little playful | Cutesy to the point of being annoying |
| Calm, unhurried | Hype-y ("revolutionary AI!!") |
| Honest about limits | Over-promising |
| Short sentences | Corporate |

Writing rules:
- Sell the **character** first and the AI second. Don't open a headline with "AI".
- Talk like a friend sitting next to you. "Kiiri points at it", not "Leverages vision models to localize UI elements".
- Be honest in comparisons. Say what other apps do well.
- English is the main language for the market. Turkish, Japanese and Korean are supported in the app.

## Logo

| File | Use |
|---|---|
| `lockup.svg` | Main logo on light backgrounds |
| `lockup-light.svg` | Main logo on ink or dark photos |
| `icon.svg` / `png/icon-*.png` | App icon, social avatars |
| `favicon.svg` / `png/favicon-*.png` | 16–48 px (bolder features) |
| `wordmark.svg` / `wordmark-light.svg` | When the icon is already nearby |
| `avatar.svg` / `png/avatar-*.png` | GitHub org, X, Discord (full-bleed, survives circle crops) |
| `mascot.svg` | Outlined mascot for light backgrounds |
| `mascot-flat.svg` | Flat mascot for terracotta or ink backgrounds |
| `png/og.png`, `png/social.png` | Link previews (1200×630) and GitHub social preview (1280×640) |

Rules:
- Keep clear space around the logo equal to the height of one eye-dot.
- Minimum size: 20 px tall for the lockup, 16 px for the favicon.
- Don't recolor, stretch, rotate, outline or add shadows to the logo.
- Only the two "ii" dots are terracotta. The last *i* dot matches the letters.

## Color

| Token | Hex | Role |
|---|---|---|
| Terracotta | `#E2673F` | Primary accent, CTAs, the "ii" dots |
| Terracotta dark | `#C4502B` | Pressed states, small text on light |
| Ink | `#2A2522` | Text, outlines, dark sections |
| Fur | `#FDF6E9` | The cat, cards |
| Paper | `#FFFAF1` | Page background |
| Cream | `#F8EFDF` | Section backgrounds |
| Kiri leaf (sage) | `#7E9C77` | Success, "local / private" |
| Butter | `#F4D58D` | Highlights, "working" |
| Blush | `#F2B49B` | Cheeks, inner ears, soft accents |
| Mist | `#DFE8EE` | "Thinking", cool tints |

Ratio: mostly paper and fur, ink for text, terracotta used sparingly so it pops.

## Type

- **Fredoka SemiBold**: headlines and the wordmark (the wordmark is converted to outlines)
- **Nunito**: body text and UI
- **JetBrains Mono**: code, terminal, MCP tool names

All are free (SIL OFL) on Google Fonts.

## Mascot

- **Shape:** soft round head, wider than tall, two upright ears, a small sitting body, and a curled tail.
- **Face:** two vertical pill eyes, two dot eyebrows, a small "ω" mouth and blush cheeks. The eyes can follow the cursor and blink, but keep them pill-shaped.
- **Leaf:** one sage paulownia leaf, tilted, between the ears.
- **Outline:** 7 px ink outline on light backgrounds. No outline on terracotta or ink.
- **States** (for the site and marketing): idle (blink, tail sway), working (bob + sweat drop), happy (hop + sparkles), pointing (terracotta arrow + pulse ring).
- The mascot is an original character. Don't put it next to, or mix it with, other studios' characters.

## Motion

Gentle and springy: 150–250 ms UI transitions, slow idle loops (3–5 s), blinking every ~5 s. Always respect `prefers-reduced-motion`.

## Licensing

The app's code is MIT. **The Kiiri name, logo and mascot are not.** They're trademarks of the project. Put this note in every public repo:

> The Kiiri name, logo and mascot artwork are © Kiiri and are not licensed under MIT. You're welcome to use them to refer to the project.
