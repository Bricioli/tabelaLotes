import { Request, Response } from 'express';
interface LoteIdParams {
    id: string;
}
type StringQuery = Record<string, string | string[] | undefined>;
export declare const listLotesHandler: (req: Request<Record<string, never>, unknown, unknown, StringQuery>, res: Response) => Response;
export declare const updateLoteHandler: (req: Request<LoteIdParams>, res: Response) => Response;
export declare const bulkDeleteLotesHandler: (req: Request, res: Response) => Response;
export {};
//# sourceMappingURL=lotes.controller.d.ts.map