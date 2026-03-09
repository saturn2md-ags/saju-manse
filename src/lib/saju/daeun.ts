import { BirthInput, DaeunCycle, AnnualLuck, MonthlyLuck, FourPillars } from '@/types/saju';
import { STEM_YINYANG } from '@/lib/constants/stems';
import { TEN_GOD_TABLE, getGrowthStage, getMonthStem } from '@/lib/constants/lookupTables';
import { getSolarTermDates, SOLAR_TERM_MONTH_BRANCH } from '@/lib/constants/solarTerms';
import { STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCH_ELEMENTS, BRANCH_HIDDEN_STEMS } from '@/lib/constants/branches';
import { getSpecialStarsForBranch } from './specialStars';

// ==========================================
// 대운 방향 결정
// ==========================================
export function getDaeunDirection(yearStemIdx: number, gender: '남' | '여'): '순행' | '역행' {
  const isYangStem = STEM_YINYANG[yearStemIdx] === '양';
  const isMale = gender === '남';

  // 양남음녀 = 순행, 음남양녀 = 역행
  if ((isYangStem && isMale) || (!isYangStem && !isMale)) {
    return '순행';
  }
  return '역행';
}

// ==========================================
// 대운수 계산 (대운 시작 나이)
// ==========================================
export function calculateDaeunStartAge(input: BirthInput, direction: '순행' | '역행'): number {
  const { year, month, day, hour = 0, minute = 0 } = input;
  const terms = getSolarTermDates(year);

  // 생일의 분 환산
  const birthTotal = month * 10000 + day * 100 + hour + minute / 60;

  // 시분 포함 정밀 Date 생성
  const birthMs = new Date(year, month - 1, day, hour, minute).getTime();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // 절기를 Date 밀리초 기준으로 정렬하여 정확한 이전/다음 절기 탐색
  // (소한이 1월이라 인덱스 순서와 시간 순서가 다름)
  const termEntries = terms.map((t: { month: number; day: number; hour: number; minute: number }) => ({
    ms: new Date(year, t.month - 1, t.day, t.hour, t.minute).getTime(),
  }));

  if (direction === '순행') {
    // 다음 절기: birthMs보다 큰 것 중 가장 작은 값
    let nextTermMs = Infinity;
    for (const entry of termEntries) {
      if (entry.ms > birthMs && entry.ms < nextTermMs) {
        nextTermMs = entry.ms;
      }
    }
    if (nextTermMs === Infinity) {
      // 올해 절기를 못 찾으면 다음해 입춘
      const nextTerms = getSolarTermDates(year + 1);
      const t = nextTerms[0]; // 입춘
      nextTermMs = new Date(year + 1, t.month - 1, t.day, t.hour, t.minute).getTime();
    }
    const diffDays = (nextTermMs - birthMs) / MS_PER_DAY;
    return Math.round(diffDays / 3);
  } else {
    // 이전 절기: birthMs보다 작은 것 중 가장 큰 값
    let prevTermMs = -Infinity;
    for (const entry of termEntries) {
      if (entry.ms < birthMs && entry.ms > prevTermMs) {
        prevTermMs = entry.ms;
      }
    }
    if (prevTermMs === -Infinity) {
      // 전년 대설 기준
      const prevTerms = getSolarTermDates(year - 1);
      const t = prevTerms[10]; // 대설
      prevTermMs = new Date(year - 1, t.month - 1, t.day, t.hour, t.minute).getTime();
    }
    const diffDays = (birthMs - prevTermMs) / MS_PER_DAY;
    return Math.round(diffDays / 3);
  }
}

// ==========================================
// 대운 계산 (10개)
// ==========================================
export function calculateDaeun(
  pillars: FourPillars,
  input: BirthInput,
  direction: '순행' | '역행',
  startAge: number,
  count: number = 10
): DaeunCycle[] {
  const dayMaster = pillars.day.stem;
  const monthStem = pillars.month.stem;
  const monthBranch = pillars.month.branch;
  const yearBranch = pillars.year.branch;
  const dayBranch = pillars.day.branch;

  const cycles: DaeunCycle[] = [];

  for (let i = 0; i < count; i++) {
    let stem: number, branch: number;

    if (direction === '순행') {
      stem = (monthStem + i + 1) % 10;
      branch = (monthBranch + i + 1) % 12;
    } else {
      stem = ((monthStem - i - 1) % 10 + 10) % 10;
      branch = ((monthBranch - i - 1) % 12 + 12) % 12;
    }

    const branchMainStem = BRANCH_HIDDEN_STEMS[branch].main;

    cycles.push({
      startAge: startAge + i * 10,
      stem,
      branch,
      tenGod: TEN_GOD_TABLE[dayMaster][stem],
      branchTenGod: TEN_GOD_TABLE[dayMaster][branchMainStem],
      growthStage: getGrowthStage(dayMaster, branch),
      specialStars: getSpecialStarsForBranch(branch, yearBranch, dayBranch, dayMaster),
    });
  }

  return cycles;
}

// ==========================================
// 세운 계산 (연운)
// ==========================================
export function calculateAnnualLuck(
  dayMaster: number,
  startYear: number,
  count: number = 10,
  yearBranch?: number,
  dayBranch?: number,
): AnnualLuck[] {
  const results: AnnualLuck[] = [];

  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    const stem = ((year - 4) % 10 + 10) % 10;
    const branch = ((year - 4) % 12 + 12) % 12;
    const branchMainStem = BRANCH_HIDDEN_STEMS[branch].main;

    results.push({
      year,
      stem,
      branch,
      tenGod: TEN_GOD_TABLE[dayMaster][stem],
      branchTenGod: TEN_GOD_TABLE[dayMaster][branchMainStem],
      growthStage: getGrowthStage(dayMaster, branch),
      specialStars: yearBranch !== undefined && dayBranch !== undefined
        ? getSpecialStarsForBranch(branch, yearBranch, dayBranch, dayMaster)
        : [],
    });
  }

  return results;
}

// ==========================================
// 월운 계산
// ==========================================
export function calculateMonthlyLuck(
  dayMaster: number,
  year: number,
  yearBranch?: number,
  dayBranch?: number,
): MonthlyLuck[] {
  const yearStem = ((year - 4) % 10 + 10) % 10;
  const prevYearStem = ((year - 5) % 10 + 10) % 10;
  const results: MonthlyLuck[] = [];

  // 양력 1월(축월) ~ 12월(자월)
  for (let i = 0; i < 12; i++) {
    const branch = (1 + i) % 12; // 축(1)부터 시작 (양력 1월=축월)
    // 양력 1월(축월)은 입춘 전이므로 전년도 연간 기준
    const effectiveYearStem = (i === 0) ? prevYearStem : yearStem;
    const stem = getMonthStem(effectiveYearStem, branch);
    const displayMonth = i + 1;
    const branchMainStem = BRANCH_HIDDEN_STEMS[branch].main;

    results.push({
      month: displayMonth,
      stem,
      branch,
      tenGod: TEN_GOD_TABLE[dayMaster][stem],
      branchTenGod: TEN_GOD_TABLE[dayMaster][branchMainStem],
      growthStage: getGrowthStage(dayMaster, branch),
      specialStars: yearBranch !== undefined && dayBranch !== undefined
        ? getSpecialStarsForBranch(branch, yearBranch, dayBranch, dayMaster)
        : [],
    });
  }

  return results;
}
