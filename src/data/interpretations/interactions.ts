// 합충형파해 해석 데이터

export interface InteractionInterpretation {
  type: string;
  emoji: string;
  isPositive: boolean;
  keyword: string;
  shortDesc: string;
  fullDesc: string;
}

export const INTERACTION_INTERPRETATIONS: Record<string, InteractionInterpretation> = {
  '천간합': {
    type: '천간합',
    emoji: '🤝',
    isPositive: true,
    keyword: '하나로 합쳐지는 에너지',
    shortDesc: '두 기운이 하나로 합쳐져요! 좋은 인연이나 협력 관계를 뜻해요.',
    fullDesc: '천간합은 하늘의 두 기운이 서로 끌려서 하나로 합쳐지는 거예요. 마치 퍼즐 조각이 딱 맞는 것처럼! 좋은 인연, 협력, 파트너십을 의미해요. 합이 있으면 사람들과 잘 어울리고, 좋은 관계를 맺기 쉬워요.',
  },
  '천간충': {
    type: '천간충',
    emoji: '⚡',
    isPositive: false,
    keyword: '부딪히는 에너지',
    shortDesc: '두 기운이 정면 충돌! 갈등이 있지만 성장의 원동력이 되기도.',
    fullDesc: '천간충은 하늘의 두 기운이 서로 부딪히는 거예요. 의견 차이, 갈등, 변화가 생길 수 있어요. 하지만 충돌이 항상 나쁜 건 아니에요! 그 과정에서 변화와 발전이 일어나기도 해요. 부딪히면서 더 강해지는 거죠!',
  },
  '지지삼합': {
    type: '지지삼합',
    emoji: '🔺',
    isPositive: true,
    keyword: '세 힘이 모이는 대합',
    shortDesc: '세 가지 에너지가 모여서 큰 힘이 돼요! 팀워크 최강!',
    fullDesc: '지지삼합은 세 가지 에너지가 삼각형처럼 모여서 강력한 하나의 힘을 만들어내요. 혼자보다 팀으로 일할 때 더 큰 성과를 내는 에너지! 좋은 동료, 든든한 팀이 생기기 쉬워요.',
  },
  '지지방합': {
    type: '지지방합',
    emoji: '🧭',
    isPositive: true,
    keyword: '같은 방향의 에너지',
    shortDesc: '같은 방향으로 뭉쳐진 강한 에너지! 집중력 UP!',
    fullDesc: '지지방합은 같은 방향(동서남북)의 에너지가 모이는 거예요. 한 방향으로 집중된 힘이라 특정 분야에서 강력한 성과를 낼 수 있어요. 전문성이 높아지고, 한 길을 깊이 파는 데 유리해요.',
  },
  '지지육합': {
    type: '지지육합',
    emoji: '💕',
    isPositive: true,
    keyword: '하나로 합쳐지는 인연',
    shortDesc: '찰떡궁합! 두 기운이 자연스럽게 하나로 합쳐져요.',
    fullDesc: '지지육합은 두 가지 에너지가 자연스럽게 하나로 합쳐지는 거예요. 찰떡궁합인 관계! 좋은 인연을 만나기 쉽고, 인간관계에서 조화로운 에너지를 받아요. 결혼, 파트너십에 좋은 신호!',
  },
  '지지충': {
    type: '지지충',
    emoji: '💥',
    isPositive: false,
    keyword: '정면 충돌',
    shortDesc: '정반대 에너지의 충돌! 변화와 갈등이 있지만 돌파력도 생겨요.',
    fullDesc: '지지충은 정반대 방향의 에너지가 세게 부딪히는 거예요. 이사, 이직, 이별 같은 큰 변화가 올 수 있어요. 하지만 충은 정체된 것을 깨부수는 힘도 있어요! 변화를 두려워하지 말고 기회로 만드세요.',
  },
  '지지형': {
    type: '지지형',
    emoji: '⚖️',
    isPositive: false,
    keyword: '형벌과 시련',
    shortDesc: '예상치 못한 시련이나 법적 문제에 주의하세요.',
    fullDesc: '지지형은 형벌을 뜻해요. 법적 문제, 계약 분쟁, 건강 이슈 등 주의가 필요한 에너지예요. 하지만 정정당당하게 살고, 계약서는 꼼꼼히 읽고, 건강 검진 잘 받으면 충분히 대비할 수 있어요!',
  },
  '지지파': {
    type: '지지파',
    emoji: '🔨',
    isPositive: false,
    keyword: '깨지고 새로 만드는',
    shortDesc: '기존의 것이 깨질 수 있지만, 새로 만들 기회이기도 해요.',
    fullDesc: '지지파는 무언가가 깨지는 에너지예요. 관계, 계획, 약속 등이 틀어질 수 있어요. 하지만 깨진 그릇에서 새로운 작품이 나오듯, 이것은 리뉴얼의 기회이기도 해요! 유연하게 대처하세요.',
  },
  '지지해': {
    type: '지지해',
    emoji: '🔪',
    isPositive: false,
    keyword: '보이지 않는 해침',
    shortDesc: '겉으로는 안 보이지만 속에서 갈등이 있을 수 있어요.',
    fullDesc: '지지해는 눈에 보이지 않는 해침이에요. 겉으로는 괜찮아 보이지만 속에서 스트레스나 갈등이 쌓일 수 있어요. 신뢰할 수 있는 사람과 속마음을 나누고, 스트레스 관리를 잘 하면 괜찮아요!',
  },
};
