import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoteActionsBarComponent } from '../../components/lote-actions-bar/lote-actions-bar.component';
import { LoteFilterFormComponent } from '../../components/lote-filter-form/lote-filter-form.component';
import { LoteTableComponent } from '../../components/lote-table/lote-table.component';
import { LoteStore } from '../../store/lote.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LoteFilterFormComponent,
    LoteActionsBarComponent,
    LoteTableComponent,
  ],
  selector: 'app-lote-management-page',
  templateUrl: './lote-management-page.component.html',
  styleUrls: ['./lote-management-page.component.scss'],
})
export class LoteManagementPage implements OnInit {
  constructor(
    public readonly store: LoteStore,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.loadLotes(1);
    }
  }

  retry(): void {
    this.store.loadLotes(this.store.paginaAtual());
  }
}
