"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.TagModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const schema = mongoose_1.default.Schema;
const Types = mongoose_1.default.Types;
mongoose_1.default.connect(config_1.MONGO_URL);
// user schema
const user = new schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const UserModel = mongoose_1.default.model("UserModel", user);
exports.UserModel = UserModel;
// tag schema
const tags = new schema({
    title: { type: String, required: true, unique: true } // is require:true needed
});
const TagModel = mongoose_1.default.model("TagModel", tags);
exports.TagModel = TagModel;
// content schema
const linkTypes = ["article", "audio", "image", "video", "tweet", "blogs"];
const content = new schema({
    link: { type: String, required: true },
    type: { type: String, enum: linkTypes, required: true }, // i should make sure to check and pass these types in frontend
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "TagModel" }], // this i should make user to generate
    userId: { type: Types.ObjectId, ref: "UserModel", required: true },
    authorId: { type: Types.ObjectId, ref: "UserModel", require: true }
});
const ContentModel = mongoose_1.default.model("ContentModel", content);
exports.ContentModel = ContentModel;
// link schema
const link = new schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "UserModel", unique: true }
    // hash:{type:String},
    // userId:{type:Types.ObjectId, ref:"UserModel", required:true, unique:true}
});
const LinkModel = mongoose_1.default.model("LinkModel", link);
exports.LinkModel = LinkModel;
