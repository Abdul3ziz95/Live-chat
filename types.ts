
export interface Country {
  name: string;
  code: string;
  iso: string;
  flag: string;
}

export interface ChatHistoryItem {
  id: string;
  phoneNumber: string;
  fullNumber: string;
  timestamp: number;
  countryIso: string;
}

export type MessageTone = 'professional' | 'friendly' | 'funny' | 'short';
