import type { Figure } from '../../figure/types.ts'

// Back figures. Person faces +x. Equipment contact points: src/figure/equipment.ts docs.
// Seated figures use the same seat-to-floor leg as the chest reference (knee at seat height, shin ≈ 48–50).
export const backFigures: Record<string, Figure> = {
  'lat-pulldown': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'latPulldown' }],
    load: [{ id: 'ezBar', at: 'wrist' }],
    cable: { from: [150, 22], to: 'wrist' },
    start: {
      joints: {
        head: [111, 73], neck: [114, 87], shoulder: [116, 99], hip: [124, 144], spine: [117, 122],
        elbow: [125, 74], wrist: [137, 52],
        knee: [160, 140], ankle: [163, 190], toe: [177, 200],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [111, 73], neck: [114, 87], shoulder: [116, 99], hip: [124, 144], spine: [117, 122],
        elbow: [108, 125], wrist: [130, 110],
        knee: [160, 140], ankle: [163, 190], toe: [177, 200],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 110, len: 22 }], muscle: [[106, 114]] },
    },
    mistake: {
      joints: {
        head: [93, 88], neck: [86, 100], shoulder: [94, 109], hip: [124, 144],
        elbow: [96, 137], wrist: [116, 118],
        knee: [160, 140], ankle: [163, 190], toe: [177, 200],
      },
      note: { spine: true, mistake: { at: 'neck' } },
    },
  },
  // Kneeling on the assist pad, which rises with the knees. Chin ends just above the bar, face behind it.
  'assisted-pull-up': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'assistedPullup' }, { id: 'kneePad', attach: 'knee', x: -14, y: 6 }],
    start: {
      joints: {
        head: [110, 58], neck: [110, 72], shoulder: [110, 84], hip: [106, 130],
        elbow: [113, 56], wrist: [114, 30],
        knee: [136, 148], ankle: [100, 150], toe: [94, 165],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [98, 34], neck: [100, 48], shoulder: [100, 60], hip: [102, 106],
        elbow: [126, 53], wrist: [114, 30],
        knee: [132, 124], ankle: [96, 126], toe: [90, 141],
      },
      note: { spine: true, arrow: [{ from: [80, 96], dir: 270, len: 24 }], muscle: [[94, 76]] },
    },
  },
  'single-arm-cable-pulldown': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableHigh' }],
    load: [{ id: 'handle', at: 'wrist' }],
    cable: { from: [200, 40], to: 'wrist' },
    start: {
      joints: {
        head: [110, 96], neck: [110, 110], shoulder: [110, 122], hip: [110, 168], spine: [107, 145],
        elbow: [129, 104], wrist: [146, 82],
        knee: [110, 203], ankle: [74, 203], toe: [58, 207],
        knee2: [146, 170], ankle2: [150, 205], toe2: [166, 207],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [110, 96], neck: [110, 110], shoulder: [110, 122], hip: [110, 168], spine: [107, 145],
        elbow: [102, 148], wrist: [124, 132],
        knee: [110, 203], ankle: [74, 203], toe: [58, 207],
        knee2: [146, 170], ankle2: [150, 205], toe2: [166, 207],
      },
      note: { spine: true, arrow: [{ from: [150, 100], dir: 125, len: 24 }], muscle: [[100, 136]] },
    },
  },
  'straight-arm-pulldown': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableHigh' }],
    load: [{ id: 'ezBar', at: 'wrist' }],
    cable: { from: [200, 40], to: 'wrist' },
    start: {
      joints: {
        head: [126, 65], neck: [120, 78], shoulder: [115, 89], hip: [96, 131], spine: [103, 109],
        elbow: [142, 81], wrist: [168, 76],
        knee: [106, 165], ankle: [102, 200], toe: [118, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [126, 65], neck: [120, 78], shoulder: [115, 89], hip: [96, 131], spine: [103, 109],
        elbow: [121, 115], wrist: [112, 141],
        knee: [106, 165], ankle: [102, 200], toe: [118, 206],
      },
      note: { spine: true, arrow: [{ from: [170, 92], dir: 110, len: 28 }], muscle: [[104, 104]] },
    },
  },
  'chest-supported-row': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'chestSupportRow' }],
    load: [{ id: 'handle', at: 'wrist' }],
    start: {
      joints: {
        head: [66, 81], neck: [74, 92], shoulder: [81, 102], hip: [108, 139], spine: [97, 119], face: 'back',
        elbow: [84, 130], wrist: [86, 156],
        knee: [126, 170], ankle: [142, 203], toe: [158, 207],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [66, 81], neck: [74, 92], shoulder: [81, 102], hip: [108, 139], spine: [97, 119], face: 'back',
        elbow: [106, 114], wrist: [93, 137],
        knee: [126, 170], ankle: [142, 203], toe: [158, 207],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 330, len: 20 }], muscle: [[90, 98]] },
    },
    mistake: {
      joints: {
        head: [71, 84], neck: [77, 97], shoulder: [81, 102], hip: [108, 139], spine: [97, 119], face: 'up',
        elbow: [108, 108], wrist: [96, 131],
        knee: [126, 170], ankle: [142, 203], toe: [158, 207],
      },
      note: { spine: true, mistake: { at: 'shoulder' } },
    },
  },
  'incline-db-row': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'benchIncline' }],
    load: [{ id: 'dumbbell', at: 'wrist' }],
    start: {
      joints: {
        head: [60, 89], neck: [70, 98], shoulder: [79, 106], hip: [113, 137], spine: [98, 119], face: 'back',
        elbow: [81, 134], wrist: [82, 160],
        knee: [131, 168], ankle: [147, 200], toe: [163, 205],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [60, 89], neck: [70, 98], shoulder: [79, 106], hip: [113, 137], spine: [98, 119], face: 'back',
        elbow: [106, 113], wrist: [98, 138],
        knee: [131, 168], ankle: [147, 200], toe: [163, 205],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 330, len: 20 }], muscle: [[86, 99]] },
    },
  },
  'seated-cable-row': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'rowStation' }],
    load: [{ id: 'handle', at: 'wrist' }],
    cable: { from: [200, 130], to: 'wrist' },
    start: {
      joints: {
        head: [90, 74], neck: [90, 88], shoulder: [90, 100], hip: [90, 146], spine: [87, 123],
        elbow: [117, 107], wrist: [141, 114],
        knee: [124, 138], ankle: [132, 170], toe: [138, 155],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [90, 74], neck: [90, 88], shoulder: [90, 100], hip: [90, 146], spine: [87, 123],
        elbow: [76, 122], wrist: [100, 132],
        knee: [124, 138], ankle: [132, 170], toe: [138, 155],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 180, len: 20 }], muscle: [[80, 108]] },
    },
    mistake: {
      joints: {
        head: [104, 80], neck: [99, 93], shoulder: [96, 104], hip: [90, 146], spine: [104, 126],
        elbow: [123, 110], wrist: [147, 118],
        knee: [124, 138], ankle: [132, 170], toe: [138, 155],
      },
      note: { spine: true, mistake: { at: [98, 126] } },
    },
  },
  'one-arm-db-row': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'benchFlat' }],
    load: [{ id: 'dumbbell', at: 'wrist' }],
    start: {
      joints: {
        head: [171, 113], neck: [157, 116], shoulder: [145, 118], hip: [100, 126], spine: [122, 119],
        elbow: [146, 146], wrist: [147, 172],
        elbow2: [168, 135], wrist2: [189, 150],
        knee: [96, 161], ankle: [92, 197], toe: [108, 204],
        knee2: [127, 150], ankle2: [91, 152], toe2: [75, 153],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [171, 113], neck: [157, 116], shoulder: [145, 118], hip: [100, 126], spine: [122, 119],
        elbow: [124, 100], wrist: [116, 124],
        elbow2: [168, 135], wrist2: [189, 150],
        knee: [96, 161], ankle: [92, 197], toe: [108, 204],
        knee2: [127, 150], ankle2: [91, 152], toe2: [75, 153],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 300, len: 20 }], muscle: [[134, 109]] },
    },
  },
  'inverted-row': {
    view: 'side',
    // pull-up bar lowered to y=120; person lies under it on their back (head left), heels on the floor.
    equipment: [{ id: 'floor' }, { id: 'pullupBar', y: 90 }],
    start: {
      joints: {
        head: [78, 168], neck: [91, 171], shoulder: [103, 174], hip: [148, 186],
        elbow: [100, 146], wrist: [97, 120],
        knee: [182, 195], ankle: [217, 204], toe: [222, 189],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [110, 110], neck: [117, 122], shoulder: [126, 130], hip: [162, 159],
        elbow: [104, 146], wrist: [97, 120],
        knee: [190, 182], ankle: [217, 204], toe: [222, 189],
      },
      note: { spine: true, arrow: [{ from: [178, 152], dir: 285, len: 24 }], muscle: [[118, 138]] },
    },
  },
  // Front view (person faces the viewer, chest on the pad in front): handles start together in front of the chest and sweep out to a T.
  'rear-delt-fly-machine': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'rearDeltFront' }],
    load: [{ id: 'handle', at: 'wristL', a: 90 }, { id: 'handle', at: 'wristR', a: 90 }],
    start: {
      joints: {
        head: [120, 78], neck: [120, 92], shoulderL: [100, 104], shoulderR: [140, 104], hip: [120, 146],
        elbowL: [102, 114], wristL: [113, 106], elbowR: [138, 114], wristR: [127, 106],
        kneeL: [108, 160], ankleL: [106, 204], kneeR: [132, 160], ankleR: [134, 204],
      },
    },
    end: {
      joints: {
        head: [120, 78], neck: [120, 92], shoulderL: [100, 104], shoulderR: [140, 104], hip: [120, 146],
        elbowL: [73, 106], wristL: [47, 108], elbowR: [167, 106], wristR: [193, 108],
        kneeL: [108, 160], ankleL: [106, 204], kneeR: [132, 160], ankleR: [134, 204],
      },
      note: { arrow: [{ from: 'wristL', dir: 180, len: 18 }, { from: 'wristR', dir: 0, len: 18 }], muscle: [[100, 104], [140, 104]] },
    },
    // shrugging: shoulders pulled up to the ears, traps take over
    mistake: {
      joints: {
        head: [120, 76], neck: [120, 92], shoulderL: [101, 94], shoulderR: [139, 94], hip: [120, 146],
        elbowL: [74, 98], wristL: [48, 96], elbowR: [166, 98], wristR: [192, 96],
        kneeL: [108, 160], ankleL: [106, 204], kneeR: [132, 160], ankleR: [134, 204],
      },
      note: { mistake: { at: 'shoulderR' } },
    },
  },
  // Front view, seated on the end of a bench and folded over the thighs (head low, in front of the chest).
  // Dumbbells hang beside the shins, then sweep out to the sides with soft elbows.
  'bent-over-db-rear-fly': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'benchEnd' }],
    load: [{ id: 'dumbbell', at: 'wristL', a: 90 }, { id: 'dumbbell', at: 'wristR', a: 90 }],
    start: {
      joints: {
        head: [120, 128], neck: [120, 122], shoulderL: [100, 124], shoulderR: [140, 124], hip: [120, 148],
        elbowL: [95, 151], wristL: [97, 177], elbowR: [145, 151], wristR: [143, 177],
        kneeL: [106, 162], ankleL: [104, 204], kneeR: [134, 162], ankleR: [136, 204],
      },
    },
    end: {
      joints: {
        head: [120, 128], neck: [120, 122], shoulderL: [100, 124], shoulderR: [140, 124], hip: [120, 148],
        elbowL: [73, 120], wristL: [48, 126], elbowR: [167, 120], wristR: [192, 126],
        kneeL: [106, 162], ankleL: [104, 204], kneeR: [134, 162], ankleR: [136, 204],
      },
      note: { arrow: [{ from: 'wristL', dir: 200, len: 18 }, { from: 'wristR', dir: 340, len: 18 }], muscle: [[100, 122], [140, 122]] },
    },
  },
  // Front view, one arm: the far hand takes the cable from the column on the other side and sweeps it across
  // the chest out to the side at shoulder height (arm long, soft elbow).
  'reverse-cable-fly': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'cableFace' }],
    load: [{ id: 'handle', at: 'wristL', a: 90 }],
    cable: { from: [200, 80], to: 'wristL' },
    start: {
      joints: {
        head: [120, 54], neck: [120, 68], shoulderL: [100, 80], shoulderR: [140, 80], hip: [120, 126],
        elbowL: [124, 91], wristL: [150, 88], elbowR: [144, 108], wristR: [146, 134],
        kneeL: [112, 162], ankleL: [110, 198], kneeR: [128, 162], ankleR: [130, 198],
      },
    },
    end: {
      joints: {
        head: [120, 54], neck: [120, 68], shoulderL: [100, 80], shoulderR: [140, 80], hip: [120, 126],
        elbowL: [72, 82], wristL: [46, 84], elbowR: [144, 108], wristR: [146, 134],
        kneeL: [112, 162], ankleL: [110, 198], kneeR: [128, 162], ankleR: [130, 198],
      },
      note: { arrow: [{ from: 'wristL', dir: 180, len: 18 }], muscle: ['shoulderL'] },
    },
  },
}
