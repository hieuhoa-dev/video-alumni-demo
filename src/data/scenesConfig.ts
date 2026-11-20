import type {
  Callout,
  CameraKeyframe,
  RoleDefinition,
  RoleId,
  SceneConfig,
} from "../types/timeline";

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
    toFrame: 380,
    eyebrow: "DLU CONNECT",
    title: "Một nền tảng cho cả cộng đồng",
    body: "Nhà trường, sinh viên, cựu sinh viên, doanh nghiệp",
    icon: "users",
    tone: "sky",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 430,
    toFrame: 720,
    eyebrow: "Kỷ niệm",
    title: "50 năm truyền thống",
    body: "Đại học Đà Lạt · 1976 – 2026",
    icon: "home",
    tone: "sun",
    position: LEFT_BOTTOM,
  },
];

const scene2Callouts: Callout[] = [
  {
    fromFrame: 70,
    toFrame: 250,
    eyebrow: "Trang chủ",
    title: "Tin mới cập nhật liên tục",
    icon: "book",
    tone: "sun",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 280,
    toFrame: 640,
    eyebrow: "Trang chủ",
    title: "Tin học thuật & ảnh sự kiện",
    icon: "image",
    tone: "sky",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 680,
    toFrame: 900,
    eyebrow: "Trang chủ",
    title: "Số liệu mạng lưới & đối tác",
    icon: "building",
    tone: "pine",
    position: RIGHT_BOTTOM,
  },
  {
    fromFrame: 920,
    toFrame: 1035,
    eyebrow: "Trang chủ",
    title: "Tiến độ quỹ học bổng",
    icon: "heart",
    tone: "sun",
    position: LEFT_BOTTOM,
  },
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
  {
    fromFrame: 70,
    toFrame: 330,
    eyebrow: "Sự kiện",
    title: "Lịch hội thảo & diễn giả",
    icon: "calendar",
    tone: "sky",
    position: RIGHT_TOP,
  },
  {
    fromFrame: 470,
    toFrame: 780,
    eyebrow: "Sinh viên",
    title: "Đăng ký sự kiện một chạm",
    body: "Theo dõi mục đã đăng ký",
    icon: "calendar",
    tone: "pine",
    position: LEFT_BOTTOM,
  },
  {
    fromFrame: 830,
    toFrame: 1035,
    eyebrow: "Sinh viên",
    title: "Biểu mẫu & khảo sát từ Khoa",
    icon: "clipboard",
    tone: "sun",
    position: RIGHT_BOTTOM,
  },
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
    eyebrow: "Quyền riêng tư",
    title: "Yêu cầu gỡ ảnh",
    body: "Ban quản trị xem xét và xử lý",
    icon: "shield",
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

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "Mở đầu",
    videoSrc: "recordings/scene-1.mp4",
    voiceSrc: "audio/voice-1.mp3",
    durationInFrames: 750,
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
    zoomTargets: [{ fromFrame: 330, toFrame: 620, x: 0.5, y: 0.45, scale: 1.22 }],
    callouts: scene1Callouts,
  },
  {
    id: 2,
    title: "Trang chủ",
    videoSrc: "recordings/scene-2.mp4",
    voiceSrc: "audio/voice-2.mp3",
    durationInFrames: 1050,
    playbackRate: "auto",
    intro: "depth",
    outro: "depth",
    startRole: "visitor",
    roleChanges: [],
    routeChanges: [{ frame: 0, url: "/" }],
    cameraKeyframes: FLAT,
    swayDegrees: 5,
    zoomTargets: [
      { fromFrame: 70, toFrame: 250, x: 0.5, y: 0.1, scale: 1.22 },
      { fromFrame: 280, toFrame: 450, x: 0.5, y: 0.4, scale: 1.22 },
      { fromFrame: 460, toFrame: 650, x: 0.5, y: 0.55, scale: 1.22 },
      { fromFrame: 680, toFrame: 800, x: 0.5, y: 0.5, scale: 1.22 },
      { fromFrame: 810, toFrame: 900, x: 0.5, y: 0.55, scale: 1.22 },
      { fromFrame: 920, toFrame: 1035, x: 0.5, y: 0.55, scale: 1.22 },
    ],
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
    title: "Sự kiện & Khảo sát",
    videoSrc: "recordings/scene-4.mp4",
    voiceSrc: "audio/voice-4.mp3",
    durationInFrames: 1050,
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
    callouts: scene4Callouts,
    intertitle: {
      eyebrow: "Cảnh 4 / 8",
      words: [
        { text: "Sự kiện", tone: "ink" },
        { text: "&", tone: "soft" },
        { text: "Khảo sát", tone: "accent" },
      ],
    },
  },
  {
    id: 5,
    title: "Góc chia sẻ & Mạng lưới Cựu SV",
    videoSrc: "recordings/scene-5.mp4",
    voiceSrc: "audio/voice-5.mp3",
    durationInFrames: 1050,
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
    callouts: scene5Callouts,
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
    durationInFrames: 900,
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
    callouts: scene6Callouts,
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
    durationInFrames: 1200,
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
    callouts: scene7Callouts,
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
    durationInFrames: 1800,
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
    callouts: scene8Callouts,
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

export const TOTAL_FRAMES = SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
);

/** Số frame đầu của mỗi cảnh trên timeline toàn video. */
export const SCENE_STARTS: number[] = SCENES.reduce<number[]>((acc, scene, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].durationInFrames);
  return acc;
}, []);
