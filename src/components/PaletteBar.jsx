// Sand-DOS v3.1 Retro Palette Sidebar Component
import React, { useState } from 'react';
import {
  ELEMENTS,
  ELEMENT_IDS,
  ELEMENT_CATEGORIES,
} from '../engine/elements';
import {
  Circle,
  Square,
  Sparkles,
  Eraser,
  Trash2,
  Compass,
  Wind,
  Flame,
  Droplets,
  Layers,
  Zap,
} from 'lucide-react';
import { pcSpeaker } from '../audio/pcSpeaker';

export const PaletteBar = ({
  selectedElement,
  setSelectedElement,
  brushSize,
  setBrushSize,
  brushShape,
  setBrushShape,
  gravityDir,
  setGravityDir,
  windForce,
  setWindForce,
  onClear,
}) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', ...Object.values(ELEMENT_CATEGORIES)];

  const elementList = Object.values(ELEMENTS).filter((el) => {
    if (el.id === ELEMENT_IDS.EMPTY || el.id === ELEMENT_IDS.SPARK) return false;
    if (activeCategory === 'ALL') return true;
    return el.category === activeCategory;
  });

  return (
    <aside className="flex flex-col w-full md:w-64 border-2 border-[#AAAAAA] bg-[#C0C0C0] p-2 font-mono text-black shadow-[4px_4px_0px_#000000] select-none max-h-[85vh] overflow-y-auto">
      {/* Category Tabs */}
      <div className="mb-2 flex flex-wrap gap-1 border-b-2 border-[#555555] pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              pcSpeaker.playClick();
              setActiveCategory(cat);
            }}
            className={`px-1.5 py-0.5 text-xs border border-[#000000] font-bold ${
              activeCategory === cat
                ? 'bg-[#0000AA] text-[#FFFF55]'
                : 'bg-[#E0E0E0] text-black hover:bg-[#FFFFFF]'
            }`}
          >
            {cat === 'ALL' ? '★ ALL' : cat}
          </button>
        ))}
      </div>

      {/* Selected Element Specs Card */}
      {ELEMENTS[selectedElement] && (
        <div className="mb-2 border-2 border-[#0000AA] bg-[#0000AA] p-2 text-white shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase text-[#FFFF55] text-sm flex items-center gap-1.5">
              <span
                className="inline-block h-3.5 w-3.5 border border-white"
                style={{
                  backgroundColor: `rgba(${ELEMENTS[selectedElement].color.join(',')})`,
                }}
              />
              {ELEMENTS[selectedElement].name}
            </span>
            <span className="text-xs bg-[#00AAAA] px-1 text-black font-bold">
              Key: [{ELEMENTS[selectedElement].hotkey || '?'}]
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#AAAAAA] leading-tight">
            {ELEMENTS[selectedElement].description}
          </p>
        </div>
      )}

      {/* Element Selection Palette Grid */}
      <div className="mb-3 grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
        {elementList.map((elem) => {
          const isSelected = selectedElement === elem.id;
          const rGba = `rgba(${elem.color[0]}, ${elem.color[1]}, ${elem.color[2]}, 1)`;

          return (
            <button
              key={elem.id}
              onClick={() => {
                pcSpeaker.playClick();
                setSelectedElement(elem.id);
              }}
              className={`flex items-center space-x-1.5 border-2 p-1 text-xs text-left transition-all ${
                isSelected
                  ? 'border-[#000000] bg-[#FFFF55] font-bold shadow-[2px_2px_0px_#000000] translate-x-0.5 translate-y-0.5'
                  : 'border-[#FFFFFF] bg-[#D0D0D0] hover:bg-[#FFFFFF] border-b-[#555555] border-r-[#555555]'
              }`}
            >
              <span
                className="h-4 w-4 shrink-0 border border-black shadow-sm"
                style={{ backgroundColor: rGba }}
              />
              <span className="truncate font-bold text-[11px]">{elem.name}</span>
            </button>
          );
        })}

        {/* Eraser Tool */}
        <button
          onClick={() => {
            pcSpeaker.playClick();
            setSelectedElement(ELEMENT_IDS.EMPTY);
          }}
          className={`flex items-center space-x-1.5 border-2 p-1 text-xs text-left ${
            selectedElement === ELEMENT_IDS.EMPTY
              ? 'border-[#000000] bg-[#FF5555] text-white font-bold'
              : 'border-[#FFFFFF] bg-[#E0E0E0] hover:bg-[#FFFFFF] border-b-[#555555] border-r-[#555555]'
          }`}
        >
          <Eraser className="h-4 w-4 text-black" />
          <span className="font-bold text-[11px]">Eraser [0]</span>
        </button>
      </div>

      {/* Brush Settings */}
      <div className="mb-3 border-2 border-[#555555] bg-[#E0E0E0] p-2">
        <div className="mb-1.5 flex items-center justify-between font-bold text-xs">
          <span>BRUSH SIZE: {brushSize}px</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                pcSpeaker.playClick();
                setBrushShape('circle');
              }}
              className={`p-1 border ${
                brushShape === 'circle' ? 'bg-[#0000AA] text-white' : 'bg-white'
              }`}
              title="Circle Brush"
            >
              <Circle className="h-3 w-3" />
            </button>
            <button
              onClick={() => {
                pcSpeaker.playClick();
                setBrushShape('square');
              }}
              className={`p-1 border ${
                brushShape === 'square' ? 'bg-[#0000AA] text-white' : 'bg-white'
              }`}
              title="Square Brush"
            >
              <Square className="h-3 w-3" />
            </button>
            <button
              onClick={() => {
                pcSpeaker.playClick();
                setBrushShape('spray');
              }}
              className={`p-1 border ${
                brushShape === 'spray' ? 'bg-[#0000AA] text-white' : 'bg-white'
              }`}
              title="Spray Brush"
            >
              <Sparkles className="h-3 w-3" />
            </button>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="35"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full accent-[#0000AA]"
        />
      </div>

      {/* Gravity & Physics Vector Controls */}
      <div className="mb-3 border-2 border-[#555555] bg-[#E0E0E0] p-2">
        <div className="mb-1 flex items-center justify-between font-bold text-xs">
          <span className="flex items-center gap-1">
            <Compass className="h-3.5 w-3.5" /> GRAVITY VECTOR
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setGravityDir('down');
            }}
            className={`py-1 text-xs border font-bold ${
              gravityDir === 'down' ? 'bg-[#00AA00] text-white' : 'bg-white'
            }`}
          >
            DOWN
          </button>
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setGravityDir('up');
            }}
            className={`py-1 text-xs border font-bold ${
              gravityDir === 'up' ? 'bg-[#00AA00] text-white' : 'bg-white'
            }`}
          >
            UP
          </button>
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setGravityDir('zero');
            }}
            className={`py-1 text-xs border font-bold ${
              gravityDir === 'zero' ? 'bg-[#00AA00] text-white' : 'bg-white'
            }`}
          >
            ZERO-G
          </button>
        </div>

        {/* Wind Toggle */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-1">
            <Wind className="h-3.5 w-3.5" /> WIND:
          </span>
          <div className="flex gap-1 text-xs">
            {[-1, 0, 1].map((w) => (
              <button
                key={w}
                onClick={() => {
                  pcSpeaker.playClick();
                  setWindForce(w);
                }}
                className={`px-2 py-0.5 border font-bold ${
                  windForce === w ? 'bg-[#0000AA] text-white' : 'bg-white'
                }`}
              >
                {w < 0 ? '← LEFT' : w > 0 ? 'RIGHT →' : 'OFF'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Canvas Action */}
      <button
        onClick={() => {
          pcSpeaker.playClick();
          onClear();
        }}
        className="mt-auto flex items-center justify-center space-x-2 border-2 border-[#000000] bg-[#AA0000] p-1.5 text-white hover:bg-[#FF5555] font-bold shadow-[2px_2px_0px_#000000]"
      >
        <Trash2 className="h-4 w-4" />
        <span>CLEAR ALL (C)</span>
      </button>
    </aside>
  );
};
