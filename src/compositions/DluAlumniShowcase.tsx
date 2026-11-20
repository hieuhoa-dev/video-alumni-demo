import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Browser3DFrame } from "../components/Browser3DFrame";
import { FloatingCallout } from "../components/FloatingCallout";
import { Intertitle, IntertitleScrim } from "../components/Intertitle";
import { RoleBadge } from "../components/RoleBadge";
import { StudioBackground } from "../components/StudioBackground";
import { ROLES, SCENES, SCENE_STARTS } from "../data/scenesConfig";
import {
  INTERTITLE_FRAMES,
  getCameraPose,
  getRoleAt,
  getRoleStartFrame,
  getTransitionPose,
  poseToTransform,
} from "../lib/camera";
import {
  COLORS,
  FONT_DISPLAY,
  FONT_UI,
  PERSPECTIVE,
  SHADOW_SOFT,
} from "../theme";
import type { SceneConfig } from "../types/timeline";

export type VoiceoverMode = "none" | "perScene" | "single";

export type ShowcaseProps = {
  /** false: dùng khung giữ chỗ thay cho file quay (xem trước khi chưa quay xong). */
  useRecordings: boolean;
  /** none: không âm thanh · perScene: voice-1..8.mp3 · single: voiceover.mp3. */
  voiceover: VoiceoverMode;
  /** Tốc độ phát đã tính sẵn theo id cảnh (do `calculateMetadata` điền). */
  playbackRates: Record<number, number>;
};

export const defaultShowcaseProps: ShowcaseProps = {
  useRecordings: true,
  voiceover: "none",
  playbackRates: {},
};

const glassPill: React.CSSProperties = {
  position: "absolute",
  background: COLORS.white,
  border: `1px solid ${COLORS.line}`,
  boxShadow: SHADOW_SOFT,
};

const BrandChip: React.FC = () => (
  <div
    style={{
      ...glassPill,
      left: 40,
      top: 28,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "12px 34px 12px 14px",
      borderRadius: 999,
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.blue2}, ${COLORS.blueDeep})`,
        color: COLORS.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_DISPLAY,
        fontSize: 40,
        boxShadow: "0 10px 24px -8px rgba(47,107,255,0.55)",
      }}
    >
      D
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 42,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        DLU CONNECT
      </div>
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 26,
          fontWeight: 500,
          color: COLORS.muted,
        }}
      >
        Trường Đại học Đà Lạt
      </div>
    </div>
  </div>
);

/** Chấm tiến trình 8 cảnh; cảnh đang chiếu dài ra và đổ đầy dần. */
const SceneProgress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...glassPill,
        right: 40,
        top: 52,
        display: "flex",
        gap: 14,
        alignItems: "center",
        padding: "18px 28px",
        borderRadius: 999,
      }}
    >
      {SCENES.map((scene, i) => {
        const start = SCENE_STARTS[i];
        const end = start + scene.durationInFrames;
        const active = frame >= start && frame < end;
        const fill = interpolate(frame, [start, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={scene.id}
            style={{
              width: active ? 64 : 26,
              height: 16,
              borderRadius: 8,
              background: COLORS.line,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                background: COLORS.blue,
                borderRadius: 8,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const SceneStage: React.FC<{
  scene: SceneConfig;
  playbackRate: number;
  useRecordings: boolean;
  voiceover: VoiceoverMode;
}> = ({ scene, playbackRate, useRecordings, voiceover }) => {
  const frame = useCurrentFrame();

  const transition = getTransitionPose(scene, frame);
  const camera = getCameraPose(scene, frame);

  const roleId = getRoleAt(scene, frame);
  const role = ROLES[roleId];
  const roleStart = getRoleStartFrame(scene, frame);
  // Pill vai trò chỉ hiện khi đã đăng nhập; trượt vào sau intertitle hoặc sau lúc lật thẻ.
  const pillEnterFrame =
    roleStart > 0 ? roleStart + 10 : scene.intertitle ? INTERTITLE_FRAMES - 8 : 10;

  // Thẻ nổi chỉ nghiêng theo một phần góc camera để tạo thị sai.
  const parallax = `rotateX(${(camera.rotateX + transition.rotateX) * 0.6}deg) rotateY(${
    (camera.rotateY + transition.rotateY) * 0.6
  }deg)`;

  return (
    <AbsoluteFill>
      {voiceover === "perScene" ? <Audio src={staticFile(scene.voiceSrc)} /> : null}

      {/* Sân khấu 3D: khung trình duyệt */}
      <AbsoluteFill
        style={{
          perspective: PERSPECTIVE,
          alignItems: "center",
          justifyContent: "center",
          opacity: transition.opacity,
          filter: transition.blur > 0.05 ? `blur(${transition.blur}px)` : undefined,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: poseToTransform(transition),
            marginTop: 56,
          }}
        >
          <Browser3DFrame
            scene={scene}
            camera={camera}
            playbackRate={playbackRate}
            useRecordings={useRecordings}
          />
        </div>
      </AbsoluteFill>

      {/* Lớp thẻ nổi: không bị zoom, chỉ thị sai nhẹ */}
      <AbsoluteFill style={{ perspective: PERSPECTIVE, opacity: transition.opacity }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: parallax }}>
          {scene.callouts.map((callout, i) => (
            <FloatingCallout key={i} callout={callout} />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>

      {roleId !== "visitor" ? (
        <div style={{ opacity: transition.opacity }}>
          <RoleBadge role={role} enterFrame={pillEnterFrame} />
        </div>
      ) : null}

      <IntertitleScrim scene={scene} />
      <Intertitle scene={scene} />
    </AbsoluteFill>
  );
};

export const DluAlumniShowcase: React.FC<ShowcaseProps> = ({
  useRecordings,
  voiceover,
  playbackRates,
}) => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_UI }}>
      <StudioBackground />

      {voiceover === "single" ? <Audio src={staticFile("audio/voiceover.mp3")} /> : null}

      <Series>
        {SCENES.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            name={`Cảnh ${scene.id} · ${scene.title}`}
          >
            <SceneStage
              scene={scene}
              playbackRate={
                typeof scene.playbackRate === "number"
                  ? scene.playbackRate
                  : (playbackRates[scene.id] ?? 1)
              }
              useRecordings={useRecordings}
              voiceover={voiceover}
            />
          </Series.Sequence>
        ))}
      </Series>

      {/* Lớp phủ cố định, luôn nằm trên khung trình duyệt kể cả khi zoom */}
      <BrandChip />
      <SceneProgress />
    </AbsoluteFill>
  );
};
