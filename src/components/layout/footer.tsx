import { Github, Mail, Facebook } from "lucide-react";
import { navigation, officialLinks } from "../../config/site";
import { VicLogo } from "../shared/vic-logo";

export function Footer() {
  const social = [
    { label: "Facebook", href: officialLinks.facebook, icon: Facebook },
    { label: "Email", href: officialLinks.email ? `mailto:${officialLinks.email}` : null, icon: Mail },
    { label: "GitHub", href: officialLinks.github, icon: Github },
  ].filter(item => item.href);
  return <footer className="bg-vic-ink py-10 text-white">
    <div className="page-container">
      <div className="grid min-h-48 gap-12 border-b border-white/12 pb-11 md:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-4 self-start"><VicLogo dark className="w-28" /><div><strong>VKU IT CLUB</strong><p className="mt-1 text-sm text-white/55">We dream it. We make it.</p></div></div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">{navigation.map(item => <a className="text-sm text-white/65 hover:text-white" key={item.href} href={`/${item.href}`}>{item.label}</a>)}<a href="/#join" className="text-sm text-white/65 hover:text-white">Tham gia</a><a href="/#faq" className="text-sm text-white/65 hover:text-white">Câu hỏi</a><a href="/design-system" className="text-sm text-white/65 hover:text-white">Design system</a></div>
        {social.length > 0 && <div className="flex gap-2">{social.map(({ label, href, icon: Icon }) => <a key={label} href={href ?? undefined} aria-label={label} className="grid size-11 place-items-center rounded-full border border-white/15 hover:bg-white hover:text-vic-ink"><Icon size={18} /></a>)}</div>}
      </div>
      <div className="flex flex-col gap-3 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} VIC — VKU IT Club</span><span>Bản mẫu giao diện — nội dung đang được hoàn thiện.</span></div>
    </div>
  </footer>;
}
