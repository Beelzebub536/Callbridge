import React, { useState, useCallback } from 'react';
import { Card } from '../types';
import { RANKS, SUITS, cardKey } from '../constants';
import { estimateCall } from '../estimation';
import CardGrid from './CardGrid';

interface MyHandProps {
  roundId: string;
  handCards: Card[];
  onToggleCard: (card: Card) => void;
}

const MyHand: React.FC<MyHandProps> = ({ handCards, onToggleCard }) => {
  const [estimate, setEstimate] = useState<{ call: number; confidence: string; reasoning: string } | null>(null);

  const handSet = new Set(handCards.map(cardKey));

  // All cards available to select (not already in hand = still selectable; in hand = selected)
  const allCards = new Set(
    SUITS.flatMap(suit => RANKS.map(rank => `${suit}-${rank}`))
  );

  const handleEstimate = useCallback(() => {
    const result = estimateCall(handCards);
    setEstimate(result);
  }, [handCards]);

  return (
    <div className="section">
      <div className="section-header">
        <h3>MY HAND</h3>
        <span className="card-count">{handCards.length} cards</span>
      </div>

      <CardGrid
        availableCards={allCards}
        selectedCards={handSet}
        onCardTap={onToggleCard}
        variant="hand"
      />

      <div className="estimate-area">
        <button className="btn btn-secondary" onClick={handleEstimate}>
          Estimate Call
        </button>
        {estimate && (
          <div className={`estimate-result confidence-${estimate.confidence.toLowerCase()}`}>
            <div className="estimate-call">
              Call: <strong>{estimate.call}</strong>
              <span className={`badge confidence-${estimate.confidence.toLowerCase()}`}>
                {estimate.confidence} confidence
              </span>
            </div>
            <div className="estimate-reasoning">{estimate.reasoning}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MyHand);
