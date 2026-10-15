import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<ElementRef<typeof AccordionPrimitive.Item>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn("border-b border-black/10", className)} {...props} />,
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<ElementRef<typeof AccordionPrimitive.Trigger>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger ref={ref} className={cn("group flex min-h-[5.25rem] w-full items-center justify-between gap-5 py-5 text-left text-base font-semibold hover:text-vic-blue", className)} {...props}>
        {children}<span className="grid size-9 shrink-0 place-items-center rounded-full border border-black/10 transition-all group-data-[state=open]:rotate-45 group-data-[state=open]:bg-vic-blue-soft group-data-[state=open]:text-vic-blue"><Plus size={17} /></span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<ElementRef<typeof AccordionPrimitive.Content>, ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm text-vic-muted data-[state=closed]:animate-none" {...props}><div className={cn("max-w-2xl pb-6 pr-12 leading-7", className)}>{children}</div></AccordionPrimitive.Content>,
);
AccordionContent.displayName = "AccordionContent";
