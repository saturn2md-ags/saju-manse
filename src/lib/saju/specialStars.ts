import { SpecialStar, FourPillars } from '@/types/saju';

// ==========================================
// 주요 12신살 (Special Stars) 계산
// ==========================================

const PILLAR_NAMES = ['년', '월', '일', '시'] as const;

// 천을귀인 (天乙貴人) - 일간 기준
const CHEONUL_GUIIN: Record<number, number[]> = {
  0: [1, 7], 1: [0, 8], 2: [11, 9], 3: [11, 9], 4: [1, 7],
  5: [0, 8], 6: [1, 7], 7: [2, 6], 8: [3, 5], 9: [3, 5],
};

// 역마살 (驛馬殺) - 년지 or 일지 기준
const YEOKMA: Record<number, number> = {
  0: 2, 1: 11, 2: 8, 3: 5, 4: 2, 5: 11,
  6: 8, 7: 5, 8: 2, 9: 11, 10: 8, 11: 5,
};

// 도화살 (桃花殺) - 년지 or 일지 기준
const DOHWA: Record<number, number> = {
  2: 3, 6: 3, 10: 3, 8: 9, 0: 9, 4: 9,
  5: 6, 9: 6, 1: 6, 11: 0, 3: 0, 7: 0,
};

// 화개살 (華蓋殺) - 년지 or 일지 기준
const HWAGAE: Record<number, number> = {
  0: 4, 1: 1, 2: 10, 3: 7, 4: 4, 5: 1,
  6: 10, 7: 7, 8: 4, 9: 1, 10: 10, 11: 7,
};

// 양인살 (羊刃殺) - 일간 기준
const YANGIN: Record<number, number> = {
  0: 3, 1: 4, 2: 6, 3: 7, 4: 6, 5: 7, 6: 9, 7: 10, 8: 0, 9: 1,
};

// 홍염살 (紅艶殺) - 일간 기준
const HONGYEOM: Record<number, number> = {
  0: 6, 1: 8, 2: 2, 3: 7, 4: 4, 5: 4, 6: 10, 7: 9, 8: 0, 9: 8,
};

// 겁살 (劫殺) - 년지 or 일지 기준
const GEOBSAL: Record<number, number> = {
  0: 5, 1: 2, 2: 11, 3: 8, 4: 5, 5: 2,
  6: 11, 7: 8, 8: 5, 9: 2, 10: 11, 11: 8,
};

// 장성살 (將星殺) - 년지 or 일지 기준
const JANGSEONGSAL: Record<number, number> = {
  0: 0, 1: 9, 2: 6, 3: 3, 4: 0, 5: 9,
  6: 6, 7: 3, 8: 0, 9: 9, 10: 6, 11: 3,
};

// 반안살 (攀鞍殺) - 년지 or 일지 기준
const BANANSAL: Record<number, number> = {
  0: 1, 1: 10, 2: 7, 3: 4, 4: 1, 5: 10,
  6: 7, 7: 4, 8: 1, 9: 10, 10: 7, 11: 4,
};

// 귀문관살 (鬼門關殺) - 일지 기준
const GWIMUN: Record<number, number> = {
  0: 9, 1: 6, 2: 7, 3: 8, 4: 5, 5: 4, 6: 1, 7: 2, 8: 3, 9: 0, 10: 11, 11: 10,
};

// 백호살 (白虎殺) - 삼합 기준
const BAEKHO: Record<number, number> = {
  2: 4, 6: 4, 10: 4, 8: 10, 0: 10, 4: 10,
  5: 7, 9: 7, 1: 7, 11: 1, 3: 1, 7: 1,
};

// 괴강살 (魁罡殺) - 특정 간지 조합: 庚辰, 壬辰, 庚戌, 壬戌
const GOEGANG_PAIRS: Array<[number, number]> = [
  [6, 4], [8, 4], [6, 10], [8, 10],
];

// ==========================================
// 신살 분석 함수
// ==========================================
export function analyzeSpecialStars(pillars: FourPillars): SpecialStar[] {
  const stars: SpecialStar[] = [];
  const dayMaster = pillars.day.stem;
  const yearBranch = pillars.year.branch;
  const dayBranch = pillars.day.branch;
  const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];

  // 헬퍼: 일간 기준 단일 지지 체크
  function checkStemTarget(name: string, table: Record<number, number>, isPositive: boolean) {
    const target = table[dayMaster];
    for (let i = 0; i < 4; i++) {
      if (branches[i] === target) {
        stars.push({ name, position: `${PILLAR_NAMES[i]}지`, isPositive });
      }
    }
  }

  // 헬퍼: 기준지 → 목표 지지 매핑
  function checkStarFromBase(
    name: string,
    table: Record<number, number>,
    baseBranch: number,
    isPositive: boolean,
  ) {
    const target = table[baseBranch];
    for (let i = 0; i < 4; i++) {
      if (branches[i] === target) {
        stars.push({ name, position: `${PILLAR_NAMES[i]}지`, isPositive });
      }
    }
  }

  // 1. 천을귀인 (일간 기준, 복수 지지)
  const guiinBranches = CHEONUL_GUIIN[dayMaster];
  for (let i = 0; i < 4; i++) {
    if (guiinBranches.includes(branches[i])) {
      stars.push({ name: '천을귀인', position: `${PILLAR_NAMES[i]}지`, isPositive: true });
    }
  }

  // 2. 역마살 (년지 + 일지 기준)
  checkStarFromBase('역마살', YEOKMA, yearBranch, false);
  checkStarFromBase('역마살', YEOKMA, dayBranch, false);

  // 3. 도화살 (년지 + 일지 기준)
  checkStarFromBase('도화살', DOHWA, yearBranch, false);
  checkStarFromBase('도화살', DOHWA, dayBranch, false);

  // 4. 화개살 (년지 + 일지 기준)
  checkStarFromBase('화개살', HWAGAE, yearBranch, true);
  checkStarFromBase('화개살', HWAGAE, dayBranch, true);

  // 5. 양인살 (일간 기준)
  checkStemTarget('양인살', YANGIN, false);

  // 6. 홍염살 (일간 기준)
  checkStemTarget('홍염살', HONGYEOM, false);

  // 7. 겁살 (년지 + 일지 기준)
  checkStarFromBase('겁살', GEOBSAL, yearBranch, false);
  checkStarFromBase('겁살', GEOBSAL, dayBranch, false);

  // 8. 장성살 (년지 + 일지 기준)
  checkStarFromBase('장성살', JANGSEONGSAL, yearBranch, true);
  checkStarFromBase('장성살', JANGSEONGSAL, dayBranch, true);

  // 9. 반안살 (년지 + 일지 기준)
  checkStarFromBase('반안살', BANANSAL, yearBranch, true);
  checkStarFromBase('반안살', BANANSAL, dayBranch, true);

  // 10. 귀문관살 (일지 기준)
  checkStarFromBase('귀문관살', GWIMUN, dayBranch, false);

  // 11. 백호살 (년지 기준)
  checkStarFromBase('백호살', BAEKHO, yearBranch, false);

  // 12. 괴강살 (특정 간지 조합)
  {
    const pillarsArr = [pillars.year, pillars.month, pillars.day, pillars.hour];
    for (let i = 0; i < 4; i++) {
      const s = pillarsArr[i].stem;
      const b = pillarsArr[i].branch;
      for (const [ps, pb] of GOEGANG_PAIRS) {
        if (s === ps && b === pb) {
          stars.push({ name: '괴강살', position: `${PILLAR_NAMES[i]}주`, isPositive: false });
          break;
        }
      }
    }
  }

  // 중복 제거
  const unique: SpecialStar[] = [];
  const seen = new Set<string>();
  for (const star of stars) {
    const key = `${star.name}-${star.position}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(star);
    }
  }

  return unique;
}

// ==========================================
// 대운/세운/월운용 신살 계산
// ==========================================

const BRANCH_BASED_STARS: { name: string; table: Record<number, number> }[] = [
  { name: '역마살', table: YEOKMA },
  { name: '도화살', table: DOHWA },
  { name: '화개살', table: HWAGAE },
  { name: '겁살', table: GEOBSAL },
  { name: '장성살', table: JANGSEONGSAL },
  { name: '반안살', table: BANANSAL },
  { name: '귀문관살', table: GWIMUN },
  { name: '백호살', table: BAEKHO },
];

const STEM_BASED_STARS: { name: string; table: Record<number, number> }[] = [
  { name: '양인살', table: YANGIN },
  { name: '홍염살', table: HONGYEOM },
];

export function getSpecialStarsForBranch(
  targetBranch: number,
  yearBranch: number,
  dayBranch: number,
  dayMaster?: number,
): string[] {
  const stars = new Set<string>();

  for (const { name, table } of BRANCH_BASED_STARS) {
    if (table[yearBranch] === targetBranch || table[dayBranch] === targetBranch) {
      stars.add(name);
    }
  }

  if (dayMaster !== undefined) {
    for (const { name, table } of STEM_BASED_STARS) {
      if (table[dayMaster] === targetBranch) {
        stars.add(name);
      }
    }

    const guiinTargets = CHEONUL_GUIIN[dayMaster];
    if (guiinTargets && guiinTargets.includes(targetBranch)) {
      stars.add('천을귀인');
    }
  }

  return Array.from(stars);
}
