import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_DISPLAY, FONT_UI } from "../theme";

const expo = Easing.out(Easing.exp);
const END = 330;
const CX = 960;
const CY = 470;

const NODES = [
  { label: "Sinh viên", x: -620, y: -190, delay: 30 },
  { label: "Cựu sinh viên", x: 620, y: -190, delay: 52 },
  { label: "Doanh nghiệp đối tác", x: -620, y: 210, delay: 74 },
  { label: "Khoa CNTT", x: 620, y: 210, delay: 96 },
];

const Network: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {NODES.map((n, i) => {
      const draw = interpolate(frame, [n.delay, n.delay + 26], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: expo,
      });
      const x2 = CX + n.x;
      const y2 = CY + n.y;
      const len = Math.hypot(n.x, n.y);
      // gói dữ liệu chạy dọc đường nối
      const t = ((frame - n.delay - 30 + i * 9) % 46) / 46;
      const show = frame > n.delay + 30 && t >= 0;
      return (
        <g key={n.label}>
          <line
            x1={CX}
            y1={CY}
            x2={x2}
            y2={y2}
            stroke={COLORS.blue200}
            strokeWidth={3}
            strokeDasharray={`${len}`}
            strokeDashoffset={len * (1 - draw)}
            strokeLinecap="round"
            opacity={0.9}
          />
          {show ? (
            <circle
              cx={CX + n.x * (1 - t)}
              cy={CY + n.y * (1 - t)}
              r={8}
              fill={COLORS.blue}
              opacity={interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0])}
            />
          ) : null}
        </g>
      );
    })}
  </svg>
);

/** Mở đầu: logo trường hiện ra, nối mạng lưới 4 nhóm rồi tan để lộ khung trình duyệt. */
export const OpeningOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > END) return null;

  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 90 } });
  const ring = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp", easing: expo });
  const fade = interpolate(frame, [256, 326], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lift = interpolate(frame, [250, 326], [0, -50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const titleIn = interpolate(frame, [50, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expo,
  });
  const R = 118;
  const circ = 2 * Math.PI * (R + 14);

  return (
    <AbsoluteFill style={{ opacity: fade, transform: `translateY(${lift}px)`, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "rgba(244,246,250,0.94)" }} />
      <Network frame={frame} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={CX}
          cy={CY}
          r={R + 14}
          fill="none"
          stroke={COLORS.blue200}
          strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - ring)}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </svg>
      <Img
        src={staticFile("brand/logo.png")}
        style={{
          position: "absolute",
          left: CX - R,
          top: CY - R,
          width: R * 2,
          height: R * 2,
          borderRadius: "50%",
          transform: `scale(${interpolate(pop, [0, 1], [0.5, 1]) * (1 + Math.sin(frame / 38) * 0.02)})`,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          boxShadow: "0 30px 60px -24px rgba(15,110,120,0.5)",
        }}
      />
      {NODES.map((n) => {
        const p = spring({ frame: frame - n.delay - 10, fps, config: { damping: 14, stiffness: 120 } });
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: CX + n.x,
              top: CY + n.y,
              transform: `translate(-50%,-50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              opacity: p,
              padding: "18px 34px",
              borderRadius: 999,
              background: COLORS.white,
              border: `1.5px solid ${COLORS.blue200}`,
              boxShadow: "0 14px 36px -16px rgba(15,110,120,0.45)",
              fontFamily: FONT_UI,
              fontSize: 34,
              fontWeight: 600,
              color: COLORS.blueDeep,
              whiteSpace: "nowrap",
            }}
          >
            {n.label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 170,
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: "-0.03em",
            color: COLORS.blue,
          }}
        >
          DLU CONNECT
        </div>
        <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 36, color: COLORS.muted, marginTop: 8 }}>
          Mạng lưới Cựu sinh viên &amp; Doanh nghiệp đối tác · Khoa CNTT – Đại học Đà Lạt
        </div>
      </div>
      {["Kết nối", "Chia sẻ", "Cơ hội"].map((w, i) => {
        const a = interpolate(frame, [150 + i * 28, 176 + i * 28], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: expo,
        });
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: CX - 360 + i * 240,
              width: 240,
              textAlign: "center",
              top: CY + 400,
              opacity: a,
              transform: `translateY(${(1 - a) * 24}px)`,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 44,
              color: COLORS.blueDeep,
            }}
          >
            {w}
            {i < 2 ? <span style={{ position: "absolute", right: -6, color: COLORS.blue200 }}>·</span> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Kết: logo, lời kêu gọi rồi trượt lên để lộ thông tin liên hệ. */
export const ClosingOverlay: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  if (local < 0) return null;
  const bg = interpolate(local, [0, 50], [0, 0.97], { extrapolateRight: "clamp" });
  const pop = spring({ frame: local - 24, fps, config: { damping: 13, stiffness: 90 } });
  const t = interpolate(local, [50, 100], [0, 1], { extrapolateRight: "clamp", easing: expo });
  const shift = interpolate(local, [170, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const CONTACT = [
    { k: "Địa chỉ", v: "Tòa nhà A7, Số 01 Phù Đổng Thiên Vương, Phường 8, TP. Đà Lạt, Lâm Đồng" },
    { k: "Hotline hỗ trợ", v: "+84 263 3822 246" },
    { k: "Email", v: "it@dlu.edu.vn" },
    { k: "Giờ làm việc", v: "Thứ Hai – Thứ Sáu · 07:30–11:30 | 13:00–17:00" },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(244,246,250,${bg})` }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${-shift * 235}px) scale(${1 - shift * 0.22})`,
        }}
      >
        <Img
          src={staticFile("brand/logo.png")}
          style={{
            width: 230,
            height: 230,
            borderRadius: "50%",
            transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])})`,
            opacity: pop,
            marginBottom: 36,
            boxShadow: "0 30px 60px -24px rgba(15,110,120,0.5)",
          }}
        />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: "-0.03em",
            color: COLORS.blue,
            opacity: t,
            transform: `translateY(${(1 - t) * 30}px)`,
          }}
        >
          DLU CONNECT
        </div>
        <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 44, color: COLORS.ink, marginTop: 14, opacity: t }}>
          Kết nối thế hệ · Kiến tạo tương lai
        </div>
        <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 32, color: COLORS.muted, marginTop: 10, opacity: t }}>
          Khoa Công nghệ Thông tin – Trường Đại học Đà Lạt
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 220,
          right: 220,
          top: 640,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        {CONTACT.map((c, i) => {
          const a = interpolate(local, [210 + i * 16, 240 + i * 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: expo,
          });
          return (
            <div
              key={c.k}
              style={{
                opacity: a,
                transform: `translateY(${(1 - a) * 30}px)`,
                background: COLORS.white,
                border: `1.5px solid ${COLORS.blue200}`,
                borderRadius: 24,
                padding: "20px 30px",
                boxShadow: "0 14px 36px -18px rgba(15,110,120,0.4)",
              }}
            >
              <div style={{ fontFamily: FONT_UI, fontSize: 24, fontWeight: 600, color: COLORS.blue, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {c.k}
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: 30, fontWeight: 600, color: COLORS.ink, marginTop: 6, lineHeight: 1.25 }}>
                {c.v}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
