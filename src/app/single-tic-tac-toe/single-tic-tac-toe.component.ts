import { Component, computed, inject, input, Signal } from '@angular/core';
import { BoxComponent } from '../box/box.component';
import { BoardPosition, BoardState, GameStore } from '../game.store';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-single-tic-tac-toe',
  imports: [BoxComponent, NgClass, NgStyle],
  templateUrl: './single-tic-tac-toe.component.html',
  styleUrl: './single-tic-tac-toe.component.css',
  standalone: true
})
export class SingleTicTacToeComponent {

  readonly gameStore = inject(GameStore)
  readonly board = input<BoardPosition>();
  readonly isFreeMove = input<boolean>();

  readonly boardState: Signal<BoardState> = computed(() => {
    const board = this.board();
    if (!board) return { full: false, winner: null };
    // This line makes the computed depend on the store's board signal!
    const boardState = this.gameStore.boardState(board);
    if (!boardState) return { full: false, winner: null };
    return boardState;
  })

  toPosition = (row: number, col: number): BoardPosition => {
    return (row * 3 + col + 1) as BoardPosition;
  }
}
