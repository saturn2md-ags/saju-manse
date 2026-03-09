import { Interaction, FourPillars } from '@/types/saju';
import {
  STEM_COMBINATIONS,
  BRANCH_CLASHES,
  BRANCH_TRIPLE_COMBINATIONS,
  BRANCH_DIRECTIONAL,
  BRANCH_SIX_COMBINATIONS,
  BRANCH_PENALTIES,
  BRANCH_BREAKS,
  BRANCH_HARMS,
} from '@/lib/constants/lookupTables';
import { STEMS, STEMS_HANJA } from '@/lib/constants/stems';
import { BRANCHES, BRANCHES_HANJA } from '@/lib/constants/branches';

const PILLAR_NAMES = ['년', '월', '일', '시'] as const;

function getPillarStems(pillars: FourPillars): number[] {
  return [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
}

function getPillarBranches(pillars: FourPillars): number[] {
  return [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
}

// ==========================================
// 합충형파해 분석
// ==========================================
export function analyzeInteractions(pillars: FourPillars): Interaction[] {
  const interactions: Interaction[] = [];
  const stems = getPillarStems(pillars);
  const branches = getPillarBranches(pillars);

  // 1. 천간합 (Stem Combinations)
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const [s1, s2, desc] of STEM_COMBINATIONS) {
        if ((stems[i] === s1 && stems[j] === s2) || (stems[i] === s2 && stems[j] === s1)) {
          interactions.push({
            type: '천간합',
            positions: [`${PILLAR_NAMES[i]}간`, `${PILLAR_NAMES[j]}간`],
            description: `${STEMS_HANJA[stems[i]]}${STEMS_HANJA[stems[j]]} ${desc}`,
          });
        }
      }
    }
  }

  // 2. 지지충 (Branch Clashes)
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const [b1, b2] of BRANCH_CLASHES) {
        if ((branches[i] === b1 && branches[j] === b2) || (branches[i] === b2 && branches[j] === b1)) {
          interactions.push({
            type: '지지충',
            positions: [`${PILLAR_NAMES[i]}지`, `${PILLAR_NAMES[j]}지`],
            description: `${BRANCHES_HANJA[branches[i]]}${BRANCHES_HANJA[branches[j]]}충`,
          });
        }
      }
    }
  }

  // 3. 지지 삼합 (Triple Combinations)
  for (const [b1, b2, b3, desc] of BRANCH_TRIPLE_COMBINATIONS) {
    const tripleSet = [b1, b2, b3];
    const matchPositions: string[] = [];
    const matchCount = tripleSet.filter(b => {
      const idx = branches.indexOf(b);
      if (idx !== -1) {
        matchPositions.push(`${PILLAR_NAMES[idx]}지`);
        return true;
      }
      return false;
    }).length;

    if (matchCount >= 2) {
      interactions.push({
        type: '지지삼합',
        positions: matchPositions,
        description: matchCount === 3 ? `${desc} (완전삼합)` : `${desc} (반합)`,
      });
    }
  }

  // 4. 지지 방합 (Directional Combinations)
  for (const [branchSet, desc] of BRANCH_DIRECTIONAL) {
    const matchPositions: string[] = [];
    const matchCount = branchSet.filter(b => {
      const idx = branches.indexOf(b);
      if (idx !== -1) {
        matchPositions.push(`${PILLAR_NAMES[idx]}지`);
        return true;
      }
      return false;
    }).length;

    if (matchCount >= 3) {
      interactions.push({
        type: '지지방합',
        positions: matchPositions,
        description: desc,
      });
    }
  }

  // 5. 지지 육합 (Six Combinations)
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const [b1, b2, desc] of BRANCH_SIX_COMBINATIONS) {
        if ((branches[i] === b1 && branches[j] === b2) || (branches[i] === b2 && branches[j] === b1)) {
          interactions.push({
            type: '지지육합',
            positions: [`${PILLAR_NAMES[i]}지`, `${PILLAR_NAMES[j]}지`],
            description: `${BRANCHES_HANJA[branches[i]]}${BRANCHES_HANJA[branches[j]]} ${desc}`,
          });
        }
      }
    }
  }

  // 6. 지지형 (Penalties)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === j) continue;
      for (const [b1, b2, desc] of BRANCH_PENALTIES) {
        if (branches[i] === b1 && branches[j] === b2) {
          // 중복 방지
          const key = `형-${Math.min(i, j)}-${Math.max(i, j)}`;
          if (!interactions.find(inter => inter.description === desc)) {
            interactions.push({
              type: '지지형',
              positions: [`${PILLAR_NAMES[i]}지`, `${PILLAR_NAMES[j]}지`],
              description: `${BRANCHES_HANJA[branches[i]]}${BRANCHES_HANJA[branches[j]]} ${desc}`,
            });
          }
        }
      }
    }
  }

  // 7. 지지파 (Breaks)
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const [b1, b2, desc] of BRANCH_BREAKS) {
        if ((branches[i] === b1 && branches[j] === b2) || (branches[i] === b2 && branches[j] === b1)) {
          interactions.push({
            type: '지지파',
            positions: [`${PILLAR_NAMES[i]}지`, `${PILLAR_NAMES[j]}지`],
            description: `${BRANCHES_HANJA[branches[i]]}${BRANCHES_HANJA[branches[j]]} ${desc}`,
          });
        }
      }
    }
  }

  // 8. 지지해 (Harms)
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const [b1, b2, desc] of BRANCH_HARMS) {
        if ((branches[i] === b1 && branches[j] === b2) || (branches[i] === b2 && branches[j] === b1)) {
          interactions.push({
            type: '지지해',
            positions: [`${PILLAR_NAMES[i]}지`, `${PILLAR_NAMES[j]}지`],
            description: `${BRANCHES_HANJA[branches[i]]}${BRANCHES_HANJA[branches[j]]} ${desc}`,
          });
        }
      }
    }
  }

  return interactions;
}
