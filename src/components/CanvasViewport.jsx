// Sand-DOS v3.1 Canvas Viewport & Simulation Controller Component
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Camera,
  Maximize2,
  Zap,
} from 'lucide-react';
import { ELEMENTS, getElementColor } from '../engine/elements';
import { pcSpeaker } from '../audio/pcSpeaker';

export const CanvasViewport = ({
  engine,
  selectedElement,
  brushSize,
  brushShape,
  gravityDir,
  windForce,
  onUpdateStats,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x, 1x, 2x, 4x
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  // Sync gravity and wind to engine
  useEffect(() => {
    if (!engine) return;
    if (gravityDir === 'down') engine.gravity = { x: 0, y: 1 };
    else if (gravityDir === 'up') engine.gravity = { x: 0, y: -1 };
    else if (gravityDir === 'zero') engine.gravity = { x: 0, y: 0 };

    engine.wind = windForce;
  }, [engine, gravityDir, windForce]);

  // Attach canvas to engine
  useEffect(() => {
    if (canvasRef.current && engine) {
      engine.attachCanvas(canvasRef.current);
    }
  }, [engine]);

  // Main Render & Physics Step Animation Loop
  useEffect(() => {
    if (!engine) return;

    let animId;
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const renderLoop = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
      }

      if (!isPaused) {
        for (let s = 0; s < speedMultiplier; s++) {
          engine.step();
        }
      }

      engine.render();

      if (onUpdateStats) {
        onUpdateStats({
          fps,
          particles: engine.particleCount,
          tick: engine.tickCount,
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [engine, isPaused, speedMultiplier, onUpdateStats]);

  // Convert mouse/touch screen coords to grid coords
  const getGridCoords = useCallback(
    (e) => {
      if (!canvasRef.current || !engine) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const scaleX = engine.width / rect.width;
      const scaleY = engine.height / rect.height;

      const x = Math.floor((clientX - rect.left) * scaleX);
      const y = Math.floor((clientY - rect.top) * scaleY);

      if (x < 0 || x >= engine.width || y < 0 || y >= engine.height) return null;
      return { x, y };
    },
    [engine]
  );

  // Interpolate line between points to avoid gaps when dragging mouse fast
  const drawLine = useCallback(
    (x0, y0, x1, y1) => {
      if (!engine) return;
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      let currX = x0;
      let currY = y0;

      while (true) {
        engine.drawBrush(currX, currY, selectedElement, brushSize, brushShape);
        if (currX === x1 && currY === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          currX += sx;
        }
        if (e2 < dx) {
          err += dx;
          currY += sy;
        }
      }
    },
    [engine, selectedElement, brushSize, brushShape]
  );

  const handlePointerDown = (e) => {
    const coords = getGridCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setLastPos(coords);
    engine.drawBrush(coords.x, coords.y, selectedElement, brushSize, brushShape);
  };

  const handlePointerMove = (e) => {
    const coords = getGridCoords(e);
    if (!coords) return;

    if (onUpdateStats) {
      onUpdateStats({ cursorX: coords.x, cursorY: coords.y });
    }

    if (isDrawing) {
      if (lastPos) {
        drawLine(lastPos.x, lastPos.y, coords.x, coords.y);
      } else {
        engine.drawBrush(coords.x, coords.y, selectedElement, brushSize, brushShape);
      }
      setLastPos(coords);
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  // Snapshot PNG Download
  const handleSnapshot = () => {
    if (!canvasRef.current) return;
    pcSpeaker.playClick();
    const link = document.createElement('a');
    link.download = `sand-dos-snapshot-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 flex-col border-2 border-[#AAAAAA] bg-[#000000] p-1 font-mono text-white shadow-[6px_6px_0px_#000000]"
    >
      {/* Simulation Control Toolbar */}
      <div className="mb-1 flex items-center justify-between border-b border-[#555555] bg-[#0000AA] px-2 py-1 select-none">
        <div className="flex items-center space-x-2">
          {/* Pause / Play */}
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setIsPaused(!isPaused);
            }}
            className={`flex items-center space-x-1 px-2 py-0.5 border font-bold text-xs ${
              isPaused ? 'bg-[#FF5555] text-white' : 'bg-[#00AA00] text-white'
            }`}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
            <span>{isPaused ? 'RESUME (SPACE)' : 'PAUSE (SPACE)'}</span>
          </button>

          {/* Step 1 Frame */}
          {isPaused && (
            <button
              onClick={() => {
                pcSpeaker.playClick();
                engine?.step();
                engine?.render();
              }}
              className="flex items-center space-x-1 border bg-[#5555FF] px-2 py-0.5 text-xs text-white font-bold hover:bg-[#FFFF55] hover:text-black"
              title="Step 1 Frame"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>STEP</span>
            </button>
          )}

          {/* Speed Multipliers */}
          <div className="hidden sm:flex items-center space-x-1 text-xs">
            <span className="text-[#AAAAAA] font-bold">SPEED:</span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  pcSpeaker.playClick();
                  setSpeedMultiplier(spd);
                }}
                className={`px-1.5 py-0.5 border ${
                  speedMultiplier === spd
                    ? 'bg-[#FFFF55] text-black font-bold'
                    : 'bg-[#555555] text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Snapshot Save */}
        <button
          onClick={handleSnapshot}
          className="flex items-center space-x-1 border border-white bg-[#00AAAA] px-2 py-0.5 text-xs text-black font-bold hover:bg-[#FFFFFF]"
          title="Save PNG Image Snapshot"
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">SNAPSHOT</span>
        </button>
      </div>

      {/* Primary Canvas Container */}
      <div className="relative flex-1 flex items-center justify-center bg-[#0C1020] overflow-hidden min-h-[350px]">
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="h-full w-full object-contain cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
};
