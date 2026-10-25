import type { Figure } from '../../figure/types.ts'

// Posture / kyphosis drills. Person faces +x unless noted. See src/figure/AUTHORING.md for proportions.
// Standing reference pose: ankle y=200, knee 164, hip 128, shoulder 82, neck 70, head 56.
export const postureFigures: Record<string, Figure> = {
  'chin-tuck': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    start: {
      // forward head: head sits in front of the neck line
      joints: {
        head: [115, 61], neck: [104, 70], shoulder: [100, 82], hip: [100, 128],
        elbow: [101, 110], wrist: [103, 136],
        knee: [101, 164], ankle: [100, 200], toe: [116, 206],
      },
    },
    end: {
      // head glided straight back over the shoulders
      joints: {
        head: [99, 56], neck: [100, 70], shoulder: [100, 82], hip: [100, 128],
        elbow: [101, 110], wrist: [103, 136],
        knee: [101, 164], ankle: [100, 200], toe: [116, 206],
      },
      note: { arrow: [{ from: [90, 56], dir: 180, len: 18 }], muscle: [[108, 70]] },
    },
    mistake: {
      // nodding the head down instead of gliding it back
      joints: {
        head: [113, 67], neck: [104, 76], shoulder: [100, 82], hip: [100, 128],
        elbow: [101, 110], wrist: [103, 136],
        knee: [101, 164], ankle: [100, 200], toe: [116, 206],
      },
      note: { mistake: { at: 'head' } },
    },
  },
  'wall-angel': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'wall' }],
    start: {
      // back, head and elbows on the wall; elbows at shoulder height, forearms up along the wall (upper arm points at the viewer)
      joints: {
        head: [84, 56], neck: [82, 70], shoulder: [82, 82], hip: [82, 128],
        elbow: [80, 94], wrist: [79, 68],
        knee: [92, 163], ankle: [98, 200], toe: [114, 206],
      },
    },
    end: {
      // arms slid up overhead, still on the wall
      joints: {
        head: [84, 56], neck: [82, 70], shoulder: [82, 82], hip: [82, 128],
        elbow: [80, 56], wrist: [79, 30],
        knee: [92, 163], ankle: [98, 200], toe: [114, 206],
      },
      note: { arrow: [{ from: 'wrist', dir: 270, len: 18 }], muscle: [[86, 100]] },
    },
    mistake: {
      // lower back arching off the wall
      joints: {
        head: [84, 56], neck: [82, 70], shoulder: [82, 82], hip: [82, 128], spine: [98, 104],
        elbow: [80, 56], wrist: [79, 30],
        knee: [92, 163], ankle: [98, 200], toe: [114, 206],
      },
      note: { mistake: { at: [92, 112] } },
    },
  },
  'doorway-pec-stretch': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'doorFrame' }],
    start: {
      // upright in the doorway, forearm vertical on the frame post, split stance
      joints: {
        head: [112, 56], neck: [112, 70], shoulder: [112, 82], hip: [112, 128],
        elbow: [140, 82], wrist: [140, 56],
        knee: [122, 162], ankle: [134, 196], toe: [148, 203],
        knee2: [104, 162], ankle2: [96, 196], toe2: [112, 203],
      },
      note: { spine: true },
    },
    end: {
      // whole body leans forward through the doorway, chest opens
      joints: {
        head: [132, 58], neck: [130, 72], shoulder: [128, 84], hip: [120, 128],
        elbow: [140, 84], wrist: [140, 58],
        knee: [128, 162], ankle: [134, 196], toe: [148, 203],
        knee2: [108, 162], ankle2: [96, 196], toe2: [112, 203],
      },
      note: { spine: true, arrow: [{ from: [94, 104], dir: 0, len: 18 }], muscle: [[134, 94]] },
    },
  },
  'tspine-extension-roller': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'foamRoller' }],
    zoom: [0, 90, 240, 150],
    start: {
      // face up, roller under the upper back, knees bent, hands behind the head, torso straight
      joints: {
        head: [105, 157], neck: [116, 165], shoulder: [126, 172], hip: [164, 198],
        elbow: [116, 148], wrist: [94, 160],
        knee: [186, 170], ankle: [204, 201], toe: [218, 207],
      },
    },
    end: {
      // upper back extended over the roller, head and shoulders drop back toward the floor
      joints: {
        head: [102, 194], neck: [113, 186], shoulder: [122, 178], hip: [164, 198], spine: [142, 162],
        elbow: [108, 160], wrist: [90, 180],
        knee: [186, 170], ankle: [204, 201], toe: [218, 207],
      },
      note: { arrow: [{ from: [126, 140], dir: 160, len: 30, curve: 8 }], muscle: [[136, 172]] },
    },
  },
  'tspine-extension-chair': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'chair' }],
    start: {
      // sitting tall, upper back against the chair-back top edge, hands behind the head
      joints: {
        head: [90, 80], neck: [92, 94], shoulder: [94, 106], hip: [100, 150],
        elbow: [104, 80], wrist: [80, 72],
        knee: [136, 150], ankle: [136, 198], toe: [152, 206],
      },
    },
    end: {
      // upper back extended over the chair edge, eyes toward the ceiling
      joints: {
        head: [61, 126], neck: [72, 117], shoulder: [82, 110], hip: [100, 150], spine: [98, 98],
        elbow: [56, 100], wrist: [50, 125],
        knee: [136, 150], ankle: [136, 198], toe: [152, 206],
      },
      note: { arrow: [{ from: 'head', dir: 180, len: 18 }], muscle: [[94, 110]] },
    },
  },
  'cat-cow': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    zoom: [0, 90, 240, 150],
    start: {
      // cow: belly drops, chest lifts, eyes slightly forward
      joints: {
        head: [154, 131], neck: [144, 141], shoulder: [134, 152], hip: [90, 168], spine: [112, 180],
        elbow: [134, 180], wrist: [134, 206],
        knee: [90, 204], ankle: [54, 205], toe: [38, 206],
        elbow2: [130, 180], wrist2: [130, 206],
        knee2: [86, 204], ankle2: [50, 205], toe2: [34, 206],
      },
    },
    end: {
      // cat: upper back rounds up toward the ceiling, chin tucks
      joints: {
        head: [152, 171], neck: [143, 160], shoulder: [134, 152], hip: [90, 168], spine: [112, 136],
        elbow: [134, 180], wrist: [134, 206],
        knee: [90, 204], ankle: [54, 205], toe: [38, 206],
        elbow2: [130, 180], wrist2: [130, 206],
        knee2: [86, 204], ankle2: [50, 205], toe2: [34, 206],
      },
      note: { arrow: [{ from: [112, 136], dir: 270, len: 18 }], muscle: [[122, 150]] },
    },
  },
  'prone-ytw': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    zoom: [0, 90, 240, 150],
    start: {
      // face down, head toward +x, Y arm resting on the floor overhead
      joints: {
        head: [178, 194], neck: [164, 198], shoulder: [150, 201], hip: [104, 202], face: 'down',
        elbow: [176, 205], wrist: [202, 206],
        knee: [68, 203], ankle: [32, 204], toe: [17, 207],
      },
    },
    end: {
      // Y arm lifted ~30° off the floor, thumb up, shoulder blade squeezed down
      joints: {
        head: [178, 194], neck: [164, 198], shoulder: [150, 201], hip: [104, 202], face: 'down',
        elbow: [173, 185], wrist: [194, 170],
        knee: [68, 203], ankle: [32, 204], toe: [17, 207],
      },
      note: { arrow: [{ from: 'wrist', dir: 270, len: 18 }], muscle: [[150, 190]] },
    },
  },
  'band-pull-apart': {
    view: 'front',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'band', at: 'both' }],
    start: {
      // arms straight forward at shoulder height (toward the viewer), hands close, band short
      joints: {
        head: [120, 54], neck: [120, 68], shoulderL: [100, 80], shoulderR: [140, 80], hip: [120, 126],
        elbowL: [104, 90], wristL: [108, 100], elbowR: [136, 90], wristR: [132, 100],
        kneeL: [112, 162], ankleL: [112, 198], kneeR: [128, 162], ankleR: [128, 198],
      },
    },
    end: {
      // arms wide, band stretched across the chest, shoulder blades squeezed
      joints: {
        head: [120, 54], neck: [120, 68], shoulderL: [100, 80], shoulderR: [140, 80], hip: [120, 126],
        elbowL: [72, 80], wristL: [46, 80], elbowR: [168, 80], wristR: [194, 80],
        kneeL: [112, 162], ankleL: [112, 198], kneeR: [128, 162], ankleR: [128, 198],
      },
      note: { arrow: [{ from: 'wristL', dir: 180, len: 18 }, { from: 'wristR', dir: 0, len: 18 }], muscle: [[120, 90]] },
    },
  },
  'face-pull': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'cableFace' }],
    load: [{ id: 'ropeHandle', at: 'wrist', a: 90 }],
    cable: { from: [200, 80], to: 'wrist' },
    start: {
      // arms straight forward at face height, split stance, slight lean from the hips
      joints: {
        head: [106, 56], neck: [104, 70], shoulder: [102, 82], hip: [96, 128],
        elbow: [130, 81], wrist: [156, 80],
        knee: [106, 162], ankle: [112, 198], toe: [128, 205],
        knee2: [86, 162], ankle2: [78, 198], toe2: [94, 205],
      },
      note: { spine: true },
    },
    end: {
      // hands beside the ears, elbows high and back, upper arm rotated out
      joints: {
        head: [106, 56], neck: [104, 70], shoulder: [102, 82], hip: [96, 128],
        elbow: [78, 80], wrist: [96, 62],
        knee: [106, 162], ankle: [112, 198], toe: [128, 205],
        knee2: [86, 162], ankle2: [78, 198], toe2: [94, 205],
      },
      note: { spine: true, arrow: [{ from: 'elbow', dir: 190, len: 20 }], muscle: [[90, 90]] },
    },
    mistake: {
      // elbows dropping into a row, shoulders shrugging up
      joints: {
        head: [106, 54], neck: [104, 68], shoulder: [102, 77], hip: [96, 128],
        elbow: [84, 99], wrist: [108, 91],
        knee: [106, 162], ankle: [112, 198], toe: [128, 205],
        knee2: [86, 162], ankle2: [78, 198], toe2: [94, 205],
      },
      note: { mistake: { at: 'elbow' } },
    },
  },
  'scapular-retraction': {
    view: 'side',
    equipment: [{ id: 'pullupBar' }],
    start: {
      // relaxed hang: shoulders up by the ears, neck short, arms straight
      joints: {
        head: [100, 66], neck: [103, 81], shoulder: [108, 86], hip: [110, 132],
        elbow: [114, 58], wrist: [116, 32],
        elbow2: [110, 58], wrist2: [112, 32],
        knee: [114, 168], ankle: [116, 204], toe: [124, 216],
      },
    },
    end: {
      // shoulder blades pulled down and back: body rises, arms still straight, neck long
      joints: {
        head: [100, 52], neck: [102, 66], shoulder: [108, 79], hip: [110, 125],
        elbow: [113, 56], wrist: [116, 32],
        elbow2: [109, 56], wrist2: [112, 32],
        knee: [114, 161], ankle: [116, 197], toe: [124, 209],
      },
      note: { arrow: [{ from: [94, 78], dir: 90, len: 18 }], muscle: [[100, 100]] },
    },
  },
  'dead-hang': {
    view: 'side',
    equipment: [{ id: 'pullupBar' }],
    start: {
      // relaxed hang, arms straight, shoulders rise toward the ears, eyes forward
      joints: {
        head: [100, 66], neck: [103, 81], shoulder: [108, 86], hip: [110, 132],
        elbow: [114, 58], wrist: [116, 32],
        elbow2: [110, 58], wrist2: [112, 32],
        knee: [114, 168], ankle: [116, 204], toe: [124, 216],
      },
    },
    end: {
      joints: {
        head: [100, 66], neck: [103, 81], shoulder: [108, 86], hip: [110, 132],
        elbow: [114, 58], wrist: [116, 32],
        elbow2: [110, 58], wrist2: [112, 32],
        knee: [114, 168], ankle: [116, 204], toe: [124, 216],
      },
      note: { arrow: [{ from: [128, 120], dir: 90, len: 20 }], muscle: [[100, 100]] },
    },
  },
  'lat-stretch': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'wall', x: 100 }],
    start: {
      // upright, one hand on the post at shoulder height, other arm hanging
      joints: {
        head: [110, 56], neck: [110, 70], shoulder: [110, 82], hip: [110, 128],
        elbow: [138, 82], wrist: [164, 82],
        elbow2: [108, 110], wrist2: [106, 136],
        knee: [112, 164], ankle: [112, 200], toe: [128, 206],
      },
      note: { spine: true },
    },
    end: {
      // hips sat back, torso near horizontal, holding arm long, eyes to the floor
      joints: {
        head: [150, 111], neck: [136, 115], shoulder: [124, 118], hip: [80, 130],
        elbow: [144, 100], wrist: [164, 82],
        elbow2: [122, 146], wrist2: [120, 172],
        knee: [92, 165], ankle: [96, 200], toe: [112, 206],
      },
      note: { spine: true, arrow: [{ from: 'hip', dir: 180, len: 20 }], muscle: [[110, 128]] },
    },
  },
}
