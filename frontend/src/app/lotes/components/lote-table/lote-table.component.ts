import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { LoteStore } from '../../store/lote.store';
import { Lote } from '../../models/lote.model';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatBadgeModule, MatSortModule],
  selector: 'app-lote-table',
  templateUrl: './lote-table.component.html',
  styleUrls: ['./lote-table.component.scss'],
})
export class LoteTableComponent {
  displayedColumns = [
    'select',
    'codigoLote',
    'dataCriacao',
    'valor',
    'quantidadeLancamentos',
    'usuarioRegistro',
    'usuarioAprovacao',
    'situacao',
    'dataHoraSituacaoLote',
  ];

  constructor(public readonly store: LoteStore) {}

  isSelected(lote: Lote): boolean {
    return this.store.isSelected(lote.id);
  }

  toggleSelection(lote: Lote): void {
    this.store.toggleSelection(lote.id);
  }

  masterToggle(event: Event): void {
    event.stopPropagation();
    this.store.toggleSelectAll();
  }

  isAllSelected(): boolean {
    return this.store.isAllSelected();
  }

  isSomeSelected(): boolean {
    return this.store.hasSomeSelection();
  }

  pageChanged(event: PageEvent): void {
    this.store.loadLotes(event.pageIndex + 1, event.pageSize);
  }

  sortChanged(sortState: Sort): void {
    if (!sortState.active) {
      return;
    }
    const direction = sortState.direction || 'asc';
    this.store.setSort(sortState.active as any, direction);
  }

  getBadgeClass(situacao: string): string {
    return situacao.toLowerCase();
  }
}
