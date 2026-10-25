# Figure authoring guide

Each exercise gets a `Figure` (see `src/figure/types.ts`): equipment, hand-held load, a **start** frame and an **end** frame of joint coordinates, optional **mistake** frame. The renderer (`src/figure/render.ts`) draws a solid outlined body, the equipment symbols, the load, a cable, and annotations. Review your work visually, every single figure, with the contact sheet:

```bash
node scripts/figures-sheet.ts scripts/out/<group>.png id-one id-two ...
```
Then open the PNG with the Read tool. Cells honour `zoom`, as the app does. Iterate until every figure passes the checklist. Never submit an unreviewed figure.

## Coordinate space
- 240 × 240, origin top-left, y grows downward. Floor line is y = 210 (always include `{ id: 'floor' }` for standing/seated/floor exercises).
- Side view: the person faces **+x (right)**. For a lying person set `face: 'up'` (nose points to the top of the picture) and lay the body along x (head left, feet right). `face: 'down'` for prone (chest-down). Use `flip: true` on the figure if the whole scene must mirror.
- Front/back view (`view: 'front'`): `FrontJoints` with L/R sides; `back: true` on the joints to show the back of the body (spine dashed, no eyes). The torso may lie at any angle: hips and eyes are placed across the neck→hip axis, so a side plank is drawn as a front view with the head at the left. Eyes are hidden when the head hangs below the neck (bent over, looking at the floor).
- `headTilt` (side view, degrees): positive lifts the chin, negative tucks it or nods down. It interpolates like a joint, so use it for neck drills (chin tuck: forward head with the chin up → head back with a slight tuck; mistake: nodding down).

Floor exercises: add `zoom: [0, 90, 240, 150]` (x y w h) on the figure so the lying body fills the frame.

## Body proportions (keep lengths consistent in start/end/mistake, ±3)
| Segment | Length |
|---|---|
| head center above neck | 14 |
| neck → shoulder | 12 |
| shoulder → hip (torso) | 46 |
| shoulder → elbow | 28 |
| elbow → wrist | 26 |
| hip → knee | 36 |
| knee → ankle | 36 |
| ankle → toe (foot, points forward) | 16 |
| front view: shoulder width 40 (L/R ±20 from neck), hip width 18 | |

- `spine`: optional quadratic control point between shoulder and hip. Omit for a neutral spine. Put it a few px *toward the back* for the correct tall-chest posture on presses/rows; put it toward the front (rounded) only in a `mistake` frame.
- Second arm/leg (`elbow2/wrist2`, `knee2/ankle2/toe2`) are drawn dimmer *behind*. Use them for split stance, step-ups, one-arm rows (the supporting arm is the back one), bird dog.
- The person must physically touch the equipment: back on the pad, feet on the plate, hands on the handle/bar at the position the equipment doc gives.

## Equipment symbols (`equipment: [{ id, x?, y?, s?, flip?, a? }]`)
Contact points below are what you place joints against. `x/y` translate, `s` scales, `flip` mirrors around x=0 of the symbol (then shift with x), `a` rotates. This list is the `doc` string of each symbol in `equipment.ts`; keep them in sync.
- **floor**: floor line y=210
- **wall**: vertical wall at x=70 (person stands with back on it, facing +x)
- **doorFrame**: door frame post at x=150 (forearm rests on it, elbow y≈100); person stands at x≈110 facing +x
- **chair**: chair seat top y=150 x 86..126; back pad top at (82,105)
- **box**: step/box top y=170 x 120..190
- **benchFlat**: flat bench top y=150, x 40..200; person lies with head at left (x≈60), hips x≈130, feet on floor at x≈190
- **benchIncline**: incline bench: seat top y=150 x 120..160; back pad from (120,150) rising to (70,95) (≈45°); head rests near (75,100); feet on floor x≈180
- **seat**: upright seat top y=150 x 88..132, back pad x≈86..94 from y=90 to 150 (slight recline); feet on floor x≈130
- **chestPress**: chest press: seat top y=150 x 88..132; back pad x 84..94 (y 88..150); machine beam at y=52 from the lever pivot (150,56) to the column at x=200; weight stack at x 206..224. Add `lever: [{ pivot: [150, 56], to: 'wrist' }]` so the handle arm follows the hand
- **inclinePress**: incline press machine: seat top y=150 x 100..140; back pad reclined 30° from (96,150) up to (74,92); beam at y=50 from the lever pivot (168,54) to the column at x=200; stack at x 206..224. Add `lever: [{ pivot: [168, 54], to: 'wrist' }]`
- **shoulderPress**: shoulder press machine: seat top y=150 x 88..132; back pad x 84..94 y 85..150; support arm from the lever pivot (166,112) to the column at x=200; stack x 206..224. Add `lever: [{ pivot: [166, 112], to: 'wrist' }]`: the handle arm swings from shoulder height to overhead
- **latPulldown**: lat pulldown: seat top y=150 x 96..136; knee pad at (140,134) over the thighs; high pulley at (150,22); the bar is drawn at the hands (use load ezBar); start hands up near (140,52) → pulled to the upper chest end; column at x=190
- **cableHigh**: cable column at x=200 with pulley at (200,40); cable runs from pulley to the hand
- **cableMid**: cable column at x=200 with pulley at chest height (200,105)
- **cableFace**: cable column at x=200 with pulley at face height (200,80)
- **cableLow**: cable column at x=200 with low pulley at (200,195)
- **rowStation**: seated cable row: seat top y=150 x 70..110 (person sits facing +x), foot plate at x=150 (angled), low pulley at (200,130)
- **chestSupportRow**: chest-supported row: incline chest pad from (110,150) rising to (80,96) (person lies chest-down on it facing +x, head near (76,92)); seat/foot step at y=170 x 120..160; handles hang below pad at (118,150) start → (104,118) end
- **rearDeltMachine**: rear delt (reverse pec deck): seat top y=150 x 88..132; chest pad x 128..138 y 92..150 (person faces +x, chest on pad); handle arms pivot at (150,70), handles start in front at (160,105) → end out to the side (hidden)
- **legPress**: 45° leg press frame: seat pad from (50,165) rising slightly to the right (hips sit at ≈(74,152)); back pad from (64,160) up-left to ≈(24,100) at 56° (person leans back on it: shoulder ≈(50,116), head ≈(34,96)); two rails along x+y=280 and x+y=296 (45° up-right). Add `{ id: 'legPressSled', attach: 'ankle', a: 45 }` so the foot plate rides on the feet
- **legPressSled**: leg press foot plate and sled; attach to the ankle with a=45 (feet flat on the plate, toes pointing up the plate toward the upper left; legs push along the 45° line). The plate surface sits on the sole; the sled reaches back to the legPress rails
- **kneePad**: moving knee pad on a rod (assisted pull-up); attach to the knee with y≈6 so the shin rests on the pad top
- **wallBack**: front view: wall panel behind the person, x 56..184, y 18..210 (back, head and arms rest on it)
- **benchEnd**: front view: flat bench seen from its end, pad top y=150 x 98..142 (hips sit on it)
- **rearDeltFront**: front view of the reverse pec deck (person faces the viewer, chest pad hidden in front of the chest): seat pad top y=150 x 96..144, column behind the person at x=120 with the arm pivot at (120,34), stack x 206..224. Use `load: handle` at wristL / wristR
- **legExtension**: leg extension: seat top y=150 x 86..130 (person sits facing +x), back pad x 82..92 y 95..150; shin pad start hanging below knee at (140,195) → end extended at (184,150)
- **legCurlSeated**: seated leg curl: seat top y=150 x 86..130, back pad x 82..92 y 95..150; thigh lock pad on top of the thighs at (118,134); ankle pad start extended at (184,150) → end curled under at (130,190)
- **legCurlLying**: lying leg curl: bench top y=150 x 40..200, person lies face-down with head at left (x≈60), hips x≈130; ankle pad start at (195,150) → end curled up at (150,100)
- **hackSquat**: hack squat: back pad angled 60° from (126,190) up-left to (74,100) (person leans back on it, faces +x; back 9px in front of that line); foot plate from (150,200) up-right to (210,165) (angled 30°, perpendicular to the pad; feet rest 4px above that line); standing start (hips ≈(109,142), feet ≈(162,188)) → squat end (body slides down the pad, hips ≈(124,168))
- **calfStanding**: standing calf machine: shoulder pads at y≈75 (x 100..140), step/block top y=200 x 136..186 (balls of the feet on its left edge at x≈136, toes on the block, heels hang free behind it; body centred under the pads at x≈125); frame post at x=70
- **calfSeated**: seated calf raise: seat top y=174 x 70..110 (hips ≈(90,168)); knee pad y 149..157 x 110..140 on the lower thighs (knees ≈(126,160)); foot block top y=200 x 140..172 (balls of the feet on its left edge x≈140, heels hang free)
- **smith**: Smith machine: two vertical rails at x=96 and x=144 (bar slides between), bar height set by the pose
- **pullupBar**: pull-up bar at y=30 from x 80..160 (hands grip at y=30)
- **assistedPullup**: assisted pull-up: bar at y=30 x 80..160; column and stack at x=200..224. Add `{ id: 'kneePad', attach: 'knee', y: 6 }`: the knee pad rises with the knees
- **backExtension**: 45° back extension (person faces +x, front of the body toward the lower right): hip pad surface on the line x+y=250 from (96,154) to its top end (122,128); body line on x+y=239 with the hips just past the pad end at (124,115) and the front of the thighs on the pad; ankles ≈(73,166) with the soles on the foot plate (line x−y=−100) and the calves under the roller at (70,152). Torso hangs from the hips at the start and lines up with the legs at the top
- **foamRoller**: foam roller on the floor, center (130,196) r=14 (lies under the upper back)

### Moving equipment
- `attach: '<joint>'` on an equipment entry pins the symbol's origin to that joint in every frame, so it moves with the body (`x/y` are then an offset from the joint). Use it for parts the body carries: the leg-press plate (`legPressSled`, attached to the ankle), the assisted pull-up knee pad (`kneePad`, attached to the knee). Attached symbols are redrawn every frame; everything else is drawn once per figure.
- `lever: [{ pivot, to, end?, off? }]` on the figure draws a rigid machine arm from a fixed `pivot` to a joint, behind the body. `end: 'handle'` (default) draws a grip under the hand; `'roller'` draws a foam pad (leg extension / curls, machine lateral raise), `off` moves the pad off the joint (e.g. in front of the shin). Use levers instead of a hand-held `handle` load on chest press, incline press and shoulder press machines.

## Loads (`load: [{ id, at: 'wrist' | 'wrist2' | 'wristL' | 'wristR' | 'both', a? }]`)
`dumbbell` (a = rotation; 0 = horizontal bar, 90 = vertical), `barbell` / `ezBar` / `plate` (drawn as a plate circle in side view), `handle` (D-handle), `ropeHandle`, `kettle`, `band` (line between the two hands; use `at: 'both'`).
Gripped loads are drawn under the closed hand so the fist shows the grip. `behind: true` draws the load behind the torso and head (a bar resting on the upper back, e.g. smith squat).
Cables: `cable: { from: [x,y] of the pulley, to: 'wrist' | 'wristL' | 'wristR' | 'both', behind? }` draws the cable from the pulley to the hand (`wristL`/`wristR` for one hand in a front view). `behind: true` runs it behind the body, for a column that stands beside the person in depth (Pallof press).

## Annotations (`note` on a frame)
- **End frame always has** `arrow` on the limb that moved (`from` a joint name or point, `dir` degrees: 0 = right, 90 = down, 180 = left, 270 = up, `len` 18–30) and `muscle` glow(s) on the working muscle (a joint name or an explicit point, e.g. chest = a point a little in front of the shoulder, lats = a point below/behind the shoulder, glutes = behind the hip, quads = mid thigh, hamstrings = behind mid thigh, calves = behind the shin, biceps = mid upper arm front, triceps = mid upper arm back, rear delts = behind the shoulder, upper back = between neck and mid torso).
- `spine: true` on every frame of presses, rows, pulldowns, hinges, squats, overhead work: draws the dashed neutral-spine guide.
- **Mistake frame**: for the 20 program exercises (chest-press-machine, incline-chest-press, lat-pulldown, chest-supported-row, seated-cable-row, shoulder-press-machine, lateral-raise, rear-delt-fly-machine, biceps-curl, rope-triceps-pushdown, overhead-triceps-extension, leg-press, seated-leg-curl, lying-leg-curl, leg-extension, db-rdl, barbell-rdl, calf-raise, dead-bug, plank) add `mistake` showing the main form fault from the guide's first `mistakes[]` entry (rounded spine, shoulders rolled forward, elbows flared, neck jutting, heels lifting…) with `note.mistake.at` on the faulty joint. Optional for the others.

## How the app plays a figure
`src/figure/motion.ts` holds the timing shared by the drawing and the photo cross-fade: hold the start pose 0.6 s, ease to the end pose in 1.2 s, hold 0.9 s, ease back. Arrows and muscle glow fade in over the last third of the move, so only put them on the `end` frame (plus `muscle` on `start` if the working muscle should glow at the stretch). Tapping Start / End / Mistake tweens to that pose in 0.45 s; Mistake also flashes red and shows a label. Frames must therefore interpolate cleanly: same joints in every frame (a `spine` missing in one frame is treated as straight).

## Checklist per figure (all must pass before you move on)
1. I can tell which machine/equipment it is without the label.
2. The person touches the equipment correctly (seat, pad, plate, bar, floor).
3. Start and end differ only by the moving joints; limb lengths are unchanged.
4. Start = lengthened/loaded position as the guide describes; end = contraction/peak.
5. Arrow on the moving limb; muscle glow on the right spot; spine guide where relevant.
6. Nothing overlaps badly (body through the frame, arrow over the head, stack through the body, load over the face).
8. The motion is readable: if the moving part is small (neck drills), crop with `zoom` (4:3 matches the app frame) so the change is visible.
7. Face points where the guide says (forward/neutral, not up).

## Reference
`src/data/figures/chest.ts` → `chest-press-machine` (lever) and `src/data/figures/legsQuads.ts` → `leg-press` (attached plate). Open `scripts/out/test.png` to see how they render.
