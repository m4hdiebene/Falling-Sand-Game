// Sand-DOS v3.1 Expanded Help & Manual Modal
import React from 'react';
import { DosWindow } from './DosWindow';
import { HelpCircle, Keyboard } from 'lucide-react';

export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const hotkeys = [
    { key: '0', action: 'Eraser (Clear cell)' },
    { key: '1', action: 'Select Sand' },
    { key: '2', action: 'Select Water' },
    { key: '3', action: 'Select Oil' },
    { key: '4', action: 'Select Fire' },
    { key: '5', action: 'Select Plant/Wood' },
    { key: '6', action: 'Select Stone Wall' },
    { key: '7', action: 'Select Acid' },
    { key: '8', action: 'Select Lava' },
    { key: '9', action: 'Select Gunpowder' },
    { key: 'G', action: 'Select Glass Window' },
    { key: 'Z', action: 'Select Laser Emitter' },
    { key: 'B', action: 'Select Bug / Mite' },
    { key: 'T', action: 'Select TNT Dynamite' },
    { key: 'E', action: 'Select Copper Wire' },
    { key: 'R', action: 'Select Battery Power' },
    { key: 'H', action: 'Select Heater' },
    { key: 'C', action: 'Clear All Particles' },
    { key: 'SPACE', action: 'Pause / Resume Simulation' },
    { key: 'F1', action: 'Help & Controls Manual' },
    { key: 'F2', action: 'Load Preset Scenarios' },
    { key: 'F3', action: 'Toggle PC Speaker Audio' },
    { key: 'F4', action: 'Toggle CRT Scanline Overlay' },
    { key: 'F5', action: 'Toggle Thermal Heat Map View' },
    { key: 'F6', action: 'Quick Save (Local Storage)' },
    { key: 'F7', action: 'Quick Load (Local Storage)' },
    { key: 'Ctrl+Z', action: 'Undo Edit Action' },
    { key: 'Ctrl+Y', action: 'Redo Edit Action' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono select-none backdrop-blur-xs">
      <DosWindow
        title="SAND-DOS v3.1 PRO USER MANUAL & HOTKEYS (F1)"
        onClose={onClose}
        className="w-full max-w-xl max-h-[85vh]"
        headerBg="bg-[#0000AA]"
      >
        <div className="space-y-3">
          <div className="border border-black bg-[#E0E0E0] p-2 text-xs text-black space-y-1">
            <span className="font-bold text-[#0000AA] flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> DOS CELLULAR AUTOMATA ENGINE CONTROLS
            </span>
            <p className="text-[11px] text-[#444444]">
              Click or touch and drag on the canvas to paint elements. Everything is 100% unlocked! Switch tools between Pen, Straight Line, Box Fill, Replace, and Eyedropper Inspector.
            </p>
          </div>

          <div className="border-2 border-[#555555] bg-[#FFFFFF] p-2 text-xs text-black">
            <h4 className="font-bold text-[#0000AA] mb-1.5 border-b border-[#AAAAAA] pb-0.5 flex items-center gap-1">
              <Keyboard className="h-4 w-4" /> KEYBOARD SHORTCUTS REFERENCE
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 max-h-60 overflow-y-auto">
              {hotkeys.map((h) => (
                <div key={h.key} className="flex items-center justify-between text-[11px]">
                  <span className="bg-[#0000AA] px-1 text-white font-bold font-mono">[{h.key}]</span>
                  <span className="text-[#333333] font-sans">{h.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DosWindow>
    </div>
  );
};
