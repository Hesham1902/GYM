import type { Figure } from '../../figure/types.ts'

// Shoulder figures. Side view: person faces +x. Front view: L = viewer's left. Equipment contact points: src/figure/equipment.ts docs.
// Seated figures use the same seat-to-floor leg as the chest reference (knee at seat height, shin ≈ 48).
export const shouldersFigures: Record<string, Figure> = {
  // Shoulder press machine: back and head on the pad, handles start at ear level and press straight up.
  'shoulder-press-machine': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'shoulderPress' }],
    lever: [{ pivot: [166, 112], to: 'wrist' }],
    start: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [126, 118], wrist: [126, 92],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [118, 81], wrist: [121, 55],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { spine: true, arrow: [{ from: 'wrist', dir: 270, len: 20 }], muscle: ['shoulder'] },
    },
    // Lower back arching off the pad, ribs flaring, to get the weight up.
    mistake: {
      joints: {
        head: [108, 76], neck: [105, 90], shoulder: [102, 102], hip: [106, 150], spine: [120, 130],
        elbow: [118, 79], wrist: [121, 53],
        knee: [146, 150], ankle: [146, 198], toe: [164, 206],
      },
      note: { mistake: { at: [98, 134] } },
    },
  },
  // Seated dumbbell press on an upright seat: dumbbells start at ear height, forearms vertical, pressed up and slightly in.
  'seated-db-shoulder-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'seat' }],
    load: [{ id: 'dumbbell', at: 'wrist' }],
    start: {
      joints: {
        head: [104, 78], neck: [103, 92], shoulder: [104, 104], hip: [110, 150], spine: [104, 127],
        elbow: [132, 108], wrist: [130, 82],
        knee: [150, 150], ankle: [150, 198], toe: [168, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [104, 78], neck: [103, 92], shoulder: [104, 104], hip: [110, 150], spine: [104, 127],
        elbow: [119, 80], wrist: [118, 54],
        knee: [150, 150], ankle: [150, 198], toe: [168, 206],
      },
      note: { spine: true, arrow: [{ from: [118, 44], dir: 270, len: 18 }], muscle: ['shoulder'] },
    },
  },
  // Smith shoulder press: seat shifted back so the bar (x=120) passes just in front of the face, from chin level straight up.
  'smith-shoulder-press': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'smith' }, { id: 'seat', x: -10 }],
    load: [{ id: 'barbell', at: 'wrist' }],
    start: {
      joints: {
        head: [94, 78], neck: [93, 92], shoulder: [94, 104], hip: [100, 150], spine: [94, 127],
        elbow: [118, 118], wrist: [120, 92],
        knee: [140, 150], ankle: [140, 198], toe: [158, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [94, 78], neck: [93, 92], shoulder: [94, 104], hip: [100, 150], spine: [94, 127],
        elbow: [113, 83], wrist: [120, 58],
        knee: [140, 150], ankle: [140, 198], toe: [158, 206],
      },
      note: { spine: true, arrow: [{ from: [120, 42], dir: 270, len: 16 }], muscle: ['shoulder'] },
    },
  },
  // Pike push-up: inverted V, hands at left, feet at right on the toes. Start = top of the head near the floor in front of the hands.
  'pike-push-up': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    zoom: [0, 90, 240, 150],
    start: {
      joints: {
        head: [58, 190], neck: [69, 178], shoulder: [78, 170], hip: [108, 134], face: 'down',
        elbow: [95, 192], wrist: [72, 205],
        knee: [131, 167], ankle: [164, 196], toe: [172, 208],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [72, 169], neck: [84, 163], shoulder: [94, 156], hip: [124, 122], face: 'down',
        elbow: [85, 182], wrist: [72, 205],
        knee: [142, 158], ankle: [164, 196], toe: [172, 208],
      },
      note: { spine: true, arrow: [{ from: [84, 146], dir: 294, len: 20 }], muscle: ['shoulder'] },
    },
  },
  // Dumbbell lateral raise, front view: elbows lead out to shoulder height, hands a touch lower (thumbs level or down).
  'lateral-raise': {
    view: 'front',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'both' }],
    start: {
      joints: {
        head: [120, 64], neck: [120, 78], shoulderL: [100, 84], shoulderR: [140, 84], hip: [120, 124],
        elbowL: [95, 112], wristL: [90, 138], elbowR: [145, 112], wristR: [150, 138],
        kneeL: [109, 164], ankleL: [108, 204], kneeR: [131, 164], ankleR: [132, 204],
      },
    },
    end: {
      joints: {
        head: [120, 64], neck: [120, 78], shoulderL: [100, 84], shoulderR: [140, 84], hip: [120, 124],
        elbowL: [73, 78], wristL: [48, 84], elbowR: [167, 78], wristR: [192, 84],
        kneeL: [109, 164], ankleL: [108, 204], kneeR: [131, 164], ankleR: [132, 204],
      },
      note: { arrow: [{ from: 'elbowL', dir: 270, len: 20 }, { from: 'elbowR', dir: 270, len: 20 }], muscle: ['shoulderL', 'shoulderR'] },
    },
    // Shrug: shoulders hiked up to the ears so the traps lift the weight.
    mistake: {
      joints: {
        head: [120, 64], neck: [120, 78], shoulderL: [100, 74], shoulderR: [140, 74], hip: [120, 124],
        elbowL: [73, 68], wristL: [48, 74], elbowR: [167, 68], wristR: [192, 74],
        kneeL: [109, 164], ankleL: [108, 204], kneeR: [131, 164], ankleR: [132, 204],
      },
      note: { mistake: { at: 'neck' } },
    },
  },
  // Cable lateral raise, front view: column at right, near hand holds the frame, far (left) hand pulls the low cable across the body.
  'cable-lateral-raise': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'cableLow' }],
    load: [{ id: 'handle', at: 'wristL' }],
    cable: { from: [200, 195], to: 'wristL' },
    start: {
      joints: {
        head: [150, 64], neck: [150, 78], shoulderL: [130, 84], shoulderR: [170, 84], hip: [150, 124],
        elbowL: [136, 111], wristL: [156, 128], elbowR: [192, 102], wristR: [197, 127],
        kneeL: [139, 164], ankleL: [138, 204], kneeR: [161, 164], ankleR: [162, 204],
      },
    },
    end: {
      joints: {
        head: [150, 64], neck: [150, 78], shoulderL: [130, 84], shoulderR: [170, 84], hip: [150, 124],
        elbowL: [103, 78], wristL: [78, 84], elbowR: [192, 102], wristR: [197, 127],
        kneeL: [139, 164], ankleL: [138, 204], kneeR: [161, 164], ankleR: [162, 204],
      },
      note: { arrow: [{ from: 'elbowL', dir: 270, len: 20 }], muscle: ['shoulderL'] },
    },
  },
  // Machine lateral raise, front view, seated: the pads sit on the outside of the elbows (levers pivot at the shoulders),
  // elbows bent 90° with the forearms toward the viewer, rising to shoulder height.
  'machine-lateral-raise': {
    view: 'front',
    equipment: [{ id: 'floor' }, { id: 'benchEnd' }],
    lever: [{ pivot: [100, 106], to: 'elbowL', end: 'roller', off: [-8, 0] }, { pivot: [140, 106], to: 'elbowR', end: 'roller', off: [8, 0] }],
    start: {
      joints: {
        head: [120, 78], neck: [120, 92], shoulderL: [100, 104], shoulderR: [140, 104], hip: [120, 146],
        elbowL: [97, 131], wristL: [106, 138], elbowR: [143, 131], wristR: [134, 138],
        kneeL: [108, 160], ankleL: [106, 204], kneeR: [132, 160], ankleR: [134, 204],
      },
    },
    end: {
      joints: {
        head: [120, 78], neck: [120, 92], shoulderL: [100, 104], shoulderR: [140, 104], hip: [120, 146],
        elbowL: [73, 104], wristL: [80, 112], elbowR: [167, 104], wristR: [160, 112],
        kneeL: [108, 160], ankleL: [106, 204], kneeR: [132, 160], ankleR: [134, 204],
      },
      note: { arrow: [{ from: 'elbowL', dir: 250, len: 18 }, { from: 'elbowR', dir: 290, len: 18 }], muscle: ['shoulderL', 'shoulderR'] },
    },
  },
}
