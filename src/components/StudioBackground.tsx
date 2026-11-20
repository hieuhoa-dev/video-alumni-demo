import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

/**
 * Nền "Clean Studio Canvas" (LaunchMotion): trắng xám sáng #F4F6FA, lưới kỹ thuật
 * 64px mờ dần ra các góc, quầng sáng xanh nhạt từ đỉnh khung hình.
 * Nằm ngoài `<Series>` nên liền mạch giữa 8 cảnh; lưới trôi rất chậm để có chiều sâu.
 */
export const StudioBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.12) % 64;

  const mask = "radial-gradient(900px 560px at 50% 50%, black, transparent 75%)";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1100px 620px at 50% -10%, rgba(15,110,120,0.12), transparent 70%), radial-gradient(900px 600px at 50% 115%, rgba(15,110,120,0.07), transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: `${-1 + drift}px ${-1 + drift}px`,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
    </AbsoluteFill>
  );
};
