// Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { FaqItem } from "../../../types/content-model";

export function LucianFaqAccordion({ items }: { items: FaqItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();
  const questionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const { key } = event;
    let nextIndex: number | undefined;
    if (key === "ArrowDown") nextIndex = (index + 1) % items.length;
    if (key === "ArrowUp") nextIndex = (index + items.length - 1) % items.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = items.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    questionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="ux u044" role="group" aria-label="Câu hỏi thường gặp">
      {items.map((item, index) => {
        const isOpen = activeId === item.id;
        const questionId = `${baseId}-question-${index}`;
        const answerId = `${baseId}-answer-${index}`;
        return (
          <div className={`u044-it${isOpen ? " open" : ""}`} key={item.id}>
            <button
              ref={(node) => { questionRefs.current[index] = node; }}
              id={questionId}
              className="u044-q"
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setActiveId(isOpen ? null : item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="u044-n">{String(index + 1).padStart(2, "0")}</span>
              <span className="u044-t">{item.question}</span>
              <span className="u044-pm" aria-hidden="true" />
            </button>
            <div
              className="u044-body"
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div><div className="u044-a"><p>{item.answer}</p></div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
