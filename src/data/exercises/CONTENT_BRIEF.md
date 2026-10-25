# Exercise content brief (for content writers)

Write TypeScript files exporting `Exercise[]` exactly like `chest.ts` (the reference). Read `src/types/index.ts` for the type.

Rules:
- `name.ar`: Arabic descriptive name, with the English gym term in parentheses when the term is universal, e.g. `'جهاز ضغط الصدر (Chest Press)'`. `termEn`: the short universal English term.
- Arabic = simple Egyptian colloquial (عامية مصرية بسيطة), second person, friendly coach. Keep gym terms in English inside Arabic text: Sets, Reps, RIR, Rest, Warm-up, Chest Press, Lat Pulldown, RDL, Smith, Cable, Dumbbell (دمبل ok), Plank, Face Pull, etc. Western digits. No classical Arabic, no "يجب".
- English = clear professional coaching English.
- Depth per exercise (minimum): setup 3–4 lines, execution 3 lines, breathing 1, mistakes 3 (avoid+fix), greenFlags 2, safety 2, startingWeight 1 (concrete kg ranges for an adult man returning after a long layoff, or "bodyweight: start with X reps" for bodyweight), kyphosisCue 1 line for every exercise where a rounded upper back / forward head matters (most pressing, rowing, overhead, hinge; omit only for leg-curl type isolation if truly irrelevant).
- `alternatives`: exactly the ids given below, each with `differs` (how it differs biomechanically / feel) and `chooseWhen` (practical: machine busy, equipment missing, joint discomfort, home). Both bilingual.
- `videoUrl`: `https://www.youtube.com/results?search_query=<exercise+name>+proper+form` (search URL, never a guessed video id).
- `repRange`, `weightStep` (2.5 for dumbbell/isolation/cable, 5 for machines/leg press/smith), `loadType` ('weight' | 'bodyweight' | 'time'), `isCompound`, `unilateral` (true if done one side at a time), `difficulty` 1–3, `postureFocus` true for rows, rear delts, face pulls, pull-aparts, and all posture drills.
- `muscles[0]` must be the primary muscle (used for volume charts).
- `kind`: 'strength' for gym exercises, 'posture' for posture drills. Posture drills: `loadType: 'time'` for holds/stretches (repRange = seconds, e.g. [20, 40]), 'bodyweight' for rep drills.
- No placeholders, no TODOs, no empty arrays. Every string in both languages.
