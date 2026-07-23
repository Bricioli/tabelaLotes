import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { LoteStore } from '../../store/lote.store';
import { rangeValidator } from '../../validators/range.validator';
import { LoteSituacao, situacoesDisponiveis } from '../../models/lote.model';
import { LoteFilter } from '../../models/lote-filter.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  selector: 'app-lote-filter-form',
  templateUrl: './lote-filter-form.component.html',
  styleUrls: ['./lote-filter-form.component.scss'],
})
export class LoteFilterFormComponent implements OnInit {
  readonly situacoes = situacoesDisponiveis;
  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly store: LoteStore) {
    this.form = this.fb.group(
      {
        codigoLote: [''],
        situacao: ['TODAS', Validators.required],
        valorMinimo: [null],
        valorMaximo: [null],
        dataInicio: [null],
        dataFim: [null],
      },
      {
        validators: [
          rangeValidator('valorMinimo', 'valorMaximo'),
          rangeValidator('dataInicio', 'dataFim'),
        ],
      }
    );
  }

  ngOnInit(): void {
    const filtroAtual = this.store.filtroAtual();
    this.form.patchValue({
      codigoLote: filtroAtual.codigoLote ?? '',
      situacao: filtroAtual.situacao ?? 'TODAS',
      valorMinimo: filtroAtual.valorMinimo ?? null,
      valorMaximo: filtroAtual.valorMaximo ?? null,
      dataInicio: filtroAtual.dataInicio ? new Date(filtroAtual.dataInicio) : null,
      dataFim: filtroAtual.dataFim ? new Date(filtroAtual.dataFim) : null,
    });
  }

  search(): void {
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.value as {
      codigoLote?: string;
      situacao: LoteSituacao;
      valorMinimo?: number;
      valorMaximo?: number;
      dataInicio?: Date | null;
      dataFim?: Date | null;
    };

    const nextFilter: LoteFilter = {
      codigoLote: raw.codigoLote?.trim() || undefined,
      situacao: raw.situacao || 'TODAS',
      valorMinimo: raw.valorMinimo ?? undefined,
      valorMaximo: raw.valorMaximo ?? undefined,
      dataInicio: raw.dataInicio ? raw.dataInicio.toISOString().slice(0, 10) : undefined,
      dataFim: raw.dataFim ? raw.dataFim.toISOString().slice(0, 10) : undefined,
    };

    this.store.updateFiltro(nextFilter);
    this.store.loadLotes(1);
  }

  clear(): void {
    this.form.reset({ situacao: 'TODAS' });
    this.store.clearFiltro();
    this.store.loadLotes(1);
  }
}
