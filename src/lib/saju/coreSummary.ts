import { FourPillars, ElementBalance, TenGod } from '@/types/saju';
import { STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCH_HIDDEN_STEMS } from '@/lib/constants/branches';
import { TEN_GOD_TABLE } from '@/lib/constants/lookupTables';

// ==========================================
// 격국 (格局) 판단
// ==========================================
// 월지 본기의 십신으로 격국을 결정
// 비견/겁재가 나오면 월지 중기 → 여기 순으로 탐색

export interface GyeokGuk {
  name: string;        // 격국명 (예: '식신격')
  baseTenGod: TenGod;  // 근거 십신
  description: string;  // 격국 해석
  keyword: string;      // 핵심 키워드
}

const GYEOKGUK_DESC: Record<TenGod, { keyword: string; description: string }> = {
  '비견': { keyword: '자립과 독립', description: '자기 힘으로 일어서는 사주입니다. 독립심이 강하고 자수성가 기질이 있습니다. 경쟁을 통해 성장하며, 사업이나 프리랜서에 적합합니다.' },
  '겁재': { keyword: '도전과 승부', description: '과감한 도전 정신을 가진 사주입니다. 큰 것을 노리는 승부사 기질이 있으며, 사교적이고 활동적입니다. 재물의 흐름이 크고 역동적인 인생을 삽니다.' },
  '식신': { keyword: '재능과 여유', description: '표현력과 창의력이 뛰어난 사주입니다. 먹고 즐기는 것을 좋아하며, 자연스러운 재능 발휘로 성공합니다. 의식주가 풍족하고 여유로운 삶을 추구합니다.' },
  '상관': { keyword: '끼와 혁신', description: '머리가 비상하고 끼가 넘치는 사주입니다. 기존 틀을 깨는 혁신가 기질이 있으며, 예술/기술 분야에서 두각을 나타냅니다. 자유로운 영혼입니다.' },
  '편재': { keyword: '사업과 재물', description: '사업 수완이 좋고 돈을 잘 다루는 사주입니다. 여러 분야에 투자하며, 넓은 인맥을 활용해 큰 재물을 모읍니다. 활동적이고 사교적입니다.' },
  '정재': { keyword: '안정과 성실', description: '꾸준함으로 재물을 모으는 사주입니다. 성실하고 계획적이며, 안정적인 직장 생활에 적합합니다. 신용을 중시하고 착실하게 성장합니다.' },
  '편관': { keyword: '권력과 추진력', description: '강한 카리스마와 추진력을 가진 사주입니다. 조직에서 리더 역할을 맡고, 위기 상황에서 빛납니다. 정의감이 강하고 결단력이 있습니다.' },
  '정관': { keyword: '명예와 질서', description: '사회적 인정과 명예를 얻는 사주입니다. 규칙과 질서를 중시하며, 조직에서 승진 운이 좋습니다. 안정적인 사회생활을 통해 성공합니다.' },
  '편인': { keyword: '직감과 비범함', description: '독특한 사고와 직감을 가진 사주입니다. 학문, 예술, 종교 등 정신적 분야에서 재능을 발휘합니다. 일반적이지 않은 특별한 삶을 삽니다.' },
  '정인': { keyword: '학문과 인덕', description: '학습 능력이 뛰어나고 어른들의 도움을 잘 받는 사주입니다. 자격증, 학위 취득에 유리하며, 교육/연구 분야에서 두각을 나타냅니다.' },
};

export function determineGyeokGuk(pillars: FourPillars): GyeokGuk {
  const dayMaster = pillars.day.stem;
  const monthBranch = pillars.month.branch;
  const hidden = BRANCH_HIDDEN_STEMS[monthBranch];

  // 월지 본기 → 중기 → 여기 순으로 격국 결정
  // 비견/겁재는 격으로 쓰기 어려우므로 다음 장간으로
  const candidates = [hidden.main, hidden.middle, hidden.residual].filter(
    (s): s is number => s !== undefined
  );

  let baseTenGod: TenGod = TEN_GOD_TABLE[dayMaster][hidden.main];

  for (const stemIdx of candidates) {
    const tenGod = TEN_GOD_TABLE[dayMaster][stemIdx];
    if (tenGod !== '비견' && tenGod !== '겁재') {
      baseTenGod = tenGod;
      break;
    }
  }

  const info = GYEOKGUK_DESC[baseTenGod];
  return {
    name: `${baseTenGod}격`,
    baseTenGod,
    keyword: info.keyword,
    description: info.description,
  };
}

// ==========================================
// 십신 분포 종합 해석
// ==========================================
export interface TenGodSummary {
  distribution: Record<TenGod, number>;
  dominant: TenGod;       // 가장 많은 십신
  missing: TenGod[];      // 없는 십신 카테고리
  personalitySummary: string;  // 종합 성격 해석
  careerHint: string;     // 직업 적성
  relationshipHint: string; // 대인관계 특성
}

// 십신 5분류: 비겁(비견/겁재), 식상(식신/상관), 재성(편재/정재), 관성(편관/정관), 인성(편인/정인)
type TenGodCategory = '비겁' | '식상' | '재성' | '관성' | '인성';

const CATEGORY_MAP: Record<TenGod, TenGodCategory> = {
  '비견': '비겁', '겁재': '비겁',
  '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성',
  '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성',
};

const CATEGORY_TRAITS: Record<TenGodCategory, {
  strong: { personality: string; career: string; relationship: string };
  weak: { personality: string; career: string; relationship: string };
}> = {
  '비겁': {
    strong: { personality: '자존심이 강하고 독립적', career: '자영업, 프리랜서에 적합', relationship: '대등한 관계를 원함' },
    weak: { personality: '추진력이 부족할 수 있음', career: '혼자 하는 일보다 팀워크가 나음', relationship: '리더십보다 조화를 추구' },
  },
  '식상': {
    strong: { personality: '표현력과 창의력이 뛰어남', career: '예술, 콘텐츠, 교육 분야 적합', relationship: '말을 잘하고 사교적' },
    weak: { personality: '자기 표현이 어려울 수 있음', career: '정해진 틀 안에서 일하는 게 편함', relationship: '속마음 표현이 서투름' },
  },
  '재성': {
    strong: { personality: '현실적이고 실용적', career: '사업, 금융, 영업에 재능', relationship: '사교적이고 인맥이 넓음' },
    weak: { personality: '물질에 대한 욕심이 적음', career: '돈보다 가치를 추구하는 일이 맞음', relationship: '재물보다 정을 중시' },
  },
  '관성': {
    strong: { personality: '책임감이 강하고 조직적', career: '공직, 대기업, 관리직에 적합', relationship: '규범을 중시하며 신뢰가 높음' },
    weak: { personality: '자유로운 영혼, 규칙을 싫어함', career: '자유로운 환경의 직업이 좋음', relationship: '구속받기 싫어함' },
  },
  '인성': {
    strong: { personality: '학습 능력이 뛰어나고 사려 깊음', career: '학문, 연구, 교육 분야 적합', relationship: '어른들의 도움을 잘 받음' },
    weak: { personality: '실전보다 이론에 강할 수 있음', career: '자격증/학위보다 경험으로 승부', relationship: '자기주도적 학습 필요' },
  },
};

export function analyzeTenGodSummary(pillars: FourPillars): TenGodSummary {
  const dayMaster = pillars.day.stem;

  // 일간 제외 7개 글자의 십신 분포 계산
  const distribution: Record<TenGod, number> = {
    '비견': 0, '겁재': 0, '식신': 0, '상관': 0, '편재': 0,
    '정재': 0, '편관': 0, '정관': 0, '편인': 0, '정인': 0,
  };

  // 천간 3개 (년/월/시, 일간 제외)
  const otherStems = [pillars.year.stem, pillars.month.stem, pillars.hour.stem];
  for (const stem of otherStems) {
    distribution[TEN_GOD_TABLE[dayMaster][stem]]++;
  }

  // 지지 4개 (본기)
  const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
  for (const branch of branches) {
    const mainStem = BRANCH_HIDDEN_STEMS[branch].main;
    distribution[TEN_GOD_TABLE[dayMaster][mainStem]]++;
  }

  // 카테고리별 집계
  const catCount: Record<TenGodCategory, number> = { '비겁': 0, '식상': 0, '재성': 0, '관성': 0, '인성': 0 };
  for (const [god, count] of Object.entries(distribution)) {
    catCount[CATEGORY_MAP[god as TenGod]] += count;
  }

  // 가장 많은 십신
  const dominant = (Object.entries(distribution) as [TenGod, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // 없는 카테고리
  const missing = (Object.entries(catCount) as [TenGodCategory, number][])
    .filter(([, count]) => count === 0)
    .map(([cat]) => cat);

  // 가장 강한 카테고리 / 가장 약한 카테고리
  const sortedCats = (Object.entries(catCount) as [TenGodCategory, number][])
    .sort((a, b) => b[1] - a[1]);
  const strongestCat = sortedCats[0][0];
  const weakestCat = sortedCats[sortedCats.length - 1][0];

  const strong = CATEGORY_TRAITS[strongestCat].strong;
  const weak = CATEGORY_TRAITS[weakestCat].weak;

  // 종합 해석 생성
  const personalitySummary = `${strong.personality}. ${weak.personality}.`;
  const careerHint = `${strong.career}. ${weak.career}.`;
  const relationshipHint = `${strong.relationship}. ${weak.relationship}.`;

  return {
    distribution,
    dominant,
    missing: missing as unknown as TenGod[],
    personalitySummary,
    careerHint,
    relationshipHint,
  };
}
