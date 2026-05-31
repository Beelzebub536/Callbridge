export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface SuitFinished {
  spades: boolean;
  hearts: boolean;
  diamonds: boolean;
  clubs: boolean;
}

export interface Opponent {
  name: string;
  suitFinished: SuitFinished;
}

export interface Round {
  id: string;
  handCards: Card[];      // cards in my hand
  playedCards: Card[];    // cards played (in order)
  opponents: Opponent[];  // 3 opponents
  showOpponentEstimation: boolean;
}

export interface MatchState {
  playerNames: [string, string, string, string]; // [me, p2, p3, p4]
  rounds: Round[];
}

export type ActionType =
  | { type: 'SET_PLAYER_NAME'; index: number; name: string }
  | { type: 'ADD_ROUND' }
  | { type: 'DELETE_ROUND'; roundId: string }
  | { type: 'TOGGLE_HAND_CARD'; roundId: string; card: Card }
  | { type: 'PLAY_CARD'; roundId: string; card: Card }
  | { type: 'UNPLAY_CARD'; roundId: string; card: Card }
  | { type: 'TOGGLE_SUIT_FINISHED'; roundId: string; opponentIndex: number; suit: Suit }
  | { type: 'TOGGLE_OPPONENT_ESTIMATION'; roundId: string }
  | { type: 'RESET_MATCH' }
  | { type: 'NEW_MATCH' };

export interface HistoryEntry {
  before: MatchState;
  action: ActionType;
}
