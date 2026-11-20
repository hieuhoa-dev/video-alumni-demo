import type {
  Callout,
  CameraKeyframe,
  RoleDefinition,
  RoleId,
  SceneConfig,
} from "../types/timeline";
import { RECORDING_META } from "./recordingMeta";

/**
 * Cấu hình 8 cảnh. Tổng = 9000 frame @ 30fps = 300 giây.
 *
 * Các mốc `routeChanges`, `zoomTargets`, `callouts`, `roleChanges` là ước lượng
 * theo kịch bản. Hãy đối chiếu với file quay thật rồi chỉnh số frame cho khớp.
 */

export const ROLES: Record<RoleId, RoleDefinition> = {
  visitor: {
    id: "visitor",
    label: "Khách truy cập",
    email: "Chưa đăng nhập",
    tone: "sun",
    initial: "K",
  },
  student: {
    id: "student",
    label: "Sinh viên",
    email: "student.hoa@khoacntt.edu.vn",
    tone: "sky",
    initial: "S",
  },
  alumni: {
    id: "alumni",
    label: "Cựu sinh viên",
    email: "alumni.le@gmail.com",
    tone: "pine",
    initial: "C",
  },
  employer: {
    id: "employer",
    label: "Doanh nghiệp đối tác",
    email: "hr@vng.com.vn",
    tone: "sun",
    initial: "D",
  },
  staff: {
    id: "staff",
    label: "Quản trị Khoa",
    email: "admin@khoacntt.edu.vn",
    tone: "sky",
    initial: "Q",
  },
};

const FLAT: CameraKeyframe[] = [{ frame: 0, rotateX: 0, rotateY: 0, scale: 1 }];

/** Thẻ nổi bên phải / bên trái, đặt lệch để một phần đè lên khung trình duyệt. */
const RIGHT_TOP = { right: 120, top: 190 };
const RIGHT_BOTTOM = { right: 120, bottom: 120 };
const LEFT_BOTTOM = { left: 120, bottom: 210 };

const scene1Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 330,
    eyebrow: "DLU CONNECT",
    title: "Một nền tảng cho cả cộng đồng",
    body: "Nhà trường, sinh viên, cựu sinh viên, doanh nghiệp",
    icon: "users",
    tone: "sky",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 380,
    toFrame: 630,
    eyebrow: "Trang chủ",
    title: "Banner tin nổi bật của Khoa",
    body: "Sự kiện, tuyển dụng, hoạt động mới",
    icon: "book",
    tone: "pine",
    position: LEFT_BOTTOM,
  },
];

const scene2Callouts: Callout[] = [
  { fromFrame: 70, toFrame: 215, eyebrow: "Trang chủ", title: "Tin tức & sự kiện nổi bật", body: "Cập nhật hoạt động của Khoa", icon: "book", tone: "sun", position: RIGHT_BOTTOM },
  { fromFrame: 255, toFrame: 430, eyebrow: "Trang chủ", title: "Cơ hội nghề nghiệp", body: "Tin tuyển dụng đã được Khoa xác thực", icon: "briefcase", tone: "sky", position: RIGHT_TOP },
  { fromFrame: 490, toFrame: 665, eyebrow: "Trang chủ", title: "Gương mặt cựu sinh viên", body: "Những câu chuyện truyền cảm hứng", icon: "users", tone: "pine", position: LEFT_BOTTOM },
  { fromFrame: 725, toFrame: 900, eyebrow: "Trang chủ", title: "Học bổng doanh nghiệp đồng hành", body: "Theo dõi tiến độ quỹ học bổng", icon: "heart", tone: "sun", position: RIGHT_BOTTOM },
  { fromFrame: 960, toFrame: 1100, eyebrow: "Trang chủ", title: "Mạng lưới doanh nghiệp đối tác", icon: "building", tone: "sky", position: RIGHT_TOP },
  { fromFrame: 1145, toFrame: 1320, eyebrow: "Trang chủ", title: "Thư viện ảnh truyền thống", body: "Khoảnh khắc của các thế hệ DLU", icon: "image", tone: "pine", position: LEFT_BOTTOM },
  { fromFrame: 1380, toFrame: 1760, eyebrow: "Thông tin liên hệ", title: "Liên hệ Khoa CNTT – Đại học Đà Lạt", icon: "building", tone: "sun", position: RIGHT_TOP },
];

const scene3Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 420,
    eyebrow: "Việc làm",
    title: "Lọc tin tuyển dụng & thực tập",
    icon: "briefcase",
    tone: "sky",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 470,
    toFrame: 820,
    eyebrow: "Việc làm",
    title: "Xem chi tiết từng vị trí",
    icon: "building",
    tone: "pine",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 860,
    toFrame: 1180,
    eyebrow: "Việc làm",
    title: "Ứng tuyển ngay trên hệ thống",
    body: "Tin được Khoa duyệt trước khi đăng",
    icon: "shield",
    tone: "sun",
    position: RIGHT_BOTTOM,
  },
];

const scene4Callouts: Callout[] = [
  { fromFrame: 60, toFrame: 300, eyebrow: "Sự kiện", title: "Lịch hội thảo & diễn giả", icon: "calendar", tone: "sky", position: RIGHT_TOP },
  { fromFrame: 360, toFrame: 660, eyebrow: "Quản trị Khoa", title: "Mời cựu sinh viên làm diễn giả", body: "Chọn cựu SV, gửi lời nhắn", icon: "users", tone: "sky", position: LEFT_BOTTOM },
  { fromFrame: 690, toFrame: 880, eyebrow: "Quản trị Khoa", title: "Theo dõi trạng thái lời mời", body: "Đang chờ phản hồi", icon: "clipboard", tone: "sun", position: RIGHT_TOP },
  { fromFrame: 940, toFrame: 1180, eyebrow: "Cựu sinh viên", title: "Nhận lời mời, đồng ý một chạm", icon: "pen", tone: "pine", position: RIGHT_BOTTOM },
  { fromFrame: 1240, toFrame: 1470, eyebrow: "Sự kiện", title: "Diễn giả hiện trên trang sự kiện", body: "Sinh viên đăng ký tham dự", icon: "calendar", tone: "pine", position: RIGHT_TOP },
];

const scene5Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 400,
    eyebrow: "Góc chia sẻ",
    title: "Kinh nghiệm từ cựu sinh viên",
    icon: "book",
    tone: "pine",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 480,
    toFrame: 780,
    eyebrow: "Cựu sinh viên",
    title: "Tra cứu mạng lưới cựu SV",
    icon: "users",
    tone: "sky",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 820,
    toFrame: 1035,
    eyebrow: "Cựu sinh viên",
    title: "Viết bài chia sẻ",
    body: "Khoa duyệt trước khi hiển thị",
    icon: "pen",
    tone: "sun",
    position: RIGHT_BOTTOM,
  },
];

const scene6Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 300,
    eyebrow: "Thư viện ảnh",
    title: "Album ảnh các sự kiện của Khoa",
    icon: "image",
    tone: "sky",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 560,
    toFrame: 890,
    eyebrow: "Thư viện ảnh",
    title: "Xem ảnh toàn màn hình",
    body: "Chuyển ảnh liền mạch trong album",
    icon: "image",
    tone: "pine",
    position: LEFT_BOTTOM,
  },
];

const scene7Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 520,
    eyebrow: "Quỹ học bổng",
    title: "Mục tiêu & tiến độ công khai",
    icon: "heart",
    tone: "sun",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 580,
    toFrame: 880,
    eyebrow: "Cựu sinh viên",
    title: "Cam kết đóng góp",
    icon: "heart",
    tone: "pine",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 940,
    toFrame: 1190,
    eyebrow: "Sinh viên",
    title: "Nộp hồ sơ học bổng trực tuyến",
    icon: "clipboard",
    tone: "sky",
    position: RIGHT_BOTTOM,
  },
];

const scene8Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 540,
    eyebrow: "Doanh nghiệp",
    title: "Hồ sơ công ty, đăng tin, tài trợ",
    icon: "building",
    tone: "sun",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 620,
    toFrame: 1040,
    eyebrow: "Ban quản trị",
    title: "Duyệt doanh nghiệp & tin tuyển dụng",
    icon: "shield",
    tone: "sky",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 1060,
    toFrame: 1290,
    eyebrow: "Ban quản trị",
    title: "Duyệt bài chia sẻ, quản lý sự kiện",
    icon: "calendar",
    tone: "pine",
    position: RIGHT_BOTTOM,
  },
  {
    fromFrame: 1300,
    toFrame: 1640,
    eyebrow: "Ban quản trị",
    title: "Ảnh, banner, chiến dịch học bổng",
    icon: "image",
    tone: "sun",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 1660,
    toFrame: 1790,
    eyebrow: "DLU CONNECT",
    title: "Gắn kết các thế hệ DLU",
    icon: "users",
    tone: "sky",
    position: RIGHT_TOP,
  },
];

const scaleCallouts = (list: Callout[], k: number): Callout[] =>
  list.map((c) => ({ ...c, fromFrame: Math.round(c.fromFrame * k), toFrame: Math.round(c.toFrame * k) }));

const RAW_SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "Mở đầu",
    videoSrc: "recordings/scene-1.mp4",
    voiceSrc: "audio/voice-1.mp3",
    durationInFrames: 660,
    playbackRate: "auto",
    intro: "orbit",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [],
    routeChanges: [{ frame: 0, url: "/" }],
    cameraKeyframes: [
      { frame: 0, rotateX: 0, rotateY: 0, scale: 1 },
      { frame: 750, rotateX: 1, rotateY: 2, scale: 1.02 },
    ],
    swayDegrees: 0,
    zoomTargets: [],
    callouts: scene1Callouts,
  },
  {
    id: 2,
    title: "Trang chủ",
    videoSrc: "recordings/scene-2.jpg",
    still: {
      src: "recordings/scene-2.jpg",
      width: 1739,
      height: 6110,
      travel: 45,
      stops: [
        { y: 0, hold: 190 },
        { y: 940, hold: 190 },
        { y: 1600, hold: 190 },
        { y: 2500, hold: 190 },
        { y: 3100, hold: 140 },
        { y: 3550, hold: 190 },
        { y: 4750, hold: 260 },
        { y: 6110, hold: 90 },
      ],
    },
    voiceSrc: "audio/voice-2.mp3",
    durationInFrames: 1770,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [],
    routeChanges: [{ frame: 0, url: "/" }],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [],
    callouts: scene2Callouts,
    intertitle: {
      eyebrow: "Cảnh 2 / 8",
      words: [
        { text: "Toàn cảnh", tone: "ink" },
        { text: "Trang chủ", tone: "accent" },
      ],
    },
  },
  {
    id: 3,
    title: "Việc làm & Thực tập",
    videoSrc: "recordings/scene-3.mp4",
    voiceSrc: "audio/voice-3.mp3",
    durationInFrames: 1200,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [],
    routeChanges: [
      { frame: 0, url: "/jobs" },
      { frame: 470, url: "/jobs/tin-tuyen-dung" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 100, toFrame: 420, x: 0.3, y: 0.3, scale: 1.22, highlight: { width: 0.42, height: 0.2 } },
      { fromFrame: 520, toFrame: 800, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 880, toFrame: 1160, x: 0.5, y: 0.5, scale: 1.22 },
    ],
    callouts: scene3Callouts,
    intertitle: {
      eyebrow: "Cảnh 3 / 8",
      words: [
        { text: "Việc làm", tone: "ink" },
        { text: "&", tone: "soft" },
        { text: "Thực tập", tone: "accent" },
      ],
    },
  },
  {
    id: 4,
    title: "Sự kiện & Diễn giả cựu SV",
    videoSrc: "recordings/scene-4.mp4",
    voiceSrc: "audio/voice-4.mp3",
    durationInFrames: 1650,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [{ frame: 501, role: "student" }],
    routeChanges: [
      { frame: 0, url: "/events" },
      { frame: 230, url: "/events/chi-tiet" },
      { frame: 501, url: "/student/dashboard" },
      { frame: 700, url: "/student/surveys" },
      { frame: 850, url: "/student/surveys/khao-sat" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 80, toFrame: 330, x: 0.5, y: 0.35, scale: 1.22 },
      { fromFrame: 480, toFrame: 700, x: 0.5, y: 0.45, scale: 1.22, highlight: { width: 0.4, height: 0.22 } },
      { fromFrame: 860, toFrame: 1020, x: 0.5, y: 0.4, scale: 1.22 },
    ],
    callouts: scaleCallouts(scene4Callouts, 1650 / 1500),
    intertitle: {
      eyebrow: "Cảnh 4 / 8",
      words: [
        { text: "Sự kiện", tone: "ink" },
        { text: "&", tone: "soft" },
        { text: "Diễn giả cựu SV", tone: "accent" },
      ],
    },
  },
  {
    id: 5,
    title: "Góc chia sẻ & Mạng lưới Cựu SV",
    videoSrc: "recordings/scene-5.mp4",
    voiceSrc: "audio/voice-5.mp3",
    durationInFrames: 1200,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [{ frame: 461, role: "alumni" }],
    routeChanges: [
      { frame: 0, url: "/experiences" },
      { frame: 200, url: "/experiences/bai-chia-se" },
      { frame: 461, url: "/alumni/dashboard" },
      { frame: 640, url: "/alumni" },
      { frame: 860, url: "/student/experiences/new" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 80, toFrame: 400, x: 0.5, y: 0.4, scale: 1.22 },
      { fromFrame: 500, toFrame: 780, x: 0.5, y: 0.45, scale: 1.22, highlight: { width: 0.4, height: 0.2 } },
      { fromFrame: 840, toFrame: 1020, x: 0.5, y: 0.45, scale: 1.22 },
    ],
    callouts: scaleCallouts(scene5Callouts, 1200 / 1050),
    intertitle: {
      eyebrow: "Cảnh 5 / 8",
      words: [
        { text: "Góc chia sẻ", tone: "ink" },
        { text: "&", tone: "soft" },
        { text: "Mạng lưới Cựu SV", tone: "accent" },
      ],
    },
  },
  {
    id: 6,
    title: "Thư viện ảnh",
    videoSrc: "recordings/scene-6.mp4",
    voiceSrc: "audio/voice-6.mp3",
    durationInFrames: 750,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [],
    routeChanges: [
      { frame: 0, url: "/gallery" },
      { frame: 300, url: "/gallery/album" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 70, toFrame: 290, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 340, toFrame: 560, x: 0.5, y: 0.5, scale: 1.22 },
      { fromFrame: 600, toFrame: 880, x: 0.5, y: 0.5, scale: 1.22 },
    ],
    callouts: scaleCallouts(scene6Callouts, 750 / 900),
    intertitle: {
      eyebrow: "Cảnh 6 / 8",
      words: [
        { text: "Thư viện", tone: "ink" },
        { text: "ảnh", tone: "accent" },
      ],
    },
  },
  {
    id: 7,
    title: "Quỹ học bổng",
    videoSrc: "recordings/scene-7.mp4",
    voiceSrc: "audio/voice-7.mp3",
    durationInFrames: 1350,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [{ frame: 429, role: "student" }],
    routeChanges: [
      { frame: 0, url: "/scholarships" },
      { frame: 230, url: "/scholarships/chien-dich" },
      { frame: 429, url: "/student/scholarships" },
      { frame: 640, url: "/student/scholarships/ung-tuyen" },
      { frame: 900, url: "/student/scholarships/ung-tuyen" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 80, toFrame: 500, x: 0.5, y: 0.5, scale: 1.22, highlight: { width: 0.5, height: 0.16 } },
      { fromFrame: 600, toFrame: 880, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 960, toFrame: 1180, x: 0.5, y: 0.45, scale: 1.22 },
    ],
    callouts: scaleCallouts(scene7Callouts, 1350 / 1200),
    intertitle: {
      eyebrow: "Cảnh 7 / 8",
      words: [
        { text: "Quỹ", tone: "ink" },
        { text: "học bổng", tone: "accent" },
      ],
    },
  },
  {
    id: 8,
    title: "Doanh nghiệp & Quản trị",
    videoSrc: "recordings/scene-8.mp4",
    voiceSrc: "audio/voice-8.mp3",
    durationInFrames: 1950,
    playbackRate: "auto",
    intro: "flip",
    outro: "orbit",
    startRole: "employer",
    roleChanges: [{ frame: 676, role: "staff" }],
    routeChanges: [
      { frame: 0, url: "/employer/dashboard" },
      { frame: 180, url: "/employer/jobs" },
      { frame: 400, url: "/employer/jobs/new" },
      { frame: 676, url: "/faculty-admin/dashboard" },
      { frame: 900, url: "/faculty-admin/companies/review" },
      { frame: 1080, url: "/faculty-admin/jobs/review" },
      { frame: 1280, url: "/faculty-admin/events" },
      { frame: 1500, url: "/faculty-admin/scholarships/campaigns" },
      { frame: 1680, url: "/faculty-admin/audit-logs" },
    ],
    cameraKeyframes: FLAT,
    swayDegrees: 4,
    zoomTargets: [
      { fromFrame: 80, toFrame: 520, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 660, toFrame: 1030, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 1070, toFrame: 1280, x: 0.5, y: 0.45, scale: 1.22 },
      { fromFrame: 1310, toFrame: 1630, x: 0.5, y: 0.45, scale: 1.22 },
    ],
    callouts: scaleCallouts(scene8Callouts, 1950 / 1800),
    intertitle: {
      eyebrow: "Cảnh 8 / 8",
      words: [
        { text: "Doanh nghiệp", tone: "ink" },
        { text: "&", tone: "soft" },
        { text: "Quản trị", tone: "accent" },
      ],
    },
  },
];

const shortUrl = (u: string) =>
  u.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, (m) => m.slice(0, 8));

/** Ghép đường dẫn và vai trò thật (ghi lúc quay) lên cấu hình cảnh. */
const withMeta = (scene: SceneConfig): SceneConfig => {
  const meta = RECORDING_META[scene.id];
  if (!meta || scene.id <= 2) return scene;
  const k = scene.durationInFrames / meta.duration;
  const routes = meta.navs.map(([t, u]) => ({ frame: Math.round(t * k), url: shortUrl(u) }));
  const routeChanges = routes.filter((r, i) => i === 0 || r.url !== routes[i - 1].url);
  if (routeChanges.length) routeChanges[0] = { ...routeChanges[0], frame: 0 };
  const roles = meta.roles.map(([t, r]) => ({ frame: Math.round(t * k), role: r as RoleId }));
  return {
    ...scene,
    startRole: roles[0]?.role ?? scene.startRole,
    roleChanges: roles.slice(1),
    routeChanges: routeChanges.length ? routeChanges : scene.routeChanges,
  };
};

export const SCENES: SceneConfig[] = RAW_SCENES.map(withMeta);

/** Intro dài 11 giây; cảnh 1 bắt đầu chồng lên 2 giây cuối của intro để chuyển tiếp chậm, mượt. */
export const INTRO_FRAMES = 330;
export const INTRO_OVERLAP = 60;
export const SCENES_OFFSET = INTRO_FRAMES - INTRO_OVERLAP;
/** Outro dài 13 giây, chồng lên 3 giây cuối của cảnh 8. */
export const OUTRO_FRAMES = 330;
export const OUTRO_OVERLAP = 90;

export const SCENES_TOTAL = SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
);

export const TOTAL_FRAMES = SCENES_OFFSET + SCENES_TOTAL + (OUTRO_FRAMES - OUTRO_OVERLAP);

/** Frame (toàn video) bắt đầu mỗi cảnh. */
export const SCENE_STARTS: number[] = SCENES.reduce<number[]>((acc, scene, i) => {
  acc.push(i === 0 ? SCENES_OFFSET : acc[i - 1] + SCENES[i - 1].durationInFrames);
  return acc;
}, []);

export const CLOSING_FROM = SCENES_OFFSET + SCENES_TOTAL - OUTRO_OVERLAP;
