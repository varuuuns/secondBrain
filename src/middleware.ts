import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config"; 

function userMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization; 
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ msg: "Authorization header is missing or malformed" });
        return;
    }

    try {
        const token = header.split(" ")[1]; // remove "Bearer"
        const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
        req.userId = decoded.id; // override.d.ts handles typing
        next();
    } catch (err) {
        console.error("JWT error:", err);
        res.status(403).json({ msg: "Invalid or expired token" });
        return;
    }
}

export { userMiddleware };