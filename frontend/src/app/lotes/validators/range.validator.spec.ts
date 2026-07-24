import { FormBuilder } from '@angular/forms';
import { rangeValidator } from './range.validator';

describe('rangeValidator', () => {
  const fb = new FormBuilder();

  it('should return error when minimum value is greater than maximum value', () => {
    const form = fb.group(
      {
        valorMinimo: [10],
        valorMaximo: [5],
      },
      { validators: [rangeValidator('valorMinimo', 'valorMaximo')] },
    );

    expect(form.errors).toEqual({
      rangeInvalid: { minField: 'valorMinimo', maxField: 'valorMaximo' },
    });
  });

  it('should return null when numeric range values are valid', () => {
    const form = fb.group(
      {
        idLoteMin: [1],
        idLoteMax: [100],
      },
      { validators: [rangeValidator('idLoteMin', 'idLoteMax')] },
    );

    expect(form.errors).toBeNull();
  });

  it('should return null when date range values are valid', () => {
    const form = fb.group(
      {
        dataEntradaInicio: [new Date('2026-07-20')],
        dataEntradaFim: [new Date('2026-07-21')],
      },
      { validators: [rangeValidator('dataEntradaInicio', 'dataEntradaFim')] },
    );

    expect(form.errors).toBeNull();
  });

  it('should return null when either min or max field is empty', () => {
    const form = fb.group(
      {
        valorMinimo: [null],
        valorMaximo: [100],
      },
      { validators: [rangeValidator('valorMinimo', 'valorMaximo')] },
    );

    expect(form.errors).toBeNull();
  });

  it('should return null when both min and max fields are empty strings', () => {
    const form = fb.group(
      {
        valorMinimo: [''],
        valorMaximo: [''],
      },
      { validators: [rangeValidator('valorMinimo', 'valorMaximo')] },
    );

    expect(form.errors).toBeNull();
  });
});
