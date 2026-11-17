import { IBM_Plex_Sans, JetBrains_Mono, Oswald } from "next/font/google";

// All three carry Mongolian Ө ө Ү ү (cyrillic-ext), checked against the Google Fonts cmap.
export const display = Oswald({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600", "700"], variable: "--nf-display", display: "swap" });
export const sans = IBM_Plex_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700"], variable: "--nf-sans", display: "swap" });
/** Specs, prices and labels. */
export const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600", "700"], variable: "--nf-mono", display: "swap" });
