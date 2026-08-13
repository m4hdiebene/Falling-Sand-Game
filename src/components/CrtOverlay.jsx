// Sand-DOS v3.1 Retro CRT Monitor Effect Overlay
import React from 'react';

export const CrtOverlay = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {/* CRT Scanline Stripes */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Phosphor Bloom / Subtle Vignette */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      {/* Subpixel RGB Glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,0,0,0.3), rgba(0,255,0,0.3), rgba(0,0,255,0.3))',
          backgroundSize: '3px 100%',
        }}
      />
    </div>
  );
};
