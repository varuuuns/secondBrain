import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, TagModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { validCreds } from "./zod";
import argon2 from "argon2";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    validCreds(username, password);

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Existing user, please signin" });
    }

    const hashedPassword = await argon2.hash(password);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ msg: "User created!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

app.post("/api/v1/signin", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) return res.json({ msg: "Please signup" });

    const validPassword = await argon2.verify(existingUser.password, password);
    if (!validPassword) return res.json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD, { expiresIn: "1h" });

    return res.json({ Authorization: token });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { link, type, title, tags } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    const checkLink = await ContentModel.findOne({ link, userId });
    if (checkLink) return res.status(400).json({ msg: `${type} already exists` });

    const checkTags = await TagModel.find({ title: { $in: tags } });
    const existingTags = checkTags.map((t) => t.title);

    const newTags = Array.isArray(tags) ? tags.filter((t: string) => !existingTags.includes(t)) : [];

    const insertedTags = await TagModel.insertMany(newTags.map((title: string) => ({ title })));

    const allTags = [...checkTags, ...insertedTags];
    const tagIds = allTags.map((tag) => tag._id);

    const newContent = await ContentModel.create({
      link,
      type,
      title,
      tags: tagIds,
      userId,
    });

    return res.status(201).json({
      contentId: newContent._id,
      msg: "Content created",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    const temp = await ContentModel.find({ userId }).populate("userId", "_id username");

    return res.json({ Content: temp });
  } catch (err) {
    console.log(err);
    return res.json({ msg: "backend issue probably" });
  }
});

app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { contentId } = req.body;
    const userId = req.userId;

    await ContentModel.deleteOne({ _id: contentId, userId });
    return res.json({ msg: "Content deleted!" });
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { share } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(403).json({ msg: "Forbidden, user not identified" });

    if (share) {
      const existingLink = await LinkModel.findOne({ userId });

      if (existingLink) {
        return res.json({ hash: existingLink.hash });
      }

      const hash = random();
      await LinkModel.create({ hash, userId });

      return res.json({ link: hash, msg: "Link created!" });
    } else {
      await LinkModel.deleteOne({ userId });
      return res.json({ msg: "Link deleted!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response): Promise<any> => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({ hash });
  if (!link) return res.status(411).json({ msg: "Incorrect thing" });

  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  if (!user) return res.status(411).json({ msg: "User not found, this should ideally not happen" });

  return res.json({
    username: user.username,
    content,
  });
});

app.listen(3333, () => {
  console.log("Port 3333");
});
