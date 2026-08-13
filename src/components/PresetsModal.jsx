// Sand-DOS v3.1 Preset World Gallery Modal Component
import React from 'react';
import { DosWindow } from './DosWindow';
import { PRESETS } from '../engine/presets';
import { Folder, Play, Flame, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { pcSpeaker } from '../audio/pcSpeaker';

export const PresetsModal = ({ isOpen, onClose, onSelectPreset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono select-none backdrop-blur-xs">
      <DosWindow
        title="SELECT PRESET WORLD SCENARIO (F2)"
        onClose={onClose}
        className="w-full max-w-xl"
        headerBg="bg-[#0000AA]"
      >
        <div className="space-y-3">
          <div className="border border-black bg-[#FFFF55] p-2 text-xs text-black font-bold">
            Choose a preset scenario to load directly into the Sand-DOS canvas engine:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="flex flex-col justify-between border-2 border-[#555555] bg-[#FFFFFF] p-2 text-xs text-black shadow-xs hover:border-[#0000AA] hover:bg-[#F8F8FF]"
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-[#0000AA] mb-1">
                    <span className="truncate flex items-center gap-1">
                      <Folder className="h-4 w-4 shrink-0 text-[#AA0000]" />
                      {preset.name}
                    </span>
                    <span className="text-[10px] bg-[#E0E0E0] px-1 text-[#555555] font-normal">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#444444] leading-tight mb-2">
                    {preset.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    pcSpeaker.playClick();
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="flex items-center justify-center space-x-1 border-2 border-black bg-[#00AA00] py-1 text-white font-bold hover:bg-[#FFFF55] hover:text-black shadow-[2px_2px_0px_#000000]"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>LOAD SCENARIO</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </DosWindow>
    </div>
  );
};
