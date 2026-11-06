export type RecruitmentAnnouncement = {
  generation: number;
  audience: string;
  introduction: string;
  departments: readonly string[];
  deadline: string | null;
  applicationUrl: string;
};

// Cập nhật nội dung đợt tuyển tại đây. Khi sang Gen 5, đổi generation và thông tin tương ứng.
export const recruitmentAnnouncement: RecruitmentAnnouncement = {
  generation: 4,
  audience: "Sinh viên VKU",
  introduction:
    "VIC tìm những bạn muốn học thêm, dám thử điều mới và cùng biến ý tưởng thành sản phẩm.",
  departments: ["Ban Học tập", "Ban Truyền thông & Sự kiện"],
  deadline: null,
  applicationUrl: "https://forms.gle/bo8W61tkrWq4swCDA",
};
