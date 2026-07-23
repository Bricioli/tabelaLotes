import { Lote } from '../types/lote.types';
import { createSeedLotes } from '../data/lotes.seed';

export class LotesDataService {
  private lotes: Lote[];

  public constructor() {
    this.lotes = createSeedLotes();
  }

  public getAll(): readonly Lote[] {
    return this.lotes;
  }

  public getById(id: number): Lote | undefined {
    return this.lotes.find((lote: Lote) => lote.id === id);
  }

  public update(
    id: number,
    update: Partial<Pick<Lote, 'valor' | 'situacao' | 'quantidadeItens'>>
  ): Lote | undefined {
    const lote = this.getById(id);
    if (!lote) {
      return undefined;
    }

    if (update.valor !== undefined) {
      lote.valor = update.valor;
    }

    if (update.situacao !== undefined) {
      lote.situacao = update.situacao;
    }

    if (update.quantidadeItens !== undefined) {
      lote.quantidadeItens = update.quantidadeItens;
    }

    return lote;
  }

  public deleteByIds(ids: number[]): number {
    const deletionSet = new Set(ids);
    const originalLength = this.lotes.length;
    this.lotes = this.lotes.filter((lote: Lote) => !deletionSet.has(lote.id));
    return originalLength - this.lotes.length;
  }
}

export const lotesDataService = new LotesDataService();
