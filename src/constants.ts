import { Suit, Rank, Card } from './types';

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export const SUIT_LABELS: Record<Suit, string> = {
  spades: 'Spades',
  hearts: 'Hearts',
  diamonds: 'Diamonds',
  clubs: 'Clubs',
};

export const SUIT_COLORS: Record<Suit, string> = {
  spades: 'var(--suit-black)',
  hearts: 'var(--suit-red)',
  diamonds: 'var(--suit-red)',
  clubs: 'var(--suit-black)',
};

export const ALL_CARDS: Card[] = SUITS.flatMap(suit =>
  RANKS.map(rank => ({ suit, rank }))
);

export const cardKey = (card: Card) => `${card.suit}-${card.rank}`;

export const cardsEqual = (a: Card, b: Card) => a.suit === b.suit && a.rank === b.rank;

export const RANK_VALUES: Record<Rank, number> = {
  A: 14, K: 13, Q: 12, J: 11, '10': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

export const DEFAULT_PLAYER_NAMES: [string, string, string, string] = ['Me', 'Player 2', 'Player 3', 'Player 4'];
