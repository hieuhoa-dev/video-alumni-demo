import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INTERTITLE_FRAMES, expoOut } from "../lib/camera";
import { COLORS, FONT_DISPLAY, FONT_UI, SHADOW_SOFT } from "../theme";
import type { IntertitleWord, SceneConfig } from "../types/timeline";

const IN_START = 3;
const IN_STAGGER = 4;
const IN_DURATION = 20;
const OUT_START = 38;
const OUT_STAGGER = 2;
const OUT_DURATION = 14;

const powerIn = Easing.in(Easing.poly(3));

const WORD_COLOR: Record<IntertitleWord["tone"], string> = {
  ink: COLORS.ink,
  soft: COLORS.faint,
  accent: COLORS.blueDeep,
};

/**
 * Tấm phủ mờ phía sau chữ để tiêu đề đọc rõ, nằm dưới intertitle.
 * Mờ vào nhanh rồi tan cùng lúc chữ tan.
 */
export const IntertitleScrim: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  if (!scene.intertitle || frame >= INTERTITLE_FRAMES) return null;
  const opacity = interpolate(
    frame,
    [0, 8, INTERTITLE_FRAMES - 16, INTERTITLE_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(244,246,250,0.86)",
        backdropFilter: "blur(12px)",
        opacity,
      }}
    />
  );
};

/**
 * Kinetic typography: mỗi từ hiện lên với blur 14→0px, y 28→0 (expo.out),
 * rồi tan lên trên như bụi mực (y -30, blur 10px) trước khi cảnh quay lộ ra.
 */
export const Intertitle: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const intertitle = scene.intertitle;
  if (!intertitle || frame >= INTERTITLE_FRAMES) return null;

  const progress = (index: number) => {
    const into = interpolate(
      frame,
      [IN_START + index * IN_STAGGER, IN_START + index * IN_STAGGER + IN_DURATION],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: expoOut },
    );
    const out = interpolate(
      frame,
      [OUT_START + index * OUT_STAGGER, OUT_START + index * OUT_STAGGER + OUT_DURATION],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: powerIn },
    );
    return {
      opacity: into * (1 - out),
      y: (1 - into) * 28 + out * -30,
      blur: (1 - into) * 14 + out * 10,
    };
  };

  const eyebrow = progress(0);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 140px",
      }}
    >
      <div
        style={{
          opacity: eyebrow.opacity,
          transform: `translateY(${eyebrow.y}px)`,
          filter: `blur(${eyebrow.blur}px)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          height: 64,
          padding: "0 30px 0 22px",
          borderRadius: 999,
          background: COLORS.white,
          border: `1px solid ${COLORS.line}`,
          boxShadow: SHADOW_SOFT,
          fontFamily: FONT_UI,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: COLORS.muted,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: COLORS.blue,
            boxShadow: "0 0 0 6px rgba(15,110,120,0.16)",
          }}
        />
        {intertitle.eyebrow}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.28em",
          rowGap: 4,
          maxWidth: 1640,
          textAlign: "center",
          fontFamily: FONT_DISPLAY,
          fontSize: 140,
          lineHeight: 1.12,
          fontWeight: 400,
          fontSynthesis: "none",
          letterSpacing: "-0.045em",
        }}
      >
        {intertitle.words.map((word, i) => {
          const p = progress(i);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                color: WORD_COLOR[word.tone],
                opacity: p.opacity,
                transform: `translateY(${p.y}px)`,
                filter: `blur(${p.blur}px)`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
