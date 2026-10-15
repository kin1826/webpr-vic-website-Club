import { Facebook, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { clubSettings } from "../../data/site-data";
import { VicLogo } from "../shared/vic-logo";

const footerLinks = [
  { label: "Về VIC", to: "/gioi-thieu" }, { label: "Ban Học tập", to: "/hoctap" }, { label: "Ban Truyền thông", to: "/truyenthong" },
  { label: "Hoạt động", to: "/hoat-dong" }, { label: "Sản phẩm", to: "/san-pham" }, { label: "Học thuật", to: "/hoc-thuat" }, { label: "Tham gia", to: "/tham-gia" },
];

export function Footer() {
  const social = [
    { label: "Facebook", href: clubSettings.facebookUrl, icon: Facebook },
    { label: "Email", href: clubSettings.contactEmail ? `mailto:${clubSettings.contactEmail}` : null, icon: Mail },
    { label: "GitHub", href: clubSettings.githubUrl, icon: Github },
  ].filter((item) => item.href);
  return <footer className="bg-vic-ink py-10 text-white"><div className="page-container"><div className="grid min-h-48 gap-12 border-b border-white/12 pb-11 md:grid-cols-[1fr_auto]"><div className="flex items-center gap-4 self-start"><VicLogo dark className="w-28" /><div><strong>VKU IT CLUB</strong><p className="mt-1 text-sm text-white/55">We dream it. We make it.</p></div></div><nav className="grid grid-cols-2 gap-x-12 gap-y-2" aria-label="Điều hướng cuối trang">{footerLinks.map((item) => <Link className="text-sm text-white/65 hover:text-white" key={item.to} to={item.to}>{item.label}</Link>)}<Link to="/design-system" className="text-sm text-white/65 hover:text-white">Design system</Link></nav>{social.length > 0 && <div className="flex gap-2">{social.map(({ label, href, icon: Icon }) => <a key={label} href={href ?? undefined} aria-label={label} className="grid size-11 place-items-center rounded-full border border-white/15 hover:bg-white hover:text-vic-ink"><Icon size={18} /></a>)}</div>}</div><div className="flex flex-col gap-3 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} VIC — VKU IT Club</span><span>Bản mẫu giao diện — nội dung đang được hoàn thiện.</span></div></div></footer>;
}
