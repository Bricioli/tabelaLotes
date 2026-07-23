import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { LoteStore } from '../../store/lote.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  selector: 'app-lote-actions-bar',
  templateUrl: './lote-actions-bar.component.html',
  styleUrls: ['./lote-actions-bar.component.scss'],
})
export class LoteActionsBarComponent {
  constructor(public readonly store: LoteStore) {}

  onAlterar(): void {
    const selected = this.store.itemSelecionado();
    if (!selected) {
      return;
    }
    console.log('Alterar lote', selected);
  }

  onExcluir(): void {
    const selected = this.store.itemSelecionado();
    if (!selected) {
      return;
    }
    console.log('Excluir lote', selected);
  }

  onVisualizar(): void {
    const selected = this.store.itemSelecionado();
    if (!selected) {
      return;
    }
    console.log('Visualizar lote', selected);
  }
}
