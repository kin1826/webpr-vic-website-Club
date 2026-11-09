import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import type { InteractiveGridPalette } from "../components/shared/interactive-grid";
import { HomePreviewPage } from "./home-preview-page";
import "../styles/color-preview-theme.css";
import "../styles/home-color-preview.css";
import "../styles/home-preview-lucian.css";

const gridPalette = {
  line: [215, 225, 245],
  fill: [21, 88, 201],
  stroke: [212, 255, 36],
} as const satisfies InteractiveGridPalette;

const homePath = "/home-preview";
const recruitmentPath = "/tuyen-thanh-vien-preview";

export function HomeColorPreviewPage() {
  return (
    <div className="vic-color-preview" data-vic-theme="home-demo01" data-vic-details="lucian">
      <Header homePath={homePath} recruitmentPath={recruitmentPath} lucianCta />
      <HomePreviewPage recruitmentPath={recruitmentPath} gridPalette={gridPalette} colorPreview lucianInteractions />
      <Footer recruitmentPath={recruitmentPath} />
    </div>
  );
}
