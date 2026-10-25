import type { Figure } from '../../figure/types.ts'

// Reference figure. Person faces +x. Equipment: see src/figure/equipment.ts docs for contact points.
export const chestFigures: Record<string, Figure> = {
  'chest-press-machine': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'chestPress' }],
    load: [{ id: 'handle', at: 'wrist', a: 90 }],
    start: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [80, 120], wrist: [106, 116],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, muscle: [[118, 112]] },
    },
    end: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [128, 112], wrist: [154, 116],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 0, len: 22 }], muscle: [[118, 112]] },
    },
    mistake: {
      joints: {
        head: [118, 84], neck: [114, 96], shoulder: [112, 106], hip: [106, 150], spine: [116, 128],
        elbow: [138, 114], wrist: [164, 118],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { mistake: { at: 'shoulder' } },
    },
  },
  // Incline press machine: back on the 30° pad, hips at the seat, handles start at the upper chest and travel up-forward.
  'incline-chest-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'inclinePress' }],
    load: [{ id: 'handle', at: 'wrist' }],
    start: {
      joints: {
        head: [72, 87], neck: [77, 100], shoulder: [83, 110], hip: [106, 150], spine: [92, 131],
        elbow: [106, 125], wrist: [112, 100],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, muscle: [[96, 104]] },
    },
    end: {
      joints: {
        head: [72, 87], neck: [77, 100], shoulder: [83, 110], hip: [106, 150], spine: [92, 131],
        elbow: [109, 99], wrist: [124, 78],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 300, len: 22 }], muscle: [[96, 104]] },
    },
    // Shrug: shoulder jammed up toward the ear while pressing.
    mistake: {
      joints: {
        head: [72, 87], neck: [77, 100], shoulder: [80, 104], hip: [106, 150], spine: [90, 128],
        elbow: [109, 99], wrist: [124, 78],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { mistake: { at: 'shoulder' } },
    },
  },
  // Flat bench, lying face up, head at left. Elbows dip just below the bench at the bottom; dumbbells end over the shoulders.
  'flat-db-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'benchFlat', x: -10 }],
    load: [{ id: 'dumbbell', at: 'wrist' }],
    start: {
      joints: {
        head: [70, 139], neck: [84, 140], shoulder: [96, 141], hip: [142, 141], face: 'up',
        elbow: [117, 160], wrist: [112, 134],
        knee: [176, 154], ankle: [182, 198], toe: [197, 204],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [70, 139], neck: [84, 140], shoulder: [96, 141], hip: [142, 141], face: 'up',
        elbow: [104, 114], wrist: [112, 89],
        knee: [176, 154], ankle: [182, 198], toe: [197, 204],
      },
      note: { spine: true, arrow: [{ from: [112, 80], dir: 270, len: 20 }], muscle: [[108, 131]] },
    },
  },
  // Smith bench press: bar (plate) on the rails over the mid chest, pressed straight up.
  'smith-bench-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'smith' }, { id: 'benchFlat' }],
    load: [{ id: 'barbell', at: 'wrist' }],
    start: {
      joints: {
        head: [78, 139], neck: [92, 140], shoulder: [104, 141], hip: [150, 141], face: 'up',
        elbow: [124, 161], wrist: [120, 136],
        knee: [184, 154], ankle: [190, 198], toe: [205, 204],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [78, 139], neck: [92, 140], shoulder: [104, 141], hip: [150, 141], face: 'up',
        elbow: [112, 114], wrist: [120, 89],
        knee: [184, 154], ankle: [190, 198], toe: [205, 204],
      },
      note: { spine: true, arrow: [{ from: [120, 70], dir: 270, len: 20 }], muscle: [[114, 131]] },
    },
  },
  // Push-up: prone, head at left, body one line from head to heels pivoting on the toes. Start = chest a fist from the floor.
  'push-up': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    zoom: [0, 90, 240, 150],
    start: {
      joints: {
        head: [51, 184], neck: [65, 185], shoulder: [77, 186], hip: [123, 189], face: 'down',
        elbow: [105, 183], wrist: [88, 203],
        knee: [163, 191], ankle: [206, 194], toe: [210, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [60, 141], neck: [73, 146], shoulder: [84, 150], hip: [127, 166], face: 'down',
        elbow: [90, 177], wrist: [88, 203],
        knee: [165, 179], ankle: [206, 194], toe: [210, 208],
      },
      note: { spine: true, arrow: [{ from: [110, 148], dir: 270, len: 20 }], muscle: [[92, 162]] },
    },
  },
  // Incline bench (45° symbol): hips on the seat, back and head on the pad, dumbbells pressed straight up over the upper chest.
  'incline-db-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'benchIncline' }],
    load: [{ id: 'dumbbell', at: 'wrist' }],
    start: {
      joints: {
        head: [75, 102], neck: [85, 111], shoulder: [94, 119], hip: [128, 150], spine: [109, 137],
        elbow: [120, 129], wrist: [108, 106],
        knee: [166, 152], ankle: [172, 198], toe: [188, 205],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [75, 102], neck: [85, 111], shoulder: [94, 119], hip: [128, 150], spine: [109, 137],
        elbow: [106, 94], wrist: [102, 68],
        knee: [166, 152], ankle: [172, 198], toe: [188, 205],
      },
      note: { spine: true, arrow: [{ from: [102, 58], dir: 270, len: 18 }], muscle: [[102, 110]] },
    },
  },
  // Incline Smith press: same bench, rails shifted so the bar (x=114) lands on the upper chest and rises straight up.
  'incline-smith-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'smith', x: -6 }, { id: 'benchIncline' }],
    load: [{ id: 'barbell', at: 'wrist' }],
    start: {
      joints: {
        head: [75, 102], neck: [85, 111], shoulder: [94, 119], hip: [128, 150], spine: [109, 137],
        elbow: [120, 129], wrist: [114, 104],
        knee: [166, 152], ankle: [172, 198], toe: [188, 205],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [75, 102], neck: [85, 111], shoulder: [94, 119], hip: [128, 150], spine: [109, 137],
        elbow: [109, 96], wrist: [114, 70],
        knee: [166, 152], ankle: [172, 198], toe: [188, 205],
      },
      note: { spine: true, arrow: [{ from: [114, 50], dir: 270, len: 18 }], muscle: [[102, 110]] },
    },
  },
  // Incline push-up: hands on the edge of a box (mirrored to x 50..120), feet on the floor, body one line, pivoting on the toes.
  'incline-push-up': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'box', flip: true, x: 240 }],
    start: {
      joints: {
        head: [58, 152], neck: [69, 157], shoulder: [81, 160], hip: [125, 172], face: 'down',
        elbow: [102, 141], wrist: [110, 166],
        knee: [164, 182], ankle: [207, 194], toe: [211, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [84, 98], neck: [95, 107], shoulder: [104, 114], hip: [140, 142], face: 'down',
        elbow: [111, 141], wrist: [110, 166],
        knee: [172, 167], ankle: [207, 194], toe: [211, 208],
      },
      note: { spine: true, arrow: [{ from: [122, 128], dir: 285, len: 22 }], muscle: [[97, 124]] },
    },
  },
}
