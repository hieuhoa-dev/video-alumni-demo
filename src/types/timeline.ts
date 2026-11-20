/**
 * Mọi mốc `frame` trong file cấu hình đều là frame CỤC BỘ của cảnh
 * (0 = frame đầu tiên của cảnh đó), không phải frame toàn video.
 */

export type RoleId = "visitor" | "student" | "alumni" | "employer" | "staff";

export type Tone = "sky" | "pine" | "sun";

export type RoleDefinition = {
  id: RoleId;
  label: string;
  /** Email tài khoản mẫu, hiển thị trên badge. */
  email: string;
  tone: Tone;
  initial: string;
};

/** Đổi vai trò (đăng nhập tài khoản khác) tại một mốc frame. */
export type RoleChange = {
  frame: number;
  role: RoleId;
};

/** Đổi đường dẫn hiển thị trên thanh địa chỉ. */
export type RouteChange = {
  frame: number;
  /** Chỉ phần path, ví dụ "/jobs". Host lấy từ `BROWSER_HOST`. */
  url: string;
};

/**
 * Tư thế nền của camera tại một mốc frame, nội suy tuyến tính giữa các mốc.
 * Các góc tính bằng độ. Dao động `sway` được cộng thêm lên trên.
 */
export type CameraKeyframe = {
  frame: number;
  rotateX: number;
  rotateY: number;
  scale: number;
};

/**
 * Điểm nhấn phóng to. Toạ độ chuẩn hoá 0..1 trong vùng nội dung của khung
 * trình duyệt (0,0 = góc trên trái; 0.5,0.5 = chính giữa).
 */
export type ZoomTarget = {
  fromFrame: number;
  toFrame: number;
  x: number;
  y: number;
  scale: number;
  /**
   * Nếu có: vẽ viền sáng + tia quét quanh vùng này khi camera lao vào.
   * `width`/`height` chuẩn hoá 0..1 theo vùng nội dung của khung trình duyệt.
   */
  highlight?: { width: number; height: number };
};

export type IconName =
  | "briefcase"
  | "calendar"
  | "image"
  | "book"
  | "heart"
  | "users"
  | "shield"
  | "home"
  | "clipboard"
  | "pen"
  | "building";

export type CalloutPosition = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export type Callout = {
  fromFrame: number;
  toFrame: number;
  eyebrow?: string;
  title: string;
  body?: string;
  icon: IconName;
  tone: Tone;
  position: CalloutPosition;
};

export type IntertitleWord = {
  text: string;
  /** ink: chữ đậm · soft: chữ làm mềm (span.soft) · accent: từ khoá xanh. */
  tone: "ink" | "soft" | "accent";
};

/** Tiêu đề ngắn hiện ở đầu cảnh, từng từ xuất hiện rồi tan lên như bụi mực. */
export type Intertitle = {
  eyebrow: string;
  words: IntertitleWord[];
};

export type SceneIntro =
  /** Khung xoay từ góc nghiêng về chính diện (cảnh mở đầu). */
  | "orbit"
  /** Lật thẻ 3D rotateY 90° → 0° (đổi tài khoản ngay đầu file). */
  | "flip"
  /** Lao từ chiều sâu vào (chuyển cảnh thông thường). */
  | "depth";

export type SceneOutro =
  /** Khung xoay ra và thu nhỏ (cảnh kết). */
  | "orbit"
  /** Bay xuyên về phía người xem rồi mờ dần. */
  | "depth"
  | "none";

/** Cảnh dùng ảnh chụp toàn trang, cuộn có dừng từng mục. */
export type StillScroll = {
  src: string;
  /** Kích thước gốc của ảnh (px). */
  width: number;
  height: number;
  /** Các điểm dừng: y (px trong ảnh gốc) và số frame giữ nguyên. */
  stops: { y: number; hold: number }[];
  /** Số frame cuộn giữa hai điểm dừng. */
  travel: number;
};

export type SceneConfig = {
  id: number;
  title: string;
  /** Đường dẫn tương đối trong thư mục `public/`. */
  videoSrc: string;
  /** File lời thoại riêng của cảnh, tương đối trong `public/`. */
  voiceSrc: string;
  durationInFrames: number;
  /** Nếu có, hiển thị ảnh cuộn thay cho video. */
  still?: StillScroll;
  /**
   * "auto": tự đo thời lượng file mp4 rồi tính tốc độ để khớp đúng số frame
   * của cảnh. Hoặc đặt số cụ thể (1 = tốc độ gốc).
   */
  playbackRate: "auto" | number;
  intro: SceneIntro;
  outro: SceneOutro;
  /** Vai trò khi cảnh bắt đầu. */
  startRole: RoleId;
  /** Các lần đổi vai trò trong cảnh (kèm hiệu ứng lật thẻ). */
  roleChanges: RoleChange[];
  routeChanges: RouteChange[];
  cameraKeyframes: CameraKeyframe[];
  /** Biên độ lắc rotateY (độ). 0 = tắt. */
  swayDegrees: number;
  zoomTargets: ZoomTarget[];
  callouts: Callout[];
  /** Tiêu đề chuyển phần ở đầu cảnh (bỏ qua với cảnh 1). */
  intertitle?: Intertitle;
};
