import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSOWORD } from "./config";

function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const header=req.headers.authorization // headers should be in small letter wierd fucking thing
    if(!header) res.json({msg:"Authorization header is missing"});
    
    try{
        const decoded=jwt.verify(header as string,JWT_PASSOWORD);
        req.userId=(decoded as JwtPayload).id; // erripuku di em chesina error povatle
        next();
    }
    catch(err){
        console.log(err);
        res.json({msg:"Invalid Authorization header kun"});
    }
}

export { userMiddleware };