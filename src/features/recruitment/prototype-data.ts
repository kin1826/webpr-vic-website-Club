import type { AdminApplication, RecruitmentFormConfig } from "./types";

const options = {
  department: [
    { fieldId: "department", optionId: "hoc_tap", label: "Ban Học tập", sortOrder: 1, active: true, infoUrl: "/hoctap" },
    { fieldId: "department", optionId: "truyen_thong", label: "Ban Truyền thông", sortOrder: 2, active: true, infoUrl: "/truyenthong" },
  ],
  weekly_time: [
    { fieldId: "weekly_time", optionId: "under_2h", label: "Dưới 2 giờ", sortOrder: 1, active: true, infoUrl: null },
    { fieldId: "weekly_time", optionId: "2_to_4h", label: "Từ 2 đến 4 giờ", sortOrder: 2, active: true, infoUrl: null },
    { fieldId: "weekly_time", optionId: "over_4h", label: "Trên 4 giờ", sortOrder: 3, active: true, infoUrl: null },
    { fieldId: "weekly_time", optionId: "undecided", label: "Chưa xác định", sortOrder: 4, active: true, infoUrl: null },
  ],
};

export function createPrototypeConfig(isOpen = true): RecruitmentFormConfig {
  const field = (fieldId: string, label: string, type: RecruitmentFormConfig["fields"][number]["type"], required: boolean, sortOrder: number, section: string, helpText: string, system = false) => ({
    fieldId, label, type, required, active: true, sortOrder, section, helpText, options: options[fieldId as keyof typeof options] ?? [], system,
  });
  return {
    formId: "vic-member-form",
    campaignId: "prototype-2026",
    formTitle: "Đăng ký trở thành thành viên VIC",
    formDescription: "Hãy chia sẻ ngắn gọn về bạn. VIC sẽ dùng thông tin này để hiểu mong muốn và kết nối bạn với ban phù hợp.",
    isOpen,
    closedMessage: "Đợt tuyển thành viên hiện chưa mở. Theo dõi kênh chính thức của VIC để nhận thông báo mới nhất.",
    successMessage: "VIC đã nhận được đơn của bạn.",
    allowedEmailDomain: "udn.vn",
    cooldownMinutes: 10,
    formVersion: "1",
    contactEmail: null,
    facebookUrl: null,
    source: "prototype",
    fields: [
      field("school_email", "Email sinh viên", "email", true, 1, "Thông tin cá nhân", "Sử dụng email @udn.vn hoặc tên miền con, ví dụ @vku.udn.vn.", true),
      field("student_id", "Mã số sinh viên", "text", true, 2, "Thông tin cá nhân", "MSSV được giữ nguyên như bạn nhập, kể cả số 0 ở đầu."),
      field("full_name", "Họ và tên", "text", true, 3, "Thông tin cá nhân", "Nhập tên bạn muốn VIC sử dụng khi liên hệ."),
      field("class_name", "Lớp sinh hoạt", "text", true, 4, "Thông tin cá nhân", "Ví dụ: 24IT1."),
      field("interests", "Bạn quan tâm điều gì trong công nghệ?", "textarea", true, 5, "Câu chuyện của bạn", "Không cần câu trả lời hoàn hảo; hãy viết điều bạn thực sự muốn khám phá."),
      field("motivation", "Vì sao bạn muốn tham gia VIC?", "textarea", true, 6, "Câu chuyện của bạn", "Chia sẻ mong đợi của bạn khi đồng hành cùng câu lạc bộ."),
      field("department", "Ban bạn muốn tìm hiểu", "radio", true, 7, "Lựa chọn tham gia", "Bạn có thể mở trang giới thiệu từng ban mà không làm mất câu trả lời."),
      field("weekly_time", "Thời gian có thể dành mỗi tuần", "select", true, 8, "Lựa chọn tham gia", "Chọn mức gần nhất với lịch hiện tại của bạn."),
      field("proud_of", "Một điều bạn từng làm và cảm thấy tự hào", "textarea", false, 9, "Thông tin bổ sung", "Có thể là dự án, hoạt động, kỹ năng hoặc một lần bạn vượt qua khó khăn."),
      field("portfolio_links", "Liên kết sản phẩm hoặc hồ sơ", "textarea", false, 10, "Thông tin bổ sung", "Mỗi dòng một URL. Có thể để trống nếu bạn chưa có."),
      field("facebook_url", "Liên kết Facebook", "url", true, 11, "Thông tin bổ sung", "Dùng liên kết có thể giúp VIC liên hệ với bạn."),
      field("message", "Điều bạn muốn nhắn thêm", "textarea", false, 12, "Thông tin bổ sung", "Tùy chọn."),
      field("consent", "Tôi đồng ý để VIC sử dụng thông tin trên cho mục đích tuyển thành viên.", "checkbox", true, 13, "Xác nhận", "Thông tin không được dùng cho mục đích ngoài đợt tuyển.", true),
    ],
  };
}

export const prototypeApplications: AdminApplication[] = [
  {
    applicationId: "VIC-DEMO-001", submittedAt: "2026-10-15T02:30:00.000Z", campaignId: "prototype-2026", formVersion: "1",
    schoolEmail: "demo@vku.udn.vn", studentId: "0123456789", fullName: "Ứng viên mẫu", department: "hoc_tap", departmentLabel: "Ban Học tập", emailStatus: "sent",
    answersSnapshot: [
      { fieldId: "school_email", label: "Email sinh viên", value: "demo@vku.udn.vn" },
      { fieldId: "student_id", label: "Mã số sinh viên", value: "0123456789" },
      { fieldId: "full_name", label: "Họ và tên", value: "Ứng viên mẫu" },
      { fieldId: "department", label: "Ban bạn muốn tìm hiểu", value: "hoc_tap", optionLabel: "Ban Học tập" },
    ],
  },
];
