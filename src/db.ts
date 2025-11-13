import mongoose from "mongoose";
import { MONGO_URL } from "./config";

const schema = mongoose.Schema;
const Types = mongoose.Types;

mongoose.connect(MONGO_URL);

// user schema
const user = new schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    avatar: { type: Types.ObjectId, ref: "avatars.files", default: null }, // GridFS file ID
    googleId: { type: String, unique: true, sparse: true },
});
const UserModel = mongoose.model("UserModel", user);

// tag schema
const tags = new schema({
    title: { type: String, required: true, unique: true },
});
const TagModel = mongoose.model("TagModel", tags);

// content schema
const linkTypes = ["article", "audio", "image", "video", "tweet", "blogs"];
const content = new schema({
    link: { type: String, required: true },
    type: { type: String, enum: linkTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "TagModel" }],
    userId: { type: Types.ObjectId, ref: "UserModel", required: true },
    // authorId: { type: Types.ObjectId, ref: "UserModel", required: true },
});
const ContentModel = mongoose.model("ContentModel", content);

// link schema
const link = new schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "UserModel", unique: true },
});
const LinkModel = mongoose.model("LinkModel", link);

export { UserModel, TagModel, ContentModel, LinkModel };