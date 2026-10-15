import { faqs } from "../../data/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Reveal } from "../shared/reveal";
import { SectionHeading } from "../shared/section-heading";

export function FaqSection() {
  return <section id="faq" className="section-space" aria-labelledby="faq-title"><div className="page-container grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-[7vw]"><Reveal><SectionHeading label="06 / FAQ" id="faq-title" title={<>Một vài điều<br />bạn có thể đang hỏi.</>} /></Reveal><Reveal><Accordion type="single" collapsible className="border-t border-black/10">{faqs.map(item => <AccordionItem key={item.id} value={item.id}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent>{item.answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal></div></section>;
}
