import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { homePreviewContent } from "../../data/home-preview-content";
import { Reveal } from "./reveal";

export function HyperAbout() {
  return (
    <section id="hyper-about" className="hyper-section hyper-about" aria-labelledby="hyper-about-title">
      <div className="hyper-container">
        <Reveal className="hyper-about-lead">
          <div>
            <p className="hyper-kicker hyper-kicker--dark"><span /> Bắt đầu từ một điều muốn biết</p>
            <h2 id="hyper-about-title">Học cùng nhau.<br /><span>Làm thành điều thật.</span></h2>
          </div>
          <div className="hyper-about-copy">
            <p>{homePreviewContent.description}</p>
            <Link className="hyper-inline-link" to="/gioi-thieu">Tìm hiểu về VIC <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </Reveal>

        <div className="hyper-direction-stage">
          <div className="hyper-direction-model" aria-hidden="true">
            <div className="hyper-model-ring hyper-model-ring--back" />
            <div className="hyper-model-slab hyper-model-slab--one"><i /></div>
            <div className="hyper-model-slab hyper-model-slab--two"><i /></div>
            <div className="hyper-model-core"><span /></div>
            <div className="hyper-model-circuit"><i /><i /><i /></div>
            <MoveUpRight className="hyper-model-arrow" size={24} />
          </div>
          <div className="hyper-directions">
            {[homePreviewContent.shortTerm, homePreviewContent.longTerm].map((item, index) => (
              <Reveal key={item.timeframe} delay={index * 0.12} direction={index ? "right" : "left"} className="hyper-direction">
                <p className="hyper-direction-time">{item.timeframe}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="hyper-editor-note">{homePreviewContent.editorialNote}</p>
      </div>
    </section>
  );
}
