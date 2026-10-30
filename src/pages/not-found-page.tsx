import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function NotFoundPage({ embedded = false }: { embedded?: boolean }) {
  return <main id={embedded ? undefined : "main"} className="grid min-h-[75vh] place-items-center px-5 pb-20 pt-36 text-center"><div><p className="font-mono text-sm font-semibold text-vic-blue">404 / NOT FOUND</p><h1 className="mt-5 text-[clamp(3rem,10vw,7rem)] font-extrabold leading-none tracking-[-.07em]">Không tìm thấy trang.</h1><p className="mx-auto mt-6 max-w-xl leading-7 text-vic-muted">Đường dẫn có thể đã thay đổi hoặc nội dung chưa được tạo. Hãy quay lại trang chủ để tiếp tục khám phá VIC.</p><Button asChild className="mt-8"><Link to="/"><ArrowLeft size={17} /> Về trang chủ</Link></Button></div></main>;
}
