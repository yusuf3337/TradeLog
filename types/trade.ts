export type AccountType = 'Kişisel' | 'Fon (Prop)' | 'Demo';
export type TradeType = 'Scalp' | 'Day Trade' | 'Swing';
export type Direction = 'Long' | 'Short';
export type TradeResult = 'Win' | 'Loss' | 'BE';

export type Trade = {
  id: string;
  date: string;
  time: string;
  symbol: string;
  direction: Direction;
  type: TradeType;
  account: AccountType;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  riskPercent?: number;
  result: TradeResult;
  rr: number;
  targetRr: number;
  pnl: number;
  setup: string;
  imageUrl?: string;
  psychology: string[];
  followedPlan: boolean;
  notes: string;
};
