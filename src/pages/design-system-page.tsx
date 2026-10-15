import { ArrowRight, Bell, Code2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";

const colors = [
  { name: "Background", value: "#FAFAF8", className: "bg-vic-bg" },
  { name: "Surface", value: "#F1F3F6", className: "bg-vic-surface" },
  { name: "Ink", value: "#161616", className: "bg-vic-ink" },
  { name: "VIC Blue", value: "#2457F5", className: "bg-vic-blue" },
  { name: "Blue Soft", value: "#EAF0FF", className: "bg-vic-blue-soft" },
];

function Showcase({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-t border-black/10 py-12"><h2 className="mb-7 text-2xl font-bold tracking-[-.035em]">{title}</h2>{children}</section>;
}

export function DesignSystemPage() {
  return <main id="main" className="page-container pb-24 pt-36">
    <p className="section-label">VIC / DESIGN SYSTEM</p><h1 className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[1.05] tracking-[-.06em]">Một ngôn ngữ chung<br />cho những ý tưởng mới.</h1><p className="section-intro mb-20">Trang tham chiếu dành cho thành viên VIC khi thiết kế và phát triển những phần mới của website.</p>
    <Showcase title="Màu sắc"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{colors.map(color => <div key={color.name} className="overflow-hidden rounded-3xl border border-black/10 bg-white"><div className={`h-28 ${color.className}`} /><div className="p-4"><strong className="text-sm">{color.name}</strong><p className="mt-1 font-mono text-xs text-vic-muted">{color.value}</p></div></div>)}</div></Showcase>
    <Showcase title="Typography"><div className="grid gap-8 lg:grid-cols-2"><div><p className="font-mono text-xs text-vic-blue">DISPLAY / BE VIETNAM PRO</p><p className="mt-3 text-5xl font-extrabold leading-tight tracking-[-.05em]">We make it.</p></div><div><p className="font-mono text-xs text-vic-blue">BODY / REGULAR</p><p className="mt-3 max-w-xl leading-8 text-vic-muted">Nội dung được viết rõ ràng, gần gũi và có đủ khoảng thở để người đọc nhanh chóng nắm được thông tin.</p></div></div></Showcase>
    <Showcase title="Buttons & states"><div className="flex flex-wrap items-center gap-3"><Button>Primary <ArrowRight size={17} /></Button><Button variant="secondary">Secondary</Button><Button variant="glass"><Sparkles size={17} /> Glass</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button><Button size="icon" aria-label="Thông báo"><Bell size={18} /></Button></div><p className="mt-5 text-xs text-vic-muted">Dùng Tab để kiểm tra trạng thái focus; hover các nút để xem chuyển động và màu sắc.</p></Showcase>
    <Showcase title="Tags"><div className="flex flex-wrap gap-2"><Badge>Lập trình</Badge><Badge>Thiết kế</Badge><Badge className="border-vic-blue/20 bg-vic-blue-soft text-vic-blue">Trạng thái nhấn</Badge></div></Showcase>
    <Showcase title="Liquid Glass"><div className="relative overflow-hidden rounded-[2.5rem] bg-vic-blue-soft p-8 md:p-14"><div className="gradient-orb absolute -right-16 -top-16 size-52 rounded-full opacity-60" /><div className="glass-surface glass-highlight relative max-w-lg rounded-[2rem] p-8"><span className="mb-6 grid size-12 place-items-center rounded-2xl bg-vic-ink text-white"><Code2 size={21} /></span><h3 className="text-2xl font-semibold tracking-[-.035em]">Bề mặt có chiều sâu</h3><p className="mt-3 leading-7 text-vic-muted">Blur, viền bắt sáng và bóng mềm được đặt trên nền có lớp để hiệu ứng kính thực sự dễ nhận thấy.</p></div></div></Showcase>
    <Showcase title="Dialog & Accordion"><div className="grid gap-8 lg:grid-cols-2"><Dialog><DialogTrigger asChild><Button>Mở dialog mẫu</Button></DialogTrigger><DialogContent title="Dialog của VIC" description="Primitive shadcn/ui đã được tùy biến theo hệ màu, radius và chuyển động của website."><p className="mt-6 rounded-2xl bg-vic-blue-soft p-4 text-sm text-vic-blue">Escape hoặc nút đóng đều hoạt động và focus sẽ trở về trigger.</p></DialogContent></Dialog><Accordion type="single" collapsible className="border-t border-black/10"><AccordionItem value="one"><AccordionTrigger>Accordion hoạt động thế nào?</AccordionTrigger><AccordionContent>Mỗi item sử dụng Radix primitive, hỗ trợ bàn phím và thuộc tính ARIA sẵn có.</AccordionContent></AccordionItem><AccordionItem value="two"><AccordionTrigger>Khi nào nên dùng?</AccordionTrigger><AccordionContent>Dùng cho nhóm nội dung phụ cần mở theo nhu cầu, không dùng để giấu thông tin cốt lõi.</AccordionContent></AccordionItem></Accordion></div></Showcase>
  </main>;
}
