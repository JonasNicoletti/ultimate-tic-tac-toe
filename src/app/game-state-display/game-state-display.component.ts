import { Component, inject, signal } from '@angular/core';
import { GameMode, GameStore } from '../game.store';

@Component({
  selector: 'app-game-state-display',
  imports: [],
  templateUrl: './game-state-display.component.html',
  styleUrl: './game-state-display.component.css',
  standalone: true
})
export class GameStateDisplayComponent {
  readonly gameStore = inject(GameStore);
  mode = signal<GameMode>('human');


setMode(mode: GameMode) {
  this.mode.set(mode);
  this.gameStore.setMode(mode);
}
}
