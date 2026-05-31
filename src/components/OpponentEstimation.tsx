import React from 'react';
import { Card, Opponent, Suit } from '../types';
import { SUITS, SUIT_SYMBOLS, SUIT_LABELS, cardKey } from '../constants';
import { estimateOpponents } from '../estimation';

interface OpponentEstimationProps {
  roundId: string;
  handCards: Card[];
  playedCards: Card[];
  opponents: Opponent[];
  showEstimation: boolean;
  onToggleShow: () => void;
  onToggleSuitFinished: (opponentIndex: number, suit: Suit) => void;
}

const OpponentEstimation: React.FC<OpponentEstimationProps> = ({
  handCards,
  playedCards,
  opponents,
  showEstimation,
  onToggleShow,
  onToggleSuitFinished,
}) => {
  const suitFinishedArr = opponents.map(o => o.suitFinished as Record<Suit, boolean>);
  const holdings = showEstimation
    ? estimateOpponents(handCards, playedCards, suitFinishedArr)
    : [];

  return (
    <div className="section section-opponents">
      <div className="section-header">
        <h3>OPPONENT ESTIMATION</h3>
        <button
          className={`toggle-btn ${showEstimation ? 'on' : 'off'}`}
          onClick={onToggleShow}
          aria-pressed={showEstimation}
        >
          {showEstimation ? 'ON' : 'OFF'}
        </button>
      </div>

      {showEstimation && (
        <div className="opponents-container">
          {opponents.map((opp, idx) => {
            const holding = holdings[idx];
            return (
              <div key={idx} className="opponent-card">
                <div className="opponent-name">{opp.name || `Player ${idx + 2}`}</div>

                <div className="suit-checkboxes">
                  {SUITS.map(suit => {
                    const isRed = suit === 'hearts' || suit === 'diamonds';
                    const checked = opp.suitFinished[suit];
                    const id = `opp-${idx}-${suit}`;
                    return (
                      <label key={suit} htmlFor={id} className={`suit-check-label ${isRed ? 'red' : 'black'} ${checked ? 'checked' : ''}`}>
                        <input
                          id={id}
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleSuitFinished(idx, suit)}
                        />
                        <span className="suit-check-sym">{SUIT_SYMBOLS[suit]}</span>
                        <span>No {SUIT_LABELS[suit]}</span>
                      </label>
                    );
                  })}
                </div>

                {holding && (
                  <div className="holding-estimate">
                    {holding.tooMany ? (
                      <span className="too-many">Too many possibilities to estimate.</span>
                    ) : (
                      <div className="possible-cards">
                        <div className="possible-label">Possible cards ({holding.possible.length}):</div>
                        {SUITS.map(suit => {
                          const isRed = suit === 'hearts' || suit === 'diamonds';
                          const cards = holding.possible.filter(c => c.suit === suit);
                          if (cards.length === 0) return null;
                          return (
                            <span key={suit} className={`possible-suit ${isRed ? 'red' : 'black'}`}>
                              {SUIT_SYMBOLS[suit]} {cards.map(c => c.rank).join(' ')}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(OpponentEstimation);
