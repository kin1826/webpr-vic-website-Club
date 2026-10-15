import { useEffect, useRef } from "react";

type InteractiveGridProps = { enabled: boolean };

export type GridConfig = {
  cellSize: number;
  mobileCellSize: number;
  influenceRadius: number;
  baseLineOpacity: number;
  hoverLineOpacity: number;
  hoverFillOpacity: number;
  minScale: number;
  maxDisplacement: number;
  pointerResponse: number;
  enterResponse: number;
  leaveResponse: number;
  ambientIntensity: number;
  ambientDensity: number;
};

export const GRID_CONFIG: GridConfig = {
  cellSize: 64,
  mobileCellSize: 46,
  influenceRadius: 190,
  baseLineOpacity: 0.075,
  hoverLineOpacity: 0.145,
  hoverFillOpacity: 0.046,
  minScale: 0.93,
  maxDisplacement: 2.4,
  pointerResponse: 15,
  enterResponse: 17,
  leaveResponse: 5.5,
  ambientIntensity: 0.026,
  ambientDensity: 0.034,
};

type CellState = {
  influence: number;
  ambientWeight: number;
  ambientPhase: number;
  ambientPeriod: number;
};

type RenderCell = {
  x: number;
  y: number;
  size: number;
  displacementX: number;
  displacementY: number;
  influence: number;
  ambient: number;
  strength: number;
};

const TAU = Math.PI * 2;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const dampingAlpha = (response: number, deltaSeconds: number) => 1 - Math.exp(-response * deltaSeconds);

// Stable integer hash: each cell keeps the same ambient timing on every frame.
const cellHash = (column: number, row: number, salt = 0) => {
  let value = Math.imul(column + 17 + salt * 13, 374761393) ^ Math.imul(row + 31 + salt * 7, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
};

const makeCells = (columns: number, rows: number, config: GridConfig): CellState[] =>
  Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const densitySeed = cellHash(column, row, 1);
    return {
      influence: 0,
      ambientWeight: densitySeed < config.ambientDensity ? 0.68 + cellHash(column, row, 2) * 0.32 : 0,
      ambientPhase: cellHash(column, row, 3) * 7,
      ambientPeriod: 4 + cellHash(column, row, 4) * 3,
    };
  });

export function InteractiveGrid({ enabled }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const config = GRID_CONFIG;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const canAnimate = () => enabled && !reducedMotion.matches;
    const pointerTarget = { x: -9999, y: -9999, inside: false };
    const pointerCurrent = { x: -9999, y: -9999, energy: 0 };

    let cells: CellState[] = [];
    let columns = 0;
    let rows = 0;
    let cellSize = config.cellSize;
    let cssWidth = 0;
    let cssHeight = 0;
    let frameId = 0;
    let lastTimestamp = 0;
    let elapsedSeconds = 0;
    let heroVisible = true;

    const ambientValue = (cell: CellState, timeSeconds: number) => {
      if (!canAnimate() || cell.ambientWeight === 0) return 0;
      const cycle = (timeSeconds + cell.ambientPhase) / cell.ambientPeriod;
      const wave = 0.5 - 0.5 * Math.cos(cycle * TAU);
      return Math.pow(smoothstep(0.12, 0.92, wave), 2.2) * cell.ambientWeight;
    };

    const pointerInfluence = (centerX: number, centerY: number) => {
      if (!canAnimate() || pointerCurrent.energy < 0.001) return 0;
      const distance = Math.hypot(centerX - pointerCurrent.x, centerY - pointerCurrent.y);
      const normalized = distance / config.influenceRadius;
      if (normalized >= 1) return 0;
      const gaussian = Math.exp(-2.75 * normalized * normalized);
      const cutoff = 1 - smoothstep(0.68, 1, normalized);
      return gaussian * cutoff * pointerCurrent.energy;
    };

    const draw = (timeSeconds: number, deltaSeconds: number) => {
      context.clearRect(0, 0, cssWidth, cssHeight);
      const rendered: RenderCell[] = new Array(cells.length);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          const cell = cells[index];
          const x = column * cellSize;
          const y = row * cellSize;
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;
          const target = pointerInfluence(centerX, centerY);
          const response = target > cell.influence ? config.enterResponse : config.leaveResponse;
          cell.influence += (target - cell.influence) * dampingAlpha(response, deltaSeconds);
          if (cell.influence < 0.0002) cell.influence = 0;

          const ambient = ambientValue(cell, timeSeconds);
          const hoverScale = 1 - cell.influence * (1 - config.minScale);
          const ambientScale = 1 - ambient * 0.015;
          const size = cellSize * hoverScale * ambientScale;
          const distanceX = centerX - pointerCurrent.x;
          const distanceY = centerY - pointerCurrent.y;
          const distance = Math.hypot(distanceX, distanceY) || 1;
          const displacement = cell.influence * config.maxDisplacement;
          const strength = Math.max(cell.influence, ambient * 0.34);

          rendered[index] = {
            x: x + (cellSize - size) / 2,
            y: y + (cellSize - size) / 2,
            size,
            displacementX: (distanceX / distance) * displacement,
            displacementY: (distanceY / distance) * displacement,
            influence: cell.influence,
            ambient,
            strength,
          };
        }
      }

      // Fill first. Ambient is deliberately capped below the hover maximum.
      for (const cell of rendered) {
        const hoverAlpha = cell.influence * config.hoverFillOpacity;
        const ambientAlpha = cell.ambient * config.ambientIntensity * (1 - cell.influence);
        const fillAlpha = Math.min(config.hoverFillOpacity, hoverAlpha + ambientAlpha);
        if (fillAlpha < 0.0005) continue;
        context.fillStyle = `rgba(36,87,245,${fillAlpha})`;
        context.fillRect(cell.x + cell.displacementX, cell.y + cell.displacementY, cell.size, cell.size);
      }

      // Shared edges fade near transformed cells, preventing a full-size square
      // from appearing underneath the cell's deformed outline.
      context.lineWidth = 1;
      for (let boundary = 0; boundary <= columns; boundary += 1) {
        const x = boundary * cellSize + 0.5;
        for (let row = 0; row < rows; row += 1) {
          const left = boundary > 0 ? rendered[row * columns + boundary - 1]?.strength ?? 0 : 0;
          const right = boundary < columns ? rendered[row * columns + boundary]?.strength ?? 0 : 0;
          const opacity = config.baseLineOpacity * (1 - smoothstep(0.015, 0.42, Math.max(left, right)));
          if (opacity < 0.002) continue;
          context.strokeStyle = `rgba(22,22,22,${opacity})`;
          context.beginPath();
          context.moveTo(x, row * cellSize);
          context.lineTo(x, (row + 1) * cellSize);
          context.stroke();
        }
      }
      for (let boundary = 0; boundary <= rows; boundary += 1) {
        const y = boundary * cellSize + 0.5;
        for (let column = 0; column < columns; column += 1) {
          const above = boundary > 0 ? rendered[(boundary - 1) * columns + column]?.strength ?? 0 : 0;
          const below = boundary < rows ? rendered[boundary * columns + column]?.strength ?? 0 : 0;
          const opacity = config.baseLineOpacity * (1 - smoothstep(0.015, 0.42, Math.max(above, below)));
          if (opacity < 0.002) continue;
          context.strokeStyle = `rgba(22,22,22,${opacity})`;
          context.beginPath();
          context.moveTo(column * cellSize, y);
          context.lineTo((column + 1) * cellSize, y);
          context.stroke();
        }
      }

      // An affected cell owns its complete outline; no base outline remains below it.
      for (const cell of rendered) {
        if (cell.strength < 0.006) continue;
        const opacity = Math.min(config.hoverLineOpacity, config.baseLineOpacity + cell.influence * (config.hoverLineOpacity - config.baseLineOpacity) + cell.ambient * 0.018);
        context.strokeStyle = `rgba(22,22,22,${opacity})`;
        context.strokeRect(cell.x + cell.displacementX + 0.5, cell.y + cell.displacementY + 0.5, Math.max(0, cell.size - 1), Math.max(0, cell.size - 1));
      }
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      cssWidth = rect.width;
      cssHeight = rect.height;
      cellSize = cssWidth < 680 ? config.mobileCellSize : config.cellSize;
      columns = Math.ceil(cssWidth / cellSize) + 1;
      rows = Math.ceil(cssHeight / cellSize) + 1;
      cells = makeCells(columns, rows, config);
      canvas.width = Math.ceil(cssWidth * ratio);
      canvas.height = Math.ceil(cssHeight * ratio);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      lastTimestamp = 0;
      draw(elapsedSeconds, 0);
    };

    const animate = (timestamp: number) => {
      frameId = 0;
      if (!canAnimate() || !heroVisible || document.hidden) return;
      const deltaSeconds = lastTimestamp === 0 ? 1 / 60 : Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;
      elapsedSeconds += deltaSeconds;
      const pointerAlpha = dampingAlpha(config.pointerResponse, deltaSeconds);
      if (pointerTarget.inside) {
        if (pointerCurrent.x < -1000) {
          pointerCurrent.x = pointerTarget.x;
          pointerCurrent.y = pointerTarget.y;
        }
        pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * pointerAlpha;
        pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * pointerAlpha;
      }
      const energyTarget = pointerTarget.inside ? 1 : 0;
      const energyResponse = energyTarget > pointerCurrent.energy ? config.enterResponse : config.leaveResponse;
      pointerCurrent.energy += (energyTarget - pointerCurrent.energy) * dampingAlpha(energyResponse, deltaSeconds);
      if (pointerCurrent.energy < 0.0002) pointerCurrent.energy = 0;
      draw(elapsedSeconds, deltaSeconds);
      frameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!canAnimate() || !heroVisible || document.hidden || frameId) return;
      lastTimestamp = 0;
      frameId = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastTimestamp = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!canAnimate() || !finePointer.matches || event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      pointerTarget.x = event.clientX - rect.left;
      pointerTarget.y = event.clientY - rect.top;
      pointerTarget.inside = true;
      start();
    };
    const onPointerLeave = () => { pointerTarget.inside = false; };
    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };
    const onReducedMotionChange = () => {
      pointerTarget.inside = false;
      pointerCurrent.energy = 0;
      cells.forEach((cell) => { cell.influence = 0; });
      if (reducedMotion.matches) {
        stop();
        draw(elapsedSeconds, 0);
      } else start();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) start(); else stop();
    });

    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onReducedMotionChange);
    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="hero-mask pointer-events-none absolute inset-0 size-full" aria-hidden="true" />;
}
