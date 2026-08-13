// Sand-DOS v3.1 Retro DOS Status Bar Component
import React from 'react';
import { ELEMENTS } from '../engine/elements';

export const DosStatusBar = ({ stats, selectedElement }) => {
  const elem = ELEMENTS[selectedElement];

  return (
    <footer className="z-40 flex flex-wrap items-center justify-between border-t-2 border-[#AAAAAA] bg-[#00AAAA] px-2 py-0.5 font-mono text-xs text-black select-none font-bold shadow-md">
      {/* DOS Conventional Memory Readout & Status */}
      <div className="flex items-center space-x-3">
        <span className="bg-[#0000AA] px-1.5 py-0.2 text-white">640K CONVENTIONAL OK</span>
        <span className="hidden sm:inline">
          FPS: <span className="text-[#0000AA] font-extrabold">{stats.fps || 60}</span>
        </span>
        <span>
          PARTICLES: <span className="text-[#0000AA] font-extrabold">{stats.particles || 0}</span>
        </span>
      </div>

      {/* Selected Element Specs & Mouse Coords */}
      <div className="flex items-center space-x-3">
        {elem && (
          <span className="hidden md:inline">
            ACTIVE: <span className="underline">{elem.name}</span> ({elem.type})
          </span>
        )}
        <span>
          GRID: [{stats.cursorX ?? 0}, {stats.cursorY ?? 0}]
        </span>
      </div>
    </footer>
  );
};
