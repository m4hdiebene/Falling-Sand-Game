// Sand-DOS v3.1 High-Performance Canvas Cellular Automata Physics Engine
import { ELEMENT_IDS, ELEMENTS, getElementColor } from './elements';

export class SandEngine {
  constructor(width = 240, height = 160) {
    this.width = width;
    this.height = height;
    this.size = width * height;

    // Grid buffers
    this.grid = new Uint8Array(this.size);
    this.nextGrid = new Uint8Array(this.size);
    this.life = new Uint8Array(this.size);
    this.clonedType = new Uint8Array(this.size); // Stores element ID cloned by Cloner tile
    this.updated = new Uint8Array(this.size);

    // Canvas & rendering
    this.canvas = null;
    this.ctx = null;
    this.imgData = null;
    this.pixelBuffer32 = null;

    // Simulation state & controls
    this.tickCount = 0;
    this.gravity = { x: 0, y: 1 }; // Default down gravity
    this.wind = 0; // -1 (left), 0 (none), 1 (right)
    this.particleCount = 0;
    this.audioCallback = null; // Callback for PC speaker sound triggers (sizzle, explosion, splash)

    this.initGrid();
  }

  initGrid() {
    this.grid.fill(ELEMENT_IDS.EMPTY);
    this.life.fill(0);
    this.clonedType.fill(0);
    this.updated.fill(0);
  }

  attachCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.imgData = this.ctx.createImageData(this.width, this.height);
    this.pixelBuffer32 = new Uint32Array(this.imgData.data.buffer);
    this.render();
  }

  setAudioCallback(cb) {
    this.audioCallback = cb;
  }

  getIndex(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  get(x, y) {
    const idx = this.getIndex(x, y);
    if (idx === -1) return ELEMENT_IDS.STONE; // Boundaries act as stone wall
    return this.grid[idx];
  }

  set(x, y, id, lifeVal = 0) {
    const idx = this.getIndex(x, y);
    if (idx === -1) return;
    this.grid[idx] = id;
    this.life[idx] = lifeVal;
  }

  clear() {
    this.initGrid();
    this.render();
  }

  // Draw shapes (Brush painting)
  drawBrush(centerX, centerY, elementId, size = 5, shape = 'circle') {
    const radius = Math.floor(size / 2);
    let painted = 0;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;

        if (shape === 'circle' && dx * dx + dy * dy > radius * radius + 1) {
          continue;
        }

        if (shape === 'spray' && Math.random() > 0.4) {
          continue;
        }

        const currentElem = this.get(x, y);

        // Erase mode
        if (elementId === ELEMENT_IDS.EMPTY) {
          this.set(x, y, ELEMENT_IDS.EMPTY, 0);
          painted++;
          continue;
        }

        // Only overwrite empty or weaker elements (unless tool is solid)
        if (
          currentElem === ELEMENT_IDS.EMPTY ||
          ELEMENTS[elementId]?.type === 'solid' ||
          currentElem !== elementId
        ) {
          let initialLife = 0;
          const elemDef = ELEMENTS[elementId];
          if (elemDef?.lifeMin) {
            initialLife = Math.floor(
              elemDef.lifeMin + Math.random() * (elemDef.lifeMax - elemDef.lifeMin)
            );
          }

          this.set(x, y, elementId, initialLife);
          painted++;
        }
      }
    }

    if (painted > 0 && this.audioCallback) {
      if (elementId === ELEMENT_IDS.FIRE || elementId === ELEMENT_IDS.LAVA) {
        this.audioCallback('sizzle');
      } else if (elementId === ELEMENT_IDS.WATER || elementId === ELEMENT_IDS.ACID) {
        this.audioCallback('splash');
      } else if (elementId === ELEMENT_IDS.GUNPOWDER || elementId === ELEMENT_IDS.C4) {
        this.audioCallback('click');
      } else {
        this.audioCallback('pour');
      }
    }
  }

  // Main CA Physics Step Loop
  step() {
    this.tickCount++;
    this.updated.fill(0);
    let count = 0;
    const isEvenTick = this.tickCount % 2 === 0;

    // Scan direction logic:
    // When gravity is down (normal), scan from bottom to top for falling particles.
    // When gravity is up (inverted), scan from top to bottom.
    const gravY = this.gravity.y;
    const yStart = gravY >= 0 ? this.height - 1 : 0;
    const yEnd = gravY >= 0 ? -1 : this.height;
    const yStep = gravY >= 0 ? -1 : 1;

    for (let y = yStart; y !== yEnd; y += yStep) {
      // Alternate left-to-right / right-to-left scan per row to prevent biased horizontal drift
      const xStart = isEvenTick ? 0 : this.width - 1;
      const xEnd = isEvenTick ? this.width : -1;
      const xStep = isEvenTick ? 1 : -1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const idx = y * this.width + x;
        const id = this.grid[idx];

        if (id === ELEMENT_IDS.EMPTY) continue;
        count++;

        if (this.updated[idx]) continue;

        const elemDef = ELEMENTS[id];
        if (!elemDef) continue;

        // Process physics by element type
        switch (elemDef.type) {
          case 'powder':
            this.updatePowder(x, y, idx, id);
            break;
          case 'liquid':
            this.updateLiquid(x, y, idx, id, elemDef.dispersion || 3);
            break;
          case 'gas':
            this.updateGas(x, y, idx, id);
            break;
          case 'solid':
            this.updateSolid(x, y, idx, id);
            break;
        }
      }
    }

    this.particleCount = count;
  }

  // --- Element Specific Physics Updates ---

  updatePowder(x, y, idx, id) {
    const gy = this.gravity.y;
    const targetY = y + gy;
    const targetX = x + this.wind;

    // 1. Direct fall down
    if (this.tryMove(x, y, x, targetY, id)) return;

    // 2. Diagonal cascade
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    // 3. Sinking in lighter liquids
    const belowId = this.get(x, targetY);
    const belowDef = ELEMENTS[belowId];
    if (belowDef && belowDef.type === 'liquid' && belowDef.density < ELEMENTS[id].density) {
      this.swap(x, y, x, targetY);
      return;
    }
  }

  updateLiquid(x, y, idx, id, dispersion) {
    const gy = this.gravity.y;
    const targetY = y + gy;

    // 1. Fall down
    if (this.tryMove(x, y, x, targetY, id)) return;

    // 2. Diagonal fall
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    // 3. Sideways dispersion flow
    for (let i = dispersion; i >= 1; i--) {
      const spreadDir = Math.random() < 0.5 ? i : -i;
      if (this.tryMove(x, y, x + spreadDir, y, id)) return;
      if (this.tryMove(x, y, x - spreadDir, y, id)) return;
    }

    // 4. Liquid Density floating/sinking swap (e.g. Oil floats on Water)
    const belowId = this.get(x, targetY);
    const belowDef = ELEMENTS[belowId];
    if (belowDef && belowDef.type === 'liquid' && belowDef.density < ELEMENTS[id].density) {
      this.swap(x, y, x, targetY);
      return;
    }

    // Liquid specific reactions
    if (id === ELEMENT_IDS.ACID) {
      this.reactAcid(x, y);
    } else if (id === ELEMENT_IDS.LAVA) {
      this.reactLava(x, y);
    }
  }

  updateGas(x, y, idx, id) {
    // Gas life counter
    if (this.life[idx] > 0) {
      this.life[idx]--;
      if (this.life[idx] === 0) {
        if (id === ELEMENT_IDS.FIRE) {
          // Fire decays into Smoke or Empty
          const newId = Math.random() < 0.5 ? ELEMENT_IDS.SMOKE : ELEMENT_IDS.EMPTY;
          this.set(x, y, newId, newId === ELEMENT_IDS.SMOKE ? 40 : 0);
        } else if (id === ELEMENT_IDS.STEAM) {
          // Steam condenses into Water droplet occasionally or vanishes
          const newId = Math.random() < 0.25 ? ELEMENT_IDS.WATER : ELEMENT_IDS.EMPTY;
          this.set(x, y, newId, 0);
        } else {
          this.set(x, y, ELEMENT_IDS.EMPTY, 0);
        }
        return;
      }
    }

    // Gas rises opposite to gravity
    const gy = -this.gravity.y;
    const targetY = y + gy;
    const windShift = this.wind + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0);

    // 1. Rise up
    if (this.tryMove(x, y, x + windShift, targetY, id)) return;

    // 2. Rise diagonal
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    // Gas reactions (Fire igniting fuel)
    if (id === ELEMENT_IDS.FIRE || id === ELEMENT_IDS.SPARK) {
      this.reactFire(x, y);
    }
  }

  updateSolid(x, y, idx, id) {
    // Spouts & Emitters
    if (id === ELEMENT_IDS.SPOUT_SAND) this.runSpout(x, y, ELEMENT_IDS.SAND);
    else if (id === ELEMENT_IDS.SPOUT_WATER) this.runSpout(x, y, ELEMENT_IDS.WATER);
    else if (id === ELEMENT_IDS.SPOUT_OIL) this.runSpout(x, y, ELEMENT_IDS.OIL);
    else if (id === ELEMENT_IDS.SPOUT_LAVA) this.runSpout(x, y, ELEMENT_IDS.LAVA);
    else if (id === ELEMENT_IDS.CLONER) this.runCloner(x, y, idx);
    else if (id === ELEMENT_IDS.VOID) this.runVoid(x, y);
    else if (id === ELEMENT_IDS.PLANT) this.runPlant(x, y);
    else if (id === ELEMENT_IDS.ICE) this.runIce(x, y);
  }

  // --- Tile Actions ---

  runSpout(x, y, spawnId) {
    const targetY = y + this.gravity.y;
    if (this.get(x, targetY) === ELEMENT_IDS.EMPTY) {
      this.set(x, targetY, spawnId);
    }
  }

  runCloner(x, y, idx) {
    // Check top neighbor for element to clone
    const topId = this.get(x, y - 1);
    if (topId !== ELEMENT_IDS.EMPTY && topId !== ELEMENT_IDS.CLONER && topId !== ELEMENT_IDS.VOID) {
      this.clonedType[idx] = topId;
    }

    const cloneSubject = this.clonedType[idx];
    if (cloneSubject > 0) {
      const bottomY = y + 1;
      if (this.get(x, bottomY) === ELEMENT_IDS.EMPTY) {
        this.set(x, bottomY, cloneSubject);
      }
    }
  }

  runVoid(x, y) {
    // Consumes adjacent elements
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
      [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      const nId = this.get(nx, ny);
      if (nId !== ELEMENT_IDS.EMPTY && nId !== ELEMENT_IDS.VOID && nId !== ELEMENT_IDS.STONE) {
        this.set(nx, ny, ELEMENT_IDS.EMPTY, 0);
      }
    }
  }

  runPlant(x, y) {
    // Plant absorbs nearby water to grow
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
    ];

    for (const [nx, ny] of neighbors) {
      if (this.get(nx, ny) === ELEMENT_IDS.WATER) {
        this.set(nx, ny, ELEMENT_IDS.EMPTY, 0); // Consume water

        // Pick empty neighbor to grow vine into
        const emptySpots = neighbors.filter(([ex, ey]) => this.get(ex, ey) === ELEMENT_IDS.EMPTY);
        if (emptySpots.length > 0 && Math.random() < 0.7) {
          const [gx, gy] = emptySpots[Math.floor(Math.random() * emptySpots.length)];
          this.set(gx, gy, ELEMENT_IDS.PLANT, 0);
        }
        break;
      }
    }
  }

  runIce(x, y) {
    // Freezes adjacent water slowly
    if (Math.random() < 0.05) {
      const neighbors = [
        [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
      ];
      for (const [nx, ny] of neighbors) {
        if (this.get(nx, ny) === ELEMENT_IDS.WATER) {
          this.set(nx, ny, ELEMENT_IDS.ICE, 0);
          break;
        }
      }
    }
  }

  // --- Reactions ---

  reactFire(x, y) {
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
      [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId === ELEMENT_IDS.EMPTY) continue;

      if (targetId === ELEMENT_IDS.WATER) {
        // Fire is put out, creates Steam
        this.set(x, y, ELEMENT_IDS.STEAM, 50);
        return;
      }

      if (targetId === ELEMENT_IDS.OIL || targetId === ELEMENT_IDS.PLANT) {
        // Ignite flammable
        this.set(nx, ny, ELEMENT_IDS.FIRE, 20);
      } else if (targetId === ELEMENT_IDS.GUNPOWDER) {
        // Detonate Gunpowder
        this.triggerExplosion(nx, ny, 8, 'gunpowder');
      } else if (targetId === ELEMENT_IDS.C4) {
        // Detonate C4 Shockwave
        this.triggerExplosion(nx, ny, 22, 'c4');
      } else if (targetId === ELEMENT_IDS.ICE) {
        // Melt Ice to Water
        this.set(nx, ny, ELEMENT_IDS.WATER, 0);
      }
    }
  }

  reactAcid(x, y) {
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
    ];

    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (
        targetId !== ELEMENT_IDS.EMPTY &&
        targetId !== ELEMENT_IDS.ACID &&
        targetId !== ELEMENT_IDS.VOID &&
        targetId !== ELEMENT_IDS.GLASS
      ) {
        // Dissolve neighbor into smoke/gas, consume acid
        this.set(nx, ny, ELEMENT_IDS.SMOKE, 30);
        this.set(x, y, ELEMENT_IDS.EMPTY, 0);
        if (this.audioCallback && Math.random() < 0.2) {
          this.audioCallback('acid');
        }
        return;
      }
    }
  }

  reactLava(x, y) {
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
    ];

    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);

      if (targetId === ELEMENT_IDS.WATER) {
        // Lava + Water -> Stone + Steam
        this.set(x, y, ELEMENT_IDS.STONE, 0);
        this.set(nx, ny, ELEMENT_IDS.STEAM, 60);
        if (this.audioCallback) this.audioCallback('sizzle');
        return;
      } else if (targetId === ELEMENT_IDS.OIL || targetId === ELEMENT_IDS.PLANT) {
        this.set(nx, ny, ELEMENT_IDS.FIRE, 25);
      } else if (targetId === ELEMENT_IDS.GUNPOWDER || targetId === ELEMENT_IDS.C4) {
        this.triggerExplosion(nx, ny, targetId === ELEMENT_IDS.C4 ? 24 : 10, 'c4');
      }
    }
  }

  triggerExplosion(cx, cy, radius, type = 'gunpowder') {
    if (this.audioCallback) {
      this.audioCallback(type === 'c4' ? 'bigExplosion' : 'explosion');
    }

    const rSq = radius * radius;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = cx + dx;
        const y = cy + dy;

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
        const distSq = dx * dx + dy * dy;

        if (distSq <= rSq) {
          const currentId = this.get(x, y);
          if (currentId === ELEMENT_IDS.VOID) continue;

          // Inner core: pure Fire & Sparks
          if (distSq <= rSq * 0.4) {
            this.set(x, y, Math.random() < 0.4 ? ELEMENT_IDS.SPARK : ELEMENT_IDS.FIRE, 15);
          }
          // Mid radius: Fire, Smoke & Shrapnel
          else if (distSq <= rSq * 0.8) {
            if (Math.random() < 0.6) {
              this.set(x, y, ELEMENT_IDS.FIRE, 20);
            } else {
              this.set(x, y, ELEMENT_IDS.SMOKE, 45);
            }
          }
          // Outer shockwave: destroys obstacles or hurls particles
          else {
            if (Math.random() < 0.5) {
              this.set(x, y, ELEMENT_IDS.SMOKE, 30);
            }
          }
        }
      }
    }
  }

  // Swap position of two cells
  swap(x1, y1, x2, y2) {
    const idx1 = y1 * this.width + x1;
    const idx2 = y2 * this.width + x2;

    const id1 = this.grid[idx1];
    const life1 = this.life[idx1];

    this.grid[idx1] = this.grid[idx2];
    this.life[idx1] = this.life[idx2];

    this.grid[idx2] = id1;
    this.life[idx2] = life1;

    this.updated[idx2] = 1;
  }

  tryMove(x1, y1, x2, y2, id) {
    if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) return false;

    const targetIdx = y2 * this.width + x2;
    if (this.grid[targetIdx] === ELEMENT_IDS.EMPTY) {
      const srcIdx = y1 * this.width + x1;

      this.grid[targetIdx] = id;
      this.life[targetIdx] = this.life[srcIdx];

      this.grid[srcIdx] = ELEMENT_IDS.EMPTY;
      this.life[srcIdx] = 0;

      this.updated[targetIdx] = 1;
      return true;
    }

    return false;
  }

  // --- Rendering Loop ---

  render() {
    if (!this.pixelBuffer32) return;

    const buf = this.pixelBuffer32;
    const len = this.size;

    for (let i = 0; i < len; i++) {
      const id = this.grid[i];
      const color = getElementColor(id, i);

      // Convert [r, g, b, a] array to 32-bit LE ABGR integer for fast canvas write
      buf[i] =
        (color[3] << 24) |
        (color[2] << 16) |
        (color[1] << 8) |
        color[0];
    }

    this.ctx.putImageData(this.imgData, 0, 0);
  }
}
