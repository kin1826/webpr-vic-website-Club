import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { departments, members, organizationPositions } from "../../data/site-data";
import type { OrganizationPosition } from "../../types/content-model";

function PositionCard({ position }: { position: OrganizationPosition }) {
  const member = position.memberId ? members.find((item) => item.id === position.memberId) : undefined;
  const content = <><span className="grid size-11 place-items-center rounded-2xl bg-vic-blue-soft text-vic-blue"><UserRound size={19} /></span><span><strong className="block text-sm">{member?.name ?? position.title}</strong><small className="mt-1 block leading-5 text-vic-muted">{member ? position.title : position.note}</small>{member && <small className="mt-2 hidden font-semibold text-vic-blue sm:block">Xem hồ sơ & portfolio ↗</small>}</span></>;
  const className = "glass-surface interactive-card grid min-h-24 grid-cols-[2.75rem_1fr] items-center gap-3 rounded-[1.4rem] p-4 text-left";
  return member ? <Link to={`/thanh-vien/${member.slug}`} className={className}>{content}</Link> : <div className={className}>{content}</div>;
}

export function OrganizationChart() {
  const chairs = organizationPositions.filter((item) => item.departmentId === null && item.title === "Chủ nhiệm");
  const viceChairs = organizationPositions.filter((item) => item.departmentId === null && item.title === "Phó Chủ nhiệm");
  return <div id="doi-ngu" className="scroll-mt-32">
    <div className="mx-auto grid max-w-sm gap-3">{chairs.map((position) => <PositionCard key={position.id} position={position} />)}</div><div className="mx-auto h-8 w-px bg-black/15" /><div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">{viceChairs.map((position) => <PositionCard key={position.id} position={position} />)}</div><div className="mx-auto h-8 w-px bg-black/15" />
    <div className="relative grid gap-8 md:grid-cols-2 md:gap-12 before:absolute before:left-1/4 before:right-1/4 before:top-0 before:hidden before:h-px before:bg-black/15 md:before:block">{departments.map((department) => { const positions = organizationPositions.filter((item) => item.departmentId === department.id); return <div key={department.id} className="relative pt-0 md:pt-8 before:absolute before:left-1/2 before:top-0 before:hidden before:h-8 before:w-px before:bg-black/15 md:before:block"><div className="mb-4 text-center"><p className="font-mono text-xs font-semibold text-vic-blue">{department.name.toUpperCase()}</p></div><div className="grid gap-3">{positions.map((position) => <PositionCard key={position.id} position={position} />)}<div className="rounded-[1.4rem] border border-dashed border-black/15 bg-white/45 p-4 text-center text-sm text-vic-muted">Nhóm thành viên — dữ liệu sẽ được cập nhật</div></div></div>; })}</div>
  </div>;
}
