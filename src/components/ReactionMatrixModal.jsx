// Sand-DOS v3.1 Expanded Reaction Matrix & Encyclopedia Reference Modal
import React from 'react';
import { DosWindow } from './DosWindow';
import { FlaskConical } from 'lucide-react';

export const ReactionMatrixModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const reactions = [
    {
      combo: 'Portal Blue (A) + Element',
      result: 'Teleports to Portal Orange (B)',
      desc: 'Elements entering Portal A instantly exit out of Portal B.',
      badge: 'bg-[#0096FF] text-white',
    },
    {
      combo: 'Laser Emitter + Fuel / Ice / Wax',
      result: 'Ignites Fuel / Vaporizes Ice / Melts Wax',
      desc: 'Emits intense red laser beam shooting through air to melt or ignite target.',
      badge: 'bg-[#FF0064] text-white',
    },
    {
      combo: 'Mite / Bug + Plant / Wood',
      result: 'Consumes Plant & Clones Offspring',
      desc: 'Living bugs crawl along surfaces, eating plants to reproduce.',
      badge: 'bg-[#FFC800] text-black',
    },
    {
      combo: 'C4 / TNT Blast + Glass Window',
      result: 'Glass Shatters into Sand Dust',
      desc: 'Glass blocks resist acid and fire, but shatter under heavy explosive shockwaves.',
      badge: 'bg-[#C8EBF5] text-black',
    },
    {
      combo: 'Wax + Fire / Lava / Laser',
      result: 'Melts into Liquid Wax ➜ Solidifies when Cold',
      desc: 'Paraffin wax thaws under heat, flowing like liquid until cooled.',
      badge: 'bg-[#F0E6BE] text-black',
    },
    {
      combo: 'LPG Gas Fuel + Fire / Spark',
      result: 'Volatile Flame Storm Blast',
      desc: 'Floating fuel gas combusts in a rapid fiery chain reaction.',
      badge: 'bg-[#B464FF] text-white',
    },
    {
      combo: 'Water + Fire',
      result: 'Steam / Vapor + Extinguishes Fire',
      desc: 'Water cools fire instantly, generating hot rising steam.',
      badge: 'bg-[#408CF0] text-white',
    },
    {
      combo: 'Fire + Oil',
      result: 'Spreading Flame + Dense Dark Smoke',
      desc: 'Oil catches fire rapidly and creates massive smoke plumes.',
      badge: 'bg-[#8C641E] text-white',
    },
    {
      combo: 'Acid + Stone / Wood / Sand / Water',
      result: 'Corrosive Fizzing Dissolution + Acid Vapor',
      desc: 'Acid dissolves solids and liquids until neutralized.',
      badge: 'bg-[#78FF1E] text-black',
    },
    {
      combo: 'Lava + Water',
      result: 'Solidifies into Stone Wall + Steam',
      desc: 'Water cools lava down into hard permanent stone.',
      badge: 'bg-[#FF3C0A] text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono select-none backdrop-blur-xs">
      <DosWindow
        title="ELEMENT ENCYCLOPEDIA & REACTION MATRIX"
        onClose={onClose}
        className="w-full max-w-2xl max-h-[85vh]"
        headerBg="bg-[#0000AA]"
      >
        <div className="space-y-3">
          <div className="border border-black bg-[#E0E0E0] p-2 text-xs text-black">
            <span className="font-bold text-[#0000AA] flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4" /> CELLULAR AUTOMATA INTERACTION MATRIX
            </span>
            <p className="mt-0.5 text-[11px] text-[#555555]">
              Sand-DOS v3.1 features physical interactions calculated per frame. Here are the primary chemical reaction formulas:
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
            {reactions.map((r, idx) => (
              <div
                key={idx}
                className="border-2 border-[#555555] bg-[#FFFFFF] p-2 text-xs text-black shadow-xs hover:border-[#0000AA]"
              >
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className={`px-2 py-0.5 font-bold border border-black text-xs ${r.badge}`}>
                    {r.combo}
                  </span>
                  <span className="text-[#AA0000] font-extrabold text-[11px]">
                    ➜ {r.result}
                  </span>
                </div>
                <p className="text-[11px] text-[#333333] font-sans leading-tight">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DosWindow>
    </div>
  );
};
