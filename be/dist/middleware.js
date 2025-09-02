"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = userMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function userMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        res.status(401).json({ msg: "Authorization header is missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_PASSWORD);
        req.userId = decoded.id; // override.d.ts handles typing
        next();
    }
    catch (err) {
        console.error("JWT error:", err);
        res.status(403).json({ msg: "Invalid or expired token" });
        return;
    }
}
