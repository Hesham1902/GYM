import type { Figure } from '../../figure/types.ts'

// Posterior chain. Person faces +x. Contact points: src/figure/equipment.ts docs.
export const legsPosteriorFigures: Record<string, Figure> = {
  'seated-leg-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legCurlSeated' }],
    lever: [{ pivot: [143, 151], to: 'ankle', end: 'roller', off: [-5, 8] }],
    start: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [98, 130], wrist: [118, 146],
        knee: [142, 152], ankle: [178, 150], toe: [184, 135],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [106, 78], neck: [104, 92], shoulder: [102, 104], hip: [106, 150], spine: [100, 128],
        elbow: [98, 130], wrist: [118, 146],
        knee: [142, 152], ankle: [130, 188], toe: [145, 193],
      },
      note: { spine: true, arrow: [{ from: [150, 176], dir: 200, len: 22, curve: 6 }], muscle: [[124, 160]] },
    },
    mistake: {
      joints: {
        head: [108, 68], neck: [106, 82], shoulder: [104, 94], hip: [108, 140], spine: [102, 118],
        elbow: [100, 120], wrist: [120, 136],
        knee: [144, 142], ankle: [132, 178], toe: [147, 183],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'lying-leg-curl': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'legCurlLying' }],
    lever: [{ pivot: [167, 143], to: 'ankle', end: 'roller', off: [-3, -9] }],
    start: {
      joints: {
        head: [58, 140], neck: [72, 142], shoulder: [84, 142], hip: [130, 142], face: 'back',
        elbow: [70, 164], wrist: [72, 190],
        knee: [166, 142], ankle: [202, 146], toe: [206, 161],
      },
    },
    end: {
      joints: {
        head: [58, 140], neck: [72, 142], shoulder: [84, 142], hip: [130, 142], face: 'back',
        elbow: [70, 164], wrist: [72, 190],
        knee: [166, 142], ankle: [152, 108], toe: [137, 114],
      },
      note: { arrow: [{ from: [186, 118], dir: 230, len: 22, curve: -6 }], muscle: [[148, 134]] },
    },
    mistake: {
      joints: {
        head: [58, 140], neck: [72, 142], shoulder: [84, 142], hip: [130, 128], spine: [110, 126], face: 'back',
        elbow: [70, 164], wrist: [72, 190],
        knee: [166, 132], ankle: [152, 98], toe: [137, 104],
      },
      note: { mistake: { at: 'hip' } },
    },
  },
  'slider-leg-curl': {
    view: 'side', zoom: [0, 90, 240, 150],
    equipment: [{ id: 'floor' }],
    start: {
      joints: {
        head: [42, 198], neck: [56, 199], shoulder: [68, 200], hip: [112, 188],
        elbow: [94, 205], wrist: [120, 206],
        knee: [147, 178], ankle: [170, 206], toe: [178, 194],
      },
    },
    end: {
      joints: {
        head: [42, 198], neck: [56, 199], shoulder: [68, 200], hip: [106, 176],
        elbow: [94, 205], wrist: [120, 206],
        knee: [140, 166], ankle: [147, 203], toe: [156, 192],
      },
      note: { arrow: [{ from: [176, 194], dir: 180, len: 22 }], muscle: [[124, 180], [102, 186]] },
    },
  },
  'db-rdl': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'dumbbell', at: 'both', a: 90 }],
    start: {
      joints: {
        head: [118, 60], neck: [118, 74], shoulder: [118, 86], hip: [118, 132], spine: [115, 109],
        elbow: [120, 114], wrist: [122, 140], elbow2: [120, 114], wrist2: [122, 140],
        knee: [120, 168], ankle: [118, 204], toe: [134, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [153, 95], neck: [142, 102], shoulder: [133, 110], hip: [98, 140], spine: [113, 122],
        elbow: [131, 138], wrist: [129, 164], elbow2: [131, 138], wrist2: [129, 164],
        knee: [118, 170], ankle: [118, 204], toe: [134, 206],
      },
      note: { spine: true, arrow: [{ from: [104, 126], dir: 180, len: 20 }], muscle: [[102, 158], [86, 146]] },
    },
    mistake: {
      joints: {
        head: [143, 92], neck: [136, 104], shoulder: [130, 114], hip: [98, 140], spine: [119, 133],
        elbow: [128, 142], wrist: [126, 168], elbow2: [128, 142], wrist2: [126, 168],
        knee: [118, 170], ankle: [118, 204], toe: [134, 206],
      },
      note: { mistake: { at: 'shoulder' } },
    },
  },
  'barbell-rdl': {
    view: 'side',
    equipment: [{ id: 'floor' }],
    load: [{ id: 'barbell', at: 'wrist' }],
    start: {
      joints: {
        head: [118, 60], neck: [118, 74], shoulder: [118, 86], hip: [118, 132], spine: [115, 109],
        elbow: [120, 114], wrist: [122, 140],
        knee: [120, 168], ankle: [118, 204], toe: [134, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [153, 95], neck: [142, 102], shoulder: [133, 110], hip: [98, 140], spine: [113, 122],
        elbow: [131, 138], wrist: [129, 164],
        knee: [118, 170], ankle: [118, 204], toe: [134, 206],
      },
      note: { spine: true, arrow: [{ from: [104, 126], dir: 180, len: 20 }], muscle: [[102, 158], [86, 146]] },
    },
    mistake: {
      joints: {
        head: [143, 92], neck: [136, 104], shoulder: [130, 114], hip: [98, 140], spine: [119, 133],
        elbow: [128, 142], wrist: [126, 168],
        knee: [118, 170], ankle: [118, 204], toe: [134, 206],
      },
      note: { mistake: { at: 'shoulder' } },
    },
  },
  'cable-pull-through': {
    // Scene is mirrored: the person ends up facing left with the low pulley behind them on the right.
    view: 'side',
    flip: true,
    equipment: [{ id: 'floor' }, { id: 'cableLow', flip: true, x: 240 }],
    load: [{ id: 'ropeHandle', at: 'wrist', a: 65 }],
    cable: { from: [40, 195], to: 'wrist' },
    start: {
      joints: {
        head: [170, 104], neck: [158, 111], shoulder: [148, 117], hip: [108, 140], spine: [126, 126],
        elbow: [131, 139], wrist: [115, 160],
        knee: [128, 170], ankle: [128, 204], toe: [144, 206],
      },
      note: { spine: true },
    },
    end: {
      joints: {
        head: [128, 62], neck: [128, 76], shoulder: [128, 88], hip: [128, 134], spine: [125, 111],
        elbow: [130, 116], wrist: [132, 142],
        knee: [128, 170], ankle: [128, 204], toe: [144, 206],
      },
      note: { spine: true, arrow: [{ from: [140, 130], dir: 0, len: 20 }], muscle: [[116, 140], [118, 154]] },
    },
  },
  // 45° bench, front of the body toward the lower right. Legs lie on the body line x+y=239, hips just past the pad end.
  'back-extension': {
    view: 'side',
    equipment: [{ id: 'floor' }, { id: 'backExtension' }],
    start: {
      // hinged at the hips, torso hanging down past the pad, arms crossed on the chest
      joints: {
        head: [169, 171], neck: [160, 160], shoulder: [153, 151], hip: [124, 115],
        elbow: [152, 172], wrist: [145, 161],
        knee: [98, 141], ankle: [73, 166], toe: [84, 177],
      },
      note: { spine: true },
    },
    end: {
      // torso back in line with the legs, not past it
      joints: {
        head: [175, 64], neck: [165, 74], shoulder: [157, 83], hip: [124, 115],
        elbow: [177, 80], wrist: [167, 89],
        knee: [98, 141], ankle: [73, 166], toe: [84, 177],
      },
      note: { spine: true, arrow: [{ from: [178, 120], dir: 300, len: 24, curve: 8 }], muscle: [[116, 100], [108, 120]] },
    },
    // over-arching: lifting past the straight line, lower back pinched
    mistake: {
      joints: {
        head: [154, 50], neck: [148, 62], shoulder: [143, 73], hip: [124, 115], spine: [126, 90],
        elbow: [162, 64], wrist: [156, 76],
        knee: [98, 141], ankle: [73, 166], toe: [84, 177],
      },
      note: { mistake: { at: [124, 98] } },
    },
  },
}
