import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SHADOW_SOFT, TONES } from "../theme";
import type { RoleDefinition } from "../types/timeline";

/**
 * Thẻ pill vai trò: trượt nổi từ cạnh dưới màn hình lên với độ nảy back.out
 * mỗi khi đổi tài khoản. Nền trắng, chỉ avatar tròn mang màu accent.
 */
export const RoleBadge: React.FC<{
  role: RoleDefinition;
  /** Frame cục bộ mà pill bắt đầu trượt vào. */
  enterFrame: number;
}> = ({ role, enterFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tone = TONES[role.tone];

  const p = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 11, stiffness: 120 },
  });
  const translateY = interpolate(p, [0, 1], [170, 0]);
  const opacity = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 36,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${translateY}px)`,
        opacity,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 40px 16px 16px",
          borderRadius: 999,
          background: COLORS.white,
          border: `1px solid ${COLORS.line}`,
          boxShadow: SHADOW_SOFT,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: tone.soft,
            color: tone.deep,
            boxShadow: `inset 0 0 0 2px ${tone.ring}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {role.initial}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              color: COLORS.ink,
              lineHeight: 1.1,
            }}
          >
            {role.label}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: COLORS.muted,
              lineHeight: 1.1,
            }}
          >
            {role.email}
          </div>
        </div>
      </div>
    </div>
  );
};
