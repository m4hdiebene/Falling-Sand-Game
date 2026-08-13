// Sand-DOS v3.1 Enhanced Viewport with Smooth Interpolation, Screen Shake & Cursor Overlay
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Camera,
  Maximize2,
  Brush,
  Minus,
  Square,
  Sparkles,
} from 'lucide-react';
import { ELEMENTS, ELEMENT_IDS, getElementColor } from '../engine/elements';
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
  const cursorCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);
  const [toolMode, setToolMode] = useState('freehand'); // 'freehand', 'line', 'box'
  const [startPoint, setStartPoint] = useState(null);

  // Sync physics
  useEffect(() => {
    if (!engine) return;
    if (gravityDir === 'down') engine.gravity = { x: 0, y: 1 };
    else if (gravityDir === 'up') engine.gravity = { x: 0, y: -1 };
    else if (gravityDir === 'zero') engine.gravity = { x: 0, y: 0 };
    engine.wind = windForce;
  }, [engine, gravityDir, windForce]);

  useEffect(() => {
    if (canvasRef.current && engine) {
      engine.attachCanvas(canvasRef.current);
    }
  }, [engine]);

  // Main Render Loop with Screen Shake
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

      // Screen shake decay animation
      if (engine.shakeAmount > 0) {
        if (canvasRef.current) {
          const offsetX = (Math.random() - 0.5) * engine.shakeAmount * 1.5;
          const offsetY = (Math.random() - 0.5) * engine.shakeAmount * 1.5;
          canvasRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
        engine.shakeAmount = Math.max(0, engine.shakeAmount - 0.8);
      } else if (canvasRef.current && canvasRef.current.style.transform !== 'none') {
        canvasRef.current.style.transform = 'none';
      }

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

  // High-Precision Screen to Grid Coordinate Conversion
  const getGridCoords = useCallback(
    (e) => {
      if (!canvasRef.current || !engine) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const scaleX = engine.width / rect.width;
      const scaleY = engine.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      if (x < 0 || x >= engine.width || y < 0 || y >= engine.height) return null;
      return { x: Math.floor(x), y: Math.floor(y) };
    },
    [engine]
  );

  // Ultra-Smooth Fractional Line Stepping Algorithm
  const drawDenseLine = useCallback(
    (x0, y0, x1, y1) => {
      if (!engine) return;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const distance = Math.hypot(dx, dy);

      if (distance === 0) {
        engine.drawBrush(x0, y0, selectedElement, brushSize, brushShape);
        return;
      }

      // Step along line every 0.5 grid cells for unbroken smooth lines!
      const stepCount = Math.ceil(distance * 2);
      for (let i = 0; i <= stepCount; i++) {
        const t = i / stepCount;
        const currX = Math.floor(x0 + dx * t);
        const currY = Math.floor(y0 + dy * t);
        engine.drawBrush(currX, currY, selectedElement, brushSize, brushShape);
      }
    },
    [engine, selectedElement, brushSize, brushShape]
  );

  // Render Visual Brush Cursor Preview on Cursor Overlay Canvas
  const drawCursorOverlay = useCallback(() => {
    const ctx = cursorCanvasRef.current?.getContext('2d');
    if (!ctx || !cursorCanvasRef.current || !canvasRef.current || !engine) return;

    ctx.clearRect(0, 0, cursorCanvasRef.current.width, cursorCanvasRef.current.height);

    if (!cursorPos) return;

    const rect = canvasRef.current.getBoundingClientRect();
    cursorCanvasRef.current.width = rect.width;
    cursorCanvasRef.current.height = rect.height;

    const scaleX = rect.width / engine.width;
    const scaleY = rect.height / engine.height;

    const px = cursorPos.x * scaleX + scaleX / 2;
    const py = cursorPos.y * scaleY + scaleY / 2;
    const r = (brushSize / 2) * scaleX;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    if (brushShape === 'circle') {
      ctx.beginPath();
      ctx.arc(px, py, Math.max(r, 4), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const boxSize = Math.max(r * 2, 8);
      ctx.strokeRect(px - boxSize / 2, py - boxSize / 2, boxSize, boxSize);
    }
  }, [cursorPos, brushSize, brushShape, engine]);

  useEffect(() => {
    drawCursorOverlay();
  }, [cursorPos, brushSize, brushShape, drawCursorOverlay]);

  const handlePointerDown = (e) => {
    const coords = getGridCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setLastPos(coords);
    setStartPoint(coords);

    if (toolMode === 'freehand') {
      engine.drawBrush(coords.x, coords.y, selectedElement, brushSize, brushShape);
    }
  };

  const handlePointerMove = (e) => {
    const coords = getGridCoords(e);
    if (!coords) {
      setCursorPos(null);
      return;
    }

    setCursorPos(coords);

    if (onUpdateStats) {
      onUpdateStats({ cursorX: coords.x, cursorY: coords.y });
    }

    if (isDrawing && toolMode === 'freehand') {
      if (lastPos) {
        drawDenseLine(lastPos.x, lastPos.y, coords.x, coords.y);
      } else {
        engine.drawBrush(coords.x, coords.y, selectedElement, brushSize, brushShape);
      }
      setLastPos(coords);
    }
  };

  const handlePointerUp = (e) => {
    if (isDrawing && coordsUp(e)) {
      const endCoords = coordsUp(e);
      if (toolMode === 'line' && startPoint && endCoords) {
        drawDenseLine(startPoint.x, startPoint.y, endCoords.x, endCoords.y);
      } else if (toolMode === 'box' && startPoint && endCoords) {
        const minX = Math.min(startPoint.x, endCoords.x);
        const maxX = Math.max(startPoint.x, endCoords.x);
        const minY = Math.min(startPoint.y, endCoords.y);
        const maxY = Math.max(startPoint.y, endCoords.y);

        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            engine.drawBrush(x, y, selectedElement, 1, 'square');
          }
        }
      }
    }

    setIsDrawing(false);
    setLastPos(null);
    setStartPoint(null);
  };

  const coordsUp = (e) => getGridCoords(e);

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
      {/* Simulation Toolbar */}
      <div className="mb-1 flex flex-wrap items-center justify-between border-b border-[#555555] bg-[#0000AA] px-2 py-1 select-none gap-2">
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

          {isPaused && (
            <button
              onClick={() => {
                pcSpeaker.playClick();
                engine?.step();
                engine?.render();
              }}
              className="flex items-center space-x-1 border bg-[#5555FF] px-2 py-0.5 text-xs text-white font-bold hover:bg-[#FFFF55] hover:text-black"
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

        {/* Tool Mode Buttons */}
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('freehand');
            }}
            className={`px-2 py-0.5 border flex items-center gap-1 font-bold ${
              toolMode === 'freehand' ? 'bg-[#00AAAA] text-black' : 'bg-[#555555] text-white'
            }`}
            title="Freehand Pen Tool"
          >
            <Brush className="h-3 w-3" /> Pen
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('line');
            }}
            className={`px-2 py-0.5 border flex items-center gap-1 font-bold ${
              toolMode === 'line' ? 'bg-[#00AAAA] text-black' : 'bg-[#555555] text-white'
            }`}
            title="Straight Line Tool"
          >
            <Minus className="h-3 w-3" /> Line
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('box');
            }}
            className={`px-2 py-0.5 border flex items-center gap-1 font-bold ${
              toolMode === 'box' ? 'bg-[#00AAAA] text-black' : 'bg-[#555555] text-white'
            }`}
            title="Box Fill Tool"
          >
            <Square className="h-3 w-3" /> Box
          </button>

          <button
            onClick={handleSnapshot}
            className="flex items-center space-x-1 border border-white bg-[#00AAAA] px-2 py-0.5 text-xs text-black font-bold hover:bg-[#FFFFFF]"
            title="Save PNG Image Snapshot"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SNAPSHOT</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative flex-1 flex items-center justify-center bg-[#0C1020] overflow-hidden min-h-[360px]">
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={() => {
            handlePointerUp();
            setCursorPos(null);
          }}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="h-full w-full object-contain cursor-crosshair transition-transform duration-75"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Visual Brush Cursor Overlay */}
        <canvas
          ref={cursorCanvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
};
