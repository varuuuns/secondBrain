import z from "zod";

function validCreds(username:string,password:string){
    const passwordSchema = z.string().min(8, "Min password length in 8").refine(
        (password) => /[A-Z]/.test(password), { message: "Atleast 1 caps letter" }
    ).refine(
        (password) => /[a-z]/.test(password), { message: "Atleast 1 small letter" }
    ).refine(
        (password) => /\d/.test(password), { message: "Atleast 1 number" }
    ).refine(
        (password) => /[@$!%*?&`~#^(){}[\]/+ -]/.test(password), { message: "Atleast 1 special char" }
    );

    const userSchema=z.object({
        username:z.string().min(3,"Min username lenght is 3").max(13, "Max username length is 13"),
        password:passwordSchema
    })

    const temp= userSchema.safeParse({username,password});

    if(!temp.success) throw new Error(temp.error.issues.map(t=>t.message).join(","));
}

export { validCreds };