"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const zod_1 = require("./zod");
const argon2_1 = __importDefault(require("argon2"));
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        (0, zod_1.validCreds)(username, password);
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "Existing user, please signin" });
        }
        const hashedPassword = yield argon2_1.default.hash(password);
        yield db_1.UserModel.create({ username, password: hashedPassword });
        return res.status(201).json({ msg: "User created!" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (!existingUser)
            return res.json({ msg: "Please signup" });
        const validPassword = yield argon2_1.default.verify(existingUser.password, password);
        if (!validPassword)
            return res.json({ msg: "Incorrect password" });
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_PASSWORD, { expiresIn: "1h" });
        return res.json({ token });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title, tags } = req.body;
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ msg: "Unauthorized" });
        const checkLink = yield db_1.ContentModel.findOne({ link, userId });
        if (checkLink)
            return res.status(400).json({ msg: `${type} already exists` });
        const checkTags = yield db_1.TagModel.find({ title: { $in: tags } });
        const existingTags = checkTags.map((t) => t.title);
        const newTags = Array.isArray(tags) ? tags.filter((t) => !existingTags.includes(t)) : [];
        const insertedTags = yield db_1.TagModel.insertMany(newTags.map((title) => ({ title })));
        const allTags = [...checkTags, ...insertedTags];
        const tagIds = allTags.map((tag) => tag._id);
        const newContent = yield db_1.ContentModel.create({ link, type, title, tags: tagIds, userId });
        return res.status(201).json({ contentId: newContent._id, msg: "Content created" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const temp = yield db_1.ContentModel.find({ userId }).populate("userId", "_id username");
        return res.json({ Content: temp });
    }
    catch (err) {
        console.log(err);
        return res.json({ msg: "backend issue probably" });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.body;
        const userId = req.userId;
        yield db_1.ContentModel.deleteOne({ _id: contentId, userId });
        return res.json({ msg: "Content deleted!" });
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        const userId = req.userId;
        if (!userId)
            return res.status(403).json({ msg: "Forbidden, user not identified" });
        if (share) {
            const existingLink = yield db_1.LinkModel.findOne({ userId });
            if (existingLink)
                return res.json({ hash: existingLink.hash });
            const hash = (0, utils_1.random)();
            yield db_1.LinkModel.create({ hash, userId });
            return res.json({ link: hash, msg: "Link created!" });
        }
        else {
            yield db_1.LinkModel.deleteOne({ userId });
            return res.json({ msg: "Link deleted!" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link)
        return res.status(411).json({ msg: "Incorrect thing" });
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user)
        return res.status(411).json({ msg: "User not found, this should ideally not happen" });
    return res.json({ username: user.username, content });
}));
app.get("/api/v1/user", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield db_1.UserModel.findById(userId).select("username email avatar createdAt");
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        return res.json(user);
    }
    catch (err) {
        console.error("GET /api/v1/user error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
}));
// Update profile (username, email, avatar)
app.put("/api/v1/user/update", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { username, email, avatar } = req.body;
        // Build update object only with provided fields
        const update = {};
        if (username !== undefined)
            update.username = username;
        if (email !== undefined)
            update.email = email;
        if (avatar !== undefined)
            update.avatar = avatar;
        console.log("Updating user", userId, update); // helpful for debugging
        const updated = yield db_1.UserModel.findByIdAndUpdate(userId, update, { new: true }).select("username email avatar createdAt");
        if (!updated)
            return res.status(404).json({ msg: "User not found" });
        return res.json(updated); // return updated user
    }
    catch (err) {
        console.error("PUT /api/v1/user/update error:", err);
        // handle unique index conflict (e.g. username/email already used)
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Username or email already in use" });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}));
app.delete("/api/v1/user/delete", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        yield db_1.UserModel.deleteOne({ _id: userId });
        yield db_1.ContentModel.deleteMany({ userId });
        yield db_1.LinkModel.deleteOne({ userId });
        return res.json({ msg: "Account deleted" });
    }
    catch (err) {
        console.error("DELETE /api/v1/user/delete error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
}));
app.get("/api/v1/content/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        let filter = {};
        if (type) {
            filter.type = type; // only filter if type is passed
        }
        const contents = yield db_1.ContentModel.find(filter).populate("userId tags");
        res.json(contents);
    }
    catch (err) {
        res.status(500).json({ msg: "Failed to fetch contents" });
    }
}));
app.listen(3333, () => {
    console.log("Port 3333");
});
