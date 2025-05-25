import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
export type BoardPosition = | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Board = {
  [key in BoardPosition]: Player;
};

export type Move = {
  player?: Player;
  board: BoardPosition;
  position: BoardPosition;
}

export type BoardState = {
  winner: Player;
  full: boolean;
  isActive?: boolean;
}

type Player = 'X' | 'O' | null;

export type GameMode = 'human' | 'ai';

export interface GameState {
  started: boolean;
  moves: Move[];
  board: { [key in BoardPosition]: Board };
  turn: Player;
  winner: Player;
  mode: GameMode;
}
export const initialState: GameState = {
  started: false,
  moves: [],
  board: {
    1: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    },
    2: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }, 3: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    },
    4: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }, 5: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }, 6: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    },
    7: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }, 8: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }, 9: {
      1: null, 2: null, 3: null,
      4: null, 5: null, 6: null,
      7: null, 8: null, 9: null
    }
  },
  turn: null,
  winner: null,
  mode: 'human',
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState<GameState>(() => initialState),
  withMethods((store) => ({
    startGame: () => patchState(store, (state): GameState => ({ ...initialState, started: true, turn: 'X', mode: state.mode })),
    makeMove: (move: Move) => patchState(store, (state): GameState => {
      // Create new moves array
      const newMoves = [...state.moves, move];

      // Update the sub-board immutably
      const newSubBoard = { ...state.board[move.board], [move.position]: move.player };
      const newBoard = { ...state.board, [move.board]: newSubBoard };

      // Check for overall winner
      let winner = getOverAllWinner(newBoard);
      let nextTurn: Player = state.turn === 'X' ? 'O' : 'X';

      // AI move logic
      if (state.mode === 'ai' && winner === null) {
        const possibleMoves = getPossibleMoves(newBoard, move.position);
        if (possibleMoves.length > 0) {
          const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          // Apply AI move
          const aiSubBoard = { ...newBoard[randomMove.board], [randomMove.position]: nextTurn };
          const aiBoard = { ...newBoard, [randomMove.board]: aiSubBoard };
          const aiMoves = [...newMoves, { player: nextTurn, ...randomMove }];
          winner = getOverAllWinner(aiBoard);
          nextTurn = nextTurn === 'X' ? 'O' : 'X'; // AI always plays as 'O'
          console.log(aiMoves);
          return {
            ...state,
            moves: aiMoves,
            board: aiBoard,
            turn: nextTurn,
            winner,
          };
        }
      }

      console.log(newMoves);
      return {
        ...state,
        moves: newMoves,
        board: newBoard,
        turn: nextTurn,
        winner,
      };
    }),
    setMode: (mode: GameMode) => patchState(store, (state): GameState => {
      return {
        ...state,
        mode: mode,
      }
    }),
    resetGame: () => patchState(store, (state): GameState => {
      return { ...initialState, started: false, turn: null, mode: state.mode };
    }),
  })),
  withProps(({ board, moves, winner }) => ({
    cellValue: (boardPosition: BoardPosition, position: BoardPosition) => board()[boardPosition]?.[position] ?? null,
    boardState: (boardPosition: BoardPosition): BoardState => {
      const subBoard = board()[boardPosition];
      const singleBoardwinner = getWinner(subBoard);
      const full = isFull(subBoard);
      const m = moves();
      if (singleBoardwinner || full || winner() !== null) {
        return { winner: singleBoardwinner, full, isActive: false };
      }
      const lastMove = m[m.length - 1];
      return { winner: singleBoardwinner, full, isActive: lastMove ? lastMove.position === boardPosition : false };
    },
    isFreeMove: () => {
      const m = moves();
      if (m.length === 0) return true;
      const lastMove = m[m.length - 1];
      const subBoard = board()[lastMove.board];
      return getWinner(subBoard) !== null || isFull(subBoard) || winner() !== null;
    }
  }))
);

const getWinner = (board: Board): Player => {
  const winPatterns: BoardPosition[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

const getOverAllWinner = (boards: { [key in BoardPosition]: Board }): Player => {
  const subBoards = Object.values(boards);
  const subBoardWinners = subBoards.map(getWinner);
  const overallWinner = getWinner({
    1: subBoardWinners[0],
    2: subBoardWinners[1],
    3: subBoardWinners[2],
    4: subBoardWinners[3],
    5: subBoardWinners[4],
    6: subBoardWinners[5],
    7: subBoardWinners[6],
    8: subBoardWinners[7],
    9: subBoardWinners[8],
  });
  return overallWinner;

}

const isFull = (board: Board): boolean => {
  const values = Object.values(board);
  return values.every(value => value !== null);
}

const getPossibleMoves = (board: {
  [key in BoardPosition]: Board;
}, nextBoardPosition: BoardPosition): Move[] => {
  const moves: Move[] = [];
  const nextBoard = board[nextBoardPosition];
  if (isFull(nextBoard) || getWinner(nextBoard) !== null) {
    for (const position in board) {
      const boardPosition = position as unknown as BoardPosition;
      moves.push(...getPossibleMovesForBoard(board[boardPosition], boardPosition));
    }
    return moves;
  }
  return getPossibleMovesForBoard(nextBoard, nextBoardPosition);
}

const getPossibleMovesForBoard = (board: Board, nextBoardPosition: BoardPosition): Move[] => {
  const moves: Move[] = [];
  if (isFull(board) || getWinner(board) !== null) {
    return moves;
  }
  for (const position in board) {
    if (board[position as unknown as BoardPosition] === null) {
      moves.push({ board: nextBoardPosition, position: parseInt(position) as BoardPosition });
    }
  }
  return moves;
}