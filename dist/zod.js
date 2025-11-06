"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCreds = validCreds;
const zod_1 = __importDefault(require("zod"));
function validCreds(username, password) {
    const passwordSchema = zod_1.default.string().min(8, "Min password length in 8").refine((password) => /[A-Z]/.test(password), { message: "Atleast 1 caps letter" }).refine((password) => /[a-z]/.test(password), { message: "Atleast 1 small letter" }).refine((password) => /\d/.test(password), { message: "Atleast 1 number" }).refine((password) => /[@$!%*?&`~#^(){}[\]/+ -]/.test(password), { message: "Atleast 1 special char" });
    const userSchema = zod_1.default.object({
        username: zod_1.default.string().min(3, "Min username lenght is 3").max(13, "Max username length is 13"),
        password: passwordSchema
    });
    const temp = userSchema.safeParse({ username, password });
    if (!temp.success)
        throw new Error(temp.error.issues.map(t => t.message).join(","));
}
