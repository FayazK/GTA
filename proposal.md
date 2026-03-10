### Phase 1: MVP – Barebones Drivable Car (Minimally Runnable Game)
**Goal:** Working PixiJS app + one car you can drive + smooth camera follow.  
**Playable after this phase:** Open `index.html` → black background + red pixel car. Arrow keys / WASD drive it (accelerate, brake, turn). Camera follows perfectly. Game loop runs at 60 FPS. This is already a fun little top-down racer.

**Exact prompt to copy-paste to Claude:**
```
You are an expert PixiJS v8 game developer. We are building a GTA 1 style top-down open-world game in a SINGLE index.html file using only CDN imports (no npm, no folders).

Here is the complete code from the previous phase (or empty if first):
[PASTE THE CODE YOU CURRENTLY HAVE]

Now implement PHASE 1: MVP - Barebones Drivable Car.

Requirements:
- Use PixiJS v8 from https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.mjs
- Create a full-screen canvas
- One red rectangular car sprite (anchor center)
- Keyboard input: Arrow keys OR WASD (accelerate, reverse, left/right turn)
- Simple arcade physics: velocity, friction, angular velocity
- Camera follows the car smoothly (worldContainer that moves opposite to car)
- 60 FPS ticker
- Keep everything clean, well-commented, and modular (variables at top, functions separated)
- Make the background a dark grid so we can see movement

Output ONLY the complete updated index.html file (nothing else).
```

### Phase 2: Procedural Tile City
**Goal:** Add a big scrolling city made of roads and buildings.  
**Playable after this phase:** Same driving as Phase 1 but now you drive through a real city block layout (roads + grey building blocks). Car drives freely over the whole map.

**Exact prompt to Claude:**
```
Here is the complete code from Phase 1:
[PASTE FULL CODE FROM PHASE 1]

Now implement PHASE 2: Procedural Tile City.

Add:
- A 100×100 tile map using a 2D array
- Two tile types: road (dark gray) and building (light gray rectangles)
- Create a simple procedural city layout (grid of blocks with roads in between – classic GTA 1 style)
- Use PIXI.Sprite for each tile (reuse textures with Texture.from() + Graphics to generate them at start)
- All tiles added to the worldContainer
- Camera still follows car perfectly over the huge map
- Performance: only render visible tiles (simple culling or just let Pixi handle for now)

Keep driving controls exactly the same. Output ONLY the complete updated index.html.
```

### Phase 3: Realistic Arcade Car Physics + Wall Collisions
**Goal:** Proper GTA 1 driving feel + you can’t drive through buildings.  
**Playable after this phase:** Car now has weight, drifting feel, and bounces/slides against buildings. Much more fun to drive.

**Exact prompt:**
```
Here is the complete code from Phase 2:
[PASTE FULL CODE FROM PHASE 2]

Now implement PHASE 3: Realistic Arcade Car Physics + Wall Collisions.

Improvements:
- Better vehicle physics (separate forward speed + drift, realistic turning radius)
- Simple AABB collision between car and building tiles
- When hitting a building: slide along wall + lose speed (classic GTA 1 feel)
- Add tire squeal visual (optional small particles when turning hard)
- Keep the same controls and camera

Output ONLY the complete updated index.html.
```

### Phase 4: Pedestrians & Simple AI
**Goal:** Add 30 walking civilians.  
**Playable after this phase:** City feels alive. Peds walk randomly, avoid the car a bit. You can run them over (they disappear with a simple “splat” for now).

**Exact prompt:**
```
Here is the complete code from Phase 3:
[PASTE FULL CODE FROM PHASE 3]

Now implement PHASE 4: Pedestrians & Simple AI.

Add:
- 30 pedestrian sprites (small blue circles or simple person texture made with Graphics)
- Each has simple wandering AI (random direction every 2-4 seconds)
- Basic avoidance of buildings
- Collision with car: pedestrian disappears + +10 score (temporary score variable)
- All peds added to worldContainer and updated in ticker

Driving and collisions stay exactly the same. Output ONLY the complete updated index.html.
```

### Phase 5: Shooting Mechanics
**Goal:** Spacebar shoots bullets.  
**Playable after this phase:** You can now shoot and destroy pedestrians (or any target). Classic GTA 1 top-down shooting.

**Exact prompt:**
```
Here is the complete code from Phase 4:
[PASTE FULL CODE FROM PHASE 4]

Now implement PHASE 5: Shooting Mechanics.

Add:
- Spacebar shoots bullets (yellow small sprites with velocity in car facing direction)
- Bullet pool (reuse 20 bullets)
- Bullets destroy pedestrians on hit
- Simple muzzle flash or sound placeholder (console.log for now)
- Cooldown so you can’t spam

Everything else remains. Output ONLY the complete updated index.html.
```

### Phase 6: Simple Missions + HUD
**Goal:** Actual gameplay loop.  
**Playable after this phase:** You get missions like “Drive to the yellow marker”. Complete missions to increase score. On-screen HUD shows money, wanted level (0 for now), and current mission.

**Exact prompt:**
```
Here is the complete code from Phase 5:
[PASTE FULL CODE FROM PHASE 5]

Now implement PHASE 6: Simple Missions + HUD.

Add:
- Simple mission system: “Reach the marker” (yellow circle on map)
- Random mission locations every time you finish one
- Score / Money counter
- On-screen HUD using PIXI.Text (top-left: Money, Mission text, Wanted level)
- When you reach marker → +500 money, new mission spawns
- Camera still follows car

Keep all previous features working. Output ONLY the complete updated index.html.
```

### Phase 7: Wanted Level + Police Chases (Final Core Loop)
**Goal:** The famous GTA wanted system.  
**Playable after this phase:** Run over too many peds → wanted level rises → police cars spawn and chase you. This feels like real GTA 1.

**Exact prompt:**
```
Here is the complete code from Phase 6:
[PASTE FULL CODE FROM PHASE 6]

Now implement PHASE 7: Wanted Level + Police Chases.

Add:
- Wanted level (0-3 stars)
- Every time you kill a pedestrian, wanted level increases slightly
- At wanted level 1+ → spawn 2-4 police cars (white rectangles) that chase the player using simple steering AI
- Police cars try to ram you
- If police touch you → game over screen (simple text + restart button)
- Wanted level slowly drops if you drive calmly for 10 seconds

All previous features stay. This completes the core GTA 1 loop.

Output ONLY the complete updated index.html.
```

### Phase 8 (Optional Polish – do this last)
Add sounds (Web Audio API beeps), minimap (small Graphics in corner), better sprites (you can replace the Graphics with base64 images later), save system (localStorage), etc.

