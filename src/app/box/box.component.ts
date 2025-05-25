import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { BoardPosition, GameStore } from '../game.store';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-box',
  imports: [NgStyle],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {


  readonly gameStore = inject(GameStore)
  readonly board = input<BoardPosition>();
  readonly position = input<BoardPosition>();
  readonly isActive = input<boolean>();

  readonly value = computed(() => {
    const board = this.board();
    const position = this.position();
    if (!board || !position) return null;
    // This line makes the computed depend on the store's board signal!
    const cellValue = this.gameStore.cellValue(board, position);
    return cellValue;
  });

  setValue(): void {
    if (this.value() || !this.gameStore.started()) {
      return;
    }

    this.gameStore.makeMove({
      player: this.gameStore.turn()!,
      board: this.board()!,
      position: this.position()!
    }
    );
  }

}
