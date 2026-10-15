import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

type DialogContentProps = { children: ReactNode; className?: string; title: string; description?: string };

export function DialogContent({ children, className, title, description }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <AnimatePresence>
        <DialogPrimitive.Overlay asChild>
          <motion.div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
            className={cn("glass-surface fixed left-1/2 top-1/2 z-[121] w-[min(calc(100%-2.25rem),35rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white/92 p-7 shadow-[0_36px_100px_rgba(0,0,0,.28)] md:p-9", className)}
          >
            <div className="pr-12">
              <p className="mb-3 font-mono text-xs font-semibold tracking-wider text-vic-blue">VIC / THÔNG TIN</p>
              <DialogPrimitive.Title className="text-balance text-2xl font-bold leading-tight tracking-[-.035em]">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="mt-4 leading-7 text-vic-muted">{description}</DialogPrimitive.Description>}
            </div>
            {children}
            <DialogPrimitive.Close className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-vic-surface transition-colors hover:bg-vic-blue-soft hover:text-vic-blue" aria-label="Đóng hộp thoại"><X size={19} /></DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
}
