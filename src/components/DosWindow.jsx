// Sand-DOS v3.1 Retro MS-DOS Window Component
import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { pcSpeaker } from '../audio/pcSpeaker';

export const DosWindow = ({
  title = 'MS-DOS Window',
  children,
  className = '',
  onClose,
  active = true,
  headerBg = 'bg-[#0000AA]', // Classic MS-DOS blue header
}) => {
  return (
    <div
      className={`relative flex flex-col border-2 border-[#AAAAAA] bg-[#C0C0C0] font-mono shadow-[6px_6px_0px_#000000] text-black ${className}`}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between px-2 py-1 select-none text-white font-bold ${
          active ? headerBg : 'bg-[#555555]'
        }`}
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="text-[#FFFF55]">■</span>
          <span className="tracking-wider uppercase text-sm font-mono">{title}</span>
        </div>

        {/* Window controls */}
        {onClose && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                pcSpeaker.playClick();
                onClose();
              }}
              className="flex h-5 w-5 items-center justify-center border border-[#FFFFFF] bg-[#C0C0C0] text-black hover:bg-[#FF5555] hover:text-white active:translate-y-0.5"
              title="Close (ESC)"
            >
              <X className="h-3 w-3 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

      {/* Inner Content Body */}
      <div className="p-3 overflow-auto flex-1">{children}</div>
    </div>
  );
};
