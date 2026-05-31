import { useCallback } from 'react';
import { useMatchStore } from './store';
import RoundSection from './components/RoundSection';

function App() {
  const { state, dispatch, undo, canUndo } = useMatchStore();

  const handleNewMatch = useCallback(() => {
    if (confirm('Start a new match? All current data will be cleared.')) {
      dispatch({ type: 'NEW_MATCH' });
    }
  }, [dispatch]);

  const handleResetMatch = useCallback(() => {
    if (confirm('Reset current match? All rounds will be deleted.')) {
      dispatch({ type: 'RESET_MATCH' });
    }
  }, [dispatch]);

  const handleAddRound = useCallback(() => {
    dispatch({ type: 'ADD_ROUND' });
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, [dispatch]);

  const handleNameChange = useCallback((index: number, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', index, name });
  }, [dispatch]);

  return (
    <div className="app">
      <div className="toolbar">
        <div className="toolbar-title">
          <span className="logo">♠</span>
          <span>Call Bridge</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleNewMatch}>
            New Match
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleResetMatch}>
            Reset
          </button>
          <button
            className={`btn btn-undo btn-sm${!canUndo ? ' disabled' : ''}`}
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo last action"
          >
            ↩ Undo
          </button>
        </div>
      </div>

      <div className="content">
        <div className="match-info-card">
          <div className="match-info-title">MATCH PLAYERS</div>
          <div className="player-grid">
            {state.playerNames.map((name, idx) => (
              <div key={idx} className="player-input-wrap">
                <label className="player-label">
                  {idx === 0 ? 'You' : `Player ${idx + 1}`}
                </label>
                <input
                  className="player-input"
                  type="text"
                  value={name}
                  onChange={e => handleNameChange(idx, e.target.value)}
                  placeholder={idx === 0 ? 'Your name' : `Player ${idx + 1}`}
                  maxLength={20}
                />
              </div>
            ))}
          </div>
        </div>

        {state.rounds.map((round, idx) => (
          <RoundSection
            key={round.id}
            round={round}
            roundNumber={idx + 1}
            dispatch={dispatch}
          />
        ))}

        <div className="new-round-area">
          <button className="btn btn-primary btn-lg" onClick={handleAddRound}>
            + Create New Round
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
