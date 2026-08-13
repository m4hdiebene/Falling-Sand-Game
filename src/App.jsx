// Sand-DOS v3.1 Main Application Frame
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
import { SharewareModal } from './components/SharewareModal';
import { HelpModal } from './components/HelpModal';

export function App() {
  // Create Cellular Automata Engine Instance (240x160 canvas resolution)
  const engine = useMemo(() => new SandEngine(240, 160), []);

  // UI state
  const [selectedElement, setSelectedElement] = useState(ELEMENT_IDS.SAND);
  const [brushSize, setBrushSize] = useState(5);
  const [brushShape, setBrushShape] = useState('circle');
  const [gravityDir, setGravityDir] = useState('down');
  const [windForce, setWindForce] = useState(0);

  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Modals state
  const [showPresets, setShowPresets] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showShareware, setShowShareware] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Simulation stats state
  const [stats, setStats] = useState({
    fps: 60,
    particles: 0,
    tick: 0,
    cursorX: 0,
    cursorY: 0,
  });

  // Attach audio callback to CA engine
  useEffect(() => {
    engine.setAudioCallback((soundType) => {
      pcSpeaker.trigger(soundType);
    });
  }, [engine]);

  // Global Keyboard Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger hotkeys when typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
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
      } else if (key === 'F9') {
        e.preventDefault();
        setShowShareware((prev) => !prev);
      } else if (key === 'C') {
        engine.clear();
      } else if (key === 'ESCAPE') {
        setShowHelp(false);
        setShowPresets(false);
        setShowMatrix(false);
        setShowShareware(false);
      }

      // Element quick select keys (0-9)
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
      {/* Retro CRT Monitor Overlay Effect */}
      <CrtOverlay enabled={crtEnabled} />

      {/* Top MS-DOS Menu Bar */}
      <DosHeader
        onOpenPresets={() => setShowPresets(true)}
        onOpenMatrix={() => setShowMatrix(true)}
        onOpenShareware={() => setShowShareware(true)}
        onOpenHelp={() => setShowHelp(true)}
        onClearCanvas={() => engine.clear()}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Main Workspace (Palette Sidebar + Canvas Viewport) */}
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
          onClear={() => engine.clear()}
        />

        <CanvasViewport
          engine={engine}
          selectedElement={selectedElement}
          brushSize={brushSize}
          brushShape={brushShape}
          gravityDir={gravityDir}
          windForce={windForce}
          onUpdateStats={handleUpdateStats}
        />
      </main>

      {/* Bottom DOS Status Bar */}
      <DosStatusBar stats={stats} selectedElement={selectedElement} />

      {/* Modals */}
      <PresetsModal
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onSelectPreset={(preset) => preset.load(engine)}
      />

      <ReactionMatrixModal
        isOpen={showMatrix}
        onClose={() => setShowMatrix(false)}
      />

      <SharewareModal
        isOpen={showShareware}
        onClose={() => setShowShareware(false)}
        isRegistered={isRegistered}
        setIsRegistered={setIsRegistered}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
export default App;
