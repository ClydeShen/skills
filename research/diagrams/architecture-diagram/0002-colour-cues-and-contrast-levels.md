# Colour cues and contrast have different WCAG levels

Date: 2026-11-06. Status: candidate guidance under the owner's request to borrow WCAG Level A colour standards.

## Conclusion

SC 1.4.1, Use of Color, is Level A: colour cannot be the sole visual means of conveying information or distinguishing an element. SC 1.4.3, Contrast (Minimum), and SC 1.4.11, Non-text Contrast, are Level AA. Do not call their numerical thresholds Level A or claim that a palette makes an entire diagram or document WCAG-conformant. [official]

Use names, containment, line patterns and the Key as redundant cues. Borrow AA contrast as readability guidance: ordinary text 4.5:1; essential graphical parts 3:1 against adjacent colours. The AA large-text exception is 3:1 at 18pt regular or 14pt bold, but rendered image scaling may invalidate that size assumption, so candidate captions retain the 4.5:1 target. Decorative fills are not all essential graphical objects. Logos/logotypes have a text-contrast exception; it does not exempt authored captions or every vendor-styled boundary. Preserve artwork and choose its surroundings carefully. [official criteria; diagram application is project guidance]

## Implementation and limits

Notation now states both levels explicitly. Neutral fallback and generic-boundary outlines use a darker slate; vendor artwork and native boundary styles remain intact. `check-colors.mjs` measures opaque sRGB pairs using WCAG relative luminance, without rounding the ratio before threshold comparisons. It is an on-demand palette tool, not a validator of semantic colour dependence, complex backgrounds, gradients, translucent fills or complete conformance. Existing baseline images are unchanged. Fresh-session output comparison remains pending.

## Opened sources

The published W3C site returned HTTP 403 through this executor, so the official repository source was read instead on 2026-11-06:

- [SC 1.4.1](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/use-of-color.html) and [Understanding Use of Color](https://github.com/w3c/wcag/blob/main/understanding/20/use-of-color.html).
- [SC 1.4.3](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/contrast-minimum.html) and [Understanding Contrast](https://github.com/w3c/wcag/blob/main/understanding/20/contrast-minimum.html).
- [SC 1.4.11](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/non-text-contrast.html) and [Understanding Non-text Contrast](https://github.com/w3c/wcag/blob/main/understanding/21/non-text-contrast.html).
