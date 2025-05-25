import { GameStore, Move } from './game.store';
import { TestBed } from '@angular/core/testing';

describe('GameStore', () => {
    TestBed.configureTestingModule({
        providers: [GameStore],
    });
    let store: any;
    beforeEach(() => {
        store = TestBed.inject(GameStore);
    });

    it('should start with initial state', () => {
        expect(store.started()).toBe(false);
        expect(store.turn()).toBeNull();
        expect(store.moves().length).toBe(0);
    });

    it('should start the game', () => {
        store.startGame();
        expect(store.started()).toBe(true);
        expect(store.turn()).toBe('X');
    });

    it('should make a move and switch turn', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        expect(store.moves().length).toBe(1);
        expect(store.board()[1][1]).toBe('X');
        expect(store.turn()).toBe('O');
    });

    it('should detect a winner in a sub-board', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        store.makeMove({ player: 'O', board: 1, position: 4 });
        store.makeMove({ player: 'X', board: 1, position: 2 });
        store.makeMove({ player: 'O', board: 1, position: 5 });
        store.makeMove({ player: 'X', board: 1, position: 3 });
        const state = store.boardState(1);
        expect(state.winner).toBe('X');
        expect(state.full).toBe(false);
    });

    it('should reset the game', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        store.resetGame();
        expect(store.moves().length).toBe(0);
        expect(store.turn()).toBe(null);
        expect(store.started()).toBe(false);
    });

    it('should detect a full board', () => {
        store.startGame();
        // Fill board 1 with alternating moves, no winner
        const moves: Move[] = [
            { player: 'X', board: 1, position: 1 },
            { player: 'O', board: 1, position: 2 },
            { player: 'X', board: 1, position: 3 },
            { player: 'O', board: 1, position: 4 },
            { player: 'X', board: 1, position: 5 },
            { player: 'O', board: 1, position: 6 },
            { player: 'X', board: 1, position: 7 },
            { player: 'O', board: 1, position: 8 },
            { player: 'X', board: 1, position: 9 },
        ];
        moves.forEach(move => store.makeMove(move));
        const state = store.boardState(1);
        expect(state.full).toBe(true);
    });

    it('should allow free moves when no moves have been made', () => {
        expect(store.isFreeMove()).toBe(true);
    });

    it('should not allow free moves after a move has been made', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        expect(store.isFreeMove()).toBe(false);
    });

    it('should allow free moves after a reset', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        store.resetGame();
        expect(store.isFreeMove()).toBe(true);
    });

    it('should return cell value correctly', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        expect(store.cellValue(1, 1)).toBe('X');
        expect(store.cellValue(1, 2)).toBeNull();
    });

    it('should detect active sub-board correctly', () => {
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        const state = store.boardState(1);
        expect(state.isActive).toBe(true);
        store.makeMove({ player: 'O', board: 1, position: 2 });
        expect(store.boardState(1).isActive).toBe(false);
    });

    it('should detect a winner in the main board', () => {
        store.startGame();
        // Fill all boards with moves leading to a win for 'X'
        store.makeMove({ player: 'X', board: 1, position: 1 });
        store.makeMove({ player: 'X', board: 1, position: 2 });
        store.makeMove({ player: 'X', board: 1, position: 3 });
        expect(store.winner()).toBe(null);

        store.makeMove({ player: 'X', board: 2, position: 1 });
        store.makeMove({ player: 'X', board: 2, position: 2 });
        store.makeMove({ player: 'X', board: 2, position: 3 });
        expect(store.winner()).toBe(null);

        store.makeMove({ player: 'X', board: 3, position: 1 });
        store.makeMove({ player: 'X', board: 3, position: 2 });
        store.makeMove({ player: 'X', board: 3, position: 3 });
        expect(store.winner()).toBe('X');
    });

    it('should get ai move for ai mode', () => {
        store.setMode('ai');
        store.startGame();
        store.makeMove({ player: 'X', board: 1, position: 1 });
        expect(store.moves().length).toBe(1);
    })
});