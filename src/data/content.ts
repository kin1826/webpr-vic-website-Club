import { BookOpen, Megaphone } from "lucide-react";
import type { Activity, FaqItem, Project, Team } from "../types/content";

export const teams: Team[] = [
  {
    id: "learning", name: "Ban Học tập", icon: BookOpen,
    description: "Cùng tìm hiểu công nghệ, thực hành lập trình và phát triển ý tưởng thành sản phẩm. Một nơi để hỏi, thử, sửa và tiến bộ cùng nhau.",
    focuses: ["Chia sẻ kiến thức", "Thực hành lập trình", "Mini project và dự án nhóm", "Kinh nghiệm học tập"],
    tags: ["Lập trình", "Thực hành", "Dự án"],
  },
  {
    id: "media", name: "Ban Truyền thông", icon: Megaphone,
    description: "Kể câu chuyện của VIC bằng nội dung, thiết kế và hình ảnh. Cùng ghi lại hành trình của CLB và đưa những giá trị ấy đến nhiều người hơn.",
    focuses: ["Viết nội dung", "Thiết kế hình ảnh", "Chụp ảnh, quay dựng", "Truyền thông hoạt động"],
    tags: ["Nội dung", "Thiết kế", "Media"],
  },
];

export const activities: Activity[] = [
  { id: "sharing", name: "Tech Sharing", kind: "SHARE", featured: true, description: "Cùng bóc tách một chủ đề công nghệ, trao đổi cách hiểu và học từ góc nhìn của nhau." },
  { id: "challenge", name: "Mini Challenge", kind: "PRACTICE", description: "Thực hành qua thử thách nhỏ theo nhóm, cùng tìm cách giải và nhìn lại quá trình." },
  { id: "show", name: "Build & Show", kind: "SHOW", description: "Giới thiệu sản phẩm, nhận góp ý và học từ những thử nghiệm của nhau." },
];

export const projects: Project[] = [
  { id: "community", name: "Website cộng đồng", category: "Web", description: "Không gian trực tuyến giúp thành viên tìm nội dung, hoạt động và kết nối với cộng đồng." },
  { id: "mini-game", name: "Mini game", category: "Game", description: "Một thử nghiệm nhỏ để cùng luyện tư duy logic, thiết kế trải nghiệm và làm việc nhóm." },
  { id: "study-tool", name: "Công cụ hỗ trợ học tập", category: "Tool", description: "Ý tưởng về một tiện ích gọn nhẹ giúp việc ghi nhớ và ôn tập trở nên dễ dàng hơn." },
];

export const faqs: FaqItem[] = [
  { id: "beginner", question: "Chưa giỏi lập trình có tham gia được không?", answer: "Bạn có thể bắt đầu từ tinh thần muốn học hỏi. Yêu cầu cụ thể sẽ tùy từng đợt tuyển và hoạt động của VIC." },
  { id: "teams", question: "Ban Học tập và Ban Truyền thông khác nhau thế nào?", answer: "Ban Học tập tập trung vào công nghệ, lập trình và phát triển sản phẩm. Ban Truyền thông kể câu chuyện của VIC qua nội dung, thiết kế, hình ảnh và media." },
  { id: "schedule", question: "CLB sinh hoạt khi nào?", answer: "Lịch cụ thể sẽ được cập nhật qua kênh thông tin chính thức của VIC." },
  { id: "recruitment", question: "Khi nào VIC tuyển thành viên?", answer: "Thông tin từng đợt tuyển sẽ được công bố trên kênh chính thức của VIC." },
];
