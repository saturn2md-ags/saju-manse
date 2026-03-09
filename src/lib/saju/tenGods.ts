import { TenGod, FourPillars } from '@/types/saju';
import { TEN_GOD_TABLE } from '@/lib/constants/lookupTables';
import { BRANCH_HIDDEN_STEMS } from '@/lib/constants/branches';

// 천간 기준 십성 계산
export function getStemTenGod(dayMasterIdx: number, targetStemIdx: number): TenGod {
  return TEN_GOD_TABLE[dayMasterIdx][targetStemIdx];
}

// 지지 본기 기준 십성 계산
export function getBranchMainTenGod(dayMasterIdx: number, branchIdx: number): TenGod {
  const mainStem = BRANCH_HIDDEN_STEMS[branchIdx].main;
  return TEN_GOD_TABLE[dayMasterIdx][mainStem];
}

// 사주 전체의 십성 분석
export interface TenGodAnalysis {
  // 각 위치별 십성
  yearStem: TenGod;
  yearBranch: TenGod;  // 지지 본기 기준
  monthStem: TenGod;
  monthBranch: TenGod;
  dayStem: string;      // '일간(나)' - 본인
  dayBranch: TenGod;
  hourStem: TenGod;
  hourBranch: TenGod;

  // 십성 개수 통계
  counts: Record<TenGod, number>;

  // 주요 특성
  dominantGod: TenGod;   // 가장 많은 십성
  missingGods: TenGod[];  // 없는 십성
}

export function analyzeTenGods(pillars: FourPillars): TenGodAnalysis {
  const dayMaster = pillars.day.stem;

  const yearStem = getStemTenGod(dayMaster, pillars.year.stem);
  const yearBranch = getBranchMainTenGod(dayMaster, pillars.year.branch);
  const monthStem = getStemTenGod(dayMaster, pillars.month.stem);
  const monthBranch = getBranchMainTenGod(dayMaster, pillars.month.branch);
  const dayBranch = getBranchMainTenGod(dayMaster, pillars.day.branch);
  const hourStem = getStemTenGod(dayMaster, pillars.hour.stem);
  const hourBranch = getBranchMainTenGod(dayMaster, pillars.hour.branch);

  // 통계
  const allGods = [yearStem, yearBranch, monthStem, monthBranch, dayBranch, hourStem, hourBranch];
  const counts: Record<TenGod, number> = {
    '비견': 0, '겁재': 0, '식신': 0, '상관': 0, '편재': 0,
    '정재': 0, '편관': 0, '정관': 0, '편인': 0, '정인': 0,
  };

  for (const god of allGods) {
    counts[god]++;
  }

  // 가장 많은 십성
  let dominantGod: TenGod = '비견';
  let maxCount = 0;
  for (const [god, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantGod = god as TenGod;
    }
  }

  // 없는 십성
  const missingGods = (Object.entries(counts) as [TenGod, number][])
    .filter(([, count]) => count === 0)
    .map(([god]) => god);

  return {
    yearStem,
    yearBranch,
    monthStem,
    monthBranch,
    dayStem: '일간(나)',
    dayBranch,
    hourStem,
    hourBranch,
    counts,
    dominantGod,
    missingGods,
  };
}
