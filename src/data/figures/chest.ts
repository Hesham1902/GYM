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
        elbow: [92, 126], wrist: [150, 118],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, muscle: ['shoulder'] },
    },
    end: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [146, 112], wrist: [190, 118],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 0, len: 22 }], muscle: [[122, 112]] },
    },
    mistake: {
      joints: {
        head: [118, 84], neck: [114, 96], shoulder: [112, 106], hip: [106, 150], spine: [116, 128],
        elbow: [150, 112], wrist: [194, 118],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { mistake: { at: 'shoulder' } },
    },
  },
  'leg-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legPress' }],
    start: {
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152], face: 'front',
        elbow: [66, 142], wrist: [86, 158],
        knee: [116, 118], ankle: [150, 134], toe: [164, 120],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [34, 96], neck: [44, 108], shoulder: [50, 116], hip: [74, 152], face: 'front',
        elbow: [66, 142], wrist: [86, 158],
        knee: [118, 100], ankle: [166, 70], toe: [178, 82],
      },
      note: { spine: true, arrow: [{ from: 'knee', dir: 200, len: 24 }], muscle: ['knee'] },
    },
  },
}
