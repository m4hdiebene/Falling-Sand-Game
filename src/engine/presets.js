// Sand-DOS v3.1 Ultra-Detailed Masterpiece Sandbox Presets
import { ELEMENT_IDS } from './elements';

// --- Drawing Utility Functions ---
function drawRect(engine, x, y, w, h, id, filled = true) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      if (filled || dy === 0 || dy === h - 1 || dx === 0 || dx === w - 1) {
        engine.set(x + dx, y + dy, id);
      }
    }
  }
}

function drawCircle(engine, cx, cy, radius, id, filled = true) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (filled) {
        if (dist <= radius) engine.set(x, y, id);
      } else {
        if (Math.abs(dist - radius) < 1.0) engine.set(x, y, id);
      }
    }
  }
}

function drawLine(engine, x0, y0, x1, y1, id, thickness = 1) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  let err = dx + dy, e2; 
  let cx = x0, cy = y0;
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  while (true) {
    if (thickness === 1) {
      engine.set(cx, cy, id);
    } else {
      drawCircle(engine, cx, cy, thickness / 2, id, true);
    }
    if (cx === x1 && cy === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; cx += sx; }
    if (e2 <= dx) { err += dx; cy += sy; }
  }
}

function drawTree(engine, baseX, baseY, height, size) {
  // Trunk
  drawRect(engine, baseX - size, baseY - height, size * 2 + 1, height, ELEMENT_IDS.PLANT);
  // Leaves
  drawCircle(engine, baseX, baseY - height - size * 2, size * 4, ELEMENT_IDS.PLANT, true);
  // Apples/Fruit (maybe mites?)
  if (Math.random() > 0.5) {
    engine.set(baseX - size * 2, baseY - height - size * 2, ELEMENT_IDS.MITE);
  }
}

export const PRESETS = [
  {
    id: 'nuclear_plant',
    name: 'Sector 7-G Nuclear Facility',
    category: 'Complex Machines',
    description: 'An ultra-detailed, multi-layered nuclear reactor containment dome. Features active coolant pumps, an armored control room, and a highly unstable core. Cut the coolant to initiate catastrophic meltdown!',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w / 2);

      // Sky gradient background setup (using air temp mapping conceptually, but just empty here)

      // 1. The Massive Containment Dome (Multi-layered)
      // Outer Concrete Shell
      drawCircle(engine, cx, h + 30, 110, ELEMENT_IDS.CONCRETE, false);
      drawCircle(engine, cx, h + 30, 109, ELEMENT_IDS.CONCRETE, false);
      drawCircle(engine, cx, h + 30, 108, ELEMENT_IDS.CONCRETE, false);
      // Inner Iron Reinforcement
      drawCircle(engine, cx, h + 30, 104, ELEMENT_IDS.IRON, false);
      drawCircle(engine, cx, h + 30, 103, ELEMENT_IDS.IRON, false);

      // Floor & Foundations
      drawRect(engine, 0, h - 15, w, 15, ELEMENT_IDS.CONCRETE);
      drawRect(engine, cx - 110, h - 25, 220, 10, ELEMENT_IDS.CONCRETE);

      // 2. The Core Chamber (Suspended in the middle)
      const coreY = h - 60;
      // Coolant Pool Basin
      drawRect(engine, cx - 50, coreY - 10, 100, 60, ELEMENT_IDS.CONCRETE);
      drawRect(engine, cx - 45, coreY - 5, 90, 50, ELEMENT_IDS.WATER);
      
      // Core Housing (Iron & Glass)
      drawRect(engine, cx - 20, coreY, 40, 40, ELEMENT_IDS.IRON, false);
      drawRect(engine, cx - 19, coreY + 1, 38, 38, ELEMENT_IDS.GLASS, false);
      drawRect(engine, cx - 18, coreY + 2, 36, 36, ELEMENT_IDS.EMPTY);
      
      // The Fuel Rods (Alternating Antimatter, C4, TNT, Uranium-esque)
      for(let x = cx - 12; x <= cx + 12; x += 6) {
        drawRect(engine, x, coreY + 5, 3, 30, ELEMENT_IDS.ANTIMATTER);
        drawRect(engine, x + 3, coreY + 5, 3, 30, ELEMENT_IDS.C4);
      }

      // 3. Coolant Systems
      // Water Spouts pumping in from the top
      engine.set(cx - 30, coreY - 20, ELEMENT_IDS.SPOUT_WATER);
      engine.set(cx + 30, coreY - 20, ELEMENT_IDS.SPOUT_WATER);
      // Drain voids to prevent flooding the dome
      drawRect(engine, cx - 44, coreY + 44, 10, 1, ELEMENT_IDS.VOID);
      drawRect(engine, cx + 34, coreY + 44, 10, 1, ELEMENT_IDS.VOID);

      // 4. Control Room (Elevated Platform)
      const crX = cx + 65;
      const crY = h - 70;
      drawRect(engine, crX, crY, 35, 45, ELEMENT_IDS.IRON);
      drawRect(engine, crX + 2, crY + 2, 31, 20, ELEMENT_IDS.EMPTY); // Upper Window
      drawRect(engine, crX + 2, crY + 2, 10, 20, ELEMENT_IDS.GLASS); // Glass pane
      drawRect(engine, crX + 15, crY + 18, 5, 4, ELEMENT_IDS.PLANT); // Wooden desk
      engine.set(crX + 16, crY + 16, ELEMENT_IDS.MITE); // Scientist Mite

      // 5. Electrical Ignition System (To trigger meltdown manually)
      // Battery -> Switch -> Wire -> Heater touching the core
      drawRect(engine, crX + 5, crY + 30, 10, 5, ELEMENT_IDS.BATTERY);
      engine.set(crX + 1, crY + 32, ELEMENT_IDS.SWITCH_ON);
      drawLine(engine, cx + 21, coreY + 20, crX, crY + 32, ELEMENT_IDS.WIRE, 2);
      drawRect(engine, cx + 20, coreY + 18, 2, 5, ELEMENT_IDS.HEATER);

      // 6. External details
      // Vent chimneys
      drawRect(engine, cx - 80, h - 80, 10, 55, ELEMENT_IDS.CONCRETE);
      engine.set(cx - 75, h - 26, ELEMENT_IDS.SMOKE);
    },
  },

  {
    id: 'volcano_island',
    name: 'Mount Krakatoa Eruption',
    category: 'Nature & Physics',
    description: 'A breathtaking island ecosystem covering a massive, deep magma chamber. Complete with intricate sandy beaches, glowing underwater saltwater caves, and explosive TNT ash veins just waiting to blow.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w / 2);

      // 1. The Ocean
      const seaLevel = Math.floor(h * 0.6);
      drawRect(engine, 0, seaLevel, w, h - seaLevel, ELEMENT_IDS.WATER);
      
      // Salty Depths
      for(let y = h - 30; y < h; y++) {
        for(let x = 0; x < w; x++) {
          if (Math.random() > 0.5) engine.set(x, y, ELEMENT_IDS.SALTWATER);
        }
      }

      // 2. The Great Volcano Mountain
      for (let y = 30; y < h; y++) {
        // Curve of the mountain using a cosine wave for natural slope
        const widthAtY = Math.floor((Math.cos(((y - h) / (h - 30)) * Math.PI) + 1) * (w * 0.45));
        for (let x = cx - widthAtY; x <= cx + widthAtY; x++) {
          if (x < 0 || x >= w) continue;
          
          // Magma Chamber & Shaft
          const distToCenter = Math.abs(x - cx);
          const shaftWidth = 8 + (y * 0.05);
          
          if (distToCenter < shaftWidth && y > 60) {
            if (y > h - 50) {
              engine.set(x, y, ELEMENT_IDS.LAVA); // Deep Magma
            } else {
              engine.set(x, y, ELEMENT_IDS.EMPTY); // Hollow shaft
            }
          } else {
            // Mountain Shell
            if (Math.random() < 0.05 && distToCenter < shaftWidth + 10 && y > 80) {
              engine.set(x, y, ELEMENT_IDS.TNT); // Explosive veins near shaft
            } else if (distToCenter === Math.floor(widthAtY)) {
              engine.set(x, y, Math.random() > 0.5 ? ELEMENT_IDS.SAND : ELEMENT_IDS.STONE);
            } else {
              engine.set(x, y, ELEMENT_IDS.STONE);
            }
          }
        }
      }

      // Active Lava Spout in the deep chamber
      engine.set(cx, h - 20, ELEMENT_IDS.SPOUT_LAVA);

      // 3. Sandy Beaches & Ecosystem
      // Left Beach
      drawCircle(engine, cx - Math.floor(w * 0.35), seaLevel, 25, ELEMENT_IDS.SAND, true);
      // Right Beach
      drawCircle(engine, cx + Math.floor(w * 0.35), seaLevel, 25, ELEMENT_IDS.SAND, true);
      
      // Palm Trees
      drawTree(engine, cx - Math.floor(w * 0.35), seaLevel - 25, 20, 2);
      drawTree(engine, cx + Math.floor(w * 0.35), seaLevel - 25, 15, 1);

      // Mite Fauna
      for(let i=0; i<10; i++) {
        engine.set(cx - Math.floor(w * 0.35) - 10 + i, seaLevel - 30, ELEMENT_IDS.MITE);
        engine.set(cx + Math.floor(w * 0.35) - 5 + i, seaLevel - 30, ELEMENT_IDS.MITE);
      }

      // Underwater Glowing Caves
      drawCircle(engine, cx - 60, h - 20, 15, ELEMENT_IDS.EMPTY, true);
      drawCircle(engine, cx - 60, h - 20, 16, ELEMENT_IDS.STONE, false);
      engine.set(cx - 60, h - 15, ELEMENT_IDS.LAVA); // Geothermal vent
    },
  },

  {
    id: 'quantum_lab',
    name: 'Aperture Hydro-Loop Dam',
    category: 'Quantum Physics',
    description: 'A colossal hydroelectric dam structure. Massive amounts of water pour over the spillways, flowing through a mesmerizing infinite portal loop, powering cloner turbines before gracefully entering black hole voids.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. The Massive Dam Structure
      drawRect(engine, 0, 0, 80, h, ELEMENT_IDS.CONCRETE); // Left supporting wall
      drawRect(engine, 80, h - 60, 40, 60, ELEMENT_IDS.CONCRETE); // Slope base
      drawLine(engine, 80, 50, 140, h, ELEMENT_IDS.CONCRETE, 10); // Angled spillway
      
      // Inner workings of the dam
      drawCircle(engine, 40, h - 40, 20, ELEMENT_IDS.EMPTY, true);
      drawRect(engine, 30, h - 45, 20, 10, ELEMENT_IDS.IRON);
      
      // Water Reservoir behind the dam
      drawRect(engine, 0, 0, 75, h, ELEMENT_IDS.WATER);
      
      // 2. The Spillway & Cloner Turbines
      // Spillway guides
      drawLine(engine, 140, h - 20, w - 20, h - 20, ELEMENT_IDS.GLASS, 4);
      
      // Turbine 1 (Cloners)
      drawRect(engine, 160, h - 25, 20, 5, ELEMENT_IDS.CLONER);
      // Turbine 2 (Cloners)
      drawRect(engine, 210, h - 25, 20, 5, ELEMENT_IDS.CLONER);

      // 3. The Quantum Portal Loop
      // Portal A (Entrance) - Catches the water at the end of the spillway
      drawRect(engine, w - 30, h - 40, 10, 20, ELEMENT_IDS.PORTAL_A);
      
      // Portal B (Exit) - Drops water from the sky back onto the spillway
      drawRect(engine, 150, 20, 30, 10, ELEMENT_IDS.PORTAL_B);

      // 4. Excess Drainage (To prevent system crash from infinite water)
      drawRect(engine, w - 40, h - 10, 30, 5, ELEMENT_IDS.VOID);
      
      // 5. Aesthetic Details
      // Rain clouds above the reservoir
      drawCircle(engine, 40, 20, 15, ELEMENT_IDS.STEAM, true);
      engine.set(40, 25, ELEMENT_IDS.SPOUT_WATER);
      
      // Walkway bridge over the spillway
      drawLine(engine, 100, 40, w, 40, ELEMENT_IDS.IRON, 2);
      for(let x = 110; x < w; x += 15) {
        drawLine(engine, x, 40, x, 30, ELEMENT_IDS.IRON, 1);
        engine.set(x, 29, ELEMENT_IDS.SPARK); // Bridge lights
      }
    },
  },

  {
    id: 'laser_defense',
    name: 'Laser Security Vault',
    category: 'Complex Machines',
    description: 'An impenetrable underground vault made of thick Iron and Concrete, housing precious Antimatter. Guarded by an active laser grid, LPG gas traps, and a fully wired security circuit. Intruders beware!',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w / 2);

      // 1. The Vault Structure
      const vY = h - 70;
      drawRect(engine, cx - 80, vY, 160, 60, ELEMENT_IDS.CONCRETE); // Outer Shell
      drawRect(engine, cx - 70, vY + 10, 140, 40, ELEMENT_IDS.IRON); // Inner Armor
      drawRect(engine, cx - 60, vY + 20, 120, 20, ELEMENT_IDS.EMPTY); // Vault Interior
      
      // 2. The Precious Cargo
      drawRect(engine, cx - 15, vY + 25, 30, 10, ELEMENT_IDS.GLASS); // Display Case
      drawRect(engine, cx - 10, vY + 27, 20, 6, ELEMENT_IDS.ANTIMATTER); // The Treasure

      // 3. Laser Grid Defense System
      // Ceiling Lasers pointing down
      engine.set(cx - 40, vY + 20, ELEMENT_IDS.LASER);
      engine.set(cx + 40, vY + 20, ELEMENT_IDS.LASER);
      
      // Floor Lasers pointing up
      engine.set(cx - 25, vY + 39, ELEMENT_IDS.LASER);
      engine.set(cx + 25, vY + 39, ELEMENT_IDS.LASER);

      // 4. Security Circuit (Powering the Lasers)
      drawRect(engine, cx - 50, vY + 5, 10, 5, ELEMENT_IDS.BATTERY);
      engine.set(cx - 39, vY + 7, ELEMENT_IDS.SWITCH_ON);
      
      // Wiring running through the ceiling to power lasers
      drawLine(engine, cx - 38, vY + 7, cx + 50, vY + 7, ELEMENT_IDS.WIRE, 1);
      drawLine(engine, cx - 40, vY + 8, cx - 40, vY + 19, ELEMENT_IDS.WIRE, 1);
      drawLine(engine, cx + 40, vY + 8, cx + 40, vY + 19, ELEMENT_IDS.WIRE, 1);

      // 5. Intruder Traps (LPG Gas Tanks)
      drawCircle(engine, cx - 60, 30, 15, ELEMENT_IDS.GLASS, false);
      drawCircle(engine, cx - 60, 30, 14, ELEMENT_IDS.GAS_FUEL, true);
      
      drawCircle(engine, cx + 60, 30, 15, ELEMENT_IDS.GLASS, false);
      drawCircle(engine, cx + 60, 30, 14, ELEMENT_IDS.GAS_FUEL, true);

      // 6. Suspended Intruders (Mites on a wooden plank, ready to drop)
      drawRect(engine, cx - 20, 40, 40, 3, ELEMENT_IDS.PLANT); // Wooden platform
      for(let i=0; i<15; i++) {
        engine.set(cx - 15 + (i*2), 38, ELEMENT_IDS.MITE);
      }
      
      // Entrance tunnel
      drawRect(engine, cx - 15, vY - 40, 30, 40, ELEMENT_IDS.EMPTY);
    },
  },

  {
    id: 'chemical_lab',
    name: 'Mad Scientist Alchemy Lab',
    category: 'Chemistry & Materials',
    description: 'A mesmerizing array of perfectly sculpted glass beakers, distillation flasks, and cooling tubes. Watch as Acid dissolves Iron, Water boils into Steam and condenses, all draining into a dense Mercury pool.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. Mercury Catchment Pool
      drawRect(engine, 0, h - 20, w, 20, ELEMENT_IDS.IRON);
      drawRect(engine, 10, h - 15, w - 20, 15, ELEMENT_IDS.MERCURY);

      // 2. Beaker 1: The Acid Test (Left)
      drawRect(engine, 20, 60, 50, 60, ELEMENT_IDS.GLASS, false);
      drawRect(engine, 25, 60, 40, 10, ELEMENT_IDS.EMPTY); // Open top
      drawRect(engine, 22, 100, 46, 18, ELEMENT_IDS.IRON); // Iron Block target
      engine.set(45, 20, ELEMENT_IDS.SPOUT_ACID); // Acid dripper

      // 3. Beaker 2: Distillation Flask (Center)
      // Round bottom flask
      drawCircle(engine, 140, 90, 30, ELEMENT_IDS.GLASS, false);
      // Flask neck
      drawRect(engine, 130, 40, 20, 30, ELEMENT_IDS.GLASS, false);
      drawRect(engine, 132, 40, 16, 30, ELEMENT_IDS.EMPTY);
      // Fill with water
      drawCircle(engine, 140, 100, 18, ELEMENT_IDS.WATER, true);
      // Heating Element underneath
      drawRect(engine, 130, 125, 20, 5, ELEMENT_IDS.HEATER);
      drawRect(engine, 120, 130, 10, 5, ELEMENT_IDS.BATTERY);
      engine.set(130, 132, ELEMENT_IDS.WIRE);

      // 4. The Condenser Tube (Connecting Center to Right)
      drawLine(engine, 150, 60, 220, 80, ELEMENT_IDS.GLASS, 3);
      drawLine(engine, 150, 60, 220, 80, ELEMENT_IDS.EMPTY, 1); // Hollow inner tube
      
      // Cooling Jacket around the tube
      drawLine(engine, 160, 55, 210, 70, ELEMENT_IDS.GLASS, 1);
      drawLine(engine, 160, 65, 210, 85, ELEMENT_IDS.GLASS, 1);
      engine.set(185, 63, ELEMENT_IDS.COOLER); // Active cooling
      drawRect(engine, 180, 50, 5, 5, ELEMENT_IDS.BATTERY);
      drawLine(engine, 182, 55, 185, 63, ELEMENT_IDS.WIRE, 1);

      // 5. Beaker 3: Receiving Flask (Right)
      drawRect(engine, 210, 80, 40, 40, ELEMENT_IDS.GLASS, false);
      drawRect(engine, 212, 80, 36, 10, ELEMENT_IDS.EMPTY); // Hole for tube
      // Pre-fill with a little Oil to see separation when water drops in
      drawRect(engine, 212, 110, 36, 8, ELEMENT_IDS.OIL);

      // 6. Shelving & Supports
      drawLine(engine, 0, 140, w, 140, ELEMENT_IDS.PLANT, 4); // Wooden workbench
    },
  },

  {
    id: 'mite_terrarium',
    name: 'Overgrown Biodome Sphere',
    category: 'Nature & Physics',
    description: 'A perfectly spherical, enormous glass biodome enclosing a lush, thriving jungle. Features intricate wooden tree structures, flowing waterfalls, spreading fungus patches, and a bustling ecosystem of Mites.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;
      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const radius = 85;

      // 1. The Glass Biodome Sphere
      drawCircle(engine, cx, cy, radius, ELEMENT_IDS.GLASS, false);
      drawCircle(engine, cx, cy, radius - 1, ELEMENT_IDS.GLASS, false);

      // 2. Terrain Layers inside the dome
      // Bedrock / Stone base
      for(let y = cy + 40; y < cy + radius - 2; y++) {
        for(let x = cx - radius + 2; x < cx + radius - 2; x++) {
          if (Math.hypot(x - cx, y - cy) < radius - 2) {
            engine.set(x, y, ELEMENT_IDS.STONE);
          }
        }
      }
      // Mud / Soil layer
      for(let y = cy + 20; y < cy + 40; y++) {
        for(let x = cx - radius + 2; x < cx + radius - 2; x++) {
          if (Math.hypot(x - cx, y - cy) < radius - 2) {
            engine.set(x, y, ELEMENT_IDS.MUD);
          }
        }
      }
      // Top Sand/Plant layer
      for(let y = cy + 10; y < cy + 20; y++) {
        for(let x = cx - radius + 2; x < cx + radius - 2; x++) {
          if (Math.hypot(x - cx, y - cy) < radius - 2) {
            engine.set(x, y, Math.random() > 0.5 ? ELEMENT_IDS.SAND : ELEMENT_IDS.PLANT);
          }
        }
      }

      // 3. The Grand Tree
      drawRect(engine, cx - 10, cy - 30, 20, 50, ELEMENT_IDS.PLANT); // Main Trunk
      drawLine(engine, cx - 10, cy - 10, cx - 40, cy - 30, ELEMENT_IDS.PLANT, 4); // Left Branch
      drawLine(engine, cx + 10, cy - 10, cx + 50, cy - 20, ELEMENT_IDS.PLANT, 6); // Right Branch
      drawLine(engine, cx, cy - 30, cx - 20, cy - 60, ELEMENT_IDS.PLANT, 3); // Top Left Branch
      
      // Leaves (Foliage)
      drawCircle(engine, cx - 40, cy - 30, 15, ELEMENT_IDS.PLANT, true);
      drawCircle(engine, cx + 50, cy - 20, 20, ELEMENT_IDS.PLANT, true);
      drawCircle(engine, cx - 20, cy - 60, 25, ELEMENT_IDS.PLANT, true);
      drawCircle(engine, cx + 10, cy - 50, 18, ELEMENT_IDS.PLANT, true);

      // 4. Ecosystem Features
      // Spreading Fungus on the right branch
      drawCircle(engine, cx + 50, cy - 25, 5, ELEMENT_IDS.FUNGUS, true);
      
      // Central Water Sprinkler system at the top of the dome
      engine.set(cx, cy - radius + 10, ELEMENT_IDS.SPOUT_WATER);

      // Mite Colony exploring the biome
      for(let i=0; i<30; i++) {
        engine.set(cx - 30 + Math.random() * 60, cy + 5 - Math.random() * 40, ELEMENT_IDS.MITE);
      }
    },
  },

  {
    id: 'fireworks_factory',
    name: 'Demolition Arsenal Bunker',
    category: 'Explosives',
    description: 'A meticulously designed underground munitions bunker. Racks of highly explosive C4, TNT, and Gunpowder are wired to an intricate fuse network. A single spark sets off a magnificent, cascading chain reaction.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. Above Ground Surface
      drawRect(engine, 0, 40, w, 20, ELEMENT_IDS.MUD);
      drawRect(engine, 0, 35, w, 5, ELEMENT_IDS.PLANT); // Grass

      // 2. The Concrete Bunker Complex
      const bY = 70;
      drawRect(engine, 20, bY, w - 40, h - bY, ELEMENT_IDS.CONCRETE); // Bunker Shell
      drawRect(engine, 25, bY + 5, w - 50, h - bY - 10, ELEMENT_IDS.EMPTY); // Interior

      // 3. Storage Racks (Wooden shelves holding explosives)
      // Shelf 1 (TNT)
      drawRect(engine, 30, 100, 80, 3, ELEMENT_IDS.PLANT);
      drawRect(engine, 30, 85, 80, 15, ELEMENT_IDS.TNT);
      
      // Shelf 2 (C4)
      drawRect(engine, 140, 100, 80, 3, ELEMENT_IDS.PLANT);
      drawRect(engine, 140, 85, 80, 15, ELEMENT_IDS.C4);

      // Shelf 3 (Gunpowder Barrels)
      drawRect(engine, 30, 140, 190, 3, ELEMENT_IDS.PLANT);
      for(let x=35; x<210; x+=25) {
        drawCircle(engine, x, 125, 10, ELEMENT_IDS.IRON, false);
        drawCircle(engine, x, 125, 9, ELEMENT_IDS.GUNPOWDER, true);
      }

      // 4. Giant Propane Tank (LPG Gas)
      drawCircle(engine, cx = 240, 115, 20, ELEMENT_IDS.IRON, false);
      drawCircle(engine, cx, 115, 19, ELEMENT_IDS.GAS_FUEL, true);
      drawRect(engine, cx - 10, 135, 20, 10, ELEMENT_IDS.IRON); // Stand

      // 5. Intricate Fuse Network
      // Main fuse line coming from surface
      drawLine(engine, 50, 30, 50, bY + 5, ELEMENT_IDS.GUNPOWDER, 2);
      
      // Splitting fuse lines to different shelves
      drawLine(engine, 50, bY + 5, 40, 85, ELEMENT_IDS.GUNPOWDER, 1); // To TNT
      drawLine(engine, 50, bY + 5, 150, 85, ELEMENT_IDS.GUNPOWDER, 1); // To C4
      drawLine(engine, 50, bY + 5, 45, 125, ELEMENT_IDS.GUNPOWDER, 1); // To Barrels
      
      // Wire connecting barrels to propane tank
      drawLine(engine, 210, 125, 220, 115, ELEMENT_IDS.GUNPOWDER, 2);

      // 6. The Detonator (A Spark waiting on the surface)
      engine.set(50, 25, ELEMENT_IDS.SPARK);
      // Glass box around the spark so it doesn't fly away
      drawRect(engine, 45, 20, 11, 10, ELEMENT_IDS.GLASS, false);
    },
  },

  {
    id: 'circuit_switch',
    name: 'Logic Gate Processor Core',
    category: 'Complex Machines',
    description: 'A macro-scale, highly detailed working logic circuit board. Features parallel battery power lines, switches acting as logic gates, routing through thick copper traces to activate Coolers, Heaters, and Lasers.',
    load: (engine) => {
      engine.clear();
      const w = engine.width;
      const h = engine.height;

      // 1. The Circuit Board Substrate (Green Concrete background approximation)
      drawRect(engine, 10, 10, w - 20, h - 20, ELEMENT_IDS.GLASS, false); // Casing

      // 2. Power Supply Unit (PSU) - Top Left
      drawRect(engine, 20, 20, 30, 40, ELEMENT_IDS.IRON, false);
      drawRect(engine, 22, 22, 26, 36, ELEMENT_IDS.BATTERY);
      
      // Main Power Bus Line (Vertical)
      drawLine(engine, 35, 60, 35, 160, ELEMENT_IDS.WIRE, 3);

      // 3. Trace 1: The Cooling Subsystem
      drawLine(engine, 35, 70, 80, 70, ELEMENT_IDS.WIRE, 2);
      engine.set(85, 70, ELEMENT_IDS.SWITCH_OFF); // Toggle Switch
      drawLine(engine, 90, 70, 150, 70, ELEMENT_IDS.WIRE, 2);
      
      // Cooling Radiator
      drawRect(engine, 150, 60, 30, 20, ELEMENT_IDS.COOLER);
      drawRect(engine, 180, 60, 20, 20, ELEMENT_IDS.WATER); // Water to freeze

      // 4. Trace 2: The Heating Element
      drawLine(engine, 35, 110, 80, 110, ELEMENT_IDS.WIRE, 2);
      engine.set(85, 110, ELEMENT_IDS.SWITCH_ON); // Default ON Switch
      drawLine(engine, 90, 110, 130, 110, ELEMENT_IDS.WIRE, 2);
      drawLine(engine, 130, 110, 130, 130, ELEMENT_IDS.WIRE, 2); // Bend
      drawLine(engine, 130, 130, 150, 130, ELEMENT_IDS.WIRE, 2);
      
      // Heating Coil
      for(let i=0; i<4; i++) {
        drawCircle(engine, 160 + (i*15), 130, 5, ELEMENT_IDS.HEATER, true);
      }
      drawRect(engine, 150, 140, 70, 15, ELEMENT_IDS.ICE); // Ice to melt

      // 5. Trace 3: Laser Output
      drawLine(engine, 35, 150, 100, 150, ELEMENT_IDS.WIRE, 2);
      engine.set(105, 150, ELEMENT_IDS.SWITCH_OFF);
      drawLine(engine, 110, 150, 220, 150, ELEMENT_IDS.WIRE, 2);
      
      // Laser Diode
      drawRect(engine, 220, 145, 10, 10, ELEMENT_IDS.IRON);
      engine.set(225, 145, ELEMENT_IDS.LASER);
      
      // 6. Aesthetic Circuit Details (Microchips)
      drawRect(engine, 200, 20, 40, 25, ELEMENT_IDS.IRON); // CPU
      for(let i=0; i<5; i++) {
        drawLine(engine, 190, 22 + (i*5), 200, 22 + (i*5), ELEMENT_IDS.WIRE, 1); // Pins
        drawLine(engine, 240, 22 + (i*5), 250, 22 + (i*5), ELEMENT_IDS.WIRE, 1);
      }

      drawRect(engine, 80, 25, 20, 15, ELEMENT_IDS.CONCRETE); // Capacitor
      drawRect(engine, 110, 25, 20, 15, ELEMENT_IDS.CONCRETE); // Capacitor
    },
  },
];
