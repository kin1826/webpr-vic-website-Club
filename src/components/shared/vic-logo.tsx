import logoUrl from "../../../image/Logo VIC - cut.jpg";
import { cn } from "../../lib/utils";

type VicLogoProps = { className?: string; dark?: boolean };

export function VicLogo({ className, dark = false }: VicLogoProps) {
  return <img src={logoUrl} alt="VIC — VKU IT Club" className={cn("h-auto w-24 object-contain", dark ? "logo-on-dark" : "logo-blend", className)} />;
}
