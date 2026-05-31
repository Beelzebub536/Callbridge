import React, { useCallback } from 'react';
import { Round, Card, Suit, ActionType } from '../types';
import MyHand from './MyHand';
import PlayedCards from './PlayedCards';
import OpponentEstimation from './OpponentEstimation';

interface RoundSectionProps {
  round: Round;
  roundNumber: number;
  dispatch: (action: ActionType) => void;
}

const RoundSection: React.FC<RoundSectionProps> = ({ round, roundNumber, dispatch }) => {
  const handleToggleHandCard = useCallback((card: Card) => {
    dispatch({ type: 'TOGGLE_HAND_CARD', roundId: round.id, card });
  }, [round.id, dispatch]);

  const handlePlayCard = useCallback((card: Card) => {
    dispatch({ type: 'PLAY_CARD', roundId: round.id, card });
  }, [round.id, dispatch]);

  const handleUnplayCard = useCallback((card: Card) => {
    dispatch({ type: 'UNPLAY_CARD', roundId: round.id, card });
  }, [round.id, dispatch]);

  const handleToggleSuitFinished = useCallback((opponentIndex: number, suit: Suit) => {
    dispatch({ type: 'TOGGLE_SUIT_FINISHED', roundId: round.id, opponentIndex, suit });
  }, [round.id, dispatch]);

  const handleToggleOpponentEstimation = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPPONENT_ESTIMATION', roundId: round.id });
  }, [round.id, dispatch]);

  const handleDeleteRound = useCallback(() => {
    dispatch({ type: 'DELETE_ROUND', roundId: round.id });
  }, [round.id, dispatch]);

  return (
    <div className="round-section">
      <div className="round-header">
        <h2 className="round-title">Round {roundNumber}</h2>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDeleteRound}
          aria-label={`Delete round ${roundNumber}`}
        >
          Delete Round
        </button>
      </div>

      <MyHand
        roundId={round.id}
        handCards={round.handCards}
        onToggleCard={handleToggleHandCard}
      />

      <PlayedCards
        roundId={round.id}
        handCards={round.handCards}
        playedCards={round.playedCards}
        onPlayCard={handlePlayCard}
        onUnplayCard={handleUnplayCard}
      />

      <OpponentEstimation
        roundId={round.id}
        handCards={round.handCards}
        playedCards={round.playedCards}
        opponents={round.opponents}
        showEstimation={round.showOpponentEstimation}
        onToggleShow={handleToggleOpponentEstimation}
        onToggleSuitFinished={handleToggleSuitFinished}
      />
    </div>
  );
};

export default React.memo(RoundSection);
