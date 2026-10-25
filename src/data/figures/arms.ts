import type { Figure } from '../../figure/types.ts'

// Arms. Person faces +x unless `flip`. Proportions per src/figure/AUTHORING.md.
// Standing stance shared by the curls: head 54, shoulder 80, hip 126, knee 162, ankle 198.
// Biceps glow = front of mid upper arm; triceps glow = back of mid upper arm.
export const armsFigures: Record<string, Figure> = {
  'biceps-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 0 }],
    start: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [122, 132],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
    },
    end: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [128, 84],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
      note: { arrow: [{ from: [140, 128], dir: 270, len: 30, curve: 10 }], muscle: [[121, 94]] },
    },
    mistake: {
      joints: {
        head: [99, 55], neck: [101, 69], shoulder: [103, 81], hip: [110, 126], spine: [112, 104],
        elbow: [123, 100], wrist: [128, 75],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
      note: { mistake: { at: 'elbow' } },
    },
  },
  'ez-bar-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'ezBar', at: 'wrist' }],
    start: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [122, 132],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
    },
    end: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [128, 84],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
      note: { arrow: [{ from: [140, 128], dir: 270, len: 30, curve: 10 }], muscle: [[121, 94]] },
    },
  },
  'cable-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableLow' }],
    load: [{ id: 'handle', at: 'wrist' }],
    cable: { from: [200, 195], to: 'wrist' },
    start: {
      joints: {
        head: [120, 54], neck: [120, 68], shoulder: [120, 80], hip: [120, 126],
        elbow: [126, 107], wrist: [132, 132],
        knee: [122, 162], ankle: [120, 198], toe: [136, 204],
      },
    },
    end: {
      joints: {
        head: [120, 54], neck: [120, 68], shoulder: [120, 80], hip: [120, 126],
        elbow: [126, 107], wrist: [138, 84],
        knee: [122, 162], ankle: [120, 198], toe: [136, 204],
      },
      note: { arrow: [{ from: [150, 128], dir: 270, len: 30, curve: 10 }], muscle: [[131, 94]] },
    },
  },
  'hammer-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [122, 132],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
    },
    end: {
      joints: {
        head: [110, 54], neck: [110, 68], shoulder: [110, 80], hip: [110, 126],
        elbow: [116, 107], wrist: [128, 84],
        knee: [112, 162], ankle: [110, 198], toe: [126, 204],
      },
      note: { arrow: [{ from: [140, 128], dir: 270, len: 30, curve: 10 }], muscle: [[121, 94]] },
    },
  },
  'rope-triceps-pushdown': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableHigh' }],
    load: [{ id: 'ropeHandle', at: 'wrist' }],
    cable: { from: [200, 40], to: 'wrist' },
    start: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [126, 109], wrist: [148, 95],
        knee: [118, 162], ankle: [116, 198], toe: [132, 204],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [126, 109], wrist: [128, 135],
        knee: [118, 162], ankle: [116, 198], toe: [132, 204],
      },
      note: { spine: true, arrow: [{ from: [158, 100], dir: 90, len: 26, curve: 8 }], muscle: [[117, 95]] },
    },
    mistake: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126], spine: [128, 104],
        elbow: [146, 98], wrist: [150, 124],
        knee: [118, 162], ankle: [116, 198], toe: [132, 204],
      },
      note: { mistake: { at: 'elbow' } },
    },
  },
  'bar-pushdown': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableHigh' }],
    load: [{ id: 'handle', at: 'wrist' }],
    cable: { from: [200, 40], to: 'wrist' },
    start: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [126, 109], wrist: [148, 95],
        knee: [118, 162], ankle: [116, 198], toe: [132, 204],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [126, 109], wrist: [128, 135],
        knee: [118, 162], ankle: [116, 198], toe: [132, 204],
      },
      note: { spine: true, arrow: [{ from: [158, 100], dir: 90, len: 26, curve: 8 }], muscle: [[117, 95]] },
    },
  },
  'bench-dip': {
    view: 'side',
    // box shifted left so its edge (x=80, top y=170) sits behind the hips
    equipment: [{ id: 'floor' }, { id: 'box', x: -110 }],
    start: {
      joints: {
        head: [94, 119], neck: [96, 133], shoulder: [98, 145], hip: [104, 190],
        elbow: [70, 145], wrist: [78, 170],
        knee: [130, 166], ankle: [148, 196], toe: [164, 202],
      },
    },
    end: {
      joints: {
        head: [86, 91], neck: [84, 105], shoulder: [82, 117], hip: [96, 162],
        elbow: [80, 144], wrist: [78, 170],
        knee: [132, 164], ankle: [148, 196], toe: [164, 202],
      },
      note: { arrow: [{ from: [112, 156], dir: 270, len: 24 }], muscle: [[74, 130]] },
    },
  },
  'db-kickback': {
    view: 'side',
    // bench lowered so the kneeling thigh and the standing leg both fit the proportions
    equipment: [{ id: 'floor' }, { id: 'benchFlat', y: 20 }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [171, 114], neck: [157, 117], shoulder: [145, 120], hip: [100, 130],
        elbow: [117, 126], wrist: [117, 152],
        elbow2: [141, 147], wrist2: [156, 168],
        knee: [112, 163], ankle: [110, 198], toe: [126, 204],
        knee2: [100, 166], ankle2: [64, 166], toe2: [48, 170],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [171, 114], neck: [157, 117], shoulder: [145, 120], hip: [100, 130],
        elbow: [117, 126], wrist: [91, 132],
        elbow2: [141, 147], wrist2: [156, 168],
        knee: [112, 163], ankle: [110, 198], toe: [126, 204],
        knee2: [100, 166], ankle2: [64, 166], toe2: [48, 170],
      },
      note: { spine: true, arrow: [{ from: [92, 112], dir: 180, len: 22 }], muscle: [[131, 116]] },
    },
  },
  'overhead-triceps-extension': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'seat' }],
    load: [{ id: 'dumbbell', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [102, 78], neck: [103, 92], shoulder: [104, 104], hip: [108, 150],
        elbow: [94, 78], wrist: [70, 88],
        knee: [140, 162], ankle: [144, 198], toe: [160, 204],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [102, 78], neck: [103, 92], shoulder: [104, 104], hip: [108, 150],
        elbow: [94, 78], wrist: [85, 54],
        knee: [140, 162], ankle: [144, 198], toe: [160, 204],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 270, len: 20 }], muscle: [[90, 96]] },
    },
    mistake: {
      joints: {
        head: [96, 80], neck: [97, 94], shoulder: [99, 106], hip: [108, 150], spine: [114, 126],
        elbow: [89, 80], wrist: [80, 56],
        knee: [140, 162], ankle: [144, 198], toe: [160, 204],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'rope-overhead-extension': {
    view: 'side',
    // column mirrored to x=40 so the cable comes from behind; whole scene flipped so the
    // person faces -x with the column on the right
    flip: true,
    equipment: [{ id: 'floor' }, { id: 'cableLow', flip: true, x: 240 }],
    load: [{ id: 'ropeHandle', at: 'wrist' }],
    cable: { from: [40, 195], to: 'wrist' },
    start: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [112, 56], wrist: [92, 74],
        knee: [120, 162], ankle: [122, 198], toe: [138, 204],
        knee2: [104, 160], ankle2: [96, 195], toe2: [112, 201],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [128, 55], neck: [126, 69], shoulder: [124, 81], hip: [116, 126],
        elbow: [112, 56], wrist: [101, 33],
        knee: [120, 162], ankle: [122, 198], toe: [138, 204],
        knee2: [104, 160], ankle2: [96, 195], toe2: [112, 201],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 270, len: 18 }], muscle: [[110, 70]] },
    },
  },
  'skull-crusher': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'benchFlat' }],
    load: [{ id: 'ezBar', at: 'wrist' }],
    start: {
      joints: {
        head: [56, 141], neck: [70, 141], shoulder: [82, 141], hip: [128, 141],
        elbow: [76, 114], wrist: [50, 110],
        knee: [160, 158], ankle: [166, 194], toe: [182, 202],
      },
    },
    end: {
      joints: {
        head: [56, 141], neck: [70, 141], shoulder: [82, 141], hip: [128, 141],
        elbow: [76, 114], wrist: [70, 89],
        knee: [160, 158], ankle: [166, 194], toe: [182, 202],
      },
      note: { arrow: [{ from: [52, 100], dir: 270, len: 20 }], muscle: [[73, 126]] },
    },
  },
}
