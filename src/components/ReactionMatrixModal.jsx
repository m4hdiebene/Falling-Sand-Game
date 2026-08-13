// Sand-DOS v3.1 Reaction Matrix & Encyclopedia Reference Modal
import React from 'react';
import { DosWindow } from './DosWindow';
import { ELEMENTS, ELEMENT_IDS } from '../engine/elements';
import { FlaskConical, Zap, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { pcSpeaker } from '../audio/pcSpeaker';

export const ReactionMatrixModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const reactions = [
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
      combo: 'Fire / Spark + Gunpowder',
      result: 'Explosive Flash Blast + Shrapnel Sparks',
      desc: 'Gunpowder combusts in a fast chain reaction explosion.',
      badge: 'bg-[#4B5055] text-white',
    },
    {
      combo: 'Fire / Spark + C4 Explosive',
      result: 'Massive Shockwave Detonation',
      desc: 'Triggers a wide-area blast wave destroying surrounding walls.',
      badge: 'bg-[#D2C396] text-black',
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
    {
      combo: 'Plant / Wood + Water',
      result: 'Hydrated Plant Growth & Vines',
      desc: 'Plants absorb adjacent water to sprout and grow new branches.',
      badge: 'bg-[#2DAA3C] text-white',
    },
    {
      combo: 'Ice + Fire / Lava',
      result: 'Melts Ice into Water',
      desc: 'Heat thaws solid ice back into liquid water.',
      badge: 'bg-[#AFE1FF] text-black',
    },
    {
      combo: 'Cloner + Falling Element',
      result: 'Infinite Duplicate Stream',
      desc: 'Cloner absorbs element on top and generates infinite duplicates below.',
      badge: 'bg-[#D228DC] text-white',
    },
    {
      combo: 'Black Hole (Void) + Anything',
      result: 'Total Matter Destruction',
      desc: 'Consumes any matter that enters its singularity boundary.',
      badge: 'bg-[#280A3C] text-white',
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
          {/* Info Banner */}
          <div className="border border-black bg-[#E0E0E0] p-2 text-xs text-black">
            <span className="font-bold text-[#0000AA] flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4" /> CELLULAR AUTOMATA INTERACTION MATRIX
            </span>
            <p className="mt-0.5 text-[11px] text-[#555555]">
              Sand-DOS v3.1 features physics-based interactions calculated per frame. Here are the primary chemical reaction formulas:
            </p>
          </div>

          {/* Reaction List */}
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
