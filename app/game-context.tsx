"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Player = {
  id: string;
  name: string;
  score: number;
  isAdmin: boolean;
};

type Round = {
  row: number;
  column: number;
  age: number;
  imageUrl?: string;
};

type GameState = {
  players: Player[];
  currentRound: Round | null;
  gameStarted: boolean;
  guesses: Record<string, number>; // playerId -> guess
  currentImage: string | null;
};

type GameContextType = {
  gameState: GameState;
  currentUser: string | null;
  isAdmin: boolean;
  joinGame: (name: string) => void;
  startRound: (row: number, column: number, age: number, imageUrl?: string) => void;
  nextRound: (row: number, column: number, age: number, imageUrl?: string) => void;
  submitGuess: (guess: number) => void;
  resetGame: () => void;
  hardReset: () => void;
  isConnected: boolean;
  leaderboard: Player[];
  uploadImage: (file: File) => Promise<string>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentRound: null,
    gameStarted: false,
    guesses: {},
    currentImage: null
  });
  
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('guessagegame_user');
    if (savedUser) {
      const { name } = JSON.parse(savedUser);
      setCurrentUser(name);
      setIsAdmin(name.toLowerCase() === 'admin');
    }

    // Initialize socket connection
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // If we have saved user data, automatically rejoin
      const savedUser = localStorage.getItem('guessagegame_user');
      if (savedUser) {
        const { name } = JSON.parse(savedUser);
        socket.emit('join', { name });
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Listen for game state updates
    socket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    // Listen for player updates
    socket.on('playersUpdated', (players: Player[]) => {
      setGameState(prev => ({ ...prev, players }));
    });

    // Listen for round start
    socket.on('roundStarted', (round: Round & { imageUrl?: string }) => {
      setGameState(prev => ({ 
        ...prev, 
        currentRound: round,
        gameStarted: true,
        guesses: {},
        currentImage: round.imageUrl || null
      }));
    });

    // Listen for guess submissions
    socket.on('guessSubmitted', (data: { playerId: string; playerName: string; guess: number; score: number; isCorrect: boolean }) => {
      setGameState(prev => ({
        ...prev,
        guesses: { ...prev.guesses, [data.playerId]: data.guess }
      }));
    });

    // Listen for game reset
    socket.on('gameReset', () => {
      setGameState(prev => ({
        ...prev,
        currentRound: null,
        gameStarted: false,
        guesses: {},
        currentImage: null
      }));
    });

    // Listen for hard reset
    socket.on('hardReset', () => {
      setGameState({
        players: [],
        currentRound: null,
        gameStarted: false,
        guesses: {},
        currentImage: null
      });
      setCurrentUser(null);
      setIsAdmin(false);
      setLeaderboard([]);
      localStorage.removeItem('guessagegame_user');
    });

    // Listen for leaderboard updates
    socket.on('leaderboardUpdated', (leaderboard: Player[]) => {
      setLeaderboard(leaderboard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    if (socketRef.current) {
      const isAdminUser = name.toLowerCase() === 'admin';
      setCurrentUser(name);
      setIsAdmin(isAdminUser);
      
      // Save user data to localStorage
      localStorage.setItem('guessagegame_user', JSON.stringify({ name }));
      
      socketRef.current.emit('join', { name });
    }
  };

  const startRound = (row: number, column: number, age: number, imageUrl?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('startRound', { row, column, age, imageUrl });
    }
  };

  const nextRound = (row: number, column: number, age: number, imageUrl?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('nextRound', { row, column, age, imageUrl });
    }
  };

  const submitGuess = (guess: number) => {
    if (socketRef.current) {
      socketRef.current.emit('submitGuess', { guess });
    }
  };

  const resetGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('resetGame');
    }
  };

  const hardReset = () => {
    if (socketRef.current) {
      socketRef.current.emit('hardReset');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: uint8Array
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
          
          const data = await response.json();
          resolve(data.imageUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentUser,
        isAdmin,
        joinGame,
        startRound,
        nextRound,
        submitGuess,
        resetGame,
        hardReset,
        isConnected,
        leaderboard,
        uploadImage
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}