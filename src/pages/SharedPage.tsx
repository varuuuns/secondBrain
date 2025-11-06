import { Card } from "../components/Card"

interface SharedPageProps{
    username:string,
    content: any // but this is json
}

export function SharedPage(props:SharedPageProps){
    return(
        <>
            <h1 className="tet-3xl p-4">{props.username}</h1>
            <div className="flex gap-4 flex-wrap">
                {props.content.map(({_id,title,link,type}:any)=><Card contentId={_id} title={title} link={link}  type={type} />)}
            </div>
        </>
    )
}