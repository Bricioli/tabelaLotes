import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { LoteStore } from '../../store/lote.store';
import { rangeValidator } from '../../validators/range.validator';
import { LoteSituacao, situacoesDisponiveis } from '../../models/lote.model';
import { LoteFilter } from '../../models/lote-filter.model';

export const BR_LUXON_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

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
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    // Injeta o adapter com os formatos definidos
    provideLuxonDateAdapter(BR_LUXON_FORMATS),
  ],
  selector: 'app-lote-filter-form',
  templateUrl: './lote-filter-form.component.html',
  styleUrls: ['./lote-filter-form.component.scss'],
})
export class LoteFilterFormComponent implements OnInit {
  readonly situacoes = situacoesDisponiveis;
  readonly form: FormGroup;
  panelExpanded = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: LoteStore,
  ) {
    this.form = this.fb.group(
      {
        instituicaoResponsavel: [''],
        instituicao: [''],
        situacaoLote: ['TODAS', (control: AbstractControl) => Validators.required(control)],
        idLoteMin: [null],
        idLoteMax: [null],
        valorMinimo: [null],
        valorMaximo: [null],
        dataEntradaInicio: [null],
        dataEntradaFim: [null],
      },
      {
        validators: [
          rangeValidator('idLoteMin', 'idLoteMax'),
          rangeValidator('valorMinimo', 'valorMaximo'),
          rangeValidator('dataEntradaInicio', 'dataEntradaFim'),
        ],
      },
    );
  }

  ngOnInit(): void {
    const filtroAtual = this.store.filtroAtual();
    this.form.patchValue({
      instituicaoResponsavel: filtroAtual.instituicaoResponsavel ?? '',
      instituicao: filtroAtual.instituicao ?? '',
      situacaoLote: filtroAtual.situacaoLote ?? 'TODAS',
      idLoteMin: filtroAtual.idLoteMin ?? null,
      idLoteMax: filtroAtual.idLoteMax ?? null,
      valorMinimo: filtroAtual.valorMinimo ?? null,
      valorMaximo: filtroAtual.valorMaximo ?? null,
      dataEntradaInicio: filtroAtual.dataEntradaInicio
        ? DateTime.fromISO(filtroAtual.dataEntradaInicio)
        : null,
      dataEntradaFim: filtroAtual.dataEntradaFim
        ? DateTime.fromISO(filtroAtual.dataEntradaFim)
        : null,
    });
  }

  search(): void {
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.value as {
      instituicaoResponsavel?: string;
      instituicao?: string;
      situacaoLote: LoteSituacao;
      idLoteMin?: number;
      idLoteMax?: number;
      valorMinimo?: number;
      valorMaximo?: number;
      dataEntradaInicio?: DateTime | null;
      dataEntradaFim?: DateTime | null;
    };

    const nextFilter: LoteFilter = {
      instituicaoResponsavel: raw.instituicaoResponsavel?.trim() || undefined,
      instituicao: raw.instituicao?.trim() || undefined,
      situacaoLote: raw.situacaoLote || 'TODAS',
      idLoteMin: raw.idLoteMin ?? undefined,
      idLoteMax: raw.idLoteMax ?? undefined,
      valorMinimo: raw.valorMinimo ?? undefined,
      valorMaximo: raw.valorMaximo ?? undefined,
      dataEntradaInicio: raw.dataEntradaInicio
        ? raw.dataEntradaInicio.toString().slice(0, 10)
        : undefined,
      dataEntradaFim: raw.dataEntradaFim ? raw.dataEntradaFim.toString().slice(0, 10) : undefined,
    };

    this.store.updateFiltro(nextFilter);
    this.store.loadLotes(1);
  }

  clear(): void {
    this.form.reset({ situacaoLote: 'TODAS' });
    this.store.clearFiltro();
    this.store.loadLotes(1);
  }

  togglePanel(): void {
    this.panelExpanded = !this.panelExpanded;
  }
}
