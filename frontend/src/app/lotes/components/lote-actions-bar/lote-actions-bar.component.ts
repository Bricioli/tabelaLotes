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

  onConfirmar(): void {
    console.log('Confirmar ação de lote');
  }

  onEnviar(): void {
    console.log('Enviar lote');
  }

  onVisualizarJustificativa(): void {
    console.log('Visualizar justificativa');
  }

  onIncluir(): void {
    console.log('Incluir lote');
  }

  onAlterar(): void {
    if (!this.store.canAlterarOuExcluir()) {
      return;
    }
    console.log('Alterar lote selecionado');
  }

  onExcluir(): void {
    if (!this.store.canAlterarOuExcluir()) {
      return;
    }
    console.log('Excluir lote selecionado');
  }

  onVisualizar(): void {
    if (!this.store.canAlterarOuExcluir()) {
      return;
    }
    console.log('Visualizar lote selecionado');
  }
}
