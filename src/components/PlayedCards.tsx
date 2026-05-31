import React, { useCallback } from 'react';
import { Card, Suit } from '../types';
import { RANKS, SUITS, SUIT_SYMBOLS, cardKey } from '../constants';
import CardGrid from './CardGrid';

interface PlayedCardsProps {
  roundId: string;
  handCards: Card[];
  playedCards: Card[];
  onPlayCard: (card: Card) => void;
  onUnplayCard: (card: Card) => void;
}

const PlayedCards: React.FC<PlayedCardsProps> = ({
  handCards,
  playedCards,
  onPlayCard,
  onUnplayCard,
}) => {
  const handSet = new Set(handCards.map(cardKey));
  const playedSet = new Set(playedCards.map(cardKey));

  // Available = not in hand and not already played
  const availableCards = new Set(
    SUITS.flatMap(suit =>
      RANKS.map(rank => {
        const key = `${suit}-${rank}`;
        if (handSet.has(key) || playedSet.has(key)) return null;
        return key;
      }).filter(Boolean) as string[]
    )
  );

  const handleTap = useCallback((card: Card) => {
    onPlayCard(card);
  }, [onPlayCard]);

  // Count remaining per suit
  const remaining = { spades: 0, hearts: 0, diamonds: 0, clubs: 0 };
  for (const key of availableCards) {
    const [suit] = key.split('-') as [Suit, string];
    remaining[suit]++;
  }
  const totalRemaining = availableCards.size;

  return (
    <div className="section section-played">
      <div className="section-header">
        <h3>PLAYED CARDS</h3>
        <span className="card-count played-count">Remaining: {totalRemaining}</span>
      </div>

      <div className="remaining-suits">
        {(Object.entries(remaining) as [Suit, number][]).map(([suit, count]) => {
          const isRed = suit === 'hearts' || suit === 'diamonds';
          return (
            <span key={suit} className={`remaining-suit-badge ${isRed ? 'red' : 'black'}`}>
              {SUIT_SYMBOLS[suit]} {count}
            </span>
          );
        })}
      </div>

      <CardGrid
        availableCards={availableCards}
        selectedCards={new Set()}
        onCardTap={handleTap}
        variant="played"
      />

      {playedCards.length > 0 && (
        <div className="played-list">
          <div className="played-list-header">Played (oldest → newest)</div>
          <div className="played-chips">
            {playedCards.map((card, idx) => {
              const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
              return (
                <span key={`${cardKey(card)}-${idx}`} className={`played-chip ${isRed ? 'red' : 'black'}`}>
                  {SUIT_SYMBOLS[card.suit]}{card.rank}
                  <button
                    className="chip-remove"
                    onClick={() => onUnplayCard(card)}
                    aria-label={`Remove ${card.rank} of ${card.suit}`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PlayedCards);
