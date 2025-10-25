"use client";

import { useState, useEffect } from 'react';
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

  // Add wildflower decorations
  useEffect(() => {
    const createDecorations = () => {
      const container = document.body;
      const decorations: HTMLDivElement[] = [];
      
      for (let i = 0; i < 30; i++) {
        const decoration = document.createElement('div');
        decoration.className = 'wildflower-decoration';
        decoration.style.left = `${Math.random() * 100}%`;
        decoration.style.top = `${Math.random() * 100}%`;
        decoration.style.opacity = `${0.3 + Math.random() * 0.4}`;
        decoration.style.fontSize = `${1 + Math.random() * 2}rem`;
        container.appendChild(decoration);
        decorations.push(decoration);
      }
      
      return () => {
        decorations.forEach(decoration => container.removeChild(decoration));
      };
    };
    
    const cleanup = createDecorations();
    return cleanup;
  }, []);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 font-sans">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800 text-center border-2 border-purple-200 dark:border-purple-700">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
              <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-2xl">✿</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mira's Birthday Game</h1>
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mt-2">Connecting to Game Server...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we establish a connection</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 font-sans">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-2xl">✿</span>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mira's Birthday Game</h1>
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
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
              <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-2xl">✿</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Mira's Birthday Game</h1>
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-300 mt-2">Admin Panel</h2>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg text-gray-700 dark:text-gray-300">
            Players: {gameState.players.filter(p => !p.isAdmin).length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:from-yellow-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Reset Scores
            </button>
            <button
              onClick={hardReset}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Hard Reset
            </button>
          </div>
        </div>

        {!gameState.gameStarted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200 dark:border-purple-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">🌸</span> Prepare New Round
            </h2>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                >
                  Start Round
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200 dark:border-purple-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">🌺</span> Current Round
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-200">Row</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{gameState.currentRound?.row}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 p-4 rounded-xl">
                <p className="text-sm text-green-800 dark:text-green-200">Column</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{gameState.currentRound?.column}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-xl">
                <p className="text-sm text-purple-800 dark:text-purple-200">Actual Age</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{gameState.currentRound?.age}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">🌼</span> Prepare Next Round
              </h2>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Next Round
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200 dark:border-purple-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🌷</span> Player Scores
          </h2>
          {gameState.players.filter(p => !p.isAdmin).length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No players joined yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Guess
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {gameState.players.filter(p => !p.isAdmin).map((player) => (
                    <tr key={player.id} className="hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors duration-150">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
              <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-2xl">✿</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Mira's Birthday Game</h1>
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-300 mt-2">
            Welcome, {currentUser}!
          </h2>
        </div>

        {!gameState.gameStarted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-2 border-purple-200 dark:border-purple-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-center">
              <span className="mr-2">🪻</span> Waiting for Admin to Start Round
            </h2>
            <div className="animate-pulse flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 h-16 w-16 mx-auto flex items-center justify-center">
                <span className="text-2xl">✿</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {gameState.players.filter(p => !p.isAdmin).length} player(s) joined so far
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">🌸</span> Current Challenge
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-6 rounded-xl">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Row Number</p>
                  <p className="text-5xl font-bold text-blue-900 dark:text-blue-100">{gameState.currentRound?.row}</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 p-6 rounded-xl">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">Column Number</p>
                  <p className="text-5xl font-bold text-green-900 dark:text-green-100">{gameState.currentRound?.column}</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded-xl">
                <p className="text-center text-yellow-800 dark:text-yellow-200 font-medium">
                  Based on the row and column numbers, guess the age!
                </p>
              </div>
            </div>

            {gameState.guesses[currentPlayer?.id || ''] === undefined ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">🌺</span> Submit Your Guess
                </h2>
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
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                      placeholder="Enter your guess"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!guess}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${
                        guess 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Guess
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border-2 border-purple-200 dark:border-purple-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-center">
                  <span className="mr-2">🌼</span> Guess Submitted!
                </h2>
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">🌷</span> Your Score
              </h2>
              <div className="text-center">
                <p className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <span className="mr-2">🏆</span> Leaderboard
      </h2>
      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 shadow-md' 
                : index === 1 
                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' 
                  : index === 2 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900' 
                    : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-3">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <span className="font-medium">{player.name}</span>
            </div>
            <span className="font-bold text-lg">{player.score} point{player.score !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}