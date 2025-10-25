"use client";

import { useState } from 'react';
import { GameProvider, useGame } from './game-context';

export default function Home() {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}

function GamePage() {
  const { currentUser, isAdmin, joinGame, isConnected } = useGame();
  const [name, setName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      joinGame(name.trim());
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md dark:bg-gray-800 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connecting to Game Server...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we establish a connection</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guess the Number Game</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Enter your name to join the game</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleJoin}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Game
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Enter "admin" to access the admin panel</p>
          </div>
        </div>
      </div>
    );
  }

  // We need to call useGame() here to avoid hook order issues, but we've already called it above
  // Now we can safely render the appropriate view based on the user role
  if (isAdmin) {
    return <AdminView />;
  } else {
    return <PlayerView />;
  }
}

function AdminView() {
  const { gameState, startRound, nextRound, resetGame, hardReset } = useGame();
  const [row, setRow] = useState(1);
  const [column, setColumn] = useState(1);
  const [age, setAge] = useState(25);

  const handleStartRound = (e: React.FormEvent) => {
    e.preventDefault();
    startRound(row, column, age);
  };

  const handleNextRound = (e: React.FormEvent) => {
    e.preventDefault();
    nextRound(row, column, age);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <div className="flex space-x-2">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Reset Scores
            </button>
            <button
              onClick={hardReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Hard Reset
            </button>
          </div>
        </div>

        {!gameState.gameStarted ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Prepare New Round</h2>
            <form onSubmit={handleStartRound} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Row Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={row}
                    onChange={(e) => setRow(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Column Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={column}
                    onChange={(e) => setColumn(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age (Answer)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Round
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current Round</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">Row</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{gameState.currentRound?.row}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">Column</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{gameState.currentRound?.column}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                <p className="text-sm text-purple-800 dark:text-purple-200">Actual Age</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{gameState.currentRound?.age}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Prepare Next Round</h2>
              <form onSubmit={handleNextRound} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Row Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={row}
                      onChange={(e) => setRow(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Column Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={column}
                      onChange={(e) => setColumn(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Age (Answer)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Next Round
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Player Scores</h2>
          {gameState.players.filter(p => !p.isAdmin).length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No players joined yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Guess
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {gameState.players.filter(p => !p.isAdmin).map((player) => (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {player.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {gameState.guesses[player.id] !== undefined ? gameState.guesses[player.id] : 'No guess yet'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                        {player.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Leaderboard />
      </div>
    </div>
  );
}

function PlayerView() {
  const { gameState, submitGuess, leaderboard, currentUser } = useGame();
  const [guess, setGuess] = useState('');
  
  // Find the current player using the currentUser from context
  const currentPlayer = gameState.players.find(p => p.name === currentUser);

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess && gameState.currentRound) {
      submitGuess(parseInt(guess));
      setGuess('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guess the Number Game</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Welcome, {currentUser}!
          </p>
        </div>

        {!gameState.gameStarted ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Waiting for Admin to Start Round</h2>
            <div className="animate-pulse">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mx-auto"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {gameState.players.filter(p => !p.isAdmin).length} player(s) joined so far
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current Challenge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Row Number</p>
                  <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">{gameState.currentRound?.row}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">Column Number</p>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100">{gameState.currentRound?.column}</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <p className="text-center text-yellow-800 dark:text-yellow-200">
                  Based on the row and column numbers, guess the age!
                </p>
              </div>
            </div>

            {gameState.guesses[currentPlayer?.id || ''] === undefined ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Submit Your Guess</h2>
                <form onSubmit={handleSubmitGuess} className="space-y-4">
                  <div>
                    <label htmlFor="guess" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Age Guess
                    </label>
                    <input
                      id="guess"
                      type="number"
                      min="1"
                      max="120"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter your guess"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!guess}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        guess 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Guess
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Guess Submitted!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  You guessed: <span className="font-bold">{gameState.guesses[currentPlayer?.id || '']}</span>
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {gameState.guesses[currentPlayer?.id || ''] === gameState.currentRound?.age 
                    ? "🎉 Correct! You earned 1 point!" 
                    : `❌ Incorrect. The correct answer was ${gameState.currentRound?.age}.`}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Score</h2>
              <div className="text-center">
                <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                  {currentPlayer?.score || 0}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">point{currentPlayer?.score !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}

function Leaderboard() {
  const { leaderboard } = useGame();

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">🏆 Leaderboard</h2>
      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 
                ? 'bg-yellow-100 dark:bg-yellow-900' 
                : index === 1 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : index === 2 
                    ? 'bg-amber-100 dark:bg-amber-900' 
                    : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg font-bold mr-3">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <span className="font-medium">{player.name}</span>
            </div>
            <span className="font-bold">{player.score} point{player.score !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}