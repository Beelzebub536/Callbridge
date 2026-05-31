import React, { useCallback } from 'react';
import { Card, Suit } from '../types';
import { SUITS, RANKS, SUIT_SYMBOLS, cardKey } from '../constants';

interface CardGridProps {
  /** Cards to show as available/selectable */
  availableCards: Set<string>;
  /** Cards currently selected/active */
  selectedCards: Set<string>;
  /** Called when a card is tapped */
  onCardTap: (card: Card) => void;
  /** Variant changes visual style */
  variant?: 'hand' | 'played';
  /** Optional label for selected state */
  selectedLabel?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  availableCards,
  selectedCards,
  onCardTap,
  variant = 'hand',
}) => {
  const handleTap = useCallback((card: Card) => {
    const key = cardKey(card);
    if (!availableCards.has(key)) return;
    onCardTap(card);
  }, [availableCards, onCardTap]);

  return (
    <div className="card-grid">
      {SUITS.map(suit => {
        const isRed = suit === 'hearts' || suit === 'diamonds';
        return (
          <div key={suit} className="suit-row">
            <span className={`suit-symbol ${isRed ? 'red' : 'black'}`}>
              {SUIT_SYMBOLS[suit]}
            </span>
            <div className="rank-row">
              {RANKS.map(rank => {
                const card: Card = { suit: suit as Suit, rank };
                const key = cardKey(card);
                const available = availableCards.has(key);
                const selected = selectedCards.has(key);

                if (!available && !selected) {
                  return (
                    <span key={rank} className="card-btn ghost" aria-hidden="true">
                      {rank}
                    </span>
                  );
                }

                return (
                  <button
                    key={rank}
                    className={`card-btn ${isRed ? 'red' : 'black'} ${selected ? (variant === 'hand' ? 'in-hand' : 'played') : ''} ${!available ? 'unavailable' : ''}`}
                    onClick={() => handleTap(card)}
                    aria-label={`${rank} of ${suit}`}
                    aria-pressed={selected}
                  >
                    {rank}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(CardGrid);
