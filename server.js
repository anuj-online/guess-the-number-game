const http = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3001; // Use a different port for the WebSocket server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });

  // Initialize Socket.IO
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store game state
  let gameState = {
    players: [],
    currentRound: null,
    gameStarted: false,
    guesses: {}
  };

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', (data) => {
      const { name } = data;
      const isAdmin = name.toLowerCase() === 'admin';
      
      // Check if player already exists
      let player = gameState.players.find(p => p.name === name);
      
      if (!player) {
        player = {
          id: socket.id,
          name,
          score: 0,
          isAdmin
        };
        gameState.players.push(player);
      } else {
        // Update existing player's socket ID
        player.id = socket.id;
        player.isAdmin = isAdmin;
      }
      
      // Send current game state to the user
      socket.emit('gameState', gameState);
      
      // Notify all clients about the updated player list
      io.emit('playersUpdated', gameState.players);
      
      // Send leaderboard to all clients
      const leaderboard = getLeaderboard();
      io.emit('leaderboardUpdated', leaderboard);
      
      // Store user data in socket
      socket.data = { name, isAdmin };
    });

    // Handle admin starting a round
    socket.on('startRound', (data) => {
      const { row, column, age } = data;
      
      gameState.currentRound = { row, column, age };
      gameState.gameStarted = true;
      gameState.guesses = {}; // Reset guesses for new round
      
      // Notify all players about the new round
      io.emit('roundStarted', gameState.currentRound);
    });

    // Handle player submitting a guess
    socket.on('submitGuess', (data) => {
      const { guess } = data;
      
      if (!gameState.currentRound || !gameState.gameStarted) return;
      
      // Calculate score (1 point for correct guess, 0 otherwise)
      const actualAge = gameState.currentRound.age;
      const score = guess === actualAge ? 1 : 0;
      
      // Update player score
      const player = gameState.players.find(p => p.id === socket.id);
      if (player) {
        player.score += score;
        gameState.guesses[socket.id] = guess;
        
        // Notify admin about the new guess
        const admin = gameState.players.find(p => p.isAdmin);
        if (admin) {
          io.to(admin.id).emit('guessSubmitted', {
            playerId: socket.id,
            playerName: player.name,
            guess,
            score,
            isCorrect: score > 0
          });
        }
        
        // Update player list for everyone
        io.emit('playersUpdated', gameState.players);
        
        // Update leaderboard for everyone
        const leaderboard = getLeaderboard();
        io.emit('leaderboardUpdated', leaderboard);
      }
    });

    // Handle next round (keeps scores but starts new round)
    socket.on('nextRound', (data) => {
      const { row, column, age } = data;
      
      gameState.currentRound = { row, column, age };
      gameState.gameStarted = true;
      gameState.guesses = {}; // Reset guesses for new round
      
      // Notify all players about the new round
      io.emit('roundStarted', gameState.currentRound);
    });

    // Handle game reset (keeps players but resets scores)
    socket.on('resetGame', () => {
      // Reset scores but keep players
      gameState.players.forEach(player => {
        player.score = 0;
      });
      
      gameState.currentRound = null;
      gameState.gameStarted = false;
      gameState.guesses = {};
      
      // Notify all clients about the reset
      io.emit('gameReset');
      
      // Update leaderboard for everyone
      const leaderboard = getLeaderboard();
      io.emit('leaderboardUpdated', leaderboard);
    });

    // Handle hard reset (removes all players and resets everything)
    socket.on('hardReset', () => {
      gameState = {
        players: [],
        currentRound: null,
        gameStarted: false,
        guesses: {}
      };
      
      // Notify all clients about the hard reset
      io.emit('hardReset');
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove player from game state
      gameState.players = gameState.players.filter(p => p.id !== socket.id);
      
      // Notify all clients about the updated player list
      io.emit('playersUpdated', gameState.players);
      
      // Update leaderboard for everyone
      const leaderboard = getLeaderboard();
      io.emit('leaderboardUpdated', leaderboard);
    });
  });

  // Helper function to get top 3 players
  function getLeaderboard() {
    return [...gameState.players]
      .filter(player => !player.isAdmin)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  server.listen(port, hostname, () => {
    console.log(`> Server listening at http://${hostname}:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
  });

  // Export io for use in other files
  module.exports = { io };
});