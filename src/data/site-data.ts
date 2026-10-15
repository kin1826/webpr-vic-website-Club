import type { Activity, Article, ClubSettings, Department, FaqItem, Member, OrganizationPosition, Project } from "../types/content-model";

export const departments: Department[] = [
  {
    id: "learning", slug: "hoctap", name: "Ban Học tập", shortName: "Học tập",
    summary: "Không gian trao đổi kiến thức, thực hành lập trình và phát triển ý tưởng thành sản phẩm.",
    description: "Ban Học tập kết nối những bạn muốn tìm hiểu công nghệ qua việc cùng hỏi, cùng thử và cùng nhìn lại cách giải quyết vấn đề. Các nội dung được tổ chức theo hướng thực hành và chia sẻ lẫn nhau.",
    tags: ["Lập trình", "Chia sẻ", "Dự án"],
    directions: [
      { title: "Chia sẻ kiến thức", description: "Diễn giải một chủ đề bằng ngôn ngữ dễ tiếp cận và trao đổi nhiều góc nhìn." },
      { title: "Thực hành", description: "Biến điều vừa học thành bài tập nhỏ, thử nghiệm hoặc prototype có thể xem được." },
      { title: "Nhóm học tập", description: "Cùng duy trì nhịp học, đặt câu hỏi và hỗ trợ nhau tháo gỡ vướng mắc." },
      { title: "Phát triển dự án", description: "Chia nhỏ ý tưởng, phối hợp theo nhóm và cải thiện sản phẩm qua phản hồi." },
    ],
  },
  {
    id: "media", slug: "truyenthong", name: "Ban Truyền thông", shortName: "Truyền thông",
    summary: "Không gian phát triển nội dung, thiết kế, hình ảnh và cách kể câu chuyện của VIC.",
    description: "Ban Truyền thông giúp những giá trị và hành trình của VIC được thể hiện rõ ràng qua nội dung, thiết kế và media. Đây cũng là nơi thành viên luyện cách biến thông tin thành trải nghiệm dễ hiểu, gần gũi.",
    tags: ["Nội dung", "Thiết kế", "Media"],
    directions: [
      { title: "Nội dung", description: "Lên ý tưởng, viết và biên tập thông tin cho những kênh phù hợp." },
      { title: "Thiết kế", description: "Xây dựng hình ảnh nhất quán và trực quan cho hoạt động của CLB." },
      { title: "Chụp ảnh", description: "Ghi lại khoảnh khắc và chọn cách kể chuyện bằng khung hình." },
      { title: "Quay dựng", description: "Thực hành video ngắn, hậu kỳ và truyền thông cho sự kiện." },
    ],
  },
];

export const members: Member[] = [
  {
    id: "member-sample", slug: "ho-so-thanh-vien-mau", name: "Hồ sơ thành viên mẫu", role: "Dữ liệu minh họa", departmentId: null,
    summary: "Template minh họa cách một thành viên có thể giới thiệu hành trình học tập, đóng góp và sản phẩm của mình tại VIC.",
    interests: ["Phát triển sản phẩm", "Thiết kế trải nghiệm", "Chia sẻ kiến thức"],
    contributions: ["Nội dung này dùng để đánh giá bố cục hồ sơ.", "Chưa đại diện cho thành viên hoặc chức danh thật tại VIC."],
    projectIds: ["community-web"], articleIds: ["chia-nho-y-tuong"], portfolioUrl: null, socialUrl: null, isDemo: true,
  },
];

export const organizationPositions: OrganizationPosition[] = [
  { id: "chair", title: "Chủ nhiệm", departmentId: null, memberId: null, note: "Nhân sự sẽ được cập nhật" },
  { id: "vice-chair", title: "Phó Chủ nhiệm", departmentId: null, memberId: null, note: "Số lượng theo dữ liệu chính thức" },
  { id: "learning-lead", title: "Trưởng Ban Học tập", departmentId: "learning", memberId: null, note: "Thông tin đang được cập nhật" },
  { id: "learning-deputy", title: "Phó Ban Học tập", departmentId: "learning", memberId: null, note: "Số lượng theo dữ liệu chính thức" },
  { id: "media-lead", title: "Trưởng Ban Truyền thông", departmentId: "media", memberId: null, note: "Thông tin đang được cập nhật" },
  { id: "media-deputy", title: "Phó Ban Truyền thông", departmentId: "media", memberId: null, note: "Số lượng theo dữ liệu chính thức" },
];

export const activities: Activity[] = [
  {
    id: "activity-sharing", slug: "tech-sharing-mau", title: "Tech Sharing — Từ câu hỏi đến kiến thức chung", summary: "Một bố cục mẫu cho hoạt động cùng tìm hiểu và chia sẻ một chủ đề công nghệ.",
    category: "Học tập", type: "Tech Sharing", status: "upcoming", date: null, departmentIds: ["learning"],
    body: ["Hoạt động minh họa cách một buổi chia sẻ có thể được giới thiệu trước khi diễn ra.", "Khi có dữ liệu thật, khu vực này sẽ cung cấp mục tiêu, nội dung chính, hình thức tham gia và những lưu ý cần thiết."],
    relatedArticleIds: ["ghi-lai-dieu-da-hoc"], relatedProjectIds: [], registrationUrl: null, featured: true, isDemo: true,
  },
  {
    id: "activity-challenge", slug: "mini-challenge-mau", title: "Mini Challenge — Cùng giải một bài toán nhỏ", summary: "Mẫu hoạt động thực hành theo nhóm, ưu tiên quá trình trao đổi và thử nghiệm.",
    category: "Giao lưu", type: "Mini Challenge", status: "undated", date: null, departmentIds: ["learning", "media"],
    body: ["Nội dung này minh họa cho hoạt động kết nối thành viên quanh một thử thách vừa sức.", "Không có lịch, địa điểm hoặc thể lệ thật được công bố trong bản mẫu."],
    relatedArticleIds: ["checklist-ban-giao"], relatedProjectIds: ["mini-game"], registrationUrl: null, featured: true, isDemo: true,
  },
  {
    id: "activity-show", slug: "build-and-show-mau", title: "Build & Show — Chia sẻ điều đã làm", summary: "Bố cục recap mẫu cho hoạt động giới thiệu sản phẩm và nhận góp ý.",
    category: "Truyền thông", type: "Showcase", status: "recap", date: null, departmentIds: ["learning", "media"],
    body: ["Đây là nội dung recap minh họa, không khẳng định hoạt động đã diễn ra.", "Khi có thông tin thật, trang có thể bổ sung sản phẩm được giới thiệu, ghi chú chính và album hình ảnh."],
    relatedArticleIds: [], relatedProjectIds: ["community-web", "media-kit"], registrationUrl: null, featured: true, isDemo: true,
  },
];

export const projects: Project[] = [
  {
    id: "community-web", slug: "website-cong-dong-mau", title: "Website cộng đồng", summary: "Ý tưởng về không gian trực tuyến tập hợp nội dung, hoạt động và sản phẩm của VIC.",
    category: "Web/App", scope: "VIC", departmentIds: ["learning", "media"], contributorIds: ["member-sample"],
    purpose: "Giúp người mới hiểu VIC và giúp thành viên dễ tìm những nội dung liên quan.", process: ["Xác định nhu cầu người xem", "Tổ chức cấu trúc nội dung", "Tạo prototype và nhận phản hồi"],
    result: "Bản mẫu giao diện dùng để thảo luận, chưa phải sản phẩm hoàn thành.", tools: ["React", "TypeScript", "Thiết kế giao diện"], demoUrl: null, sourceUrl: null, featured: true, isDemo: true,
  },
  {
    id: "mini-game", slug: "mini-game-mau", title: "Mini game", summary: "Mẫu sản phẩm nhỏ để luyện tư duy logic, tương tác và phối hợp theo nhóm.",
    category: "Game", scope: "VIC", departmentIds: ["learning"], contributorIds: [], purpose: "Tạo một phạm vi vừa đủ để thành viên thực hành trọn vẹn quy trình làm sản phẩm.",
    process: ["Chọn cơ chế chơi cốt lõi", "Tạo phiên bản thử", "Ghi nhận phản hồi"], result: "Nội dung minh họa, chưa có game thật hoặc số liệu sử dụng.", tools: ["Web Canvas", "JavaScript"], demoUrl: null, sourceUrl: null, featured: true, isDemo: true,
  },
  {
    id: "media-kit", slug: "bo-truyen-thong-mau", title: "Bộ nội dung truyền thông", summary: "Mẫu bố cục cho một sản phẩm thiết kế hoặc video truyền thông của thành viên.",
    category: "Media", scope: "VIC", departmentIds: ["media"], contributorIds: [], purpose: "Thể hiện một thông điệp rõ ràng và nhất quán trên nhiều định dạng.",
    process: ["Xác định thông điệp", "Phát triển concept", "Thiết kế và rà soát"], result: "Sản phẩm minh họa, chưa đại diện cho ấn phẩm chính thức của VIC.", tools: ["Thiết kế", "Biên tập nội dung", "Quay dựng"], demoUrl: null, sourceUrl: null, featured: true, isDemo: true,
  },
];

export const articles: Article[] = [
  {
    id: "article-idea", slug: "chia-nho-y-tuong", title: "Cách chia nhỏ một ý tưởng thành các bước thực hiện", summary: "Một cách đơn giản để biến ý tưởng còn mơ hồ thành những phần việc có thể bắt đầu.",
    topic: "Dự án", tags: ["Lập kế hoạch", "Thực hành"], authorMemberId: null, publishedAt: null, departmentIds: ["learning"], featured: true, isDemo: true,
    content: [
      { type: "paragraph", text: "Bài viết mẫu này minh họa bố cục đọc nội dung học thuật trên website VIC. Nội dung không ghi nhận một buổi chia sẻ đã diễn ra." },
      { type: "heading", id: "xac-dinh-ket-qua", text: "Bắt đầu từ kết quả muốn nhìn thấy" },
      { type: "paragraph", text: "Thay vì liệt kê công nghệ trước, hãy mô tả điều người dùng có thể làm được khi ý tưởng hoàn thành." },
      { type: "list", items: ["Viết kết quả trong một câu", "Chọn một người dùng chính", "Xác định phiên bản nhỏ nhất có thể thử"] },
      { type: "heading", id: "chia-nho", text: "Chia thành những lát cắt có thể kiểm tra" },
      { type: "paragraph", text: "Mỗi bước nên tạo ra một kết quả quan sát được để nhóm có thể trao đổi và điều chỉnh sớm." },
      { type: "code", language: "ts", code: "type Task = {\n  title: string;\n  done: boolean;\n};\n\nconst firstStep: Task = { title: 'Tạo bản thử nhỏ', done: false };" },
      { type: "heading", id: "nhin-lai", text: "Nhìn lại sau mỗi vòng thử" },
      { type: "paragraph", text: "Ghi lại điều đã rõ, điều còn chưa chắc và bước tiếp theo giúp tiến trình học tập trở nên cụ thể hơn." },
    ],
  },
  {
    id: "article-handoff", slug: "checklist-ban-giao", title: "Checklist trước khi gửi một sản phẩm cho đồng đội", summary: "Một danh sách ngắn giúp người nhận dễ mở, đọc và tiếp tục phần việc.",
    topic: "Công cụ", tags: ["Làm việc nhóm", "Checklist"], authorMemberId: null, publishedAt: null, departmentIds: ["learning", "media"], featured: true, isDemo: true,
    content: [
      { type: "paragraph", text: "Đây là bài viết mẫu. Checklist cần được điều chỉnh theo công cụ và quy trình thật của từng nhóm." },
      { type: "heading", id: "boi-canh", text: "Nói rõ bối cảnh" },
      { type: "paragraph", text: "Một câu mô tả mục tiêu giúp đồng đội hiểu họ đang xem phần nào của sản phẩm." },
      { type: "heading", id: "kiem-tra", text: "Kiểm tra khả năng tiếp tục" },
      { type: "list", items: ["Tên file và thư mục dễ hiểu", "Hướng dẫn chạy ngắn gọn", "Ghi chú phần còn dang dở", "Không gửi dữ liệu nhạy cảm"] },
    ],
  },
  {
    id: "article-reflection", slug: "ghi-lai-dieu-da-hoc", title: "Cách ghi lại điều đã học sau một buổi chia sẻ", summary: "Biến ghi chú rời rạc thành tài liệu ngắn mà bản thân và đồng đội có thể dùng lại.",
    topic: "Kinh nghiệm học tập", tags: ["Ghi chú", "Chia sẻ"], authorMemberId: null, publishedAt: null, departmentIds: ["learning"], featured: false, isDemo: true,
    content: [
      { type: "paragraph", text: "Bài mẫu tập trung vào cách tổ chức ghi chú, không khẳng định một buổi chia sẻ cụ thể đã diễn ra tại VIC." },
      { type: "heading", id: "ba-cau-hoi", text: "Dùng ba câu hỏi" },
      { type: "list", items: ["Mình vừa hiểu thêm điều gì?", "Điểm nào cần thử lại?", "Điều gì có thể chia sẻ cho người khác?"] },
      { type: "heading", id: "viet-ngan", text: "Viết ngắn nhưng có cấu trúc" },
      { type: "paragraph", text: "Một đoạn tóm tắt, vài ý chính và liên kết nguồn là đủ để bắt đầu một ghi chú hữu ích." },
    ],
  },
];

export const faqs: FaqItem[] = [
  { id: "beginner", question: "Chưa giỏi lập trình có tham gia được không?", answer: "Bạn có thể bắt đầu từ tinh thần muốn học hỏi. Yêu cầu cụ thể sẽ tùy từng đợt tuyển và hoạt động của VIC." },
  { id: "choose", question: "Nên chọn Ban Học tập hay Ban Truyền thông?", answer: "Hãy chọn không gian gần với điều bạn muốn thử trước. Ban Học tập thiên về công nghệ và sản phẩm; Ban Truyền thông thiên về nội dung, thiết kế và media." },
  { id: "updates", question: "Theo dõi lịch sinh hoạt và tuyển thành viên ở đâu?", answer: "Lịch và thông tin tuyển sẽ được cập nhật qua kênh chính thức của VIC khi các liên kết được xác nhận." },
  { id: "schedule", question: "CLB sinh hoạt khi nào?", answer: "Lịch cụ thể chưa được cung cấp và sẽ được VIC thông báo trên kênh chính thức." },
];

export const clubSettings: ClubSettings = {
  recruitmentStatus: "unknown",
  applicationUrl: null,
  facebookUrl: null,
  contactEmail: null,
  githubUrl: null,
};

export const getDepartment = (id: string) => departments.find((item) => item.id === id);
export const getMember = (id: string) => members.find((item) => item.id === id);
export const getActivityBySlug = (slug: string) => activities.find((item) => item.slug === slug);
export const getProjectBySlug = (slug: string) => projects.find((item) => item.slug === slug);
export const getArticleBySlug = (slug: string) => articles.find((item) => item.slug === slug);
export const getMemberBySlug = (slug: string) => members.find((item) => item.slug === slug);
