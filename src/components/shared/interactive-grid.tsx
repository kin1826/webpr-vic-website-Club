import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";

export type InteractiveGridPalette = {
  line: readonly [number, number, number];
  fill: readonly [number, number, number];
  stroke: readonly [number, number, number];
};

export type InteractiveGridHandle = {
  flipToTheme: (
    palette: InteractiveGridPalette,
    originX: number,
    originY: number,
    onComplete: () => void,
  ) => boolean;
};

type InteractiveGridProps = { enabled: boolean; palette?: InteractiveGridPalette };
type GridController = {
  update: (enabled: boolean, refreshPalette?: boolean) => void;
  flipToTheme: InteractiveGridHandle["flipToTheme"];
};

type GridFlip = {
  from: InteractiveGridPalette;
  to: InteractiveGridPalette;
  startTime: number;
  maxDelay: number;
  delays: Float32Array;
  active: Uint8Array;
  values: Float64Array;
  ambient: Float64Array;
  onComplete: () => void;
};

const CELL_SIZE = 64;
const FLIP_DURATION_MS = 640;
const WAVE_SPREAD_MS = 360;
const FLIP_FOCAL_LENGTH = 190;
const ORIGINAL_PALETTE: InteractiveGridPalette = { line: [20, 20, 20], fill: [36, 87, 245], stroke: [20, 20, 20] };
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

function drawProjectedCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
  focalLength: number,
  fill: string,
  stroke: string,
  edge: string,
) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const project = (cornerX: number, cornerY: number) => {
    const localY = cornerY - centerY;
    const depth = localY * sine;
    const perspective = focalLength / Math.max(focalLength - depth, 48);
    return {
      x: centerX + (cornerX - centerX) * perspective,
      y: centerY + localY * cosine * perspective,
    };
  };
  const corners = [project(x, y), project(x + size, y), project(x + size, y + size), project(x, y + size)];

  context.beginPath();
  context.moveTo(corners[0].x, corners[0].y);
  for (let corner = 1; corner < corners.length; corner += 1) context.lineTo(corners[corner].x, corners[corner].y);
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();

  const edgeWidth = Math.max(1, size * (0.025 + Math.abs(cosine) * 0.055));
  context.beginPath();
  context.moveTo(corners[0].x, corners[0].y);
  context.lineTo(corners[1].x, corners[1].y);
  context.lineTo(corners[2].x, corners[2].y);
  context.strokeStyle = edge;
  context.lineWidth = edgeWidth;
  context.stroke();
}

export const InteractiveGrid = forwardRef<InteractiveGridHandle, InteractiveGridProps>(function InteractiveGrid(
  { enabled, palette = ORIGINAL_PALETTE },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GridController | null>(null);
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  useImperativeHandle(ref, () => ({
    flipToTheme: (...args) => controllerRef.current?.flipToTheme(...args) ?? false,
  }), []);

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
    let flip: GridFlip | null = null;
    let frame = 0;

    const shouldAnimate = () => motionEnabled && !reduce.matches && heroVisible && pageVisible;

    function measureHero() {
      const rect = hero.getBoundingClientRect();
      heroDocumentLeft = rect.left + window.scrollX;
      heroDocumentTop = rect.top + window.scrollY;
    }

    function finishFlip() {
      if (!flip) return;
      const currentFlip = flip;
      flip = null;
      currentFlip.onComplete();
    }

    function drawStaticGrid() {
      if (!gridContext) return;
      gridContext.clearRect(0, 0, width, height);
      gridContext.strokeStyle = `rgba(${paletteRef.current.line.join(",")},.13)`;
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
      const currentPalette = paletteRef.current;
      const lineColor = `rgba(${currentPalette.line.join(",")},.13)`;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = lineColor;
      context.lineWidth = 0.7;

      if (gridLayer.width > 0 && gridLayer.height > 0) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(gridLayer, 0, 0);
        context.restore();
      } else {
        context.strokeStyle = lineColor;
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

          const isFlipping = Boolean(flip?.active[index]);
          const elapsed = isFlipping && flip ? timestamp - flip.startTime - flip.delays[index] : 0;
          const progress = isFlipping ? clamp(elapsed / FLIP_DURATION_MS, 0, 1) : 0;
          const renderValue = isFlipping && flip ? flip.values[index] : value;
          const renderAmbient = isFlipping && flip ? flip.ambient[index] : ambient;

          if (renderValue > 0.008 || renderAmbient > 0.002) {
            const cellX = column * CELL_SIZE;
            const cellY = row * CELL_SIZE;
            const cellRenderSize = CELL_SIZE * (1 - renderValue * 0.19);
            const offset = (CELL_SIZE - cellRenderSize) / 2;
            const cellPalette = isFlipping && flip && progress >= 0.5 ? flip.to : isFlipping && flip ? flip.from : currentPalette;

            if (isFlipping) {
              const easedProgress = progress * progress * (3 - 2 * progress);
              const angle = Math.PI * easedProgress;
              const faceLight = 0.78 + Math.abs(Math.cos(angle)) * 0.22;
              const fillOpacity = clamp(renderValue * 0.34 + renderAmbient * 1.2 + 0.2, 0.2, 0.72);
              const edgeOpacity = 0.42 + (1 - Math.abs(Math.cos(angle))) * 0.48;
              const rgb = cellPalette.fill.map((channel) => Math.round(channel * faceLight));
              const edgeRgb = angle < Math.PI / 2 ? flip?.to.fill : flip?.from.fill;
              drawProjectedCell(
                context,
                cellX + offset,
                cellY + offset,
                cellRenderSize,
                angle,
                FLIP_FOCAL_LENGTH,
                `rgba(${rgb.join(",")},${fillOpacity})`,
                `rgba(${cellPalette.stroke.join(",")},${Math.max(fillOpacity, 0.62)})`,
                `rgba(${edgeRgb?.join(",") ?? "255,255,255"},${edgeOpacity})`,
              );
            } else {
              context.fillStyle = `rgba(${cellPalette.fill.join(",")},${renderValue * 0.14 + renderAmbient})`;
              context.fillRect(cellX + offset, cellY + offset, cellRenderSize, cellRenderSize);
              if (renderValue > 0.04) {
                context.strokeStyle = `rgba(${cellPalette.stroke.join(",")},${renderValue * 0.5})`;
                context.strokeRect(cellX + offset + 0.5, cellY + offset + 0.5, cellRenderSize - 1, cellRenderSize - 1);
              }
            }
          }
        }
      }

      if (flip && timestamp >= flip.startTime + flip.maxDelay + FLIP_DURATION_MS) finishFlip();
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

    function flipToTheme(
      targetPalette: InteractiveGridPalette,
      originX: number,
      originY: number,
      onComplete: () => void,
    ) {
      if (flip || !motionEnabled || !heroVisible || !pageVisible || reduce.matches || width === 0 || height === 0) return false;

      const startTime = performance.now();
      const active = new Uint8Array(values.length);
      const valueSnapshot = values.slice();
      const ambientSnapshot = new Float64Array(values.length);
      const delays = new Float32Array(values.length);
      const maxVerticalDistance = Math.max(CELL_SIZE, height - originY);
      let maxDelay = 0;
      let activeCount = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          const ambient = Math.pow(
            Math.max(0, Math.sin(startTime * 0.0007 + columnPhases[column] + rowPhases[row])),
            18,
          ) * 0.045;
          ambientSnapshot[index] = ambient;
          if (valueSnapshot[index] <= 0.008 && ambient <= 0.002) continue;

          active[index] = 1;
          activeCount += 1;
          const horizontalOffset = (centersX[column] - originX) / Math.max(width, 1);
          const waveCurve = Math.sin(horizontalOffset * Math.PI * 2) * CELL_SIZE * 1.8;
          const verticalDistance = Math.max(0, centersY[row] - originY - waveCurve);
          const verticalDelay = clamp(verticalDistance / maxVerticalDistance, 0, 1) * WAVE_SPREAD_MS;
          const sideDelay = Math.abs(horizontalOffset) * 24;
          const delay = verticalDelay + sideDelay;
          delays[index] = delay;
          maxDelay = Math.max(maxDelay, delay);
        }
      }

      if (activeCount === 0) return false;
      flip = {
        from: paletteRef.current,
        to: targetPalette,
        startTime,
        maxDelay,
        delays,
        active,
        values: valueSnapshot,
        ambient: ambientSnapshot,
        onComplete,
      };
      renderWhenVisible();
      return true;
    }

    function update(nextEnabled: boolean, refreshPalette = false) {
      const enabledChanged = motionEnabled !== nextEnabled;
      if (!enabledChanged && !refreshPalette) return;
      if (refreshPalette) drawStaticGrid();
      if (enabledChanged) motionEnabled = nextEnabled;
      if (enabledChanged && !nextEnabled) {
        finishFlip();
        values.fill(0);
        pointer.x = -1000;
        pointer.y = -1000;
      }
      renderWhenVisible();
    }

    function resize() {
      measureHero();
      const nextWidth = hero.clientWidth;
      const nextHeight = hero.clientHeight;
      const nextPixelRatio = Math.min(devicePixelRatio || 1, 2);
      if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;

      finishFlip();
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
    const onViewportResize = () => {
      finishFlip();
      resize();
    };
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) renderWhenVisible();
      else {
        finishFlip();
        cancelFrame();
      }
    };
    const onReduceChange = () => {
      if (reduce.matches) finishFlip();
      renderWhenVisible();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          if (heroVisible) renderWhenVisible();
          else {
            finishFlip();
            cancelFrame();
          }
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

    controllerRef.current = { update, flipToTheme };

    return () => {
      finishFlip();
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

  useLayoutEffect(() => {
    controllerRef.current?.update(enabled, true);
  }, [enabled, palette]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" />;
});
