import { ArrowUpRight, GitBranch, MoveDown } from "lucide-react";
import { Link } from "react-router-dom";
import { departments, members, organizationPositions } from "../../data/site-data";
import type { OrganizationPosition } from "../../types/content-model";
import { Reveal } from "./reveal";

function Role({ position }: { position: OrganizationPosition }) {
  const member = position.memberId ? members.find((item) => item.id === position.memberId) : undefined;
  return <li><span>{position.title}</span><span>{member?.name ?? position.note}</span></li>;
}

export function HyperOrganization() {
  const board = organizationPositions.filter((position) => position.departmentId === null);
  return (
    <section id="hyper-organization" className="hyper-section hyper-organization" aria-labelledby="hyper-org-title">
      <div className="hyper-container">
        <Reveal className="hyper-section-heading">
          <div><p className="hyper-kicker hyper-kicker--dark"><span /> Một mạng lưới cùng vận hành</p><h2 id="hyper-org-title">Cùng giữ cho<br /><em>mạch được mở.</em></h2></div>
          <div><p>Cơ cấu giúp các nhóm phối hợp và trao lại kinh nghiệm cho những thành viên tiếp theo.</p><Link className="hyper-inline-link" to="/gioi-thieu#doi-ngu">Xem đội ngũ VIC <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </Reveal>
        <div className="hyper-org-scene" role="group" aria-label="Sơ đồ tổ chức VIC">
          <Reveal className="hyper-org-board">
            <span className="hyper-org-port" aria-hidden="true" />
            <div className="hyper-org-board-top"><GitBranch size={17} aria-hidden="true" /><strong>Ban Chủ nhiệm</strong></div>
            <ul>{board.map((position) => <Role key={position.id} position={position} />)}</ul>
          </Reveal>
          <div className="hyper-org-spine" aria-hidden="true"><i /><MoveDown size={18} /><i /></div>
          <div className="hyper-org-branches">
            {departments.map((department, index) => {
              const roles = organizationPositions.filter((position) => position.departmentId === department.id);
              return (
                <Reveal key={department.id} delay={index * 0.11} className={"hyper-org-branch hyper-org-branch--" + department.id}>
                  <span className="hyper-org-port" aria-hidden="true" />
                  <h3>{department.name}</h3>
                  <ul>{roles.map((position) => <Role key={position.id} position={position} />)}</ul>
                  <Link to={"/" + department.slug}>Xem ban <ArrowUpRight size={15} aria-hidden="true" /></Link>
                </Reveal>
              );
            })}
          </div>
        </div>
        <p className="hyper-editor-note">Ban Chủ nhiệm và các ban hiển thị theo dữ liệu nhân sự VIC đã xác nhận.</p>
      </div>
    </section>
  );
}
