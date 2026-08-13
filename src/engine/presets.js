// Sand-DOS v3.1 Preset World Scenarios
import { ELEMENT_IDS } from './elements';

export const PRESETS = [
  {
    id: 'oil_rig',
    name: 'Oil Rig Inferno',
    category: 'Disaster Scenarios',
    description: 'Offshore oil drilling platform over deep ocean water with flammable crude oil leaking near sparks.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. Water sea (bottom third)
      const seaLevel = Math.floor(h * 0.7);
      for (let y = seaLevel; y < h; y++) {
        for (let x = 0; x < w; x++) {
          engine.set(x, y, ELEMENT_IDS.WATER);
        }
      }

      // 2. Oil rig wooden pillars
      const pillar1 = Math.floor(w * 0.3);
      const pillar2 = Math.floor(w * 0.7);
      const deckLevel = Math.floor(h * 0.45);

      for (let y = deckLevel; y < h - 2; y++) {
        for (let dx = -2; dx <= 2; dx++) {
          engine.set(pillar1 + dx, y, ELEMENT_IDS.STONE);
          engine.set(pillar2 + dx, y, ELEMENT_IDS.STONE);
        }
      }

      // 3. Wooden Deck
      for (let x = pillar1 - 15; x <= pillar2 + 15; x++) {
        for (let dy = -2; dy <= 2; dy++) {
          engine.set(x, deckLevel + dy, ELEMENT_IDS.PLANT);
        }
      }

      // 4. Oil Tank on deck
      const tankX = Math.floor(w * 0.5);
      const tankY = deckLevel - 20;

      // Tank walls
      for (let y = tankY; y < deckLevel - 2; y++) {
        engine.set(tankX - 15, y, ELEMENT_IDS.STONE);
        engine.set(tankX + 15, y, ELEMENT_IDS.STONE);
      }
      for (let x = tankX - 15; x <= tankX + 15; x++) {
        engine.set(x, tankY, ELEMENT_IDS.STONE);
      }

      // Fill tank with oil & oil spout
      for (let y = tankY + 2; y < deckLevel - 2; y++) {
        for (let x = tankX - 13; x <= tankX + 13; x++) {
          engine.set(x, y, ELEMENT_IDS.OIL);
        }
      }
      engine.set(tankX, tankY + 1, ELEMENT_IDS.SPOUT_OIL);

      // Spark nearby
      engine.set(tankX - 18, deckLevel - 3, ELEMENT_IDS.SPARK, 10);
    },
  },

  {
    id: 'volcano',
    name: 'Volcano Eruption',
    category: 'Nature & Geology',
    description: 'Active volcanic cone with deep magma chamber, ash clouds, and gunpowder veins.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const cx = Math.floor(w * 0.5);

      // Build Stone Volcano Cone
      for (let y = Math.floor(h * 0.35); y < h; y++) {
        const spread = Math.floor((y - h * 0.35) * 0.85);
        for (let x = cx - spread - 30; x <= cx + spread + 30; x++) {
          if (x < 0 || x >= w) continue;

          // Caldera crater hole down the middle
          const distCenter = Math.abs(x - cx);
          if (distCenter < 12 && y < h * 0.75) {
            engine.set(x, y, ELEMENT_IDS.EMPTY);
          } else {
            engine.set(x, y, ELEMENT_IDS.STONE);
          }
        }
      }

      // Magma Chamber at bottom
      const magmaY = Math.floor(h * 0.7);
      for (let y = magmaY; y < h - 2; y++) {
        for (let x = cx - 25; x <= cx + 25; x++) {
          engine.set(x, y, ELEMENT_IDS.LAVA);
        }
      }

      // Lava spout in crater core
      engine.set(cx, magmaY + 5, ELEMENT_IDS.SPOUT_LAVA);

      // Gunpowder veins in volcano wall
      for (let y = Math.floor(h * 0.5); y < Math.floor(h * 0.65); y++) {
        engine.set(cx - 20, y, ELEMENT_IDS.GUNPOWDER);
        engine.set(cx + 20, y, ELEMENT_IDS.GUNPOWDER);
      }

      // Vegetation on outer slope
      for (let x = 10; x < cx - 40; x++) {
        const slopeY = Math.floor(h * 0.35 + (x / cx) * (h * 0.5));
        engine.set(x, slopeY - 1, ELEMENT_IDS.PLANT);
      }
    },
  },

  {
    id: 'acid_lab',
    name: 'Acid Corrosion Test',
    category: 'Chemistry Lab',
    description: 'Acid spouts corroding through multi-layer barriers of Stone, Wood, Sand, and Ice.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 4 horizontal barrier shelves
      const shelfY1 = Math.floor(h * 0.25);
      const shelfY2 = Math.floor(h * 0.45);
      const shelfY3 = Math.floor(h * 0.65);
      const shelfY4 = Math.floor(h * 0.85);

      // Shelf 1: Stone
      for (let x = 20; x < w - 20; x++) {
        for (let dy = 0; dy < 4; dy++) engine.set(x, shelfY1 + dy, ELEMENT_IDS.STONE);
      }

      // Shelf 2: Wood/Plant
      for (let x = 20; x < w - 20; x++) {
        for (let dy = 0; dy < 4; dy++) engine.set(x, shelfY2 + dy, ELEMENT_IDS.PLANT);
      }

      // Shelf 3: Sand
      for (let x = 20; x < w - 20; x++) {
        for (let dy = 0; dy < 4; dy++) engine.set(x, shelfY3 + dy, ELEMENT_IDS.SAND);
      }

      // Shelf 4: Ice
      for (let x = 20; x < w - 20; x++) {
        for (let dy = 0; dy < 4; dy++) engine.set(x, shelfY4 + dy, ELEMENT_IDS.ICE);
      }

      // Acid Spouts above top shelf
      engine.set(Math.floor(w * 0.25), 10, ELEMENT_IDS.ACID);
      engine.set(Math.floor(w * 0.5), 10, ELEMENT_IDS.ACID);
      engine.set(Math.floor(w * 0.75), 10, ELEMENT_IDS.ACID);

      // Continuous acid drips
      for (let x of [Math.floor(w * 0.25), Math.floor(w * 0.5), Math.floor(w * 0.75)]) {
        for (let dy = 0; dy < 5; dy++) {
          engine.set(x, 15 + dy, ELEMENT_IDS.ACID);
        }
      }
    },
  },

  {
    id: 'demolition',
    name: 'C4 & Gunpowder Demolition',
    category: 'Explosives',
    description: 'Chained C4 explosive charges and gunpowder fuse lines inside a heavy stone fortress.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      const fortressX = Math.floor(w * 0.3);
      const fortressW = Math.floor(w * 0.4);
      const fortressY = Math.floor(h * 0.3);
      const fortressH = Math.floor(h * 0.6);

      // Build Stone Fortress
      for (let y = fortressY; y < fortressY + fortressH; y++) {
        for (let x = fortressX; x < fortressX + fortressW; x++) {
          if (
            x < fortressX + 5 ||
            x > fortressX + fortressW - 5 ||
            y < fortressY + 5 ||
            y > fortressY + fortressH - 5
          ) {
            engine.set(x, y, ELEMENT_IDS.STONE);
          }
        }
      }

      // C4 Blocks inside fortress
      const cx = Math.floor(w * 0.5);
      const cy = Math.floor(h * 0.6);

      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          engine.set(cx + dx, cy + dy, ELEMENT_IDS.C4);
        }
      }

      // Gunpowder Fuse Line from left edge to C4
      for (let x = 10; x < cx - 8; x++) {
        engine.set(x, cy, ELEMENT_IDS.GUNPOWDER);
      }

      // Spark at starting fuse point
      engine.set(12, cy, ELEMENT_IDS.SPARK, 10);
    },
  },

  {
    id: 'rube_goldberg',
    name: 'Rube Goldberg System',
    category: 'Mechanisms',
    description: 'Automated chain reaction featuring Water spout, Cloners, Sand drops, Oil reservoir, and Spark trigger.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. Water Spout top left
      engine.set(25, 10, ELEMENT_IDS.SPOUT_WATER);

      // Ramp 1 (slanting right)
      for (let i = 0; i < 40; i++) {
        engine.set(20 + i, 25 + Math.floor(i * 0.5), ELEMENT_IDS.STONE);
      }

      // Cloner at end of Ramp 1
      engine.set(65, 48, ELEMENT_IDS.CLONER);

      // Sand Spout above Cloner to initialize clone target
      engine.set(65, 40, ELEMENT_IDS.SAND);

      // Ramp 2 (slanting left) under Cloner
      for (let i = 0; i < 45; i++) {
        engine.set(70 - i, 60 + Math.floor(i * 0.5), ELEMENT_IDS.STONE);
      }

      // Oil pool at bottom left
      for (let x = 15; x <= 40; x++) {
        engine.set(x, 90, ELEMENT_IDS.STONE);
      }
      for (let y = 82; y < 90; y++) {
        engine.set(15, y, ELEMENT_IDS.STONE);
        engine.set(40, y, ELEMENT_IDS.STONE);
        for (let x = 16; x < 40; x++) {
          engine.set(x, y, ELEMENT_IDS.OIL);
        }
      }

      // Gunpowder trail leading to C4 charge on bottom right
      for (let x = 41; x < w - 40; x++) {
        engine.set(x, 89, ELEMENT_IDS.GUNPOWDER);
      }

      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          engine.set(w - 30 + dx, 86 + dy, ELEMENT_IDS.C4);
        }
      }
    },
  },
];
