import { useEffect, useRef } from "react";

type InteractiveGridProps = { enabled: boolean };
type GridController = (enabled: boolean) => void;

const CELL_SIZE = 64;

export function InteractiveGrid({ enabled }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GridController | null>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;
    const heroNode = canvasNode.parentElement;
    if (!heroNode) return;
    const contextNode = canvasNode.getContext("2d");
    if (!contextNode) return;
    const canvas: HTMLCanvasElement = canvasNode;
    const hero: HTMLElement = heroNode;
    const context: CanvasRenderingContext2D = contextNode;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const gridLayer = document.createElement("canvas");
    const gridContext = gridLayer.getContext("2d");
    const pointer = { x: -1000, y: -1000 };
    let heroDocumentLeft = 0;
    let heroDocumentTop = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 0;
    let columns = 0;
    let rows = 0;
    let values = new Float64Array(0);
    let centersX = new Float64Array(0);
    let centersY = new Float64Array(0);
    let columnPhases = new Float64Array(0);
    let rowPhases = new Float64Array(0);
    let motionEnabled = enabled;
    let heroVisible = true;
    let pageVisible = document.visibilityState === "visible";
    let frame = 0;

    const shouldAnimate = () => motionEnabled && !reduce.matches && heroVisible && pageVisible;

    function measureHero() {
      const rect = hero.getBoundingClientRect();
      heroDocumentLeft = rect.left + window.scrollX;
      heroDocumentTop = rect.top + window.scrollY;
    }

    function drawStaticGrid() {
      if (!gridContext) return;
      gridContext.clearRect(0, 0, width, height);
      gridContext.strokeStyle = "rgba(20,20,20,.13)";
      gridContext.lineWidth = 0.7;

      for (let x = 0; x <= width; x += CELL_SIZE) {
        gridContext.beginPath();
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, height);
        gridContext.stroke();
      }
      for (let y = 0; y <= height; y += CELL_SIZE) {
        gridContext.beginPath();
        gridContext.moveTo(0, y);
        gridContext.lineTo(width, y);
        gridContext.stroke();
      }
    }

    function draw(timestamp: number) {
      frame = 0;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(20,20,20,.13)";
      context.lineWidth = 0.7;

      if (gridLayer.width > 0 && gridLayer.height > 0) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(gridLayer, 0, 0);
        context.restore();
      } else {
        context.strokeStyle = "rgba(20,20,20,.13)";
        context.lineWidth = 0.7;
        for (let x = 0; x <= width; x += CELL_SIZE) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }
        for (let y = 0; y <= height; y += CELL_SIZE) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }
      }

      const paused = !motionEnabled || reduce.matches;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          const distance = Math.hypot(centersX[column] - pointer.x, centersY[row] - pointer.y);
          const target = paused ? 0 : Math.max(0, 1 - distance / 190);
          const value = values[index] + (target - values[index]) * 0.12;
          values[index] = value;
          const ambient = paused
            ? 0
            : Math.pow(
                Math.max(0, Math.sin(timestamp * 0.0007 + columnPhases[column] + rowPhases[row])),
                18,
              ) * 0.045;

          if (value > 0.008 || ambient > 0.002) {
            const x = column * CELL_SIZE;
            const y = row * CELL_SIZE;
            const cellRenderSize = CELL_SIZE * (1 - value * 0.19);
            const offset = (CELL_SIZE - cellRenderSize) / 2;
            context.fillStyle = `rgba(36,87,245,${value * 0.14 + ambient})`;
            context.fillRect(x + offset, y + offset, cellRenderSize, cellRenderSize);
            if (value > 0.04) {
              context.strokeStyle = `rgba(20,20,20,${value * 0.5})`;
              context.strokeRect(x + offset + 0.5, y + offset + 0.5, cellRenderSize - 1, cellRenderSize - 1);
            }
          }
        }
      }

      if (shouldAnimate() && frame === 0) frame = requestAnimationFrame(draw);
    }

    function cancelFrame() {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function renderWhenVisible() {
      if (!heroVisible || !pageVisible) return;
      if (shouldAnimate()) {
        if (!frame) frame = requestAnimationFrame(draw);
      } else {
        cancelFrame();
        draw(performance.now());
      }
    }

    function resize() {
      measureHero();
      const nextWidth = hero.clientWidth;
      const nextHeight = hero.clientHeight;
      const nextPixelRatio = Math.min(devicePixelRatio || 1, 2);
      if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;

      cancelFrame();
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      gridLayer.width = canvas.width;
      gridLayer.height = canvas.height;
      gridContext?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      columns = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);
      const cellCount = columns * rows;
      values = new Float64Array(cellCount);
      centersX = new Float64Array(columns);
      centersY = new Float64Array(rows);
      columnPhases = new Float64Array(columns);
      rowPhases = new Float64Array(rows);

      for (let row = 0; row < rows; row += 1) {
        centersY[row] = row * CELL_SIZE + CELL_SIZE / 2;
        rowPhases[row] = row * 0.5;
      }
      for (let column = 0; column < columns; column += 1) {
        centersX[column] = column * CELL_SIZE + CELL_SIZE / 2;
        columnPhases[column] = column * 0.75;
      }

      drawStaticGrid();
      draw(performance.now());
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX + window.scrollX - heroDocumentLeft;
      pointer.y = event.clientY + window.scrollY - heroDocumentTop;
    };
    const onPointerEnter = () => measureHero();
    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const onViewportResize = () => resize();
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) renderWhenVisible();
      else cancelFrame();
    };
    const onReduceChange = () => renderWhenVisible();

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          if (heroVisible) renderWhenVisible();
          else cancelFrame();
        })
      : null;

    hero.addEventListener("pointerenter", onPointerEnter, { passive: true });
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onViewportResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reduce.addEventListener("change", onReduceChange);
    resizeObserver.observe(hero);
    intersectionObserver?.observe(hero);
    resize();

    controllerRef.current = (nextEnabled) => {
      if (motionEnabled === nextEnabled) return;
      motionEnabled = nextEnabled;
      if (!nextEnabled) {
        values.fill(0);
        pointer.x = -1000;
        pointer.y = -1000;
      }
      renderWhenVisible();
    };

    return () => {
      controllerRef.current = null;
      cancelFrame();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      hero.removeEventListener("pointerenter", onPointerEnter);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onViewportResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.(enabled);
  }, [enabled]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" />;
}
