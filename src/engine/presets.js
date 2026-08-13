// Sand-DOS v3.1 Epic Real Sandbox Presets & Machine Scenarios
import { ELEMENT_IDS } from './elements';

export const PRESETS = [
  {
    id: 'nuclear_plant',
    name: 'Nuclear Reactor Meltdown',
    category: 'Complex Machines',
    description: 'Reinforced nuclear containment dome with water cooling pool, electrical generator, and volatile core. If coolant fails, core detonates!',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w * 0.5);

      // 1. Reinforced Concrete Dome
      for (let y = Math.floor(h * 0.25); y < h - 10; y++) {
        for (let x = cx - 55; x <= cx + 55; x++) {
          const dist = Math.hypot(x - cx, (y - h * 0.25) * 1.2);
          if (
            (dist >= 50 && dist <= 55 && y < h * 0.7) ||
            x < cx - 50 ||
            x > cx + 50 ||
            y > h - 15
          ) {
            engine.set(x, y, ELEMENT_IDS.CONCRETE);
          }
        }
      }

      // 2. Coolant Water Reservoir (Left Chamber)
      for (let y = Math.floor(h * 0.4); y < h - 15; y++) {
        for (let x = cx - 48; x < cx - 18; x++) {
          engine.set(x, y, ELEMENT_IDS.WATER);
        }
      }
      engine.set(cx - 33, Math.floor(h * 0.28), ELEMENT_IDS.SPOUT_WATER);

      // Divider Wall between coolant & core
      for (let y = Math.floor(h * 0.35); y < h - 15; y++) {
        for (let dx = -2; dx <= 2; dx++) {
          engine.set(cx - 18 + dx, y, ELEMENT_IDS.CONCRETE);
        }
      }

      // 3. Volatile Core (Right Chamber)
      const coreX = cx + 15;
      const coreY = Math.floor(h * 0.6);

      // Nuclear Fuel Rods (Antimatter & C4 & TNT)
      for (let dy = -6; dy <= 6; dy++) {
        for (let dx = -10; dx <= 10; dx++) {
          if (Math.random() < 0.3) {
            engine.set(coreX + dx, coreY + dy, ELEMENT_IDS.ANTIMATTER);
          } else if (Math.random() < 0.5) {
            engine.set(coreX + dx, coreY + dy, ELEMENT_IDS.C4);
          } else {
            engine.set(coreX + dx, coreY + dy, ELEMENT_IDS.TNT);
          }
        }
      }

      // Electrical Control Grid (Battery -> Wire -> Heater rod)
      for (let x = cx - 15; x <= coreX - 12; x++) {
        engine.set(x, coreY, ELEMENT_IDS.WIRE);
      }
      engine.set(cx - 16, coreY, ELEMENT_IDS.BATTERY);
      engine.set(coreX - 11, coreY, ELEMENT_IDS.HEATER);

      // Control Glass Observation Window
      for (let y = Math.floor(h * 0.3); y < Math.floor(h * 0.45); y++) {
        engine.set(cx + 48, y, ELEMENT_IDS.GLASS);
      }
    },
  },

  {
    id: 'volcano_island',
    name: 'Volcanic Island & Magma Chamber',
    category: 'Nature & Physics',
    description: 'Island ecosystem with sandy beaches, plant flora, deep magma chamber, lava spouts, and TNT ash veins.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w * 0.5);

      // 1. Ocean Water
      const seaLevel = Math.floor(h * 0.65);
      for (let y = seaLevel; y < h; y++) {
        for (let x = 0; x < w; x++) {
          engine.set(x, y, ELEMENT_IDS.WATER);
        }
      }

      // 2. Stone Volcano Island Mountain
      for (let y = Math.floor(h * 0.3); y < h; y++) {
        const spread = Math.floor((y - h * 0.3) * 0.9);
        for (let x = cx - spread - 25; x <= cx + spread + 25; x++) {
          if (x < 0 || x >= w) continue;

          // Caldera crater shaft down center
          const dist = Math.abs(x - cx);
          if (dist < 10 && y < h * 0.72) {
            engine.set(x, y, ELEMENT_IDS.EMPTY);
          } else {
            engine.set(x, y, ELEMENT_IDS.STONE);
          }
        }
      }

      // 3. Sandy Beach slopes & Vegetation
      for (let x = 10; x < cx - 12; x++) {
        const slopeY = Math.floor(h * 0.3 + (x / cx) * (h * 0.45));
        engine.set(x, slopeY - 1, ELEMENT_IDS.SAND);
        engine.set(x, slopeY - 2, ELEMENT_IDS.PLANT);
      }

      // 4. Magma Chamber at bottom
      const magmaY = Math.floor(h * 0.75);
      for (let y = magmaY; y < h - 2; y++) {
        for (let x = cx - 30; x <= cx + 30; x++) {
          engine.set(x, y, ELEMENT_IDS.LAVA);
        }
      }

      // Lava spout in core
      engine.set(cx, magmaY + 4, ELEMENT_IDS.SPOUT_LAVA);

      // TNT & Gunpowder ash veins in volcano walls
      for (let y = Math.floor(h * 0.5); y < Math.floor(h * 0.65); y++) {
        engine.set(cx - 22, y, ELEMENT_IDS.TNT);
        engine.set(cx + 22, y, ELEMENT_IDS.GUNPOWDER);
      }

      // Mite Bug colony on beach
      for (let i = 0; i < 8; i++) {
        engine.set(30 + i * 8, seaLevel - 3, ELEMENT_IDS.MITE);
      }
    },
  },

  {
    id: 'quantum_lab',
    name: 'Quantum Portal Hydro Loop',
    category: 'Quantum Physics',
    description: 'Portal A (Blue) & Portal B (Orange) perpetual motion system powering cloners, water wheels, and void black holes.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const p1x = Math.floor(w * 0.3);
      const p2x = Math.floor(w * 0.7);

      // Portal A (Entrance - Blue)
      engine.set(p1x, Math.floor(h * 0.65), ELEMENT_IDS.PORTAL_A);

      // Portal B (Exit - Orange)
      engine.set(p2x, Math.floor(h * 0.2), ELEMENT_IDS.PORTAL_B);

      // Ramp directing falling elements into Portal A
      for (let i = 0; i < 30; i++) {
        engine.set(p1x - 25 + i, Math.floor(h * 0.5) + Math.floor(i * 0.5), ELEMENT_IDS.GLASS);
      }

      // Water Spout & Sand Spout top left
      engine.set(p1x - 20, 10, ELEMENT_IDS.SPOUT_WATER);
      engine.set(p1x - 15, 10, ELEMENT_IDS.SPOUT_SAND);

      // Cloner platform under Portal B exit
      engine.set(p2x, Math.floor(h * 0.45), ELEMENT_IDS.CLONER);

      // Ramp under Cloner leading down to Black Hole
      for (let i = 0; i < 35; i++) {
        engine.set(p2x - i, Math.floor(h * 0.55) + Math.floor(i * 0.4), ELEMENT_IDS.GLASS);
      }

      // Black Hole (Void) at bottom of ramp
      engine.set(p2x - 35, Math.floor(h * 0.72), ELEMENT_IDS.VOID);
    },
  },

  {
    id: 'laser_defense',
    name: 'Laser Grid & Circuit Defense',
    category: 'Complex Machines',
    description: 'Electrical battery circuit powering dual Laser Emitters focused on Wax walls, LPG Gas tanks, and TNT targets.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const l1x = Math.floor(w * 0.35);
      const l2x = Math.floor(w * 0.65);

      // Laser Emitters
      engine.set(l1x, 20, ELEMENT_IDS.LASER);
      engine.set(l2x, 20, ELEMENT_IDS.LASER);

      // Battery & Wire circuit powering lasers
      for (let x = l1x - 10; x <= l2x + 10; x++) {
        engine.set(x, 15, ELEMENT_IDS.WIRE);
      }
      engine.set(Math.floor(w * 0.5), 15, ELEMENT_IDS.BATTERY);

      // Target 1: Paraffin Wax Wall under Laser 1
      for (let dy = 0; dy < 12; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          engine.set(l1x + dx, 55 + dy, ELEMENT_IDS.WAX);
        }
      }

      // Target 2: LPG Gas Fuel Tank & TNT under Laser 2
      for (let dy = 0; dy < 8; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          engine.set(l2x + dx, 55 + dy, ELEMENT_IDS.GAS_FUEL);
          engine.set(l2x + dx, 65 + dy, ELEMENT_IDS.TNT);
        }
      }

      // Glass windows enclosing targets
      for (let y = 45; y < 85; y++) {
        engine.set(l1x - 15, y, ELEMENT_IDS.GLASS);
        engine.set(l1x + 15, y, ELEMENT_IDS.GLASS);
        engine.set(l2x - 15, y, ELEMENT_IDS.GLASS);
        engine.set(l2x + 15, y, ELEMENT_IDS.GLASS);
      }
    },
  },

  {
    id: 'chemical_lab',
    name: 'Chemical Corrosion & Mercury Lab',
    category: 'Chemistry & Materials',
    description: 'Acid spouts corroding through Iron metal, Sand, and Wood shelves over a Mercury reservoir pool.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. Mercury Pool at bottom
      const poolY = Math.floor(h * 0.75);
      for (let y = poolY; y < h - 5; y++) {
        for (let x = 30; x < w - 30; x++) {
          engine.set(x, y, ELEMENT_IDS.MERCURY);
        }
      }
      // Glass container for Mercury
      for (let y = poolY - 5; y < h - 2; y++) {
        engine.set(28, y, ELEMENT_IDS.GLASS);
        engine.set(w - 28, y, ELEMENT_IDS.GLASS);
      }

      // 2. Shelf 1: Iron Metal (Corrodes to Rust)
      const s1y = Math.floor(h * 0.25);
      for (let x = 40; x < w - 40; x++) {
        for (let dy = 0; dy < 3; dy++) engine.set(x, s1y + dy, ELEMENT_IDS.IRON);
      }

      // 3. Shelf 2: Wood / Plant
      const s2y = Math.floor(h * 0.42);
      for (let x = 40; x < w - 40; x++) {
        for (let dy = 0; dy < 3; dy++) engine.set(x, s2y + dy, ELEMENT_IDS.PLANT);
      }

      // 4. Shelf 3: Sand
      const s3y = Math.floor(h * 0.58);
      for (let x = 40; x < w - 40; x++) {
        for (let dy = 0; dy < 3; dy++) engine.set(x, s3y + dy, ELEMENT_IDS.SAND);
      }

      // Acid Spouts dripping from top
      engine.set(Math.floor(w * 0.3), 10, ELEMENT_IDS.SPOUT_ACID);
      engine.set(Math.floor(w * 0.5), 10, ELEMENT_IDS.SPOUT_ACID);
      engine.set(Math.floor(w * 0.7), 10, ELEMENT_IDS.SPOUT_ACID);
    },
  },

  {
    id: 'mite_terrarium',
    name: 'Mite & Fungus Living Terrarium',
    category: 'Nature & Physics',
    description: 'Thriving terrarium with living Mite bugs, Plant garden, Spreading Fungus spores, and Water fountain spout.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // Concrete terrarium bowl
      for (let y = Math.floor(h * 0.5); y < h - 10; y++) {
        const spread = Math.floor((y - h * 0.5) * 0.8);
        for (let x = 30; x < w - 30; x++) {
          if (x < 30 + spread || x > w - 30 - spread || y > h - 15) {
            engine.set(x, y, ELEMENT_IDS.CONCRETE);
          }
        }
      }

      // Plant garden & soil
      for (let y = Math.floor(h * 0.6); y < h - 16; y++) {
        for (let x = 45; x < w - 45; x++) {
          engine.set(x, y, ELEMENT_IDS.PLANT);
        }
      }

      // Water Spout fountain
      engine.set(Math.floor(w * 0.5), 15, ELEMENT_IDS.SPOUT_WATER);

      // Fungus spore cluster
      engine.set(Math.floor(w * 0.3), Math.floor(h * 0.65), ELEMENT_IDS.FUNGUS);
      engine.set(Math.floor(w * 0.7), Math.floor(h * 0.65), ELEMENT_IDS.FUNGUS);

      // Mite Bug swarm
      for (let i = 0; i < 18; i++) {
        engine.set(40 + i * 10, Math.floor(h * 0.58), ELEMENT_IDS.MITE);
      }
    },
  },

  {
    id: 'fireworks_factory',
    name: 'Fireworks Factory & Explosives Range',
    category: 'Explosives',
    description: 'Complex demolition range featuring TNT blocks, C4 charges, Gunpowder fuse lines, LPG Gas tanks, and Spark triggers.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const cx = Math.floor(w * 0.5);

      // Concrete fortress bunker
      for (let y = Math.floor(h * 0.3); y < h - 10; y++) {
        for (let x = 30; x < w - 30; x++) {
          if (x < 35 || x > w - 35 || y < Math.floor(h * 0.3) + 5 || y > h - 15) {
            engine.set(x, y, ELEMENT_IDS.CONCRETE);
          }
        }
      }

      // TNT & C4 explosive blocks inside bunker
      for (let dy = -6; dy <= 6; dy++) {
        for (let dx = -10; dx <= 10; dx++) {
          if (Math.abs(dx) < 5) {
            engine.set(cx + dx, Math.floor(h * 0.6) + dy, ELEMENT_IDS.C4);
          } else {
            engine.set(cx + dx, Math.floor(h * 0.6) + dy, ELEMENT_IDS.TNT);
          }
        }
      }

      // LPG Gas Fuel cloud above explosives
      for (let dy = -8; dy <= 0; dy++) {
        for (let dx = -15; dx <= 15; dx++) {
          engine.set(cx + dx, Math.floor(h * 0.45) + dy, ELEMENT_IDS.GAS_FUEL);
        }
      }

      // Gunpowder Fuse line leading to left
      for (let x = 40; x < cx - 10; x++) {
        engine.set(x, Math.floor(h * 0.6), ELEMENT_IDS.GUNPOWDER);
      }

      // Spark trigger at fuse tip
      engine.set(42, Math.floor(h * 0.6), ELEMENT_IDS.SPARK, 10);
    },
  },

  {
    id: 'circuit_switch',
    name: 'Electrical Circuit & Switch Grid',
    category: 'Complex Machines',
    description: 'Full electrical logic circuit with Battery power source, Copper Wires, ON/OFF Switch, Heater rod, and TNT explosive payload.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const cy = Math.floor(h * 0.5);

      // Battery on left
      engine.set(30, cy, ELEMENT_IDS.BATTERY);

      // Copper wire line
      for (let x = 31; x < Math.floor(w * 0.45); x++) {
        engine.set(x, cy, ELEMENT_IDS.WIRE);
      }

      // Switch (ON) in center
      engine.set(Math.floor(w * 0.45), cy, ELEMENT_IDS.SWITCH_ON);

      // Copper wire continuation
      for (let x = Math.floor(w * 0.45) + 1; x < Math.floor(w * 0.7); x++) {
        engine.set(x, cy, ELEMENT_IDS.WIRE);
      }

      // Electrical Heater rod at end
      engine.set(Math.floor(w * 0.7), cy, ELEMENT_IDS.HEATER);

      // TNT payload next to Heater
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = 1; dx <= 10; dx++) {
          engine.set(Math.floor(w * 0.7) + dx, cy + dy, ELEMENT_IDS.TNT);
        }
      }
    },
  },
];
