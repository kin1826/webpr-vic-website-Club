import extracurricularCover from "../../image/activities/extracurricular/cover.webp";
import miniChallengeCover from "../../image/activities/mini-challenge/cover.webp";
import techSharingCover from "../../image/activities/tech-sharing-2026/cover.webp";
import creativeCover from "../../image/activities/vic-creative/cover.webp";
import type { HomeActivityGroup } from "../types/home-preview";

export const homeActivityGroups: HomeActivityGroup[] = [
  {
    id: "tech-sharing",
    number: "01",
    eyebrow: "CHIA SẺ KIẾN THỨC",
    title: "Tech Sharing",
    description: "Chia sẻ kiến thức công nghệ, luyện trình bày và cùng làm việc nhóm qua những chủ đề gần gũi.",
    tags: ["Kiến thức", "Trình bày", "Làm việc nhóm"],
    icon: "presentation",
    cover: techSharingCover,
    coverAlt: "Ảnh mẫu đại diện cho hoạt động Tech Sharing của VIC",
    imagePosition: "50% 54%",
  },
  {
    id: "mini-hackathon",
    number: "02",
    eyebrow: "THỬ THÁCH NỘI BỘ",
    title: "Mini Challenge & Hackathon",
    description: "Những thử thách và cuộc thi Hackathon mini trong nội bộ để thành viên cùng giải bài toán và thử sức theo đội.",
    tags: ["Thử thách", "Hackathon", "Đồng đội"],
    icon: "code",
    cover: miniChallengeCover,
    coverAlt: "Ảnh mẫu đại diện cho hoạt động Mini Challenge và Hackathon của VIC",
    imagePosition: "64% 42%",
  },
  {
    id: "creative-studio",
    number: "03",
    eyebrow: "TRUYỀN THÔNG & SỰ KIỆN",
    title: "VIC Creative Studio",
    description: "Quay video, chụp ảnh và kể lại các hoạt động, sự kiện qua góc nhìn sáng tạo của thành viên VIC.",
    tags: ["Video", "Nhiếp ảnh", "Sự kiện"],
    icon: "camera",
    cover: creativeCover,
    coverAlt: "Ảnh mẫu đại diện cho hoạt động sáng tạo nội dung của VIC",
    imagePosition: "38% 62%",
  },
  {
    id: "extracurricular",
    number: "04",
    eyebrow: "KẾT NỐI HẰNG THÁNG",
    title: "Ngoại khóa & Kết nối",
    description: "Mỗi tháng, thành viên cùng vui chơi, trò chuyện và làm quen qua một hoạt động ngoại khóa.",
    tags: ["Hằng tháng", "Giao lưu", "Trải nghiệm"],
    icon: "compass",
    cover: extracurricularCover,
    coverAlt: "Ảnh mẫu đại diện cho hoạt động ngoại khóa của VIC",
    imagePosition: "50% 80%",
  },
];
