import { Code2, TrendingUp, UsersRound } from "lucide-react";
import { Reveal } from "../shared/reveal";
import { SectionHeading } from "../shared/section-heading";

const values = [
  { icon: UsersRound, title: "Học cùng nhau", copy: "Trao đổi kiến thức, đặt câu hỏi và cùng tháo gỡ những vấn đề chưa rõ." },
  { icon: Code2, title: "Làm cùng nhau", copy: "Thực hành, thử nghiệm và phát triển ý tưởng thành những sản phẩm có thể trải nghiệm." },
  { icon: TrendingUp, title: "Lớn lên cùng nhau", copy: "Rèn kỹ năng, kết nối bạn bè và chia sẻ những cơ hội để cùng tiến bộ." },
];

export function AboutSection() {
  return <section id="about" className="section-space" aria-labelledby="about-title"><div className="page-container grid items-start gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-[7vw]"><Reveal className="lg:sticky lg:top-32"><SectionHeading label="01 / VỀ VIC" id="about-title" title={<>Công nghệ là điểm chung.<br />Đồng hành là điều gắn kết.</>} description="VIC là CLB Công nghệ thông tin tại VKU, nơi sinh viên cùng học hỏi, trao đổi kiến thức và thực hành qua những ý tưởng, hoạt động và dự án. Bạn có thể bắt đầu từ một câu hỏi nhỏ, tìm người đồng hành và từng bước tạo ra sản phẩm của riêng mình." /></Reveal><div className="border-t border-black/10 lg:ml-[5vw]">{values.map(({ icon: Icon, title, copy }, index) => <Reveal key={title} transition={{ delay: index * .06 }} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-black/10 py-7"><span className="grid size-12 place-items-center rounded-2xl bg-vic-blue-soft text-vic-blue"><Icon size={21} /></span><div><h3 className="mb-1.5 font-semibold tracking-[-.02em]">{title}</h3><p className="m-0 text-sm leading-7 text-vic-muted">{copy}</p></div></Reveal>)}</div></div></section>;
}
