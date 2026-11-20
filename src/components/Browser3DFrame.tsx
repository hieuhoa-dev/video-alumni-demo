import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BROWSER_CONTENT_HEIGHT,
  BROWSER_HEIGHT,
  BROWSER_HOST,
  BROWSER_TOOLBAR_HEIGHT,
  BROWSER_WIDTH,
  COLORS,
  FONT_FAMILY,
  TONES,
} from "../theme";
import { ROLES } from "../data/scenesConfig";
import {
  getFlipAngle,
  getRoleAt,
  getUrlAt,
  getZoomWeight,
  poseToTransform,
  type Pose,
} from "../lib/camera";
import type { SceneConfig, ZoomTarget } from "../types/timeline";
import { CursorLayer } from "./CursorLayer";
import { getClickWeight, getFocus, type CursorTrack } from "../lib/cursor";

const TYPE_FRAMES = 12;

const TrafficLights: React.FC = () => (
  <div style={{ display: "flex", gap: 12 }}>
    {["#FDA4AF", "#FCD34D", "#86EFAC"].map((c) => (
      <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />
    ))}
  </div>
);

const UrlBar: React.FC<{ path: string; typedChars: number }> = ({ path, typedChars }) => (
  <div
    style={{
      flex: 1,
      height: 40,
      borderRadius: 20,
      background: COLORS.white,
      border: `1px solid ${COLORS.line}`,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 20px",
      fontFamily: FONT_FAMILY,
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      color: COLORS.ink,
      overflow: "hidden",
      whiteSpace: "nowrap",
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.emerald} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
    <span style={{ color: COLORS.muted }}>{BROWSER_HOST}</span>
    <span>{path.slice(0, typedChars)}</span>
  </div>
);

const PlaceholderScreen: React.FC<{ scene: SceneConfig; path: string }> = ({ scene, path }) => {
  const frame = useCurrentFrame();
  const progress = frame / scene.durationInFrames;
  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
        gap: 14,
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.045em" }}>
        Cảnh {scene.id} · {scene.title}
      </div>
      <div style={{ fontSize: 34, fontWeight: 500, color: COLORS.muted }}>
        public/{scene.videoSrc} (chưa nạp file quay)
      </div>
      <div style={{ fontSize: 34, fontWeight: 600, color: COLORS.blue500 }}>{path}</div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 56,
          height: 12,
          borderRadius: 6,
          background: COLORS.line,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 6,
            background: COLORS.blue500,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Viền sáng + tia quét quanh vùng camera đang lao vào.
 * Tia quét chạy từ trái sang phải một lần khi vùng bắt đầu được phóng to.
 */
const ScanHighlight: React.FC<{ target: ZoomTarget }> = ({ target }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { highlight } = target;
  if (!highlight) return null;

  const w = getZoomWeight(target, frame);
  if (w <= 0.01) return null;

  const width = highlight.width * BROWSER_WIDTH;
  const height = highlight.height * BROWSER_CONTENT_HEIGHT;
  const left = target.x * BROWSER_WIDTH - width / 2;
  const top = target.y * BROWSER_CONTENT_HEIGHT - height / 2;

  const local = frame - target.fromFrame;
  const pop = spring({
    frame: local - 8,
    fps,
    config: { damping: 11, stiffness: 140 },
  });
  const scanX = interpolate(local, [10, 34], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scanOpacity = interpolate(local, [10, 14, 30, 36], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: 24,
        background: "rgba(234,241,255,0.28)",
        boxShadow: `inset 0 0 0 3px ${COLORS.blue200}, 0 0 0 10px rgba(15,110,120,0.10)`,
        opacity: w,
        transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: scanX - 3,
          top: 0,
          width: 6,
          height: "100%",
          borderRadius: 3,
          background: COLORS.blue500,
          boxShadow: "0 0 30px 6px rgba(15,110,120,0.35)",
          opacity: scanOpacity,
        }}
      />
    </div>
  );
};

/**
 * Khung trình duyệt kính mờ bọc file quay màn hình.
 * Tự cập nhật thanh URL theo `routeChanges`, lật thẻ 3D khi đổi vai trò,
 * đổ bóng sâu đa lớp theo góc xoay và vẽ viền sáng + tia quét ở vùng zoom.
 */
export const Browser3DFrame: React.FC<{
  scene: SceneConfig;
  camera: Pose;
  playbackRate: number;
  useRecordings: boolean;
  track?: CursorTrack | null;
}> = ({ scene, camera, playbackRate, useRecordings, track }) => {
  const frame = useCurrentFrame();
  const focusW = track ? getClickWeight(track, frame) : 0;
  const focus = track && focusW > 0 ? getFocus(track, frame) : null;

  const flip = getFlipAngle(scene, frame);
  const route = getUrlAt(scene, frame);
  const role = ROLES[getRoleAt(scene, frame)];
  const tone = TONES[role.tone];

  const typed =
    route.frame === 0
      ? route.url.length
      : Math.floor(
          interpolate(frame - route.frame, [0, TYPE_FRAMES], [0, route.url.length], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }),
        );

  const rotateY = camera.rotateY + flip;
  const shadowX = -rotateY * 2.4;
  const liftScale = 1 + (camera.scale - 1) * 0.5;

  return (
    <div
      style={{
        width: BROWSER_WIDTH,
        height: BROWSER_HEIGHT,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: poseToTransform({ ...camera, rotateY }),
      }}
    >
      {/* Bóng đổ trên mặt sàn, nằm sau khung trên trục Z */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: -64,
          height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(16,24,40,0.22) 0%, rgba(16,24,40,0) 70%)",
          transform: `translateZ(-120px) translateX(${shadowX * 1.5}px) scale(${liftScale})`,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${COLORS.line}`,
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          boxShadow: [
            `${shadowX * 0.3}px 2px 4px rgba(16,24,40,0.04)`,
            `${shadowX}px 40px 90px -40px rgba(16,24,40,0.35)`,
            `0 0 0 1px ${tone.ring}22`,
          ].join(", "),
        }}
      >
        <div
          style={{
            height: BROWSER_TOOLBAR_HEIGHT,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 28px",
            background: COLORS.paper,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          <TrafficLights />
          <UrlBar path={route.url} typedChars={typed} />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: tone.soft,
              color: tone.deep,
              border: `1.5px solid ${tone.ring}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {role.initial}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: BROWSER_WIDTH,
            height: BROWSER_CONTENT_HEIGHT,
            background: COLORS.white,
          }}
        >
          {useRecordings ? (
            <OffthreadVideo
              src={staticFile(scene.videoSrc)}
              playbackRate={playbackRate}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PlaceholderScreen scene={scene} path={route.url} />
          )}
          {track ? null : scene.zoomTargets.map((target, i) => (
            <ScanHighlight key={i} target={target} />
          ))}
          {/* Focus pull: vùng quanh con trỏ nét, phần còn lại mờ và tối nhẹ */}
          {focus ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: `blur(${focusW * 5}px)`,
                background: `rgba(6,40,46,${focusW * 0.16})`,
                WebkitMaskImage: `radial-gradient(circle 230px at ${focus.px}px ${focus.py}px, transparent 0%, transparent 55%, black 100%)`,
                maskImage: `radial-gradient(circle 230px at ${focus.px}px ${focus.py}px, transparent 0%, transparent 55%, black 100%)`,
              }}
            />
          ) : null}
          {track ? <CursorLayer track={track} /> : null}
        </div>
      </div>
    </div>
  );
};
