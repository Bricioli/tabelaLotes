"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lotes_controller_1 = require("../controllers/lotes.controller");
const router = (0, express_1.Router)();
router.get('/', lotes_controller_1.listLotesHandler);
router.put('/:id', lotes_controller_1.updateLoteHandler);
router.post('/bulk-delete', lotes_controller_1.bulkDeleteLotesHandler);
exports.default = router;
//# sourceMappingURL=lotes.routes.js.map