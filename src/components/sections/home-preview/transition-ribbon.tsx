import { VicLogo } from "../../shared/vic-logo";
import { usePreviewVisibility } from "./use-preview-visibility";

const primaryItems = ["HỌC CÙNG NHAU", "LÀM CÙNG NHAU", "LỚN LÊN CÙNG NHAU"];
const secondaryItems = ["TECH SHARING", "HACKATHON", "CREATIVE STUDIO", "NGOẠI KHÓA HẰNG THÁNG"];

function RibbonTrack({
  items,
  lane,
  direction,
}: {
  items: string[];
  lane: "primary" | "secondary";
  direction: "left" | "right";
}) {
  return (
    <div className={`home-preview-ribbon-lane home-preview-ribbon-lane-${lane}`}>
      <div className={`home-preview-ribbon-track home-preview-ribbon-track-${direction}`}>
        {[0, 1].map((copy) => (
          <div className="home-preview-ribbon-set" key={copy} aria-hidden="true">
            {items.map((item, index) => (
              <span className="home-preview-ribbon-item" key={`${item}-${index}`}>
                {lane === "primary" ? <i className="home-preview-ribbon-dot" /> : <i className="home-preview-ribbon-slash">/</i>}
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransitionRibbon({ motionEnabled }: { motionEnabled: boolean }) {
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();

  return (
    <section
      ref={ref}
      data-preview-visible={isVisible}
      data-motion={motionEnabled ? "on" : "off"}
      className="home-preview-transition"
      aria-hidden="true"
    >
      <RibbonTrack items={secondaryItems} lane="secondary" direction="right" />
      <RibbonTrack items={primaryItems} lane="primary" direction="left" />
      <span className="home-preview-transition-emblem">
        <span className="home-preview-transition-emblem-halo" />
        <VicLogo className="home-preview-transition-logo" />
      </span>
    </section>
  );
}
