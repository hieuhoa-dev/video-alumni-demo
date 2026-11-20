import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { Tone } from "./types/timeline";

/**
 * Font nhúng sẵn trong `public/fonts` (không cần mạng khi render).
 * - Smiley Sans: tiêu đề lớn (hỗ trợ đầy đủ dấu tiếng Việt, giấy phép OFL).
 * - Inter: chữ giao diện nhỏ.
 */
export const FONT_UI = '"Inter LM", Inter, system-ui, sans-serif';
/** Tên ngắn cho chữ giao diện, dùng chung ở các component. */
export const FONT_FAMILY = FONT_UI;
export const FONT_DISPLAY = '"Smiley Sans", "Inter LM", Inter, sans-serif';

loadFont({
  family: "Inter LM",
  url: staticFile("fonts/inter.woff2"),
  weight: "100 900",
}).catch((error) => console.warn("Không nạp được font Inter", error));

loadFont({
  family: "Smiley Sans",
  url: staticFile("fonts/smiley-sans.woff2"),
  weight: "400",
}).catch((error) => console.warn("Không nạp được font Smiley Sans", error));

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
  blue: "#2F6BFF",
  blue500: "#2F6BFF",
  blue200: "#8FB2FF",
  blue2: "#4D8DFF",
  blueDeep: "#1D4ED8",
  blueSoft: "#EAF1FF",
  blueRing: "#8FB2FF",
  emerald: "#10B981",
  emeraldDeep: "#047857",
  emeraldSoft: "#DCFCE7",
  emeraldRing: "#6EE7B7",
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
