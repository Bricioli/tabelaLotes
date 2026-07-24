import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DateTime } from 'luxon';
import { vi } from 'vitest';

import { LoteFilterFormComponent } from './lote-filter-form.component';
import { LoteStore } from '../../store/lote.store';
import { LoteRepository } from '../../services/lote.repository';
import { HttpStateService } from '../../store/http-state.service';
import { LoteFilter } from '../../models/lote-filter.model';

interface FormValueType {
  instituicaoResponsavel?: string | null;
  instituicao?: string | null;
  situacaoLote?: string | null;
  idLoteMin?: number | null;
  idLoteMax?: number | null;
  valorMinimo?: number | null;
  valorMaximo?: number | null;
  dataEntradaInicio?: DateTime | null;
  dataEntradaFim?: DateTime | null;
}

describe('LoteFilterFormComponent', () => {
  let fixture: ComponentFixture<LoteFilterFormComponent>;
  let component: LoteFilterFormComponent;
  let store: LoteStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFilterFormComponent, HttpClientTestingModule],
      providers: [LoteStore, LoteRepository, HttpStateService, provideNoopAnimations()],
    }).compileComponents();

    store = TestBed.inject(LoteStore);
    fixture = TestBed.createComponent(LoteFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the filter component with default valid reactive form', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBe(true);
    const val = component.form.value as FormValueType;
    expect(val.situacaoLote).toBe('TODAS');
  });

  describe('Form Validations', () => {
    it('should mark form invalid when required situacaoLote field is empty', () => {
      const situacaoControl = component.form.get('situacaoLote');
      situacaoControl?.setValue(null);

      expect(component.form.invalid).toBe(true);
      expect(situacaoControl?.errors).toEqual({ required: true });
    });

    it('should invalidate form when idLoteMin is greater than idLoteMax', () => {
      component.form.patchValue({
        idLoteMin: 50,
        idLoteMax: 10,
      });

      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toHaveProperty('rangeInvalid');
    });

    it('should invalidate form when valorMinimo is greater than valorMaximo', () => {
      component.form.patchValue({
        valorMinimo: 1000,
        valorMaximo: 200,
      });

      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toHaveProperty('rangeInvalid');
    });

    it('should invalidate form when dataEntradaInicio is after dataEntradaFim', () => {
      component.form.patchValue({
        dataEntradaInicio: DateTime.fromISO('2026-06-30'),
        dataEntradaFim: DateTime.fromISO('2026-01-01'),
      });

      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toHaveProperty('rangeInvalid');
    });
  });

  describe('Filter Submission and BFF Data Emission', () => {
    it('should not update store or trigger load when form is invalid', () => {
      const updateFiltroSpy = vi.spyOn(store, 'updateFiltro');
      const loadLotesSpy = vi.spyOn(store, 'loadLotes');

      component.form.get('situacaoLote')?.setValue(null);
      component.search();

      expect(updateFiltroSpy).not.toHaveBeenCalled();
      expect(loadLotesSpy).not.toHaveBeenCalled();
    });

    it('should correctly format and emit filter data to store upon search()', () => {
      const updateFiltroSpy = vi.spyOn(store, 'updateFiltro');
      const loadLotesSpy = vi.spyOn(store, 'loadLotes');

      component.form.patchValue({
        instituicaoResponsavel: ' Banco Central ',
        instituicao: ' Caixa ',
        situacaoLote: 'ABERTO',
        idLoteMin: 5,
        idLoteMax: 15,
        valorMinimo: 100,
        valorMaximo: 500,
        dataEntradaInicio: DateTime.fromISO('2026-01-10'),
        dataEntradaFim: DateTime.fromISO('2026-01-20'),
      });

      component.search();

      const expectedFilter: LoteFilter = {
        instituicaoResponsavel: 'Banco Central',
        instituicao: 'Caixa',
        situacaoLote: 'ABERTO',
        idLoteMin: 5,
        idLoteMax: 15,
        valorMinimo: 100,
        valorMaximo: 500,
        dataEntradaInicio: '2026-01-10',
        dataEntradaFim: '2026-01-20',
      };

      expect(updateFiltroSpy).toHaveBeenCalledWith(expectedFilter);
      expect(loadLotesSpy).toHaveBeenCalledWith(1);
    });

    it('should reset form controls and clear filter on clear()', () => {
      const clearFiltroSpy = vi.spyOn(store, 'clearFiltro');
      const loadLotesSpy = vi.spyOn(store, 'loadLotes');

      component.form.patchValue({
        instituicao: 'Banco',
        idLoteMin: 10,
      });

      component.clear();

      const val = component.form.value as FormValueType;
      expect(val.situacaoLote).toBe('TODAS');
      expect(val.instituicao).toBeNull();
      expect(clearFiltroSpy).toHaveBeenCalled();
      expect(loadLotesSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Store Synchronization on Init', () => {
    it('should patch form with active store filter on ngOnInit', () => {
      const filtroMock: LoteFilter = {
        instituicaoResponsavel: 'Secretaria',
        situacaoLote: 'ENVIADO',
        valorMinimo: 200,
        dataEntradaInicio: '2026-03-01',
      };

      vi.spyOn(store, 'filtroAtual').mockReturnValue(filtroMock);

      component.ngOnInit();

      const val = component.form.value as FormValueType;
      expect(val.instituicaoResponsavel).toBe('Secretaria');
      expect(val.situacaoLote).toBe('ENVIADO');
      expect(val.valorMinimo).toBe(200);
      expect(val.dataEntradaInicio?.toISODate()).toBe('2026-03-01');
    });
  });
});
