import { Component, computed, inject, Signal } from '@angular/core';
import { GameStateDisplayComponent } from "./game-state-display/game-state-display.component";
import { SingleTicTacToeComponent } from './single-tic-tac-toe/single-tic-tac-toe.component';
import { BoardPosition, GameStore } from './game.store';

@Component({
  selector: 'app-root',
  imports: [GameStateDisplayComponent, SingleTicTacToeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'ultimate-tic-tac-toe';
  readonly gameStore = inject(GameStore)

  readonly isFreeMove: Signal<boolean> = computed(() => {
    this.gameStore.isFreeMove();
    return this.gameStore.isFreeMove();
  })


  

 toPosition = (row: number, col: number): BoardPosition => {
    return (row * 3 + col + 1) as BoardPosition;
  }
}
