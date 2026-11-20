import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SHADOW_DEEP, TONES } from "../theme";
import type { Callout } from "../types/timeline";
import { Icon } from "./Icons";

const ENTER_FRAMES = 24;
const EXIT_FRAMES = 14;

/**
 * Thẻ thông tin nổi: nền trắng tinh khiết, viền 1px, chỉ icon tròn và từ khoá
 * (eyebrow) mang màu accent. Bay phía trước khung trình duyệt (translateZ 60px)
 * và nảy vào theo back.out. Dùng frame cục bộ của cảnh.
 */
export const FloatingCallout: React.FC<{ callout: Callout }> = ({ callout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fromFrame, toFrame } = callout;

  if (frame < fromFrame || frame > toFrame) return null;

  const tone = TONES[callout.tone];
  const local = frame - fromFrame;

  const enter = spring({
    frame: local,
    fps,
    durationInFrames: ENTER_FRAMES,
    config: { damping: 12, stiffness: 140 },
  });
  const exit = interpolate(frame, [toFrame - EXIT_FRAMES, toFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const fromRight = callout.position.right !== undefined;
  const rotateY = interpolate(enter, [0, 1], [fromRight ? -22 : 22, 0]) + exit * (fromRight ? 16 : -16);
  const translateY = interpolate(enter, [0, 1], [60, 0]) + exit * -26 + Math.sin(frame / 22) * 6;
  const opacity = interpolate(enter, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }) * (1 - exit);
  const blur = interpolate(enter, [0, 0.6], [10, 0], { extrapolateRight: "clamp" }) + exit * 8;

  return (
    <div
      style={{
        position: "absolute",
        ...callout.position,
        width: 620,
        display: "flex",
        gap: 26,
        alignItems: "center",
        padding: "26px 34px 26px 26px",
        borderRadius: 28,
        background: COLORS.white,
        border: `1px solid ${COLORS.line}`,
        boxShadow: SHADOW_DEEP,
        transform: `translateZ(60px) translateY(${translateY}px) rotateY(${rotateY}deg)`,
        transformOrigin: fromRight ? "right center" : "left center",
        opacity,
        filter: `blur(${blur}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: tone.soft,
          color: tone.deep,
          boxShadow: `inset 0 0 0 2px ${tone.ring}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={callout.icon} size={50} strokeWidth={2.1} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        {callout.eyebrow ? (
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: tone.deep,
            }}
          >
            {callout.eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.14,
            letterSpacing: "-0.035em",
            color: COLORS.ink,
          }}
        >
          {callout.title}
        </div>
        {callout.body ? (
          <div
            style={{
              fontSize: 29,
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: COLORS.muted,
            }}
          >
            {callout.body}
          </div>
        ) : null}
      </div>
    </div>
  );
};
