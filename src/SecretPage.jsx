import {useState} from "react";
import {baseUrl} from "./Singletons.js";

const SecretPage = () => {
    const [id, setId] = useState(Number());
    return (<>
        <div className={"container"}>

            <div className={"display-1"}>
                网易云
            </div>
            <section>
                注：只能下VIP歌曲中非付费的歌。<br/>
                究竟怎么判断，你下载看看。如果无法下载除了id输入错误就是付费歌曲。<br/>
                不要再来评论区和私信找我。
            </section>
            <label htmlFor={"id"}>id: </label><input value={id} onChange={(event) => {
            try {
                Number.parseInt(event.target.value)
                setId(Number.parseInt(isNaN(Number.parseInt(event.target.value))  ? 0: event.target.value)
                )

            } catch { /* empty */
            }
        }} id={"id"} type={"text"}/><br/>
            <button className={"btn btn-primary"} onClick={async ()=>{
                window.location.href =  baseUrl + "api/NcmStuff/DownloadMusic?id="+id
            }}>下载</button>
        </div>
    </>)
}
export default SecretPage;