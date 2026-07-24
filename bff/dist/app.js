"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const lotes_routes_1 = __importDefault(require("./routes/lotes.routes"));
const hostility_middleware_1 = require("./middlewares/hostility.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', hostility_middleware_1.hostilityMiddleware);
app.use('/api/v1/lotes', lotes_routes_1.default);
app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});
exports.default = app;
//# sourceMappingURL=app.js.map