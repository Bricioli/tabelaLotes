import { Router } from 'express';
import { listLotesHandler, updateLoteHandler, bulkDeleteLotesHandler } from '../controllers/lotes.controller';

const router = Router();

router.get('/', listLotesHandler);
router.put('/:id', updateLoteHandler);
router.post('/bulk-delete', bulkDeleteLotesHandler);

export default router;
