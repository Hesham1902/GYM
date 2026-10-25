# Figure authoring guide

Each exercise gets a `Figure` (see `src/figure/types.ts`): equipment, hand-held load, a **start** frame and an **end** frame of joint coordinates, optional **mistake** frame. The renderer (`src/figure/render.ts`) draws a solid outlined body, the equipment symbols, the load, a cable, and annotations. Review your work visually, every single figure, with the contact sheet:

```bash
node scripts/figures-sheet.ts scripts/out/<group>.png id-one id-two ...
```
Then open the PNG with the Read tool. Iterate until every figure passes the checklist. Never submit an unreviewed figure.

## Coordinate space
- 240 × 240, origin top-left, y grows downward. Floor line is y = 210 (always include `{ id: 'floor' }` for standing/seated/floor exercises).
- Side view: the person faces **+x (right)**. For a lying person "facing up", set `face: 'up'` and lay the body along x (head left, feet right). `face: 'down'` for prone (chest-down). Use `flip: true` on the figure if the whole scene must mirror.
- Front/back view (`view: 'front'`): `FrontJoints` with L/R sides; `back: true` on the joints to show the back of the body (spine dashed, no eyes).

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
Contact points below are what you place joints against. `x/y` translate, `s` scales, `flip` mirrors around x=0 of the symbol (then shift with x), `a` rotates.
- **floor**: floor line y=210
- **wall**: vertical wall at x=70 (person stands with back on it, facing +x)
- **doorFrame**: door frame post at x=150 (forearm rests on it, elbow y≈100); person stands at x≈110 facing +x
- **chair**: chair seat top y=150 x 86..126; back pad top at (82,105)
- **box**: step/box top y=170 x 120..190
- **benchFlat**: flat bench top y=150, x 40..200; person lies with head at left (x≈60), hips x≈130, feet on floor at x≈190
- **benchIncline**: incline bench: seat top y=150 x 120..160; back pad from (120,150) rising to (70,95) (≈45°); head rests near (75,100); feet on floor x≈180
- **seat**: upright seat top y=150 x 88..132, back pad x≈86..94 from y=90 to 150 (slight recline); feet on floor x≈130
- **chestPress**: chest press: seat top y=150 x 88..132; back pad x 84..94 (y 88..150); handle grip at (150,118) start → (190,118) end; weight stack at x 206..224
- **inclinePress**: incline press machine: seat top y=150 x 100..140; back pad reclined 30° from (96,150) up to (74,92); handle grip start (140,100) → end (172,72) (up-forward); stack at x 206..224
- **shoulderPress**: shoulder press machine: seat top y=150 x 88..132; back pad x 84..94 y 85..150; handles at shoulder height start (122,100) → overhead end (122,52); stack x 206..224
- **latPulldown**: lat pulldown: seat top y=150 x 96..136; knee pad at (140,122) over thighs; high pulley at (150,22); bar hangs at y≈50 start (hands at (150,50)) → pulled to chest y≈100 end; column at x=190
- **cableHigh**: cable column at x=200 with pulley at (200,40); cable runs from pulley to the hand
- **cableMid**: cable column at x=200 with pulley at chest height (200,105)
- **cableFace**: cable column at x=200 with pulley at face height (200,80)
- **cableLow**: cable column at x=200 with low pulley at (200,195)
- **rowStation**: seated cable row: seat top y=150 x 70..110 (person sits facing +x), foot plate at x=150 (angled), low pulley at (200,130)
- **chestSupportRow**: chest-supported row: incline chest pad from (110,150) rising to (80,96) (person lies chest-down on it facing +x, head near (76,92)); seat/foot step at y=170 x 120..160; handles hang below pad at (118,150) start → (104,118) end
- **rearDeltMachine**: rear delt (reverse pec deck): seat top y=150 x 88..132; chest pad x 128..138 y 92..150 (person faces +x, chest on pad); handle arms pivot at (150,70), handles start in front at (160,105) → end out to the side (hidden)
- **legPress**: 45° leg press sled: seat pad from (50,165) rising slightly to the right (hips sit at ≈(72,150)); back pad from (50,165) up-left to ≈(14,112) (person leans back on it, head near (18,100), faces up-right); foot plate perpendicular to the legs from (150,60) down-right to (214,124) (feet flat on it, start: knees bent ≈90°, end: legs nearly straight toward up-right); rails run parallel to the legs behind the plate
- **legExtension**: leg extension: seat top y=150 x 86..130 (person sits facing +x), back pad x 82..92 y 95..150; shin pad start hanging below knee at (140,195) → end extended at (184,150)
- **legCurlSeated**: seated leg curl: seat top y=150 x 86..130, back pad x 82..92 y 95..150; thigh lock pad at (118,124); ankle pad start extended at (184,150) → end curled under at (130,190)
- **legCurlLying**: lying leg curl: bench top y=150 x 40..200, person lies face-down with head at left (x≈60), hips x≈130; ankle pad start at (195,150) → end curled up at (150,100)
- **hackSquat**: hack squat: back pad angled 60° from (130,190) up-left to (80,100) (person leans back on it, faces +x), shoulder pads at top; foot plate from (150,200) to (210,165) (angled 30°); standing start (hips at ≈(118,120)) → squat end (hips lower-left ≈(100,150))
- **calfStanding**: standing calf machine: shoulder pads at y≈75 (x 100..140), step/block top y=200 x 100..150 (balls of feet on its edge at x≈150); frame post at x=70
- **calfSeated**: seated calf raise: seat top y=150 x 70..110; knee pad at (120,122) on thighs; foot block top y=200 x 120..150
- **smith**: Smith machine: two vertical rails at x=96 and x=144 (bar slides between), bar height set by the pose
- **pullupBar**: pull-up bar at y=30 from x 80..160 (hands grip at y=30)
- **assistedPullup**: assisted pull-up: bar at y=30 x 80..160; knee pad at y=150 x 100..140 (person kneels on it); stack at x=206
- **backExtension**: 45° back extension: hip pad top at (120,130) angled 45° (hips rest on it, person faces +x, feet lower-left locked at (70,185))
- **foamRoller**: foam roller on the floor, center (130,196) r=14 (lies under the upper back)

## Loads (`load: [{ id, at: 'wrist' | 'wrist2' | 'both', a? }]`)
`dumbbell` (a = rotation; 0 = horizontal bar, 90 = vertical), `barbell` / `ezBar` / `plate` (drawn as a plate circle in side view), `handle` (D-handle), `ropeHandle`, `kettle`, `band` (line between the two hands; use `at: 'both'`).
Cables: `cable: { from: [x,y] of the pulley, to: 'wrist' | 'both' }` draws the cable from the pulley to the hand.

## Annotations (`note` on a frame)
- **End frame always has** `arrow` on the limb that moved (`from` a joint name or point, `dir` degrees: 0 = right, 90 = down, 180 = left, 270 = up, `len` 18–30) and `muscle` glow(s) on the working muscle (a joint name or an explicit point, e.g. chest = a point a little in front of the shoulder, lats = a point below/behind the shoulder, glutes = behind the hip, quads = mid thigh, hamstrings = behind mid thigh, calves = behind the shin, biceps = mid upper arm front, triceps = mid upper arm back, rear delts = behind the shoulder, upper back = between neck and mid torso).
- `spine: true` on every frame of presses, rows, pulldowns, hinges, squats, overhead work: draws the dashed neutral-spine guide.
- **Mistake frame**: for the 20 program exercises (chest-press-machine, incline-chest-press, lat-pulldown, chest-supported-row, seated-cable-row, shoulder-press-machine, lateral-raise, rear-delt-fly-machine, biceps-curl, rope-triceps-pushdown, overhead-triceps-extension, leg-press, seated-leg-curl, lying-leg-curl, leg-extension, db-rdl, barbell-rdl, calf-raise, dead-bug, plank) add `mistake` showing the main form fault from the guide's first `mistakes[]` entry (rounded spine, shoulders rolled forward, elbows flared, neck jutting, heels lifting…) with `note.mistake.at` on the faulty joint. Optional for the others.

## Checklist per figure (all must pass before you move on)
1. I can tell which machine/equipment it is without the label.
2. The person touches the equipment correctly (seat, pad, plate, bar, floor).
3. Start and end differ only by the moving joints; limb lengths are unchanged.
4. Start = lengthened/loaded position as the guide describes; end = contraction/peak.
5. Arrow on the moving limb; muscle glow on the right spot; spine guide where relevant.
6. Nothing overlaps badly (body through the frame, arrow over the head, stack through the body).
7. Face points where the guide says (forward/neutral, not up).

## Reference
`src/data/figures/chest.ts` → `chest-press-machine` and `leg-press`. Open `scripts/out/test.png` to see how they render.
