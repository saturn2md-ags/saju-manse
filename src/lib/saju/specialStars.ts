import { SpecialStar, FourPillars } from '@/types/saju';

// ==========================================
// 신살 (Special Stars) 계산 - 22개
// ==========================================

const PILLAR_NAMES = ['년', '월', '일', '시'] as const;

// 우선순위 (낮을수록 높은 순위)
const STAR_PRIORITY: Record<string, number> = {
  // S급
  '천을귀인': 0, '태극귀인': 1, '양인살': 2, '괴강살': 3, '역마살': 4, '도화살': 5,
  // A급
  '천덕귀인': 10, '월덕귀인': 11, '문창귀인': 12, '화개살': 13,
  '겁살': 14, '백호살': 15, '귀문관살': 16, '원진살': 17, '홍염살': 18, '건록': 19,
  // B급
  '학당귀인': 20, '문곡귀인': 21, '금여록': 22, '장성살': 23, '반안살': 24, '망신살': 25,
};

// ==========================================
// 조견표
// ==========================================

// 천을귀인 (天乙貴人) - 일간 기준
const CHEONUL_GUIIN: Record<number, number[]> = {
  0: [1, 7], 1: [0, 8], 2: [11, 9], 3: [11, 9], 4: [1, 7],
  5: [0, 8], 6: [1, 7], 7: [2, 6], 8: [3, 5], 9: [3, 5],
};

// 태극귀인 (太極貴人) - 일간 기준, 복수 지지
const TAEGEUK: Record<number, number[]> = {
  0: [0, 6], 1: [0, 6], 2: [3, 9], 3: [3, 9], 4: [4, 10, 1, 7],
  5: [4, 10, 1, 7], 6: [2, 11], 7: [2, 11], 8: [5, 8], 9: [5, 8],
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

// 문창귀인 (文昌貴人) - 일간 기준
const MUNCHANG: Record<number, number> = {
  0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3,
};

// 금여록 (金輿祿) - 일간 기준
const GEUMYEO: Record<number, number> = {
  0: 4, 1: 5, 2: 7, 3: 8, 4: 7, 5: 8, 6: 10, 7: 11, 8: 1, 9: 2,
};

// 건록 (建祿) - 일간 기준
const GEONROK: Record<number, number> = {
  0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0,
};

// 원진살 (怨嗔殺) - 지지 쌍
const WONJIN: Record<number, number> = {
  0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1, 7: 0, 8: 11, 9: 10, 10: 9, 11: 8,
};

// 망신살 (亡神殺) - 년지/일지 기준
const MANGSIN: Record<number, number> = {
  0: 11, 1: 8, 2: 5, 3: 2, 4: 11, 5: 8, 6: 5, 7: 2, 8: 11, 9: 8, 10: 5, 11: 2,
};

// 학당귀인 (學堂貴人) - 일간의 장생지
const HAKDANG: Record<number, number> = {
  0: 11, 1: 6, 2: 2, 3: 9, 4: 2, 5: 9, 6: 5, 7: 0, 8: 8, 9: 3,
};

// 문곡귀인 (文曲貴人) - 일간 기준
const MUNGOK: Record<number, number> = {
  0: 11, 1: 0, 2: 2, 3: 3, 4: 2, 5: 3, 6: 5, 7: 6, 8: 8, 9: 9,
};

// 천덕귀인 (天德貴人) - 월지 기준
const CHEONDUK_STEM: Record<number, number> = {
  2: 3, 4: 8, 5: 7, 7: 0, 8: 9, 10: 2, 11: 1, 1: 6,
};
const CHEONDUK_BRANCH: Record<number, number> = {
  3: 8, 6: 11, 9: 2, 0: 5,
};

// 월덕귀인 (月德貴人) - 월지 삼합 그룹 → 천간
const WOLDUK: Record<number, number> = {
  0: 8, 1: 6, 2: 2, 3: 0, 4: 8, 5: 6, 6: 2, 7: 0, 8: 8, 9: 6, 10: 2, 11: 0,
};

// ==========================================
// 신살 분석 함수
// ==========================================
export function analyzeSpecialStars(pillars: FourPillars): SpecialStar[] {
  const stars: SpecialStar[] = [];
  const dayMaster = pillars.day.stem;
  const yearBranch = pillars.year.branch;
  const dayBranch = pillars.day.branch;
  const branches: (number | undefined)[] = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour?.branch];
  const pillarCount = pillars.hour ? 4 : 3;

  // 헬퍼: 일간 기준 단일 지지 체크
  function checkStemTarget(name: string, table: Record<number, number>, isPositive: boolean) {
    const target = table[dayMaster];
    for (let i = 0; i < pillarCount; i++) {
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
    for (let i = 0; i < pillarCount; i++) {
      if (branches[i] === target) {
        stars.push({ name, position: `${PILLAR_NAMES[i]}지`, isPositive });
      }
    }
  }

  // 헬퍼: 일간 기준 복수 지지 체크
  function checkStemMultiTarget(name: string, table: Record<number, number[]>, isPositive: boolean) {
    const targets = table[dayMaster];
    for (let i = 0; i < pillarCount; i++) {
      if (branches[i] !== undefined && targets.includes(branches[i] as number)) {
        stars.push({ name, position: `${PILLAR_NAMES[i]}지`, isPositive });
      }
    }
  }

  // S급
  checkStemMultiTarget('천을귀인', CHEONUL_GUIIN, true);
  checkStemMultiTarget('태극귀인', TAEGEUK, true);
  checkStemTarget('양인살', YANGIN, false);
  // 괴강살은 아래에서 별도 처리
  checkStarFromBase('역마살', YEOKMA, yearBranch, false);
  checkStarFromBase('역마살', YEOKMA, dayBranch, false);
  checkStarFromBase('도화살', DOHWA, yearBranch, false);
  checkStarFromBase('도화살', DOHWA, dayBranch, false);

  // A급
  // 천덕귀인 (월지 기준 → 다른 주의 천간/지지 체크)
  {
    const monthBranch = pillars.month.branch;
    const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem];
    if (pillars.hour) stems.push(pillars.hour.stem);
    const stemTarget = CHEONDUK_STEM[monthBranch];
    const branchTarget = CHEONDUK_BRANCH[monthBranch];
    if (stemTarget !== undefined) {
      for (let i = 0; i < stems.length; i++) {
        if (stems[i] === stemTarget) {
          stars.push({ name: '천덕귀인', position: `${PILLAR_NAMES[i]}간`, isPositive: true });
        }
      }
    }
    if (branchTarget !== undefined) {
      for (let i = 0; i < pillarCount; i++) {
        if (branches[i] === branchTarget) {
          stars.push({ name: '천덕귀인', position: `${PILLAR_NAMES[i]}지`, isPositive: true });
        }
      }
    }
  }
  // 월덕귀인 (월지 삼합 그룹 → 천간 체크)
  {
    const monthBranch = pillars.month.branch;
    const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem];
    if (pillars.hour) stems.push(pillars.hour.stem);
    const woldukTarget = WOLDUK[monthBranch];
    for (let i = 0; i < stems.length; i++) {
      if (stems[i] === woldukTarget) {
        stars.push({ name: '월덕귀인', position: `${PILLAR_NAMES[i]}간`, isPositive: true });
      }
    }
  }
  checkStemTarget('문창귀인', MUNCHANG, true);
  checkStarFromBase('화개살', HWAGAE, yearBranch, true);
  checkStarFromBase('화개살', HWAGAE, dayBranch, true);
  checkStarFromBase('겁살', GEOBSAL, yearBranch, false);
  checkStarFromBase('겁살', GEOBSAL, dayBranch, false);
  checkStarFromBase('백호살', BAEKHO, yearBranch, false);
  checkStarFromBase('귀문관살', GWIMUN, dayBranch, false);
  // 원진살 (년지/일지 기준, 다른 지지와 비교)
  for (let i = 0; i < pillarCount; i++) {
    if (WONJIN[yearBranch] === branches[i] && i !== 0) {
      stars.push({ name: '원진살', position: `${PILLAR_NAMES[i]}지`, isPositive: false });
    }
    if (WONJIN[dayBranch] === branches[i] && i !== 2) {
      stars.push({ name: '원진살', position: `${PILLAR_NAMES[i]}지`, isPositive: false });
    }
  }
  checkStemTarget('홍염살', HONGYEOM, false);
  checkStemTarget('건록', GEONROK, true);

  // B급
  checkStemTarget('학당귀인', HAKDANG, true);
  checkStemTarget('문곡귀인', MUNGOK, true);
  checkStemTarget('금여록', GEUMYEO, true);
  checkStarFromBase('장성살', JANGSEONGSAL, yearBranch, true);
  checkStarFromBase('장성살', JANGSEONGSAL, dayBranch, true);
  checkStarFromBase('반안살', BANANSAL, yearBranch, true);
  checkStarFromBase('반안살', BANANSAL, dayBranch, true);
  checkStarFromBase('망신살', MANGSIN, yearBranch, false);
  checkStarFromBase('망신살', MANGSIN, dayBranch, false);

  // 괴강살 (특정 간지 조합)
  {
    const pillarsArr = pillars.hour
      ? [pillars.year, pillars.month, pillars.day, pillars.hour]
      : [pillars.year, pillars.month, pillars.day];
    for (let i = 0; i < pillarsArr.length; i++) {
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

  // 중복 제거 + 우선순위 정렬
  const unique: SpecialStar[] = [];
  const seen = new Set<string>();
  for (const star of stars) {
    const key = `${star.name}-${star.position}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(star);
    }
  }

  unique.sort((a, b) => (STAR_PRIORITY[a.name] ?? 99) - (STAR_PRIORITY[b.name] ?? 99));

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
  { name: '원진살', table: WONJIN },
  { name: '망신살', table: MANGSIN },
];

const STEM_BASED_STARS: { name: string; table: Record<number, number> }[] = [
  { name: '양인살', table: YANGIN },
  { name: '홍염살', table: HONGYEOM },
  { name: '문창귀인', table: MUNCHANG },
  { name: '금여록', table: GEUMYEO },
  { name: '건록', table: GEONROK },
  { name: '학당귀인', table: HAKDANG },
  { name: '문곡귀인', table: MUNGOK },
];

const STEM_MULTI_STARS: { name: string; table: Record<number, number[]> }[] = [
  { name: '태극귀인', table: TAEGEUK },
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

    for (const { name, table } of STEM_MULTI_STARS) {
      const targets = table[dayMaster];
      if (targets && targets.includes(targetBranch)) {
        stars.add(name);
      }
    }
  }

  // 우선순위 정렬 후 max 4개
  return Array.from(stars)
    .sort((a, b) => (STAR_PRIORITY[a] ?? 99) - (STAR_PRIORITY[b] ?? 99))
    .slice(0, 4);
}
