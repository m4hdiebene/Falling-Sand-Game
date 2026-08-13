// Sand-DOS v3.1 1990s Shareware Registration Nag Screen & Order Form Modal
import React, { useState } from 'react';
import { DosWindow } from './DosWindow';
import { Award, CheckCircle2, Send, HelpCircle, Key, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { pcSpeaker } from '../audio/pcSpeaker';

export const SharewareModal = ({ isOpen, onClose, isRegistered, setIsRegistered }) => {
  const [userName, setUserName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    pcSpeaker.trigger('jingle');
    setIsRegistered(true);
    setSubmitted(true);

    // Launch retro victory confetti blast
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0000AA', '#FFFF55', '#FF5555', '#00AA00', '#FFFFFF'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono select-none backdrop-blur-xs">
      <DosWindow
        title="SHAREWARE NOTICE - REGISTER SAND-DOS v3.1"
        onClose={onClose}
        className="w-full max-w-lg"
        headerBg="bg-[#AA0000]"
      >
        <div className="space-y-3">
          {/* Header Banner */}
          <div className="border-2 border-[#000000] bg-[#FFFF55] p-2 text-black text-center shadow-inner">
            <h2 className="text-base font-extrabold tracking-widest uppercase">
              ★ UNLOCK SAND-DOS 3.1 PRO EDITION ★
            </h2>
            <p className="text-xs font-bold mt-0.5 text-[#AA0000]">
              SUPPORT INDEPENDENT SHAREWARE AUTHORS!
            </p>
          </div>

          {!submitted && !isRegistered ? (
            <>
              {/* Shareware Info Text */}
              <div className="border-2 border-[#555555] bg-[#FFFFFF] p-2 text-xs text-black space-y-2">
                <p>
                  Thank you for trying <strong>Sand-DOS v3.1</strong>! This evaluation version is distributed under the <strong>Shareware Concept</strong>.
                </p>
                <p>
                  If you enjoy experimenting with sand, water, oil, fire, acid, lava, and explosives, please register your copy for <strong>\$15.00 USD</strong>.
                </p>
                <div className="bg-[#E0E0E0] p-1.5 border border-[#AAAAAA] text-[11px]">
                  <strong>Registered Pro User Perks:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#0000AA]">
                    <li>Official Printed User Manual & 3.5" High-Density Floppy Disk</li>
                    <li>Unlocks Turbo Cellular Automata Speed (4x)</li>
                    <li>Support future DOS shareware game development</li>
                    <li>Removes startup Shareware Nag Screen</li>
                  </ul>
                </div>
              </div>

              {/* Order Form Form */}
              <form onSubmit={handleRegister} className="border-2 border-[#0000AA] bg-[#0000AA] p-3 text-white space-y-2">
                <div className="text-xs font-bold text-[#FFFF55] uppercase flex items-center gap-1">
                  <Key className="h-4 w-4" /> OFFICIAL REGISTRATION ORDER FORM
                </div>

                <div>
                  <label className="block text-[11px] font-bold">USER / BBS HANDLE:</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Commander Keen / CyberKnight"
                    className="w-full border border-white bg-black px-2 py-1 text-xs text-[#FFFF55] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold">REGISTRATION KEY (or leave blank to auto-generate):</label>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="SD31-PRO-90s-SHAREWARE"
                    className="w-full border border-white bg-black px-2 py-1 text-xs text-[#00FF00] font-mono focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-[#FFFF55]">
                    REGISTRATION FEE: <span className="font-extrabold">$15.00</span>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 border-2 border-white bg-[#00AA00] px-3 py-1 text-xs text-white font-bold hover:bg-[#FFFF55] hover:text-black shadow-[2px_2px_0px_#000000] active:translate-y-0.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>REGISTER NOW!</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Registered Success Confirmation */
            <div className="border-2 border-[#00AA00] bg-[#00AA00] p-4 text-white text-center space-y-3">
              <Award className="h-12 w-12 mx-auto text-[#FFFF55] animate-bounce" />
              <h3 className="text-lg font-extrabold tracking-wider text-[#FFFF55]">
                REGISTRATION SUCCESSFUL!
              </h3>
              <p className="text-xs">
                Welcome, <strong>{userName || 'VALUED SHAREWARE SUPPORTER'}</strong>! Your copy of <strong>Sand-DOS v3.1 Pro Edition</strong> is fully registered!
              </p>
              <p className="text-[11px] bg-black/40 p-2 border border-white font-mono">
                REGISTRATION CODE: <span className="text-[#00FF00]">SD31-PRO-REGISTERED-VALID</span>
              </p>
              <button
                onClick={onClose}
                className="mt-2 border-2 border-white bg-[#FFFF55] px-4 py-1 text-xs text-black font-extrabold hover:bg-white"
              >
                RETURN TO SIMULATION
              </button>
            </div>
          )}
        </div>
      </DosWindow>
    </div>
  );
};
