// Sand-DOS v3.1 Comprehensive Status Bar with Thermal & Electrical Readout
import React from 'react';
import { ELEMENTS } from '../engine/elements';

export const DosStatusBar = ({ stats, selectedElement }) => {
  const elem = ELEMENTS[selectedElement];

  return (
    <footer className="z-40 flex flex-wrap items-center justify-between border-t-2 border-[#AAAAAA] bg-[#00AAAA] px-2 py-0.5 font-mono text-xs text-black select-none font-bold shadow-md">
      {/* DOS Conventional Memory Readout & FPS */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="bg-[#0000AA] px-1.5 py-0.2 text-white">640K CONVENTIONAL OK</span>
        <span className="hidden sm:inline">
          FPS: <span className="text-[#0000AA] font-extrabold">{stats.fps || 60}</span>
        </span>
        <span>
          PARTICLES: <span className="text-[#0000AA] font-extrabold">{stats.particles || 0}</span>
        </span>
      </div>

      {/* Hovered Cell Thermal & Electrical Inspector */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {stats.hoveredElem && (
          <span className="bg-black px-1.5 py-0.2 text-[#00FF00] font-mono text-[11px]">
            INSPECT: <span className="text-[#FFFF55]">{stats.hoveredElem}</span> | TEMP:{' '}
            <span className={stats.temp > 100 ? 'text-[#FF5555]' : 'text-[#55FFFF]'}>
              {stats.temp ?? 20}°C
            </span>
            {stats.charge > 0 && <span className="text-[#FFFF55]"> | ⚡ELEC</span>}
          </span>
        )}
        <span>
          GRID: [{stats.cursorX ?? 0}, {stats.cursorY ?? 0}]
        </span>
      </div>
    </footer>
  );
};
