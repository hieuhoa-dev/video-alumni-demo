import { Easing, interpolate, spring } from "remotion";
import { BROWSER_CONTENT_HEIGHT, BROWSER_WIDTH, FPS } from "../theme";
import type { RoleId, SceneConfig, ZoomTarget } from "../types/timeline";

export type Pose = {
  rotateX: number;
  rotateY: number;
  scale: number;
  translateX: number;
  translateY: number;
  translateZ: number;
  opacity: number;
  blur: number;
};

const ZOOM_RAMP = 24;
const ZOOM_DEPTH = 80;
const FLOAT_AMPLITUDE = 8;
const FLIP_HALF = 12;
const FLIP_IN = 16;
const DEPTH_IN = 26;
const DEPTH_OUT = 22;
const ORBIT_OUT_FRAMES = 150;

/** Thời lượng intertitle ở đầu cảnh (frame). Các cảnh bỏ qua cảnh 1. */
export const INTERTITLE_FRAMES = 60;

const inOut = Easing.inOut(Easing.cubic);
// Tương đương GSAP expo.out / back.out(2.6) trong skill gốc.
export const expoOut = Easing.out(Easing.exp);
export const backOut = Easing.out(Easing.back(2.6));

const IDENTITY: Pose = {
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  opacity: 1,
  blur: 0,
};

/** Trọng số 0..1 của một điểm nhấn tại frame hiện tại (vào/ra mượt). */
export const getZoomWeight = (target: ZoomTarget, frame: number): number => {
  const ramp = Math.min(ZOOM_RAMP, (target.toFrame - target.fromFrame) / 2);
  return interpolate(
    frame,
    [target.fromFrame, target.fromFrame + ramp, target.toFrame - ramp, target.toFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut },
  );
};

/**
 * Tư thế camera: tư thế nền + nghiêng rotateY + nổi lơ lửng ±8px
 * + lao sâu vào điểm nhấn (scale, translateZ 80px, dịch tâm).
 */
export const getCameraPose = (scene: SceneConfig, frame: number): Pose => {
  const keys = scene.cameraKeyframes;
  const frames = keys.map((k) => k.frame);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const base =
    keys.length === 1
      ? keys[0]
      : {
          rotateX: interpolate(frame, frames, keys.map((k) => k.rotateX), clamp),
          rotateY: interpolate(frame, frames, keys.map((k) => k.rotateY), clamp),
          scale: interpolate(frame, frames, keys.map((k) => k.scale), clamp),
        };

  const sway =
    scene.swayDegrees *
    Math.sin((frame / scene.durationInFrames) * Math.PI * 2 * 1.5);
  const floatY = scene.swayDegrees > 0 ? Math.sin(frame / 22) * FLOAT_AMPLITUDE : 0;

  let zoomExtra = 0;
  let depth = 0;
  let dx = 0;
  let dy = 0;
  for (const target of scene.zoomTargets) {
    const w = getZoomWeight(target, frame);
    if (w === 0) continue;
    zoomExtra += w * (target.scale - 1);
    depth += w * ZOOM_DEPTH;
    dx += w * (0.5 - target.x) * BROWSER_WIDTH * target.scale;
    dy += w * (0.5 - target.y) * BROWSER_CONTENT_HEIGHT * target.scale;
  }

  return {
    ...IDENTITY,
    rotateX: base.rotateX,
    rotateY: base.rotateY + sway,
    scale: base.scale + zoomExtra,
    translateX: dx,
    translateY: dy + floatY,
    translateZ: depth,
  };
};

/** Góc lật thẻ (rotateY) của khung trình duyệt khi đổi vai trò. */
export const getFlipAngle = (scene: SceneConfig, frame: number): number => {
  if (scene.intro === "flip" && frame <= FLIP_IN + 6) {
    return interpolate(frame, [0, FLIP_IN + 6], [-90, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.1)),
    });
  }
  for (const change of scene.roleChanges) {
    if (frame >= change.frame - FLIP_HALF && frame < change.frame) {
      return interpolate(frame, [change.frame - FLIP_HALF, change.frame], [0, 90], {
        easing: Easing.in(Easing.cubic),
      });
    }
    if (frame >= change.frame && frame <= change.frame + FLIP_IN) {
      return interpolate(frame, [change.frame, change.frame + FLIP_IN], [-90, 0], {
        easing: Easing.out(Easing.back(1.1)),
      });
    }
  }
  return 0;
};

export const getRoleAt = (scene: SceneConfig, frame: number): RoleId => {
  let role = scene.startRole;
  for (const change of scene.roleChanges) {
    if (frame >= change.frame) role = change.role;
  }
  return role;
};

/** Mốc frame vai trò hiện tại bắt đầu có hiệu lực (dùng để animate badge). */
export const getRoleStartFrame = (scene: SceneConfig, frame: number): number => {
  let start = 0;
  for (const change of scene.roleChanges) {
    if (frame >= change.frame) start = change.frame;
  }
  return start;
};

export const getUrlAt = (scene: SceneConfig, frame: number) => {
  let current = scene.routeChanges[0];
  for (const route of scene.routeChanges) {
    if (frame >= route.frame) current = route;
  }
  return current;
};

/**
 * Hiệu ứng vào/ra của cả cảnh (bao ngoài camera):
 * - orbit: trồi từ dưới lên (y 90→0), mờ 12→0px, xoay -18°/6° về chính diện;
 * - depth: khung mới lật rotateY 16°→0 tiến ra trước, khung cũ thu về chiều sâu
 *   (scale 0.94, mờ 8px, mờ dần);
 * - flip: do `getFlipAngle` xử lý.
 */
export const getTransitionPose = (scene: SceneConfig, frame: number): Pose => {
  const total = scene.durationInFrames;
  const pose: Pose = { ...IDENTITY };

  if (scene.intro === "orbit") {
    const p = spring({
      frame,
      fps: FPS,
      config: { damping: 18, stiffness: 80 },
    });
    pose.rotateY = interpolate(p, [0, 1], [-18, 0]);
    pose.rotateX = interpolate(p, [0, 1], [6, 0]);
    pose.scale = interpolate(p, [0, 1], [0.92, 1]);
    pose.translateY = interpolate(p, [0, 1], [90, 0]);
    pose.blur = Math.max(0, interpolate(p, [0, 1], [12, 0]));
    pose.opacity = interpolate(frame, [0, 12], [0, 1], {
      extrapolateRight: "clamp",
    });
  } else if (scene.intro === "depth") {
    const p = spring({
      frame,
      fps: FPS,
      durationInFrames: DEPTH_IN,
      config: { damping: 20, stiffness: 90 },
    });
    pose.rotateY = interpolate(p, [0, 1], [16, 0]);
    pose.scale = interpolate(p, [0, 1], [0.94, 1]);
    pose.blur = Math.max(0, interpolate(p, [0, 1], [8, 0]));
    pose.opacity = interpolate(frame, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    });
  } else if (scene.intro === "flip") {
    pose.opacity = interpolate(frame, [0, 6], [0, 1], {
      extrapolateRight: "clamp",
    });
  }

  if (scene.outro === "depth") {
    const t = interpolate(frame, [total - DEPTH_OUT, total], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
    pose.scale *= interpolate(t, [0, 1], [1, 0.94]);
    pose.blur += interpolate(t, [0, 1], [0, 8]);
    pose.opacity *= interpolate(t, [0, 1], [1, 0]);
  } else if (scene.outro === "orbit") {
    const p = spring({
      frame: frame - (total - ORBIT_OUT_FRAMES),
      fps: FPS,
      config: { damping: 18, stiffness: 80 },
    });
    pose.rotateY += interpolate(p, [0, 1], [0, 14]);
    pose.rotateX += interpolate(p, [0, 1], [0, 5]);
    pose.scale *= interpolate(p, [0, 1], [1, 0.9]);
  }

  return pose;
};

export const poseToTransform = (pose: Pose): string =>
  `translate3d(${pose.translateX}px, ${pose.translateY}px, ${pose.translateZ}px) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) scale(${pose.scale})`;
