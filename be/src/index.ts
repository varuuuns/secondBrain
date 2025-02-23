import express from "express"; // require syntax ignores types so i should install @types/express 
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, TagModel, UserModel } from "./db";
import { JWT_PASSOWORD } from "./config";
import { validCreds } from "./zod";
import  argon2  from "argon2";
import { Request, Response } from "express";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app=express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async(req:Request,res:Response): Promise<any> =>{ // Promise<Request> isn't working so used Promise<any>
    try{
        const { username, password}=req.body;

        validCreds(username,password);

        const existingUser=await UserModel.findOne({username});
        if(existingUser) return res.status(400).json({msg:"existing user please signin"});
        
        const hashedPassowrd=await argon2.hash(password);

        const temp=await UserModel.create({
            username:username,
            password:hashedPassowrd
        })
        
        return res.status(201).json({msg:"User created!"});
    }
    catch(err){ 
        console.log(err);
        return res.status(400).json({error:err});
    }
})

app.post("/api/v1/signin",async (req:Request,res:Response):Promise<any> =>{
    try{
        const { username, password }=req.body;

        const existingUser=await UserModel.findOne({username:username});
        if(!existingUser) return res.json({msg:"Please signup"});

        const validPassword=await argon2.verify(existingUser.password,password);
        if(!validPassword) return res.json({mag:"Incorrect password"});

        const token=jwt.sign({ id:existingUser._id }, JWT_PASSOWORD, { expiresIn:"1h" });

        res.json({Authorization:token});
    }
    catch(err){
        console.log(err);
        res.status(400).json({error:err});
    }
})

app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<any> =>{
    try {
        const { link, type, title, tags } = req.body;
        const userId = req.userId;
        
        if (!userId) return res.status(401).json({ msg: "Unauthorized" });

        const checkLink = await ContentModel.findOne({ link, userId });
        if (checkLink) return res.status(400).json({ msg: `${type} already exists` });

        const checkTags = await TagModel.find({ title: { $in: tags } });
        const existingTags = checkTags.map((t) => t.title);

        // newTags was initially passed as string and caught as an array
        const newTags = Array.isArray(tags) ? tags.filter((t: string) => !existingTags.includes(t)):[];

        const insertedTags = await TagModel.insertMany(newTags.map((title: string) => ({ title })));

        const allTags = [...checkTags, ...insertedTags];
        const tagIds = allTags.map(tag => tag._id); 

        const newContent=await ContentModel.create({
            link:link,
            type:type,
            title:title,
            tags: tagIds,
            userId:userId,
        });

        res.status(201).json({ 
            contentId:newContent._id,
            msg: "Content created"
         });
    } 
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/v1/content", userMiddleware, async (req:Request,res:Response):Promise<any> =>{
    try{
        const userId=req.userId;

        const temp=await ContentModel.find({userId:userId}).populate("userId","_id username") ;

        res.json({Content:temp});
    }
    catch(err){
        console.log(err);
        res.json({msg:"backend issue probably"});
    }

})

app.delete("/api/v1/content", userMiddleware, async (req:Request,res:Response):Promise<any> =>{
    try{
        const { contentId }=req.body;
        const userId=req.userId;

        await ContentModel.deleteOne({_id:contentId,userId:userId});
        res.json({msg:"Cont deleted!!!"});
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
})

app.post("/api/v1/brain/share", userMiddleware, async (req,res):Promise<any> =>{
    try{
        const { share }=req.body;
        if(share){
            const existingLink=await LinkModel.findOne({ userId:req.userId });

            if(existingLink){
                return res.json({ hash:existingLink.hash });
            }

            const hash=random();
            await LinkModel.create({
                hash:hash,
                userId:req.userId
            })

            res.json({ 
                link:hash,
                msg:"Link created!!"
            });
        }
        else{
            await LinkModel.deleteOne({ userId:req.userId });
            res.json({ msg:"Link deleted!1!" });
        }
    }
    catch(err){
        console.log(err);
        res.json({ error:err });
    }
})

app.get("/api/v1/brain/:shareLink",async (req,res): Promise<any>=>{
    const hash=req.params.shareLink;

    const link=await LinkModel.findOne({ hash:hash });

    if(!link) return res.status(411).json({ msg:"Incorrect thing" });
    
    const content=await ContentModel.find({ userId:link.userId });

    const user=await UserModel.findOne({ _id: link.userId });

    if(!user) return res.status(411).json({ msg: "user not found, error should ideally not happen"});

    res.json({
        username: user.username,
        content: content
    })
})

app.listen(3333,()=>{console.log("Port 3333")});