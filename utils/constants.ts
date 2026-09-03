// Kolo design tokens as plain JS values, for the handful of places that
// can't take a Tailwind class — recharts `fill`/`stroke` props, inline
// `style` objects, raw SVG attributes. Keep this in sync with the
// `colors.kolo` block in tailwind.config.ts; the two should never drift.

export const koloColors = {
  ink: '#1B2A22',
  inkDark: '#0F1811',

  currency: '#2E6F4D',
  currencyDark: '#25583D',

  mint: '#8FD9B4',

  stamp: '#C2410C',
  stampLight: '#F2A26B',
  stampInk: '#FFF3EA',

  paper: '#FFFDF8',
  paperSoft: '#FBF7EE',
  paperAlt: '#F7F4EE',
  paperAltDark: '#EFE9DA',

  hairline: '#D9CFB8',
  hairlineSoft: '#E4DAC4',
  hairlineDark: '#C9BEA6',

  accentSoft: '#E7B8A0',

  muted: '#6E6152',
  mutedLight: '#8A7F6D',
  placeholder: '#B7AF9D',
} as const;