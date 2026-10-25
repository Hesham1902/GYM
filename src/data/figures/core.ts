import type { Figure } from '../../figure/types.ts'

// Core. Floor exercises lie along x; the face hint follows the renderer: the nose sits on the
// ventral side of the spine, so a face-up person lying head-left needs no hint, a prone person
// with head to the right needs none either.
export const coreFigures: Record<string, Figure> = {
  'dead-bug': {
    view: 'side', zoom: [0, 90, 240, 150],
    equipment: [{ id: 'floor' }],
    start: {
      joints: {
        head: [50, 198], neck: [64, 201], shoulder: [76, 201], hip: [122, 201],
        elbow: [76, 173], wrist: [76, 147], elbow2: [76, 173], wrist2: [76, 147],
        knee: [122, 165], ankle: [158, 165], toe: [160, 150], knee2: [122, 165], ankle2: [158, 165], toe2: [160, 150],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [50, 198], neck: [64, 201], shoulder: [76, 201], hip: [122, 201],
        elbow: [54, 184], wrist: [33, 169], elbow2: [76, 173], wrist2: [76, 147],
        knee: [156, 190], ankle: [190, 179], toe: [193, 164], knee2: [122, 165], ankle2: [158, 165], toe2: [160, 150],
      },
      note: { spine: true, arrow: [{ from: [36, 158], dir: 200, len: 20 }, { from: [196, 196], dir: 350, len: 20 }], muscle: [[99, 201]] },
    },
    mistake: {
      joints: {
        head: [50, 198], neck: [64, 201], shoulder: [76, 201], hip: [122, 201], spine: [99, 186],
        elbow: [54, 184], wrist: [33, 169], elbow2: [76, 173], wrist2: [76, 147],
        knee: [156, 190], ankle: [190, 179], toe: [193, 164], knee2: [122, 165], ankle2: [158, 165], toe2: [160, 150],
      },
      note: { mistake: { at: [99, 195] } },
    },
  },
  'plank': {
    view: 'side', zoom: [0, 90, 240, 150],
    equipment: [{ id: 'floor' }],
    start: {
      joints: {
        head: [183, 173], neck: [169, 175], shoulder: [157, 177], hip: [112, 184],
        elbow: [157, 205], wrist: [183, 205],
        knee: [76, 189], ankle: [40, 194], toe: [34, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [183, 173], neck: [169, 175], shoulder: [157, 177], hip: [112, 184],
        elbow: [157, 205], wrist: [183, 205],
        knee: [76, 189], ankle: [40, 194], toe: [34, 208],
      },
      note: { spine: true, arrow: [{ from: [112, 168], dir: 270, len: 14 }], muscle: [[134, 181]] },
    },
    mistake: {
      joints: {
        head: [183, 173], neck: [169, 175], shoulder: [157, 177], hip: [113, 196], spine: [135, 197],
        elbow: [157, 205], wrist: [183, 205],
        knee: [77, 198], ankle: [40, 194], toe: [34, 208],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'bird-dog': {
    view: 'side', zoom: [0, 90, 240, 150],
    equipment: [{ id: 'floor' }],
    start: {
      joints: {
        head: [172, 155], neck: [158, 158], shoulder: [146, 160], hip: [100, 168],
        elbow: [159, 183], wrist: [172, 205], elbow2: [159, 183], wrist2: [172, 205],
        knee: [100, 204], ankle: [64, 204], toe: [49, 207], knee2: [100, 204], ankle2: [64, 204], toe2: [49, 207],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [172, 155], neck: [158, 158], shoulder: [146, 160], hip: [100, 168],
        elbow: [174, 158], wrist: [200, 156], elbow2: [159, 183], wrist2: [172, 205],
        knee: [100, 204], ankle: [64, 204], toe: [49, 207], knee2: [64, 170], ankle2: [28, 172], toe2: [14, 180],
      },
      note: { spine: true, arrow: [{ from: [186, 142], dir: 0, len: 20 }, { from: [44, 158], dir: 180, len: 20 }], muscle: [[123, 164], [90, 166]] },
    },
  },
  'pallof-press': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'cableMid' }],
    load: [{ id: 'handle', at: 'both' }],
    cable: { from: [200, 105], to: 'both' },
    start: {
      joints: {
        head: [110, 60], neck: [110, 74], shoulderL: [90, 86], shoulderR: [130, 86], hip: [110, 132],
        elbowL: [84, 110], wristL: [110, 100], elbowR: [136, 110], wristR: [110, 100],
        kneeL: [100, 168], ankleL: [98, 204], kneeR: [120, 168], ankleR: [122, 204],
      },
    },
    end: {
      joints: {
        head: [110, 60], neck: [110, 74], shoulderL: [90, 86], shoulderR: [130, 86], hip: [110, 132],
        elbowL: [96, 102], wristL: [110, 114], elbowR: [124, 102], wristR: [110, 114],
        kneeL: [100, 168], ankleL: [98, 204], kneeR: [120, 168], ankleR: [122, 204],
      },
      note: { arrow: [{ from: 'wristR', dir: 90, len: 16 }], muscle: [[128, 114]] },
    },
  },
  'side-plank': {
    view: 'side', zoom: [0, 90, 240, 150],
    equipment: [{ id: 'floor' }],
    start: {
      joints: {
        head: [44, 171], neck: [58, 174], shoulder: [70, 177], hip: [109, 201],
        elbow: [70, 205], wrist: [96, 206], elbow2: [74, 150], wrist2: [78, 124],
        knee: [145, 203], ankle: [181, 204], toe: [197, 207], knee2: [145, 203], ankle2: [181, 204], toe2: [197, 207],
      },
    },
    end: {
      joints: {
        head: [44, 171], neck: [58, 174], shoulder: [70, 177], hip: [115, 187],
        elbow: [70, 205], wrist: [96, 206], elbow2: [74, 150], wrist2: [78, 124],
        knee: [150, 195], ankle: [185, 204], toe: [200, 208], knee2: [150, 195], ankle2: [185, 204], toe2: [200, 208],
      },
      note: { arrow: [{ from: [115, 172], dir: 270, len: 18 }], muscle: [[94, 182]] },
    },
  },
}
