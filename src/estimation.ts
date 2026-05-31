import { Card, Suit } from './types';
import { SUITS, RANKS, RANK_VALUES } from './constants';

interface EstimateResult {
  call: number;
  confidence: 'Low' | 'Medium' | 'High';
  reasoning: string;
}

export function estimateCall(handCards: Card[]): EstimateResult {
  if (handCards.length === 0) {
    return { call: 0, confidence: 'Low', reasoning: 'No cards selected.' };
  }

  // Group by suit
  const bySuit: Record<Suit, Card[]> = { spades: [], hearts: [], diamonds: [], clubs: [] };
  for (const card of handCards) {
    bySuit[card.suit].push(card);
  }

  let tricks = 0;
  let details: string[] = [];

  for (const suit of SUITS) {
    const cards = bySuit[suit];
    if (cards.length === 0) continue;

    const ranks = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
    const suitLen = cards.length;

    // High cards: Ace always wins, King usually wins, Queen likely, Jack maybe
    let highCardTricks = 0;
    const top = ranks[0];
    if (top === 14) highCardTricks += 1;      // Ace
    if (ranks.includes(13) && suitLen >= 2) highCardTricks += 0.85; // King supported
    else if (ranks.includes(13)) highCardTricks += 0.5;
    if (ranks.includes(12) && suitLen >= 3) highCardTricks += 0.6;  // Queen
    else if (ranks.includes(12) && suitLen >= 2) highCardTricks += 0.35;
    if (ranks.includes(11) && suitLen >= 4) highCardTricks += 0.35; // Jack

    // Long suit tricks (cards beyond 4 in a suit can win by ruffing)
    const longSuitBonus = Math.max(0, suitLen - 4) * 0.5;
    // Short suit tricks (voids/singletons might allow ruffing if trumps)
    const shortSuitBonus = suitLen === 0 ? 0.3 : suitLen === 1 ? 0.2 : 0;

    const suitTricks = highCardTricks + longSuitBonus + shortSuitBonus;
    tricks += suitTricks;

    if (highCardTricks > 0) {
      details.push(`${suit}: ~${highCardTricks.toFixed(1)} high`);
    }
  }

  // Normalize to 2-8 range
  let call = Math.round(tricks);
  call = Math.max(2, Math.min(8, call));

  // Confidence based on how clear the hand is
  const spread = Math.abs(tricks - call);
  let confidence: 'Low' | 'Medium' | 'High';
  if (spread < 0.4 && handCards.length >= 10) confidence = 'High';
  else if (spread < 0.8 && handCards.length >= 7) confidence = 'Medium';
  else confidence = 'Low';

  const reasoning = details.length > 0
    ? `Raw estimate: ${tricks.toFixed(1)} tricks. ${details.join(', ')}.`
    : `Based on ${handCards.length} cards.`;

  return { call, confidence, reasoning };
}

// Opponent estimation: figure out what cards each opponent could possibly hold
export interface OpponentHolding {
  possible: Card[];
  tooMany: boolean;
}

export function estimateOpponents(
  handCards: Card[],
  playedCards: Card[],
  opponentSuitFinished: Array<Record<Suit, boolean>>
): OpponentHolding[] {
  // Cards accounted for
  const accounted = new Set([...handCards, ...playedCards].map(c => `${c.suit}-${c.rank}`));

  // Unknown remaining cards
  const unknown: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const key = `${suit}-${rank}`;
      if (!accounted.has(key)) {
        unknown.push({ suit: suit as Suit, rank: rank as any });
      }
    }
  }

  const numOpponents = opponentSuitFinished.length;
  const results: OpponentHolding[] = [];

  for (let i = 0; i < numOpponents; i++) {
    const suitFin = opponentSuitFinished[i];

    // Filter unknown cards to those this opponent COULD hold
    const possible = unknown.filter(card => !suitFin[card.suit]);

    results.push({
      possible,
      tooMany: possible.length > 13,
    });
  }

  return results;
}
