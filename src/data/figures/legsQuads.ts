import type { Figure } from '../../figure/types.ts'

// Quad-dominant legs and calves. Person faces +x. Contact points: see src/figure/equipment.ts docs.
// Standing body (feet on the floor y=210): ankle y≈202, knee 166, hip 130, shoulder 84, neck 72, head 58.
export const legsQuadsFigures: Record<string, Figure> = {
  // Leg press: the plate is static, so the feet sit on it at the end (sled pushed away) and hover
  // just short of it at the start. Legs are drawn longer (thigh 64 / shin 56) to reach the sled.
  // Legs push along the sled line (45° up-right); feet flat on the plate with the toes pointing up the plate.
  // The plate (legPressSled) is pinned to the ankle, so it travels with the feet.
  'leg-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legPress' }, { id: 'legPressSled', attach: 'ankle', a: 45 }],
    start: {
      // knees bent about 90°, thighs toward the chest
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152],
        elbow: [66, 142], wrist: [86, 158],
        knee: [74, 116], ankle: [109, 117], toe: [98, 106],
      },
      note: { spine: true },
    },
    end: {
      // legs long with a soft knee, never locked
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152],
        elbow: [66, 142], wrist: [86, 158],
        knee: [93, 122], ankle: [124, 103], toe: [113, 92],
      },
      note: { spine: true, arrow: [{ from: [118, 130], dir: 315, len: 22 }], muscle: [[86, 132]] },
    },
    // too deep: hips curl off the seat and the lower back rounds
    mistake: {
      joints: {
        head: [36, 100], neck: [46, 112], shoulder: [52, 120], hip: [82, 146], spine: [60, 142],
        elbow: [68, 146], wrist: [88, 160],
        knee: [74, 112], ankle: [109, 117], toe: [98, 106],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'goblet-squat': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [122, 58], neck: [122, 72], shoulder: [122, 84], hip: [120, 130],
        elbow: [122, 112], wrist: [140, 94],
        knee: [120, 166], ankle: [120, 202], toe: [136, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [118, 99], neck: [115, 112], shoulder: [112, 124], hip: [98, 168],
        elbow: [112, 152], wrist: [130, 134],
        knee: [134, 168], ankle: [120, 202], toe: [136, 208],
      },
      note: { spine: true, arrow: [{ from: [86, 150], dir: 90, len: 22 }], muscle: [[116, 160], [92, 174]] },
    },
  },
  'smith-squat': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'smith' }],
    // bar on the upper back behind the neck, drawn behind the body; hands hold it just outside the shoulders
    load: [{ id: 'barbell', at: 'wrist', behind: true }],
    start: {
      joints: {
        head: [122, 58], neck: [122, 72], shoulder: [122, 84], hip: [126, 130],
        elbow: [104, 104], wrist: [114, 80],
        knee: [128, 166], ankle: [128, 202], toe: [144, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [116, 96], neck: [114, 110], shoulder: [112, 122], hip: [104, 167], spine: [106, 144],
        elbow: [94, 142], wrist: [104, 118],
        knee: [142, 168], ankle: [128, 202], toe: [144, 208],
      },
      note: { spine: true, arrow: [{ from: [84, 150], dir: 90, len: 22 }], muscle: [[124, 160], [100, 174]] },
    },
  },
  // Hack squat: sled coordinates. O=(126,190) pad bottom, u=(-0.5,-0.866) up the pad, f=(0.866,-0.5) forward.
  // Body sits 9px in front of the pad face; feet 4px above the plate line (a=-16).
  'hack-squat': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'hackSquat' }],
    start: {
      joints: {
        head: [82, 79], neck: [80, 92], shoulder: [86, 102], hip: [109, 142],
        elbow: [96, 128], wrist: [90, 103],
        knee: [141, 159], ankle: [162, 188], toe: [176, 180],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [97, 105], neck: [95, 118], shoulder: [101, 128], hip: [124, 168],
        elbow: [111, 154], wrist: [105, 129],
        knee: [156, 152], ankle: [162, 188], toe: [176, 180],
      },
      note: { spine: true, arrow: [{ from: [132, 126], dir: 60, len: 20 }], muscle: [[142, 154]] },
    },
  },
  'leg-extension': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legExtension' }],
    lever: [{ pivot: [145, 150], to: 'ankle', end: 'roller', off: [7, -6] }],
    start: {
      joints: {
        head: [100, 74], neck: [101, 88], shoulder: [102, 100], hip: [108, 146],
        elbow: [104, 128], wrist: [118, 150],
        knee: [144, 150], ankle: [142, 186], toe: [157, 181],
      },
    },
    end: {
      joints: {
        head: [100, 74], neck: [101, 88], shoulder: [102, 100], hip: [108, 146],
        elbow: [104, 128], wrist: [118, 150],
        knee: [144, 150], ankle: [180, 150], toe: [196, 146],
      },
      note: { arrow: [{ from: [158, 184], dir: 320, len: 24 }], muscle: [[126, 140]] },
    },
    mistake: {
      joints: {
        head: [92, 68], neck: [94, 82], shoulder: [96, 94], hip: [110, 138],
        elbow: [100, 122], wrist: [116, 142],
        knee: [146, 142], ankle: [182, 142], toe: [198, 138],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'db-split-squat': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'both', a: 90 }],
    start: {
      joints: {
        head: [122, 62], neck: [122, 76], shoulder: [122, 88], hip: [120, 134],
        elbow: [122, 116], wrist: [124, 142], elbow2: [118, 116], wrist2: [118, 142],
        knee: [140, 164], ankle: [144, 200], toe: [160, 206],
        knee2: [121, 170], ankle2: [98, 198], toe2: [112, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [122, 104], neck: [122, 118], shoulder: [122, 130], hip: [120, 176],
        elbow: [116, 158], wrist: [112, 184], elbow2: [114, 158], wrist2: [110, 184],
        knee: [154, 166], ankle: [144, 200], toe: [160, 206],
        knee2: [94, 200], ankle2: [60, 196], toe2: [74, 204],
      },
      note: { spine: true, arrow: [{ from: [100, 148], dir: 90, len: 22 }], muscle: [[137, 163]] },
    },
  },
  'wall-sit': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'wall' }],
    start: {
      joints: {
        head: [82, 94], neck: [82, 108], shoulder: [82, 120], hip: [82, 166],
        elbow: [84, 148], wrist: [106, 160],
        knee: [118, 166], ankle: [118, 202], toe: [134, 208],
      },
      note: { spine: true, muscle: [[100, 158]] },
    },
    end: {
      joints: {
        head: [82, 94], neck: [82, 108], shoulder: [82, 120], hip: [82, 166],
        elbow: [84, 148], wrist: [106, 160],
        knee: [118, 166], ankle: [118, 202], toe: [134, 208],
      },
      note: { spine: true, muscle: [[100, 158]] },
    },
  },
  'db-step-up': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'box' }],
    load: [{ id: 'dumbbell', at: 'both', a: 90 }],
    start: {
      joints: {
        head: [102, 58], neck: [102, 72], shoulder: [102, 84], hip: [100, 130],
        elbow: [102, 112], wrist: [104, 138], elbow2: [98, 112], wrist2: [98, 138],
        knee: [136, 130], ankle: [134, 166], toe: [150, 166],
        knee2: [98, 166], ankle2: [98, 202], toe2: [114, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [136, 22], neck: [136, 36], shoulder: [136, 48], hip: [134, 94],
        elbow: [136, 76], wrist: [138, 102], elbow2: [132, 76], wrist2: [132, 102],
        knee: [134, 130], ankle: [134, 166], toe: [150, 166],
        knee2: [118, 126], ankle2: [108, 160], toe2: [124, 164],
      },
      note: { spine: true, arrow: [{ from: [112, 110], dir: 270, len: 24 }], muscle: [[142, 112], [126, 98]] },
    },
  },
  // Standing calf machine: toes stay on the block edge (x≈150), the heel hangs behind it and rises.
  // The shoulder pads are static, so the shoulders sit just under them at the start and push into them at the top.
  'calf-raise': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'calfStanding' }],
    start: {
      joints: {
        head: [123, 62], neck: [123, 76], shoulder: [123, 88], hip: [127, 134],
        elbow: [132, 115], wrist: [141, 91],
        knee: [127, 170], ankle: [127, 206], toe: [142, 198],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [125, 52], neck: [125, 66], shoulder: [125, 78], hip: [129, 124],
        elbow: [134, 105], wrist: [143, 81],
        knee: [129, 160], ankle: [129, 196], toe: [143, 197],
      },
      note: { spine: true, arrow: [{ from: [112, 206], dir: 270, len: 20 }], muscle: [[120, 178]] },
    },
    mistake: {
      joints: {
        head: [123, 66], neck: [123, 80], shoulder: [123, 92], hip: [127, 138],
        elbow: [132, 119], wrist: [141, 95],
        knee: [136, 172], ankle: [127, 206], toe: [142, 198],
      },
      note: { mistake: { at: 'knee' } },
    },
  },
  // Seated calf: the knee pad is static, so the thighs sit just under it at the start and lift into it at the top.
  'seated-calf-raise': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'calfSeated' }],
    start: {
      joints: {
        head: [92, 96], neck: [92, 110], shoulder: [92, 122], hip: [90, 168],
        elbow: [106, 146], wrist: [126, 129],
        knee: [127, 168], ankle: [131, 204], toe: [146, 197],
      },
    },
    end: {
      joints: {
        head: [92, 96], neck: [92, 110], shoulder: [92, 122], hip: [90, 168],
        elbow: [106, 146], wrist: [126, 129],
        knee: [126, 158], ankle: [133, 192], toe: [147, 197],
      },
      note: { arrow: [{ from: [121, 206], dir: 270, len: 20 }], muscle: [[122, 176]] },
    },
  },
  // Leg press calf raise: legs stay nearly straight; the ball of the foot stays on the plate, the heel lifts off it.
  // Legs straight on the sled line, feet flat on the plate; pointing the feet drives the plate away and lifts the heels off it.
  // The plate is pinned to the toes (offset back along the plate so the sled stays on its rails).
  'leg-press-calf-raise': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legPress' }, { id: 'legPressSled', attach: 'toe', x: 11, y: 11, a: 45 }],
    start: {
      // feet flat on the plate
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152],
        elbow: [66, 142], wrist: [86, 158],
        knee: [99, 127], ankle: [124, 102], toe: [113, 91],
      },
      note: { spine: true },
    },
    end: {
      // pointed: the balls of the feet drive the plate away
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152],
        elbow: [66, 142], wrist: [86, 158],
        knee: [99, 127], ankle: [124, 102], toe: [118, 87],
      },
      note: { spine: true, arrow: [{ from: [132, 74], dir: 315, len: 18 }], muscle: [[116, 118]] },
    },
  },
  // Single-leg calf raise on a box: ball of the foot on the box's left edge (x=120), free foot hooked behind.
  'single-leg-calf-raise': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'box' }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [108, 31], neck: [108, 45], shoulder: [108, 57], hip: [112, 103],
        elbow: [116, 83], wrist: [124, 108], elbow2: [104, 85], wrist2: [102, 111],
        knee: [112, 139], ankle: [112, 175], toe: [127, 167],
        knee2: [101, 135], ankle2: [91, 169], toe2: [105, 175],
      },
    },
    end: {
      joints: {
        head: [109, 19], neck: [109, 33], shoulder: [109, 45], hip: [113, 91],
        elbow: [117, 71], wrist: [125, 96], elbow2: [105, 73], wrist2: [103, 99],
        knee: [113, 127], ankle: [113, 163], toe: [127, 167],
        knee2: [102, 123], ankle2: [92, 157], toe2: [106, 163],
      },
      note: { arrow: [{ from: [134, 164], dir: 270, len: 20 }], muscle: [[106, 146]] },
    },
  },
}
