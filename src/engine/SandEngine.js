// Sand-DOS v3.1 Comprehensive Sandbox Engine: Electricity, Thermal Diffusion, Undo/Redo & Physics
import { ELEMENT_IDS, ELEMENTS, getElementColor } from './elements';

export class SandEngine {
  constructor(width = 280, height = 180) {
    this.width = width;
    this.height = height;
    this.size = width * height;

    // Primary grid buffers
    this.grid = new Uint8Array(this.size);
    this.life = new Uint8Array(this.size);
    this.temp = new Int16Array(this.size); // Temperature in °C per cell
    this.charge = new Uint8Array(this.size); // Electrical charge level (0-10)
    this.clonedType = new Uint8Array(this.size);
    this.updated = new Uint8Array(this.size);

    // Canvas & rendering
    this.canvas = null;
    this.ctx = null;
    this.imgData = null;
    this.pixelBuffer32 = null;

    // Simulation state & options
    this.tickCount = 0;
    this.gravity = { x: 0, y: 1 };
    this.wind = 0;
    this.particleCount = 0;
    this.audioCallback = null;
    this.shakeAmount = 0;
    this.showHeatMap = false; // Toggle thermal view mode (F5)

    // Undo / Redo History Stacks
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 12;

    this.initGrid();
  }

  initGrid() {
    this.grid.fill(ELEMENT_IDS.EMPTY);
    this.life.fill(0);
    this.temp.fill(20); // Room temp 20°C
    this.charge.fill(0);
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

  // --- Undo & Redo System ---
  pushUndoState() {
    if (this.undoStack.length >= this.maxHistory) {
      this.undoStack.shift();
    }
    this.undoStack.push({
      grid: new Uint8Array(this.grid),
      life: new Uint8Array(this.life),
      temp: new Int16Array(this.temp),
    });
    this.redoStack = []; // Clear redo stack on new edit action
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    const currentState = {
      grid: new Uint8Array(this.grid),
      life: new Uint8Array(this.life),
      temp: new Int16Array(this.temp),
    };
    this.redoStack.push(currentState);

    const previousState = this.undoStack.pop();
    this.grid.set(previousState.grid);
    this.life.set(previousState.life);
    this.temp.set(previousState.temp);
    this.render();
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const currentState = {
      grid: new Uint8Array(this.grid),
      life: new Uint8Array(this.life),
      temp: new Int16Array(this.temp),
    };
    this.undoStack.push(currentState);

    const nextState = this.redoStack.pop();
    this.grid.set(nextState.grid);
    this.life.set(nextState.life);
    this.temp.set(nextState.temp);
    this.render();
    return true;
  }

  getIndex(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  get(x, y) {
    const idx = this.getIndex(x, y);
    if (idx === -1) return ELEMENT_IDS.STONE;
    return this.grid[idx];
  }

  set(x, y, id, lifeVal = 0, defaultTemp = null) {
    const idx = this.getIndex(x, y);
    if (idx === -1) return;
    this.grid[idx] = id;
    this.life[idx] = lifeVal;

    const elemDef = ELEMENTS[id];
    this.temp[idx] = defaultTemp !== null ? defaultTemp : (elemDef?.temp ?? 20);
    this.charge[idx] = 0;
  }

  clear() {
    this.pushUndoState();
    this.initGrid();
    this.render();
  }

  // --- Smooth Symmetrical Brush Paint ---
  drawBrush(centerX, centerY, elementId, size = 5, shape = 'circle', replaceTarget = null) {
    const radius = size / 2;
    const rSq = radius * radius;
    const rInt = Math.ceil(radius);
    let painted = 0;

    for (let dy = -rInt; dy <= rInt; dy++) {
      for (let dx = -rInt; dx <= rInt; dx++) {
        const x = Math.floor(centerX + dx);
        const y = Math.floor(centerY + dy);

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;

        if (shape === 'circle') {
          const distSq = (dx + 0.2) * (dx + 0.2) + (dy + 0.2) * (dy + 0.2);
          if (distSq > rSq + 0.3) continue;
        }

        if (shape === 'spray' && Math.random() > 0.35) {
          continue;
        }

        const currentElem = this.get(x, y);

        // Replace Paint Mode: only paint over specific target element
        if (replaceTarget !== null && currentElem !== replaceTarget) {
          continue;
        }

        if (elementId === ELEMENT_IDS.EMPTY) {
          this.set(x, y, ELEMENT_IDS.EMPTY, 0);
          painted++;
          continue;
        }

        if (
          currentElem === ELEMENT_IDS.EMPTY ||
          ELEMENTS[elementId]?.type === 'solid' ||
          currentElem !== elementId ||
          replaceTarget !== null
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
      } else if (elementId === ELEMENT_IDS.GUNPOWDER || elementId === ELEMENT_IDS.C4 || elementId === ELEMENT_IDS.TNT) {
        this.audioCallback('click');
      } else {
        this.audioCallback('pour');
      }
    }
  }

  // --- Main Engine Simulation Loop ---
  step() {
    this.tickCount++;
    this.updated.fill(0);
    let count = 0;
    const isEvenTick = this.tickCount % 2 === 0;

    // 1. Electrical Current Propagation Pass
    this.updateElectricalGrid();

    // 2. Thermal Diffusion Pass
    this.updateThermalGrid();

    const gravY = this.gravity.y;
    const yStart = gravY >= 0 ? this.height - 1 : 0;
    const yEnd = gravY >= 0 ? -1 : this.height;
    const yStep = gravY >= 0 ? -1 : 1;

    for (let y = yStart; y !== yEnd; y += yStep) {
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

        switch (elemDef.type) {
          case 'powder':
            this.updatePowder(x, y, idx, id);
            break;
          case 'liquid':
            this.updateLiquid(x, y, idx, id, elemDef.dispersion || 4);
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

  // --- Electricity & Conductor Physics ---
  updateElectricalGrid() {
    // Decay charge levels each tick
    for (let i = 0; i < this.size; i++) {
      if (this.charge[i] > 0) this.charge[i]--;
    }

    // Battery generator outputs continuous current
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const id = this.grid[idx];

        if (id === ELEMENT_IDS.BATTERY || id === ELEMENT_IDS.SWITCH_ON) {
          this.charge[idx] = 10;
        }

        // Conductive charge propagation to adjacent neighbors
        if (this.charge[idx] > 1) {
          const neighbors = [
            [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
          ];
          for (const [nx, ny] of neighbors) {
            const nIdx = this.getIndex(nx, ny);
            if (nIdx !== -1) {
              const targetId = this.grid[nIdx];
              const targetDef = ELEMENTS[targetId];

              if (targetDef && targetDef.conductive && this.charge[nIdx] < this.charge[idx] - 1) {
                this.charge[nIdx] = this.charge[idx] - 1;
              }
            }
          }
        }
      }
    }
  }

  // --- Thermal Diffusion & State Transformations ---
  updateThermalGrid() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const id = this.grid[idx];
        const currentTemp = this.temp[idx];

        // Component thermal outputs
        if (id === ELEMENT_IDS.HEATER && this.charge[idx] > 0) {
          this.temp[idx] = 500;
        } else if (id === ELEMENT_IDS.COOLER && this.charge[idx] > 0) {
          this.temp[idx] = -50;
        }

        // State Transformations Based on Temperature Thresholds
        if (id === ELEMENT_IDS.WATER) {
          if (currentTemp <= 0) this.set(x, y, ELEMENT_IDS.ICE, 0, currentTemp);
          else if (currentTemp >= 100) this.set(x, y, ELEMENT_IDS.STEAM, 60, currentTemp);
        } else if (id === ELEMENT_IDS.ICE) {
          if (currentTemp > 0) this.set(x, y, ELEMENT_IDS.WATER, 0, currentTemp);
        } else if (id === ELEMENT_IDS.SAND && currentTemp >= 1400) {
          this.set(x, y, ELEMENT_IDS.GLASS, 0, currentTemp);
        } else if (id === ELEMENT_IDS.STONE && currentTemp >= 1100) {
          this.set(x, y, ELEMENT_IDS.LAVA, 0, currentTemp);
        } else if (id === ELEMENT_IDS.LAVA && currentTemp <= 700) {
          this.set(x, y, ELEMENT_IDS.STONE, 0, currentTemp);
        } else if (id === ELEMENT_IDS.MUD && currentTemp >= 120) {
          this.set(x, y, ELEMENT_IDS.STONE, 0, currentTemp);
        } else if (id === ELEMENT_IDS.PLANT && currentTemp >= 250) {
          this.set(x, y, ELEMENT_IDS.FIRE, 20, currentTemp);
        } else if (id === ELEMENT_IDS.CEMENT) {
          this.life[idx]++;
          if (this.life[idx] > 120) this.set(x, y, ELEMENT_IDS.CONCRETE, 0, currentTemp);
        }
      }
    }
  }

  // --- Element Movements ---

  updatePowder(x, y, idx, id) {
    const gy = this.gravity.y;
    const targetY = y + gy;
    const targetX = x + this.wind;

    if (this.tryMove(x, y, targetX, targetY, id)) return;

    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    const belowId = this.get(x, targetY);
    const belowDef = ELEMENTS[belowId];
    if (belowDef && belowDef.type === 'liquid' && belowDef.density < ELEMENTS[id].density) {
      this.swap(x, y, x, targetY);
      return;
    }

    if (id === ELEMENT_IDS.MITE) {
      this.runMite(x, y);
    } else if (id === ELEMENT_IDS.ANTIMATTER) {
      this.runAntimatter(x, y);
    } else if (id === ELEMENT_IDS.SALT) {
      this.runSalt(x, y);
    }
  }

  updateLiquid(x, y, idx, id, dispersion) {
    const gy = this.gravity.y;
    const targetY = y + gy;

    if (this.tryMove(x, y, x, targetY, id)) return;

    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    for (let i = dispersion; i >= 1; i--) {
      const spreadDir = Math.random() < 0.5 ? i : -i;
      if (this.tryMove(x, y, x + spreadDir, y, id)) return;
      if (this.tryMove(x, y, x - spreadDir, y, id)) return;
    }

    const belowId = this.get(x, targetY);
    const belowDef = ELEMENTS[belowId];
    if (belowDef && belowDef.type === 'liquid' && belowDef.density < ELEMENTS[id].density) {
      this.swap(x, y, x, targetY);
      return;
    }

    if (id === ELEMENT_IDS.ACID) {
      this.reactAcid(x, y);
    } else if (id === ELEMENT_IDS.LAVA) {
      this.reactLava(x, y);
    } else if (id === ELEMENT_IDS.LIQUID_WAX) {
      if (this.temp[idx] < 40) this.set(x, y, ELEMENT_IDS.WAX, 0);
    }
  }

  updateGas(x, y, idx, id) {
    if (this.life[idx] > 0) {
      this.life[idx]--;
      if (this.life[idx] === 0) {
        if (id === ELEMENT_IDS.FIRE) {
          const newId = Math.random() < 0.5 ? ELEMENT_IDS.SMOKE : ELEMENT_IDS.EMPTY;
          this.set(x, y, newId, newId === ELEMENT_IDS.SMOKE ? 40 : 0);
        } else if (id === ELEMENT_IDS.STEAM) {
          const newId = Math.random() < 0.2 ? ELEMENT_IDS.WATER : ELEMENT_IDS.EMPTY;
          this.set(x, y, newId, 0);
        } else {
          this.set(x, y, ELEMENT_IDS.EMPTY, 0);
        }
        return;
      }
    }

    const gy = -this.gravity.y;
    const targetY = y + gy;
    const windShift = this.wind + (Math.random() < 0.4 ? (Math.random() < 0.5 ? 1 : -1) : 0);

    if (this.tryMove(x, y, x + windShift, targetY, id)) return;

    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.tryMove(x, y, x + dir, targetY, id)) return;
    if (this.tryMove(x, y, x - dir, targetY, id)) return;

    if (id === ELEMENT_IDS.FIRE || id === ELEMENT_IDS.SPARK) {
      this.reactFire(x, y);
    } else if (id === ELEMENT_IDS.GAS_FUEL) {
      this.reactGasFuel(x, y);
    }
  }

  updateSolid(x, y, idx, id) {
    if (id === ELEMENT_IDS.SPOUT_SAND) this.runSpout(x, y, ELEMENT_IDS.SAND);
    else if (id === ELEMENT_IDS.SPOUT_WATER) this.runSpout(x, y, ELEMENT_IDS.WATER);
    else if (id === ELEMENT_IDS.SPOUT_OIL) this.runSpout(x, y, ELEMENT_IDS.OIL);
    else if (id === ELEMENT_IDS.SPOUT_LAVA) this.runSpout(x, y, ELEMENT_IDS.LAVA);
    else if (id === ELEMENT_IDS.SPOUT_ACID) this.runSpout(x, y, ELEMENT_IDS.ACID);
    else if (id === ELEMENT_IDS.CLONER) this.runCloner(x, y, idx);
    else if (id === ELEMENT_IDS.VOID) this.runVoid(x, y);
    else if (id === ELEMENT_IDS.PLANT) this.runPlant(x, y);
    else if (id === ELEMENT_IDS.ICE) this.runIce(x, y);
    else if (id === ELEMENT_IDS.LASER) this.runLaser(x, y);
    else if (id === ELEMENT_IDS.PORTAL_A) this.runPortal(x, y, ELEMENT_IDS.PORTAL_B);
    else if (id === ELEMENT_IDS.TNT) this.runTNT(x, y, idx);
    else if (id === ELEMENT_IDS.IRON) this.runIron(x, y);
    else if (id === ELEMENT_IDS.FUNGUS) this.runFungus(x, y);
  }

  // --- Specialized Automata Rules ---

  runAntimatter(x, y) {
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId !== ELEMENT_IDS.EMPTY && targetId !== ELEMENT_IDS.ANTIMATTER) {
        this.set(nx, ny, ELEMENT_IDS.SPARK_ELEC, 3);
        this.set(x, y, ELEMENT_IDS.EMPTY, 0);
        if (this.audioCallback) this.audioCallback('bigExplosion');
        return;
      }
    }
  }

  runSalt(x, y) {
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (this.get(nx, ny) === ELEMENT_IDS.WATER) {
        this.set(nx, ny, ELEMENT_IDS.SALTWATER, 0);
        this.set(x, y, ELEMENT_IDS.EMPTY, 0);
        return;
      }
    }
  }

  runIron(x, y) {
    // Iron rusts when exposed to Water & Acid
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId === ELEMENT_IDS.WATER || targetId === ELEMENT_IDS.ACID || targetId === ELEMENT_IDS.SALTWATER) {
        if (Math.random() < 0.02) {
          this.set(x, y, ELEMENT_IDS.RUST, 0);
          return;
        }
      }
    }
  }

  runFungus(x, y) {
    // Spreads across Plant / Wood / Wax
    if (Math.random() < 0.08) {
      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
      ];
      for (const [nx, ny] of neighbors) {
        const targetId = this.get(nx, ny);
        if (targetId === ELEMENT_IDS.PLANT || targetId === ELEMENT_IDS.WAX) {
          this.set(nx, ny, ELEMENT_IDS.FUNGUS, 0);
          break;
        }
      }
    }
  }

  runLaser(x, y) {
    let lx = x;
    let ly = y + 1;
    let range = 35;

    while (range > 0 && ly < this.height) {
      const targetId = this.get(lx, ly);

      if (targetId === ELEMENT_IDS.EMPTY) {
        if (Math.random() < 0.7) {
          this.set(lx, ly, ELEMENT_IDS.SPARK, 2);
        }
      } else if (targetId === ELEMENT_IDS.WATER || targetId === ELEMENT_IDS.ICE) {
        this.set(lx, ly, ELEMENT_IDS.STEAM, 50);
        break;
      } else if (targetId === ELEMENT_IDS.OIL || targetId === ELEMENT_IDS.PLANT || targetId === ELEMENT_IDS.GAS_FUEL) {
        this.set(lx, ly, ELEMENT_IDS.FIRE, 20);
        break;
      } else if (targetId === ELEMENT_IDS.GUNPOWDER || targetId === ELEMENT_IDS.TNT || targetId === ELEMENT_IDS.C4) {
        this.triggerExplosion(lx, ly, targetId === ELEMENT_IDS.C4 ? 25 : 12, targetId);
        break;
      } else if (targetId === ELEMENT_IDS.WAX) {
        this.set(lx, ly, ELEMENT_IDS.LIQUID_WAX, 0);
      } else if (targetId === ELEMENT_IDS.STONE || targetId === ELEMENT_IDS.GLASS) {
        break;
      }

      ly++;
      range--;
    }
  }

  runPortal(x, y, targetPortalId) {
    let exitX = -1;
    let exitY = -1;

    for (let py = 0; py < this.height; py++) {
      for (let px = 0; px < this.width; px++) {
        if (this.get(px, py) === targetPortalId) {
          exitX = px;
          exitY = py + 1;
          break;
        }
      }
      if (exitX !== -1) break;
    }

    if (exitX === -1) return;

    const topId = this.get(x, y - 1);
    if (
      topId !== ELEMENT_IDS.EMPTY &&
      topId !== ELEMENT_IDS.PORTAL_A &&
      topId !== ELEMENT_IDS.PORTAL_B
    ) {
      if (this.get(exitX, exitY) === ELEMENT_IDS.EMPTY) {
        this.set(exitX, exitY, topId);
        this.set(x, y - 1, ELEMENT_IDS.EMPTY);
        if (this.audioCallback) this.audioCallback('click');
      }
    }
  }

  runMite(x, y) {
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId === ELEMENT_IDS.PLANT || targetId === ELEMENT_IDS.FUNGUS) {
        this.set(nx, ny, ELEMENT_IDS.MITE, 0);
        if (this.audioCallback && Math.random() < 0.1) this.audioCallback('click');
        return;
      } else if (targetId === ELEMENT_IDS.FIRE || targetId === ELEMENT_IDS.ACID || targetId === ELEMENT_IDS.LAVA) {
        this.set(x, y, ELEMENT_IDS.SMOKE, 10);
        return;
      }
    }
  }

  runTNT(x, y, idx) {
    if (this.life[idx] > 0) {
      this.life[idx]--;
      this.set(x, y - 1, ELEMENT_IDS.SPARK, 3);
      if (this.life[idx] === 0) {
        this.triggerExplosion(x, y, 16, 'tnt');
      }
    }
  }

  runSpout(x, y, spawnId) {
    const targetY = y + this.gravity.y;
    if (this.get(x, targetY) === ELEMENT_IDS.EMPTY) {
      this.set(x, targetY, spawnId);
    }
  }

  runCloner(x, y, idx) {
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
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
    ];

    for (const [nx, ny] of neighbors) {
      if (this.get(nx, ny) === ELEMENT_IDS.WATER) {
        this.set(nx, ny, ELEMENT_IDS.EMPTY, 0);
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

  reactFire(x, y) {
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
      [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId === ELEMENT_IDS.EMPTY) continue;

      if (targetId === ELEMENT_IDS.WATER) {
        this.set(x, y, ELEMENT_IDS.STEAM, 50);
        return;
      }

      if (targetId === ELEMENT_IDS.OIL || targetId === ELEMENT_IDS.PLANT || targetId === ELEMENT_IDS.GAS_FUEL) {
        this.set(nx, ny, ELEMENT_IDS.FIRE, 22);
      } else if (targetId === ELEMENT_IDS.GUNPOWDER) {
        this.triggerExplosion(nx, ny, 10, 'gunpowder');
      } else if (targetId === ELEMENT_IDS.TNT) {
        const tntIdx = ny * this.width + nx;
        if (this.life[tntIdx] === 0) this.life[tntIdx] = 12;
      } else if (targetId === ELEMENT_IDS.C4) {
        this.triggerExplosion(nx, ny, 25, 'c4');
      } else if (targetId === ELEMENT_IDS.ICE) {
        this.set(nx, ny, ELEMENT_IDS.WATER, 0);
      } else if (targetId === ELEMENT_IDS.WAX) {
        this.set(nx, ny, ELEMENT_IDS.LIQUID_WAX, 0);
      }
    }
  }

  reactGasFuel(x, y) {
    const neighbors = [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
    ];
    for (const [nx, ny] of neighbors) {
      const targetId = this.get(nx, ny);
      if (targetId === ELEMENT_IDS.FIRE || targetId === ELEMENT_IDS.SPARK || targetId === ELEMENT_IDS.LAVA) {
        this.triggerExplosion(x, y, 14, 'gas');
        return;
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
        targetId !== ELEMENT_IDS.GLASS &&
        targetId !== ELEMENT_IDS.CONCRETE
      ) {
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
        this.set(x, y, ELEMENT_IDS.STONE, 0);
        this.set(nx, ny, ELEMENT_IDS.STEAM, 60);
        if (this.audioCallback) this.audioCallback('sizzle');
        return;
      } else if (targetId === ELEMENT_IDS.OIL || targetId === ELEMENT_IDS.PLANT || targetId === ELEMENT_IDS.GAS_FUEL) {
        this.set(nx, ny, ELEMENT_IDS.FIRE, 25);
      } else if (targetId === ELEMENT_IDS.GUNPOWDER || targetId === ELEMENT_IDS.C4 || targetId === ELEMENT_IDS.TNT) {
        this.triggerExplosion(nx, ny, targetId === ELEMENT_IDS.C4 ? 26 : 14, targetId);
      } else if (targetId === ELEMENT_IDS.WAX) {
        this.set(nx, ny, ELEMENT_IDS.LIQUID_WAX, 0);
      }
    }
  }

  triggerExplosion(cx, cy, radius, type = 'gunpowder') {
    if (this.audioCallback) {
      this.audioCallback(type === 'c4' ? 'bigExplosion' : 'explosion');
    }

    this.shakeAmount = type === 'c4' ? 12 : 5;
    const rSq = radius * radius;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = cx + dx;
        const y = cy + dy;

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
        const distSq = dx * dx + dy * dy;

        if (distSq <= rSq) {
          const currentId = this.get(x, y);
          if (currentId === ELEMENT_IDS.VOID || currentId === ELEMENT_IDS.CONCRETE) continue;

          if (currentId === ELEMENT_IDS.GLASS && distSq <= rSq * 0.7) {
            this.set(x, y, ELEMENT_IDS.SAND, 0);
            continue;
          }

          if (distSq <= rSq * 0.45) {
            this.set(x, y, Math.random() < 0.4 ? ELEMENT_IDS.SPARK : ELEMENT_IDS.FIRE, 15);
          } else if (distSq <= rSq * 0.85) {
            this.set(x, y, Math.random() < 0.6 ? ELEMENT_IDS.FIRE : ELEMENT_IDS.SMOKE, 35);
          } else {
            if (Math.random() < 0.5) {
              this.set(x, y, ELEMENT_IDS.SMOKE, 30);
            }
          }
        }
      }
    }
  }

  swap(x1, y1, x2, y2) {
    const idx1 = y1 * this.width + x1;
    const idx2 = y2 * this.width + x2;

    const id1 = this.grid[idx1];
    const life1 = this.life[idx1];
    const temp1 = this.temp[idx1];

    this.grid[idx1] = this.grid[idx2];
    this.life[idx1] = this.life[idx2];
    this.temp[idx1] = this.temp[idx2];

    this.grid[idx2] = id1;
    this.life[idx2] = life1;
    this.temp[idx2] = temp1;

    this.updated[idx2] = 1;
  }

  tryMove(x1, y1, x2, y2, id) {
    if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) return false;

    const targetIdx = y2 * this.width + x2;
    if (this.grid[targetIdx] === ELEMENT_IDS.EMPTY) {
      const srcIdx = y1 * this.width + x1;

      this.grid[targetIdx] = id;
      this.life[targetIdx] = this.life[srcIdx];
      this.temp[targetIdx] = this.temp[srcIdx];

      this.grid[srcIdx] = ELEMENT_IDS.EMPTY;
      this.life[srcIdx] = 0;
      this.temp[srcIdx] = 20;

      this.updated[targetIdx] = 1;
      return true;
    }

    return false;
  }

  // --- Rendering Loop (Supports Heat Map View Mode) ---
  render() {
    if (!this.pixelBuffer32) return;

    const buf = this.pixelBuffer32;
    const len = this.size;

    for (let i = 0; i < len; i++) {
      const id = this.grid[i];

      // Thermal Heat Map Mode (F5)
      if (this.showHeatMap && id !== ELEMENT_IDS.EMPTY) {
        const temperature = this.temp[i];
        // Blue (cold) -> Green (room) -> Red (hot) -> Yellow (extreme)
        let r = 0, g = 0, b = 0;
        if (temperature < 0) {
          b = Math.min(255, 150 + Math.abs(temperature) * 2);
        } else if (temperature < 100) {
          g = Math.min(255, 100 + temperature * 1.5);
          b = Math.max(0, 100 - temperature);
        } else {
          r = Math.min(255, 150 + (temperature - 100) * 0.2);
          g = Math.min(255, (temperature - 100) * 0.1);
        }
        buf[i] = (255 << 24) | (b << 16) | (g << 8) | r;
        continue;
      }

      const color = getElementColor(id, i);

      // Flash active electric charge in bright yellow
      if (this.charge[i] > 0) {
        buf[i] = (255 << 24) | (100 << 16) | (255 << 8) | 255;
      } else {
        buf[i] =
          (color[3] << 24) |
          (color[2] << 16) |
          (color[1] << 8) |
          color[0];
      }
    }

    // Bloom Pass
    if (!this.showHeatMap) {
      for (let y = 1; y < this.height - 1; y++) {
        for (let x = 1; x < this.width - 1; x++) {
          const idx = y * this.width + x;
          const id = this.grid[idx];
          const elemDef = ELEMENTS[id];

          if (elemDef && elemDef.glow) {
            const glowColor = elemDef.color;
            const neighbors = [
              idx - 1, idx + 1, idx - this.width, idx + this.width,
            ];

            for (const nIdx of neighbors) {
              if (this.grid[nIdx] === ELEMENT_IDS.EMPTY) {
                buf[nIdx] =
                  (90 << 24) |
                  (Math.floor(glowColor[2] * 0.7) << 16) |
                  (Math.floor(glowColor[1] * 0.7) << 8) |
                  Math.floor(glowColor[0] * 0.7);
              }
            }
          }
        }
      }
    }

    this.ctx.putImageData(this.imgData, 0, 0);
  }
}
