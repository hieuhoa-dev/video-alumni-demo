import { BROWSER_CONTENT_HEIGHT, BROWSER_WIDTH } from "../theme";
import { RECORDING_META } from "../data/recordingMeta";

export type TrackPoint = { f: number; x: number; y: number; click: boolean };
export type CursorTrack = { points: TrackPoint[]; clicks: number[] };

/** Chuyển mẫu chuột (giây trong file quay) sang frame cục bộ của cảnh. */
export const buildTrack = (sceneId: number, totalFrames: number): CursorTrack | null => {
  const meta = RECORDING_META[sceneId];
  if (sceneId <= 2 || !meta || meta.track.length < 2) return null;
  const k = totalFrames / meta.duration;
  const points = meta.track.map(([t, x, y, c]) => ({ f: t * k, x, y, click: c === 1 }));
  return { points, clicks: points.filter((p) => p.click).map((p) => p.f) };
};

export const cursorAt = (track: CursorTrack, frame: number) => {
  const pts = track.points;
  if (frame <= pts[0].f) return { x: pts[0].x, y: pts[0].y };
  const last = pts[pts.length - 1];
  if (frame >= last.f) return { x: last.x, y: last.y };
  let lo = 0;
  let hi = pts.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (pts[mid].f <= frame) lo = mid;
    else hi = mid;
  }
  const a = pts[lo];
  const b = pts[hi];
  const u = b.f === a.f ? 0 : (frame - a.f) / (b.f - a.f);
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
};

export const speedAt = (track: CursorTrack, frame: number) => {
  const a = cursorAt(track, frame - 2);
  const b = cursorAt(track, frame + 2);
  return Math.hypot(b.x - a.x, b.y - a.y) / 4;
};

const PRE = 34;
const POST = 44;
const RAMP = 18;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Trọng số zoom 0..1 quanh mọi cú click (lấy max để các click gần nhau không cộng dồn). */
export const getClickWeight = (track: CursorTrack, frame: number): number => {
  let w = 0;
  for (const c of track.clicks) {
    const a = frame - (c - PRE);
    const b = c + POST - frame;
    if (a < 0 || b < 0) continue;
    w = Math.max(w, smooth(Math.min(1, a / RAMP)) * smooth(Math.min(1, b / RAMP)));
  }
  return w;
};

/** Điểm camera bám theo (chuẩn hoá 0..1), kẹp để không lộ mép khung. */
export const getFocus = (track: CursorTrack, frame: number) => {
  const c = cursorAt(track, frame);
  const clamp = (v: number, m: number) => 0.5 + Math.max(-m, Math.min(m, v - 0.5));
  return {
    x: clamp(c.x / BROWSER_WIDTH, 0.2),
    y: clamp(c.y / BROWSER_CONTENT_HEIGHT, 0.2),
    px: c.x,
    py: c.y,
  };
};
