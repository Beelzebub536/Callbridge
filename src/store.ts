import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { MatchState, ActionType, Round } from './types';
import { DEFAULT_PLAYER_NAMES, cardsEqual } from './constants';
import { Suit } from './types';

const STORAGE_KEY = 'callbridge_match';

function createRound(opponentNames: [string, string, string]): Round {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    handCards: [],
    playedCards: [],
    opponents: opponentNames.map(name => ({
      name,
      suitFinished: { spades: false, hearts: false, diamonds: false, clubs: false },
    })),
    showOpponentEstimation: false,
  };
}

function getInitialState(): MatchState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MatchState;
      if (parsed && parsed.playerNames && Array.isArray(parsed.rounds)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    playerNames: [...DEFAULT_PLAYER_NAMES] as [string, string, string, string],
    rounds: [],
  };
}

function matchReducer(state: MatchState, action: ActionType): MatchState {
  switch (action.type) {
    case 'SET_PLAYER_NAME': {
      const names = [...state.playerNames] as [string, string, string, string];
      names[action.index] = action.name;
      const rounds = state.rounds.map(r => {
        if (action.index === 0) return r;
        const oppIdx = action.index - 1;
        if (oppIdx < 0 || oppIdx > 2) return r;
        const opponents = r.opponents.map((o, i) =>
          i === oppIdx ? { ...o, name: action.name } : o
        );
        return { ...r, opponents };
      });
      return { ...state, playerNames: names, rounds };
    }

    case 'ADD_ROUND': {
      const oppNames = [state.playerNames[1], state.playerNames[2], state.playerNames[3]] as [string, string, string];
      const newRound = createRound(oppNames);
      return { ...state, rounds: [...state.rounds, newRound] };
    }

    case 'DELETE_ROUND': {
      return { ...state, rounds: state.rounds.filter(r => r.id !== action.roundId) };
    }

    case 'TOGGLE_HAND_CARD': {
      return {
        ...state,
        rounds: state.rounds.map(r => {
          if (r.id !== action.roundId) return r;
          const exists = r.handCards.some(c => cardsEqual(c, action.card));
          const handCards = exists
            ? r.handCards.filter(c => !cardsEqual(c, action.card))
            : [...r.handCards, action.card];
          return { ...r, handCards };
        }),
      };
    }

    case 'PLAY_CARD': {
      return {
        ...state,
        rounds: state.rounds.map(r => {
          if (r.id !== action.roundId) return r;
          if (r.playedCards.some(c => cardsEqual(c, action.card))) return r;
          return { ...r, playedCards: [...r.playedCards, action.card] };
        }),
      };
    }

    case 'UNPLAY_CARD': {
      return {
        ...state,
        rounds: state.rounds.map(r => {
          if (r.id !== action.roundId) return r;
          return { ...r, playedCards: r.playedCards.filter(c => !cardsEqual(c, action.card)) };
        }),
      };
    }

    case 'TOGGLE_SUIT_FINISHED': {
      return {
        ...state,
        rounds: state.rounds.map(r => {
          if (r.id !== action.roundId) return r;
          const opponents = r.opponents.map((o, i) => {
            if (i !== action.opponentIndex) return o;
            const suit = action.suit as Suit;
            return {
              ...o,
              suitFinished: { ...o.suitFinished, [suit]: !o.suitFinished[suit] },
            };
          });
          return { ...r, opponents };
        }),
      };
    }

    case 'TOGGLE_OPPONENT_ESTIMATION': {
      return {
        ...state,
        rounds: state.rounds.map(r =>
          r.id === action.roundId
            ? { ...r, showOpponentEstimation: !r.showOpponentEstimation }
            : r
        ),
      };
    }

    case 'RESET_MATCH': {
      return { ...state, rounds: [] };
    }

    case 'NEW_MATCH': {
      return {
        playerNames: [...DEFAULT_PLAYER_NAMES] as [string, string, string, string],
        rounds: [],
      };
    }

    default:
      return state;
  }
}

export function useMatchStore() {
  const [state, setStateInternal] = useState<MatchState>(getInitialState);
  const historyRef = useRef<MatchState[]>([]);
  const [, forceRerender] = useReducer(x => x + 1, 0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const dispatch = useCallback((action: ActionType) => {
    setStateInternal(prev => {
      historyRef.current = [...historyRef.current.slice(-49), prev];
      return matchReducer(prev, action);
    });
    // force canUndo to re-evaluate
    setTimeout(forceRerender, 0);
  }, [forceRerender]);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setStateInternal(prev);
    setTimeout(forceRerender, 0);
  }, [forceRerender]);

  const canUndo = historyRef.current.length > 0;

  return { state, dispatch, undo, canUndo };
}
