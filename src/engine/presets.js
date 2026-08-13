// Sand-DOS v3.1 Enhanced Preset World Scenarios
import { ELEMENT_IDS } from './elements';

export const PRESETS = [
  {
    id: 'quantum_portals',
    name: 'Quantum Portal Loop',
    category: 'Quantum Physics',
    description: 'Blue (A) & Orange (B) portals setup with infinite falling sand & liquid teleportation loops.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const p1x = Math.floor(w * 0.3);
      const p2x = Math.floor(w * 0.7);
      const pY = Math.floor(h * 0.6);

      // Portal A (Blue)
      engine.set(p1x, pY, ELEMENT_IDS.PORTAL_A);
      // Portal B (Orange)
      engine.set(p2x, Math.floor(h * 0.2), ELEMENT_IDS.PORTAL_B);

      // Ramp directing elements into Portal A
      for (let i = 0; i < 25; i++) {
        engine.set(p1x - 20 + i, pY - 15 + Math.floor(i * 0.5), ELEMENT_IDS.STONE);
      }

      // Sand Spout above Ramp
      engine.set(p1x - 15, 10, ELEMENT_IDS.SPOUT_SAND);
      // Water Spout above Ramp
      engine.set(p1x - 10, 10, ELEMENT_IDS.SPOUT_WATER);

      // Glass barrier container under Portal B
      for (let x = p2x - 15; x <= p2x + 15; x++) {
        engine.set(x, Math.floor(h * 0.5), ELEMENT_IDS.GLASS);
      }
      for (let y = Math.floor(h * 0.25); y < Math.floor(h * 0.5); y++) {
        engine.set(p2x - 15, y, ELEMENT_IDS.GLASS);
        engine.set(p2x + 15, y, ELEMENT_IDS.GLASS);
      }
    },
  },

  {
    id: 'laser_lab',
    name: 'Laser Beam & Fuse Test',
    category: 'Tech & Optics',
    description: 'High-energy Laser Emitter melting Wax walls, igniting TNT fuse lines, and vaporizing Ice caps.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const lx = Math.floor(w * 0.4);

      // Laser Emitter top
      engine.set(lx, 15, ELEMENT_IDS.LASER);

      // Wax block wall directly in laser path
      for (let dy = 0; dy < 10; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          engine.set(lx + dx, 50 + dy, ELEMENT_IDS.WAX);
        }
      }

      // TNT charge with fuse line below Wax
      for (let dy = 0; dy < 8; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          engine.set(lx + dx, 90 + dy, ELEMENT_IDS.TNT);
        }
      }

      // Glass reflection prism on left
      for (let i = 0; i < 20; i++) {
        engine.set(lx - 40 + i, 40 + i, ELEMENT_IDS.GLASS);
      }
    },
  },

  {
    id: 'mite_colony',
    name: 'Mite Bug Oasis Colony',
    category: 'Biology',
    description: 'Swarm of living Mite bugs crawling on stone walls and eating plant gardens to reproduce.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // Stone terraced garden
      for (let x = 20; x < w - 20; x++) {
        engine.set(x, Math.floor(h * 0.7), ELEMENT_IDS.STONE);
      }

      // Dense plant garden on terrace
      for (let y = Math.floor(h * 0.55); y < Math.floor(h * 0.7); y++) {
        for (let x = 30; x < w - 30; x++) {
          engine.set(x, y, ELEMENT_IDS.PLANT);
        }
      }

      // Water fountain spout
      engine.set(Math.floor(w * 0.5), 15, ELEMENT_IDS.SPOUT_WATER);

      // Spawn Mite bugs colony
      for (let i = 0; i < 15; i++) {
        engine.set(40 + i * 12, Math.floor(h * 0.52), ELEMENT_IDS.MITE);
      }
    },
  },

  {
    id: 'oil_rig',
    name: 'Oil Rig & LPG Gas Inferno',
    category: 'Disaster Scenarios',
    description: 'Offshore petroleum platform with LPG combustible gas leak & crude oil spill.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const seaLevel = Math.floor(h * 0.7);
      for (let y = seaLevel; y < h; y++) {
        for (let x = 0; x < w; x++) {
          engine.set(x, y, ELEMENT_IDS.WATER);
        }
      }

      const p1 = Math.floor(w * 0.3);
      const p2 = Math.floor(w * 0.7);
      const deckY = Math.floor(h * 0.45);

      for (let y = deckY; y < h - 2; y++) {
        for (let dx = -2; dx <= 2; dx++) {
          engine.set(p1 + dx, y, ELEMENT_IDS.STONE);
          engine.set(p2 + dx, y, ELEMENT_IDS.STONE);
        }
      }

      for (let x = p1 - 15; x <= p2 + 15; x++) {
        for (let dy = -2; dy <= 2; dy++) {
          engine.set(x, deckY + dy, ELEMENT_IDS.PLANT);
        }
      }

      // LPG Gas tank
      const tankX = Math.floor(w * 0.5);
      const tankY = deckY - 20;

      for (let y = tankY; y < deckY - 2; y++) {
        for (let x = tankX - 12; x <= tankX + 12; x++) {
          engine.set(x, y, ELEMENT_IDS.GAS_FUEL);
        }
      }

      engine.set(tankX - 15, deckY - 3, ELEMENT_IDS.SPARK, 10);
    },
  },

  {
    id: 'demolition',
    name: 'C4, TNT & Fortress Blast',
    category: 'Explosives',
    description: 'Fortress demolition test with C4 charges, TNT blocks, and gunpowder fuses.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const fx = Math.floor(w * 0.3);
      const fw = Math.floor(w * 0.4);
      const fy = Math.floor(h * 0.3);
      const fh = Math.floor(h * 0.6);

      for (let y = fy; y < fy + fh; y++) {
        for (let x = fx; x < fx + fw; x++) {
          if (
            x < fx + 5 ||
            x > fx + fw - 5 ||
            y < fy + 5 ||
            y > fy + fh - 5
          ) {
            engine.set(x, y, ELEMENT_IDS.STONE);
          }
        }
      }

      const cx = Math.floor(w * 0.5);
      const cy = Math.floor(h * 0.6);

      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -6; dx <= 6; dx++) {
          engine.set(cx + dx, cy + dy, ELEMENT_IDS.C4);
        }
      }

      for (let x = 10; x < cx - 6; x++) {
        engine.set(x, cy, ELEMENT_IDS.GUNPOWDER);
      }

      engine.set(12, cy, ELEMENT_IDS.SPARK, 10);
    },
  },
];
