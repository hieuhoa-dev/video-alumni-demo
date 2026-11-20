import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { cursorAt, speedAt, type CursorTrack } from "../lib/cursor";

const SIZE = 46;
const TIP_X = 2;
const TIP_Y = 2;

/**
 * Con trỏ vẽ lại từ toạ độ chuột đã ghi khi quay: có vệt mờ khi di chuyển nhanh,
 * co lại khi nhấn và vòng sóng lan ra tại điểm click.
 */
export const CursorLayer: React.FC<{ track: CursorTrack }> = ({ track }) => {
  const frame = useCurrentFrame();
  const pos = cursorAt(track, frame);
  const speed = speedAt(track, frame);

  let press = 1;
  for (const c of track.clicks) {
    const d = frame - c;
    if (d >= -2 && d <= 8) {
      press = Math.min(press, interpolate(d, [-2, 1, 8], [1, 0.8, 1], { extrapolateRight: "clamp" }));
    }
  }

  const trail = speed > 2.5 ? [1, 2, 3, 4, 5] : [];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {track.clicks.map((c, i) => {
        const d = frame - c;
        if (d < 0 || d > 22) return null;
        const p = cursorAt(track, c);
        const r = interpolate(d, [0, 22], [14, 78], { extrapolateRight: "clamp" });
        const o = interpolate(d, [0, 22], [0.85, 0], { extrapolateRight: "clamp" });
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: p.x - r,
                top: p.y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                border: `4px solid ${COLORS.blue200}`,
                background: "rgba(75,179,161,0.18)",
                opacity: o,
              }}
            />
          </div>
        );
      })}
      {trail.map((k) => {
        const p = cursorAt(track, frame - k * 1.5);
        return (
          <Img
            key={k}
            src={staticFile("brand/cursor.png")}
            style={{
              position: "absolute",
              left: p.x - TIP_X,
              top: p.y - TIP_Y,
              width: SIZE,
              opacity: 0.16 * (1 - k / 6),
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
      <Img
        src={staticFile("brand/cursor.png")}
        style={{
          position: "absolute",
          left: pos.x - TIP_X,
          top: pos.y - TIP_Y,
          width: SIZE,
          transform: `scale(${press})`,
          transformOrigin: "4% 5%",
          filter: "drop-shadow(0 6px 8px rgba(10,82,90,0.35))",
        }}
      />
    </div>
  );
};
