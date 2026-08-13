// Sand-DOS v3.1 Retro Top Menu Bar Component
import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  Volume2,
  VolumeX,
  Tv,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { pcSpeaker } from '../audio/pcSpeaker';

export const DosHeader = ({
  onOpenPresets,
  onOpenMatrix,
  onOpenHelp,
  onClearCanvas,
  crtEnabled,
  setCrtEnabled,
  soundMuted,
  setSoundMuted,
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName) => {
    pcSpeaker.playClick();
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <header
      ref={menuRef}
      className="relative z-40 flex items-center justify-between border-b-2 border-[#AAAAAA] bg-[#0000AA] px-2 py-1 font-mono text-sm text-white select-none shadow-md"
    >
      {/* Top Menu Items */}
      <div className="flex items-center space-x-1 sm:space-x-3">
        {/* Brand Header */}
        <div className="flex items-center space-x-1.5 pr-2 border-r border-[#5555FF] font-bold text-[#FFFF55]">
          <span className="text-base animate-pulse">⏳</span>
          <span className="hidden sm:inline tracking-widest uppercase">SAND-DOS v3.1 PRO</span>
        </div>

        {/* Menu 1: File */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('file')}
            className={`px-2 py-0.5 hover:bg-[#00AAAA] hover:text-black ${
              activeMenu === 'file' ? 'bg-[#00AAAA] text-black font-bold' : ''
            }`}
          >
            <span className="underline">F</span>ile
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-0.5 w-48 border-2 border-[#AAAAAA] bg-[#C0C0C0] p-1 text-black shadow-lg">
              <button
                onClick={() => {
                  onClearCanvas();
                  setActiveMenu(null);
                }}
                className="flex w-full items-center space-x-2 px-2 py-1 hover:bg-[#0000AA] hover:text-white text-left"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear Canvas (C)</span>
              </button>
              <button
                onClick={() => {
                  onOpenPresets();
                  setActiveMenu(null);
                }}
                className="flex w-full items-center space-x-2 px-2 py-1 hover:bg-[#0000AA] hover:text-white text-left"
              >
                <Folder className="h-4 w-4" />
                <span>Load Presets (F2)</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu 2: Presets */}
        <button
          onClick={() => {
            pcSpeaker.playClick();
            onOpenPresets();
          }}
          className="px-2 py-0.5 hover:bg-[#00AAAA] hover:text-black hidden sm:block font-bold text-[#FFFF55]"
        >
          <span className="underline">P</span>resets (F2)
        </button>

        {/* Menu 3: Matrix */}
        <button
          onClick={() => {
            pcSpeaker.playClick();
            onOpenMatrix();
          }}
          className="px-2 py-0.5 hover:bg-[#00AAAA] hover:text-black hidden md:block"
        >
          <span className="underline">R</span>eaction Matrix
        </button>
      </div>

      {/* Toggles & Options */}
      <div className="flex items-center space-x-2">
        {/* Sound Toggle */}
        <button
          onClick={() => {
            setSoundMuted(!soundMuted);
            pcSpeaker.setMuted(!soundMuted);
            pcSpeaker.playClick();
          }}
          className={`flex items-center space-x-1 px-2 py-0.5 border border-[#AAAAAA] ${
            soundMuted ? 'bg-[#555555] text-[#AAAAAA]' : 'bg-[#00AA00] text-white font-bold'
          }`}
          title="Toggle PC Speaker Sound (F3)"
        >
          {soundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline text-xs">{soundMuted ? 'MUTE' : 'AUDIO'}</span>
        </button>

        {/* CRT Toggle */}
        <button
          onClick={() => {
            setCrtEnabled(!crtEnabled);
            pcSpeaker.playClick();
          }}
          className={`flex items-center space-x-1 px-2 py-0.5 border border-[#AAAAAA] ${
            crtEnabled ? 'bg-[#00AAAA] text-black font-bold' : 'bg-[#555555] text-white'
          }`}
          title="Toggle CRT Monitor Effects (F4)"
        >
          <Tv className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">CRT</span>
        </button>

        {/* Help Button */}
        <button
          onClick={() => {
            pcSpeaker.playClick();
            onOpenHelp();
          }}
          className="flex items-center space-x-1 bg-[#5555FF] px-2 py-0.5 text-white hover:bg-[#FFFF55] hover:text-black font-bold"
          title="Help & Hotkeys (F1)"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="text-xs">F1</span>
        </button>
      </div>
    </header>
  );
};
