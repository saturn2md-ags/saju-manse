import { SPECIAL_STAR_INTERPRETATIONS } from '@/data/interpretations/specialStars';

export const ELEMENT_BG: Record<string, string> = {
  '목': 'bg-green-700 border-green-500',
  '화': 'bg-red-700 border-red-500',
  '토': 'bg-yellow-700 border-yellow-500',
  '금': 'bg-slate-500 border-slate-400',
  '수': 'bg-blue-700 border-blue-500',
};

export const TEN_GOD_DESC: Record<string, string> = {
  '비견': '독립심이 강해지고 경쟁 의식이 높아져요. 동료와 협력하면서도 주도권을 잡으려는 경향이 있어요.',
  '겁재': '적극적이고 추진력이 강해지지만, 재물 관리에 주의가 필요해요. 안정적인 운영이 좋아요.',
  '식신': '재능을 발휘하고 안정적으로 성장하는 좋은 시기예요. 의식주가 풍족해지고 창의력이 빛나요.',
  '상관': '변화와 도전의 시기로, 기존 틀을 깨고 새로운 시도를 하게 돼요. 직장 변동 가능성이 있어요.',
  '편재': '사업이나 투자에 유리해요. 다양한 인간관계를 통해 재물을 모을 수 있어요.',
  '정재': '안정적인 수입과 착실한 재물 축적의 시기예요. 근면 성실함이 빛을 발해요.',
  '편관': '권위와 책임감이 커져요. 승진이나 지위 상승의 기회가 오지만, 스트레스 관리가 필요해요.',
  '정관': '사회적 인정과 안정을 얻는 시기예요. 명예와 지위가 높아지고 인정받게 돼요.',
  '편인': '학문이나 자격증 취득에 유리해요. 새로운 분야를 공부하거나 전문성을 키우기 좋아요.',
  '정인': '학업운이 좋고, 어른의 도움을 받기 쉬워요. 안정적인 환경에서 실력을 쌓기 좋아요.',
};

export const GROWTH_DESC: Record<string, string> = {
  '장생': '새로운 시작과 성장의 에너지가 있어요.',
  '목욕': '변화와 정리의 시기, 내실을 다져야 해요.',
  '관대': '사회적 활동이 활발해지고 인정받는 시기예요.',
  '건록': '가장 안정되고 실력을 발휘하는 전성기예요.',
  '제왕': '정점에 달하는 시기, 지나친 욕심은 금물이에요.',
  '쇠': '에너지가 줄어드니 무리하지 말고 지혜를 모아야 해요.',
  '병': '건강과 체력 관리에 신경 쓰고 휴식이 필요해요.',
  '사': '마무리와 정리의 시기, 새 준비를 해야 해요.',
  '묘': '저장과 축적의 시기, 내면의 힘을 기르세요.',
  '절': '변환점의 시기, 과거를 정리하고 새 출발을 준비해요.',
  '태': '새로운 가능성이 잉태되는 시기, 조용히 준비하세요.',
  '양': '서서히 성장하는 시기, 인내심을 갖고 기다리세요.',
};

export function getStarDescription(starName: string): string {
  const interp = SPECIAL_STAR_INTERPRETATIONS[starName];
  return interp ? interp.shortDesc : '';
}

export function getStarEmoji(starName: string): string {
  const interp = SPECIAL_STAR_INTERPRETATIONS[starName];
  return interp ? interp.emoji : '';
}
