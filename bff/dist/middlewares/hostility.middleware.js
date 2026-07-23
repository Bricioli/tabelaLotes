"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostilityMiddleware = void 0;
const parseLatencyMs = (value) => {
    const parsed = value ? Number.parseInt(value, 10) : 3000;
    return Number.isNaN(parsed) || parsed < 0 ? 3000 : parsed;
};
const parseFailureRate = (value) => {
    const parsed = value ? Number.parseFloat(value) : 0.2;
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.2;
};
const delay = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
};
const hostilityMiddleware = async (req, res, next) => {
    const latencyMs = parseLatencyMs(process.env.LATENCY_MS);
    const failureRate = parseFailureRate(process.env.FAILURE_RATE);
    await delay(latencyMs);
    if (Math.random() < failureRate) {
        const status = Math.random() < 0.5 ? 500 : 503;
        res.status(status).json({ message: 'Simulated infrastructure failure' });
        return;
    }
    next();
};
exports.hostilityMiddleware = hostilityMiddleware;
//# sourceMappingURL=hostility.middleware.js.map