/**
 * 조후보정 (調候補正) - 계절에 따른 오행 균형 보정
 * 간단 버전: 월지(계절) + 일간 기준으로 필요 오행 판단
 */

import { FourPillars, Element } from '@/types/saju';
import { STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCH_HIDDEN_STEMS } from '@/lib/constants/branches';

type Season = '봄' | '여름' | '가을' | '겨울';

interface JohuResult {
  season: Season;
  seasonDesc: string;
  needed: Element[];        // 필요한 오행 (1~2개)
  neededReason: string;     // 왜 필요한지
  found: Element[];         // 사주에서 발견된 필요 오행
  missing: Element[];       // 사주에서 부족한 필요 오행
  score: '상' | '중' | '하'; // 조후 충족도
  interpretation: string;   // 종합 해석
}

// 월지 → 계절
function getSeason(monthBranch: number): Season {
  // 인묘진(2,3,4)=봄, 사오미(5,6,7)=여름, 신유술(8,9,10)=가을, 해자축(11,0,1)=겨울
  if ([2, 3, 4].includes(monthBranch)) return '봄';
  if ([5, 6, 7].includes(monthBranch)) return '여름';
  if ([8, 9, 10].includes(monthBranch)) return '가을';
  return '겨울';
}

const SEASON_DESC: Record<Season, string> = {
  '봄': '목(木)의 기운이 왕성한 계절',
  '여름': '화(火)의 기운이 왕성한 계절',
  '가을': '금(金)의 기운이 왕성한 계절',
  '겨울': '수(水)의 기운이 왕성한 계절',
};

// 일간 오행 + 계절 → 필요 오행과 이유
function getNeededElements(dayStemElement: Element, season: Season): { needed: Element[]; reason: string } {
  // 겨울: 추우니 火 필요, 木으로 火를 도움
  if (season === '겨울') {
    if (dayStemElement === '화') {
      return { needed: ['목', '화'], reason: '겨울에 태어난 火일간은 기운이 약해, 木과 火의 도움이 절실합니다' };
    }
    if (dayStemElement === '수') {
      return { needed: ['화', '토'], reason: '겨울에 태어난 水일간은 수기가 넘치므로, 火로 따뜻함을 주고 土로 제어해야 합니다' };
    }
    if (dayStemElement === '목') {
      return { needed: ['화'], reason: '겨울에 태어난 木일간은 얼어붙기 쉬우므로, 火의 온기가 필요합니다' };
    }
    if (dayStemElement === '금') {
      return { needed: ['화', '토'], reason: '겨울에 태어난 金일간은 차갑게 굳으므로, 火로 녹이고 土의 지지가 필요합니다' };
    }
    // 토
    return { needed: ['화'], reason: '겨울에 태어난 土일간은 얼어붙은 땅이므로, 火의 온기가 반드시 필요합니다' };
  }

  // 여름: 더우니 水 필요, 金으로 水를 도움
  if (season === '여름') {
    if (dayStemElement === '수') {
      return { needed: ['금', '수'], reason: '여름에 태어난 水일간은 증발하기 쉬우므로, 金과 水의 보충이 필요합니다' };
    }
    if (dayStemElement === '화') {
      return { needed: ['수', '금'], reason: '여름에 태어난 火일간은 화기가 과다하므로, 水로 식히고 金의 절제가 필요합니다' };
    }
    if (dayStemElement === '목') {
      return { needed: ['수'], reason: '여름에 태어난 木일간은 타들어가기 쉬우므로, 水의 윤택함이 필요합니다' };
    }
    if (dayStemElement === '금') {
      return { needed: ['수', '토'], reason: '여름에 태어난 金일간은 녹기 쉬우므로, 水로 식히고 土의 보호가 필요합니다' };
    }
    // 토
    return { needed: ['수', '목'], reason: '여름에 태어난 土일간은 메마르기 쉬우므로, 水의 촉촉함과 木의 활력이 필요합니다' };
  }

  // 봄: 목기 왕성, 적절한 조절 필요
  if (season === '봄') {
    if (dayStemElement === '목') {
      return { needed: ['화', '금'], reason: '봄에 태어난 木일간은 목기가 넘치므로, 火로 설기하고 金으로 다듬어야 합니다' };
    }
    if (dayStemElement === '화') {
      return { needed: ['목'], reason: '봄에 태어난 火일간은 木의 도움으로 기세가 좋으나, 목생화의 흐름이 중요합니다' };
    }
    if (dayStemElement === '토') {
      return { needed: ['화'], reason: '봄에 태어난 土일간은 목극토로 약해지기 쉬우므로, 火의 생조가 필요합니다' };
    }
    if (dayStemElement === '금') {
      return { needed: ['토', '화'], reason: '봄에 태어난 金일간은 목기에 눌리므로, 土의 보호와 火의 단련이 필요합니다' };
    }
    // 수
    return { needed: ['금'], reason: '봄에 태어난 水일간은 목으로 설기되므로, 金의 생조가 필요합니다' };
  }

  // 가을: 금기 왕성
  if (dayStemElement === '금') {
    return { needed: ['화', '수'], reason: '가을에 태어난 金일간은 금기가 넘치므로, 火로 단련하고 水로 설기해야 합니다' };
  }
  if (dayStemElement === '목') {
    return { needed: ['수', '화'], reason: '가을에 태어난 木일간은 금극목으로 약하므로, 水의 생조와 火의 보호가 필요합니다' };
  }
  if (dayStemElement === '화') {
    return { needed: ['목'], reason: '가을에 태어난 火일간은 기운이 쇠하므로, 木의 생조가 필요합니다' };
  }
  if (dayStemElement === '수') {
    return { needed: ['금'], reason: '가을에 태어난 水일간은 금생수로 좋은 흐름이며, 金의 지속적 생조가 중요합니다' };
  }
  // 토
  return { needed: ['화', '금'], reason: '가을에 태어난 土일간은 금으로 설기되므로, 火의 생조와 금의 균형이 필요합니다' };
}

// 사주 전체에서 오행 수집 (천간 + 지지 장간 본기)
function collectElements(pillars: FourPillars): Set<Element> {
  const elements = new Set<Element>();
  const pillarArr = [pillars.year, pillars.month, pillars.day];
  if (pillars.hour) pillarArr.push(pillars.hour);

  for (const p of pillarArr) {
    // 천간 오행
    elements.add(STEM_ELEMENTS[p.stem]);
    // 지지 장간 본기 오행
    const hidden = BRANCH_HIDDEN_STEMS[p.branch];
    elements.add(STEM_ELEMENTS[hidden.main]);
    if (hidden.middle !== undefined) elements.add(STEM_ELEMENTS[hidden.middle]);
    if (hidden.residual !== undefined) elements.add(STEM_ELEMENTS[hidden.residual]);
  }

  return elements;
}

export function analyzeJohu(pillars: FourPillars): JohuResult {
  const season = getSeason(pillars.month.branch);
  const dayStemEl = STEM_ELEMENTS[pillars.day.stem];
  const { needed, reason } = getNeededElements(dayStemEl, season);
  const existingElements = collectElements(pillars);

  const found = needed.filter(el => existingElements.has(el));
  const missing = needed.filter(el => !existingElements.has(el));

  let score: '상' | '중' | '하';
  if (missing.length === 0) {
    score = '상';
  } else if (found.length > 0) {
    score = '중';
  } else {
    score = '하';
  }

  const ELEMENT_NAMES: Record<Element, string> = {
    '목': '木(나무)', '화': '火(불)', '토': '土(흙)', '금': '金(쇠)', '수': '水(물)',
  };

  let interpretation: string;
  if (score === '상') {
    interpretation = `${season}에 태어났지만 필요한 ${needed.map(e => ELEMENT_NAMES[e]).join(', ')} 기운이 사주에 모두 있어, 계절적 균형이 잘 잡혀 있습니다. 타고난 조건이 좋아 안정적인 삶의 흐름을 기대할 수 있습니다.`;
  } else if (score === '중') {
    interpretation = `${season}에 태어나 ${needed.map(e => ELEMENT_NAMES[e]).join(', ')}이(가) 필요한데, ${found.map(e => ELEMENT_NAMES[e]).join(', ')}은(는) 있지만 ${missing.map(e => ELEMENT_NAMES[e]).join(', ')}이(가) 부족합니다. 대운이나 세운에서 부족한 기운이 올 때 좋은 시기가 됩니다.`;
  } else {
    interpretation = `${season}에 태어나 ${needed.map(e => ELEMENT_NAMES[e]).join(', ')}이(가) 필요하지만 사주에 없어, 계절 보정이 부족합니다. 대운·세운에서 해당 오행이 들어오는 시기를 잘 활용하는 것이 중요합니다.`;
  }

  return {
    season,
    seasonDesc: SEASON_DESC[season],
    needed,
    neededReason: reason,
    found,
    missing,
    score,
    interpretation,
  };
}
