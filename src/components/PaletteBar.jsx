// Sand-DOS v3.1 Comprehensive Palette & Tool Sidebar
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
  Pipette,
  Replace,
  Undo,
  Redo,
  Flame,
  Zap,
  Layers,
  Thermometer,
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
  toolMode,
  setToolMode,
  replaceTarget,
  setReplaceTarget,
  onClear,
  onUndo,
  onRedo,
  onToggleHeatMap,
  showHeatMap,
}) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', ...Object.values(ELEMENT_CATEGORIES)];

  const elementList = Object.values(ELEMENTS).filter((el) => {
    if (el.id === ELEMENT_IDS.EMPTY || el.id === ELEMENT_IDS.SPARK || el.id === ELEMENT_IDS.SPARK_ELEC) return false;
    if (activeCategory === 'ALL') return true;
    return el.category === activeCategory;
  });

  return (
    <aside className="flex flex-col w-full md:w-72 border-2 border-[#AAAAAA] bg-[#C0C0C0] p-2 font-mono text-black shadow-[4px_4px_0px_#000000] select-none max-h-[88vh] overflow-y-auto">
      {/* Category Selection Tabs */}
      <div className="mb-2 flex flex-wrap gap-1 border-b-2 border-[#555555] pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              pcSpeaker.playClick();
              setActiveCategory(cat);
            }}
            className={`px-1.5 py-0.5 text-[11px] border border-[#000000] font-bold ${
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
            <span className="font-bold uppercase text-[#FFFF55] text-xs flex items-center gap-1.5 truncate">
              <span
                className="inline-block h-3.5 w-3.5 border border-white shrink-0"
                style={{
                  backgroundColor: `rgba(${ELEMENTS[selectedElement].color.join(',')})`,
                }}
              />
              {ELEMENTS[selectedElement].name}
            </span>
            <span className="text-[10px] bg-[#00AAAA] px-1 text-black font-bold shrink-0">
              Key: [{ELEMENTS[selectedElement].hotkey || '?'}]
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[#AAAAAA] leading-tight">
            {ELEMENTS[selectedElement].description}
          </p>
        </div>
      )}

      {/* Primary Tool Modes Toolbar */}
      <div className="mb-2 border-2 border-[#555555] bg-[#E0E0E0] p-1.5">
        <div className="text-[11px] font-bold mb-1 uppercase">DRAWING TOOLS & MODES</div>
        <div className="grid grid-cols-3 gap-1 text-center text-xs">
          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('freehand');
              setReplaceTarget(null);
            }}
            className={`py-1 border text-[11px] font-bold ${
              toolMode === 'freehand' && replaceTarget === null ? 'bg-[#0000AA] text-white' : 'bg-white'
            }`}
          >
            PEN
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('eyedropper');
            }}
            className={`py-1 border text-[11px] font-bold flex items-center justify-center gap-1 ${
              toolMode === 'eyedropper' ? 'bg-[#00AAAA] text-black' : 'bg-white'
            }`}
            title="Inspect / Pick Element (E)"
          >
            <Pipette className="h-3 w-3" /> PICK
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              setToolMode('replace');
              setReplaceTarget(selectedElement);
            }}
            className={`py-1 border text-[11px] font-bold flex items-center justify-center gap-1 ${
              toolMode === 'replace' ? 'bg-[#AA0000] text-white' : 'bg-white'
            }`}
            title="Replace Element Mode"
          >
            <Replace className="h-3 w-3" /> REPLACE
          </button>
        </div>

        {/* Undo / Redo / Thermal View Row */}
        <div className="mt-1.5 flex gap-1">
          <button
            onClick={() => {
              pcSpeaker.playClick();
              onUndo();
            }}
            className="flex-1 py-1 border bg-white text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#FFFF55]"
            title="Undo Edit (Ctrl+Z)"
          >
            <Undo className="h-3 w-3" /> UNDO
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              onRedo();
            }}
            className="flex-1 py-1 border bg-white text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#FFFF55]"
            title="Redo Edit (Ctrl+Y)"
          >
            <Redo className="h-3 w-3" /> REDO
          </button>

          <button
            onClick={() => {
              pcSpeaker.playClick();
              onToggleHeatMap();
            }}
            className={`px-2 py-1 border text-[11px] font-bold flex items-center justify-center gap-1 ${
              showHeatMap ? 'bg-[#FF5555] text-white' : 'bg-white text-black'
            }`}
            title="Toggle Thermal Heat Map View (F5)"
          >
            <Thermometer className="h-3 w-3" /> HEAT
          </button>
        </div>
      </div>

      {/* Element Selection Grid */}
      <div className="mb-2 grid grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-1">
        {elementList.map((elem) => {
          const isSelected = selectedElement === elem.id;
          const rGba = `rgba(${elem.color[0]}, ${elem.color[1]}, ${elem.color[2]}, 1)`;

          return (
            <button
              key={elem.id}
              onClick={() => {
                pcSpeaker.playClick();
                setSelectedElement(elem.id);
                if (toolMode === 'replace') setReplaceTarget(elem.id);
              }}
              className={`flex items-center space-x-1.5 border p-1 text-left ${
                isSelected
                  ? 'border-[#000000] bg-[#FFFF55] font-bold shadow-[2px_2px_0px_#000000]'
                  : 'border-[#FFFFFF] bg-[#D0D0D0] hover:bg-[#FFFFFF] border-b-[#555555] border-r-[#555555]'
              }`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 border border-black shadow-xs"
                style={{ backgroundColor: rGba }}
              />
              <span className="truncate font-bold text-[10px]">{elem.name}</span>
            </button>
          );
        })}

        {/* Eraser Tool */}
        <button
          onClick={() => {
            pcSpeaker.playClick();
            setSelectedElement(ELEMENT_IDS.EMPTY);
          }}
          className={`flex items-center space-x-1 border p-1 text-left ${
            selectedElement === ELEMENT_IDS.EMPTY
              ? 'border-[#000000] bg-[#FF5555] text-white font-bold'
              : 'border-[#FFFFFF] bg-[#E0E0E0] hover:bg-[#FFFFFF] border-b-[#555555] border-r-[#555555]'
          }`}
        >
          <Eraser className="h-3.5 w-3.5 text-black" />
          <span className="font-bold text-[10px]">Eraser [0]</span>
        </button>
      </div>

      {/* Brush Settings */}
      <div className="mb-2 border-2 border-[#555555] bg-[#E0E0E0] p-1.5">
        <div className="mb-1 flex items-center justify-between font-bold text-xs">
          <span>BRUSH: {brushSize}px</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setBrushShape('circle')}
              className={`p-1 border ${brushShape === 'circle' ? 'bg-[#0000AA] text-white' : 'bg-white'}`}
            >
              <Circle className="h-3 w-3" />
            </button>
            <button
              onClick={() => setBrushShape('square')}
              className={`p-1 border ${brushShape === 'square' ? 'bg-[#0000AA] text-white' : 'bg-white'}`}
            >
              <Square className="h-3 w-3" />
            </button>
            <button
              onClick={() => setBrushShape('spray')}
              className={`p-1 border ${brushShape === 'spray' ? 'bg-[#0000AA] text-white' : 'bg-white'}`}
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

      {/* Physics Vector Controls */}
      <div className="mb-2 border-2 border-[#555555] bg-[#E0E0E0] p-1.5">
        <div className="mb-1 text-xs font-bold flex items-center gap-1">
          <Compass className="h-3.5 w-3.5" /> GRAVITY VECTOR
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <button
            onClick={() => setGravityDir('down')}
            className={`py-0.5 text-xs border font-bold ${gravityDir === 'down' ? 'bg-[#00AA00] text-white' : 'bg-white'}`}
          >
            DOWN
          </button>
          <button
            onClick={() => setGravityDir('up')}
            className={`py-0.5 text-xs border font-bold ${gravityDir === 'up' ? 'bg-[#00AA00] text-white' : 'bg-white'}`}
          >
            UP
          </button>
          <button
            onClick={() => setGravityDir('zero')}
            className={`py-0.5 text-xs border font-bold ${gravityDir === 'zero' ? 'bg-[#00AA00] text-white' : 'bg-white'}`}
          >
            ZERO-G
          </button>
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
