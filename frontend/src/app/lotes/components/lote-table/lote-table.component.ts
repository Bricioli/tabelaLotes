import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { effect } from '@angular/core';

import { LoteStore } from '../../store/lote.store';
import { Lote } from '../../models/lote.model';
@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatBadgeModule],
  selector: 'app-lote-table',
  templateUrl: './lote-table.component.html',
  styleUrls: ['./lote-table.component.scss'],
})
export class LoteTableComponent {
  displayedColumns = ['select', 'codigoLote', 'dataCriacao', 'valor', 'quantidadeItens', 'situacao'];
  dataSource = new MatTableDataSource<Lote>([]);
  private readonly updateDataSource = effect(() => {
    this.dataSource.data = this.store.lotes();
  });

  constructor(public readonly store: LoteStore) {}

  isSelected(lote: Lote): boolean {
    return this.store.itemSelecionado()?.id === lote.id;
  }

  toggleSelection(lote: Lote): void {
    this.store.selectItem(lote);
  }

  pageChanged(event: PageEvent): void {
    this.store.loadLotes(event.pageIndex + 1);
  }

  getBadgeClass(situacao: string): string {
    return situacao;
  }
}
