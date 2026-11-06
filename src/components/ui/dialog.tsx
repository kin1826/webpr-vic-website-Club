import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

type DialogContentProps = { children: ReactNode; className?: string; title: string; description?: string; position?: "center" | "right" };

export function DialogContent({ children, className, title, description, position = "center" }: DialogContentProps) {
  const isRightPanel = position === "right";
  const placement = isRightPanel
    ? "glass-surface fixed inset-y-0 right-0 z-[121] flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white/96 shadow-[-24px_0_90px_rgba(0,0,0,.2)] md:w-[min(100%,42rem)] md:rounded-l-[2rem]"
    : "glass-surface fixed left-1/2 top-1/2 z-[121] w-[min(calc(100%-2.25rem),35rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white/92 p-7 shadow-[0_36px_100px_rgba(0,0,0,.28)] md:p-9";
  return (
    <DialogPrimitive.Portal>
      <AnimatePresence>
        <DialogPrimitive.Overlay asChild>
          <motion.div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild>
          <motion.div
            initial={isRightPanel ? { opacity: 0, x: 36 } : { opacity: 0, y: 22, scale: .97 }} animate={isRightPanel ? { opacity: 1, x: 0 } : { opacity: 1, y: 0, scale: 1 }} exit={isRightPanel ? { opacity: 0, x: 28 } : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
            className={cn(placement, className)}
          >
            <div className={isRightPanel ? "shrink-0 px-6 pb-5 pr-16 pt-7 md:px-8 md:pr-16" : "pr-12"}>
              <p className="mb-3 font-mono text-xs font-semibold tracking-wider text-vic-blue">VIC / THÔNG TIN</p>
              <DialogPrimitive.Title className="text-balance text-2xl font-bold leading-tight tracking-[-.035em]">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="mt-4 leading-7 text-vic-muted">{description}</DialogPrimitive.Description>}
            </div>
            {isRightPanel ? <div className="min-h-0 flex-1 overflow-y-auto">{children}</div> : children}
            <DialogPrimitive.Close className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-vic-surface transition-colors hover:bg-vic-blue-soft hover:text-vic-blue" aria-label="Đóng hộp thoại"><X size={19} /></DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
}
