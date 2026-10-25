import type { PostureRoutine } from '@/types'

export const ROUTINES: Record<string, PostureRoutine> = {
  daily: {
    id: 'daily',
    name: { en: 'Quick Daily Posture Fix', ar: 'روتين الظهر اليومي السريع' },
    context: 'home',
    minutes: 8,
    steps: [
      { exerciseId: 'chin-tuck', mode: 'reps', reps: 10, sides: false, rounds: 2, cue: { en: 'Slide the chin straight back, make a double chin, hold 2 s.', ar: 'حرّك الدقن لورا على خط مستقيم، اعمل دقن مزدوجة، واثبت ثانيتين.' } },
      { exerciseId: 'wall-angel', mode: 'reps', reps: 8, sides: false, rounds: 2, cue: { en: 'Back of hands and elbows stay on the wall. Slow.', ar: 'ظهر الإيد والكوع لازقين في الحيطة. ببطء.' } },
      { exerciseId: 'doorway-pec-stretch', mode: 'hold', seconds: 30, sides: false, rounds: 2, cue: { en: 'Elbows at shoulder height, lean through the doorway, ribs down.', ar: 'الكوع على مستوى الكتف، اتكي لقدام من الباب، الضلوع لتحت.' } },
      { exerciseId: 'tspine-extension-chair', mode: 'reps', reps: 8, sides: false, rounds: 1, cue: { en: 'Upper back over the chair edge, hands behind head, extend and breathe out.', ar: 'أعلى الظهر على طرف الكرسي، الإيد ورا الراس، افرد وطلّع النفس.' } },
      { exerciseId: 'cat-cow', mode: 'reps', reps: 8, sides: false, rounds: 1, cue: { en: 'Move one vertebra at a time. Breathe in on cow, out on cat.', ar: 'حرّك فقرة فقرة. خد نفس في الـ Cow وطلّعه في الـ Cat.' } },
      { exerciseId: 'prone-ytw', mode: 'reps', reps: 8, sides: false, rounds: 2, cue: { en: 'Thumbs up, squeeze the shoulder blades down and together, no neck strain.', ar: 'الإبهام لفوق، اعصر لوحي الكتف لتحت ولبعض، من غير شد في الرقبة.' } },
    ],
  },
  gymPre: {
    id: 'gymPre',
    name: { en: 'Gym Activation (pre-workout)', ar: 'تسخين وتنشيط قبل التمرين' },
    context: 'gymPre',
    minutes: 5,
    steps: [
      { exerciseId: 'band-pull-apart', mode: 'reps', reps: 15, sides: false, rounds: 2, cue: { en: 'Arms straight, pull the band to the chest, squeeze between the blades.', ar: 'الدراع مفرود، اسحب الأستك للصدر، واعصر بين لوحي الكتف.' } },
      { exerciseId: 'face-pull', mode: 'reps', reps: 12, sides: false, rounds: 2, cue: { en: 'Pull to the forehead, rotate the knuckles back, elbows high.', ar: 'اسحب للجبهة، لف ظهر الإيد لورا، الكوع عالي.' } },
      { exerciseId: 'scapular-retraction', mode: 'reps', reps: 8, sides: false, rounds: 2, cue: { en: 'Hang, then pull the shoulder blades down without bending the elbows.', ar: 'اتعلّق، وبعدين شد لوحي الكتف لتحت من غير ما تثني الكوع.' } },
      { exerciseId: 'cat-cow', mode: 'reps', reps: 8, sides: false, rounds: 1, cue: { en: 'Wake up the spine before the first lift.', ar: 'صحّي العمود الفقري قبل أول تمرين.' } },
    ],
  },
  gymPost: {
    id: 'gymPost',
    name: { en: 'Gym Decompression (post-workout)', ar: 'فك الضغط بعد التمرين' },
    context: 'gymPost',
    minutes: 5,
    steps: [
      { exerciseId: 'dead-hang', mode: 'hold', seconds: 30, sides: false, rounds: 2, cue: { en: 'Relax the shoulders up to the ears, let the spine lengthen.', ar: 'ريّح الكتف لحد الودان، وخلي العمود الفقري يتمدد.' } },
      { exerciseId: 'doorway-pec-stretch', mode: 'hold', seconds: 30, sides: false, rounds: 2, cue: { en: 'Open the chest after all the pressing.', ar: 'افتح الصدر بعد كل الدفع.' } },
      { exerciseId: 'lat-stretch', mode: 'hold', seconds: 30, sides: true, rounds: 1, cue: { en: 'Hold the rack, sit the hips back, feel the side of the back.', ar: 'امسك الرف، ارجع بالحوض لورا، وحس بجنب الظهر.' } },
      { exerciseId: 'chin-tuck', mode: 'reps', reps: 10, sides: false, rounds: 1, cue: { en: 'Reset the neck before you leave.', ar: 'رجّع الرقبة مكانها قبل ما تمشي.' } },
    ],
  },
}

export const ROUTINE_ORDER = ['daily', 'gymPre', 'gymPost']
