import { ElementBalance, FourPillars } from '@/types/saju';
import { STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCH_ELEMENTS, BRANCH_HIDDEN_STEMS } from '@/lib/constants/branches';

// ==========================================
// 오행 밸런스 분석
// ==========================================

export function calculateElementBalance(pillars: FourPillars): ElementBalance {
  const balance: ElementBalance = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  // 천간 4개 (각 1점)
  const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
  for (const stem of stems) {
    balance[STEM_ELEMENTS[stem]] += 1;
  }

  // 지지 4개 (본기 1점, 중기 0.5점, 여기 0.3점)
  const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
  for (const branch of branches) {
    const hidden = BRANCH_HIDDEN_STEMS[branch];
    balance[STEM_ELEMENTS[hidden.main]] += 1;
    if (hidden.middle !== undefined) {
      balance[STEM_ELEMENTS[hidden.middle]] += 0.5;
    }
    if (hidden.residual !== undefined) {
      balance[STEM_ELEMENTS[hidden.residual]] += 0.3;
    }
  }

  return balance;
}

// 오행 퍼센트 계산
export function getElementPercentages(balance: ElementBalance): Record<string, number> {
  const total = balance.목 + balance.화 + balance.토 + balance.금 + balance.수;
  if (total === 0) return { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  return {
    목: Math.round((balance.목 / total) * 100),
    화: Math.round((balance.화 / total) * 100),
    토: Math.round((balance.토 / total) * 100),
    금: Math.round((balance.금 / total) * 100),
    수: Math.round((balance.수 / total) * 100),
  };
}

// 용신 추정 (간략 버전)
// 실제로는 매우 복잡한 판단이 필요하지만 기본적인 약한 오행을 보충하는 방향
export function estimateYongsin(balance: ElementBalance, dayMasterElement: string): {
  yongsin: string;
  description: string;
} {
  const total = balance.목 + balance.화 + balance.토 + balance.금 + balance.수;
  const dayMasterStrength = balance[dayMasterElement as keyof ElementBalance];
  const ratio = dayMasterStrength / total;

  // 오행 생극 관계
  const producing: Record<string, string> = { '목': '수', '화': '목', '토': '화', '금': '토', '수': '금' };
  const controlling: Record<string, string> = { '목': '금', '화': '수', '토': '목', '금': '화', '수': '토' };

  if (ratio > 0.35) {
    // 일간이 강함 -> 설기(빼주는 것)가 필요
    // 식상(내가 생하는 오행) 또는 재성(내가 극하는 오행)
    const foodGod: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
    return {
      yongsin: foodGod[dayMasterElement],
      description: `일간이 강해서 에너지를 발산하는 ${foodGod[dayMasterElement]}(${getElementName(foodGod[dayMasterElement])})이 용신이에요`,
    };
  } else if (ratio < 0.15) {
    // 일간이 약함 -> 인성(나를 생하는 오행) 또는 비겁(같은 오행)
    return {
      yongsin: producing[dayMasterElement],
      description: `일간이 약해서 힘을 주는 ${producing[dayMasterElement]}(${getElementName(producing[dayMasterElement])})이 용신이에요`,
    };
  } else {
    // 중화 -> 가장 부족한 오행
    let minElement = '목';
    let minValue = balance.목;
    for (const [el, val] of Object.entries(balance)) {
      if (val < minValue) {
        minValue = val;
        minElement = el;
      }
    }
    return {
      yongsin: minElement,
      description: `오행이 비교적 균형잡혀 있고, 부족한 ${minElement}(${getElementName(minElement)})을 보충하면 좋아요`,
    };
  }
}

function getElementName(element: string): string {
  const names: Record<string, string> = {
    '목': '나무', '화': '불', '토': '흙', '금': '쇠', '수': '물',
  };
  return names[element] || element;
}
