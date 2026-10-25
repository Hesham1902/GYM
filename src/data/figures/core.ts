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
  // Side view, cable column standing beside the person (drawn behind, in depth): press the handle straight out from the sternum and hold it there without twisting.
  'pallof-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableMid', x: -136 }],
    load: [{ id: 'handle', at: 'wrist', a: 90 }],
    cable: { from: [64, 105], to: 'wrist', behind: true },
    start: {
      joints: {
        head: [112, 56], neck: [112, 70], shoulder: [112, 82], hip: [112, 128],
        elbow: [114, 108], wrist: [134, 100], elbow2: [112, 108], wrist2: [132, 102],
        knee: [118, 164], ankle: [114, 200], toe: [130, 206],
        knee2: [106, 164], ankle2: [102, 200], toe2: [118, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [112, 56], neck: [112, 70], shoulder: [112, 82], hip: [112, 128],
        elbow: [138, 90], wrist: [164, 96], elbow2: [136, 92], wrist2: [162, 98],
        knee: [118, 164], ankle: [114, 200], toe: [130, 206],
        knee2: [106, 164], ankle2: [102, 200], toe2: [118, 206],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 0, len: 20 }], muscle: [[116, 116]] },
    },
  },
  // Front view of a person on their side (head left, feet right): bottom forearm on the floor under the shoulder, top arm up.
  // The front renderer places hips and eyes across the neck→hip axis, so a lying torso works.
  'side-plank': {
    view: 'front', zoom: [20, 76, 200, 150],
    equipment: [{ id: 'floor' }],
    start: {
      // hips resting on the floor
      joints: {
        head: [50, 153], neck: [62, 162], shoulderL: [50, 178], shoulderR: [74, 146], hip: [99, 190],
        elbowL: [52, 204], wristL: [66, 206], elbowR: [76, 118], wristR: [77, 92],
        kneeL: [132, 199], ankleL: [170, 202], kneeR: [140, 184], ankleR: [176, 187],
      },
    },
    end: {
      // hips lifted until head, hips and feet make one straight line
      joints: {
        head: [50, 154], neck: [64, 158], shoulderL: [58, 177], shoulderR: [70, 139], hip: [108, 171],
        elbowL: [58, 204], wristL: [72, 206], elbowR: [72, 111], wristR: [73, 85],
        kneeL: [140, 190], ankleL: [174, 201], kneeR: [145, 173], ankleR: [180, 184],
      },
      note: { arrow: [{ from: [108, 196], dir: 270, len: 20 }], muscle: [[96, 170]] },
    },
  },
}
