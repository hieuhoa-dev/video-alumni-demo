import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { buildTrack } from "../lib/cursor";
import { ClosingOverlay, OpeningOverlay } from "../components/BrandOverlays";
import { Browser3DFrame } from "../components/Browser3DFrame";
import { FloatingCallout } from "../components/FloatingCallout";
import { Intertitle, IntertitleScrim } from "../components/Intertitle";
import { RoleBadge } from "../components/RoleBadge";
import { StudioBackground } from "../components/StudioBackground";
import {
  CLOSING_FROM,
  ROLES,
  SCENES,
  SCENES_OFFSET,
  SCENE_STARTS,
  TOTAL_FRAMES,
} from "../data/scenesConfig";
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
    <Img src={staticFile("brand/logo.png")} style={{ width: 76, height: 76, borderRadius: "50%" }} />
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

  const track = React.useMemo(
    () => buildTrack(scene.id, scene.durationInFrames),
    [scene.id, scene.durationInFrames],
  );
  const transition = getTransitionPose(scene, frame);
  const camera = getCameraPose(scene, frame, track);

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
            track={track}
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

type Sfx = { from: number; src: string; volume: number };

/** Dựng danh sách hiệu ứng âm thanh theo mốc thời gian toàn video. */
const buildSfx = (): Sfx[] => {
  const out: Sfx[] = [];
  // Intro
  out.push({ from: 4, src: "sfx/chime.mp3", volume: 0.6 });
  [30, 52, 74, 96].forEach((d) => out.push({ from: d + 10, src: "sfx/pop.mp3", volume: 0.5 }));
  out.push({ from: 160, src: "sfx/riser.mp3", volume: 0.55 });
  out.push({ from: SCENES_OFFSET - 4, src: "sfx/boom.mp3", volume: 0.6 });
  SCENES.forEach((scene, i) => {
    const start = SCENE_STARTS[i];
    if (i > 0) out.push({ from: start - 6, src: "sfx/whoosh.mp3", volume: 0.55 });
    scene.callouts.forEach((c) => out.push({ from: start + c.fromFrame, src: "sfx/pop.mp3", volume: 0.38 }));
    const track = buildTrack(scene.id, scene.durationInFrames);
    track?.clicks.forEach((f) => out.push({ from: start + Math.round(f), src: "sfx/click.mp3", volume: 0.45 }));
  });
  // Outro
  out.push({ from: CLOSING_FROM + 2, src: "sfx/whoosh.mp3", volume: 0.5 });
  out.push({ from: CLOSING_FROM + 30, src: "sfx/chime.mp3", volume: 0.6 });
  out.push({ from: CLOSING_FROM + 170, src: "sfx/whoosh.mp3", volume: 0.4 });
  [210, 226, 242, 258].forEach((d) => out.push({ from: CLOSING_FROM + d, src: "sfx/pop.mp3", volume: 0.45 }));
  out.push({ from: CLOSING_FROM + 300, src: "sfx/chime.mp3", volume: 0.35 });
  return out;
};

const SoundLayer: React.FC<{ voiceover: VoiceoverMode }> = ({ voiceover }) => {
  const sfx = React.useMemo(buildSfx, []);
  const base = voiceover === "none" ? 0.3 : 0.13; // hạ nhạc khi có lời đọc
  return (
    <>
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          base *
          interpolate(f, [0, 90, TOTAL_FRAMES - 180, TOTAL_FRAMES], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {sfx.map((e, i) => (
        <Sequence key={i} from={Math.max(0, e.from)} layout="none">
          <Audio src={staticFile(e.src)} volume={e.volume} />
        </Sequence>
      ))}
    </>
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

      <Sequence from={SCENES_OFFSET} layout="none">
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
      </Sequence>
      <SoundLayer voiceover={voiceover} />

      {/* Lớp phủ cố định, luôn nằm trên khung trình duyệt kể cả khi zoom */}
      <BrandChip />
      <SceneProgress />
      <OpeningOverlay />
      <ClosingOverlay from={CLOSING_FROM} />
    </AbsoluteFill>
  );
};
