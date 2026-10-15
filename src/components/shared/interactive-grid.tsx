import { useEffect, useRef } from "react";

type InteractiveGridProps = { enabled: boolean };

export function InteractiveGrid({ enabled }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let visible = true;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canAnimate = enabled && !reduceMotion;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const size = width < 680 ? 54 : 68;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(22,22,22,.115)";
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += size) { context.beginPath(); context.moveTo(x + .5, 0); context.lineTo(x + .5, height); context.stroke(); }
      for (let y = 0; y <= height; y += size) { context.beginPath(); context.moveTo(0, y + .5); context.lineTo(width, y + .5); context.stroke(); }
      if (canAnimate && pointer.current.x > -1000) {
        const col = Math.floor(pointer.current.x / size);
        const row = Math.floor(pointer.current.y / size);
        for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) {
          const alpha = Math.max(0, .14 - Math.hypot(dx, dy) * .045);
          context.fillStyle = `rgba(36,87,245,${alpha})`;
          context.fillRect((col + dx) * size + 2, (row + dy) * size + 2, size - 3, size - 3);
        }
      }
    };

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.75);
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * ratio); canvas.height = Math.floor(rect.height * ratio);
      canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
    };
    const loop = () => { if (!canAnimate || !visible || document.hidden) { frame = 0; draw(); return; } draw(); frame = requestAnimationFrame(loop); };
    const onPointerMove = (event: PointerEvent) => { const rect = parent.getBoundingClientRect(); pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }; if (canAnimate && !frame) loop(); };
    const onPointerLeave = () => { pointer.current = { x: -9999, y: -9999 }; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && canAnimate && !frame) loop(); else if (!visible) { cancelAnimationFrame(frame); frame = 0; } });
    const onVisibility = () => { if (!document.hidden && visible && canAnimate && !frame) loop(); };

    resize(); draw(); if (canAnimate) loop(); observer.observe(parent);
    parent.addEventListener("pointermove", onPointerMove, { passive: true }); parent.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true }); document.addEventListener("visibilitychange", onVisibility);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); parent.removeEventListener("pointermove", onPointerMove); parent.removeEventListener("pointerleave", onPointerLeave); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVisibility); };
  }, [enabled]);

  return <canvas ref={canvasRef} className="hero-mask pointer-events-none absolute inset-0 size-full" aria-hidden="true" />;
}
