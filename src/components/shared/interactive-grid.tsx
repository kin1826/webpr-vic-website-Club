import { useEffect, useRef } from "react";

type InteractiveGridProps = { enabled: boolean };
type GridCell = { v: number };

export function InteractiveGrid({ enabled }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.parentElement;
    if (!hero) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const canvasElement: HTMLCanvasElement = canvas;
    const heroElement: HTMLElement = hero;
    const drawingContext: CanvasRenderingContext2D = context;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let paused = !enabled || reduce.matches;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let cells: GridCell[] = [];
    let pointer = { x: -1000, y: -1000 };
    let frame = 0;
    const size = 64;

    function resize() {
      width = heroElement.clientWidth;
      height = heroElement.clientHeight;
      const pixelRatio = Math.min(devicePixelRatio || 1, 2);
      canvasElement.width = width * pixelRatio;
      canvasElement.height = height * pixelRatio;
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      columns = Math.ceil(width / size);
      rows = Math.ceil(height / size);
      cells = Array.from({ length: columns * rows }, () => ({ v: 0 }));
      draw(performance.now());
    }

    function draw(timestamp: number) {
      drawingContext.clearRect(0, 0, width, height);
      drawingContext.strokeStyle = "rgba(20,20,20,.13)";
      drawingContext.lineWidth = 0.7;

      for (let x = 0; x <= width; x += size) {
        drawingContext.beginPath();
        drawingContext.moveTo(x, 0);
        drawingContext.lineTo(x, height);
        drawingContext.stroke();
      }
      for (let y = 0; y <= height; y += size) {
        drawingContext.beginPath();
        drawingContext.moveTo(0, y);
        drawingContext.lineTo(width, y);
        drawingContext.stroke();
      }

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * size;
          const y = row * size;
          const centerX = x + size / 2;
          const centerY = y + size / 2;
          const distance = Math.hypot(centerX - pointer.x, centerY - pointer.y);
          const cell = cells[row * columns + column];
          const target = paused ? 0 : Math.max(0, 1 - distance / 190);
          cell.v += (target - cell.v) * 0.12;
          const ambient = paused
            ? 0
            : Math.pow(Math.max(0, Math.sin(timestamp * 0.0007 + column * 0.75 + row * 0.5)), 18) * 0.045;

          if (cell.v > 0.008 || ambient > 0.002) {
            const cellRenderSize = size * (1 - cell.v * 0.19);
            const offset = (size - cellRenderSize) / 2;
            drawingContext.fillStyle = `rgba(36,87,245,${cell.v * 0.14 + ambient})`;
            drawingContext.fillRect(x + offset, y + offset, cellRenderSize, cellRenderSize);
            if (cell.v > 0.04) {
              drawingContext.strokeStyle = `rgba(20,20,20,${cell.v * 0.5})`;
              drawingContext.strokeRect(x + offset + 0.5, y + offset + 0.5, cellRenderSize - 1, cellRenderSize - 1);
            }
          }
        }
      }

      if (!paused) frame = requestAnimationFrame(draw);
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = heroElement.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const onReduceChange = (event: MediaQueryListEvent) => {
      paused = !enabled || event.matches;
      cancelAnimationFrame(frame);
      draw(performance.now());
    };
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      resize();
    });

    heroElement.addEventListener("pointermove", onPointerMove, { passive: true });
    heroElement.addEventListener("pointerleave", onPointerLeave);
    reduce.addEventListener("change", onReduceChange);
    resizeObserver.observe(heroElement);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      heroElement.removeEventListener("pointermove", onPointerMove);
      heroElement.removeEventListener("pointerleave", onPointerLeave);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" />;
}
