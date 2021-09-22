"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => (req, res, next) => {
    try {
        return fn(req, res, next);
    }
    catch (error) {
        res.status(500);
        res.json({ msg: error });
        res.end();
        return;
    }
};
