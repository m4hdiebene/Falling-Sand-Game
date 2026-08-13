// Sand-DOS v3.1 Main Sandbox Application
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SandEngine } from './engine/SandEngine';
import { ELEMENT_IDS, ELEMENTS } from './engine/elements';
import { pcSpeaker } from './audio/pcSpeaker';
import { DosHeader } from './components/DosHeader';
import { PaletteBar } from './components/PaletteBar';
import { CanvasViewport } from './components/CanvasViewport';
import { DosStatusBar } from './components/DosStatusBar';
import { CrtOverlay } from './components/CrtOverlay';
import { PresetsModal } from './components/PresetsModal';
import { ReactionMatrixModal } from './components/ReactionMatrixModal';
import { HelpModal } from './components/HelpModal';

export function App() {
  const engine = useMemo(() => new SandEngine(280, 180), []);

  const [selectedElement, setSelectedElement] = useState(ELEMENT_IDS.SAND);
  const [brushSize, setBrushSize] = useState(5);
  const [brushShape, setBrushShape] = useState('circle');
  const [gravityDir, setGravityDir] = useState('down');
  const [windForce, setWindForce] = useState(0);

  const [toolMode, setToolMode] = useState('freehand');
  const [replaceTarget, setReplaceTarget] = useState(null);

  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);

  const [showPresets, setShowPresets] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [stats, setStats] = useState({
    fps: 60,
    particles: 0,
    tick: 0,
    cursorX: 0,
    cursorY: 0,
    hoveredElem: 'Air',
    temp: 20,
    charge: 0,
  });

  useEffect(() => {
    engine.setAudioCallback((soundType) => {
      pcSpeaker.trigger(soundType);
    });
  }, [engine]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          engine.undo();
          return;
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          engine.redo();
          return;
        }
      }

      const key = e.key.toUpperCase();

      if (key === 'F1') {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      } else if (key === 'F2') {
        e.preventDefault();
        setShowPresets((prev) => !prev);
      } else if (key === 'F3') {
        e.preventDefault();
        setSoundMuted((prev) => {
          const next = !prev;
          pcSpeaker.setMuted(next);
          return next;
        });
      } else if (key === 'F4') {
        e.preventDefault();
        setCrtEnabled((prev) => !prev);
      } else if (key === 'F5') {
        e.preventDefault();
        setShowHeatMap((prev) => {
          const next = !prev;
          engine.showHeatMap = next;
          return next;
        });
      } else if (key === 'C') {
        engine.clear();
      } else if (key === 'ESCAPE') {
        setShowHelp(false);
        setShowPresets(false);
        setShowMatrix(false);
      }

      const num = parseInt(key);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        const found = Object.values(ELEMENTS).find((el) => el.hotkey === num.toString());
        if (found) {
          pcSpeaker.playClick();
          setSelectedElement(found.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  const handleUpdateStats = useCallback((newStats) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#000000] font-mono text-white select-none">
      <CrtOverlay enabled={crtEnabled} />

      <DosHeader
        onOpenPresets={() => setShowPresets(true)}
        onOpenMatrix={() => setShowMatrix(true)}
        onOpenHelp={() => setShowHelp(true)}
        onClearCanvas={() => engine.clear()}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      <main className="flex flex-1 flex-col md:flex-row gap-2 p-2 overflow-hidden bg-[#111122]">
        <PaletteBar
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushShape={brushShape}
          setBrushShape={setBrushShape}
          gravityDir={gravityDir}
          setGravityDir={setGravityDir}
          windForce={windForce}
          setWindForce={setWindForce}
          toolMode={toolMode}
          setToolMode={setToolMode}
          replaceTarget={replaceTarget}
          setReplaceTarget={setReplaceTarget}
          onClear={() => engine.clear()}
          onUndo={() => engine.undo()}
          onRedo={() => engine.redo()}
          onToggleHeatMap={() => {
            setShowHeatMap((prev) => {
              const next = !prev;
              engine.showHeatMap = next;
              return next;
            });
          }}
          showHeatMap={showHeatMap}
        />

        <CanvasViewport
          engine={engine}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          brushSize={brushSize}
          brushShape={brushShape}
          gravityDir={gravityDir}
          windForce={windForce}
          toolMode={toolMode}
          setToolMode={setToolMode}
          replaceTarget={replaceTarget}
          onUpdateStats={handleUpdateStats}
        />
      </main>

      <DosStatusBar stats={stats} selectedElement={selectedElement} />

      <PresetsModal
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onSelectPreset={(preset) => preset.load(engine)}
      />

      <ReactionMatrixModal
        isOpen={showMatrix}
        onClose={() => setShowMatrix(false)}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
export default App;
