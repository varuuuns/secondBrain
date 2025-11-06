export function random(){
    const options="abcdefghijklmnopqrstuvwxyzABCDEGHIJKLMNOPQRSTUVWXYZ0123456789";
    let hash="";

    for(let i=0;i<15;i++){
        hash+=options[Math.floor(Math.random()*options.length)];
    }

    return hash;
}
