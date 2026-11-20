import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { Tone } from "./types/timeline";

/**
 * Font nhúng sẵn trong `public/fonts` (không cần mạng khi render).
 * - Be Vietnam Pro: tiêu đề lớn (thiết kế cho tiếng Việt, giấy phép OFL).
 * - Inter: chữ giao diện nhỏ.
 */
export const FONT_UI = '"Inter LM", Inter, system-ui, sans-serif';
/** Tên ngắn cho chữ giao diện, dùng chung ở các component. */
export const FONT_FAMILY = FONT_UI;
export const FONT_DISPLAY = '"Be Vietnam Pro", "Inter LM", Inter, sans-serif';

loadFont({
  family: "Inter LM",
  url: staticFile("fonts/inter.woff2"),
  weight: "100 900",
}).catch((error) => console.warn("Không nạp được font Inter", error));

const BVP_RANGES: Record<string, string> = {
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  vietnamese:
    "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
};
for (const weight of ["500", "600", "700", "800"]) {
  for (const subset of ["latin", "vietnamese"]) {
    loadFont({
      family: "Be Vietnam Pro",
      url: staticFile(`fonts/be-vietnam-pro-${subset}-${weight}-normal.woff2`),
      weight,
      unicodeRange: BVP_RANGES[subset],
    }).catch((error) => console.warn("Không nạp được font Be Vietnam Pro", error));
  }
}

export const FPS = 30;
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/** Kích thước khung trình duyệt trên sân khấu 1920x1080. */
export const BROWSER_WIDTH = 1440;
export const BROWSER_TOOLBAR_HEIGHT = 64;
/** Vùng nội dung giữ tỉ lệ 16:9 của file quay màn hình. */
export const BROWSER_CONTENT_HEIGHT = Math.round((BROWSER_WIDTH * 9) / 16);
export const BROWSER_HEIGHT = BROWSER_TOOLBAR_HEIGHT + BROWSER_CONTENT_HEIGHT;

export const BROWSER_HOST = "connect-alumni.vercel.app";

/** Bảng màu LaunchMotion: nền sáng, xanh DLU làm accent, xanh ngọc cho tiến độ. */
export const COLORS = {
  white: "#FFFFFF",
  bg: "#F4F6FA",
  paper: "#F8F9FB",
  surface: "#FFFFFF",
  line: "#E3E8F0",
  ink: "#0B1220",
  muted: "#667085",
  faint: "#98A2B3",
  blue: "#0F6E78",
  blue500: "#0F6E78",
  blue200: "#4BB3A1",
  blue2: "#1E8F96",
  blueDeep: "#0A525A",
  blueSoft: "#E3F3F0",
  blueRing: "#4BB3A1",
  emerald: "#4BB3A1",
  emeraldDeep: "#2E8F80",
  emeraldSoft: "#E3F3F0",
  emeraldRing: "#8ED5C8",
} as const;

export const SHADOWS = {
  card: "0 2px 4px rgba(16,24,40,0.04), 0 40px 90px -40px rgba(16,24,40,0.4)",
  pill: "0 1px 2px rgba(16,24,40,0.05), 0 14px 36px -16px rgba(16,24,40,0.28)",
} as const;

export const SHADOW_DEEP = SHADOWS.card;
export const SHADOW_SOFT = SHADOWS.pill;

export const TONES: Record<Tone, { soft: string; deep: string; ring: string }> = {
  sky: { soft: COLORS.blueSoft, deep: COLORS.blueDeep, ring: COLORS.blueRing },
  pine: { soft: COLORS.emeraldSoft, deep: COLORS.emeraldDeep, ring: COLORS.emeraldRing },
  /** Trung tính, dùng cho khách chưa đăng nhập. */
  sun: { soft: "#F2F4F7", deep: "#475467", ring: "#D0D5DD" },
};

export const PERSPECTIVE = 1400;
