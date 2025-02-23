"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = userMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function userMiddleware(req, res, next) {
    const header = req.headers.authorization; // headers should be in small letter wierd fucking thing
    if (!header)
        res.json({ msg: "Authorization header is missing" });
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_PASSOWORD);
        req.userId = decoded.id; // erripuku di em chesina error povatle
        next();
    }
    catch (err) {
        console.log(err);
        res.json({ msg: "Invalid Authorization header kun" });
    }
}
