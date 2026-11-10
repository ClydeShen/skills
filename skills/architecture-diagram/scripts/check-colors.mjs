import { existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// WCAG relative luminance for opaque sRGB pairs; no diagram semantics or screenshot inference.
export function contrastRatio(foreground, background) {
  const luminance = (color) => {
    if (!/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)) throw new Error('Use opaque #RGB or #RRGGBB colours.');
    const hex = color.length === 4 ? [...color.slice(1)].map((c) => c + c).join('') : color.slice(1);
    const rgb = [0, 2, 4]
      .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    const [foreground, background, ...extra] = process.argv.slice(2);
    if (!foreground || !background || extra.length)
      throw new Error('Usage: node scripts/check-colors.mjs <foreground> <background>');
    const ratio = contrastRatio(foreground, background);
    console.log(
      JSON.stringify(
        {
          foreground,
          background,
          ratio,
          normal_text_aa: ratio >= 4.5,
          large_text_aa: ratio >= 3,
          essential_graphics_aa: ratio >= 3,
          scope:
            'Opaque sRGB pair only. AA guidance, not a Level A test or a WCAG conformance certificate. Check adjacent backgrounds and rendered size separately.',
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
